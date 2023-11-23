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

export const DELETE: RequestHandler = async () => {
	// Increment the game
	const { error: pgError } = await supabase.from('games').insert([{}]);

	const channel = supabase.channel('moves');
	channel.subscribe((status) => {
		// Wait for successful connection
		if (status !== 'SUBSCRIBED') {
			return null;
		}

		// Send a message once the client is subscribed
		channel.send({
			type: 'broadcast',
			event: 'restart'
		});
	});

	if (pgError) {
		console.error(pgError);
		throw error(500, pgError);
	}

	return json({}, { status: 200 });
};
