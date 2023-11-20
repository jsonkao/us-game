import { browser } from '$app/environment';
import type { LoadEvent } from '@sveltejs/kit';

export function load({ url }: LoadEvent) {
	let seed = 1;
	if (browser && url.searchParams) {
		seed = parseInt(url.searchParams.get('seed') || '1');
	}
	return { seed }
}
