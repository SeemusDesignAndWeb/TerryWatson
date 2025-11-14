import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getCarouselImages, saveCarouselImages } from '$lib/data';

function generateId(): string {
	return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export const GET: RequestHandler = async () => {
	const images = getCarouselImages();
	return json(images);
};

export const PUT: RequestHandler = async ({ request }) => {
	try {
		const items = await request.json();
		
		// Validate items array
		if (!Array.isArray(items)) {
			return json({ error: 'Items must be an array' }, { status: 400 });
		}

		// Ensure all items have required fields
		const validatedItems = items.map((item, index) => ({
			imageId: item.imageId || item.id || '',
			order: item.order !== undefined ? item.order : index
		})).filter(item => item.imageId); // Remove items without imageId

		saveCarouselImages(validatedItems);
		return json({ success: true, items: validatedItems });
	} catch (error: any) {
		console.error('Error saving carousel items:', error);
		return json({ error: error.message || 'Failed to save carousel' }, { status: 500 });
	}
};

