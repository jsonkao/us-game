import { json } from '@sveltejs/kit';
import Pusher from 'pusher';

const pusher = new Pusher({
	appId: '1710233',
	key: 'cc106f833f29464ac282',
	secret: 'e6918514110512f97254',
	cluster: 'mt1',
	useTLS: true
});

export async function POST({ request }) {
	const { socketId, ...dispatchData } = await request.json();

	pusher.trigger('us-game', 'event', dispatchData, { socket_id: socketId });

	return json({}, { status: 201 });
}
