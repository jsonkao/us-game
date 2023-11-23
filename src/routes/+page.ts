import { getMoves, getCurrentGame } from '$lib/client-database';

export async function load() {
	return { moves: await getMoves(), game: await getCurrentGame() };
}