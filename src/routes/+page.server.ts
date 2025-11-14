import { getNewsUpdates, getCarouselImagesWithData, getCarouselSettings } from '$lib/data';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	const updates = getNewsUpdates();
	const latestUpdate = updates[0] || null;
	const carouselImages = getCarouselImagesWithData();
	const carouselSettings = getCarouselSettings();
	
	return {
		latestUpdate,
		carouselImages,
		carouselSettings
	};
};

