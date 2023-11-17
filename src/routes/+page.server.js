import {  nobles } from '$lib/constants.json';

export function load() {
	return {
		nobles: nobles.sort(() => Math.random() - 0.5).slice(0, 3).map(n => ({ ...n, owner: 'bank' }))
	};
}
