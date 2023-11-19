<script>
	import CardGrid from '$lib/CardGrid.svelte';
	import Card from '$lib/Card.svelte';
	import PlayerHand from '$lib/PlayerHand.svelte';
	import Tokens from '$lib/Tokens.svelte';
	import { playerStore, nobleStore, cardStore, dispatch } from '$lib/stores';

	export let data;
	let { seed } = data;
	nobleStore.shuffle(seed);
	cardStore.shuffle(seed);
</script>

<div class="container">
	<Tokens owner="bank" />
	<p class="switch-turn">
		Player {$playerStore + 1}&#8217;s turn.
		<button on:click={() => dispatch({ storeName: 'playerStore', action: 'switchTurn' })}>
			Switch.
		</button>
	</p>

	<PlayerHand player={0} />
	<CardGrid />
	<PlayerHand player={1} />

	<div class="nobles">
		<div>
			{#each $nobleStore as card}
				{#if card.owner === 'bank'}
					<Card {card} isNoble />
				{/if}
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
		font-size: 16px;
	}

	:global(button:hover) {
		cursor: pointer;
	}

	.switch-turn {
		text-align: center;
		grid-column: 1 / -1;
		margin: 15px 0;
	}

	.switch-turn button {
		all: unset;
		font-size: inherit;
		border-bottom: 1px solid rgba(0, 0, 0, 0.2);
		transition-duration: 0.2s;
	}

	.switch-turn button:hover {
		border-bottom: 1px solid rgba(0, 0, 0, 0.6);
		cursor: pointer;
	}

	.container {
		--card-width: 110px;
		--card-height: 160px;
		--mini-card-height: calc(var(--card-height) / 2);
		--token-size: 50px;
		--drop-shadow: 0 -3px 2px rgba(0, 0, 0, 0.2);
		--cost-size: 12px;
		--cost-padding: 8px;

		padding: 50px 30px;
		display: grid;
		grid-template-columns: 1fr min-content 1fr;
		column-gap: 10px;
	}

	.nobles {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		grid-column: 1 / -1;
		margin-top: 35px;
	}

	.nobles div {
		display: flex;
		column-gap: 4px;
	}

	@media (max-width: 960px) {
		.container {
			--card-width: 80px;
			--card-height: 120px;
			--token-size: 30px;
			--cost-size: 10px;
			--cost-padding: 7px;
			padding: 30px 20px;
		}

		:global(p) {
			margin: 0;
			font-size: 14px;
		}
	}
</style>
