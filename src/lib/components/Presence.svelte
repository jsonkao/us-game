<script lang="ts">
	import { presenceStore } from '$lib/stores';
	import { getContext } from 'svelte';

	export let gameProp: number | undefined = undefined;
	export let isSmall = false;

	const game = getContext('game');

	$: locations = Object.values($presenceStore)
		.filter((d) => d[0] && d[0].game === (gameProp || game))
		.map((d) => (d[0] ? d[0].location : 'Unknown'));
	$: uniqueLocations = [...new Set(locations)];
</script>

<div class:is-small={isSmall}>
	<p>
		{locations.length} online{#if uniqueLocations.length === 0}.{/if}
		{#each uniqueLocations as location, i}
			<span
				>{location}{#if i === uniqueLocations.length - 1}.{/if}</span
			>
		{/each}
	</p>
</div>

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

	div.is-small p {
		font-size: 0.8em;
		color: #888;
	}
</style>
