import { getCurrentGame } from '$lib/client-database';
import supabase from '$lib/server/database';
import getGameState from '$lib/getGameState';
import { offline } from '$lib/utils/helpers';
import type { PageServerLoad } from './$types';
import { redirect, error } from '@sveltejs/kit';
import { browser } from '$app/environment';

export const load: PageServerLoad = async ({ params: { game } }) => {
	if (browser && game === 'new') {
		// We only want this called because of the client
		const { data, error: pgError } = await supabase.from('Game').insert([{}]).select('*');
		if (pgError) {
			throw error(500, pgError);
		}
		throw redirect(302, `/games/${data?.[0]?.id}`);
	}
	return await getGameState(game ? +game : offline ? 2 : await getCurrentGame());
};
