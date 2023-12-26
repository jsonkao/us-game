<script lang="ts">
	import { chipColors, chipTextColors } from '$lib/colors.js';
	import { playerStore, tokenStore, cardStore } from '$lib/stores';
	import { dispatchMove } from '$lib/utils/dispatch';
	import { getContext } from 'svelte';

	export let card: Card | Noble;
	export let isNoble = false;
	export let canPlayerReserve = false;

	const game: number = getContext('game');

	let { costs, score, index } = card;
	let isPurchased = card.owner !== 'bank' && !isNoble;
	let isReserved = (card as Card).heldBy !== null;
	let image = (card as Noble).image;
	let discount = (card as Card).discount;

	let purchasable = false;
	$: {
		const buyer = $playerStore;
		const discounts = getDiscounts(buyer, $cardStore);
		const playerTokens = $tokenStore.filter((t) => t.owner === buyer);

		let tokensOwed = 0;
		costs.forEach((value, color) => {
			const tokensOfColor = playerTokens.filter((t) => t.color === color);

			const difference = tokensOfColor.length - (value - (discounts[color] || 0));
			if (difference < 0) {
				tokensOwed += difference;
			}
		});

		purchasable =
			playerTokens.filter((t) => t.color === costs.length).length >= Math.abs(tokensOwed);
	}

	function getDiscounts(player: Owner, cards: Array<Card>) {
		const discounts: CostValue = [0, 0, 0, 0, 0];
		cards.filter((c) => c.owner === player).forEach((c) => discounts[c.discount]++);
		return discounts;
	}
</script>

<div
	class="card"
	class:isNoble
	class:isPurchased
	style="--card-color: {chipColors[discount]}; --image: url('{image}')"
>
	<p class="score" style="color: {chipTextColors[discount] || (isNoble ? '#fff' : '#121212')}">
		{#if score > 0}
			{score}
		{/if}
	</p>

	<div class="costs">
		{#if !isPurchased}
			{#each costs as cost, i}
				{#if cost > 0}
					<p class="cost" style="--bg-color: {chipColors[i]}; --text-color: {chipTextColors[i]}">
						{cost}
					</p>
				{/if}
			{/each}
		{/if}
	</div>

	{#if !isNoble && !isPurchased}
		<div class="card-options">
			<button
				on:click={() =>
					dispatchMove(
						{ storeName: 'cardStore', action: 'purchase', args: [$playerStore, index] },
						game
					)}
				disabled={isPurchased || isNoble || !purchasable}
			>
				Buy
			</button>

			{#if !isReserved}
				<button
					on:click={() =>
						dispatchMove(
							{ storeName: 'cardStore', action: 'reserve', args: [$playerStore, index] },
							game
						)}
					disabled={isPurchased || isNoble || !canPlayerReserve}
				>
					Reserve
				</button>
			{/if}
		</div>
	{/if}
</div>

<style>
	.card-options {
		grid-row: 1;
		grid-column: 1 / -1;
		height: 100%;
		width: 100%;
		background: rgba(0, 0, 0, 0.2);
		transition-duration: 0.2s;
		opacity: 0;
		pointer-events: none;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
		gap: 7px;
		box-sizing: border-box;
		padding-bottom: 7px;
	}

	.card:hover .card-options {
		opacity: 1;
	}

	.card:hover .card-options button {
		pointer-events: all;
	}

	.card-options button {
		padding: 4px 0;
		text-align: center;
		width: calc(100% - 13px);
		border-radius: 4px;
		background: rgba(255, 255, 255, 0.85);
		transition-duration: 0.15s;
	}

	.card-options button:not(:disabled):hover {
		transform: translateY(-1px);
		background: rgba(255, 255, 255, 1);
	}

	.card-options button:disabled {
		opacity: 0.3;
	}

	.card {
		width: var(--card-width);
		height: var(--card-height);
		background: var(--card-color);
		background-size: cover;
		background-repeat: no-repeat;
		position: relative;
		box-shadow: var(--drop-shadow);

		display: grid;
		grid-template-columns: repeat(2, 50%);
		transition-duration: 0.2s;
	}

	.card,
	.card-options {
		border-radius: 4px;
	}

	.card.isNoble {
		height: var(--card-width);
		background: var(--image, var(--card-color));
		background-size: cover;
		background-repeat: no-repeat;
	}

	.card.isPurchased {
		width: calc(var(--card-width) / 2);
		height: calc(var(--mini-card-height));
	}

	.card.isPurchased .score {
		font-size: 20px;
	}

	.card.isPurchased .costs {
		padding: 0;
	}

	.score {
		grid-row: 1;
		grid-column: 1;
	}

	.costs {
		grid-row: 1;
		grid-column: 2;
	}

	@media (max-width: 960px) {
		.card.isPurchased .score {
			font-size: 17px;
			padding: 4px;
		}
	}

	.card:not(.isNoble):not(.isPurchased):hover {
		cursor: pointer;
		transform: translateY(-2px);
	}

	.score {
		font-size: 25px;
		font-weight: bold;
		padding: 8px;
	}

	.card:not(.isNoble) .costs {
		background: #fafafa;
	}

	.costs {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: flex-end;
		gap: 3px;
		border-radius: 0 4px 4px 0px;
		padding: 8px;
	}

	@media (max-width: 960px) {
		.card.isNoble {
			grid-template-columns: 1fr;
		}

		.card.isNoble > * {
			grid-column: 1;
			grid-row: 1;
		}

		.card.isNoble .costs {
			display: grid;
			grid-template-columns: 1fr 1fr;
			grid-template-rows: 1fr 1fr;
			justify-content: flex-end;
		}

		.card.isNoble .cost:first-child {
			grid-column: 1 / -1;
		}

		.card.isNoble .cost:last-child {
			grid-column: 2;
		}

		.card.isNoble .cost {
			justify-self: flex-end;
		}
	}

	.cost {
		width: var(--cost-size);
		height: var(--cost-size);
		border-radius: 50%;
		padding: var(--cost-padding);
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--bg-color);
		color: var(--text-color);
	}

	@media (max-width: 720px) {
		.costs {
			align-items: center;
		}

		.card.isPurchased .score {
			font-size: 15px;
			padding: 4px 2px;
		}

		.score {
			font-size: 22px;
		}
	}
</style>
