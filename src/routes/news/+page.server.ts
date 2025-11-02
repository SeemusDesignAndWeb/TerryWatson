import { getNewsUpdates } from '$lib/data';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	return {
		updates: getNewsUpdates()
	};
};

