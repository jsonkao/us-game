import { json, error, type RequestHandler } from '@sveltejs/kit';
import { dev } from '$app/environment';
import Pusher from 'pusher';

const pusher = new Pusher({
	appId: '1710233',
	key: 'cc106f833f29464ac282',
	secret: 'e6918514110512f97254',
	cluster: 'mt1',
	useTLS: true
});

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { socketId, ...dispatchData } = await request.json();

		pusher.trigger('us-game-' + (dev ? 'dev' : 'prod'), 'event', dispatchData, {
			socket_id: socketId
		});

		return json({}, { status: 201 });
	} catch (e) {
		throw error(503, 'Unable to send event to Pusher');
	}
};
