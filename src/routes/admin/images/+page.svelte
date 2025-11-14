<script lang="ts">
	import { onMount } from 'svelte';
	import type { ImageLibraryItem } from '$lib/types';

	let images = $state<ImageLibraryItem[]>([]);
	let loading = $state(true);
	let uploading = $state(false);
	let uploadProgress = $state('');
	let error = $state('');
	let success = $state('');

	async function loadImages() {
		try {
			const response = await fetch('/admin/api/images');
			images = await response.json();
		} catch (error) {
			console.error('Error loading images:', error);
			error = 'Failed to load images';
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

			const response = await fetch('/admin/api/images/upload', {
				method: 'POST',
				body: formData
			});

			const data = await response.json();

			if (response.ok && data.url) {
				// Add new image to the library
				const newImage: ImageLibraryItem = {
					id: Date.now().toString(36) + Math.random().toString(36).substring(2),
					src: data.url,
					alt: file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
					uploadedAt: new Date().toISOString()
				};
				
				const updatedImages = [...images, newImage];
				await saveImages(updatedImages);
				uploadProgress = 'Upload complete!';
				success = 'Image uploaded successfully';
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

	async function saveImages(updatedImages: ImageLibraryItem[]) {
		try {
			const response = await fetch('/admin/api/images', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(updatedImages)
			});

			if (response.ok) {
				images = updatedImages;
				success = 'Images saved successfully';
				setTimeout(() => {
					success = '';
				}, 3000);
			} else {
				error = 'Failed to save images';
			}
		} catch (err) {
			error = 'Failed to save images';
		}
	}

	async function deleteImage(index: number) {
		if (confirm('Delete this image from the library? This will also remove it from the carousel if it\'s being used.')) {
			const imageToDelete = images[index];
			const updatedImages = images.filter((_, i) => i !== index);
			await saveImages(updatedImages);
			
			// Also remove from carousel if it's there
			try {
				const carouselResponse = await fetch('/admin/api/carousel');
				const carouselItems = await carouselResponse.json();
				const updatedCarousel = carouselItems.filter((item: any) => item.imageId !== imageToDelete.id);
				await fetch('/admin/api/carousel', {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(updatedCarousel)
				});
			} catch (err) {
				console.error('Error updating carousel:', err);
			}
		}
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
	<title>Image Library - Admin - Terry Watson</title>
</svelte:head>

<div class="admin-container">
	<header class="admin-header">
		<h1>Image Library</h1>
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
		<div class="loading">Loading images...</div>
	{:else}
		<div class="admin-content">
			<p class="help-text">
				Manage your image library. Upload images here, then select which ones to display in the carousel.
			</p>

			<div class="images-grid">
				{#each images as image, index}
					<div class="image-card">
						<div class="image-preview">
							<img src={image.src} alt={image.alt} />
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
							<button
								class="btn-small btn-danger"
								onclick={() => deleteImage(index)}
								title="Delete from library"
							>
								Delete
							</button>
						</div>
					</div>
				{:else}
					<div class="empty-state">
						<p>No images in library yet.</p>
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
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
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

	.btn-small {
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.3s;
		border: none;
		font-family: inherit;
		font-weight: 600;
		width: 100%;
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

