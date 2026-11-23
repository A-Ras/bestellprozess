import { supabaseAdmin } from '#lib/server/supabase.admin.ts';
import type { AppSupabaseClient, Json } from '#lib/types/database.ts';
import type { DashboardKpis, Order, OrderStatus } from '#lib/types/order.ts';

export interface CreateOrderInput {
	kundenname: string | null;
	artikelnummer: string | null;
	menge: number | null;
	bestelldatum: string | null;
	lieferadresse: string | null;
	status: OrderStatus;
	fehlergrund?: string | null;
	erp_id?: string | null;
	rohdaten?: Json | null;
}

export interface UpdateOrderInput {
	kundenname?: string | null;
	artikelnummer?: string | null;
	menge?: number | null;
	bestelldatum?: string | null;
	lieferadresse?: string | null;
	status?: OrderStatus;
	fehlergrund?: string | null;
	erp_id?: string | null;
}

export async function getOrders(client: AppSupabaseClient): Promise<Order[]> {
	const { data, error } = await client
		.from('bestellungen')
		.select('*')
		.order('erstellt_am', { ascending: false });

	if (error) {
		throw new Error(`Fehler beim Laden der Bestellungen: ${error.message}`);
	}

	return data ?? [];
}

export async function getOrderById(client: AppSupabaseClient, id: string): Promise<Order | null> {
	const { data, error } = await client.from('bestellungen').select('*').eq('id', id).maybeSingle();

	if (error) {
		throw new Error(`Fehler beim Laden der Bestellung ${id}: ${error.message}`);
	}

	return data;
}

export async function getKpis(client: AppSupabaseClient): Promise<DashboardKpis> {
	const startOfToday = new Date();
	startOfToday.setHours(0, 0, 0, 0);

	const [gesamtRes, heuteRes, fehlerhaftRes, uebermitteltRes, inPruefungRes] = await Promise.all([
		client.from('bestellungen').select('*', { count: 'exact', head: true }),
		client
			.from('bestellungen')
			.select('*', { count: 'exact', head: true })
			.gte('erstellt_am', startOfToday.toISOString()),
		client
			.from('bestellungen')
			.select('*', { count: 'exact', head: true })
			.eq('status', 'fehlerhaft'),
		client
			.from('bestellungen')
			.select('*', { count: 'exact', head: true })
			.eq('status', 'uebermittelt'),
		client
			.from('bestellungen')
			.select('*', { count: 'exact', head: true })
			.eq('status', 'in_pruefung')
	]);

	for (const res of [gesamtRes, heuteRes, fehlerhaftRes, uebermitteltRes, inPruefungRes]) {
		if (res.error) {
			throw new Error(`Fehler bei KPI-Aggregation: ${res.error.message}`);
		}
	}

	const gesamt = gesamtRes.count ?? 0;
	const heute = heuteRes.count ?? 0;
	const fehlerhaft = fehlerhaftRes.count ?? 0;
	const uebermittelt = uebermitteltRes.count ?? 0;
	const inPruefung = inPruefungRes.count ?? 0;
	const fehlerquoteProzent = gesamt > 0 ? Math.round((fehlerhaft / gesamt) * 1000) / 10 : 0;

	return {
		gesamt,
		heute,
		fehlerhaft,
		uebermittelt,
		inPruefung,
		fehlerquoteProzent
	};
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
	const { data, error } = await supabaseAdmin
		.from('bestellungen')
		.insert({
			kundenname: input.kundenname,
			artikelnummer: input.artikelnummer,
			menge: input.menge,
			bestelldatum: input.bestelldatum,
			lieferadresse: input.lieferadresse,
			status: input.status,
			fehlergrund:
				input.status === 'fehlerhaft' ? (input.fehlergrund ?? 'Unbekannter Fehler') : null,
			erp_id: input.erp_id ?? null,
			rohdaten: input.rohdaten ?? null
		})
		.select('*')
		.single();

	if (error) {
		throw new Error(`Fehler beim Speichern der Bestellung: ${error.message}`);
	}

	return data;
}

export async function updateOrder(id: string, input: UpdateOrderInput): Promise<Order> {
	const payload: UpdateOrderInput = { ...input };

	if (payload.status && payload.status !== 'fehlerhaft') {
		payload.fehlergrund = null;
	}

	const { data, error } = await supabaseAdmin
		.from('bestellungen')
		.update(payload)
		.eq('id', id)
		.select('*')
		.single();

	if (error) {
		throw new Error(`Fehler beim Aktualisieren der Bestellung ${id}: ${error.message}`);
	}

	return data;
}
