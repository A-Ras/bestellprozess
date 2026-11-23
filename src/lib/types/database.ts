import type { SupabaseClient } from '@supabase/supabase-js';

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type OrderStatusDb = 'neu' | 'in_pruefung' | 'fehlerhaft' | 'uebermittelt';

export type Database = {
	public: {
		Tables: {
			bestellungen: {
				Row: {
					id: string;
					kundenname: string | null;
					artikelnummer: string | null;
					menge: number | null;
					bestelldatum: string | null;
					lieferadresse: string | null;
					status: OrderStatusDb;
					fehlergrund: string | null;
					erp_id: string | null;
					rohdaten: Json | null;
					erstellt_am: string;
					aktualisiert_am: string;
				};
				Insert: {
					id?: string;
					kundenname?: string | null;
					artikelnummer?: string | null;
					menge?: number | null;
					bestelldatum?: string | null;
					lieferadresse?: string | null;
					status?: OrderStatusDb;
					fehlergrund?: string | null;
					erp_id?: string | null;
					rohdaten?: Json | null;
					erstellt_am?: string;
					aktualisiert_am?: string;
				};
				Update: {
					id?: string;
					kundenname?: string | null;
					artikelnummer?: string | null;
					menge?: number | null;
					bestelldatum?: string | null;
					lieferadresse?: string | null;
					status?: OrderStatusDb;
					fehlergrund?: string | null;
					erp_id?: string | null;
					rohdaten?: Json | null;
					erstellt_am?: string;
					aktualisiert_am?: string;
				};
				Relationships: [];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

export type AppSupabaseClient = SupabaseClient<Database>;
