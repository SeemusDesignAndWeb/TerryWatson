import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getCarouselSettings, saveCarouselSettings } from '$lib/data';

export const GET: RequestHandler = async () => {
	const settings = getCarouselSettings();
	return json(settings);
};

export const PUT: RequestHandler = async ({ request }) => {
	try {
		const settings = await request.json();
		
		// Validate settings
		if (typeof settings.intervalSeconds !== 'number' || settings.intervalSeconds < 1) {
			return json({ error: 'Interval must be a number greater than 0' }, { status: 400 });
		}

		// Clamp interval between 1 and 60 seconds
		const validatedSettings = {
			intervalSeconds: Math.max(1, Math.min(60, settings.intervalSeconds))
		};

		saveCarouselSettings(validatedSettings);
		return json({ success: true, settings: validatedSettings });
	} catch (error: any) {
		console.error('Error saving carousel settings:', error);
		return json({ error: error.message || 'Failed to save settings' }, { status: 500 });
	}
};

