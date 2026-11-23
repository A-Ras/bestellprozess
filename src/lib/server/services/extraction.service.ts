import type { OrderExtraction } from '#lib/types/order.ts';

export interface ExtractionService {
	extract(input?: string): Promise<OrderExtraction>;
}

const DEMO_CUSTOMERS = [
	'Autohaus Becker GmbH',
	'Rheinmetall Zulieferer AG',
	'Elektro Weber & Söhne',
	'Holzbau Schwarzwald KG',
	'Logistikzentrum Mitte GmbH'
];

const DEMO_ARTICLES = ['ART-10042', 'ART-20410', 'ART-30900', 'ART-40115', 'ART-50820'];

const DEMO_ADDRESSES = [
	'Benzstraße 22, 70469 Stuttgart',
	'Am Güterbahnhof 9, 50825 Köln',
	'Gewerbegebiet Nord 4, 90425 Nürnberg',
	'Lindenallee 18, 22303 Hamburg'
];

function pickRandom<T>(items: T[]): T {
	return items[Math.floor(Math.random() * items.length)];
}

/**
 * Mock-Implementierung für den Proof of Concept.
 * Kann später ohne Änderung an den Aufrufern durch z. B.
 * `foundryExtractionService` (Microsoft Foundry Document Intelligence) ersetzt werden.
 */
export const mockExtractionService: ExtractionService = {
	async extract(input?: string): Promise<OrderExtraction> {
		await Promise.resolve();
		const today = new Date().toISOString().slice(0, 10);
		const roll = Math.random();

		// ~20% Chance auf fehlerhafte Extraktion (z. B. schlecht lesbares Scan-PDF)
		if (input === 'simulate_error' || (input === undefined && roll < 0.2)) {
			const errorType = Math.random();
			if (errorType < 0.5) {
				return {
					kundenname: pickRandom(DEMO_CUSTOMERS),
					artikelnummer: pickRandom(DEMO_ARTICLES),
					menge: 0, // Ungültige Menge
					bestelldatum: today,
					lieferadresse: pickRandom(DEMO_ADDRESSES),
					quelle: 'pdf_anhang_scan'
				};
			}

			return {
				kundenname: pickRandom(DEMO_CUSTOMERS),
				artikelnummer: '', // Fehlende Artikelnummer
				menge: 5,
				bestelldatum: 'ungueltiges-datum',
				lieferadresse: null,
				quelle: 'email_freitext'
			};
		}

		// ~25% Chance auf Sonderprüfung (z. B. ungewöhnlich hohe Bestellmenge)
		const isLargeOrder = input === 'simulate_review' || (input === undefined && roll < 0.45);

		return {
			kundenname: pickRandom(DEMO_CUSTOMERS),
			artikelnummer: pickRandom(DEMO_ARTICLES),
			menge: isLargeOrder
				? 120 + Math.floor(Math.random() * 100)
				: 1 + Math.floor(Math.random() * 25),
			bestelldatum: today,
			lieferadresse: pickRandom(DEMO_ADDRESSES),
			requiresManualReview: isLargeOrder,
			quelle: Math.random() < 0.75 ? 'pdf_anhang' : 'email_body'
		};
	}
};
