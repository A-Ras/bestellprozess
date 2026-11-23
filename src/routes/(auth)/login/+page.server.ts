import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { session } = await locals.safeGetSession();
	if (session) {
		redirect(303, '/dashboard');
	}
	return {};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
			return fail(400, {
				error: 'Bitte E-Mail-Adresse und Passwort eingeben.',
				email: typeof email === 'string' ? email : ''
			});
		}

		const { error } = await locals.supabase.auth.signInWithPassword({
			email: email.trim(),
			password
		});

		if (error) {
			return fail(401, {
				error: 'Anmeldung fehlgeschlagen. Bitte Zugangsdaten prüfen.',
				email: email.trim()
			});
		}

		redirect(303, '/dashboard');
	}
};
