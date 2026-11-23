<script lang="ts">
	import type { Snippet } from 'svelte';

	type Tone = 'neutral' | 'blue' | 'amber' | 'red' | 'emerald';

	let {
		title,
		value,
		subtitle = '',
		tone = 'neutral',
		icon
	}: {
		title: string;
		value: string | number;
		subtitle?: string;
		tone?: Tone;
		icon?: Snippet;
	} = $props();

	const TONE_CLASSES: Record<Tone, string> = {
		neutral: 'bg-slate-100 text-slate-700',
		blue: 'bg-blue-50 text-blue-600',
		amber: 'bg-amber-50 text-amber-600',
		red: 'bg-red-50 text-red-600',
		emerald: 'bg-emerald-50 text-emerald-600'
	};
</script>

<div class="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
	<div class="flex items-start justify-between gap-3">
		<div>
			<p class="text-sm font-medium text-slate-500">{title}</p>
			<p class="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
			{#if subtitle}
				<p class="mt-1 text-xs text-slate-500">{subtitle}</p>
			{/if}
		</div>
		{#if icon}
			<div
				class={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${TONE_CLASSES[tone]}`}
			>
				{@render icon()}
			</div>
		{/if}
	</div>
</div>
