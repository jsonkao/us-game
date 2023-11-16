<script>
	import { chipColors } from '$lib/colors.js';

	export let card = {};
	export let stackHeight = 0;
	export let level = 0;
	export let isNoble = false;

	let { costs, score } = card;
</script>

<button class="card" class:isStack={stackHeight} class:isNoble>
	{#if stackHeight > 0}
		<div class="stack-height">
			<p>{stackHeight} cards</p>
			<p class="dots">
				{@html '&bull;'.repeat(level + 1)}
			</p>
		</div>
	{:else}
		<div class="card-inner">
			<p class="score">
				{#if score > 0}
					{score}
				{/if}
			</p>

			<div class="costs">
				{#each costs as cost, i}
					{#if cost > 0}
						<p class="cost" style="--color: {chipColors[i]}">
							{cost}
						</p>
					{/if}
				{/each}
			</div>
		</div>
	{/if}
</button>

<style>
	.card {
		all: unset;
		width: var(--card-width);
		height: 160px;
		background: #fafafa;
		position: relative;
		border-radius: 4px;
		--drop-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
		box-shadow: var(--drop-shadow);
	}

	.card.isNoble {
		height: var(--card-width);
	}

	.card:hover {
		cursor: pointer;
	}

	.card-inner {
		--padding: 8px;
		padding: var(--padding);
		height: calc(100% - var(--padding) * 2);
		display: flex;
		justify-content: space-between;
		position: relative;
	}

	.score {
		font-size: 25px;
		font-weight: bold;
	}

	.costs {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: flex-end;
		gap: 3px;
	}

	.cost {
		--size: 12px;
		width: var(--size);
		height: var(--size);
		border-radius: 50%;
		padding: 8px;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #f5eee6;
		box-shadow: inset 0 0 0 3px var(--color);
		background: var(--color);
	}

	.stack-height {
		position: absolute;
		bottom: 10px;
		text-align: center;
		left: 50%;
		transform: translateX(-50%);
	}

	.stack-height p {
		white-space: pre;
	}

	.card.isStack {
		/* Make an inset double black border */
		box-shadow:
			inset 0 0 0 2px black,
			inset 0 0 0 3px white,
			inset 0 0 0 5px black,
			var(--drop-shadow);
	}
</style>
