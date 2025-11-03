<script lang="ts">
	import PodcastPlayer from '$lib/PodcastPlayer.svelte';
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();
	
	let searchQuery = $state('');
	
	const filteredEpisodes = $derived(() => {
		if (!searchQuery.trim()) {
			return data.episodes;
		}
		
		const query = searchQuery.toLowerCase().trim();
		return data.episodes.filter((episode) => {
			const titleMatch = episode.title?.toLowerCase().includes(query);
			const descMatch = episode.description?.toLowerCase().includes(query);
			const dateMatch = episode.date?.toLowerCase().includes(query);
			return titleMatch || descMatch || dateMatch;
		});
	});
</script>

<svelte:head>
	<title>Audio - Terry Watson</title>
</svelte:head>

<section class="page-hero">
	<div class="container">
		<h1>🎙️ Audio</h1>
		<p class="subtitle">Sermons and talks from Terry Watson</p>
	</div>
</section>

<section class="page-content">
	<div class="container">
		<div class="content-card">
			<div class="intro">
				<p class="large-text">Listen to Terry Watson's weekly audio featuring messages from his itinerant preaching ministry, Bible studies, and inspiring testimonies from decades of ministry work.</p>
			</div>

			<div class="section">
				<h2>🎧 Listen to Sermons</h2>
				<p>Select an episode from the dropdown below to start listening. Messages are available from various locations and occasions including Sunday services, Bible studies, and special events.</p>
				
				<div class="search-container">
					<div class="search-box">
						<svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<circle cx="11" cy="11" r="8"></circle>
							<path d="m21 21-4.35-4.35"></path>
						</svg>
						<input
							type="text"
							placeholder="Search episodes by title, description, or date..."
							bind:value={searchQuery}
							class="search-input"
							aria-label="Search episodes"
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
					{#if searchQuery && filteredEpisodes().length === 0}
						<p class="no-results">No episodes found matching "{searchQuery}"</p>
					{:else if searchQuery}
						<p class="search-results-count">{filteredEpisodes().length} episode{filteredEpisodes().length !== 1 ? 's' : ''} found</p>
					{/if}
				</div>
				
				<PodcastPlayer episodes={filteredEpisodes()} />
			</div>
			
			<div class="section">
				<h2>Sunday Messages</h2>
				<p>Join us for weekly Sunday evening messages broadcast on <a href="https://www.newliferadio.co.uk" target="_blank" rel="noopener noreferrer">New Life Radio</a>. These messages are shared from various locations including St Helens Bishopsgate, All Souls Langham Place, and Eltham Green Community Church.</p>
				<p>Each message is grounded in Scripture and shares practical wisdom from years of ministry experience.</p>
			</div>
			
	
			
			<div class="section highlight">
				<h2>📻 Where to Listen</h2>
				<div class="platforms">
					<div class="platform-item">
						<h3>New Life Radio</h3>
						<p>Listen to weekly broadcasts on <a href="https://www.newliferadio.co.uk" target="_blank" rel="noopener noreferrer">New Life Radio</a> Sunday evenings. Messages are also available for streaming on their website.</p>
						<p class="note">Terry also records stories that challenge and inspire, available on the <a href="https://www.newliferadio.co.uk/audio-pages/terry_watson_stories" target="_blank" rel="noopener noreferrer">New Life Radio website</a>.</p>
					</div>
				</div>
			</div>
			
			<div class="section">
				<h2>Recording Sessions</h2>
				<p>Terry regularly records with Mike Coles on <a href="https://www.newliferadio.co.uk" target="_blank" rel="noopener noreferrer">New Life Radio</a>, broadcasting monthly Sunday evening services and recording the History of the Ameva Project each Monday morning. These recordings tell the inspiring story of ministry work in Zimbabwe.</p>
				<p>All recordings are available for listening and can be found through the various platforms mentioned above.</p>
			</div>
			
			<div class="cta-section">
				<p>Stay connected with the ministry</p>
				<div class="cta-buttons">
					<a href="/news" class="btn">Read Updates</a>
					<a href="/book" class="btn btn-secondary">Read the Book</a>
				</div>
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
		background: linear-gradient(135deg, rgba(139, 98, 18, 0.08) 0%, rgba(139, 98, 18, 0.12) 100%);
		padding: 2rem;
		border-radius: 16px;
		margin-bottom: 3rem;
		border-left: 5px solid var(--yarrow-gold);
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

	.section h3 {
		color: var(--accent-dark);
		margin-bottom: 1rem;
		font-size: 1.5rem;
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
	}

	.section a:hover {
		color: var(--grass-green);
	}

	.platforms {
		margin-top: 1.5rem;
	}

	.platform-item {
		background: white;
		padding: 1.5rem;
		border-radius: 12px;
		margin-bottom: 1.5rem;
		border: 2px solid var(--accent-color);
	}

	.platform-item:last-child {
		margin-bottom: 0;
	}

	.platform-item a {
		color: var(--primary-color);
	}

	.note {
		background: rgba(67, 87, 46, 0.1);
		padding: 1rem;
		border-radius: 8px;
		margin-top: 1rem;
		font-style: italic;
	}

	.note a {
		color: var(--grass-green);
	}

	.cta-section {
		background: linear-gradient(135deg, var(--cerulean-blue) 0%, var(--pacific-blue) 50%, var(--grass-green) 100%);
		padding: 2.5rem;
		border-radius: 16px;
		text-align: center;
		margin-top: 3rem;
		color: white;
	}

	.cta-section p {
		font-size: 1.2rem;
		margin-bottom: 1.5rem;
		color: white;
		font-weight: 500;
	}

	.cta-buttons {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.cta-section .btn {
		background: var(--yarrow-gold);
		color: white;
		box-shadow: 0 4px 15px rgba(139, 98, 18, 0.4);
	}

	.cta-section .btn:hover {
		background: var(--accent-dark);
		box-shadow: 0 6px 20px rgba(139, 98, 18, 0.5);
	}

	.cta-section .btn-secondary {
		background: rgba(139, 98, 18, 0.3);
		color: white;
		border: 2px solid var(--yarrow-gold);
	}

	.cta-section .btn-secondary:hover {
		background: rgba(139, 98, 18, 0.4);
		border-color: var(--yarrow-gold);
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

		.cta-section {
			padding: 2rem 1.5rem;
		}

		.cta-buttons {
			flex-direction: column;
		}

		.cta-buttons .btn {
			width: 100%;
		}
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
</style>
