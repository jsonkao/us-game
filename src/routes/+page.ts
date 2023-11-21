import { error } from '@sveltejs/kit';
import { getMoves } from '$lib/client-database';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const moves: Array<Move> = await getMoves();

	if (moves) {
		return { moves };
	}

	throw error(404, 'Not found');
}
