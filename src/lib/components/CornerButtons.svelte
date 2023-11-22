<script lang="ts">
	import { playerStore } from '$lib/stores';
	import { dispatch } from '$lib/utils/dispatch.js';
	import { chatStore } from '$lib/stores';
	import { fade, fly } from 'svelte/transition';
	import { CHAT_FLY_DURATION } from '$lib/constants';

	const emojis = ['🤬', '👹', '😌', '🐦', '😕', '😤'].map((text) =>
		text.replace(/[\u00A0-\u00FF]/g, function (c) {
			return '&#' + c.charCodeAt(0) + ';';
		})
	);

	async function sendEmoji(emoji: string, player: number) {
		await fetch('/chat', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ emoji, player })
		});
	}

	$: console.log($chatStore);
</script>

<div class="corner" class:left={$playerStore === 0}>
	<div class="switch-turn">
		<p>
			<span>Player {$playerStore + 1}&#8217;s turn.</span>
			<button
				on:click={() =>
					dispatch({ storeName: 'playerStore', action: 'nextTurn', args: [$playerStore] })}
			>
				Switch.
			</button>
		</p>
	</div>

	<div class="emojis-container">
		{#each [0, 1] as player}
			<div class="emojis">
				{#each emojis as emoji}
					<button on:click={() => sendEmoji(emoji, player)}>
						{@html emoji}
					</button>
				{/each}
			</div>
		{/each}
	</div>

	<div class="emoji-chats">
		{#each $chatStore as { emoji, player }}
			<div
				class:left={player === 0}
				in:fly={{ x: (player ? '' : '-') + '100vw', duration: CHAT_FLY_DURATION }}
				out:fade={{ duration: 2000 }}
			>
				{emoji}
			</div>
		{/each}
	</div>
</div>

<style>
	.emojis-container {
		display: flex;
		justify-content: space-between;
		padding-top: 16px;
    pointer-events: none;
	}

	.emoji-chats {
		pointer-events: none;
		position: relative;
    z-index: 100;
	}

	.emoji-chats div {
		position: absolute;
		font-size: 80px;
	}

	.emoji-chats div.left {
		right: 0;
	}

	.emoji-chats div:not(.left) {
		left: 0;
	}

	.corner {
		grid-column: 1 / -1;
		grid-row: 1;
		position: relative;
	}

	.switch-turn button {
		all: unset;
		font-size: inherit;
		border-bottom: 1px solid rgba(0, 0, 0, 0.2);
		transition-duration: 0.2s;
		pointer-events: all;
	}

	.switch-turn {
		position: absolute;
		left: 0;
		transition-duration: 0.3s;
	}

	.switch-turn p {
		white-space: pre;
		display: flex;
		align-items: start;
		gap: 3px;
	}

	.corner:not(.left) .switch-turn {
		left: 100%;
		transform: translateX(-100%);
	}

	.emojis button {
		border: none;
		margin-right: 3px;
		font-size: 20px;
		padding: 0;
    pointer-events: all;
	}

	.emojis {
		margin-top: 3px;
	}

	button:hover {
		cursor: pointer;
	}

	.emojis button:hover {
		transform: scale(1.2);
	}
</style>
