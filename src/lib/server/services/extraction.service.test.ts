import { describe, expect, it } from 'vitest';
import { mockExtractionService } from './extraction.service.ts';

describe('mockExtractionService', () => {
	it('liefert im Standardfall plausible Bestellfelder', async () => {
		const data = await mockExtractionService.extract('simulate_review');

		expect(data.kundenname).toBeTruthy();
		expect(data.artikelnummer).toBeTruthy();
		expect(typeof data.menge).toBe('number');
		expect(data.menge).toBeGreaterThan(0);
		expect(data.bestelldatum).toMatch(/^\d{4}-\d{2}-\d{2}$/);
	});

	it('kann gezielt fehlerhafte Extraktionen für den Fehler-Workflow erzeugen', async () => {
		const data = await mockExtractionService.extract('simulate_error');
		const hasInvalidField =
			!data.artikelnummer || (data.menge ?? 0) <= 0 || data.bestelldatum === 'ungueltiges-datum';

		expect(hasInvalidField).toBe(true);
	});
});
