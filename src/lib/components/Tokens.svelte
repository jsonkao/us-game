<script lang="ts">
	import { chipColors } from '$lib/colors.js';
	import { tokenStore, playerStore } from '$lib/stores';
	import { dispatchMove } from '$lib/utils/dispatch';
	import { flip } from 'svelte/animate';
	import { send, receive } from '$lib/utils/helpers';
	import { getContext } from 'svelte';

	export let owner: Owner;

	const game: number = getContext('game');

	$: tokens = $tokenStore.filter((token) => token.owner === owner);
</script>

<div
	class="container"
	style="justify-content: {owner === 'bank' ? 'center' : owner ? 'flex-end' : 'flex-start'}"
>
	{#each [0, 1, 2, 3, 4] as color}
		<div class="tokens" class:has-tokens={tokens.filter((t) => t.color === color).length}>
			{#each tokens
				.filter((t) => t.color === color)
				.sort((b, a) => b.lastModified - a.lastModified) as { index } (index)}
				<button
					in:receive={{ key: index }}
					out:send={{ key: index }}
					style="--color: {chipColors[color]};"
					animate:flip
					on:click={() =>
						dispatchMove(
							{
								storeName: 'tokenStore',
								action: 'take',
								args: [owner === 'bank' ? $playerStore : 'bank', index]
							},
							game
						)}
				/>
			{/each}
		</div>
	{/each}
</div>

<style>
	.container {
		--row-height: 5px;
		grid-column: 1 / -1;
		display: flex;
		height: calc(var(--token-size) + var(--row-height) * 3);
		grid-row: 1;
	}

	.tokens {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: repeat(4, var(--row-height));
		transition-duration: 0.15s;
		width: 0;
		transition-duration: 0.3s;
	}

	.has-tokens {
		width: calc(var(--token-size) + 4px);
	}

	button {
		all: unset;
		width: var(--token-size);
		height: var(--token-size);
		background: var(--bg-color);
		border-radius: 50%;
		box-shadow:
			inset 0 0 0 3px var(--color),
			var(--drop-shadow);
	}

	.tokens:hover {
		--row-height: 8px;
	}
</style>
