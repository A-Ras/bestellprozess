import { createServerClient } from '@supabase/ssr';
import { redirect } from '@sveltejs/kit';
import { sequence, type Handle } from '@sveltejs/kit/hooks';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$app/env/public';
import type { Database } from '#lib/types/database.ts';

const supabaseHandle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient<Database>(
		PUBLIC_SUPABASE_URL,
		PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				getAll: () => event.cookies.getAll(),
				setAll: (cookiesToSet) => {
					cookiesToSet.forEach(({ name, value, options }) => {
						event.cookies.set(name, value, { ...options, path: '/' });
					});
				}
			}
		}
	);

	event.locals.safeGetSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();

		if (!session) {
			return { session: null, user: null };
		}

		// Verifiziert das JWT sicher gegen Supabase Auth
		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();

		if (error || !user) {
			return { session: null, user: null };
		}

		return { session, user };
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};

const authGuard: Handle = async ({ event, resolve }) => {
	event.locals.session = null;
	event.locals.user = null;

	const routeId = event.route.id ?? '';
	const isProtectedPage = routeId.startsWith('/(app)');
	const isProtectedApi = routeId.startsWith('/api/');
	const isLoginPage = routeId === '/(auth)/login';

	// Öffentliche Seiten / unbekannte 404-Routen benötigen keine Auth-Abfrage
	if (!isProtectedPage && !isProtectedApi && !isLoginPage) {
		return resolve(event);
	}

	const { session, user } = await event.locals.safeGetSession();
	event.locals.session = session;
	event.locals.user = user;

	if (isProtectedPage && !session) {
		redirect(303, '/login');
	}

	if (isProtectedApi && !session) {
		return Response.json({ error: 'Nicht authentifiziert' }, { status: 401 });
	}

	if (session && isLoginPage) {
		redirect(303, '/dashboard');
	}

	return resolve(event);
};

export const handle: Handle = sequence(supabaseHandle, authGuard);
