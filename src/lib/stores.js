import { writable } from 'svelte/store';
import { cards } from '$lib/constants.json';

function createTokenStore() {
	const initialTokens = [];
	let uid = 0;
	for (let c = 0; c < 5; c++)
		for (let i = 0; i < 4; i++) initialTokens.push({ color: c, owner: 'bank', id: uid++ });

	const { subscribe, update } = writable(initialTokens);

	return {
		subscribe,
		take: (newOwner, tokenIds) => {
			update((tokens) => {
				tokenIds.forEach((id) => {
					tokens[id].owner = newOwner;
				});
				return tokens;
			});
		},
		pay: (owner, costs, discounts) => {
			try {
				update((tokens) => {
					costs.forEach((value, color) => {
						for (let v = 0; v < value - discounts[color]; v++)
							tokens.find((t) => t.color === color && t.owner === owner).owner = 'bank';
					});
					return tokens;
				});
				return true;
			} catch (e) {
				return true;
			}
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
				return isPaymentAccepted
					? [
							...$cards.filter((c) => c.index !== cardIndex),
							{
								...theCard,
								owner: buyer
							}
					  ]
					: $cards;
			});
		}
	};
}

export const cardStore = createCardStore();
