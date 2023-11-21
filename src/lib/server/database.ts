import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';

const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function getMoves(): Promise<Dispatch[]> {
	let { data, error } = await supabase.from('moves').select('*');

	if (error) {
		throw error;
	}

	const moves: Array<Dispatch> = (data || []).map(({ storeName, action, args }) => ({
		storeName,
		action,
		args: JSON.parse(args)
	}));

	return moves;
}

export default supabase;
