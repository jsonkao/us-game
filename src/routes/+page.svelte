<script lang="ts">
	import type { PageData } from './$types';
	import { browser } from '$app/environment';

	import { offline } from '$lib/utils/helpers';
	import { beginHomepagePresence } from '$lib/utils/socket';

	import Presence from '$lib/components/Presence.svelte';
	import HomeCard from '$lib/components/HomeCard.svelte';

	export let data: PageData;

	let { games, scores } = data;

	$: browser && !offline && beginHomepagePresence();
</script>

<div class="vertical-center">
	<div class="home">
		{#each games as { id, created_at }}
			<HomeCard href="/games/{id}">
				<h2>Game {id}</h2>
				<h2>{scores[id]?.join(' – ')}</h2>
				<div>
					<Presence gameProp={id} isSmall />
					<p class="date">
						Began {new Date(created_at).toLocaleDateString('en-us', {
							weekday: 'long',
							month: 'short',
							day: 'numeric'
						})}.
					</p>
				</div>
			</HomeCard>
		{/each}

		<HomeCard href="/games/new" justify="center">
			<h2>New Game</h2>
		</HomeCard>
	</div>
</div>

<style>
	.vertical-center {
		height: 100vh;
		display: flex;
		align-items: center;
	}

	.home {
		--home-card-size: 180px;
		--items-per-row: 3;
		--gap: 8px;

		margin: 0 auto;
		width: calc(
			var(--home-card-size) * var(--items-per-row) + var(--gap) * (var(--items-per-row) - 1)
		);
		display: flex;
		flex-wrap: wrap;
		gap: var(--gap);
		justify-content: center;
	}

	h2,
	p {
		text-align: center;
	}

	/* Make the .date element smaller and gray */
	.date {
		font-size: 0.8em;
		color: #888;
		margin-top: 3px;
	}

	@media (max-width: 960px) {
		.home {
			--home-card-size: 174px;
			--items-per-row: 2;
		}
	}
</style>
