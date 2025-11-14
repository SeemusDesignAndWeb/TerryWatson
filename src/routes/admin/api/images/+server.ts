import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getImageLibrary, saveImageLibrary } from '$lib/data';

function generateId(): string {
	return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export const GET: RequestHandler = async () => {
	const images = getImageLibrary();
	return json(images);
};

export const PUT: RequestHandler = async ({ request }) => {
	try {
		const images = await request.json();
		
		// Validate images array
		if (!Array.isArray(images)) {
			return json({ error: 'Images must be an array' }, { status: 400 });
		}

		// Ensure all images have required fields and IDs
		const validatedImages = images.map((img) => ({
			id: img.id || generateId(),
			src: img.src || '',
			alt: img.alt || 'Image',
			uploadedAt: img.uploadedAt || new Date().toISOString()
		}));

		saveImageLibrary(validatedImages);
		return json({ success: true, images: validatedImages });
	} catch (error: any) {
		console.error('Error saving image library:', error);
		return json({ error: error.message || 'Failed to save images' }, { status: 500 });
	}
};

