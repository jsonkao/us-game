import { writable, get } from 'svelte/store';
import { cards, nobles } from '$lib/constants.json';

const nobleImages = import.meta.glob('$lib/images/nobles/*');

async function createNobleStore() {
	const initialNobles = await Promise.all(
		nobles
			.sort(() => Math.random() - 0.5)
			.slice(0, 3)
			.map(async (n) => ({
				...n,
				owner: 'bank',
				image: (await nobleImages[Object.keys(nobleImages)[+n.index % Object.keys(nobleImages).length]]()).default
			}))
	);
	const { subscribe, update } = writable(initialNobles);

	return {
		subscribe,
		checkForNobles: (player, cards) => {
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
	const initialTokens = [];
	let index = 0;
	for (let c = 0; c < 5; c++)
		for (let i = 0; i < 4; i++) initialTokens.push({ color: c, owner: 'bank', index: index++ });

	const { subscribe, update } = writable(initialTokens);

	return {
		subscribe,
		take: (newOwner, index) => {
			update((tokens) => {
				tokens[index].owner = newOwner;
				tokens[index].lastModified = Date.now();
				return tokens;
			});
		},
		pay: (owner, costs, discounts) => {
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
							token.owner = 'bank';
							token.lastModified = Date.now();
						}
					});
					return tokens;
				});
				return true;
			}
			return true;
		}
	};
}

function getDiscounts(player, cards) {
	const discounts = [0, 0, 0, 0, 0];
	cards.filter((c) => c.owner === player).forEach((c) => discounts[c.discount]++);
	return discounts;
}

export const playerStore = createCurrentPlayerStore();

function createCurrentPlayerStore(numPlayers = 2) {
	const { subscribe, update } = writable(0);

	return {
		subscribe,
		switchTurn: () => update((n) => (n + 1) % numPlayers)
	};
}

export const tokenStore = createTokenStore();

function createCardStore() {
	const { subscribe, update } = writable(
		cards.map((c) => ({ ...c, owner: 'bank' })).sort(() => Math.random() - 0.5)
	);

	return {
		subscribe,
		purchase: (buyer, cardIndex) => {
			update(($cards) => {
				const theCard = $cards.find((c) => c.index === cardIndex);
				const isPaymentAccepted = tokenStore.pay(buyer, theCard.costs, getDiscounts(buyer, $cards));
				const returnValue = isPaymentAccepted
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
