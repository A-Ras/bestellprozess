import * as z from 'zod';
import { ORDER_STATUSES } from '#lib/types/order.ts';

export const extractedOrderSchema = z.object({
	kundenname: z
		.string({ error: 'Kundenname fehlt oder ist ungültig.' })
		.trim()
		.min(1, { error: 'Kundenname darf nicht leer sein.' }),
	artikelnummer: z
		.string({ error: 'Artikelnummer fehlt oder ist ungültig.' })
		.trim()
		.min(1, { error: 'Artikelnummer darf nicht leer sein.' }),
	menge: z
		.number({ error: 'Bestellmenge muss eine Zahl sein.' })
		.int({ error: 'Bestellmenge muss eine ganze Zahl sein.' })
		.positive({ error: 'Bestellmenge muss größer als 0 sein.' }),
	bestelldatum: z.iso.date({
		error: 'Bestelldatum muss im Format YYYY-MM-DD vorliegen.'
	}),
	lieferadresse: z.string().trim().nullable().optional()
});

export type ValidatedOrderData = z.infer<typeof extractedOrderSchema>;

export const orderUpdateSchema = z
	.object({
		kundenname: z.string().trim().min(1).optional(),
		artikelnummer: z.string().trim().min(1).optional(),
		menge: z.number().int().positive().optional(),
		bestelldatum: z.iso.date().optional(),
		lieferadresse: z.string().trim().nullable().optional(),
		status: z.enum(ORDER_STATUSES).optional(),
		action: z.enum(['save', 'retry_erp']).optional()
	})
	.strict();
