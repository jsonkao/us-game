import { cards, nobles } from '$lib/server/constants.json';

export function load() {
	
	return {
		cards,
		nobles: nobles.sort(() => Math.random() - 0.5).slice(0, 3)
	};
}
