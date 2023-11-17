<script>
	import { chipColors } from '$lib/colors.js';
	import { tokenStore, playerStore } from '$lib/stores.js';
	import { flip } from 'svelte/animate';
	import { send, receive } from '$lib/transition.js';

	export let owner;
</script>

<div
	class="container"
	style="justify-content: {owner === 'bank' ? 'center' : owner ? 'flex-end' : 'flex-start'}"
>
	{#each [0, 1, 2, 3, 4] as color}
		<div class="tokens">
			{#each $tokenStore
				.filter((token) => token.owner === owner && token.color === color)
				.sort((b, a) => b.lastModified - a.lastModified) as token, i (token.id)}
				<button
					in:receive={{ key: token.id }}
					out:send={{ key: token.id }}
					style="--color: {chipColors[color]};"
					animate:flip
					on:click={() => tokenStore.take($playerStore, token.id)}
				/>
			{/each}
		</div>
	{/each}
</div>

<style>
	.container {
		--size: 50px;
		--row-height: 5px;
		grid-column: 1 / -1;
		display: flex;
		height: calc(var(--size) + var(--row-height) * 3);
	}

	.tokens {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: repeat(4, var(--row-height));
		transition-duration: 0.15s;
	}

	button {
		all: unset;
		width: var(--size);
		height: var(--size);
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
