declare global {
	namespace App {
		interface PageData {}
	}

	type Owner = 'bank' | number;

	interface BaseCard {
		costs: Array<number>;
		score: number;
		index: number;
		owner: Owner;
	}

	interface Card extends BaseCard {
		level: number;
		discount: number;
	}

	interface Noble extends BaseCard {
		image: string;
	}

	interface Token {
		color: number;
		owner: string | number;
		index: number;
		lastModified: number;
	}

	interface Dispatch {
		storeName: 'cardStore' | 'tokenStore' | 'nobleStore' | 'playerStore';
		action: string;
		args: Array<any>;
	}

	interface Chat {
		id: number;
		emoji: string;
		player: Owner;
		style: string;
		flyX: number;
	}

	interface Presence {
		location: string;
		presence_ref: string;
	}
}

export {};
