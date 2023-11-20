export type Owner = 'bank' | number;

export type Card = {
	costs: Array<number>;
	score: number;
	index: number;
	level: number;
	discount: number;
	owner: Owner;
};

export type Noble = {
	costs: Array<number>;
	score: number;
	index: number;
	owner: Owner;
	image: string;
}

export type Token = {
	color: number;
	owner: string | number;
	index: number;
	lastModified: number;
};

export type Dispatch = {
	storeName: 'cardStore' | 'tokenStore' | 'nobleStore' | 'playerStore';
	action: string;
	args: Array<any>;
};