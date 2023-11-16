<script>
	import Card from '$lib/Card.svelte';

	export let nobles = [];
</script>

<div class="container">
	<p>Nobles</p>

	<div class="cards">
		{#each nobles as card}
			<Card {card} isNoble />
		{/each}
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}

	.cards {
		display: flex;
		column-gap: 4px;
	}
</style>
