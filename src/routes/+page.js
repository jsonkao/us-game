export function load({ url }) {
	return { seed: +url.searchParams.get('seed') || 1};
}
