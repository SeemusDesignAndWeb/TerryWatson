import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

// Simple authentication - in production, use environment variables
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'; // Change this!

const authHandle: Handle = async ({ event, resolve }) => {
	// Check if accessing admin routes
	if (event.url.pathname.startsWith('/admin')) {
		// Allow login page and login API
		if (event.url.pathname === '/admin/login' || event.url.pathname === '/admin/api/login') {
			return resolve(event);
		}

		// Check for authentication
		const sessionId = event.cookies.get('admin_session');
		
		if (!sessionId || sessionId !== 'authenticated') {
			// Redirect to login
			return new Response(null, {
				status: 302,
				headers: {
					Location: '/admin/login'
				}
			});
		}
	}

	return resolve(event);
};

export const handle = sequence(authHandle);

