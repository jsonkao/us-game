import { writable, get } from 'svelte/store';
import { browser, dev } from '$app/environment';
import Pusher from 'pusher-js';
import { cards, nobles } from '$lib/constants.json';

const nobleImages = import.meta.glob('$lib/images/nobles/*');

async function createNobleStore() {
	const initialNobles = await Promise.all(
		nobles.map(async (n) => ({
			...n,
			owner: 'bank',
			image: (
				await nobleImages[Object.keys(nobleImages)[+n.index % Object.keys(nobleImages).length]]()
			).default
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
		},
		shuffle: (seed) => update((nobles) => shuffle(nobles, seed).slice(0, 3))
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
			return false;
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
	const { subscribe, update } = writable(cards.map((c) => ({ ...c, owner: 'bank' })));

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
		},
		shuffle: (seed) => update((cards) => shuffle(cards, seed))
	};
}

export const cardStore = createCardStore();

let pusher;
let socketId;

if (browser) {
	Pusher.logToConsole = dev || true;

	pusher = new Pusher('cc106f833f29464ac282', {
		cluster: 'mt1'
	});

	const channel = pusher.subscribe('us-game-' + (dev ? 'dev' : 'prod'));
	channel.bind('event', function (data) {
		dispatch(data, false);
	});

	pusher.connection.bind('connected', () => {
		socketId = pusher.connection.socket_id;
	});
}

const stores = {
	cardStore,
	tokenStore,
	nobleStore,
	playerStore
};

export async function dispatch(dispatchData, shouldPublishEvent = true) {
	const { storeName, action, args = [] } = dispatchData;

	if (!stores[storeName]) throw new Error(`Invalid store ${storeName}`);
	if (!stores[storeName][action]) throw new Error(`Invalid action ${action} of store ${storeName}`);

	stores[storeName][action](...args);

	if (shouldPublishEvent) {
		await fetch('/events', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ ...dispatchData, socketId })
		});
	}
}

// Taken from https://stackoverflow.com/a/53758827
function shuffle(array, seed) {
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
	}

	return array;
}

function random(seed) {
	var x = Math.sin(seed++) * 10000;
	return x - Math.floor(x);
}
