import { writable, get } from 'svelte/store';
import type { Move } from '$lib/types/schema';

const INFINITE_MONEY = false;

function createNobleStore() {
	const initialNobles: Array<Noble> = [];
	const { subscribe, update, set } = writable(initialNobles);

	return {
		subscribe,
		set,
		checkForNobles: (player: Owner, cards: Array<Card>) => {
			update((nobles) => {
				if (nobles.length === 0) return nobles;
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

export const nobleStore = createNobleStore();

function createTokenStore() {
	const initialTokens: Array<Token> = [];
	let index = 0;

	const WILDCARD_COLOR = 5;
	for (let color = 0; color < WILDCARD_COLOR + 1; color++)
		for (let i = 0; i < (color === WILDCARD_COLOR ? 5 : 4); i++)
			initialTokens.push({ color, owner: 'bank', index: index++, lastModified: 0 });

	const { subscribe, update } = writable(initialTokens);

	return {
		subscribe,
		take: (newOwner: Owner, index: number) => {
			update((tokens) => {
				const token: Token | undefined = tokens[index];
				if (token === undefined) return tokens;
				token.owner = newOwner;
				token.lastModified = Date.now();
				return tokens;
			});
		},
		takeWildcard: (newOwner: Owner) => {
			update((tokens) => {
				const token: Token | undefined = tokens.find((t) => t.color === WILDCARD_COLOR);
				if (token === undefined) return tokens;
				token.owner = newOwner;
				token.lastModified = Date.now();
				return tokens;
			});
		},
		pay: (owner: Owner, costs: CostValue, discounts: CostValue) => {
			// Check if player has enough tokens
			const playerTokens = get(tokenStore).filter((t) => t.owner === owner);
			const hasEnoughTokens = costs.every((value, color) => {
				const tokensOfColor = playerTokens.filter((t) => t.color === color);
				return tokensOfColor.length >= value - (discounts[color] || 0);
			});

			if (hasEnoughTokens) {
				update((tokens) => {
					costs.forEach((value, color) => {
						for (let v = 0; v < value - (discounts[color] || 0); v++) {
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
			return INFINITE_MONEY;
		}
	};
}

function getDiscounts(player: Owner, cards: Array<Card>) {
	const discounts: CostValue = [0, 0, 0, 0, 0];
	cards.filter((c) => c.owner === player).forEach((c) => discounts[c.discount]++);
	return discounts;
}

export const playerStore = createCurrentPlayerStore();

function createCurrentPlayerStore(numPlayers = 2) {
	const { subscribe, update } = writable(0);

	return {
		subscribe,
		nextTurn: (currentPlayer: number) => {
			update(() => (currentPlayer + 1) % numPlayers);
		}
	};
}

export const tokenStore = createTokenStore();

function createCardStore() {
	const initialCards: Array<Card> = [];
	const { subscribe, update, set } = writable(initialCards);

	return {
		subscribe,
		set,
		reserve: (buyer: Owner, cardIndex: number) =>
			update(($cards) => {
				const theCard = $cards.find((c) => c.index === cardIndex);
				if (theCard === undefined) {
					return $cards;
				}

				tokenStore.takeWildcard(buyer);
				return [
					...$cards.filter((c) => c.index !== cardIndex),
					{
						...theCard,
						heldBy: buyer
					}
				];
			}),
		purchase: (buyer: Owner, cardIndex: number, isFromHistory = false) => {
			update(($cards) => {
				const theCard = $cards.find((c) => c.index === cardIndex);
				if (theCard === undefined) {
					return $cards;
				}
				const isPaymentAccepted =
					isFromHistory || tokenStore.pay(buyer, theCard.costs, getDiscounts(buyer, $cards));
				const returnValue: Array<Card> = isPaymentAccepted
					? [
							...$cards.filter((c) => c.index !== cardIndex),
							{
								...theCard,
								owner: buyer
							}
					  ]
					: $cards;

				// After each purchase, check for newly eligible nobles and assign them to the player
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
		set,
		addMove: (move: Move) => update((moves) => [...moves, move])
	};
}

export const moveStore = createMoveStore();

export function createChatStore() {
	const initialValue: Array<Chat> = [];
	const { subscribe, update } = writable(initialValue);

	let id = 0;

	return {
		subscribe,
		add: (emoji: string, player: number) => {
			const height = window.innerHeight;
			const width = window.innerWidth;
			const translateX = (player ? 1 : -1) * Math.random() * 0.3 * width;
			update((chats: Array<Chat>) => [
				...chats,
				{
					emoji,
					player,
					id: id++,
					flyX: (player ? 1 : -1) * (width - 80 - 30) - translateX,
					style: `transform: translate(${translateX}px, ${
						Math.random() * height * 0.6
					}px); --rotate: ${(Math.random() - 0.5) * 0}deg; --bounce-height: ${
						-(1 - Math.random() / 2) * height * 0.3
					}`
				}
			]);
			return id - 1;
		},
		remove: (id: number) => update((chats: Array<Chat>) => chats.filter((c) => c.id !== id))
	};
}

export const chatStore = createChatStore();

export const presenceStore = writable<Record<string, Array<Presence>>>({});
