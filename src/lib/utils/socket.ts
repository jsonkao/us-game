import { enactMove } from '$lib/utils/dispatch';
import { chatStore, presenceStore } from '$lib/stores';
import supabase from '$lib/client-database';
import { browser } from '$app/environment';

const uid = 'id' + Math.random().toString(16).slice(2);

const makeChannel = () => supabase.channel('moves', { config: { presence: { key: uid } } });
let channel = makeChannel();

export function beginSocket(game: number) {
	if (channel.state === 'joined') {
		supabase
			.removeChannel('moves')
			.then(() => {
				channel = makeChannel();
				beginSocket(game);
			})
			.catch(() => {});
		return;
	}

	// Listen to inserts
	channel
		.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'moves' }, handleInsert)
		.on('broadcast', { event: 'emoji' }, ({ payload: { emoji, player } }) =>
			chatStore.add(emoji, player)
		)
		.on('broadcast', { event: 'restart' }, () => browser && window.location.reload())
		.on('presence', { event: 'sync' }, () => presenceStore.set(channel.presenceState()))
		.subscribe();

	function handleInsert(payload) {
		const move: Move = payload.new;
		if (move.game === game) enactMove(move);
	}

	// Use getLocation to add a location to the game using presence channel
	fetch('/location')
		.then((res) => res.text())
		.then((location) => channel.track({ location }));
}

export function broadcastEmoji(emoji: string, player: number) {
	chatStore.add(emoji, player);
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

async function getLocation(ip: string) {
	if (ip === '127.0.0.1') return 'localhost';

	const response = await (await fetch(`https://ipapi.co/${ip}/region/`)).text();
	return response;
}
