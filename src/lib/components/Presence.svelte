<script>
	import { presenceStore } from '$lib/stores';

	$: locations = Object.keys($presenceStore).map((key) => $presenceStore[key][0].location);
	$: uniqueLocations = [...new Set(locations)];
</script>

{#if locations.length}
	<div>
		<p>
			{locations.length} online in
			{#each uniqueLocations as location}
				<span>{location}</span>
			{/each}
		</p>
	</div>
{/if}

<style>
	div {
		margin-top: 8px;
		display: flex;
		grid-column: 1 / -1;
		justify-content: center;
	}

	p {
		font-size: inherit;
	}

	span:not(:last-child)::after {
		content: ' and ';
	}
	span:last-child::after {
		content: '.';
	}
</style>
