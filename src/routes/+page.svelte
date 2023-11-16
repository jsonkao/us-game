<script>
	import CardGrid from '$lib/CardGrid.svelte';
	import Card from '$lib/Card.svelte';
	import Tokens from '$lib/Tokens.svelte';
	import { onMount } from 'svelte';

	export let data;

	let { cards, nobles } = data;

	onMount(() => {
		// This allows the cards to be randomized in a consistent way
		let seedValue = localStorage.getItem('seedValue');
		if (!seedValue) localStorage.setItem('seedValue', (seedValue = 0));
		cards = cards.sort((a, b) => {
			return Math.sin(seedValue + a.id) - Math.sin(seedValue + b.id);
		});
	});

	let tokens = [4, 4, 4, 4, 4];
</script>

<div class="container">
	<div />
	<CardGrid {cards} />
	<Tokens {tokens} />

	<div class="nobles">
		<p>Nobles</p>

		<div>
			{#each nobles as card}
				<Card {card} isNoble />
			{/each}
		</div>
	</div>
</div>

<style>
	:global(body) {
		font-family: 'Roboto', sans-serif;
		margin: 0;
		background-color: #f5eee6;
	}

	:global(p) {
		margin: 0;
	}

	.container {
		--card-width: 110px;
		padding: 50px 0;
		display: grid;
		grid-template-columns: 1fr min-content 1fr;
		row-gap: 50px;
		column-gap: 10px;
	}

	.nobles {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		grid-column: 1 / -1;
	}

	.nobles div {
		display: flex;
		column-gap: 4px;
	}
</style>
