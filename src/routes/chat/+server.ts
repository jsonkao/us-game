import { json, type RequestHandler } from '@sveltejs/kit';
import supabase from '$lib/server/database';


export const POST: RequestHandler = async ({ request }) => {
	const { emoji, player } = await request.json();

	const channel = supabase.channel('moves');
	channel.subscribe((status) => {
		// Wait for successful connection
		if (status !== 'SUBSCRIBED') {
			return null;
		}

		// Send a message once the client is subscribed
		channel.send({
			type: 'broadcast',
			event: 'chat',
			payload: { emoji, player }
		});
	});

	return json({}, { status: 201 });
};
