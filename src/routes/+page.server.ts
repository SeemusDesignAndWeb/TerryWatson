import { getNewsUpdates } from '$lib/data';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	const updates = getNewsUpdates();
	const latestUpdate = updates[0] || null;
	
	return {
		latestUpdate
	};
};

