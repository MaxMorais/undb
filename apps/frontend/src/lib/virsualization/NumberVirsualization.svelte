<script lang="ts">
	import cx from 'classnames'
	import { Heading } from 'flowbite-svelte'
	import type { NumberVirsualization } from '@undb/core'
	import { trpc } from '$lib/trpc/client'
	import { getTable, getView } from '$lib/store/table'

	export let virsualization: NumberVirsualization

	const table = getTable()
	const view = getView()

	const aggregateNumber = trpc().table.aggregate.aggregateNumber.query({
		tableId: $table.id.value,
		viewId: $view.id.value,
		virsualizationId: virsualization.id.value,
	})
</script>

{#if $aggregateNumber.isLoading}
	<div class="w-full h-full animate-pulse bg-slate-100" />
{:else}
	<Heading {...$$restProps} class={cx('text-center flex items-center justify-center', $$restProps.class)}>
		{$aggregateNumber.data?.number}
	</Heading>
{/if}
