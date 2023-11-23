import * as stores from '$lib/stores';
import { getContext } from 'svelte';

export async function dispatch(dispatchData: Dispatch, shouldPublishEvent = true) {
	const game = getContext('game');

	const { storeName, action, args = [] } = dispatchData;

	if (!stores[storeName]) throw new Error(`Invalid store ${storeName}`);
	if (!(action in stores[storeName]))
		throw new Error(`Invalid action ${action} of store ${storeName}`);

	//@ts-ignore
	stores[storeName][action](...args);

	if (shouldPublishEvent) {
		await fetch('/moves', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ ...dispatchData, game })
		});
	}
}
