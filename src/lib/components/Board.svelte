<script lang="ts">
	import { nobleStore, cardStore, playerStore } from '$lib/stores';
	import { enactMove } from '$lib/utils/dispatch';
	import { moveStore } from '$lib/stores';
	import { browser } from '$app/environment';
	import { beginSocket } from '$lib/utils/socket';

	import CardGrid from '$lib/components/CardGrid.svelte';
	import Card from '$lib/components/Card.svelte';
	import PlayerHand from '$lib/components/PlayerHand.svelte';
	import Tokens from '$lib/components/Tokens.svelte';
	import CornerButtons from '$lib/components/CornerButtons.svelte';
	import { setContext } from 'svelte';

	export let data;

	let { game, moves } = data;

	setContext('game', game);

	if (browser) beginSocket(game);

	$: {
		nobleStore.init(game);
		cardStore.init(game);
		moves.forEach(enactMove);
		moveStore.set(moves);
	}

	export async function restartGame() {
		await fetch('/moves', {
			method: 'DELETE',
			body: game
		});
	}

	export async function startNewGame() {
		await fetch('/moves', {
			method: 'PATCH'
		});
	}
</script>

<div class="container">
	<Tokens owner="bank" />
	<CornerButtons />

	<PlayerHand player={0} />
	<CardGrid />
	<PlayerHand player={1} />

	<div class="nobles" style="opacity: {+browser}">
		<div>
			{#each $nobleStore as card}
				{#if card.owner === 'bank'}
					<Card {card} isNoble />
				{/if}
			{/each}
		</div>
	</div>

	<div class="restart-game">
		<button on:click={restartGame}>Restart.</button>
		<button on:click={startNewGame}>Start new game.</button>
	</div>
</div>

<style>
	:global(body) {
		--bg-color: #f5eee6;
		font-family: 'Roboto', sans-serif;
		margin: 0;
		background-color: var(--bg-color);

		touch-action: manipulation;
		width: 100%;
		overflow-x: hidden;
	}

	:global(p) {
		margin: 0;
		font-size: 16px;
	}

	:global(button:hover) {
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
		--card-grid-gap: 10px;

		padding: 40px 30px;
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
		margin-top: 50px;
		transition-duration: 0.2s;
	}

	.nobles div {
		display: flex;
		column-gap: 4px;
	}

	.restart-game {
		margin-top: 30px;
		grid-column: 1 / -1;
		text-align: center;
	}

	.restart-game button {
		all: unset;
		text-align: center;
		font-size: inherit;
		border-bottom: 1px solid rgba(0, 0, 0, 0.2);
		transition-duration: 0.2s;
		pointer-events: all;
	}

	button:hover {
		border-bottom: 1px solid rgba(0, 0, 0, 0.6);
		cursor: pointer;
	}

	@media (max-width: 960px) {
		.container {
			--card-width: 69px;
			--card-height: 100px;
			--token-size: 30px;
			--cost-size: 10px;
			--cost-padding: 5px;
			--card-grid-gap: 6px;
			padding: 20px 15px;
			column-gap: 6px;
		}

		:global(p) {
			margin: 0;
			font-size: 13px;
		}
	}
</style>
