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

**⚠️ IMPORTANT: Git pushes do NOT automatically deploy to production**

This site can be deployed to any platform that supports Node.js, such as:
- Vercel
- Netlify
- Cloudflare Pages
- Railway
- Any Node.js hosting service

### Manual Deployment Process

1. **Build the site locally:**
   ```bash
   npm run build
   ```

2. **Test the build:**
   ```bash
   npm run preview
   ```

3. **Deploy manually** through your hosting platform's dashboard or CLI
   - Never set up automatic deployments from Git
   - Always review changes before deploying
   - Test locally before deploying to production

### Protecting Production Content

- Content files (`src/lib/data/*.json`) are version controlled
- Changes to content should be made through the admin interface
- Git pushes update the codebase, but deployment is manual
- Always backup production data before major updates

### Deployment Checklist

- [ ] Test changes locally with `npm run dev`
- [ ] Build and preview with `npm run build && npm run preview`
- [ ] Review all changes
- [ ] Backup production data if needed
- [ ] Deploy manually through hosting platform
- [ ] Verify deployment after going live
