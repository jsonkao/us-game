import getGameState from '$lib/server/getGameState';

export async function load(event) {
	return {
		...(await getGameState()),
		ip: event.getClientAddress(),
	}
}

