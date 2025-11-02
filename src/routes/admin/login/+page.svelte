<script lang="ts">
	import { goto } from '$app/navigation';

	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	async function handleLogin(e: Event) {
		e.preventDefault();
		loading = true;
		error = '';

		try {
			const response = await fetch('/admin/api/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ password })
			});

			const data = await response.json();

			if (data.success) {
				goto('/admin');
			} else {
				error = data.error || 'Invalid password';
			}
		} catch (err) {
			error = 'An error occurred. Please try again.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Admin Login - Terry Watson</title>
</svelte:head>

<div class="login-container">
	<div class="login-card">
		<h1>Admin Login</h1>
		<p class="subtitle">Enter your password to access the admin panel</p>
		
		<form onsubmit={handleLogin}>
			{#if error}
				<div class="error-message">
					{error}
				</div>
			{/if}

			<div class="form-group">
				<label for="password">Password</label>
				<input
					type="password"
					id="password"
					bind:value={password}
					required
					placeholder="Enter admin password"
					autocomplete="current-password"
				/>
			</div>

			<button type="submit" class="btn" disabled={loading}>
				{loading ? 'Logging in...' : 'Login'}
			</button>
		</form>

		<div class="back-link">
			<a href="/">← Back to Website</a>
		</div>
	</div>
</div>

<style>
	.login-container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #0a1628 0%, #1a2d42 50%, #0f2143 100%);
		padding: 2rem;
		padding-top: calc(2rem + 100px); /* Account for fixed navbar - login uses main layout */
	}

	.login-card {
		background: white;
		padding: 3rem;
		border-radius: 20px;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
		width: 100%;
		max-width: 450px;
	}

	h1 {
		text-align: center;
		color: var(--primary-color);
		margin-bottom: 0.5rem;
		font-size: 2rem;
	}

	.subtitle {
		text-align: center;
		color: var(--text-light);
		margin-bottom: 2rem;
		font-size: 0.95rem;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.error-message {
		background: #fee;
		color: #c33;
		padding: 0.875rem;
		border-radius: 8px;
		font-size: 0.9rem;
		text-align: center;
		border: 1px solid #fcc;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	label {
		font-weight: 600;
		color: var(--text-color);
		font-size: 0.95rem;
	}

	input {
		padding: 0.875rem 1rem;
		border: 2px solid var(--border-color);
		border-radius: 8px;
		font-size: 1rem;
		transition: border-color 0.3s;
		font-family: inherit;
	}

	input:focus {
		outline: none;
		border-color: var(--primary-color);
		box-shadow: 0 0 0 3px rgba(15, 33, 67, 0.1);
	}

	.btn {
		width: 100%;
		padding: 1rem;
		font-size: 1rem;
		font-weight: 600;
	}

	.btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.back-link {
		margin-top: 1.5rem;
		text-align: center;
	}

	.back-link a {
		color: var(--text-light);
		font-size: 0.9rem;
		text-decoration: none;
	}

	.back-link a:hover {
		color: var(--primary-color);
	}

	@media (max-width: 768px) {
		.login-container {
			padding: 1rem;
			padding-top: calc(1rem + 100px); /* Account for fixed navbar */
		}

		.login-card {
			padding: 2rem 1.5rem;
		}
	}
</style>

