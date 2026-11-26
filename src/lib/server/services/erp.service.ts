import type { ValidatedOrderData } from '#lib/server/schemas/order.schema.ts';

export interface ErpSubmissionResult {
	success: boolean;
	erpId?: string;
	errorMessage?: string;
}

export interface ErpService {
	submit(orderId: string, data: ValidatedOrderData): Promise<ErpSubmissionResult>;
}

/**
 * ERP-Stub für den Proof of Concept.
 * TODO: Echte ERP-Schnittstelle anbinden (REST/SOAP, Feld-Mapping, OAuth2/API-Key, Retry-Policy mit Backoff).
 */
export const stubErpService: ErpService = {
	async submit(orderId: string, data: ValidatedOrderData): Promise<ErpSubmissionResult> {
		// Kurze Netzwerk-/Verarbeitungszeit simulieren
		await new Promise((resolve) => setTimeout(resolve, 150));

		if (!data.artikelnummer.trim()) {
			return {
				success: false,
				errorMessage: 'ERP-Übergabe fehlgeschlagen: Artikelnummer fehlt.'
			};
		}

		const shortRef = orderId.slice(0, 6).toUpperCase(); // Kurze Referenz aus der Bestell-ID generieren
		const year = new Date().getFullYear();

		return {
			success: true,
			erpId: `ERP-${year}-${shortRef}`
		};
	}
};
