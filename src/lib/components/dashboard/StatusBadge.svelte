<script lang="ts">
	import type { OrderStatus } from '#lib/types/order.ts';

	let { status }: { status: OrderStatus } = $props();

	const STATUS_STYLES: Record<OrderStatus, { label: string; classes: string }> = {
		neu: {
			label: 'Neu',
			classes: 'bg-slate-100 text-slate-700 border-slate-200'
		},
		in_pruefung: {
			label: 'In Prüfung',
			classes: 'bg-amber-50 text-amber-800 border-amber-200'
		},
		fehlerhaft: {
			label: 'Fehlerhaft',
			classes: 'bg-red-50 text-red-700 border-red-200'
		},
		uebermittelt: {
			label: 'Übermittelt',
			classes: 'bg-emerald-50 text-emerald-700 border-emerald-200'
		}
	};

	const config = $derived(STATUS_STYLES[status]);
</script>

<span
	class={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${config.classes}`}
>
	{config.label}
</span>
