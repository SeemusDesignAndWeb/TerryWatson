import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Simple password check - in production, use environment variables
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'; // Change this!

export const POST: RequestHandler = async ({ request, cookies }) => {
	const { password } = await request.json();

	if (password === ADMIN_PASSWORD) {
		cookies.set('admin_session', 'authenticated', {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 7 // 7 days
		});

		return json({ success: true });
	}

	return json({ success: false, error: 'Invalid password' }, { status: 401 });
};

