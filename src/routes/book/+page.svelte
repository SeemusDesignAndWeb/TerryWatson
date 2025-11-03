<script lang="ts">
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();
</script>

<svelte:head>
	<title>The Book - Terry Watson</title>
</svelte:head>

<section class="page-hero">
	<div class="container">
		<h1>The Pastoral Ministry Book</h1>
		<p class="subtitle">Insights from decades of ministry experience</p>
	</div>
</section>

<section class="page-content">
	<div class="container">
		<div class="content-card">
			<div class="intro">
				<p class="large-text">{@html data.bookContent.intro}</p>
			</div>
			
			<div class="section">
				<h2>About the Book</h2>
				{#each data.bookContent.about.split('\n\n') as paragraph}
					{#if paragraph.trim()}
						<p>{@html paragraph.trim().replace(/\n/g, '<br>')}</p>
					{/if}
				{/each}
			</div>
			
			<div class="section highlight">
				<h2>📖 Key Topics</h2>
				<ul class="topic-list">
					{#each data.bookContent.topics as topic}
						{#if topic.trim()}
							<li>{topic}</li>
						{/if}
					{/each}
				</ul>
			</div>
			
			<div class="section">
				<h2>Availability</h2>
				{#each data.bookContent.availability.split('\n\n') as paragraph}
					{#if paragraph.trim()}
						<p>{@html paragraph.trim().replace(/\n/g, '<br>')}</p>
					{/if}
				{/each}
			</div>
			
			<div class="cta-section">
				<p>Interested in learning more?</p>
				<div class="cta-buttons">
					<a href="/news" class="btn">Stay Updated</a>
					<a href="/audio" class="btn btn-secondary">Listen to Audio</a>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.page-hero {
		background: linear-gradient(135deg, var(--cerulean-blue) 0%, var(--pacific-blue) 50%, var(--grass-green) 100%);
		color: white;
		padding: calc(2.5rem + 60px) 2rem 2.5rem 2rem;
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

	.section p {
		line-height: 1.9;
		margin-bottom: 1.25rem;
		font-size: 1.05rem;
	}

	.topic-list {
		list-style: none;
		padding: 0;
		margin: 1.5rem 0;
	}

	.topic-list li {
		padding: 0.75rem 0;
		padding-left: 1.5rem;
		position: relative;
		font-size: 1.05rem;
		color: var(--text-color);
		line-height: 1.7;
	}

	.topic-list li::before {
		content: "✓";
		position: absolute;
		left: 0;
		color: var(--yarrow-gold);
		font-weight: bold;
		font-size: 1.2rem;
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
			padding: calc(2rem + 60px) 1.5rem 2rem 1.5rem;
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
</style>
