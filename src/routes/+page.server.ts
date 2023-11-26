import { building } from '$app/environment';
import getGameState from '$lib/getGameState';

export async function load(event) {
	const output = await getGameState();

	if (!building) {
		output.ip = event.getClientAddress();
	}

	return output;
}
