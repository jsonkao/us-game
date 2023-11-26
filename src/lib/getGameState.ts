import { getCurrentGame, getMoves } from '$lib/client-database';
import { cards, nobles } from '$lib/initials.json';
import { shuffle } from '$lib/utils/helpers';

export default async function (game: number | undefined = undefined) {
	if (game === undefined) {
		game = await getCurrentGame();
	}
	const shuffleAndSlice = (x: Array<any>) => shuffle(x, game).slice(0, 3);
	const imageKeys = shuffleAndSlice([0, 1, 2, 3]);

	return {
		moves: await getMoves(game),
		nobles: shuffleAndSlice(nobles.sort((a, b) => a.index - b.index)).map((n, i) => ({
			...n,
			owner: 'bank',
			image: '/' + imageKeys[i] + '.webp'
		})),
		cards: shuffle(
			cards.map((c) => ({
				...c,
				owner: 'bank'
			})),
			game
		)
	};
}
