import { error } from '@sveltejs/kit';
import { getMoves } from '$lib/server/database';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const moves: Array<Move> = await getMoves();

	if (moves) {
		return { moves };
	}

	throw error(404, 'Not found');
}

