<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let episodesCount = $state(0);
	let newsCount = $state(0);
	let loading = $state(true);

	async function loadCounts() {
		try {
			const [episodesData, newsData] = await Promise.all([
				fetch('/admin/api/episodes').then(r => r.json()),
				fetch('/admin/api/news').then(r => r.json())
			]);
			episodesCount = episodesData.length;
			newsCount = newsData.length;
		} catch (error) {
			console.error('Error loading data:', error);
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		loadCounts();
	});
</script>

<svelte:head>
	<title>Admin Dashboard - Terry Watson</title>
</svelte:head>

<div class="admin-container">
	<header class="admin-header">
		<h1>Admin Dashboard</h1>
	</header>

	{#if loading}
		<div class="loading">Loading...</div>
	{:else}
		<div class="admin-content">
			<div class="dashboard-grid">
				<a href="/admin/carousel" class="dashboard-card">
					<div class="card-icon">🖼️</div>
					<h2>Carousel Images</h2>
					<p class="card-count">Homepage Carousel</p>
					<p class="card-description">Manage the images displayed in the carousel on the homepage.</p>
					<span class="card-link">Manage Carousel →</span>
				</a>

				<a href="/admin/episodes" class="dashboard-card">
					<div class="card-icon">🎙️</div>
					<h2>Audio Episodes</h2>
					<p class="card-count">{episodesCount} episode{episodesCount !== 1 ? 's' : ''}</p>
					<p class="card-description">Manage audio episodes, add new content, and edit existing episodes.</p>
					<span class="card-link">View Episodes →</span>
				</a>

				<a href="/admin/news" class="dashboard-card">
					<div class="card-icon">📰</div>
					<h2>News Updates</h2>
					<p class="card-count">{newsCount} update{newsCount !== 1 ? 's' : ''}</p>
					<p class="card-description">Manage ministry updates, news, and announcements.</p>
					<span class="card-link">View Updates →</span>
				</a>

				<a href="/admin/ameva" class="dashboard-card">
					<div class="card-icon">🌍</div>
					<h2>Ameva Page</h2>
					<p class="card-count">Content Editor</p>
					<p class="card-description">Edit the Ameva Project page content, sections, and introduction text.</p>
					<span class="card-link">Edit Page →</span>
				</a>

				<a href="/admin/book" class="dashboard-card">
					<div class="card-icon">📖</div>
					<h2>Book Page</h2>
					<p class="card-count">Content Editor</p>
					<p class="card-description">Edit the book page content, introduction, topics, and availability information.</p>
					<span class="card-link">Edit Page →</span>
				</a>
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
		margin-bottom: 3rem;
		padding-bottom: 1.5rem;
		border-bottom: 2px solid var(--border-color);
	}

	.admin-header h1 {
		color: var(--primary-color);
		margin: 0;
		font-size: 2.5rem;
	}

	.admin-content {
		max-width: 1400px;
		margin: 0 auto;
	}

	.dashboard-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
	}

	.dashboard-card {
		background: white;
		padding: 2.5rem;
		border-radius: 16px;
		box-shadow: var(--shadow);
		text-decoration: none;
		color: inherit;
		transition: all 0.3s;
		border: 2px solid transparent;
		display: flex;
		flex-direction: column;
	}

	.dashboard-card:hover {
		border-color: var(--primary-color);
		box-shadow: var(--shadow-lg);
		transform: translateY(-4px);
	}

	.card-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.dashboard-card h2 {
		color: var(--primary-color);
		margin: 0 0 0.5rem 0;
		font-size: 1.75rem;
	}

	.card-count {
		color: var(--text-light);
		font-size: 1.1rem;
		font-weight: 600;
		margin: 0 0 1rem 0;
	}

	.card-description {
		color: var(--text-color);
		line-height: 1.6;
		margin: 0 0 1.5rem 0;
		flex: 1;
	}

	.card-link {
		color: var(--primary-color);
		font-weight: 600;
		font-size: 0.95rem;
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

		.dashboard-grid {
			grid-template-columns: 1fr;
		}

		.dashboard-card {
			padding: 2rem;
		}
	}
</style>

