<script>
	import Card from '$lib/Card.svelte';

	export let cards = [];

	let levels = [2, 1, 0];
</script>

<div class="card-grid">
	{#each levels as level}
		{@const cardsForRow = cards.filter((c) => c.level === level)}

		<Card stackHeight={cardsForRow.length - 4} {level} />

		{#each cardsForRow.slice(0, 4) as card}
			<Card {card} />
		{/each}
	{/each}
</div>

<style>
	.card-grid {
		--column-gap: 5px;

		width: calc(5 * var(--card-width) + 4 * var(--column-gap));
		display: grid;
		grid-template-columns: repeat(5, var(--card-width));
		gap: var(--column-gap);
	}
</style>
