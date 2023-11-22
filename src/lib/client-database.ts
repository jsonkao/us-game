import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';

const PUBLIC_SUPABASE_ANON_KEY =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjbG9yY3pvd3Fxdm11bXZmdHNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDA1Mjk5MjAsImV4cCI6MjAxNjEwNTkyMH0.mBthRtU0DxNOdyJ1aIuQy-pE82IxPLqCGw61m8p0Q0c';

const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

export async function getMoves(): Promise<Move[]> {
	let { data, error } = await supabase.from('moves').select('*');

	if (error) {
		return [];
		throw error;
	}

	const moves: Array<Move> = (data || []).map(({ storeName, action, args, id, seed }) => ({
		storeName,
		action,
		args: JSON.parse(args),
		id,
		seed
	}));

	return moves;
}

export default supabase;
