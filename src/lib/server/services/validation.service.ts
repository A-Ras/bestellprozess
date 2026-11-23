import { extractedOrderSchema, type ValidatedOrderData } from '#lib/server/schemas/order.schema.ts';
import type { OrderExtraction } from '#lib/types/order.ts';

export type ValidationResult =
	| { valid: true; data: ValidatedOrderData }
	| { valid: false; errors: string[]; fehlergrund: string };

export function validateOrderExtraction(input: OrderExtraction): ValidationResult {
	const parsed = extractedOrderSchema.safeParse(input);

	if (!parsed.success) {
		const errors = parsed.error.issues.map((issue) => issue.message);
		return {
			valid: false,
			errors,
			fehlergrund: `Validierungsfehler: ${errors.join(' ')}`
		};
	}

	return {
		valid: true,
		data: parsed.data
	};
}
