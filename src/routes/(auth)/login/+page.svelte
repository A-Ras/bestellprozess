<script lang="ts">
	import { enhance } from '$app/forms';
	import { Lock, Mail, PackageCheck } from 'lucide-svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	let isSubmitting = $state(false);
</script>

<svelte:head>
	<title>Anmeldung | Bestellprozess PoC</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-slate-50 px-4">
	<div class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
		<div class="mb-6 flex items-center gap-3">
			<div class="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
				<PackageCheck class="h-6 w-6" />
			</div>
			<div>
				<h1 class="text-xl font-semibold text-slate-900">Bestelleingang Dashboard</h1>
				<p class="text-sm text-slate-500">Handels GmbH – Proof of Concept</p>
			</div>
		</div>

		{#if form?.error}
			<div
				role="alert"
				class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
			>
				{form.error}
			</div>
		{/if}

		<form
			method="POST"
			use:enhance={() => {
				isSubmitting = true;
				return async ({ update }) => {
					await update();
					isSubmitting = false;
				};
			}}
			class="space-y-4"
		>
			<div>
				<label for="email" class="mb-1.5 block text-sm font-medium text-slate-700">
					E-Mail-Adresse
				</label>
				<div class="relative">
					<Mail
						class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
					/>
					<input
						id="email"
						name="email"
						type="email"
						required
						autocomplete="email"
						value={form?.email ?? ''}
						placeholder="name@handels-gmbh.de"
						class="w-full rounded-lg border border-slate-300 py-2.5 pr-3 pl-10 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
					/>
				</div>
			</div>

			<div>
				<label for="password" class="mb-1.5 block text-sm font-medium text-slate-700">
					Passwort
				</label>
				<div class="relative">
					<Lock
						class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
					/>
					<input
						id="password"
						name="password"
						type="password"
						required
						autocomplete="current-password"
						placeholder="••••••••"
						class="w-full rounded-lg border border-slate-300 py-2.5 pr-3 pl-10 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
					/>
				</div>
			</div>

			<button
				type="submit"
				disabled={isSubmitting}
				class="w-full cursor-pointer rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
			>
				{isSubmitting ? 'Anmeldung läuft...' : 'Anmelden'}
			</button>
		</form>

		<p class="mt-6 border-t border-slate-100 pt-4 text-center text-xs text-slate-400">
			Geschützter Bereich via Supabase Auth (produktiv: Microsoft Entra ID SSO)
		</p>
	</div>
</div>
