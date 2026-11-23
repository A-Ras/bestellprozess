import * as z from 'zod';
import { stubErpService } from '#lib/server/services/erp.service.ts';
import { mockExtractionService } from '#lib/server/services/extraction.service.ts';
import { createOrder, updateOrder } from '#lib/server/services/order.service.ts';
import { validateOrderExtraction } from '#lib/server/services/validation.service.ts';
import type { Json } from '#lib/types/database.ts';
import type { RequestHandler } from './$types';

const triggerSchema = z.object({
	mode: z.enum(['random', 'simulate_error', 'simulate_review']).optional()
});

export const POST: RequestHandler = async ({ request, locals }) => {
	const { session } = await locals.safeGetSession();
	if (!session) {
		return Response.json({ error: 'Nicht authentifiziert' }, { status: 401 });
	}

	let mode: 'random' | 'simulate_error' | 'simulate_review' = 'random';
	const rawBody = await request.text();
	if (rawBody.trim()) {
		try {
			const parsedJson: unknown = JSON.parse(rawBody);
			const parsed = triggerSchema.safeParse(parsedJson);
			if (parsed.success && parsed.data.mode) {
				mode = parsed.data.mode;
			}
		} catch {
			return Response.json({ error: 'Ungültiges JSON im Request-Body' }, { status: 400 });
		}
	}

	// 1. KI-Extraktion (Mock)
	const extractInput = mode === 'random' ? undefined : mode;
	const extracted = await mockExtractionService.extract(extractInput);
	const rawSnapshot: Json = {
		kundenname: extracted.kundenname,
		artikelnummer: extracted.artikelnummer,
		menge: extracted.menge,
		bestelldatum: extracted.bestelldatum,
		lieferadresse: extracted.lieferadresse,
		quelle: extracted.quelle ?? 'mock_trigger'
	};

	// 2. Validierung (Zod)
	const validation = validateOrderExtraction(extracted);

	if (!validation.valid) {
		const failedOrder = await createOrder({
			kundenname: extracted.kundenname,
			artikelnummer: extracted.artikelnummer,
			menge: extracted.menge,
			bestelldatum: null,
			lieferadresse: extracted.lieferadresse,
			status: 'fehlerhaft',
			fehlergrund: validation.fehlergrund,
			rohdaten: rawSnapshot
		});

		return Response.json({ order: failedOrder }, { status: 201 });
	}

	// 3. Gültige Bestellung speichern (initial: in_pruefung)
	const savedOrder = await createOrder({
		kundenname: validation.data.kundenname,
		artikelnummer: validation.data.artikelnummer,
		menge: validation.data.menge,
		bestelldatum: validation.data.bestelldatum,
		lieferadresse: validation.data.lieferadresse ?? null,
		status: 'in_pruefung',
		rohdaten: rawSnapshot
	});

	// Bei Großbestellungen bleibt sie zur manuellen Prüfung auf 'in_pruefung'
	if (extracted.requiresManualReview) {
		return Response.json({ order: savedOrder }, { status: 201 });
	}

	// 4. ERP-Übergabe (Stub)
	const erpResult = await stubErpService.submit(savedOrder.id, validation.data);

	if (!erpResult.success) {
		const erpFailedOrder = await updateOrder(savedOrder.id, {
			status: 'fehlerhaft',
			fehlergrund: erpResult.errorMessage ?? 'ERP-Übergabe fehlgeschlagen.'
		});
		return Response.json({ order: erpFailedOrder }, { status: 201 });
	}

	const completedOrder = await updateOrder(savedOrder.id, {
		status: 'uebermittelt',
		erp_id: erpResult.erpId ?? null
	});

	return Response.json({ order: completedOrder }, { status: 201 });
};
