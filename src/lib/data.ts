import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import type { Episode, NewsUpdate, AmevaContent, BookContent } from './types';

// Re-export types for convenience (server-side only)
export type { Episode, NewsUpdate, AmevaContent, BookContent };

// Environment variable configuration
const EPISODES_DB_PATH = process.env.EPISODES_DB_PATH || './data/episodes.json';
const NEWS_DB_PATH = process.env.NEWS_DB_PATH || './data/news.json';
const BOOK_DB_PATH = process.env.BOOK_DB_PATH || './data/book.json';
const AMEVA_DB_PATH = process.env.AMEVA_DB_PATH || './data/ameva.json';

// Git-tracked default paths (for auto-initialization)
const GIT_DATA_DIR = join(process.cwd(), 'src', 'lib', 'data');

/**
 * Resolves a database path, handling both relative (dev) and absolute (production) paths
 */
function resolveDbPath(envPath: string, filename: string): string {
	let finalPath: string;
	
	if (envPath.startsWith('./') || envPath.startsWith('../')) {
		// Relative path - resolve from project root (local development)
		finalPath = join(process.cwd(), envPath);
	} else {
		// Absolute path (e.g., /data/episodes.json for Railway volumes)
		finalPath = envPath;
	}
	
	// Ensure the directory exists
	const dir = dirname(finalPath);
	try {
		mkdirSync(dir, { recursive: true });
	} catch (error) {
		// Directory might already exist, or volume might not be mounted yet (during build)
		// This is okay - we'll handle errors when reading/writing
		console.warn(`[DB] Could not create directory for ${filename}:`, error);
	}
	
	return finalPath;
}

/**
 * Gets the git-tracked default path for a data file
 */
function getGitDataPath(filename: string): string {
	return join(GIT_DATA_DIR, filename);
}

/**
 * Reads a data file with auto-initialization from git-tracked defaults
 */
function readDataFile<T>(
	envPath: string,
	filename: string,
	defaultValue: T
): T {
	try {
		const dbPath = resolveDbPath(envPath, filename);
		const data = readFileSync(dbPath, 'utf-8');
		return JSON.parse(data);
	} catch (error) {
		console.warn(`[DB] Failed to read ${filename} from persistent location:`, error);
		
		// If file doesn't exist, try to initialize from git version
		// This helps on Railway when using persistent storage
		try {
			const gitPath = getGitDataPath(filename);
			
			// Only try git path if it's different from the target path
			const dbPath = resolveDbPath(envPath, filename);
			if (gitPath !== dbPath && existsSync(gitPath)) {
				console.log(`[DB] Initializing ${filename} from git version...`);
				const gitData = readFileSync(gitPath, 'utf-8');
				const data = JSON.parse(gitData);
				
				// Copy to persistent location
				try {
					writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
					console.log(`[DB] Successfully initialized ${filename}`);
				} catch (writeError) {
					console.warn(`[DB] Could not write ${filename} to persistent location:`, writeError);
				}
				
				return data;
			}
		} catch (initError) {
			console.warn(`[DB] Could not initialize ${filename} from git database:`, initError);
		}
		
		// Return default value if initialization fails
		console.warn(`[DB] Using default value for ${filename}`);
		return defaultValue;
	}
}

/**
 * Writes a data file to the persistent location
 */
function writeDataFile<T>(envPath: string, filename: string, data: T): void {
	const dbPath = resolveDbPath(envPath, filename);
	
	// Ensure directory exists before writing
	const dir = dirname(dbPath);
	try {
		mkdirSync(dir, { recursive: true });
	} catch (error) {
		// Directory might already exist, ignore
		console.warn(`[DB] Directory creation warning for ${filename}:`, error);
	}
	
	try {
		const jsonData = JSON.stringify(data, null, 2);
		writeFileSync(dbPath, jsonData, 'utf-8');
		console.log(`[DB] Successfully wrote ${filename} to ${dbPath}`);
	} catch (error) {
		console.error(`[DB] Could not write ${filename}:`, error);
		throw error; // Re-throw so caller can handle it
	}
}

// Episodes functions
export function getEpisodes(): Episode[] {
	return readDataFile<Episode[]>(EPISODES_DB_PATH, 'episodes.json', []);
}

export function saveEpisodes(episodes: Episode[]): void {
	writeDataFile(EPISODES_DB_PATH, 'episodes.json', episodes);
}

// News functions
export function getNewsUpdates(): NewsUpdate[] {
	return readDataFile<NewsUpdate[]>(NEWS_DB_PATH, 'news.json', []);
}

export function saveNewsUpdates(updates: NewsUpdate[]): void {
	writeDataFile(NEWS_DB_PATH, 'news.json', updates);
}

// Ameva functions
export function getAmevaContent(): AmevaContent {
	const defaultValue: AmevaContent = {
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
	return readDataFile<AmevaContent>(AMEVA_DB_PATH, 'ameva.json', defaultValue);
}

export function saveAmevaContent(content: AmevaContent): void {
	writeDataFile(AMEVA_DB_PATH, 'ameva.json', content);
}

// Book functions
export function getBookContent(): BookContent {
	const defaultValue: BookContent = {
		intro: 'Discover wisdom and practical insights from Terry Watson\'s extensive experience in pastoral ministry and itinerant preaching.',
		about: 'This comprehensive resource draws from decades of ministry work, sharing valuable lessons learned from pastoral ministry, itinerant preaching, and mission work around the world. The book provides practical guidance for ministers, church leaders, and anyone involved in ministry work.\n\nBased on real experiences and biblical foundations, this book offers timeless wisdom for effective ministry in today\'s world.',
		topics: [
			'Pastoral care and leadership',
			'Itinerant preaching ministry',
			'Building and nurturing Christian communities',
			'Mission work and cross-cultural ministry',
			'Teaching and discipleship',
			'Practical ministry wisdom'
		],
		availability: 'We\'re currently working on making this valuable resource available. Please check back for updates on publication date and purchasing information.\n\nFor updates on the book\'s release, please visit our Updates page or subscribe to stay informed.'
	};
	return readDataFile<BookContent>(BOOK_DB_PATH, 'book.json', defaultValue);
}

export function saveBookContent(content: BookContent): void {
	writeDataFile(BOOK_DB_PATH, 'book.json', content);
}

