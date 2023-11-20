import { browser } from '$app/environment';
import type { LoadEvent } from '@sveltejs/kit';

export function load({ url }: LoadEvent) {
	return { seed: browser && url.searchParams ? url.searchParams.get('seed') || 1 : 1 };
}
