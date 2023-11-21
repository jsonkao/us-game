import { getMoves } from '$lib/client-database';

export async function load() {
	return { moves: await getMoves() };
}
