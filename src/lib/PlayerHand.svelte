<script>
	import Card from '$lib/Card.svelte';
	import Tokens from '$lib/Tokens.svelte';
	import { cardStore } from '$lib/stores.js';

	import { flip } from 'svelte/animate';
	import { slide } from 'svelte/transition';
	import { send, receive } from '$lib/transition.js';

	export let player = 0;

	$: cards = $cardStore.filter((card) => card.owner === player);
</script>

<div>
	<Tokens owner={player} />

	<div class="cards-container" style="flex-direction: {player ? 'row-reverse' : 'row'}">
		{#each [0, 1, 2, 3, 4] as color (color)}
			{#if cards.filter((c) => c.discount === color).length}
				<div class="cards" transition:slide={{ axis: 'x' }}>
					{#each cards.filter((c) => c.discount === color) as card (card.index)}
						<div in:receive={{ key: card.index }} out:send={{ key: card.index }} animate:flip>
							<Card {card} />
						</div>
					{/each}
				</div>
			{/if}
		{/each}
	</div>
</div>

<style>
	.cards-container {
		display: flex;
		gap: 8px;
		margin-top: 12px;
	}

	.cards {
		display: grid;
		min-height: calc(var(--card-height) / 2);
		grid-template-columns: 1fr;
		grid-auto-rows: 38px;
	}
</style>
