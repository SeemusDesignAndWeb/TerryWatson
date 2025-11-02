<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Episode } from '$lib/types';
	import RichTextEditor from '$lib/RichTextEditor.svelte';

	let episode: Episode = $state({
		title: '',
		date: '',
		description: '',
		audioUrl: '',
		duration: ''
	});

	let saving = $state(false);
	let error = $state('');
	let uploading = $state(false);
	let uploadProgress = $state('');
	let useUpload = $state(false);
	let audioFile: File | null = $state(null);

	async function handleFileUpload(file: File) {
		if (!file) return;
		
		uploading = true;
		uploadProgress = 'Uploading to Cloudinary...';
		error = '';

		try {
			const formData = new FormData();
			formData.append('audio', file);

			const response = await fetch('/admin/api/episodes/upload', {
				method: 'POST',
				body: formData
			});

			const data = await response.json();

			if (response.ok && data.url) {
				episode.audioUrl = data.url;
				uploadProgress = 'Upload complete!';
				audioFile = null;
			} else {
				error = data.error || 'Upload failed';
			}
		} catch (err) {
			error = 'Failed to upload audio file';
		} finally {
			uploading = false;
			setTimeout(() => {
				uploadProgress = '';
			}, 2000);
		}
	}

	function handleFileChange(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			if (file.type !== 'audio/mpeg' && file.type !== 'audio/mp3' && !file.name.endsWith('.mp3')) {
				error = 'Please upload an MP3 file';
				return;
			}
			audioFile = file;
			handleFileUpload(file);
		}
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		saving = true;
		error = '';

		// Validate that we have an audio URL
		if (!episode.audioUrl.trim()) {
			error = 'Please provide an audio URL or upload a file';
			saving = false;
			return;
		}

		try {
			const episodes = await fetch('/admin/api/episodes').then(r => r.json());
			episodes.unshift(episode);

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
	<title>Add Episode - Admin</title>
</svelte:head>

<div class="admin-container">
	<div class="admin-content">
		<div class="form-header">
			<h1>Add New Episode</h1>
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
				<label>Audio Source *</label>
				<div class="audio-source-toggle">
					<button
						type="button"
						class="toggle-btn"
						class:active={!useUpload}
						onclick={() => { useUpload = false; }}
					>
						Enter URL
					</button>
					<button
						type="button"
						class="toggle-btn"
						class:active={useUpload}
						onclick={() => { useUpload = true; }}
					>
						Upload MP3
					</button>
				</div>

				{#if useUpload}
					<div class="upload-section">
						<input
							type="file"
							id="audioFile"
							accept="audio/mpeg,audio/mp3,.mp3"
							onchange={handleFileChange}
							disabled={uploading}
						/>
						{#if uploading}
							<p class="upload-status">{uploadProgress}</p>
						{/if}
						{#if episode.audioUrl && !uploading}
							<p class="upload-success">✓ File uploaded: {episode.audioUrl.substring(0, 50)}...</p>
						{/if}
					</div>
				{:else}
					<input
						type="url"
						id="audioUrl"
						bind:value={episode.audioUrl}
						required={!useUpload}
						placeholder="https://..."
					/>
				{/if}
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
					{saving ? 'Saving...' : 'Save Episode'}
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

	.audio-source-toggle {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.toggle-btn {
		flex: 1;
		padding: 0.75rem 1rem;
		border: 2px solid var(--border-color);
		background: white;
		border-radius: 8px;
		cursor: pointer;
		font-weight: 600;
		transition: all 0.3s;
		color: var(--text-color);
	}

	.toggle-btn.active {
		background: var(--primary-color);
		color: white;
		border-color: var(--primary-color);
	}

	.toggle-btn:hover:not(.active) {
		border-color: var(--yarrow-gold);
	}

	.upload-section {
		margin-top: 0.5rem;
	}

	.upload-section input[type="file"] {
		width: 100%;
		padding: 0.875rem 1rem;
		border: 2px solid var(--border-color);
		border-radius: 8px;
		font-size: 1rem;
		cursor: pointer;
	}

	.upload-status {
		margin-top: 0.5rem;
		color: var(--primary-color);
		font-weight: 600;
		font-size: 0.9rem;
	}

	.upload-success {
		margin-top: 0.5rem;
		color: #155724;
		background: #d4edda;
		padding: 0.5rem;
		border-radius: 4px;
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

