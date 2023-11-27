import * as stores from '$lib/stores';
import type { Move } from '$lib/types/schema';
import { offline } from '$lib/utils/helpers';

export function enactMove(dispatchData: Dispatch | Move) {
	const { storeName, action, args = [] } = dispatchData;

	if (!stores[storeName]) throw new Error(`Invalid store ${storeName}`);
	if (!(action in stores[storeName]))
		throw new Error(`Invalid action ${action} of store ${storeName}`);

	// If the purchase is in the history, ignore whether tokens were enough (might have been in infinite money mode)
	if (storeName === 'cardStore' && action === 'purchase') {
		//@ts-ignore
		args.push(true);
	}

	//@ts-ignore
	stores[storeName][action](...args);
}

export async function dispatchMove(dispatchData: Dispatch, game: number) {
	if (game === undefined) throw 'Game cannot be undefined in dispatch';
	enactMove(dispatchData);

	if (!offline) {
		await fetch('/moves', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ ...dispatchData, game })
		});
	}
}
