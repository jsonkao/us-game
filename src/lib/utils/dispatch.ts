import * as stores from '$lib/stores';

export function enactMove(dispatchData: Dispatch) {
	const { storeName, action, args = [] } = dispatchData;

	if (!stores[storeName]) throw new Error(`Invalid store ${storeName}`);
	if (!(action in stores[storeName]))
		throw new Error(`Invalid action ${action} of store ${storeName}`);

	//@ts-ignore
	stores[storeName][action](...args);
}

export async function dispatchMove(dispatchData: Dispatch, game: number) {
	if (game === undefined) throw 'Game cannot be undefined in dispatch'
	enactMove(dispatchData);
	await fetch('/moves', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ ...dispatchData, game })
	});
}
