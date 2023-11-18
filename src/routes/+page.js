import { browser } from '$app/environment';

export function load({ url }) {
	return { seed: browser ? +url.searchParams.get('seed') || 1 : 1 };
}
