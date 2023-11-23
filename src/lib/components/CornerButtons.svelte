<script lang="ts">
	import { playerStore } from '$lib/stores';
	import { dispatchMove } from '$lib/utils/dispatch';
	import { chatStore } from '$lib/stores';
	import { fade, fly } from 'svelte/transition';
	import { broadcastEmoji } from '$lib/utils/socket';
	import { getContext } from 'svelte';

	const game = getContext('game');

	const CHAT_FLY_DURATION = 900;

	const emojis = ['👹', '😌', '🙂', '🤬', '😟', '⌛️'].map((text) =>
		text.replace(/[\u00A0-\u00FF]/g, function (c) {
			return '&#' + c.charCodeAt(0) + ';';
		})
	);

	let switchTurnWidth = 200;
</script>

<div class="corner" class:left={$playerStore === 0}>
	<div class="switch-turn">
		<p bind:clientWidth={switchTurnWidth} style="--width: {switchTurnWidth}px">
			<span>Player {$playerStore + 1}&#8217;s turn.</span>
			<button
				on:click={() =>
					dispatchMove(
						{ storeName: 'playerStore', action: 'nextTurn', args: [$playerStore] },
						game
					)}
			>
				Switch.
			</button>
		</p>
	</div>

	<div class="emojis-container">
		{#each [0, 1] as player}
			<div class="emojis">
				{#each emojis as emoji}
					<button on:click={() => broadcastEmoji(emoji, player)}>
						{@html emoji}
					</button>
				{/each}
			</div>
		{/each}
	</div>

	<div class="emoji-chats">
		{#each $chatStore as { emoji, player, id, style } (id)}
			<div
				class:left={player === 0}
				in:fly={{
					x: (player ? '' : '-') + '100vw',
					duration: CHAT_FLY_DURATION
				}}
				out:fade={{ duration: 2000 }}
				on:introend={() => chatStore.remove(id)}
				{style}
			>
				<span class="animate">
					<span>
						{emoji}
					</span>
				</span>
			</div>
		{/each}
	</div>
</div>

<style>
	.emojis-container {
		display: flex;
		justify-content: space-between;
		pointer-events: none;
	}

	.emoji-chats {
		pointer-events: none;
		position: relative;
		z-index: 100;
		width: 100%;
	}

	.emoji-chats div {
		position: absolute;
		font-size: 80px;
	}

	.animate {
		--bounce-height: -120px;
		display: block;
		animation: bounce 0.35s infinite alternate;
	}

	.animate span {
		display: block;
		transform: rotate(var(--rotate));
	}

	@keyframes bounce {
		from {
			transform: translateY(0px) rotate(0deg);
		}
		to {
			transform: translateY(var(--bounce-height)) rotate(60deg);
		}
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
		pointer-events: none;
	}

	.switch-turn button {
		all: unset;
		font-size: inherit;
		border-bottom: 1px solid rgba(0, 0, 0, 0.2);
		transition-duration: 0.2s;
		pointer-events: all;
	}

	.switch-turn {
		position: relative;
	}

	.switch-turn p {
		position: relative;
		left: 0;
		transition-duration: 0.3s;
		white-space: pre;
		display: inline-flex;
		align-items: start;
		gap: 3px;
	}

	.corner:not(.left) .switch-turn p {
		left: 100%;
		transform: translateX(calc(-1 * var(--width)));
	}

	.emojis button {
		all: unset;
		font-size: 30px;
		pointer-events: all;
		transition-duration: 0.2s;
	}

	.emojis {
		margin-top: 3px;
		display: flex;
		gap: 3px;
	}

	button:hover {
		cursor: pointer;
	}

	@media (max-width: 960px) {
		.emojis button {
			font-size: 25px;
		}
	}
</style>
