import { browser } from '$app/environment';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ url }) => {
	let seed = 1;
	if (browser && url.searchParams) {
		seed = parseInt(url.searchParams.get('seed') || '1');
	}
	return { seed };
};
