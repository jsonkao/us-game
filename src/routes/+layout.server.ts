import { getCurrentGame } from '$lib/client-database';
import getGameState from '$lib/getGameState';

export async function load({ params: { game }}) {
	return await getGameState(game ? +game : await getCurrentGame());
}