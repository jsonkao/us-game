import { getGameData } from '$lib/client-database';

export async function load({ params: { game } }) {
	return await getGameData(+game);
}