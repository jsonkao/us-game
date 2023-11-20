// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Locals {}
		interface PageData {
			seed: number;
		}
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
	};

	interface Noble extends BaseCard {
		image: string;
	};

	interface Token {
		color: number;
		owner: string | number;
		index: number;
		lastModified: number;
	};

	interface Dispatch {
		storeName: 'cardStore' | 'tokenStore' | 'nobleStore' | 'playerStore';
		action: string;
		args: Array<any>;
	};
}

export {};
