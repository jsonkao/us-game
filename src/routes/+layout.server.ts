import { getCurrentGame } from '$lib/client-database';
import getGameState from '$lib/getGameState';
import { offline } from '$lib/utils/helpers';

export async function load({ params: { game } }) {
	return await getGameState(game ? +game : offline ? 2 : await getCurrentGame());
}
