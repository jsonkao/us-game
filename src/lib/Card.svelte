<script>
	import { chipColors } from '$lib/colors.js';
	import { cardStore, playerStore } from '$lib/stores.js';

	export let card = {};
	export let isNoble = false;
	export let isPurchased = false;

	let { costs, score, index, discount } = card;
</script>

<button
	class="card"
	class:isNoble
	class:isPurchased
	style="--card-color: {chipColors[discount]}"
	on:click={() => cardStore.purchase($playerStore, index)}
>
	<p class="score">
		{#if score > 0}
			{score}
		{/if}
	</p>

	{#if !isPurchased}
		<div class="costs">
			{#each costs as cost, i}
				{#if cost > 0}
					<p class="cost" style="--color: {chipColors[i]}">
						{cost}
					</p>
				{/if}
			{/each}
		</div>
	{/if}
</button>

<style>
	.card {
		all: unset;
		width: var(--card-width);
		height: var(--card-height);
		background: var(--card-color);
		position: relative;
		border-radius: 4px;
		box-shadow: var(--drop-shadow);

		display: grid;
		grid-template-columns: repeat(2, 1fr);
	}

	.card.isNoble {
		height: var(--card-width);
	}

	.card.isPurchased {
		width: calc(var(--card-width) / 2);
		height: calc(var(--card-height) / 2);
	}

	.card:hover {
		cursor: pointer;
	}

	.score {
		font-size: 25px;
		font-weight: bold;
		padding: 8px;
	}

	.costs {
		background: #fafafa;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: flex-end;
		gap: 3px;
		border-radius: 0 4px 4px 0px;
		padding: 8px;
	}

	.cost {
		--size: 12px;
		width: var(--size);
		height: var(--size);
		border-radius: 50%;
		padding: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color);
	}
</style>
