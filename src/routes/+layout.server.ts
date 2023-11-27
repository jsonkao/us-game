import { getCurrentGame } from '$lib/client-database';
import getGameState from '$lib/getGameState';
import { offline } from '$lib/utils/helpers';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params: { game } }) => {
	return await getGameState(game ? +game : offline ? 2 : await getCurrentGame());
};
