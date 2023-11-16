<script>
	import Card from '$lib/Card.svelte';
	import { chipColors } from '$lib/colors.js';
	import { tokenStore, cardStore } from '$lib/stores.js';

	import { flip } from 'svelte/animate';
	import { send, receive } from '$lib/transition.js';

	export let player = 0;
</script>

<div>
	<div class="token-container" style="flex-direction: {player ? 'row-reverse' : 'row'}">
		{#each [0, 1, 2, 3, 4] as color (color)}
			{@const tokens = $tokenStore.filter(
				(token) => token.owner === player && token.color === color
			)}
			<div class="tokens" animate:flip>
				{#each tokens as token, i (token.id)}
					<button
						in:receive={{ key: token.id }}
						out:send={{ key: token.id }}
						animate:flip
						style="--color: {chipColors[color]}; transform: translateX({i * 8}px);"
					/>
				{/each}
			</div>
		{/each}
	</div>

	<div class="cards-container" style="flex-direction: {player ? 'row-reverse' : 'row'}">
		{#each [0, 1, 2, 3, 4] as color (color)}
			<div class="cards" animate:flip>
				{#each $cardStore.filter((card) => card.owner === player && card.discount === color) as card (card.index)}
					<div in:receive={{ key: card.index }} out:send={{ key: card.index }} animate:flip class="card-container">
						<Card {card} isPurchased />
					</div>
				{/each}
			</div>
		{/each}
	</div>
</div>

<style>
	.token-container {
		--size: 60px;
		display: flex;
		height: var(--size);
		margin-bottom: 14px;
	}

	.tokens {
		display: grid;
		gap: 7px;
	}

	button {
		all: unset;
		width: var(--size);
		height: var(--size);
		background: var(--bg-color);
		border-radius: 50%;
		box-shadow: inset 0 0 0 3px var(--color);
		grid-row: 1;
		grid-column: 1;
	}

	.cards-container {
		display: flex;
		gap: 10px;
	}

	.card-container {
		height: 40px;
	}

	.cards {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}
</style>
