<script>
	import Card from '$lib/Card.svelte';
	import Tokens from '$lib/Tokens.svelte';
	import { cardStore, nobleStore } from '$lib/stores.js';

	import { flip } from 'svelte/animate';
	import { send, receive } from '$lib/transition.js';

	export let player = 0;

	$: cards = $cardStore.filter((card) => card.owner === player);
	$: nobles = $nobleStore.filter((card) => card.owner === player);
</script>

<div>
	<Tokens owner={player} />

	<div class="cards-container" style="flex-direction: {player ? 'row-reverse' : 'row'}">
		{#each [0, 1, 2, 3, 4] as color (color)}
			<div class="cards" class:has-cards={cards.filter((c) => c.discount === color).length > 0}>
				{#each cards.filter((c) => c.discount === color) as card (card.index)}
					<div in:receive={{ key: card.index }} out:send={{ key: card.index }} animate:flip>
						<Card {card} />
					</div>
				{/each}
			</div>
		{/each}
	</div>

	<div class="nobles-container" style="flex-direction: {player ? 'row-reverse' : 'row'}">
		{#each nobles as card (card.index)}
			<div in:receive={{ key: card.index }} out:send={{ key: card.index }} animate:flip>
				<Card {card} isNoble />
			</div>
		{/each}
	</div>
</div>

<style>
	.cards-container {
		display: flex;
		margin-top: 12px;
	}

	.cards {
		display: grid;
		min-height: calc(var(--card-height) / 2);
		grid-template-columns: 1fr;
		grid-auto-rows: 38px;
		width: 0;
		transition-duration: 0.3s;
	}

	.has-cards {
		width: calc(var(--card-width) / 2 + 10px);
	}
</style>
