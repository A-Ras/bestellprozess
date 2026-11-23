import { getKpis, getOrders } from '#lib/server/services/order.service.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const [orders, kpis] = await Promise.all([getOrders(locals.supabase), getKpis(locals.supabase)]);

	return {
		orders,
		kpis
	};
};
