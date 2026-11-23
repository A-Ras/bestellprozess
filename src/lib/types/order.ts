export const ORDER_STATUSES = ['neu', 'in_pruefung', 'fehlerhaft', 'uebermittelt'] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface OrderExtraction {
	kundenname: string | null;
	artikelnummer: string | null;
	menge: number | null;
	bestelldatum: string | null; // ISO YYYY-MM-DD
	lieferadresse: string | null;
	requiresManualReview?: boolean;
	quelle?: string;
}

export interface Order {
	id: string;
	kundenname: string | null;
	artikelnummer: string | null;
	menge: number | null;
	bestelldatum: string | null;
	lieferadresse: string | null;
	status: OrderStatus;
	fehlergrund: string | null;
	erp_id: string | null;
	rohdaten: Record<string, unknown> | null;
	erstellt_am: string;
	aktualisiert_am: string;
}

export interface DashboardKpis {
	gesamt: number;
	heute: number;
	fehlerhaft: number;
	uebermittelt: number;
	inPruefung: number;
	fehlerquoteProzent: number;
}
