import { json, error, type RequestHandler } from '@sveltejs/kit';
import supabase from '$lib/server/database';

interface DispatchRequest extends Dispatch {
	game: number;
}

export const POST: RequestHandler = async ({ request }) => {
	const requestData: DispatchRequest = await request.json();
	const { storeName, action, args = [], game } = requestData;

	const { error: pgError } = await supabase
		.from('moves')
		.insert({ storeName, action, args: JSON.stringify(args), game })
		.select();

	if (pgError) {
		throw error(500, pgError);
	}

	return json({}, { status: 201 });
};

let channel = supabase.channel('moves');

export const PATCH: RequestHandler = async () => {
	// Increment the game
	const { error: pgError } = await supabase.from('games').insert([{}]);
	channel.subscribe(async (status) => {
		if (status !== 'SUBSCRIBED') return;
		const response = await channel.send({
			type: 'broadcast',
			event: 'restart',
			payload: true
		});

		if (response === 'error') {
			// throw error(500, 'Error sending message to channel')
		}
	});

	if (pgError) {
		console.error(pgError);
		throw error(500, pgError);
	}

	return json({}, { status: 200 });
};

export const DELETE: RequestHandler = async ({ request }) => {
	const game = +(await request.text());
	const { error: pgError } = await supabase.from('moves').delete().eq('game', game);
	channel.subscribe(async (status) => {
		if (status !== 'SUBSCRIBED') return;
		const response = await channel.send({
			type: 'broadcast',
			event: 'restart',
			payload: true
		});

		if (response === 'error') {
			// throw error(500, 'Error sending message to channel')
		}
	});

	if (pgError) {
		console.error(pgError);
		throw error(500, pgError);
	}

	return json({}, { status: 200 });
};
