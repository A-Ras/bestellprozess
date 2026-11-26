import type { Database, Json } from './database.ts';

export const ORDER_STATUSES = ['neu', 'in_pruefung', 'fehlerhaft', 'uebermittelt'] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number]; // why number? because we want the type to be the values of the array, not the indices

export interface OrderExtraction {
	kundenname: string | null;
	artikelnummer: string | null;
	menge: number | null;
	bestelldatum: string | null; // ISO YYYY-MM-DD
	lieferadresse: string | null;
	requiresManualReview?: boolean;
	quelle?: string;
}

export type Order = Database['public']['Tables']['bestellungen']['Row'];
export type OrderJson = Json;

export interface DashboardKpis {
	gesamt: number;
	heute: number;
	fehlerhaft: number;
	uebermittelt: number;
	inPruefung: number;
	fehlerquoteProzent: number;
}
