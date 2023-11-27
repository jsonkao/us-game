import { getCurrentGame } from '$lib/client-database';
import supabase from '$lib/server/database';
import getGameState from '$lib/getGameState';
import { offline } from '$lib/utils/helpers';
import type { PageServerLoad } from './$types';
import { redirect, error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params: { game } }) => {
	if (game === 'new') {
		const { data, error: pgError } = await supabase.from('Game').insert([{}]).select('*');
		if (pgError) {
			throw error(500, pgError);
		}
		throw redirect(302, `/games/${data?.[0]?.id}`);
	}
	return await getGameState(game ? +game : offline ? 2 : await getCurrentGame());
};
