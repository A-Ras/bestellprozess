<script lang="ts">
	import { refreshAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import StatusBadge from '#lib/components/dashboard/StatusBadge.svelte';
	import ArrowLeft from 'lucide-svelte/icons/arrow-left';
	import CircleCheck from 'lucide-svelte/icons/circle-check';
	import Save from 'lucide-svelte/icons/save';
	import Send from 'lucide-svelte/icons/send';
	import TriangleAlert from 'lucide-svelte/icons/triangle-alert';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let kundenname = $derived(data.order.kundenname ?? '');
	let artikelnummer = $derived(data.order.artikelnummer ?? '');
	let menge = $derived(data.order.menge !== null ? String(data.order.menge) : '');
	let bestelldatum = $derived(data.order.bestelldatum ?? '');
	let lieferadresse = $derived(data.order.lieferadresse ?? '');

	let isSaving = $state(false);
	let feedback = $state<{ type: 'success' | 'error'; message: string } | null>(null);

	async function submitUpdate(action: 'save' | 'retry_erp') {
		isSaving = true;
		feedback = null;

		const parsedMenge = Number(menge);

		try {
			const response = await fetch(resolve('/api/orders/[id]', { id: data.order.id }), {
				method: 'PATCH',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					kundenname: kundenname.trim(),
					artikelnummer: artikelnummer.trim(),
					menge: Number.isFinite(parsedMenge) ? parsedMenge : 0,
					bestelldatum: bestelldatum.trim(),
					lieferadresse: lieferadresse.trim() || null,
					action
				})
			});

			const raw: unknown = await response.json();
			const payload =
				typeof raw === 'object' && raw !== null ? (raw as Record<string, unknown>) : {};

			if (!response.ok) {
				const errMsg =
					typeof payload.error === 'string' ? payload.error : 'Aktualisierung fehlgeschlagen.';
				feedback = { type: 'error', message: errMsg };
				return;
			}

			await refreshAll();

			const updatedOrder =
				typeof payload.order === 'object' && payload.order !== null
					? (payload.order as Record<string, unknown>)
					: null;

			if (updatedOrder?.status === 'fehlerhaft') {
				const reason =
					typeof updatedOrder.fehlergrund === 'string'
						? updatedOrder.fehlergrund
						: 'Daten sind weiterhin ungültig.';
				feedback = { type: 'error', message: reason };
			} else {
				feedback = {
					type: 'success',
					message:
						action === 'retry_erp'
							? 'Bestellung validiert und erfolgreich an das ERP übermittelt.'
							: 'Änderungen gespeichert.'
				};
			}
		} catch {
			feedback = { type: 'error', message: 'Netzwerkfehler beim Speichern.' };
		} finally {
			isSaving = false;
		}
	}
</script>

<svelte:head>
	<title>Bestellung prüfen | Bestellprozess Monitor</title>
</svelte:head>

<div class="mx-auto max-w-3xl space-y-6">
	<div>
		<a
			href={resolve('/(app)/dashboard')}
			class="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
		>
			<ArrowLeft class="h-4 w-4" />
			Zurück zum Dashboard
		</a>
	</div>

	<div class="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
		<div class="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5">
			<div>
				<p class="font-mono text-xs text-slate-400">ID: {data.order.id}</p>
				<h1 class="mt-1 text-xl font-semibold text-slate-900">
					{data.order.kundenname || 'Bestellung ohne Kundennamen'}
				</h1>
			</div>
			<StatusBadge status={data.order.status} />
		</div>

		{#if data.order.status === 'fehlerhaft' && data.order.fehlergrund}
			<div
				class="mt-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"
			>
				<TriangleAlert class="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
				<div>
					<p class="font-semibold">Validierungs- / Verarbeitungsfehler</p>
					<p class="mt-0.5">{data.order.fehlergrund}</p>
				</div>
			</div>
		{/if}

		{#if data.order.erp_id}
			<div
				class="mt-5 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
			>
				<CircleCheck class="h-5 w-5 shrink-0 text-emerald-600" />
				<div>
					Erfolgreich an das ERP übermittelt – Referenz:
					<span class="font-mono font-semibold">{data.order.erp_id}</span>
				</div>
			</div>
		{/if}

		{#if feedback}
			<div
				class={`mt-5 rounded-lg border px-4 py-3 text-sm ${
					feedback.type === 'error'
						? 'border-red-200 bg-red-50 text-red-700'
						: 'border-emerald-200 bg-emerald-50 text-emerald-700'
				}`}
			>
				{feedback.message}
			</div>
		{/if}

		<form
			onsubmit={(e) => {
				e.preventDefault();
				void submitUpdate('save');
			}}
			class="mt-6 space-y-4"
		>
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div>
					<label for="kundenname" class="mb-1 block text-sm font-medium text-slate-700">
						Kundenname
					</label>
					<input
						id="kundenname"
						type="text"
						bind:value={kundenname}
						class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
					/>
				</div>

				<div>
					<label for="artikelnummer" class="mb-1 block text-sm font-medium text-slate-700">
						Artikelnummer
					</label>
					<input
						id="artikelnummer"
						type="text"
						bind:value={artikelnummer}
						class="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
					/>
				</div>

				<div>
					<label for="menge" class="mb-1 block text-sm font-medium text-slate-700"> Menge </label>
					<input
						id="menge"
						type="number"
						bind:value={menge}
						class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
					/>
				</div>

				<div>
					<label for="bestelldatum" class="mb-1 block text-sm font-medium text-slate-700">
						Bestelldatum
					</label>
					<input
						id="bestelldatum"
						type="date"
						bind:value={bestelldatum}
						class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
					/>
				</div>
			</div>

			<div>
				<label for="lieferadresse" class="mb-1 block text-sm font-medium text-slate-700">
					Lieferadresse
				</label>
				<input
					id="lieferadresse"
					type="text"
					bind:value={lieferadresse}
					class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
				/>
			</div>

			<div class="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-5">
				<button
					type="submit"
					disabled={isSaving}
					class="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
				>
					<Save class="h-4 w-4" />
					Nur speichern
				</button>

				<button
					type="button"
					disabled={isSaving}
					onclick={() => submitUpdate('retry_erp')}
					class="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
				>
					<Send class="h-4 w-4" />
					Validieren & an ERP übermitteln
				</button>
			</div>
		</form>
	</div>

	{#if data.order.rohdaten}
		<div class="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
			<h2 class="text-sm font-semibold text-slate-900">Extrahierte Rohdaten (Audit-Protokoll)</h2>
			<pre
				class="mt-3 overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs text-slate-100">{JSON.stringify(
					data.order.rohdaten,
					null,
					2
				)}</pre>
		</div>
	{/if}
</div>
