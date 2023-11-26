<script lang="ts">
	import { browser } from '$app/environment';
	import { setContext } from 'svelte';

	import { nobleStore, cardStore, moveStore } from '$lib/stores';
	import { enactMove } from '$lib/utils/dispatch';
	import { beginSocket } from '$lib/utils/socket';
	import { offline } from '$lib/utils/helpers';

	import CardGrid from '$lib/components/CardGrid.svelte';
	import Card from '$lib/components/Card.svelte';
	import PlayerHand from '$lib/components/PlayerHand.svelte';
	import Tokens from '$lib/components/Tokens.svelte';
	import CornerButtons from '$lib/components/CornerButtons.svelte';
	import Presence from '$lib/components/Presence.svelte';

	export let data;

	let { game, moves, cards } = data;
	let nobles = data.nobles;

	setContext('game', game);

	$: browser && !offline && beginSocket(game);

	$: {
		nobleStore.set(nobles);
		cardStore.set(cards);
		moves.forEach(enactMove);
		moveStore.set(moves);
	}
</script>

<div class="container">
	<Tokens owner="bank" />
	<CornerButtons />

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

	<div class="restart-game">
		<button
			on:click={() =>
				!offline &&
				fetch('/moves', {
					method: 'DELETE',
					body: game.toString()
				})}
		>
			Restart.
		</button>
		<button
			on:click={() =>
				!offline &&
				fetch('/moves', {
					method: 'PATCH'
				})}
		>
			Start new game.
		</button>
	</div>

	<Presence />
</div>

<slot />

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
		row-gap: 10px;
	}

	.nobles {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		grid-column: 1 / -1;
		margin-top: 30px;
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
		/* U's iPhone 10 */
		.container {
			--card-width: 69px;
			--card-height: 97px;
			--token-size: 30px;
			--cost-size: 9px;
			--cost-padding: 5px;
			--card-grid-gap: 6px;
			padding: 13px 15px;
			column-gap: 6px;
			row-gap: 8px;
		}

		:global(p) {
			margin: 0;
			font-size: 13px;
		}
	}

	@media (max-width: 720px) {
		/* J's iPhone 8 */
		.container {
			--card-width: 54px;
			--cost-size: 8px;
			--token-size: 27px;
		}
	}
</style>
