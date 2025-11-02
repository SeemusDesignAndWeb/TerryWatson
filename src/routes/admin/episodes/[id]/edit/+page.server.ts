import { getEpisodes } from '$lib/data';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const episodes = getEpisodes();
	const id = parseInt(params.id);
	const episode = episodes[id] || null;

	return {
		episode,
		index: id
	};
};

