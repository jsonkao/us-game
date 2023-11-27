import { enactMove } from '$lib/utils/dispatch';
import { chatStore, presenceStore } from '$lib/stores';
import supabase from '$lib/client-database';
import { browser } from '$app/environment';
import type { Move } from '$lib/types/schema';

const uid = 'id' + Math.random().toString(16).slice(2);

const makeChannel = () => supabase.channel('moves', { config: { presence: { key: uid } } });
let channel = makeChannel();

export function beginSocket(game: number) {
	if (channel.state === 'joined') {
		supabase
			.removeChannel(channel /* 'moves' */)
			.then(() => {
				channel = makeChannel();
				beginSocket(game);
			})
			.catch(() => {});
		return;
	}

	// Listen to inserts
	channel
		.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Move' }, handleInsert)
		.on('broadcast', { event: 'emoji' }, ({ payload: { emoji, player } }) =>
			chatStore.add(emoji, player)
		)
		.on('broadcast', { event: 'restart' }, () => browser && window.location.reload())
		.on('presence', { event: 'sync' }, () => presenceStore.set(channel.presenceState()))
		.subscribe();

	function handleInsert(payload: { new: Move }) {
		const move = payload.new;
		console.log(move);
		if (move.game === game) enactMove(move);
	}

	fetch(`https://ipapi.co/region/`)
		.then((res) => res.text())
		.then((location) => {
			const presence: Presence = { location, game };
			channel.track(presence);
		});
}

export function broadcastEmoji(emoji: string, player: number) {
	channel.send({
		type: 'broadcast',
		event: 'emoji',
		payload: { emoji, player }
	});
}

export function restartGame() {
	channel.send({
		type: 'broadcast',
		event: 'restart',
		payload: { restart: true }
	});
}
