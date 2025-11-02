import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getBookContent, saveBookContent } from '$lib/data';

export const GET: RequestHandler = () => {
	return json(getBookContent());
};

export const PUT: RequestHandler = async ({ request }) => {
	const content = await request.json();
	saveBookContent(content);
	return json({ success: true });
};

