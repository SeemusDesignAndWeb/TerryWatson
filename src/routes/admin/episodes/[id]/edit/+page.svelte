<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { Episode } from '$lib/types';
	import RichTextEditor from '$lib/RichTextEditor.svelte';
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();

	let episode: Episode = $state({
		title: data.episode?.title || '',
		date: data.episode?.date || '',
		description: data.episode?.description || '',
		audioUrl: data.episode?.audioUrl || '',
		duration: data.episode?.duration || ''
	});

	let saving = $state(false);
	let error = $state('');

	if (!data.episode) {
		goto('/admin');
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		saving = true;
		error = '';

		try {
			const episodes = await fetch('/admin/api/episodes').then(r => r.json());
			episodes[data.index] = episode;

			const response = await fetch('/admin/api/episodes', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(episodes)
			});

			if (response.ok) {
				goto('/admin');
			} else {
				error = 'Failed to save episode';
			}
		} catch (err) {
			error = 'An error occurred. Please try again.';
		} finally {
			saving = false;
		}
	}
</script>

<svelte:head>
	<title>Edit Episode - Admin</title>
</svelte:head>

<div class="admin-container">
	<div class="admin-content">
		<div class="form-header">
			<h1>Edit Episode</h1>
			<a href="/admin" class="btn btn-secondary">← Back to Dashboard</a>
		</div>

		<form onsubmit={handleSubmit} class="form-card">
			{#if error}
				<div class="error-message">{error}</div>
			{/if}

			<div class="form-group">
				<label for="title">Title *</label>
				<input
					type="text"
					id="title"
					bind:value={episode.title}
					required
					placeholder="Episode title"
				/>
			</div>

			<div class="form-group">
				<label for="date">Date</label>
				<input
					type="text"
					id="date"
					bind:value={episode.date}
					placeholder="e.g., January 2025"
				/>
			</div>

			<div class="form-group">
				<label for="description">Description</label>
				<RichTextEditor bind:value={episode.description} placeholder="Episode description" />
			</div>

			<div class="form-group">
				<label for="audioUrl">Audio URL *</label>
				<input
					type="url"
					id="audioUrl"
					bind:value={episode.audioUrl}
					required
					placeholder="https://..."
				/>
			</div>

			<div class="form-group">
				<label for="duration">Duration</label>
				<input
					type="text"
					id="duration"
					bind:value={episode.duration}
					placeholder="e.g., 45:32"
				/>
			</div>

			<div class="form-actions">
				<button type="submit" class="btn" disabled={saving}>
					{saving ? 'Saving...' : 'Save Changes'}
				</button>
				<a href="/admin" class="btn btn-secondary">Cancel</a>
			</div>
		</form>
	</div>
</div>

<style>
	.admin-container {
		min-height: 100vh;
		background: var(--bg-light);
		padding: 2rem;
	}

	.admin-content {
		max-width: 800px;
		margin: 0 auto;
	}

	.form-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
	}

	.form-header h1 {
		color: var(--primary-color);
		margin: 0;
		font-size: 2rem;
	}

	.form-card {
		background: white;
		padding: 2.5rem;
		border-radius: 16px;
		box-shadow: var(--shadow);
	}

	.error-message {
		background: #fee;
		color: #c33;
		padding: 1rem;
		border-radius: 8px;
		margin-bottom: 1.5rem;
		border: 1px solid #fcc;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 600;
		color: var(--text-color);
	}

	input,
	textarea {
		width: 100%;
		padding: 0.875rem 1rem;
		border: 2px solid var(--border-color);
		border-radius: 8px;
		font-size: 1rem;
		font-family: inherit;
		transition: border-color 0.3s;
	}

	input:focus,
	textarea:focus {
		outline: none;
		border-color: var(--primary-color);
		box-shadow: 0 0 0 3px rgba(15, 33, 67, 0.1);
	}

	textarea {
		resize: vertical;
		min-height: 100px;
	}

	.form-actions {
		display: flex;
		gap: 1rem;
		margin-top: 2rem;
		padding-top: 2rem;
		border-top: 2px solid var(--border-color);
	}

	.btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	@media (max-width: 768px) {
		.admin-container {
			padding: 1rem;
		}

		.form-header {
			flex-direction: column;
			gap: 1rem;
			align-items: flex-start;
		}

		.form-card {
			padding: 1.5rem;
		}

		.form-actions {
			flex-direction: column;
		}

		.btn {
			width: 100%;
		}
	}
</style>

