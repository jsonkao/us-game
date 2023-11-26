import supabase from '$lib/client-database';

export async function load() {
	let { data, error } = await supabase
		.from('games')
		.select('*')
		.order('id', { ascending: false })

	if (!error && data.length > 0) return { games: data };
}
