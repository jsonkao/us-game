<script>
	import Card from '$lib/Card.svelte';
	import { chipColors } from '$lib/colors.js';
	import { tokenStore, cardStore, playerStore } from '$lib/stores.js';

	import { flip } from 'svelte/animate';
	import { send, receive } from '$lib/transition.js';

	export let player = 0;
</script>

<div>
	<p class:my-turn={player === $playerStore}>Player {player}</p>

	<div class="token-container">
		{#each [0, 1, 2, 3, 4] as color}
			{@const tokens = $tokenStore.filter(
				(token) => token.owner === player && token.color === color
			)}
			<div class="tokens">
				{#each tokens as token, i (token.id)}
					<button
						in:receive={{ key: token.id }}
						out:send={{ key: token.id }}
						animate:flip
						style="--color: {chipColors[color]}; transform: translateX({(i - 2) * 8}px);"
					/>
				{/each}
			</div>
		{/each}
	</div>

	{#each $cardStore.filter((card) => card.owner === player) as card (card.index)}
		<div in:receive={{ key: card.index }} out:send={{ key: card.index }} animate:flip>
			<Card {card} isPurchased />
		</div>
	{/each}
</div>

<style>
	.token-container {
		--size: 60px;
		display: flex;
		height: var(--size);
	}

	.tokens {
		display: grid;
		gap: 7px;
		margin-bottom: 8px;
	}

	button {
		all: unset;
		width: var(--size);
		height: var(--size);
		background: var(--bg-color);
		border-radius: 50%;
		box-shadow: inset 0 0 0 5px var(--color);
		grid-row: 1;
		grid-column: 1;
		transform: translateX(calc(var(--index) * 8px));
	}

	.my-turn {
		font-weight: bold;
	}
</style>
