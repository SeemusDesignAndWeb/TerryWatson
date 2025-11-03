<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let { children } = $props();

	let isMenuOpen = $state(false);
	let isScrolled = $state(false);
	let isAdminRoute = $derived($page.url.pathname.startsWith('/admin'));
	let isHomePage = $derived($page.url.pathname === '/');

	const navItems = [
		{ href: '/', label: 'Home' },
		{ href: '/news', label: 'Updates' },
		{ href: '/audio', label: 'Audio' },
		{ href: '/stories', label: 'Stories' },
		{ href: '/book', label: 'Book' },
		{ href: '/ameva', label: 'Ameva' },
		
	];

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	function closeMenu() {
		isMenuOpen = false;
	}

	onMount(() => {
		function handleScroll() {
			isScrolled = window.scrollY > 50;
		}

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<svelte:head>
	<title>Terry Watson - News</title>
	<meta name="description" content="Terry Watson's itinerant preaching ministry with updates, audio, book, and ministry resources" />
</svelte:head>

<div class="app">
	<header class="header" class:scrolled={isScrolled} class:admin={isAdminRoute} class:at-top={!isScrolled}>
		<nav class="nav">
			<div class="nav-brand">
				<a href="/" class="brand-link" class:hidden={isHomePage && !isScrolled}>
					<h1>The home of Terry Watson</h1>
					<span class="tagline">News, audio, and updates</span>
				</a>
			</div>
			
			<button class="menu-toggle" onclick={toggleMenu} aria-label="Toggle menu" class:active={isMenuOpen}>
				<span class="hamburger"></span>
				<span class="hamburger"></span>
				<span class="hamburger"></span>
			</button>

			<ul class="nav-menu" class:open={isMenuOpen}>
				{#each navItems as item}
					<li>
						<a 
							href={item.href} 
							class="nav-link"
							class:active={$page.url.pathname === item.href}
							onclick={closeMenu}
						>
							{item.label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</header>

	<main class="main">
		{@render children()}
	</main>

	<footer class="footer">
		<div class="footer-content">
			<p>&copy; Terry Watson {new Date().getFullYear()}. All rights reserved.</p>
		</div>
	</footer>
</div>

<style>
	.app {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background: var(--bg-light);
	}

	.header {
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(15px);
		-webkit-backdrop-filter: blur(15px);
		color: white;
		padding: 1.25rem 0;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		width: 100%;
		z-index: 100;
		border-bottom: 1px solid rgba(255, 255, 255, 0.2);
		transition: all 0.3s ease;
	}

	.header.at-top {
		background: transparent;
		backdrop-filter: none;
		-webkit-backdrop-filter: none;
		box-shadow: none;
		border-bottom: none;
	}

	@media (max-width: 768px) {
		.header.at-top {
			background: rgba(255, 255, 255, 0.1);
			backdrop-filter: blur(15px);
			-webkit-backdrop-filter: blur(15px);
			box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
			border-bottom: 1px solid rgba(255, 255, 255, 0.2);
		}

		.header.at-top.scrolled {
			background: rgba(15, 33, 67, 0.85);
			backdrop-filter: blur(20px);
			-webkit-backdrop-filter: blur(20px);
		}
	}

	.header.admin {
		background: var(--cerulean-blue);
		backdrop-filter: none;
		-webkit-backdrop-filter: none;
		border-bottom: 1px solid rgba(255, 255, 255, 0.2);
	}

	.header.scrolled {
		background: rgba(15, 33, 67, 0.85);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border-bottom: 1px solid rgba(255, 255, 255, 0.15);
	}

	.header.admin.scrolled {
		background: var(--cerulean-blue);
		backdrop-filter: none;
		-webkit-backdrop-filter: none;
	}

	.nav {
		max-width: 1400px;
		margin: 0 auto;
		padding: 0 2rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
	}

	.brand-link {
		text-decoration: none;
		color: white;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s ease;
	}

	.brand-link.hidden {
		opacity: 0;
		transform: translateY(-10px);
		visibility: hidden;
		pointer-events: none;
	}

	.nav-brand h1 {
		margin: 0;
		font-size: clamp(1.5rem, 3vw, 2rem);
		font-weight: 800;
		color: white;
		text-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
	}

	.tagline {
		font-size: 0.75rem;
		font-weight: 500;
		opacity: 0.95;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	.menu-toggle {
		display: none;
		flex-direction: column;
		gap: 5px;
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0.5rem;
		z-index: 101;
	}

	.menu-toggle.active .hamburger:nth-child(1) {
		transform: rotate(45deg) translate(5px, 5px);
	}

	.menu-toggle.active .hamburger:nth-child(2) {
		opacity: 0;
	}

	.menu-toggle.active .hamburger:nth-child(3) {
		transform: rotate(-45deg) translate(7px, -6px);
	}

	.hamburger {
		width: 28px;
		height: 3px;
		background: white;
		transition: all 0.3s ease;
		border-radius: 2px;
	}

	.nav-menu {
		display: flex;
		list-style: none;
		margin: 0;
		padding: 0;
		gap: 0.5rem;
		flex-wrap: wrap;
		align-items: center;
	}

	.nav-link {
		color: white;
		text-decoration: none;
		padding: 0.625rem 1.25rem;
		border-radius: 50px;
		transition: all 0.3s ease;
		font-weight: 600;
		font-size: 0.95rem;
		background: rgba(255, 255, 255, 0.15);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
	}

	.nav-link:hover,
	.nav-link.active {
		background: rgba(255, 255, 255, 0.3);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
	}

	.main {
		flex: 1;
		width: 100%;
		padding: 0;
		position: relative;
	}

	.footer {
		background: #8B6914;
		color: rgba(255, 255, 255, 0.9);
		padding: 2rem 2rem;
		margin-top: 4rem;
	}

	.footer-content {
		max-width: 1400px;
		margin: 0 auto;
		text-align: center;
	}

	.footer p {
		margin: 0;
		color: rgba(255, 255, 255, 0.7);
		font-size: 0.9rem;
	}

	@media (max-width: 768px) {
		.menu-toggle {
			display: flex;
		}

		.nav-menu {
			display: none;
			flex-direction: column;
			width: 100%;
			margin-top: 1rem;
			gap: 0.75rem;
			background: rgba(255, 255, 255, 0.15);
			padding: 1rem;
			border-radius: 16px;
			backdrop-filter: blur(15px);
			-webkit-backdrop-filter: blur(15px);
		}

		.nav-menu.open {
			display: flex;
		}

		.nav-menu li {
			width: 100%;
			margin: 0;
			padding: 0;
			list-style: none;
		}

		.nav-link {
			width: 100%;
			padding: 0.875rem 1rem;
			text-align: center;
			border-radius: 12px;
			box-sizing: border-box;
			margin: 0;
			display: block;
		}

		.brand-link {
			gap: 0.125rem;
		}

		.tagline {
			font-size: 0.65rem;
		}
	}
</style>
