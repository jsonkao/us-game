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

	type Card = {
		costs: Array<number>;
		score: number;
		index: number;
		level: number;
		discount: number;
		owner: Owner;
	};

	type Noble = {
		costs: Array<number>;
		score: number;
		index: number;
		owner: Owner;
		image: string;
	};

	type Token = {
		color: number;
		owner: string | number;
		index: number;
		lastModified: number;
	};

	type Dispatch = {
		storeName: 'cardStore' | 'tokenStore' | 'nobleStore' | 'playerStore';
		action: string;
		args: Array<any>;
	};
}

export {};
