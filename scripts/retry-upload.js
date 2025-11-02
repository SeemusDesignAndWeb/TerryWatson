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

// Configure Cloudinary
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY || '343371222851216';
const apiSecret = process.env.CLOUDINARY_API_SECRET || '1HFy-ajf7PDZWJ7xZlAc5uTFwlc';

cloudinary.config({
	cloud_name: cloudName,
	api_key: apiKey,
	api_secret: apiSecret
});

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

// Upload to Cloudinary with timeout handling
async function uploadToCloudinary(buffer, filename) {
	return new Promise((resolve, reject) => {
		const publicId = filename.replace(/\.mp3$/i, '').replace(/[^a-zA-Z0-9_-]/g, '_');
		const uploadStream = cloudinary.uploader.upload_stream(
			{
				resource_type: 'video',
				folder: 'podcasts',
				public_id: publicId,
				format: 'mp3',
				chunk_size: 6000000, // 6MB chunks for large files
				eager_async: true, // Don't wait for eager transformations
				invalidate: true
			},
			(error, result) => {
				if (error) reject(error);
				else resolve(result);
			}
		);
		
		uploadStream.end(buffer);
	});
}

async function retryUpload() {
	try {
		const episodes = JSON.parse(readFileSync(dataPath, 'utf-8'));
		
		// Find episodes that still have the old URL pattern
		const episodeToRetry = episodes.find(ep => 
			ep.audioUrl.includes('terryandfran.info') && ep.title === 'Living in the New Life'
		);

		if (!episodeToRetry) {
			console.log('All episodes are already on Cloudinary!');
			return;
		}

		const currentUrl = episodeToRetry.audioUrl;

		console.log(`Retrying upload: ${episodeToRetry.title}`);
		console.log(`  Downloading from: ${currentUrl}`);

		try {
			// Download the file
			const buffer = await downloadFile(currentUrl);
			console.log(`  Downloaded ${(buffer.length / 1024 / 1024).toFixed(2)} MB`);

			// Extract filename
			const urlParts = currentUrl.split('/');
			const filename = urlParts[urlParts.length - 1] || `episode.mp3`;

			// Upload to Cloudinary
			console.log(`  Uploading to Cloudinary (this may take a while for large files)...`);
			const result = await uploadToCloudinary(buffer, filename);
			
			console.log(`  ✓ Uploaded! New URL: ${result.secure_url}`);
			
			// Update episode with new URL
			episodeToRetry.audioUrl = result.secure_url;

			// Save updated episodes
			writeFileSync(dataPath, JSON.stringify(episodes, null, 2), 'utf-8');
			console.log('\n✓ Upload complete! Updated episodes.json saved.');
		} catch (error) {
			console.error(`  ✗ Error:`, error.message);
		}

	} catch (error) {
		console.error('Error:', error);
		process.exit(1);
	}
}

retryUpload();

