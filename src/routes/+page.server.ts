import supabase, { getMoves } from '$lib/client-database';
import { getNobles } from '$lib/getGameState';
import { cards } from '$lib/initials.json';

export async function load() {
	let { data: games, error } = await supabase
		.from('Game')
		.select('*')
		.order('id');

	if (error) throw error;
	if (games === null) throw 'Games data is null';

	return { games, scores: await getScores(games.map((g) => g.id)) };
}

// Write a function that uses getMoves to group the cards owned by each player and sums their values by the discount property. Use the cards in initials.json
async function getScores(games: Array<number>) {
	let moves = await getMoves();

	let scoreTotals: Record<number, Array<number>> = {};
	for (let game of games) {
		let cardsByPlayer: Record<number, Array<Card>> = {};

		for (let move of moves.filter((m) => m.storeName === 'cardStore' && m.game === game)) {
			let playerStr = move.args[0];
			let cardStr = move.args[1];
			if (playerStr === undefined || cardStr === undefined)
				throw `An argument in move ${JSON.stringify(move)} is undefined`;

			let player = +playerStr;
			let cardIndex = +cardStr;

			let card = cards[cardIndex];
			if (card === undefined) throw `Could not find card with index ${cardIndex}`;

			if (cardsByPlayer[player] === undefined) cardsByPlayer[player] = [];
			cardsByPlayer[player].push(card as Card);
		}

		// Using cardsByPlayer, check for nobles that are eligible for each player. A noble is eligible for a player if the player has enough cards to satisfy the noble's costs.
		let scoreByPlayer: [number, number] = [0, 0];
		const noblesForGame = getNobles(game);
		Object.keys(cardsByPlayer).map((player: string) => {
			const cards = cardsByPlayer[+player] || [];
			for (let noble of noblesForGame) {
				let isEligible = noble.costs.every(
					(value, color) => cards.filter((c) => c.discount === color).length >= value
				);

				if (isEligible) scoreByPlayer[+player] += noble.score;
			}
		});

		// Using cardsByPlayer, sum the score of each player's cards and add it to the existing nobles score
		Object.keys(cardsByPlayer).map((player: string) => {
			const cards = cardsByPlayer[+player] || [];
			let score = cards.reduce((acc, c) => acc + c.score, 0);
			scoreByPlayer[+player] += score;
		});

		scoreTotals[game] = scoreByPlayer;
	}

	return scoreTotals;
}
