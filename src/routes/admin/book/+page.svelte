<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { BookContent } from '$lib/types';
	import RichTextEditor from '$lib/RichTextEditor.svelte';

	let content = $state<BookContent>({
		intro: '',
		about: '',
		topics: [],
		availability: ''
	});
	let loading = $state(true);
	let saving = $state(false);
	let message = $state<{ type: 'success' | 'error'; text: string } | null>(null);

	async function loadContent() {
		try {
			const response = await fetch('/admin/api/book');
			content = await response.json();
		} catch (error) {
			console.error('Error loading book content:', error);
			message = { type: 'error', text: 'Failed to load content' };
		} finally {
			loading = false;
		}
	}

	async function handleSave() {
		saving = true;
		message = null;

		try {
			const response = await fetch('/admin/api/book', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(content)
			});

			if (response.ok) {
				message = { type: 'success', text: 'Book content saved successfully!' };
				setTimeout(() => {
					message = null;
				}, 3000);
			} else {
				message = { type: 'error', text: 'Failed to save content' };
			}
		} catch (error) {
			message = { type: 'error', text: 'An error occurred while saving' };
		} finally {
			saving = false;
		}
	}

	function addTopic() {
		content.topics = [...content.topics, ''];
	}

	function removeTopic(index: number) {
		content.topics = content.topics.filter((_, i) => i !== index);
	}

	function moveTopic(index: number, direction: 'up' | 'down') {
		if (direction === 'up' && index > 0) {
			const newTopics = [...content.topics];
			[newTopics[index - 1], newTopics[index]] = [newTopics[index], newTopics[index - 1]];
			content.topics = newTopics;
		} else if (direction === 'down' && index < content.topics.length - 1) {
			const newTopics = [...content.topics];
			[newTopics[index], newTopics[index + 1]] = [newTopics[index + 1], newTopics[index]];
			content.topics = newTopics;
		}
	}

	onMount(() => {
		loadContent();
	});
</script>

<svelte:head>
	<title>Book Content - Admin - Terry Watson</title>
</svelte:head>

<div class="admin-container">
	<header class="admin-header">
		<h1>Edit Book Page</h1>
		<div class="header-actions">
			<a href="/book" target="_blank" class="btn btn-secondary">View Page</a>
		</div>
	</header>

	{#if loading}
		<div class="loading">Loading...</div>
	{:else}
		<div class="admin-content">
			{#if message}
				<div class="message" class:success={message.type === 'success'} class:error={message.type === 'error'}>
					{message.text}
				</div>
			{/if}

			<form onsubmit={(e) => { e.preventDefault(); handleSave(); }}>
				<div class="form-section">
					<label for="intro">Introduction Text</label>
					<RichTextEditor bind:value={content.intro} placeholder="Enter introduction text" />
				</div>

				<div class="form-section">
					<label for="about">About the Book</label>
					<RichTextEditor bind:value={content.about} placeholder="Enter about section content" />
				</div>

				<div class="form-section">
					<div class="section-header">
						<h2>Key Topics</h2>
						<button type="button" class="btn btn-secondary" onclick={addTopic}>Add Topic</button>
					</div>

					{#each content.topics as topic, index}
						<div class="topic-item">
							<div class="topic-controls">
								<button
									type="button"
									class="btn-small"
									onclick={() => moveTopic(index, 'up')}
									disabled={index === 0}
								>
									↑
								</button>
								<button
									type="button"
									class="btn-small"
									onclick={() => moveTopic(index, 'down')}
									disabled={index === content.topics.length - 1}
								>
									↓
								</button>
								<button type="button" class="btn-small btn-danger" onclick={() => removeTopic(index)}>
									Remove
								</button>
							</div>

							<div class="form-group">
								<input
									type="text"
									bind:value={content.topics[index]}
									placeholder="Enter topic"
									required
								/>
							</div>
						</div>
					{/each}
				</div>

				<div class="form-section">
					<label for="availability">Availability</label>
					<RichTextEditor bind:value={content.availability} placeholder="Enter availability information" />
				</div>

				<div class="form-actions">
					<button type="submit" class="btn" disabled={saving}>
						{saving ? 'Saving...' : 'Save Changes'}
					</button>
					<a href="/admin" class="btn btn-secondary">Cancel</a>
				</div>
			</form>
		</div>
	{/if}
</div>

<style>
	.admin-container {
		min-height: 100vh;
		background: var(--bg-light);
		padding: 2rem;
	}

	.admin-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 3rem;
		padding-bottom: 1.5rem;
		border-bottom: 2px solid var(--border-color);
	}

	.admin-header h1 {
		color: var(--primary-color);
		margin: 0;
		font-size: 2.5rem;
	}

	.header-actions {
		display: flex;
		gap: 1rem;
	}

	.admin-content {
		max-width: 1000px;
		margin: 0 auto;
		background: white;
		padding: 2.5rem;
		border-radius: 16px;
		box-shadow: var(--shadow);
	}

	.message {
		padding: 1rem 1.5rem;
		border-radius: 8px;
		margin-bottom: 2rem;
		font-weight: 600;
	}

	.message.success {
		background: #d4edda;
		color: #155724;
		border: 1px solid #c3e6cb;
	}

	.message.error {
		background: #f8d7da;
		color: #721c24;
		border: 1px solid #f5c6cb;
	}

	.form-section {
		margin-bottom: 3rem;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.section-header h2 {
		margin: 0;
		color: var(--primary-color);
		font-size: 1.75rem;
	}

	.topic-item {
		background: var(--bg-light);
		padding: 2rem;
		border-radius: 12px;
		margin-bottom: 1.5rem;
		border: 2px solid var(--border-color);
	}

	.topic-controls {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1.5rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid var(--border-color);
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	.form-group label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 600;
		color: var(--text-color);
	}

	input[type='text'] {
		width: 100%;
		padding: 0.875rem 1rem;
		border: 2px solid var(--border-color);
		border-radius: 8px;
		font-size: 1rem;
		font-family: inherit;
		transition: border-color 0.3s;
	}

	input[type='text']:focus {
		outline: none;
		border-color: var(--yarrow-gold);
		box-shadow: 0 0 0 3px rgba(139, 98, 18, 0.1);
	}

	.form-actions {
		display: flex;
		gap: 1rem;
		margin-top: 2rem;
		padding-top: 2rem;
		border-top: 2px solid var(--border-color);
	}

	.btn-small {
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		border-radius: 6px;
		border: none;
		cursor: pointer;
		font-weight: 600;
		transition: all 0.3s;
		background: var(--primary-color);
		color: white;
	}

	.btn-small:hover:not(:disabled) {
		background: var(--grass-green);
		transform: translateY(-1px);
	}

	.btn-small:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-danger {
		background: #dc3545;
	}

	.btn-danger:hover:not(:disabled) {
		background: #c82333;
	}

	.loading {
		text-align: center;
		padding: 3rem;
		color: var(--text-light);
		font-size: 1.1rem;
	}

	.btn {
		background: var(--yarrow-gold);
		color: white;
		padding: 0.75rem 1.5rem;
		border-radius: 8px;
		text-decoration: none;
		font-weight: 600;
		transition: all 0.3s;
		display: inline-block;
		border: none;
		cursor: pointer;
		font-size: 1rem;
	}

	.btn:hover:not(:disabled) {
		background: var(--accent-dark);
		transform: translateY(-2px);
		box-shadow: var(--shadow);
	}

	.btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.btn-secondary {
		background: white;
		color: var(--yarrow-gold);
		border: 2px solid var(--yarrow-gold);
	}

	.btn-secondary:hover {
		background: var(--yarrow-gold);
		color: white;
	}

	@media (max-width: 768px) {
		.admin-container {
			padding: 1rem;
		}

		.admin-header {
			flex-direction: column;
			gap: 1rem;
			align-items: flex-start;
		}

		.admin-content {
			padding: 1.5rem;
		}

		.form-actions {
			flex-direction: column;
		}

		.form-actions .btn {
			width: 100%;
		}
	}
</style>

