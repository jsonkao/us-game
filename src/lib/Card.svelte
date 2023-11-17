<script>
	import { chipColors, chipTextColors } from '$lib/colors.js';
	import { cardStore, playerStore } from '$lib/stores.js';

	export let card = {};
	export let isNoble = false;

	let { costs, score, index, discount, image } = card;
	let isPurchased = card.owner !== 'bank' && !isNoble;
</script>

<button
	class="card"
	class:isNoble
	class:isPurchased
	style="--card-color: {chipColors[discount]}; --image: url('{image}')"
	on:click={() => cardStore.purchase($playerStore, index)}
	disabled={isPurchased || isNoble}
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
</button>

<style>
	button {
		all: unset;
		width: var(--card-width);
		height: var(--card-height);
		background: var(--card-color);
		background-size: cover;
		background-repeat: no-repeat;
		position: relative;
		border-radius: 4px;
		box-shadow: var(--drop-shadow);

		display: grid;
		grid-template-columns: repeat(2, 50%);
		transition-duration: 0.2s;
	}

	button.isNoble {
		height: var(--card-width);
		background: var(--image, var(--card-color));
		background-size: cover;
		background-repeat: no-repeat;
	}

	button.isPurchased {
		width: calc(var(--card-width) / 2);
		height: calc(var(--card-height) / 2);
	}

	button.isPurchased .score {
		font-size: 20px;
	}

	button:not(.isNoble):hover {
		cursor: pointer;
		transform: translateY(-2px);
	}

	.score {
		font-size: 25px;
		font-weight: bold;
		padding: 8px;
	}

	button:not(.isNoble) .costs {
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
</style>
