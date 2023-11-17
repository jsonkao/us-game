<script>
	import { chipColors, chipTextColors } from '$lib/colors.js';
	import { cardStore, playerStore } from '$lib/stores.js';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';

	export let card = {};
	export let isNoble = false;
	export let imagePromise;

	let { costs, score, index, discount } = card;
	let isPurchased = card.owner !== 'bank';

	let image;
	onMount(async () => {
		if (imagePromise) {
			image = `--image: url('${base}${(await imagePromise).default}')`;
		}
	});
</script>

<button
	class="card"
	class:isNoble
	class:isPurchased
	style="--card-color: {chipColors[discount]}; {image}"
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
		--size: 12px;
		width: var(--size);
		height: var(--size);
		border-radius: 50%;
		padding: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--bg-color);
		color: var(--text-color);
	}
</style>
