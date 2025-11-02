import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getEpisodes, saveEpisodes } from '$lib/data';

export const GET: RequestHandler = async () => {
	const episodes = getEpisodes();
	return json(episodes);
};

export const PUT: RequestHandler = async ({ request }) => {
	const episodes = await request.json();
	saveEpisodes(episodes);
	return json({ success: true });
};

