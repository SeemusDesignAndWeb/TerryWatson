<script lang="ts">
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();
</script>

<svelte:head>
	<title>Ameva - Terry Watson</title>
</svelte:head>

<section class="page-hero">
	<div class="container">
		<h1>Ameva Project</h1>
		<p class="subtitle">Ministry work in Zimbabwe since 1981</p>
	</div>
</section>

<section class="page-content">
	<div class="container">
		<div class="content-card">
			<div class="intro">
				<p class="large-text">{@html data.amevaContent.intro}</p>
			</div>
			
			{#each data.amevaContent.sections as section}
				<div class="section" class:highlight={section.isHighlight}>
					<h2>{section.title}</h2>
					{#each section.content.split('\n\n') as paragraph}
						{#if paragraph.trim()}
							<p>{@html paragraph.trim().replace(/\n/g, '<br>')}</p>
						{/if}
					{/each}
				</div>
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

	.intro :global(a) {
		color: var(--primary-color);
		text-decoration: underline;
		font-weight: 600;
		transition: color 0.3s;
	}

	.intro :global(a:hover) {
		color: var(--grass-green);
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

	.section :global(a) {
		color: var(--primary-color);
		text-decoration: underline;
		font-weight: 600;
		transition: color 0.3s;
	}

	.section :global(a:hover) {
		color: var(--grass-green);
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
