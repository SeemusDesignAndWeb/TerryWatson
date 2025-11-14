import { getNewsUpdates, getCarouselImages } from '$lib/data';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	const updates = getNewsUpdates();
	const latestUpdate = updates[0] || null;
	const carouselImages = getCarouselImages();
	
	return {
		latestUpdate,
		carouselImages
	};
};

