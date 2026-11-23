import { error } from '@sveltejs/kit';
import { getOrderById } from '#lib/server/services/order.service.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const order = await getOrderById(locals.supabase, params.id);

	if (!order) {
		error(404, 'Bestellung nicht gefunden');
	}

	return { order };
};
