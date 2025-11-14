<script lang="ts">
	import { onMount } from 'svelte';
	import type { CarouselImage } from '$lib/types';

	let images = $state<CarouselImage[]>([]);
	let loading = $state(true);
	let uploading = $state(false);
	let uploadProgress = $state('');
	let error = $state('');
	let success = $state('');

	async function loadImages() {
		try {
			const response = await fetch('/admin/api/carousel');
			images = await response.json();
		} catch (error) {
			console.error('Error loading carousel images:', error);
			error = 'Failed to load carousel images';
		} finally {
			loading = false;
		}
	}

	async function handleFileUpload(file: File) {
		if (!file) return;
		
		if (!file.type.startsWith('image/')) {
			error = 'Please upload an image file';
			return;
		}

		uploading = true;
		uploadProgress = 'Uploading image to Cloudinary...';
		error = '';
		success = '';

		try {
			const formData = new FormData();
			formData.append('image', file);

			const response = await fetch('/admin/api/carousel/upload', {
				method: 'POST',
				body: formData
			});

			const data = await response.json();

			if (response.ok && data.url) {
				// Add new image to the list
				const newImage: CarouselImage = {
					id: Date.now().toString(36) + Math.random().toString(36).substring(2),
					src: data.url,
					alt: file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
					order: images.length
				};
				
				const updatedImages = [...images, newImage];
				await saveImages(updatedImages);
				uploadProgress = 'Upload complete!';
				success = 'Image uploaded and added to carousel';
				setTimeout(() => {
					uploadProgress = '';
					success = '';
				}, 3000);
			} else {
				error = data.error || 'Upload failed';
			}
		} catch (err) {
			error = 'Failed to upload image';
		} finally {
			uploading = false;
		}
	}

	function handleFileChange(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			handleFileUpload(file);
			// Reset input
			target.value = '';
		}
	}

	async function saveImages(updatedImages: CarouselImage[]) {
		try {
			const response = await fetch('/admin/api/carousel', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(updatedImages)
			});

			if (response.ok) {
				images = updatedImages;
				success = 'Carousel updated successfully';
				setTimeout(() => {
					success = '';
				}, 3000);
			} else {
				error = 'Failed to save carousel';
			}
		} catch (err) {
			error = 'Failed to save carousel';
		}
	}

	async function deleteImage(index: number) {
		if (confirm('Delete this image from the carousel?')) {
			const updatedImages = images.filter((_, i) => i !== index);
			// Reorder remaining images
			updatedImages.forEach((img, i) => {
				img.order = i;
			});
			await saveImages(updatedImages);
		}
	}

	function moveImage(index: number, direction: 'up' | 'down') {
		if (
			(direction === 'up' && index === 0) ||
			(direction === 'down' && index === images.length - 1)
		) {
			return;
		}

		const newIndex = direction === 'up' ? index - 1 : index + 1;
		const updatedImages = [...images];
		[updatedImages[index], updatedImages[newIndex]] = [
			updatedImages[newIndex],
			updatedImages[index]
		];
		
		// Update order
		updatedImages.forEach((img, i) => {
			img.order = i;
		});
		
		saveImages(updatedImages);
	}

	function updateAltText(index: number, newAlt: string) {
		const updatedImages = [...images];
		updatedImages[index].alt = newAlt;
		saveImages(updatedImages);
	}

	onMount(() => {
		loadImages();
	});
</script>

<svelte:head>
	<title>Carousel Images - Admin - Terry Watson</title>
</svelte:head>

<div class="admin-container">
	<header class="admin-header">
		<h1>Carousel Images</h1>
		<div class="header-actions">
			<label for="image-upload" class="btn" class:uploading>
				{uploading ? 'Uploading...' : 'Upload Image'}
			</label>
			<input
				id="image-upload"
				type="file"
				accept="image/*"
				onchange={handleFileChange}
				style="display: none;"
				disabled={uploading}
			/>
		</div>
	</header>

	{#if error}
		<div class="message error">{error}</div>
	{/if}

	{#if success}
		<div class="message success">{success}</div>
	{/if}

	{#if uploadProgress}
		<div class="message info">{uploadProgress}</div>
	{/if}

	{#if loading}
		<div class="loading">Loading carousel images...</div>
	{:else}
		<div class="admin-content">
			<p class="help-text">
				Manage the images displayed in the carousel on the homepage. Images are automatically rotated every 5 seconds.
			</p>

			<div class="images-grid">
				{#each images as image, index}
					<div class="image-card">
						<div class="image-preview">
							<img src={image.src} alt={image.alt} />
							<div class="image-overlay">
								<span class="image-order">#{index + 1}</span>
							</div>
						</div>
						<div class="image-controls">
							<div class="control-group">
								<label>Alt Text:</label>
								<input
									type="text"
									value={image.alt}
									onblur={(e) => updateAltText(index, e.target.value)}
									placeholder="Image description"
								/>
							</div>
							<div class="button-group">
								<button
									class="btn-small"
									onclick={() => moveImage(index, 'up')}
									disabled={index === 0}
									title="Move up"
								>
									↑
								</button>
								<button
									class="btn-small"
									onclick={() => moveImage(index, 'down')}
									disabled={index === images.length - 1}
									title="Move down"
								>
									↓
								</button>
								<button
									class="btn-small btn-danger"
									onclick={() => deleteImage(index)}
									title="Delete"
								>
									Delete
								</button>
							</div>
						</div>
					</div>
				{:else}
					<div class="empty-state">
						<p>No images in carousel yet.</p>
						<p>Upload your first image to get started.</p>
					</div>
				{/each}
			</div>
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
		margin-bottom: 2rem;
		padding-bottom: 1.5rem;
		border-bottom: 2px solid var(--border-color);
		flex-wrap: wrap;
		gap: 1rem;
	}

	.admin-header h1 {
		color: var(--primary-color);
		margin: 0;
		font-size: 2.5rem;
	}

	.header-actions {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	.btn.uploading {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.message {
		padding: 1rem 1.5rem;
		border-radius: 8px;
		margin-bottom: 2rem;
		font-weight: 600;
	}

	.message.error {
		background: #f8d7da;
		color: #721c24;
		border: 1px solid #f5c6cb;
	}

	.message.success {
		background: #d4edda;
		color: #155724;
		border: 1px solid #c3e6cb;
	}

	.message.info {
		background: #d1ecf1;
		color: #0c5460;
		border: 1px solid #bee5eb;
	}

	.admin-content {
		max-width: 1400px;
		margin: 0 auto;
	}

	.help-text {
		color: var(--text-light);
		margin-bottom: 2rem;
		font-size: 0.95rem;
	}

	.images-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
		gap: 2rem;
	}

	.image-card {
		background: white;
		border-radius: 12px;
		box-shadow: var(--shadow);
		overflow: hidden;
		transition: transform 0.3s, box-shadow 0.3s;
	}

	.image-card:hover {
		transform: translateY(-4px);
		box-shadow: var(--shadow-lg);
	}

	.image-preview {
		position: relative;
		width: 100%;
		aspect-ratio: 16 / 10;
		overflow: hidden;
		background: var(--bg-light);
	}

	.image-preview img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.image-overlay {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		background: rgba(0, 0, 0, 0.7);
		color: white;
		padding: 0.25rem 0.75rem;
		border-radius: 20px;
		font-size: 0.875rem;
		font-weight: 600;
	}

	.image-controls {
		padding: 1.5rem;
	}

	.control-group {
		margin-bottom: 1rem;
	}

	.control-group label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 600;
		color: var(--text-color);
		font-size: 0.9rem;
	}

	.control-group input {
		width: 100%;
		padding: 0.75rem;
		border: 2px solid var(--border-color);
		border-radius: 8px;
		font-size: 0.95rem;
		font-family: inherit;
		transition: border-color 0.3s;
	}

	.control-group input:focus {
		outline: none;
		border-color: var(--primary-color);
		box-shadow: 0 0 0 3px rgba(15, 33, 67, 0.1);
	}

	.button-group {
		display: flex;
		gap: 0.5rem;
	}

	.btn-small {
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.3s;
		border: none;
		font-family: inherit;
		font-weight: 600;
	}

	.btn-small:not(.btn-danger) {
		background: var(--primary-color);
		color: white;
	}

	.btn-small:not(.btn-danger):hover:not(:disabled) {
		background: var(--accent-dark);
		transform: translateY(-2px);
	}

	.btn-small:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-small.btn-danger {
		background: #dc3545;
		color: white;
	}

	.btn-small.btn-danger:hover {
		background: #c82333;
		transform: translateY(-2px);
	}

	.empty-state {
		grid-column: 1 / -1;
		text-align: center;
		padding: 4rem 2rem;
		color: var(--text-light);
	}

	.empty-state p {
		margin: 0.5rem 0;
	}

	.loading {
		text-align: center;
		padding: 3rem;
		color: var(--text-light);
		font-size: 1.1rem;
	}

	@media (max-width: 768px) {
		.admin-container {
			padding: 1rem;
		}

		.admin-header {
			flex-direction: column;
			align-items: flex-start;
		}

		.images-grid {
			grid-template-columns: 1fr;
		}
	}
</style>

