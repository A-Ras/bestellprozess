<script lang="ts">
	import { resolve } from '$app/paths';
	import StatusBadge from '#lib/components/dashboard/StatusBadge.svelte';
	import type { Order, OrderStatus } from '#lib/types/order.ts';
	import ArrowRight from 'lucide-svelte/icons/arrow-right';

	type FilterOption = 'alle' | OrderStatus;

	const FILTER_TABS: { id: FilterOption; label: string }[] = [
		{ id: 'alle', label: 'Alle' },
		{ id: 'fehlerhaft', label: 'Fehlerhaft' },
		{ id: 'in_pruefung', label: 'In Prüfung' },
		{ id: 'uebermittelt', label: 'Übermittelt' },
		{ id: 'neu', label: 'Neu' }
	];

	let { orders }: { orders: Order[] } = $props();
	let statusFilter = $state<FilterOption>('alle');

	const filteredOrders = $derived(
		statusFilter === 'alle' ? orders : orders.filter((order) => order.status === statusFilter)
	);

	function selectFilter(filter: FilterOption) {
		statusFilter = filter;
	}

	function formatDateTime(iso: string): string {
		return new Intl.DateTimeFormat('de-DE', {
			dateStyle: 'short',
			timeStyle: 'short'
		}).format(new Date(iso));
	}
</script>

<div class="rounded-xl border border-slate-200 bg-white shadow-xs">
	<div
		class="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
	>
		<div>
			<h2 class="text-base font-semibold text-slate-900">Eingegangene Bestellungen</h2>
			<p class="text-xs text-slate-500">{filteredOrders.length} von {orders.length} Einträgen</p>
		</div>

		<div class="flex flex-wrap gap-1.5">
			{#each FILTER_TABS as tab (tab.id)}
				<button
					type="button"
					onclick={() => selectFilter(tab.id)}
					aria-pressed={statusFilter === tab.id}
					class={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium transition ${
						statusFilter === tab.id
							? 'bg-slate-900 text-white'
							: 'bg-slate-100 text-slate-600 hover:bg-slate-200'
					}`}
				>
					{tab.label}
				</button>
			{/each}
		</div>
	</div>

	{#if filteredOrders.length === 0}
		<div class="px-6 py-12 text-center text-sm text-slate-500">
			Keine Bestellungen für den gewählten Filter vorhanden.
		</div>
	{:else}
		<!-- Mobile: Karten-Ansicht ohne horizontales Scrollen -->
		<div class="divide-y divide-slate-100 md:hidden">
			{#each filteredOrders as order (order.id)}
				<div class="space-y-3 p-4">
					<div class="flex items-start justify-between gap-3">
						<p class="font-medium text-slate-900">
							{order.kundenname || '—'}
						</p>
						<div class="shrink-0">
							<StatusBadge status={order.status} />
						</div>
					</div>

					<div class="grid grid-cols-3 gap-2 text-xs">
						<div>
							<span class="block text-slate-400">Artikel</span>
							<span class="font-mono text-slate-700">{order.artikelnummer || '—'}</span>
						</div>
						<div>
							<span class="block text-slate-400">Menge</span>
							<span class="text-slate-700">{order.menge ?? '—'}</span>
						</div>
						<div>
							<span class="block text-slate-400">Datum</span>
							<span class="text-slate-700">{order.bestelldatum || '—'}</span>
						</div>
					</div>

					{#if order.status === 'fehlerhaft' && order.fehlergrund}
						<p class="rounded-md bg-red-50 px-2.5 py-1.5 text-xs text-red-700">
							{order.fehlergrund}
						</p>
					{:else if order.erp_id}
						<p class="font-mono text-xs text-emerald-700">ERP: {order.erp_id}</p>
					{/if}

					<div class="flex items-center justify-between pt-1 text-xs">
						<span class="text-slate-400">{formatDateTime(order.erstellt_am)}</span>
						<a
							href={resolve('/(app)/orders/[id]', { id: order.id })}
							class="inline-flex items-center gap-1 font-medium text-blue-600 hover:text-blue-800"
						>
							{order.status === 'fehlerhaft' || order.status === 'in_pruefung'
								? 'Prüfen'
								: 'Details'}
							<ArrowRight class="h-3.5 w-3.5" />
						</a>
					</div>
				</div>
			{/each}
		</div>

		<!-- Tablet & Desktop: Komplette Tabelle -->
		<div class="hidden overflow-x-auto md:block">
			<table class="min-w-full divide-y divide-slate-200 text-left text-sm">
				<thead class="bg-slate-50 text-xs font-semibold tracking-wide text-slate-500 uppercase">
					<tr>
						<th class="px-5 py-3">Kunde</th>
						<th class="px-5 py-3">Artikel</th>
						<th class="px-5 py-3">Menge</th>
						<th class="px-5 py-3 whitespace-nowrap">Bestelldatum</th>
						<th class="px-5 py-3">Status</th>
						<th class="px-5 py-3">ERP-Ref / Hinweis</th>
						<th class="px-5 py-3">Eingang</th>
						<th class="px-5 py-3 text-right">Aktion</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-100 bg-white">
					{#each filteredOrders as order (order.id)}
						<tr class="transition hover:bg-slate-50/70">
							<td class="px-5 py-3.5 font-medium text-slate-900">
								{order.kundenname || '—'}
							</td>
							<td class="px-5 py-3.5 font-mono text-xs whitespace-nowrap text-slate-700">
								{order.artikelnummer || '—'}
							</td>
							<td class="px-5 py-3.5 whitespace-nowrap text-slate-700">
								{order.menge ?? '—'}
							</td>
							<td class="px-5 py-3.5 whitespace-nowrap text-slate-600">
								{order.bestelldatum || '—'}
							</td>
							<td class="px-5 py-3.5 whitespace-nowrap">
								<StatusBadge status={order.status} />
							</td>
							<td class="max-w-xs truncate px-5 py-3.5 text-xs">
								{#if order.status === 'fehlerhaft' && order.fehlergrund}
									<span class="text-red-600" title={order.fehlergrund}>{order.fehlergrund}</span>
								{:else if order.erp_id}
									<span class="font-mono text-emerald-700">{order.erp_id}</span>
								{:else}
									<span class="text-slate-400">Ausstehend</span>
								{/if}
							</td>
							<td class="px-5 py-3.5 text-xs whitespace-nowrap text-slate-500">
								{formatDateTime(order.erstellt_am)}
							</td>
							<td class="px-5 py-3.5 text-right whitespace-nowrap">
								<a
									href={resolve('/(app)/orders/[id]', { id: order.id })}
									class="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800"
								>
									{order.status === 'fehlerhaft' || order.status === 'in_pruefung'
										? 'Prüfen'
										: 'Details'}
									<ArrowRight class="h-3.5 w-3.5" />
								</a>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
