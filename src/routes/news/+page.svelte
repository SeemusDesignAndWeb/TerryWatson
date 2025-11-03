<script lang="ts">
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();
</script>

<svelte:head>
	<title>Updates - Terry Watson</title>
</svelte:head>

<section class="page-hero">
	<div class="container">
		<h1>📰 News & Updates</h1>
		<p class="subtitle">Stay connected with the latest news from Terry</p>
	</div>
</section>

<section class="updates-section">
	<div class="container">
		<div class="updates-list">
			{#each data.updates as update}
				<article class="update-card">
					<div class="update-header">
						<h2>{update.title}</h2>
						<span class="update-date">{update.date}</span>
					</div>
					<div class="update-content">
						{#each update.content.split('\n\n') as paragraph}
							{#if paragraph.trim()}
								<p>{paragraph.trim()}</p>
							{/if}
						{/each}
					</div>
				</article>
			{/each}
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

	.updates-section {
		padding: 4rem 2rem;
		background: var(--bg-light);
	}

	.updates-list {
		max-width: 1000px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 3rem;
	}

	.update-card {
		background: white;
		border-radius: 20px;
		box-shadow: var(--shadow);
		overflow: hidden;
		transition: all 0.3s ease;
		border: 2px solid transparent;
	}

	.update-card:hover {
		transform: translateY(-4px);
		box-shadow: var(--shadow-lg);
		border-color: var(--primary-color);
	}

	.update-header {
		background: linear-gradient(135deg, var(--cerulean-blue) 0%, var(--pacific-blue) 50%, var(--grass-green) 100%);
		color: white;
		padding: 2rem;
	}

	.update-header h2 {
		margin: 0 0 0.5rem 0;
		color: white;
		font-size: 1.75rem;
	}

	.update-date {
		display: block;
		font-size: 1rem;
		opacity: 0.95;
		font-weight: 500;
	}

	.update-content {
		padding: 2.5rem;
	}

	.update-content p {
		line-height: 1.9;
		margin-bottom: 1.5rem;
		font-size: 1.05rem;
		color: var(--text-color);
	}

	.update-content p:last-child {
		margin-bottom: 0;
	}

	@media (max-width: 768px) {
		.page-hero {
			padding: calc(3rem + 100px) 1.5rem 3rem 1.5rem;
		}

		.updates-section {
			padding: 3rem 1.5rem;
		}

		.updates-list {
			gap: 2rem;
		}

		.update-header {
			padding: 1.5rem;
		}

		.update-content {
			padding: 2rem 1.5rem;
		}
	}
</style>
