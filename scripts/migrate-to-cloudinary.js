import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { v2 as cloudinary } from 'cloudinary';
import https from 'https';
import http from 'http';
import { config } from 'dotenv';

// Load environment variables
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataPath = join(__dirname, '../src/lib/data/episodes.json');

// Get Cloudinary credentials
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY || '343371222851216';
const apiSecret = process.env.CLOUDINARY_API_SECRET || '1HFy-ajf7PDZWJ7xZlAc5uTFwlc';

if (!cloudName) {
	console.error('Error: CLOUDINARY_CLOUD_NAME not found in environment variables.');
	console.error('Please set it in your .env file or as an environment variable.');
	console.error('You can find your cloud name in your Cloudinary dashboard.');
	process.exit(1);
}

// Configure Cloudinary
cloudinary.config({
	cloud_name: cloudName,
	api_key: apiKey,
	api_secret: apiSecret
});

console.log(`Using Cloudinary cloud: ${cloudName}\n`);

// Helper to download file
function downloadFile(url) {
	return new Promise((resolve, reject) => {
		const protocol = url.startsWith('https') ? https : http;
		
		protocol.get(url, (response) => {
			if (response.statusCode !== 200) {
				reject(new Error(`Failed to download: ${response.statusCode}`));
				return;
			}

			const chunks = [];
			response.on('data', (chunk) => chunks.push(chunk));
			response.on('end', () => resolve(Buffer.concat(chunks)));
			response.on('error', reject);
		}).on('error', reject);
	});
}

// Upload to Cloudinary
async function uploadToCloudinary(buffer, filename) {
	return new Promise((resolve, reject) => {
		const uploadStream = cloudinary.uploader.upload_stream(
			{
				resource_type: 'video', // Cloudinary treats audio as video
				folder: 'podcasts',
				public_id: filename.replace(/\.mp3$/i, '').replace(/[^a-zA-Z0-9_-]/g, '_'),
				format: 'mp3',
				timeout: 600000 // 10 minutes for large files
			},
			(error, result) => {
				if (error) reject(error);
				else resolve(result);
			}
		);
		
		uploadStream.end(buffer);
	});
}

async function migrateEpisodes() {
	try {
		// Read episodes
		const episodes = JSON.parse(readFileSync(dataPath, 'utf-8'));
		console.log(`Found ${episodes.length} episodes to migrate\n`);

		const updatedEpisodes = [];

		for (let i = 0; i < episodes.length; i++) {
			const episode = episodes[i];
			const currentUrl = episode.audioUrl;

			// Skip if already a Cloudinary URL
			if (currentUrl.includes('cloudinary.com') || currentUrl.includes('res.cloudinary.com')) {
				console.log(`[${i + 1}/${episodes.length}] Skipping ${episode.title} - already on Cloudinary`);
				updatedEpisodes.push(episode);
				continue;
			}

			try {
				console.log(`[${i + 1}/${episodes.length}] Processing: ${episode.title}`);
				console.log(`  Downloading from: ${currentUrl}`);

				// Download the file
				const buffer = await downloadFile(currentUrl);
				console.log(`  Downloaded ${(buffer.length / 1024 / 1024).toFixed(2)} MB`);

				// Extract filename
				const urlParts = currentUrl.split('/');
				const filename = urlParts[urlParts.length - 1] || `episode_${i + 1}.mp3`;

				// Upload to Cloudinary
				console.log(`  Uploading to Cloudinary...`);
				const result = await uploadToCloudinary(buffer, filename);
				
				console.log(`  ✓ Uploaded! New URL: ${result.secure_url}`);
				
				// Update episode with new URL
				updatedEpisodes.push({
					...episode,
					audioUrl: result.secure_url
				});

				// Small delay to avoid rate limiting
				await new Promise(resolve => setTimeout(resolve, 1000));
			} catch (error) {
				console.error(`  ✗ Error processing ${episode.title}:`, error.message);
				// Keep original URL if upload fails
				updatedEpisodes.push(episode);
			}

			console.log('');
		}

		// Save updated episodes
		writeFileSync(dataPath, JSON.stringify(updatedEpisodes, null, 2), 'utf-8');
		console.log('✓ Migration complete! Updated episodes.json saved.');

	} catch (error) {
		console.error('Migration failed:', error);
		process.exit(1);
	}
}

migrateEpisodes();

