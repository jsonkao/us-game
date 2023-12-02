<script lang="ts">
	import CardComponent from '$lib/components/Card.svelte';

	export let card: Card;
</script>

<div class="reserved-card">
	<div class="front">
		<CardComponent {card} />
	</div>
	<div class="back" />
</div>

<style>
	.reserved-card {
		width: var(--card-width);
		display: grid;
		cursor: pointer;
	}

	.reserved-card div {
		backface-visibility: hidden;
		grid-row: 1;
		grid-column: 1;
		width: 100%;
		height: 100%;
		transition: all 0.4s ease;
	}

	.front {
		transform: perspective(400px) rotateY(-179.9deg);
	}

	.back {
		transform: perspective(400px) rotateY(0deg);
		background: rgba(0, 0, 0, 0.1);
		box-shadow: var(--drop-shadow);
		border-radius: 4px;
	}

	.reserved-card:hover .front {
		transform: perspective(400px) rotateY(0deg);
	}

	.reserved-card:hover .back {
		transform: perspective(400px) rotateY(179.9deg);
	}
</style>
