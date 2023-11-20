import { crossfade } from 'svelte/transition';
import { quintOut } from 'svelte/easing';
import { browser, dev } from '$app/environment';
import Pusher, { Channel } from 'pusher-js';
import * as stores from '$lib/stores';

/* Seed */

export const seed = browser
	? parseInt(new URLSearchParams(window.location.search).get('seed') || '1')
	: 1;

/* Web socket */

let pusher: Pusher;
let socketId: string;

if (browser) {
	try {
		Pusher.logToConsole = dev || true;

		pusher = new Pusher('cc106f833f29464ac282', {
			cluster: 'mt1'
		});

		const channel: Channel = pusher.subscribe(`us-game-${seed}-${dev ? 'dev' : 'prod'}`);
		channel.bind('event', function (data: Dispatch) {
			dispatch(data, false);
		});

		pusher.connection.bind('connected', () => {
			socketId = pusher.connection.socket_id;
		});
	} catch (e) {
		console.error('Pusher error', e);
	}
}

export async function dispatch(dispatchData: Dispatch, shouldPublishEvent = true) {
	const { storeName, action, args = [] } = dispatchData;

	if (!stores[storeName]) throw new Error(`Invalid store ${storeName}`);
	if (!(action in stores[storeName]))
		throw new Error(`Invalid action ${action} of store ${storeName}`);

	//@ts-ignore
	stores[storeName][action](...args);

	if (shouldPublishEvent) {
		await fetch('/events', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ ...dispatchData, socketId })
		});
	}
}

/* Crossfade function for Svelte animation */

export const [send, receive] = crossfade({
	duration: (d) => Math.sqrt(d * 400),

	fallback(node) {
		const style = getComputedStyle(node);
		const transform = style.transform === 'none' ? '' : style.transform;

		return {
			duration: 600,
			easing: quintOut,
			css: (t) => `
				transform: ${transform} scale(${t});
				opacity: ${t}
			`
		};
	}
});

/* Seeded shuffle function taken from https://stackoverflow.com/a/53758827 */

export function shuffle<Type>(array: Array<Type>, seed: number): Array<Type> {
	// <-- ADDED ARGUMENT
	var m = array.length,
		t,
		i;

	// While there remain elements to shuffle…
	while (m) {
		// Pick a remaining element…
		i = Math.floor(random(seed) * m--); // <-- MODIFIED LINE

		// And swap it with the current element.
		t = array[m];
		array[m] = array[i];
		array[i] = t;
		++seed; // <-- ADDED LINE
	}

	return array;
}

function random(seed: number) {
	var x = Math.sin(seed++) * 10000;
	return x - Math.floor(x);
}
