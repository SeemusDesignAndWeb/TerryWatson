import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
// Note: CLOUDINARY_CLOUD_NAME should be set in environment variables
// You can find it in your Cloudinary dashboard
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.PUBLIC_CLOUDINARY_CLOUD_NAME || 'seemusdesignandweb',
	api_key: process.env.CLOUDINARY_API_KEY || '343371222851216',
	api_secret: process.env.CLOUDINARY_API_SECRET || '1HFy-ajf7PDZWJ7xZlAc5uTFwlc'
});

export const POST: RequestHandler = async ({ request }) => {
	try {
		const formData = await request.formData();
		const file = formData.get('audio') as File;

		if (!file) {
			return json({ error: 'No file provided' }, { status: 400 });
		}

		// Convert file to buffer
		const arrayBuffer = await file.arrayBuffer();
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const { Buffer } = require('buffer');
		const buffer = Buffer.from(arrayBuffer);

		// Upload to Cloudinary
		const result = await new Promise((resolve, reject) => {
			cloudinary.uploader
				.upload_stream(
					{
						resource_type: 'video', // Cloudinary treats audio as video
						folder: 'podcasts',
						format: 'mp3'
					},
					(error, result) => {
						if (error) reject(error);
						else resolve(result);
					}
				)
				.end(buffer);
		});

		return json({
			success: true,
			url: (result as any).secure_url
		});
	} catch (error: any) {
		console.error('Cloudinary upload error:', error);
		return json({ error: error.message || 'Upload failed' }, { status: 500 });
	}
};

