<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { AmevaContent } from '$lib/types';

	let content = $state<AmevaContent>({
		intro: '',
		sections: []
	});
	let loading = $state(true);
	let saving = $state(false);
	let message = $state<{ type: 'success' | 'error'; text: string } | null>(null);

	async function loadContent() {
		try {
			const response = await fetch('/admin/api/ameva');
			content = await response.json();
		} catch (error) {
			console.error('Error loading Ameva content:', error);
			message = { type: 'error', text: 'Failed to load content' };
		} finally {
			loading = false;
		}
	}

	async function handleSave() {
		saving = true;
		message = null;

		try {
			const response = await fetch('/admin/api/ameva', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(content)
			});

			if (response.ok) {
				message = { type: 'success', text: 'Ameva content saved successfully!' };
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

	function addSection() {
		content.sections = [...content.sections, { title: '', content: '', isHighlight: false }];
	}

	function removeSection(index: number) {
		content.sections = content.sections.filter((_, i) => i !== index);
	}

	function moveSection(index: number, direction: 'up' | 'down') {
		if (direction === 'up' && index > 0) {
			const newSections = [...content.sections];
			[newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
			content.sections = newSections;
		} else if (direction === 'down' && index < content.sections.length - 1) {
			const newSections = [...content.sections];
			[newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
			content.sections = newSections;
		}
	}

	onMount(() => {
		loadContent();
	});
</script>

<svelte:head>
	<title>Ameva Content - Admin - Terry Watson</title>
</svelte:head>

<div class="admin-container">
	<header class="admin-header">
		<h1>Edit Ameva Page</h1>
		<div class="header-actions">
			<a href="/ameva" target="_blank" class="btn btn-secondary">View Page</a>
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

			<form onsubmit|preventDefault={handleSave}>
				<div class="form-section">
					<label for="intro">Introduction Text</label>
					<textarea
						id="intro"
						bind:value={content.intro}
						rows="4"
						placeholder="Enter introduction text (HTML allowed)"
						required
					></textarea>
					<p class="help-text">You can use HTML tags like &lt;a&gt; for links</p>
				</div>

				<div class="form-section">
					<div class="section-header">
						<h2>Sections</h2>
						<button type="button" class="btn btn-secondary" onclick={addSection}>Add Section</button>
					</div>

					{#each content.sections as section, index}
						<div class="section-item">
							<div class="section-controls">
								<button
									type="button"
									class="btn-small"
									onclick={() => moveSection(index, 'up')}
									disabled={index === 0}
								>
									↑
								</button>
								<button
									type="button"
									class="btn-small"
									onclick={() => moveSection(index, 'down')}
									disabled={index === content.sections.length - 1}
								>
									↓
								</button>
								<button type="button" class="btn-small btn-danger" onclick={() => removeSection(index)}>
									Remove
								</button>
							</div>

							<div class="form-group">
								<label for="section-title-{index}">Section Title</label>
								<input
									id="section-title-{index}"
									type="text"
									bind:value={section.title}
									placeholder="Section title"
									required
								/>
							</div>

							<div class="form-group">
								<label for="section-content-{index}">Section Content</label>
								<textarea
									id="section-content-{index}"
									bind:value={section.content}
									rows="6"
									placeholder="Section content (HTML allowed, use \n for new paragraphs)"
									required
								></textarea>
							</div>

							<div class="form-group checkbox-group">
								<label>
									<input type="checkbox" bind:checked={section.isHighlight} />
									Highlight this section
								</label>
							</div>
						</div>
					{/each}
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

	.section-item {
		background: var(--bg-light);
		padding: 2rem;
		border-radius: 12px;
		margin-bottom: 1.5rem;
		border: 2px solid var(--border-color);
	}

	.section-controls {
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

	input[type='text'],
	textarea {
		width: 100%;
		padding: 0.875rem 1rem;
		border: 2px solid var(--border-color);
		border-radius: 8px;
		font-size: 1rem;
		font-family: inherit;
		transition: border-color 0.3s;
	}

	input[type='text']:focus,
	textarea:focus {
		outline: none;
		border-color: var(--yarrow-gold);
		box-shadow: 0 0 0 3px rgba(139, 98, 18, 0.1);
	}

	textarea {
		resize: vertical;
		min-height: 100px;
	}

	.help-text {
		margin-top: 0.5rem;
		font-size: 0.875rem;
		color: var(--text-light);
		margin-bottom: 0;
	}

	.checkbox-group label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		font-weight: 500;
	}

	.checkbox-group input[type='checkbox'] {
		width: auto;
		margin: 0;
		cursor: pointer;
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


