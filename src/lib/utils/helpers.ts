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

		if (seed === undefined || isNaN(i) || isNaN(m) || t === undefined) throw array;
	}

	return array;
}

function random(seed: number) {
	var x = Math.sin(seed++) * 10000;
	return x - Math.floor(x);
}
