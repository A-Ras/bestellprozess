import { defineEnvVars } from '@sveltejs/kit/env';
import * as z from 'zod';

export const variables = defineEnvVars({
	PUBLIC_SUPABASE_URL: {
		public: true,
		schema: (value) => z.url('PUBLIC_SUPABASE_URL muss eine gültige URL sein').parse(value)
	},
	PUBLIC_SUPABASE_ANON_KEY: {
		public: true,
		schema: (value) => z.string().min(1, 'PUBLIC_SUPABASE_ANON_KEY fehlt').parse(value)
	},
	SUPABASE_SERVICE_ROLE_KEY: {
		schema: (value) => z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY fehlt').parse(value)
	}
});
