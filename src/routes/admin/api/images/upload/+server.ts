import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { v2 as cloudinary } from 'cloudinary';
import { Buffer } from 'buffer';

// Configure Cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.PUBLIC_CLOUDINARY_CLOUD_NAME || 'seemusdesignandweb',
	api_key: process.env.CLOUDINARY_API_KEY || '343371222851216',
	api_secret: process.env.CLOUDINARY_API_SECRET || '1HFy-ajf7PDZWJ7xZlAc5uTFwlc'
});

export const POST: RequestHandler = async ({ request }) => {
	try {
		const formData = await request.formData();
		const file = formData.get('image') as File;

		if (!file) {
			return json({ error: 'No file provided' }, { status: 400 });
		}

		// Validate file type
		if (!file.type.startsWith('image/')) {
			return json({ error: 'File must be an image' }, { status: 400 });
		}

		// Convert file to buffer
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		// Upload to Cloudinary
		const result = await new Promise((resolve, reject) => {
			cloudinary.uploader
				.upload_stream(
					{
						resource_type: 'image',
						folder: 'images',
						transformation: [
							{ width: 1200, height: 800, crop: 'limit', quality: 'auto' }
						]
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

