<script lang="ts">
	import '../../app.css';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let { children } = $props();

	let isMenuOpen = $state(false);

	const navItems = [
		{ href: '/admin', label: 'Dashboard' },
		{ href: '/admin/episodes', label: 'Podcast Episodes' },
		{ href: '/admin/news', label: 'News Updates' },
		{ href: '/admin/ameva', label: 'Ameva Page' },
		{ href: '/admin/book', label: 'Book Page' }
	];

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	function closeMenu() {
		isMenuOpen = false;
	}

	async function handleLogout() {
		await fetch('/admin/api/logout', { method: 'POST' });
		goto('/admin/login');
	}
</script>

<svelte:head>
	<title>Admin - Terry Watson</title>
</svelte:head>

<div class="app">
	<header class="header">
		<nav class="nav">
			<div class="nav-brand">
				<a href="/admin" class="brand-link">
					<h1>Admin</h1>
					<span class="tagline">Terry Watson</span>
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
				<li>
					<button class="nav-link nav-button" onclick={handleLogout}>
						Logout
					</button>
				</li>
			</ul>
		</nav>
	</header>

	<main class="main">
		{@render children()}
	</main>
</div>

<style>
	.app {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background: var(--bg-light);
	}

	.header {
		background: var(--cerulean-blue);
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
		display: inline-block;
	}

	.nav-link:hover,
	.nav-link.active {
		background: rgba(255, 255, 255, 0.3);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
	}

	.nav-button {
		cursor: pointer;
		border: none;
		font-family: inherit;
	}

	.main {
		flex: 1;
		width: 100%;
		padding: 0;
		position: relative;
		padding-top: 100px; /* Account for fixed header */
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
			gap: 0.5rem;
			background: rgba(255, 255, 255, 0.15);
			padding: 1rem;
			border-radius: 16px;
			backdrop-filter: blur(15px);
			-webkit-backdrop-filter: blur(15px);
		}

		.nav-menu.open {
			display: flex;
		}

		.nav-link {
			width: 100%;
			padding: 1rem;
			text-align: center;
			border-radius: 12px;
		}

		.brand-link {
			gap: 0.125rem;
		}

		.tagline {
			font-size: 0.65rem;
		}
	}
</style>

