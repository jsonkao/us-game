import { writable, get } from 'svelte/store';
import { cards, nobles } from '$lib/initials.json';
import { shuffle, seed } from '$lib/utils/helpers';

const nobleImages: Record<string, () => Promise<any>> = import.meta.glob(
	'$lib/images/nobles/final/*'
);

async function createNobleStore() {
	const initialNobles: Array<Noble> = await Promise.all(
		nobles.map(async (n) => ({
			...n,
			owner: 'bank',
			image: (
				await nobleImages[Object.keys(nobleImages)[+n.index % Object.keys(nobleImages).length]]()
			).default
		}))
	);
	const { subscribe, update } = writable(shuffle(initialNobles, seed).slice(0, 3));

	return {
		subscribe,
		checkForNobles: (player: Owner, cards: Array<Card>) => {
			update((nobles) => {
				// If player is eligible for a noble, assign that player to be the owner for those nobles
				const playerCards = cards.filter((c) => c.owner === player);
				const eligibleNobles = nobles.filter(({ costs }) =>
					costs.every(
						(value, color) => playerCards.filter((c) => c.discount === color).length >= value
					)
				);
				eligibleNobles.forEach((n) => (n.owner = player));
				return nobles;
			});
		}
	};
}

export const nobleStore = await createNobleStore();

function createTokenStore() {
	const initialTokens: Array<Token> = [];
	let index = 0;
	for (let c = 0; c < 5; c++)
		for (let i = 0; i < 4; i++)
			initialTokens.push({ color: c, owner: 'bank', index: index++, lastModified: 0 });

	const { subscribe, update } = writable(initialTokens);

	return {
		subscribe,
		take: (newOwner: Owner, index: number) => {
			update((tokens) => {
				tokens[index].owner = newOwner;
				tokens[index].lastModified = Date.now();
				return tokens;
			});
		},
		pay: (owner: Owner, costs: Array<number>, discounts: Array<number>) => {
			// Check if player has enough tokens
			const playerTokens = get(tokenStore).filter((t) => t.owner === owner);
			const hasEnoughTokens = costs.every((value, color) => {
				const tokensOfColor = playerTokens.filter((t) => t.color === color);
				return tokensOfColor.length >= value - discounts[color];
			});

			if (hasEnoughTokens) {
				update((tokens) => {
					costs.forEach((value, color) => {
						for (let v = 0; v < value - discounts[color]; v++) {
							const token = tokens.find((t) => t.color === color && t.owner === owner);
							if (token) {
								token.owner = 'bank';
								token.lastModified = Date.now();
							}
						}
					});
					return tokens;
				});
				return true;
			}
			return false;
		}
	};
}

function getDiscounts(player: Owner, cards: Array<Card>): Array<number> {
	const discounts = [0, 0, 0, 0, 0];
	cards.filter((c) => c.owner === player).forEach((c) => discounts[c.discount]++);
	return discounts;
}

export const playerStore = createCurrentPlayerStore();

function createCurrentPlayerStore(numPlayers = 2) {
	const { subscribe, update } = writable(0);

	return {
		subscribe,
		nextTurn: (currentPlayer: number) => update(() => (currentPlayer + 1) % numPlayers)
	};
}

export const tokenStore = createTokenStore();

function createCardStore() {
	const initialCards: Array<Card> = cards.map((c) => ({
		...c,
		owner: 'bank'
	}));
	const { subscribe, update } = writable(shuffle(initialCards, seed));

	return {
		subscribe,
		purchase: (buyer: Owner, cardIndex: number) => {
			update(($cards) => {
				const theCard = $cards.find((c) => c.index === cardIndex);
				if (theCard === undefined) return $cards;
				const isPaymentAccepted = tokenStore.pay(buyer, theCard.costs, getDiscounts(buyer, $cards));
				const returnValue: Array<Card> = isPaymentAccepted
					? [
							...$cards.filter((c) => c.index !== cardIndex),
							{
								...theCard,
								owner: buyer
							}
					  ]
					: $cards;

				// After each purchase, check if player is eligible for any nobles using the checkForNoble function
				nobleStore.checkForNobles(buyer, returnValue);

				return returnValue;
			});
		}
	};
}

export const cardStore = createCardStore();

// Write a function that creates a moves store called createMoveStore that takes an initial value and returns a store with the following methods:
// - addMove: takes a move and adds it to the moves store
// - clearMoves: clears all moves from the moves store
export function createMoveStore(initialValue: Array<Move> = []) {
	const { subscribe, update, set } = writable(initialValue);

	return {
		subscribe,
		populate: (moves: Array<Move>) => set(moves.filter((m) => m.seed === seed)),
		addMove: (move: Move) => update((moves) => [...moves, move])
	};
}

export const moveStore = createMoveStore();

export function createChatStore() {
	const { subscribe, update } = writable([]);

	let id = 0;

	return {
		subscribe,
		add: (emoji: string, player: number) => {
			update((chats: Array<Chat>) => [
				...chats,
				{
					emoji,
					player,
					id: id++,
					transform: `translate(${Math.random() * 200 * (player ? 1 : -1)}%, ${
						Math.random() * 200
					}%)`
				}
			]);
			return id - 1;
		},
		remove: (id: number) => update((chats: Array<Chat>) => chats.filter((c) => c.id !== id))
	};
}

export const chatStore = createChatStore();

// Write a function that creates a store called chatStore
