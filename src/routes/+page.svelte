<script lang="ts">
	import { playerStore, nobleStore } from '$lib/stores';
	import { dispatch } from '$lib/dispatch';
	import { restartGame } from '$lib/utils';
	import { moveStore } from '$lib/stores';
	import { browser } from '$app/environment';
	import { beginSocket } from '$lib/socket';

	import CardGrid from '$lib/CardGrid.svelte';
	import Card from '$lib/Card.svelte';
	import PlayerHand from '$lib/PlayerHand.svelte';
	import Tokens from '$lib/Tokens.svelte';
	import { onMount } from 'svelte';

	export let data;

	onMount(() => {
		data.moves.forEach((m) => dispatch(m, false));
		moveStore.set(data.moves);
		beginSocket();
	});
</script>

<div class="container">
	<Tokens owner="bank" />
	<div class="switch-turn" class:left={$playerStore === 0}>
		<p>
			Player {$playerStore + 1}&#8217;s turn.
			<button
				on:click={() => dispatch({ storeName: 'playerStore', action: 'nextTurn', args: [$playerStore] })}
			>
				Switch.
			</button>
		</p>
	</div>

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

	<div class="restart-game"><button on:click={restartGame}>Restart.</button></div>
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
		grid-row: 1;
		position: relative;
		pointer-events: none;
	}

	.switch-turn button {
		all: unset;
		font-size: inherit;
		border-bottom: 1px solid rgba(0, 0, 0, 0.2);
		transition-duration: 0.2s;
		pointer-events: all;
	}

	.switch-turn p {
		position: absolute;
		left: 0;
		transition-duration: 0.3s;
		white-space: pre;
		display: flex;
		align-items: start;
		gap: 4px;
	}

	.switch-turn:not(.left) p {
		left: 100%;
		transform: translateX(-100%);
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
			--card-width: 70px;
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
