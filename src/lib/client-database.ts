import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';

const PUBLIC_SUPABASE_ANON_KEY =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjbG9yY3pvd3Fxdm11bXZmdHNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDA1Mjk5MjAsImV4cCI6MjAxNjEwNTkyMH0.mBthRtU0DxNOdyJ1aIuQy-pE82IxPLqCGw61m8p0Q0c';

const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

export async function getMoves(game: number): Promise<Move[]> {
	let { data, error } = await supabase.from('moves').select('*');

	if (error) {
		throw error;
	}

	const moves: Array<Move> = (data || [])
		.map(({ storeName, action, args, id, game }) => ({
			storeName,
			action,
			args: JSON.parse(args),
			id,
			game
		}))
		.filter((m) => game === m.game);

	return moves;
}

export async function getCurrentGame(): number {
	let { data, error } = await supabase
		.from('games')
		.select('*')
		.order('id', { ascending: false })
		.limit(1);

	if (error) {
		throw error;
	}
	if (!error && data.length > 0) return data[0].id;
}

export async function getGameData(gameArg = null) {
	let game = gameArg === null ? await getCurrentGame() : gameArg;
	return { moves: await getMoves(game), game };
}

export default supabase;
