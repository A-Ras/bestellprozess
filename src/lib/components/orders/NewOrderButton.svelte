<script lang="ts">
	import { refreshAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { TriangleAlert, LoaderCircle, CirclePlus } from 'lucide-svelte';

	let isLoading = $state(false);
	let feedback = $state<{ type: 'success' | 'error'; message: string } | null>(null);

	async function triggerMockOrder(mode: 'random' | 'simulate_error') {
		isLoading = true;
		feedback = null;

		try {
			const response = await fetch(resolve('/api/orders'), {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ mode })
			});

			const raw: unknown = await response.json();
			const payload =
				typeof raw === 'object' && raw !== null ? (raw as Record<string, unknown>) : {};

			if (!response.ok) {
				const errText =
					typeof payload.error === 'string'
						? payload.error
						: 'Bestellung konnte nicht verarbeitet werden.';
				feedback = { type: 'error', message: errText };
				return;
			}

			await refreshAll();

			const orderObj =
				typeof payload.order === 'object' && payload.order !== null
					? (payload.order as Record<string, unknown>)
					: null;
			const status = typeof orderObj?.status === 'string' ? orderObj.status : 'erfasst';
			const customer =
				typeof orderObj?.kundenname === 'string' ? orderObj.kundenname : 'Unbekannter Kunde';

			feedback = {
				type: status === 'fehlerhaft' ? 'error' : 'success',
				message: `Neue Bestellung (${customer}) verarbeitet → Status: ${status}`
			};
		} catch {
			feedback = { type: 'error', message: 'Netzwerkfehler beim Auslösen der Mock-Bestellung.' };
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="flex flex-col items-start gap-2 sm:items-end">
	<div class="flex flex-wrap items-center gap-2">
		<button
			type="button"
			disabled={isLoading}
			onclick={() => triggerMockOrder('random')}
			class="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-xs transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
		>
			{#if isLoading}
				<LoaderCircle class="h-4 w-4 animate-spin" />
			{:else}
				<CirclePlus class="h-4 w-4" />
			{/if}
			Neue Mock-Bestellung
		</button>

		<button
			type="button"
			disabled={isLoading}
			onclick={() => triggerMockOrder('simulate_error')}
			class="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
		>
			<TriangleAlert class="h-4 w-4" />
			Fehlerfall testen
		</button>
	</div>

	{#if feedback}
		<p
			class={`text-xs font-medium ${
				feedback.type === 'error' ? 'text-red-600' : 'text-emerald-700'
			}`}
		>
			{feedback.message}
		</p>
	{/if}
</div>
