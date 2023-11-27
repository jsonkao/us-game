import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { Database } from '$lib/types/supabase';

const PUBLIC_SUPABASE_ANON_KEY =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjbG9yY3pvd3Fxdm11bXZmdHNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDA1Mjk5MjAsImV4cCI6MjAxNjEwNTkyMH0.mBthRtU0DxNOdyJ1aIuQy-pE82IxPLqCGw61m8p0Q0c';

const supabase = createClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

export async function getMoves() {
	let { data, error } = await supabase.from('Move').select('*');

	if (error) {
		throw error;
	}

	return (data || []).map((m) => ({ ...m, args: JSON.parse(m.args as string) as Array<string> }));
}

export async function getMovesForGame(game: number) {
	return (await getMoves()).filter((m) => game === m.game);
}

export async function getCurrentGame(): Promise<number> {
	let { data, error } = await supabase
		.from('Game')
		.select('*')
		.order('id', { ascending: false })
		.limit(1);

	if (error) throw error;
	if (data === null || data[0] === undefined) throw 'Data is null';

	return data[0].id;
}

export async function getGameData(gameArg = null) {
	let game = gameArg === null ? await getCurrentGame() : gameArg;
	return { moves: await getMovesForGame(game), game };
}

export default supabase;
