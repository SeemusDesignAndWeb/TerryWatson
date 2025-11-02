# Terry & Fran Watson Website

A modern website built with SvelteKit 5 for Terry and Fran Watson, featuring updates, news, audio content, stories, and information about the Ameva Project.

## Features

- **Home Page**: Latest update from Terry & Fran
- **News Page**: Archive of previous updates and news
- **Audio Page**: Information about audio recordings and messages
- **Ameva Page**: Details about the Ameva Project in Zimbabwe
- **Stories Page**: Inspiring stories and testimonies
- **Pastoral Ministry Book**: Information about Terry's book

## Technology Stack

- **SvelteKit 5**: Modern web framework
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server

## Getting Started

### Installation

Dependencies are already installed. If you need to reinstall:

```bash
npm install --legacy-peer-deps
```

### Development

Start the development server:

```bash
npm run dev
```

The site will be available at `http://localhost:5173`

### Building for Production

Build the site for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── app.css          # Global styles
├── app.html         # HTML template
├── routes/
│   ├── +layout.svelte    # Main layout with navigation
│   ├── +page.svelte      # Home page
│   ├── news/
│   │   └── +page.svelte  # News page
│   ├── audio/
│   │   └── +page.svelte  # Audio page
│   ├── ameva/
│   │   └── +page.svelte  # Ameva page
│   ├── stories/
│   │   └── +page.svelte  # Stories page
│   └── pastoral-ministry/
│       └── +page.svelte  # Pastoral Ministry Book page
└── lib/
    └── assets/      # Static assets
```

## Customization

- Update content in the respective page files in `src/routes/`
- Modify styles in `src/app.css` or in component `<style>` blocks
- Navigation items can be updated in `src/routes/+layout.svelte`

## Deployment

This site can be deployed to any platform that supports Node.js, such as:
- Vercel
- Netlify
- Cloudflare Pages
- Any Node.js hosting service

Simply run `npm run build` and deploy the `build` directory (or follow platform-specific instructions).
