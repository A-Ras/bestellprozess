<script lang="ts">
	import KpiCard from '#lib/components/dashboard/KpiCard.svelte';
	import NewOrderButton from '#lib/components/orders/NewOrderButton.svelte';
	import OrderTable from '#lib/components/orders/OrderTable.svelte';
	import { AlertCircle, CalendarCheck, CheckCircle2, Clock } from 'lucide-svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Dashboard | Bestellprozess Monitor</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-slate-900">
				Prozessübersicht Bestelleingang
			</h1>
			<p class="mt-1 text-sm text-slate-500">
				Automatisierte Extraktion, Validierung und ERP-Übergabe im Überblick (Gesamt: {data.kpis
					.gesamt})
			</p>
		</div>

		<NewOrderButton />
	</div>

	<section class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<KpiCard
			title="Bestellungen heute"
			value={data.kpis.heute}
			subtitle={`von ${data.kpis.gesamt} gesamt`}
			tone="blue"
		>
			{#snippet icon()}
				<CalendarCheck class="h-5 w-5" />
			{/snippet}
		</KpiCard>

		<KpiCard
			title="Fehlerquote"
			value={`${data.kpis.fehlerquoteProzent} %`}
			subtitle={`${data.kpis.fehlerhaft} fehlerhafte Bestellungen`}
			tone="red"
		>
			{#snippet icon()}
				<AlertCircle class="h-5 w-5" />
			{/snippet}
		</KpiCard>

		<KpiCard
			title="In Prüfung"
			value={data.kpis.inPruefung}
			subtitle="Manuelle Freigabe nötig"
			tone="amber"
		>
			{#snippet icon()}
				<Clock class="h-5 w-5" />
			{/snippet}
		</KpiCard>

		<KpiCard
			title="An ERP übermittelt"
			value={data.kpis.uebermittelt}
			subtitle="Erfolgreich abgeschlossen"
			tone="emerald"
		>
			{#snippet icon()}
				<CheckCircle2 class="h-5 w-5" />
			{/snippet}
		</KpiCard>
	</section>

	<OrderTable orders={data.orders} />
</div>
