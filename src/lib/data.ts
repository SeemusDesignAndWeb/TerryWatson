import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import type { Episode, NewsUpdate, AmevaContent } from './types';

// Re-export types for convenience (server-side only)
export type { Episode, NewsUpdate, AmevaContent };

// Get the directory of the current module - works for both ESM and when bundled
function getDataDir() {
	// In SvelteKit/Vite, import.meta.url is available
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = join(__filename, '..');
	const dataDir = join(__dirname, 'data');
	return dataDir;
}

const dataDir = getDataDir();

export function getEpisodes(): Episode[] {
	try {
		const filePath = join(dataDir, 'episodes.json');
		const data = readFileSync(filePath, 'utf-8');
		return JSON.parse(data);
	} catch (error) {
		console.error('Error reading episodes:', error);
		return [];
	}
}

export function saveEpisodes(episodes: Episode[]): void {
	try {
		const filePath = join(dataDir, 'episodes.json');
		writeFileSync(filePath, JSON.stringify(episodes, null, 2), 'utf-8');
	} catch (error) {
		console.error('Error saving episodes:', error);
		throw error;
	}
}

export function getNewsUpdates(): NewsUpdate[] {
	try {
		const filePath = join(dataDir, 'news.json');
		const data = readFileSync(filePath, 'utf-8');
		return JSON.parse(data);
	} catch (error) {
		console.error('Error reading news:', error);
		return [];
	}
}

export function saveNewsUpdates(updates: NewsUpdate[]): void {
	try {
		const filePath = join(dataDir, 'news.json');
		writeFileSync(filePath, JSON.stringify(updates, null, 2), 'utf-8');
	} catch (error) {
		console.error('Error saving news:', error);
		throw error;
	}
}

export function getAmevaContent(): AmevaContent {
	try {
		const filePath = join(dataDir, 'ameva.json');
		const data = readFileSync(filePath, 'utf-8');
		return JSON.parse(data);
	} catch (error) {
		console.error('Error reading Ameva content:', error);
		// Return default content if file doesn't exist
		return {
			intro: 'We continue to be very much involved with the work of Ameva Farm in Zimbabwe. The story has been recorded and is available to listen to on <a href="https://amevaproject.com" target="_blank" rel="noopener noreferrer">amevaproject.com</a>.',
			sections: [
				{
					title: 'About Ameva',
					content: 'The Ameva Project is a work which began in 1981 and has continued until this day. The story unfolds to tell of the lives of John & Celia Valentine, their family, workers from around the world and the many hundreds of people that have been impacted by this work.',
					isHighlight: false
				},
				{
					title: 'History Recording',
					content: 'Terry is doing well with recording the History of the Ameva Project with Mike Coles. Each Monday they spend an hour or so together, recording chapters that cover different periods of the project\'s history.\n\nThe accounts are taken from the many Zimbabwe Project Newsletters sent out by John & Celia, Fellowship Missionary Digests produced to keep the Christian Fellowships up to date with missionary news, Ameva Updates, Ameva Weekly\'s sent out by email each week and the Reports and Reflections of those who have travelled out to work in the Bible School, Primary School, Secondary School, on the Farm and from Shephen Mbewe whose family grew up there.\n\nThese can be listened to by logging on to the Ameva page on our website. Philip is in the process of making the book available so please watch this space.',
					isHighlight: false
				},
				{
					title: 'Memorial',
					content: 'We were very saddened to hear of the passing into presence of Lord of Martin Williams who was very much part of Ameva\'s founding days and led the Bible College until the government of Zimbabwe decided to not allow overseas visitors to stay.',
					isHighlight: false
				},
				{
					title: 'Listen to the Story',
					content: 'You can listen to the recorded history and updates by visiting <a href="https://amevaproject.com" target="_blank" rel="noopener noreferrer">amevaproject.com</a>.',
					isHighlight: true
				}
			]
		};
	}
}

export function saveAmevaContent(content: AmevaContent): void {
	try {
		const filePath = join(dataDir, 'ameva.json');
		writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf-8');
	} catch (error) {
		console.error('Error saving Ameva content:', error);
		throw error;
	}
}

