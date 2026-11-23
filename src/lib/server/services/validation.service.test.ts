import { describe, expect, it } from 'vitest';
import { validateOrderExtraction } from './validation.service.ts';

describe('validateOrderExtraction', () => {
	it('akzeptiert eine vollständige, gültige Bestellung', () => {
		const result = validateOrderExtraction({
			kundenname: 'Muster GmbH',
			artikelnummer: 'ART-10042',
			menge: 10,
			bestelldatum: '2026-11-23',
			lieferadresse: 'Musterstraße 1, 10115 Berlin'
		});

		expect(result.valid).toBe(true);
		if (result.valid) {
			expect(result.data.kundenname).toBe('Muster GmbH');
			expect(result.data.menge).toBe(10);
		}
	});

	it('meldet Fehler bei leerem Kundennamen und leerer Artikelnummer', () => {
		const result = validateOrderExtraction({
			kundenname: '   ',
			artikelnummer: '',
			menge: 5,
			bestelldatum: '2026-11-23',
			lieferadresse: null
		});

		expect(result.valid).toBe(false);
		if (!result.valid) {
			expect(result.errors.length).toBeGreaterThanOrEqual(2);
			expect(result.fehlergrund).toContain('Validierungsfehler');
		}
	});

	it('meldet Fehler bei menge <= 0 und ungültigem Datum', () => {
		const result = validateOrderExtraction({
			kundenname: 'Muster GmbH',
			artikelnummer: 'ART-10042',
			menge: 0,
			bestelldatum: '23.11.2026', // Kein ISO-Format
			lieferadresse: null
		});

		expect(result.valid).toBe(false);
		if (!result.valid) {
			expect(result.errors).toContain('Bestellmenge muss größer als 0 sein.');
			expect(result.errors).toContain('Bestelldatum muss im Format YYYY-MM-DD vorliegen.');
		}
	});
});
