import { enactMove } from '$lib/utils/dispatch';
import { chatStore } from '$lib/stores';
import supabase from '$lib/client-database';
import { dev, browser } from '$app/environment';

let channel = supabase.channel('moves');
export function beginSocket(game: number) {
	if (dev) {
		supabase
			.removeChannel('moves')
			.then(() => (channel = supabase.channel('moves')))
			.catch(() => {});
	}

	// Listen to inserts
	channel
		.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'moves' }, handleInsert)
		.on('broadcast', { event: 'emoji' }, ({ payload: { emoji, player } }) =>
			chatStore.add(emoji, player)
		)
		.subscribe();

	function handleInsert(payload) {
		const move: Move = payload.new;
		if (move.game === game) enactMove(move);
	}

	supabase
		.channel('restartGame')
		.on(
			'broadcast',
			{ event: 'restart' },
			() => console.log('testing') || window.location.reload()
		);

	supabase
		.channel('startNewGame')
		.on('broadcast', { event: 'restart' }, () => browser && window.location.reload());
}

export function broadcastEmoji(emoji: string, player: number) {
	chatStore.add(emoji, player);
	channel.send({
		type: 'broadcast',
		event: 'emoji',
		payload: { emoji, player }
	});
}
