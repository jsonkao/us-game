import supabase from '$lib/client-database';

export async function load() {
	let { data, error } = await supabase.from('Game').select('*').order('id', { ascending: false });

	if (error) throw error;
	if (data === null) throw 'Data is null';

	return { games: data };
}
