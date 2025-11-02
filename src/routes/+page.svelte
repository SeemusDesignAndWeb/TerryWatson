<script lang="ts">
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();

	function getExcerpt(content: string, maxLength: number = 300): string {
		if (!content) return '';
		
		// Strip HTML tags
		const text = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
		
		// Get first sentence or paragraph
		const firstParagraph = text.split('\n\n')[0] || text;
		
		// If it's longer than maxLength, truncate at word boundary
		if (firstParagraph.length > maxLength) {
			const truncated = firstParagraph.substring(0, maxLength);
			const lastSpace = truncated.lastIndexOf(' ');
			return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
		}
		
		return firstParagraph;
	}

	let latestExcerpt = $derived(data.latestUpdate ? getExcerpt(data.latestUpdate.content) : '');
</script>

<svelte:head>
	<title>Terry Watson - Itinerant Preaching Ministry</title>
</svelte:head>

<!-- Hero Section -->
<section class="hero">
	<div class="hero-container">
		<div class="hero-content">
			<div class="hero-text">
				<h1 class="hero-title">Welcome</h1>
				{#if latestExcerpt}
					<div class="hero-excerpt">
						<p class="hero-excerpt-text">{latestExcerpt}</p>
						<a href="/news" class="hero-excerpt-link">Read latest update →</a>
					</div>
				{:else}
					<p class="hero-subtitle">News updates, audio podcast, and the book from Terry Watson.</p>
				{/if}
				<div class="hero-buttons">
					<a href="/audio" class="btn">Listen to Podcast</a>
					<a href="/book" class="btn btn-secondary">Read the Book</a>
				</div>
			</div>
		</div>
		<div class="hero-image">
			<img src="https://www.terryandfran.info/company/terryandfran/images/WN020118009_1024.jpg" alt="Terry Watson" />
		</div>
	</div>
</section>

<!-- Features Section -->
<section class="features">
	<div class="container">
		<div class="features-grid">
			<a href="/audio" class="feature-card">
				<div class="feature-icon">🎙️</div>
				<h3>Audio Podcast</h3>
				<p>Listen to weekly messages, Bible studies, and inspiring stories from Terry's preaching ministry.</p>
				<span class="feature-link">Explore Podcast →</span>
			</a>
			<a href="/book" class="feature-card">
				<div class="feature-icon">📖</div>
				<h3>The Book</h3>
				<p>Discover insights from decades of pastoral ministry and itinerant preaching experience.</p>
				<span class="feature-link">Learn More →</span>
			</a>
			<a href="/news" class="feature-card">
				<div class="feature-icon">✍️</div>
				<h3>Latest Updates</h3>
				<p>Stay connected with ministry updates, travels, and stories from the field.</p>
				<span class="feature-link">Read Updates →</span>
			</a>
		</div>
	</div>
</section>

<style>
	.hero {
		position: relative;
		background: linear-gradient(135deg, #0a1628 0%, #1a2d42 50%, #0f2143 100%);
		padding: calc(5rem + 100px) 2rem 6rem 2rem;
		overflow: hidden;
		min-height: 70vh;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 0;
	}

	.hero-container {
		max-width: 1400px;
		width: 100%;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 4rem;
		align-items: center;
	}

	.hero-content {
		position: relative;
		z-index: 2;
	}

	.hero-text {
		text-align: left;
		color: white;
	}

	.hero-title {
		font-size: clamp(2.5rem, 5vw, 4.5rem);
		font-weight: 800;
		margin-bottom: 1.5rem;
		color: white;
		line-height: 1.1;
	}

	.hero-subtitle {
		font-size: clamp(1.1rem, 2vw, 1.4rem);
		margin-bottom: 2.5rem;
		color: rgba(255, 255, 255, 0.9);
		line-height: 1.6;
		font-weight: 400;
	}

	.hero-excerpt {
		margin-bottom: 2.5rem;
		padding: 1.5rem;
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10px);
		border-radius: 12px;
		border-left: 4px solid var(--yarrow-gold);
	}

	.hero-excerpt-text {
		font-size: clamp(0.9rem, 1.5vw, 1.05rem);
		color: rgba(255, 255, 255, 0.95);
		line-height: 1.7;
		margin-bottom: 1rem;
		font-style: italic;
	}

	.hero-excerpt-link {
		color: var(--yarrow-gold);
		font-weight: 600;
		font-size: 0.95rem;
		text-decoration: none;
		transition: all 0.3s ease;
		display: inline-block;
	}

	.hero-excerpt-link:hover {
		color: white;
		transform: translateX(5px);
	}

	.hero-buttons {
		display: flex;
		gap: 1rem;
		justify-content: flex-start;
		flex-wrap: wrap;
	}

	.hero-image {
		position: relative;
		z-index: 2;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.hero-image img {
		width: 100%;
		height: auto;
		border-radius: 16px;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
		object-fit: cover;
		max-height: 600px;
	}

	.hero .btn {
		background: var(--yarrow-gold);
		color: white;
		font-size: 1.1rem;
		padding: 1rem 2.5rem;
		font-weight: 700;
		box-shadow: 0 4px 15px rgba(139, 98, 18, 0.4);
	}

	.hero .btn:hover {
		background: var(--accent-dark);
		transform: translateY(-3px);
		box-shadow: 0 6px 20px rgba(139, 98, 18, 0.5);
	}

	.hero .btn-secondary {
		background: rgba(139, 98, 18, 0.2);
		color: white;
		border: 2px solid var(--yarrow-gold);
		backdrop-filter: blur(10px);
	}

	.hero .btn-secondary:hover {
		background: rgba(139, 98, 18, 0.3);
		border-color: var(--yarrow-gold);
		color: white;
	}

	.features {
		padding: 5rem 2rem;
		background: white;
	}

	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 2.5rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	.feature-card {
		background: white;
		padding: 2.5rem;
		border-radius: 20px;
		box-shadow: var(--shadow);
		text-align: center;
		transition: all 0.3s ease;
		border: 2px solid transparent;
		text-decoration: none;
		color: inherit;
		display: block;
	}

	.feature-card:hover {
		transform: translateY(-8px);
		box-shadow: var(--shadow-lg);
		border-color: var(--yarrow-gold);
	}

	.feature-icon {
		font-size: 3.5rem;
		margin-bottom: 1.5rem;
		display: block;
	}

	.feature-card h3 {
		color: var(--text-color);
		margin-bottom: 1rem;
		font-size: 1.5rem;
	}

	.feature-card p {
		color: var(--text-light);
		margin-bottom: 1.5rem;
		line-height: 1.7;
	}

	.feature-link {
		color: var(--yarrow-gold);
		font-weight: 600;
		font-size: 1rem;
		transition: all 0.3s ease;
		display: inline-block;
	}

	.feature-card:hover .feature-link {
		color: var(--accent-dark);
		transform: translateX(5px);
	}

	@media (max-width: 968px) {
		.hero-container {
			grid-template-columns: 1fr;
			gap: 3rem;
		}

		.hero-image {
			order: -1;
		}

		.hero-image img {
			max-height: 400px;
		}

		.hero-text {
			text-align: center;
		}

		.hero-buttons {
			justify-content: center;
		}
	}

	@media (max-width: 768px) {
		.hero {
			padding: calc(3rem + 100px) 1.5rem 4rem 1.5rem;
			min-height: auto;
		}

		.hero-container {
			gap: 2rem;
		}

		.hero-buttons {
			flex-direction: column;
			align-items: stretch;
		}

		.hero .btn {
			width: 100%;
		}

		.hero-image img {
			max-height: 300px;
		}

		.features {
			padding: 3rem 1.5rem;
		}

		.features-grid {
			grid-template-columns: 1fr;
			gap: 2rem;
		}
	}
</style>
