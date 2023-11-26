import getGameState from '$lib/getGameState';

export async function load() {
	return await getGameState();
}