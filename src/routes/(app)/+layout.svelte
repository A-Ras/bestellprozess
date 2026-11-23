<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { LogOut, PackageCheck } from 'lucide-svelte';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<div class="min-h-screen bg-slate-50 text-slate-900">
	<header class="border-b border-slate-200 bg-white">
		<div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
			<a href={resolve('/(app)/dashboard')} class="flex items-center gap-2.5">
				<div class="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
					<PackageCheck class="h-5 w-5" />
				</div>
				<div>
					<span class="block text-sm font-semibold text-slate-900">Bestellprozess Monitor</span>
					<span class="block text-xs text-slate-500">Handels GmbH – PoC</span>
				</div>
			</a>

			<div class="flex items-center gap-4">
				<span class="hidden text-sm text-slate-600 sm:inline">{data.userEmail}</span>
				<form method="POST" action={resolve('/logout')} use:enhance>
					<button
						type="submit"
						class="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
					>
						<LogOut class="h-4 w-4" />
						Abmelden
					</button>
				</form>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		{@render children()}
	</main>
</div>
