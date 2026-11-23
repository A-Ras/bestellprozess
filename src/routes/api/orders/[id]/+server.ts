import { orderUpdateSchema } from '#lib/server/schemas/order.schema.ts';
import { stubErpService } from '#lib/server/services/erp.service.ts';
import { getOrderById, updateOrder } from '#lib/server/services/order.service.ts';
import { validateOrderExtraction } from '#lib/server/services/validation.service.ts';
import type { RequestHandler } from './$types';

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
	const { session } = await locals.safeGetSession();
	if (!session) {
		return Response.json({ error: 'Nicht authentifiziert' }, { status: 401 });
	}

	const existing = await getOrderById(locals.supabase, params.id);
	if (!existing) {
		return Response.json({ error: 'Bestellung nicht gefunden' }, { status: 404 });
	}

	let parsedBody: ReturnType<typeof orderUpdateSchema.safeParse>;
	try {
		const rawJson: unknown = JSON.parse(await request.text());
		parsedBody = orderUpdateSchema.safeParse(rawJson);
	} catch {
		return Response.json({ error: 'Ungültiger JSON-Body' }, { status: 400 });
	}

	if (!parsedBody.success) {
		return Response.json(
			{
				error: 'Ungültige Eingabedaten',
				details: parsedBody.error.issues.map((i) => i.message)
			},
			{ status: 400 }
		);
	}

	const input = parsedBody.data;
	const merged = {
		kundenname: input.kundenname ?? existing.kundenname,
		artikelnummer: input.artikelnummer ?? existing.artikelnummer,
		menge: input.menge ?? existing.menge,
		bestelldatum: input.bestelldatum ?? existing.bestelldatum,
		lieferadresse: input.lieferadresse !== undefined ? input.lieferadresse : existing.lieferadresse
	};

	const validation = validateOrderExtraction(merged);

	if (!validation.valid) {
		const invalidOrder = await updateOrder(existing.id, {
			...merged,
			bestelldatum: null,
			status: 'fehlerhaft',
			fehlergrund: validation.fehlergrund
		});
		return Response.json({ order: invalidOrder }, { status: 200 });
	}

	if (input.action === 'retry_erp') {
		const erpResult = await stubErpService.submit(existing.id, validation.data);
		if (!erpResult.success) {
			const erpFailed = await updateOrder(existing.id, {
				...validation.data,
				status: 'fehlerhaft',
				fehlergrund: erpResult.errorMessage ?? 'ERP-Übergabe fehlgeschlagen.'
			});
			return Response.json({ order: erpFailed }, { status: 200 });
		}

		const transmitted = await updateOrder(existing.id, {
			...validation.data,
			status: 'uebermittelt',
			erp_id: erpResult.erpId ?? null
		});
		return Response.json({ order: transmitted }, { status: 200 });
	}

	const targetStatus = input.status && input.status !== 'fehlerhaft' ? input.status : 'in_pruefung';

	const updated = await updateOrder(existing.id, {
		...validation.data,
		status: targetStatus
	});

	return Response.json({ order: updated }, { status: 200 });
};
