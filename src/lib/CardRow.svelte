<script>
	import Card from './Card.svelte';

	export let cards = [];
	export let level;

	const cardsForRow = cards.filter((c) => c.level === level);
</script>

<Card stackHeight={cardsForRow.length - 4} />

{#each cardsForRow.slice(0, 4) as card}
	<Card {card} />
{/each}
