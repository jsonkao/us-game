export const prerender = false;

import { text } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async (event) => {
	const ip = event.getClientAddress();

	const location = await getLocation(ip);

	return text(location, { status: 201 });
};

async function getLocation(ip: string) {
	if (ip === '127.0.0.1') return 'localhost';

	const response = await (await fetch(`https://ipapi.co/${ip}/region/`)).text();
	return response;
}
