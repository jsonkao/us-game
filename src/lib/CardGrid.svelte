<script lang="ts">
	import Card from '$lib/Card.svelte';
	import { cardStore } from '$lib/stores';

	import { flip } from 'svelte/animate';
	import { send, receive } from '$lib/utils';

	let levels = [2, 1, 0];

	$: cardsForGrid = $cardStore.filter((c) => c.owner === 'bank');
</script>

<div class="card-grid">
	{#each levels as level}
		{#if cardsForGrid.filter((c) => c.level === level).length > 4}
			<div class="stack">
				<p>
					{cardsForGrid.filter((c) => c.level === level).length - 4} cards
				</p>
				<p>{@html '&bull;'.repeat(level + 1)}</p>
			</div>
		{/if}

		{#each cardsForGrid.filter((c) => c.level === level).slice(0, 4) as card (card.index)}
			<div in:receive={{ key: card.index }} out:send={{ key: card.index }} animate:flip>
				<Card {card} />
			</div>
		{/each}
	{/each}
</div>

<style>
	.card-grid {
		width: calc(5 * var(--card-width) + 4 * var(--card-grid-gap));
		display: grid;
		grid-template-columns: repeat(5, var(--card-width));
		gap: var(--card-grid-gap);
	}

	.stack {
		width: var(--card-width);
		height: var(--card-height);
		background: #fafafa;
		position: relative;
		border-radius: 4px;
		box-shadow:
			inset 0 0 0 2px black,
			inset 0 0 0 3px white,
			inset 0 0 0 5px black,
			var(--drop-shadow);
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: center;
	}

	.stack p:last-child {
		padding-bottom: 9px;
	}
</style>
