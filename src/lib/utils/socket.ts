import { dispatch } from '$lib/utils/dispatch';
import { seed } from '$lib/utils/helpers';
import { chatStore } from '$lib/stores';
import supabase from '$lib/client-database';

const channel = supabase.channel('moves');

export function beginSocket() {
	// Listen to inserts
	channel
		.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'moves' }, handleInsert)
		.on('broadcast', { event: 'restart' }, () => window.location.reload())
		.on('broadcast', { event: 'chat' }, ({ payload: { emoji, player } }) =>
			chatStore.add(emoji, player)
		)
		.subscribe();

	function handleInsert(payload) {
		const move: Move = payload.new;
		if (move.seed === seed) dispatch(move, false);
	}
}

export function broadcastEmoji({ emoji, player }) {
	chatStore.add(emoji, player);
	channel.send({
		type: 'broadcast',
		event: 'chat',
		payload: { emoji, player }
	});
}
