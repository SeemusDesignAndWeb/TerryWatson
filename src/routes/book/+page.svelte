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
			
			<div class="section purchase-section">
				<h2>Purchase the book</h2>
				<p class="purchase-description">{@html data.bookContent.about}</p>
				
				<div class="purchase-cta">
					<a href="https://amzn.eu/d/4k0fVae" target="_blank" rel="noopener noreferrer" class="btn btn-purchase">
						<svg viewBox="0 0 24 24" fill="currentColor" class="btn-icon">
							<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
						</svg>
						<span>Purchase on Amazon</span>
					</a>
				</div>
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
			
			<div class="section contact-section">
				<h2>Let's Get In Touch!</h2>
				<p>We would love to hear from you</p>
				<a href="mailto:{data.bookContent.contactEmail || 'terry.stanley.watson@gmail.com'}" class="btn btn-contact">{data.bookContent.contactEmail || 'terry.stanley.watson@gmail.com'}</a>
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
		width: 100%;
		box-sizing: border-box;
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

	.purchase-section {
		text-align: center;
	}

	.purchase-description {
		font-size: 1.15rem;
		margin-bottom: 2.5rem;
		color: var(--text-color);
	}

	.purchase-cta {
		display: flex;
		justify-content: center;
		margin-top: 2rem;
	}

	.btn-purchase {
		background: linear-gradient(135deg, var(--yarrow-gold) 0%, var(--accent-dark) 100%);
		color: white;
		padding: 1.25rem 3rem;
		border-radius: 12px;
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		transition: all 0.3s ease;
		font-weight: 600;
		font-size: 1.1rem;
		box-shadow: 0 6px 20px rgba(139, 98, 18, 0.4);
		border: none;
		cursor: pointer;
	}

	.btn-purchase:hover {
		transform: translateY(-3px);
		box-shadow: 0 8px 25px rgba(139, 98, 18, 0.5);
		background: linear-gradient(135deg, var(--accent-dark) 0%, var(--yarrow-gold) 100%);
	}

	.btn-purchase:active {
		transform: translateY(-1px);
	}

	.btn-icon {
		width: 24px;
		height: 24px;
		flex-shrink: 0;
	}

	.contact-section {
		text-align: center;
	}

	.contact-section h2 {
		margin-bottom: 1rem;
	}

	.contact-section p {
		margin-bottom: 1.5rem;
		font-size: 1.1rem;
	}

	.btn-contact {
		background: var(--cerulean-blue);
		color: white;
		padding: 1rem 2rem;
		border-radius: 8px;
		text-decoration: none;
		display: inline-block;
		transition: all 0.3s ease;
		font-weight: 600;
		font-size: 1.1rem;
		box-shadow: 0 4px 15px rgba(15, 33, 67, 0.3);
	}

	.btn-contact:hover {
		background: var(--pacific-blue);
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(15, 33, 67, 0.4);
	}

	@media (max-width: 768px) {
		.page-hero {
			padding: calc(2rem + 60px) 1.5rem 2rem 1.5rem;
		}

		.page-content {
			padding: 3rem 1rem;
			width: 100%;
			max-width: 100%;
		}

		.content-card {
			padding: 2rem 1rem;
			width: 100%;
			max-width: 100%;
		}

		.intro {
			padding: 1.5rem;
		}

		.purchase-cta {
			margin-top: 1.5rem;
		}

		.btn-purchase {
			padding: 1rem 2rem;
			font-size: 1rem;
			width: 100%;
			justify-content: center;
		}
	}

	@media (max-width: 375px) {
		.page-hero {
			padding: calc(1.5rem + 60px) 0.75rem 1.5rem 0.75rem;
		}

		.page-content {
			padding: 2rem 0.75rem;
		}

		.content-card {
			padding: 1.5rem 0.75rem;
		}
	}
</style>
