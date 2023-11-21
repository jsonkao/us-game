import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { dispatch } from '$lib/dispatch';

const PUBLIC_SUPABASE_ANON_KEY =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjbG9yY3pvd3Fxdm11bXZmdHNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDA1Mjk5MjAsImV4cCI6MjAxNjEwNTkyMH0.mBthRtU0DxNOdyJ1aIuQy-pE82IxPLqCGw61m8p0Q0c';

const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

export function beginSocket() {
	const channel = supabase.channel('moves');

	// Listen to inserts
	channel
		.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'moves' }, handleInsert)
		.on('broadcast', { event: 'restart' }, () => window.location.reload())
		.subscribe();

	// Create a function to handle inserts
	function handleInsert(payload) {
		const move: Move = payload.new;

		// Dispatches the move even if it's the same client that sent it, should be fine unless a crazy race condition happens
		dispatch(move, false);
	}
}
