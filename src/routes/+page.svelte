<script>
	import CardGrid from '$lib/CardGrid.svelte';
	import Card from '$lib/Card.svelte';
	import PlayerHand from '$lib/PlayerHand.svelte';
	import Tokens from '$lib/Tokens.svelte';

	import { playerStore } from '$lib/stores';

	export let data;

	let { nobles } = data;
	const nobleImages = import.meta.glob('$lib/images/nobles/*');
</script>

<div class="container">
	<div class="switch-button">
		<button on:click={playerStore.switchTurn}>Player {$playerStore + 1}'s turn. Switch.</button>
	</div>
	<Tokens owner="bank" />

	<PlayerHand player={0} />
	<CardGrid />
	<PlayerHand player={1} />

	<div class="nobles">
		<div>
			{#each nobles as card}
				<Card
					{card}
					isNoble
					imagePromise={nobleImages[
						Object.keys(nobleImages)[+card.index % Object.keys(nobleImages).length]
					]()}
				/>
			{/each}
		</div>
	</div>
</div>

<style>
	:global(body) {
		--bg-color: #f5eee6;
		font-family: 'Roboto', sans-serif;
		margin: 0;
		background-color: var(--bg-color);
	}

	:global(p) {
		margin: 0;
	}

	:global(button:hover) {
		cursor: pointer;
	}

	.switch-button {
		grid-column: 1 / -1;
	}

	button {
		margin: 0 auto;
		display: block;
	}

	.container {
		--card-width: 110px;
		--card-height: 160px;
		--drop-shadow: 0 -3px 2px rgba(0, 0, 0, 0.2);

		padding: 50px 30px;
		display: grid;
		grid-template-columns: 1fr min-content 1fr;
		row-gap: 30px;
		column-gap: 10px;
	}

	.nobles {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		grid-column: 1 / -1;
	}

	.nobles div {
		display: flex;
		column-gap: 4px;
	}
</style>
