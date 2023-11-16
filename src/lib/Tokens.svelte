<script>
	import { chipColors } from '$lib/colors.js';

	export let tokens = [];
</script>

<div class="tokens">
	{#each tokens as token, i}
		<div class="token" style="box-shadow: inset 0 0 0 5px {chipColors[i]}">
			{token}
    </div>
	{/each}
</div>

<style>
	.tokens {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 7px;
	}

	.token {
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		--size: 60px;
		width: var(--size);
		height: var(--size);
	}
</style>
