<script>
	import { presenceStore } from '$lib/stores';
	import { getContext } from 'svelte';

	const game = getContext('game');

	$: locations = Object.values($presenceStore)
		.filter((d) => d[0] && d[0].game === game)
		.map((d) => (d[0] ? d[0].location : 'Unknown'));
	$: uniqueLocations = [...new Set(locations)];
</script>

{#if locations.length}
	<div>
		<p>
			{locations.length} online
			{#each uniqueLocations as location}
				<span>{location}</span>
			{/each}
		</p>
	</div>
{/if}

<style>
	div {
		display: flex;
		grid-column: 1 / -1;
		justify-content: center;
	}

	span:first-child::before {
		content: ' in ';
	}

	span:not(:last-child)::after {
		content: ' and ';
	}

	p::after {
		content: '.';
	}
</style>
