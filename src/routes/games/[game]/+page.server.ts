import getGameState from '$lib/getGameState';

export async function load({ params: { game }}) {
	return await getGameState(+game);
}
