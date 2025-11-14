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
		const images = await request.json();
		
		// Validate images array
		if (!Array.isArray(images)) {
			return json({ error: 'Images must be an array' }, { status: 400 });
		}

		// Ensure all images have required fields and IDs
		const validatedImages = images.map((img, index) => ({
			id: img.id || generateId(),
			src: img.src || '',
			alt: img.alt || 'Carousel image',
			order: img.order !== undefined ? img.order : index
		}));

		saveCarouselImages(validatedImages);
		return json({ success: true, images: validatedImages });
	} catch (error: any) {
		console.error('Error saving carousel images:', error);
		return json({ error: error.message || 'Failed to save images' }, { status: 500 });
	}
};

