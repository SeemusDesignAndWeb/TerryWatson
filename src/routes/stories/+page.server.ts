import type { PageServerLoad } from './$types';
import type { Episode } from '$lib/types';

async function fetchStoriesFromNewLife(): Promise<Episode[]> {
	try {
		const url = 'https://www.newliferadio.co.uk/audio-pages/terry_watson_stories';
		console.log('[Stories] Fetching URL:', url);
		const response = await fetch(url);
		
		if (!response.ok) {
			console.error(`[Stories] Failed to fetch New Life Radio page: ${response.status}`);
			return [];
		}
		
		const html = await response.text();
		console.log('[Stories] HTML length:', html.length);
		const episodes: Episode[] = [];
		
		// Simple approach: Find all button-link anchors with Google Drive URLs
		const buttonLinkPattern = /<a class="button-link"[^>]*href=["'](https:\/\/drive\.google\.com\/[^"']+)["'][^>]*>/gi;
		let linkMatch;
		let linkCount = 0;
		
		while ((linkMatch = buttonLinkPattern.exec(html)) !== null) {
			linkCount++;
			const driveUrl = linkMatch[1];
			const linkPosition = linkMatch.index;
			
			console.log('[Stories] Found Google Drive link #' + linkCount + ' at position', linkPosition);
			
			// Search backwards from the link position to find the associated title
			// Look for the nearest col2 grid-cell div (within reasonable distance, e.g., 2000 chars)
			const searchStart = Math.max(0, linkPosition - 2000);
			const searchEnd = linkPosition;
			const searchArea = html.substring(searchStart, searchEnd);
			
			// Find all col2 grid-cell divs in this area and get the closest one
			const col2Pattern = /<div class="col2 grid-cell">([\s\S]*?)<\/div>/gi;
			let titleMatch;
			let closestTitle = '';
			let closestTitlePos = -1;
			
			while ((titleMatch = col2Pattern.exec(searchArea)) !== null) {
				const titlePos = searchStart + titleMatch.index;
				if (titlePos > closestTitlePos) {
					closestTitlePos = titlePos;
					closestTitle = titleMatch[1]
						.replace(/<[^>]+>/g, '')
						.trim();
				}
			}
			
			console.log('[Stories] Link #' + linkCount + ' - Title:', closestTitle || 'NOT FOUND', '| Drive URL:', driveUrl);
			
			if (closestTitle) {
				// Keep the original Google Drive share URL
				// Google Drive URLs don't work directly in audio elements due to CORS
				// We'll handle these specially in the player component
				episodes.push({
					title: closestTitle,
					audioUrl: driveUrl,
					description: `Story recording from New Life Radio`
				});
			}
		}
		
		console.log('[Stories] Total Google Drive links found:', linkCount);
		console.log('[Stories] Episodes before deduplication:', episodes.length);
		
		// Remove duplicates based on title (desktop and mobile versions will have same title)
		const uniqueEpisodes = episodes.filter((episode, index, self) =>
			index === self.findIndex((e) => e.title === episode.title)
		);
		
		console.log('[Stories] Total episodes after deduplication:', uniqueEpisodes.length);
		
		if (uniqueEpisodes.length > 0) {
			console.log('[Stories] Sample episode:', JSON.stringify(uniqueEpisodes[0], null, 2));
		}
		
		return uniqueEpisodes;
	} catch (error) {
		console.error('[Stories] Error fetching stories from New Life Radio:', error);
		if (error instanceof Error) {
			console.error('[Stories] Error message:', error.message);
			console.error('[Stories] Error stack:', error.stack);
		}
		return [];
	}
}

export const load: PageServerLoad = async () => {
	console.log('[Stories] Starting load function');
	const stories = await fetchStoriesFromNewLife();
	console.log('[Stories] Load complete, returning', stories.length, 'stories');
	
	return {
		stories
	};
};

