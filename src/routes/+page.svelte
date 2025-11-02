<script lang="ts">
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();
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
				<p class="hero-subtitle">News updates, audio podcast, and the book from Terry Watson.</p>
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
			<div class="feature-card">
				<div class="feature-icon">🎙️</div>
				<h3>Audio Podcast</h3>
				<p>Listen to weekly messages, Bible studies, and inspiring stories from Terry's preaching ministry.</p>
				<a href="/audio" class="feature-link">Explore Podcast →</a>
			</div>
			<div class="feature-card">
				<div class="feature-icon">📖</div>
				<h3>The Book</h3>
				<p>Discover insights from decades of pastoral ministry and itinerant preaching experience.</p>
				<a href="/book" class="feature-link">Learn More →</a>
			</div>
			<div class="feature-card">
				<div class="feature-icon">✍️</div>
				<h3>Latest Updates</h3>
				<p>Stay connected with ministry updates, travels, and stories from the field.</p>
				<a href="/news" class="feature-link">Read Updates →</a>
			</div>
		</div>
	</div>
</section>

<!-- Latest Update Section -->
<section class="latest-update-section">
	<div class="container">
		{#if data.latestUpdate}
			<div class="update-container">
				<div class="update-header">
					<h2>Latest Ministry Update</h2>
					<span class="update-date">{data.latestUpdate.date}</span>
				</div>
				
				<div class="update-content">
					{#each data.latestUpdate.content.split('\n\n') as paragraph}
						{#if paragraph.trim()}
							<p>{@html paragraph.trim().replace(/\n/g, '<br>')}</p>
						{/if}
					{/each}
					
					<div class="update-footer">
						<a href="/news" class="btn">Read All Updates</a>
					</div>
				</div>
			</div>
		{:else}
			<div class="update-container">
				<div class="update-header">
					<h2>Latest Ministry Update</h2>
				</div>
				
				<div class="update-content">
					<p>No updates available at this time. Please check back soon!</p>
					<div class="update-footer">
						<a href="/news" class="btn">View All Updates</a>
					</div>
				</div>
			</div>
		{/if}
	</div>
</section>

<style>
	.hero {
		position: relative;
		background: linear-gradient(135deg, #0a1628 0%, #1a2d42 50%, #0f2143 100%);
		padding: calc(8rem + 100px) 2rem 6rem 2rem;
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
	}

	.feature-link:hover {
		color: var(--accent-dark);
		transform: translateX(5px);
	}

	.latest-update-section {
		padding: 5rem 2rem;
		background: var(--bg-light);
	}

	.update-container {
		max-width: 900px;
		margin: 0 auto;
		background: white;
		border-radius: 20px;
		box-shadow: var(--shadow-lg);
		overflow: hidden;
	}

	.update-header {
		background: linear-gradient(135deg, var(--cerulean-blue) 0%, var(--pacific-blue) 50%, var(--grass-green) 100%);
		color: white;
		padding: 2rem;
		text-align: center;
	}

	.update-header h2 {
		margin: 0 0 0.5rem 0;
		color: white;
		font-size: 2rem;
	}

	.update-date {
		display: block;
		font-size: 1rem;
		opacity: 0.95;
		font-weight: 500;
	}

	.update-content {
		padding: 3rem 2.5rem;
	}

	.update-content p {
		line-height: 1.9;
		margin-bottom: 1.5rem;
		font-size: 1.05rem;
	}

/*	.signature {
		margin-top: 2rem;
		font-style: italic;
		color: var(--text-color);
	}
*/
	.update-footer {
		margin-top: 3rem;
		text-align: center;
		padding: 2.5rem;
		border-top: 2px solid var(--border-color);
		background: linear-gradient(135deg, rgba(139, 98, 18, 0.1) 0%, rgba(139, 98, 18, 0.15) 50%, rgba(139, 98, 18, 0.1) 100%);
		border-radius: 16px;
		margin-left: -1rem;
		margin-right: -1rem;
		position: relative;
	}

	.update-footer .btn {
		background: var(--yarrow-gold);
		color: white;
		font-weight: 700;
		padding: 1.25rem 3rem;
		font-size: 1.25rem;
		box-shadow: 0 6px 20px rgba(139, 98, 18, 0.4);
		border-radius: 50px;
		display: inline-block;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		transition: all 0.3s ease;
		position: relative;
		z-index: 1;
	}

	.update-footer .btn:hover {
		background: var(--accent-dark);
		transform: translateY(-4px) scale(1.05);
		box-shadow: 0 8px 30px rgba(139, 98, 18, 0.5);
		color: white;
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
			padding: calc(4rem + 100px) 1.5rem 4rem 1.5rem;
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

		.latest-update-section {
			padding: 3rem 1.5rem;
		}

		.update-content {
			padding: 2rem 1.5rem;
		}

		.update-header {
			padding: 1.5rem;
		}
	}
</style>
