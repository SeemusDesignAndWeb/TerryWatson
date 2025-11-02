import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getNewsUpdates, saveNewsUpdates } from '$lib/data';

export const GET: RequestHandler = async () => {
	const updates = getNewsUpdates();
	return json(updates);
};

export const PUT: RequestHandler = async ({ request }) => {
	const updates = await request.json();
	saveNewsUpdates(updates);
	return json({ success: true });
};

