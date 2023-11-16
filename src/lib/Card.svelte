<script>
	import { chipColors } from '$lib/colors.js';

	export let card = {};
	export let stackHeight = 0;
	export let level = 0;

	let { costs, score } = card;
</script>

<button class="card" class:isStack={stackHeight}>
	{#if stackHeight > 0}
		<div class="stack-height">
			<p>{stackHeight} cards</p>
			<p class="dots">
				{@html '&bull;'.repeat(level + 1)}
			</p>
		</div>
	{:else}
		<div class="card-inner">
			<p class="score">{score}</p>

			<div class="costs">
				{#each costs as cost, i}
					{#if cost > 0}
						<p class="cost" style="background-color: {chipColors[i]}">
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
		height: 190px;
		background: #fafafa;
		position: relative;
	}

  .card:hover {
    cursor: pointer;
  }

	.card-inner {
		padding: 10px;
		display: flex;
		justify-content: space-between;
		position: relative;
	}

	.score {
		font-size: 2rem;
		font-weight: bold;
	}

	.costs {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: flex-end;
		gap: 4px;
	}

	.cost {
		width: 20px;
		border-radius: 50%;
		padding: 10px;
		aspect-ratio: 1 / 1;
		text-align: center;
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
			inset 0 0 0 5px black;
	}
</style>
