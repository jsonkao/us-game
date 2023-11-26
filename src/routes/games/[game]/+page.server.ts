import getGameState from '$lib/server/getGameState';

export async function load({ params: { game }}) {
	return await getGameState(+game);
}
