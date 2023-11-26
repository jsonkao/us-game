import getGameState from '$lib/getGameState';

export async function load(event) {
	const output = await getGameState();

	try {
		output.ip = event.getClientAddress();
	} catch (e) {
		console.error(e);
	}

	return output;
}
