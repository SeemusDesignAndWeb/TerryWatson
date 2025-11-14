import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env file explicitly
config({ path: resolve(process.cwd(), '.env') });

// Simple password check - in production, use environment variables
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'; // Change this!

// Debug: Log the expected password on server start (remove in production)
if (process.env.NODE_ENV !== 'production') {
	console.log('[Login] Server initialized');
	console.log('[Login] ADMIN_PASSWORD env var set:', !!process.env.ADMIN_PASSWORD);
	console.log('[Login] Using password:', ADMIN_PASSWORD ? `${ADMIN_PASSWORD.substring(0, 2)}*** (length: ${ADMIN_PASSWORD.length})` : 'NOT SET - using default: admin123');
	console.log('[Login] Full ADMIN_PASSWORD from env:', process.env.ADMIN_PASSWORD ? 'SET' : 'NOT SET');
}

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const body = await request.json();
		const password = body.password?.trim(); // Trim whitespace

		if (!password) {
			return json({ success: false, error: 'Password is required' }, { status: 400 });
		}

		// Debug logging (remove in production)
		console.log('[Login] Attempting login');
		console.log('[Login] Expected password:', ADMIN_PASSWORD ? `"${ADMIN_PASSWORD}" (length: ${ADMIN_PASSWORD.length})` : 'NOT SET');
		console.log('[Login] Received password:', password ? `"${password}" (length: ${password.length})` : 'EMPTY');
		console.log('[Login] Password match:', password === ADMIN_PASSWORD);
		console.log('[Login] Character codes - Expected:', ADMIN_PASSWORD?.split('').map((c: string) => c.charCodeAt(0)).join(','));
		console.log('[Login] Character codes - Received:', password?.split('').map((c: string) => c.charCodeAt(0)).join(','));

		if (password === ADMIN_PASSWORD) {
			cookies.set('admin_session', 'authenticated', {
				path: '/',
				httpOnly: true,
				sameSite: 'lax', // Changed from 'strict' to 'lax' for better compatibility
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 * 7 // 7 days
			});

			console.log('[Login] Success - cookie set');
			return json({ success: true });
		}

		console.log('[Login] Failed - password mismatch');
		return json({ success: false, error: 'Invalid password' }, { status: 401 });
	} catch (error) {
		console.error('[Login] API error:', error);
		return json({ success: false, error: 'Invalid request' }, { status: 400 });
	}
};

