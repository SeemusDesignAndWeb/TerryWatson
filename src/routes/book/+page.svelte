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
				<p class="large-text">{data.bookContent.intro}</p>
			</div>
			
			<div class="section">
				<h2>Purchase the book online</h2>
				<p>{data.bookContent.about}</p>
				
				<div class="purchase-options">
					<div class="purchase-option">
						<h3>Kindle Version</h3>
						<p class="price">£{data.bookContent.purchaseOptions?.kindle?.price || '3.02'}</p>
						<a href="https://www.amazon.co.uk/dp/B0CHJZNX2K" target="_blank" rel="noopener noreferrer" class="btn btn-purchase">Purchase Kindle</a>
					</div>
					
					<div class="purchase-option">
						<h3>Second Hand Paperback</h3>
						<a href="https://www.amazon.co.uk/s?k=The+Pastoral+Ministry+Terry+Watson&i=stripbooks" target="_blank" rel="noopener noreferrer" class="btn btn-purchase">View on Amazon</a>
					</div>
					
					<div class="purchase-option">
						<h3>New Paperback Copies</h3>
						<p>{data.bookContent.availability}</p>
					</div>
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
				<a href="mailto:{data.bookContent.contactEmail || 'terryandfran.info.update@gmail.com'}" class="btn btn-contact">{data.bookContent.contactEmail || 'terryandfran.info.update@gmail.com'}</a>
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

	.purchase-options {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 2rem;
		margin-top: 2rem;
	}

	.purchase-option {
		background: linear-gradient(135deg, rgba(67, 87, 46, 0.05) 0%, rgba(53, 78, 86, 0.05) 100%);
		padding: 2rem;
		border-radius: 12px;
		border: 2px solid var(--border-color);
		text-align: center;
	}

	.purchase-option h3 {
		color: var(--primary-color);
		margin-bottom: 1rem;
		font-size: 1.3rem;
	}

	.purchase-option p {
		margin-bottom: 1rem;
	}

	.price {
		font-size: 1.5rem;
		font-weight: bold;
		color: var(--yarrow-gold);
		margin: 1rem 0;
	}

	.btn-purchase {
		background: var(--yarrow-gold);
		color: white;
		padding: 0.875rem 2rem;
		border-radius: 8px;
		text-decoration: none;
		display: inline-block;
		transition: all 0.3s ease;
		font-weight: 600;
		box-shadow: 0 4px 15px rgba(139, 98, 18, 0.3);
	}

	.btn-purchase:hover {
		background: var(--accent-dark);
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(139, 98, 18, 0.4);
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

		.cta-section {
			padding: 2rem 1.5rem;
		}

		.cta-buttons {
			flex-direction: column;
		}

		.cta-buttons .btn {
			width: 100%;
		}

		.purchase-options {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}

		.purchase-option {
			padding: 1.5rem;
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
