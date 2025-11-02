<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { Episode } from '$lib/types';

	let episodes = $state<Episode[]>([]);
	let loading = $state(true);

	async function loadEpisodes() {
		try {
			const response = await fetch('/admin/api/episodes');
			episodes = await response.json();
		} catch (error) {
			console.error('Error loading episodes:', error);
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		loadEpisodes();
	});
</script>

<svelte:head>
	<title>Podcast Episodes - Admin - Terry Watson</title>
</svelte:head>

<div class="admin-container">
	<header class="admin-header">
		<h1>Podcast Episodes</h1>
		<a href="/admin/episodes/new" class="btn">Add New Episode</a>
	</header>

	{#if loading}
		<div class="loading">Loading...</div>
	{:else}
		<div class="admin-content">
			<div class="items-list">
				{#each episodes as episode, index}
					<div class="item-card">
						<div class="item-info">
							<h3>{episode.title}</h3>
							{#if episode.date}
								<span class="item-meta">{episode.date}</span>
							{/if}
							{#if episode.description}
								<p class="item-description">{episode.description}</p>
							{/if}
						</div>
						<div class="item-actions">
							<a href="/admin/episodes/{index}/edit" class="btn-small">Edit</a>
							<button 
								class="btn-small btn-danger" 
								onclick={async () => {
									if (confirm('Delete this episode?')) {
										const newEpisodes = episodes.filter((_, i) => i !== index);
										await fetch('/admin/api/episodes', {
											method: 'PUT',
											headers: { 'Content-Type': 'application/json' },
											body: JSON.stringify(newEpisodes)
										});
										episodes = newEpisodes;
									}
								}}
							>
								Delete
							</button>
						</div>
					</div>
				{:else}
					<p class="empty-state">No episodes yet. <a href="/admin/episodes/new">Add your first episode</a></p>
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

	.items-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.item-card {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem;
		background: white;
		border-radius: 12px;
		border: 2px solid var(--border-color);
		transition: all 0.3s;
	}

	.item-card:hover {
		border-color: var(--primary-color);
		box-shadow: var(--shadow);
	}

	.item-info {
		flex: 1;
	}

	.item-info h3 {
		margin: 0 0 0.5rem 0;
		color: var(--text-color);
		font-size: 1.1rem;
	}

	.item-meta {
		color: var(--text-light);
		font-size: 0.9rem;
		display: block;
		margin-bottom: 0.5rem;
	}

	.item-description {
		color: var(--text-light);
		font-size: 0.9rem;
		margin: 0.5rem 0 0 0;
		line-height: 1.5;
	}

	.item-actions {
		display: flex;
		gap: 0.75rem;
	}

	.btn-small {
		padding: 0.5rem 1rem;
		font-size: 0.9rem;
		border-radius: 6px;
		text-decoration: none;
		border: none;
		cursor: pointer;
		font-weight: 600;
		transition: all 0.3s;
		background: var(--primary-color);
		color: white;
	}

	.btn-small:hover {
		background: var(--grass-green);
		transform: translateY(-1px);
	}

	.btn-danger {
		background: #dc3545;
	}

	.btn-danger:hover {
		background: #c82333;
	}

	.empty-state {
		text-align: center;
		color: var(--text-light);
		padding: 2rem;
		background: white;
		border-radius: 12px;
	}

	.empty-state a {
		color: var(--primary-color);
		font-weight: 600;
	}

	.loading {
		text-align: center;
		padding: 3rem;
		color: var(--text-light);
		font-size: 1.1rem;
	}

	.btn {
		background: var(--primary-color);
		color: white;
		padding: 0.75rem 1.5rem;
		border-radius: 8px;
		text-decoration: none;
		font-weight: 600;
		transition: all 0.3s;
		display: inline-block;
	}

	.btn:hover {
		background: var(--grass-green);
		transform: translateY(-2px);
		box-shadow: var(--shadow);
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

		.item-card {
			flex-direction: column;
			align-items: flex-start;
			gap: 1rem;
		}

		.item-actions {
			width: 100%;
		}

		.btn-small {
			flex: 1;
		}
	}
</style>

