import { crossfade } from 'svelte/transition';
import { quintOut } from 'svelte/easing';

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
	let m = array.length;
	let t = array[0];
	let i = 0;

	// While there remain elements to shuffle…
	while (m) {
		// Pick a remaining element…
		i = Math.floor(random(seed) * m--); // <-- MODIFIED LINE

		// And swap it with the current element.
		t = array[m];
		const next = array[i];
		if (t === undefined || next === undefined) throw `Shuffle error: ${array}`;
		array[m] = next;
		array[i] = t;
		++seed; // <-- ADDED LINE
	}

	return array;
}

function random(seed: number) {
	var x = Math.sin(seed++) * 10000;
	return x - Math.floor(x);
}

export const offline = false; // browser && new URLSearchParams(window.location.search).get('offline');

// console.log('OFFLINE', offline)
