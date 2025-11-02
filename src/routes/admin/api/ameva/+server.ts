import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAmevaContent, saveAmevaContent } from '$lib/data';

export const GET: RequestHandler = () => {
	return json(getAmevaContent());
};

export const PUT: RequestHandler = async ({ request }) => {
	const content = await request.json();
	saveAmevaContent(content);
	return json({ success: true });
};


