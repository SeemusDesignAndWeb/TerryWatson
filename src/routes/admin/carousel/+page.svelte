<script lang="ts">
	import { onMount } from 'svelte';
	import type { CarouselImage, CarouselSettings, ImageLibraryItem } from '$lib/types';

	let imageLibrary = $state<ImageLibraryItem[]>([]);
	let carouselItems = $state<CarouselImage[]>([]);
	let settings = $state<CarouselSettings>({ intervalSeconds: 5 });
	let loading = $state(true);
	let error = $state('');
	let success = $state('');
	let savingSettings = $state(false);
	let showImageModal = $state(false);

	async function loadData() {
		try {
			const [libraryResponse, carouselResponse, settingsResponse] = await Promise.all([
				fetch('/admin/api/images'),
				fetch('/admin/api/carousel'),
				fetch('/admin/api/carousel/settings')
			]);
			imageLibrary = await libraryResponse.json();
			carouselItems = await carouselResponse.json();
			settings = await settingsResponse.json();
		} catch (err) {
			console.error('Error loading carousel data:', err);
			error = 'Failed to load carousel data';
		} finally {
			loading = false;
		}
	}

	async function loadImageLibrary() {
		try {
			const response = await fetch('/admin/api/images');
			imageLibrary = await response.json();
		} catch (err) {
			console.error('Error loading image library:', err);
		}
	}

	function openImageModal() {
		loadImageLibrary();
		showImageModal = true;
	}

	function closeImageModal() {
		showImageModal = false;
	}

	async function saveSettings() {
		savingSettings = true;
		error = '';
		success = '';

		try {
			const response = await fetch('/admin/api/carousel/settings', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(settings)
			});

			if (response.ok) {
				success = 'Settings saved successfully';
				setTimeout(() => {
					success = '';
				}, 3000);
			} else {
				const data = await response.json();
				error = data.error || 'Failed to save settings';
			}
		} catch (err) {
			error = 'Failed to save settings';
		} finally {
			savingSettings = false;
		}
	}

	async function saveCarousel() {
		try {
			const response = await fetch('/admin/api/carousel', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(carouselItems)
			});

			if (response.ok) {
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

	function toggleImageInCarousel(imageId: string) {
		const existingIndex = carouselItems.findIndex(item => item.imageId === imageId);
		
		if (existingIndex >= 0) {
			// Remove from carousel
			carouselItems = carouselItems.filter(item => item.imageId !== imageId);
			// Reorder remaining items
			carouselItems.forEach((item, index) => {
				item.order = index;
			});
		} else {
			// Add to carousel
			carouselItems = [...carouselItems, { imageId, order: carouselItems.length }];
		}
		
		saveCarousel();
	}

	function isInCarousel(imageId: string): boolean {
		return carouselItems.some(item => item.imageId === imageId);
	}

	function moveImage(index: number, direction: 'up' | 'down') {
		if (
			(direction === 'up' && index === 0) ||
			(direction === 'down' && index === carouselItems.length - 1)
		) {
			return;
		}

		const newIndex = direction === 'up' ? index - 1 : index + 1;
		const updatedItems = [...carouselItems];
		[updatedItems[index], updatedItems[newIndex]] = [
			updatedItems[newIndex],
			updatedItems[index]
		];
		
		// Update order
		updatedItems.forEach((item, i) => {
			item.order = i;
		});
		
		carouselItems = updatedItems;
		saveCarousel();
	}

	function getCarouselImageData(imageId: string): ImageLibraryItem | undefined {
		return imageLibrary.find(img => img.id === imageId);
	}

	onMount(() => {
		loadData();
	});
</script>

<svelte:head>
	<title>Carousel Images - Admin - Terry Watson</title>
</svelte:head>

<div class="admin-container">
	<header class="admin-header">
		<h1>Carousel Images</h1>
		<div class="header-actions">
			<button class="btn" onclick={openImageModal}>Add Image</button>
			<a href="/admin/images" class="btn btn-secondary">Manage Image Library</a>
		</div>
	</header>

	{#if error}
		<div class="message error">{error}</div>
	{/if}

	{#if success}
		<div class="message success">{success}</div>
	{/if}

	{#if loading}
		<div class="loading">Loading carousel data...</div>
	{:else}
		<div class="admin-content">
			<div class="settings-section">
				<h2>Carousel Settings</h2>
				<div class="settings-form">
					<div class="form-group">
						<label for="interval">
							Image Change Interval (seconds)
							<span class="help-text-small">Time between image changes (1-60 seconds)</span>
						</label>
						<div class="input-with-button">
							<input
								id="interval"
								type="number"
								min="1"
								max="60"
								bind:value={settings.intervalSeconds}
							/>
							<button
								class="btn-small"
								onclick={saveSettings}
								disabled={savingSettings}
							>
								{savingSettings ? 'Saving...' : 'Save'}
							</button>
						</div>
					</div>
				</div>
			</div>

			<div class="carousel-section">
				<h2>Selected Carousel Images</h2>
				<p class="help-text">
					Images currently displayed in the carousel. Use the buttons below to reorder or remove images.
				</p>

				{#if carouselItems.length > 0}
					<div class="carousel-items">
						{#each carouselItems as item, index}
							{@const imageData = getCarouselImageData(item.imageId)}
							{#if imageData}
								<div class="carousel-item-card">
									<div class="item-preview">
										<img src={imageData.src} alt={imageData.alt} />
										<span class="item-order">#{index + 1}</span>
									</div>
									<div class="item-info">
										<p class="item-alt">{imageData.alt}</p>
									</div>
									<div class="item-actions">
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
											disabled={index === carouselItems.length - 1}
											title="Move down"
										>
											↓
										</button>
										<button
											class="btn-small btn-danger"
											onclick={() => toggleImageInCarousel(item.imageId)}
											title="Remove from carousel"
										>
											Remove
										</button>
									</div>
								</div>
							{/if}
						{/each}
					</div>
				{:else}
					<div class="empty-state">
						<p>No images selected for carousel.</p>
						<p>Click "Add Image" to select images from your library.</p>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>

<!-- Image Selection Modal -->
{#if showImageModal}
	<div 
		class="modal-overlay" 
		onclick={closeImageModal}
		onkeydown={(e) => e.key === 'Escape' && closeImageModal()}
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
		tabindex="-1"
	>
		<div 
			class="modal-content" 
			onclick={(e) => e.stopPropagation()}
			role="presentation"
		>
			<div class="modal-header">
				<h2 id="modal-title">Select Images for Carousel</h2>
				<button class="modal-close" onclick={closeImageModal} aria-label="Close modal">×</button>
			</div>
			<div class="modal-body">
				{#if imageLibrary.length > 0}
					<div class="modal-library-grid">
						{#each imageLibrary as image}
							<button
								type="button"
								class="modal-library-item"
								class:selected={isInCarousel(image.id)}
								onclick={() => {
									toggleImageInCarousel(image.id);
								}}
							>
								<div class="modal-library-preview">
									<img src={image.src} alt={image.alt} />
									{#if isInCarousel(image.id)}
										<div class="modal-selected-badge">✓ Selected</div>
									{/if}
								</div>
								<div class="modal-library-info">
									<p class="modal-library-alt">{image.alt}</p>
								</div>
							</button>
						{/each}
					</div>
				{:else}
					<div class="modal-empty-state">
						<p>No images in library.</p>
						<p><a href="/admin/images">Upload images</a> to get started.</p>
					</div>
				{/if}
			</div>
			<div class="modal-footer">
				<button class="btn" onclick={closeImageModal}>Done</button>
			</div>
		</div>
	</div>
{/if}

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

	.btn-secondary {
		background: rgba(15, 33, 67, 0.1);
		color: var(--primary-color);
		border: 2px solid var(--primary-color);
	}

	.btn-secondary:hover {
		background: rgba(15, 33, 67, 0.2);
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

	.admin-content {
		max-width: 1400px;
		margin: 0 auto;
	}

	.settings-section,
	.carousel-section {
		background: white;
		padding: 2rem;
		border-radius: 12px;
		box-shadow: var(--shadow);
		margin-bottom: 2rem;
	}

	.settings-section h2,
	.carousel-section h2 {
		color: var(--primary-color);
		margin: 0 0 1.5rem 0;
		font-size: 1.75rem;
	}

	.settings-form {
		max-width: 500px;
	}

	.input-with-button {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.input-with-button input {
		flex: 1;
		padding: 0.75rem;
		border: 2px solid var(--border-color);
		border-radius: 8px;
		font-size: 1rem;
		font-family: inherit;
		transition: border-color 0.3s;
	}

	.input-with-button input:focus {
		outline: none;
		border-color: var(--primary-color);
		box-shadow: 0 0 0 3px rgba(15, 33, 67, 0.1);
	}

	.help-text-small {
		display: block;
		font-size: 0.85rem;
		color: var(--text-light);
		font-weight: normal;
		margin-top: 0.25rem;
	}

	.help-text {
		color: var(--text-light);
		margin-bottom: 2rem;
		font-size: 0.95rem;
	}

	.carousel-items {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.carousel-item-card {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		padding: 1rem;
		background: var(--bg-light);
		border-radius: 8px;
		border: 2px solid var(--border-color);
	}

	.item-preview {
		position: relative;
		width: 120px;
		height: 80px;
		border-radius: 8px;
		overflow: hidden;
		flex-shrink: 0;
	}

	.item-preview img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.item-order {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		background: rgba(0, 0, 0, 0.7);
		color: white;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: 600;
	}

	.item-info {
		flex: 1;
	}

	.item-alt {
		margin: 0;
		font-weight: 600;
		color: var(--text-color);
	}

	.item-actions {
		display: flex;
		gap: 0.5rem;
	}

	/* Modal Styles */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.7);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 2rem;
		backdrop-filter: blur(4px);
	}

	.modal-content {
		background: white;
		border-radius: 16px;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
		max-width: 900px;
		width: 100%;
		max-height: 90vh;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem 2rem;
		border-bottom: 2px solid var(--border-color);
	}

	.modal-header h2 {
		margin: 0;
		color: var(--primary-color);
		font-size: 1.75rem;
	}

	.modal-close {
		background: none;
		border: none;
		font-size: 2rem;
		color: var(--text-light);
		cursor: pointer;
		padding: 0;
		width: 2rem;
		height: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		transition: all 0.3s;
	}

	.modal-close:hover {
		background: var(--bg-light);
		color: var(--text-color);
	}

	.modal-body {
		padding: 2rem;
		overflow-y: auto;
		flex: 1;
	}

	.modal-library-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
		gap: 1.5rem;
	}

	.modal-library-item {
		cursor: pointer;
		background: white;
		border-radius: 8px;
		overflow: hidden;
		transition: all 0.3s;
		border: 3px solid transparent;
		width: 100%;
		padding: 0;
		text-align: left;
	}

	.modal-library-item:hover {
		transform: translateY(-4px);
		box-shadow: var(--shadow-lg);
	}

	.modal-library-item.selected {
		border-color: var(--primary-color);
		box-shadow: 0 0 0 3px rgba(15, 33, 67, 0.1);
	}

	.modal-library-preview {
		position: relative;
		width: 100%;
		aspect-ratio: 16 / 10;
		overflow: hidden;
		background: var(--bg-light);
	}

	.modal-library-preview img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.modal-selected-badge {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background: var(--primary-color);
		color: white;
		padding: 0.5rem;
		text-align: center;
		font-size: 0.875rem;
		font-weight: 600;
	}

	.modal-library-info {
		padding: 0.75rem;
	}

	.modal-library-alt {
		margin: 0;
		font-size: 0.875rem;
		color: var(--text-color);
		text-align: center;
	}

	.modal-empty-state {
		text-align: center;
		padding: 3rem 2rem;
		color: var(--text-light);
	}

	.modal-empty-state p {
		margin: 0.5rem 0;
	}

	.modal-empty-state a {
		color: var(--primary-color);
		text-decoration: none;
		font-weight: 600;
	}

	.modal-empty-state a:hover {
		text-decoration: underline;
	}

	.modal-footer {
		padding: 1.5rem 2rem;
		border-top: 2px solid var(--border-color);
		display: flex;
		justify-content: flex-end;
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
		text-align: center;
		padding: 3rem 2rem;
		color: var(--text-light);
	}

	.empty-state p {
		margin: 0.5rem 0;
	}

	.modal-empty-state a {
		color: var(--primary-color);
		text-decoration: none;
		font-weight: 600;
	}

	.modal-empty-state a:hover {
		text-decoration: underline;
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

		.carousel-item-card {
			flex-direction: column;
			align-items: stretch;
		}

		.item-actions {
			justify-content: center;
		}

		.modal-overlay {
			padding: 1rem;
		}

		.modal-content {
			max-height: 95vh;
		}

		.modal-library-grid {
			grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		}
	}
</style>
