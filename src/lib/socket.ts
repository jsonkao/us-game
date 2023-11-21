import { dispatch } from '$lib/dispatch';
import supabase from '$lib/client-database';

export function beginSocket() {
	const channel = supabase.channel('moves');

	// Listen to inserts
	channel
		.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'moves' }, handleInsert)
		.on('broadcast', { event: 'restart' }, () => window.location.reload())
		.subscribe();

	function handleInsert(payload) {
		const move: Move = payload.new;

		// Dispatches the move even if it's the same client that sent it, should be fine unless a crazy race condition happens
		dispatch(move, false);
	}
}
