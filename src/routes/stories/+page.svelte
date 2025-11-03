<script lang="ts">
	import PodcastPlayer from '$lib/PodcastPlayer.svelte';
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();
	
	let searchQuery = $state('');
	
	const filteredStories = $derived(() => {
		if (!data.stories) return [];
		if (!searchQuery.trim()) {
			return data.stories;
		}
		
		const query = searchQuery.toLowerCase().trim();
		return data.stories.filter((story) => {
			const titleMatch = story.title?.toLowerCase().includes(query);
			const descMatch = story.description?.toLowerCase().includes(query);
			const dateMatch = story.date?.toLowerCase().includes(query);
			return titleMatch || descMatch || dateMatch;
		});
	});
</script>

<svelte:head>
	<title>Stories - Terry Watson</title>
</svelte:head>

<section class="page-hero">
	<div class="container">
		<h1>📖 Stories</h1>
		<p class="subtitle">Inspiring stories from various sources</p>
	</div>
</section>

<section class="page-content">
	<div class="container">
		<div class="content-card">
			<div class="intro">
				<p class="large-text">Welcome to our Stories page. Here you can find stories that challenge and inspire.</p>
			</div>
			
			<div class="section">
				<h2>Recorded Stories</h2>
				<p>Terry is recording stories that challenge and inspire, available on the <a href="https://www.newliferadio.co.uk/audio-pages/terry_watson_stories" target="_blank" rel="noopener noreferrer">New Life Radio website</a>. These stories share experiences, lessons learned, and testimonies from our journey of faith and ministry.</p>
				
				{#if data.stories && data.stories.length > 0}
					<div class="search-container">
						<div class="search-box">
							<svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<circle cx="11" cy="11" r="8"></circle>
								<path d="m21 21-4.35-4.35"></path>
							</svg>
							<input
								type="text"
								placeholder="Search stories by title, description, or date..."
								bind:value={searchQuery}
								class="search-input"
								aria-label="Search stories"
							/>
							{#if searchQuery}
								<button
									type="button"
									onclick={() => searchQuery = ''}
									class="clear-search"
									aria-label="Clear search"
								>
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<line x1="18" y1="6" x2="6" y2="18"></line>
										<line x1="6" y1="6" x2="18" y2="18"></line>
									</svg>
								</button>
							{/if}
						</div>
						{#if searchQuery && filteredStories().length === 0}
							<p class="no-results">No stories found matching "{searchQuery}"</p>
						{:else if searchQuery}
							<p class="search-results-count">{filteredStories().length} story{filteredStories().length !== 1 ? 'ies' : ''} found</p>
						{/if}
					</div>
					
					<PodcastPlayer episodes={filteredStories()} />
				{:else}
					<p class="no-stories">Stories are loading from New Life Radio...</p>
				{/if}
			</div>
			
			<div class="section">
				<h2>The Ameva Story</h2>
				<p>The History of the Ameva Project tells the story of a work that began in 1981 and continues to this day. This extensive history has been recorded in audio format and tells of the lives of John & Celia Valentine, their family, workers from around the world and the many hundreds of people that have been impacted by this work.</p>
				<p>You can listen to these recordings on our <a href="/ameva">Ameva page</a> or visit <a href="https://amevaproject.com" target="_blank" rel="noopener noreferrer">amevaproject.com</a>.</p>
			</div>
			
			<div class="section highlight">
				<h2>New Life Radio</h2>
				<p>Many of our stories and messages are available on <a href="https://www.newliferadio.co.uk/audio-pages/terry_watson_stories" target="_blank" rel="noopener noreferrer">New Life Radio</a>. Please check them out for inspiring content that will encourage and challenge you in your faith journey.</p>
			</div>
		</div>
	</div>
</section>

<style>
	.page-hero {
		background: linear-gradient(135deg, var(--cerulean-blue) 0%, var(--pacific-blue) 50%, var(--grass-green) 100%);
		color: white;
		padding: calc(4rem + 100px) 2rem 4rem 2rem;
		text-align: center;
		margin-top: 0;
	}

	.page-hero h1 {
		color: white;
		font-size: clamp(2.5rem, 5vw, 3.5rem);
		margin-bottom: 1rem;
	}

	.subtitle {
		font-size: 1.25rem;
		color: rgba(255, 255, 255, 0.95);
		margin: 0;
	}

	.page-content {
		padding: 4rem 2rem;
		background: var(--bg-light);
	}

	.content-card {
		max-width: 900px;
		margin: 0 auto;
		background: white;
		padding: 3rem;
		border-radius: 20px;
		box-shadow: var(--shadow-lg);
	}

	.intro {
		background: linear-gradient(135deg, rgba(15, 33, 67, 0.1) 0%, rgba(53, 78, 86, 0.1) 100%);
		padding: 2rem;
		border-radius: 16px;
		margin-bottom: 3rem;
		border-left: 5px solid var(--primary-color);
		text-align: center;
	}

	.large-text {
		font-size: 1.25rem;
		line-height: 1.8;
		margin: 0;
		color: var(--text-color);
		font-weight: 500;
	}

	.section {
		margin-bottom: 3rem;
		padding-bottom: 3rem;
		border-bottom: 2px solid var(--border-color);
	}

	.section:last-of-type {
		border-bottom: none;
		margin-bottom: 0;
		padding-bottom: 0;
	}

	.section.highlight {
		background: linear-gradient(135deg, rgba(67, 87, 46, 0.1) 0%, rgba(53, 78, 86, 0.1) 100%);
		padding: 2rem;
		border-radius: 16px;
		border: none;
	}

	.section h2 {
		color: var(--primary-color);
		margin-bottom: 1.5rem;
		font-size: 2rem;
	}

	.section p {
		line-height: 1.9;
		margin-bottom: 1.25rem;
		font-size: 1.05rem;
	}

	.section a {
		color: var(--primary-color);
		text-decoration: underline;
		font-weight: 600;
		transition: color 0.3s;
	}

	.section a:hover {
		color: var(--grass-green);
	}

	.no-stories {
		margin-top: 1rem;
		padding: 1rem;
		background: rgba(15, 33, 67, 0.05);
		border-radius: 8px;
		font-style: italic;
		color: var(--text-light);
	}

	.search-container {
		margin: 2rem 0;
	}

	.search-box {
		position: relative;
		display: flex;
		align-items: center;
		background: white;
		border: 2px solid var(--border-color);
		border-radius: 12px;
		padding: 0.75rem 1rem;
		transition: all 0.3s ease;
	}

	.search-box:focus-within {
		border-color: var(--primary-color);
		box-shadow: 0 0 0 3px rgba(15, 33, 67, 0.1);
	}

	.search-icon {
		width: 20px;
		height: 20px;
		color: var(--text-light);
		margin-right: 0.75rem;
		flex-shrink: 0;
	}

	.search-input {
		flex: 1;
		border: none;
		outline: none;
		font-size: 1rem;
		color: var(--text-color);
		background: transparent;
	}

	.search-input::placeholder {
		color: var(--text-light);
	}

	.clear-search {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-light);
		transition: color 0.2s;
		margin-left: 0.5rem;
		border-radius: 4px;
	}

	.clear-search:hover {
		color: var(--primary-color);
		background: rgba(15, 33, 67, 0.05);
	}

	.clear-search svg {
		width: 18px;
		height: 18px;
	}

	.search-results-count {
		margin-top: 0.75rem;
		font-size: 0.9rem;
		color: var(--text-light);
		font-style: italic;
	}

	.no-results {
		margin-top: 0.75rem;
		padding: 1rem;
		background: rgba(220, 53, 69, 0.1);
		border-radius: 8px;
		color: var(--text-color);
		font-style: italic;
	}

	@media (max-width: 768px) {
		.page-hero {
			padding: calc(3rem + 100px) 1.5rem 3rem 1.5rem;
		}

		.page-content {
			padding: 3rem 1.5rem;
		}

		.content-card {
			padding: 2rem 1.5rem;
		}

		.intro {
			padding: 1.5rem;
		}
	}
</style>
