import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';

// Load environment variables
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataPath = join(__dirname, '../src/lib/data/episodes.json');

// Configure Cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadLargeFile() {
	try {
		const episodes = JSON.parse(readFileSync(dataPath, 'utf-8'));
		
		// Find the episode that needs uploading
		const episode = episodes.find(ep => 
			ep.audioUrl.includes('terryandfran.info') && ep.title === 'Living in the New Life'
		);

		if (!episode) {
			console.log('Episode already uploaded!');
			return;
		}

		console.log(`Uploading: ${episode.title}`);
		console.log(`From URL: ${episode.audioUrl}`);
		console.log('Uploading directly from URL (this may take several minutes for large files)...\n');

		// Upload directly from URL - this is more efficient for large files
		const result = await cloudinary.uploader.upload(episode.audioUrl, {
			resource_type: 'video',
			folder: 'podcasts',
			public_id: '20150802_TerryWatson_2Corinthians5LiviingTheNew',
			format: 'mp3',
			invalidate: true,
			use_filename: false
		});
		
		console.log(`✓ Upload successful!`);
		console.log(`New URL: ${result.secure_url}\n`);
		
		// Update episode with new URL
		episode.audioUrl = result.secure_url;

		// Save updated episodes
		writeFileSync(dataPath, JSON.stringify(episodes, null, 2), 'utf-8');
		console.log('✓ Updated episodes.json saved.');

	} catch (error) {
		console.error('✗ Error:', error.message);
		if (error.http_code) {
			console.error(`HTTP Code: ${error.http_code}`);
		}
		process.exit(1);
	}
}

uploadLargeFile();

