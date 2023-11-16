<script>
	import { chipColors } from '$lib/colors.js';
	import { tokenStore, playerStore } from '$lib/stores.js';
	import { flip } from 'svelte/animate';
	import { send, receive } from '$lib/transition.js';
</script>

<div class="container">
	{#each [0, 1, 2, 3, 4] as color}
		<div class="tokens">
			{#each $tokenStore.filter((token) => token.owner === 'bank' && token.color === color) as token, i (token.id)}
				<div
					in:receive={{ key: token.id }}
					out:send={{ key: token.id }}
					animate:flip
					style="--color: {chipColors[color]}"
				>
					<button on:click={() => tokenStore.take($playerStore, [token.id])} />
				</div>
			{/each}
		</div>
	{/each}
</div>

<style>
	.container {
		grid-column: 1 / -1;
		display: flex;
		justify-content: center;
	}

	.tokens {
		--size: 60px;
		display: grid;
		align-items: center;
		justify-content: center;
		gap: 7px;
		margin-bottom: 8px;
		width: var(--size);
	}

	button {
		all: unset;
		width: var(--size);
		height: var(--size);
		background: var(--bg-color);
		border-radius: 50%;
		box-shadow: inset 0 0 0 3px var(--color), var(--drop-shadow);
		grid-row: 1;
		grid-column: 1;
		transform: translateX(calc(var(--index) * 8px));
	}

	.tokens div:not(:last-child) {
		height: 1px;
	}
</style>
