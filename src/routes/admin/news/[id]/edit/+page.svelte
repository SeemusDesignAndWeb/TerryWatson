<script lang="ts">
	import { goto } from '$app/navigation';
	import type { NewsUpdate } from '$lib/types';
	import RichTextEditor from '$lib/RichTextEditor.svelte';
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();

	let update: NewsUpdate = $state({
		title: data.update?.title || '',
		date: data.update?.date || '',
		content: data.update?.content || ''
	});

	let saving = $state(false);
	let error = $state('');

	if (!data.update) {
		goto('/admin');
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		saving = true;
		error = '';

		try {
			const updates = await fetch('/admin/api/news').then(r => r.json());
			updates[data.index] = update;

			const response = await fetch('/admin/api/news', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(updates)
			});

			if (response.ok) {
				goto('/admin');
			} else {
				error = 'Failed to save update';
			}
		} catch (err) {
			error = 'An error occurred. Please try again.';
		} finally {
			saving = false;
		}
	}
</script>

<svelte:head>
	<title>Edit News Update - Admin</title>
</svelte:head>

<div class="admin-container">
	<div class="admin-content">
		<div class="form-header">
			<h1>Edit News Update</h1>
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
					bind:value={update.title}
					required
					placeholder="Update title"
				/>
			</div>

			<div class="form-group">
				<label for="date">Date *</label>
				<input
					type="text"
					id="date"
					bind:value={update.date}
					required
					placeholder="e.g., September 20th, 2025"
				/>
			</div>

			<div class="form-group">
				<label for="content">Content *</label>
				<RichTextEditor bind:value={update.content} placeholder="Update content..." />
				<small class="help-text">Use the toolbar to format text: <strong>Bold</strong>, <em>Italic</em>, and add Links.</small>
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
		min-height: 150px;
		font-family: inherit;
		line-height: 1.6;
	}

	.help-text {
		display: block;
		margin-top: 0.5rem;
		color: var(--text-light);
		font-size: 0.875rem;
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

