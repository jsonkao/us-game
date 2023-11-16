<script>
	import CardGrid from '$lib/CardGrid.svelte';
	import Nobles from '$lib/Nobles.svelte';
	import { onMount } from 'svelte';

	export let data;

	let { cards: unrandomizedCards, nobles } = data;

	let cards = unrandomizedCards;

	onMount(() => {
		let seed = +(new URLSearchParams(window.location.search).get('seed'));

		if (seed) {
			function random() {
				var x = Math.sin(seed++) * 10000;
				return x - Math.floor(x);
			}
			cards = unrandomizedCards.sort(() => random());
		}
	});
</script>

<div class="container">
	<Nobles {nobles} />

	<CardGrid {cards} />
</div>

<style>
	:global(body) {
		font-family: 'Roboto', sans-serif;
		margin: 0;
		background-color: #eeeded;
	}

	:global(p) {
		margin: 0;
	}

	.container {
		--card-width: 100px;
		padding-top: 100px;
	}
</style>
