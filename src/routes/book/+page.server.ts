import { getBookContent } from '$lib/data';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	return {
		bookContent: getBookContent()
	};
};

