import { getCurrentGame } from '$lib/client-database';
import getGameState from '$lib/getGameState';

export async function load() {
	return await getGameState(await getCurrentGame());
}