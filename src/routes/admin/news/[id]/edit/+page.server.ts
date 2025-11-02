import { getNewsUpdates } from '$lib/data';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const updates = getNewsUpdates();
	const id = parseInt(params.id);
	const update = updates[id] || null;

	return {
		update,
		index: id
	};
};

