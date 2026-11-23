import type { Session, User } from '@supabase/supabase-js';
import type { AppSupabaseClient } from '#lib/types/database.ts';

declare global {
	namespace App {
		interface Locals {
			supabase: AppSupabaseClient;
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
			session: Session | null;
			user: User | null;
		}
	}
}

export {};
