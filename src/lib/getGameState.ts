import { getMoves } from '$lib/client-database';
import { cards, nobles } from '$lib/initials.json';
import { shuffle, offline } from '$lib/utils/helpers';

export default async function (game: number) {
	function shuffleAndSlice<Type>(x: Array<Type>) {
		return shuffle(x, game).slice(0, 3);
	}
	const imageKeys = shuffleAndSlice([0, 1, 2, 3]);

	return {
		game,
		moves: offline ? [] : await getMoves(game),
		nobles: shuffleAndSlice(nobles.sort((a, b) => a.index - b.index)).map((n, i) => ({
			...n,
			owner: 'bank' as Owner,
			image: '/' + imageKeys[i] + '.webp'
		})),
		cards: shuffle(
			cards.map((c) => ({
				...c,
				owner: 'bank' as Owner
			})),
			game
		)
	};
}
