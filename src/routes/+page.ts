import { getGameData } from '$lib/client-database';

export async function load() {
	return await getGameData();
}