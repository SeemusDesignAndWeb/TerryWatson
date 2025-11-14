# Deployment Guide

## ⚠️ Critical: Manual Deployment Only

**Git pushes do NOT automatically deploy to production.**

This ensures that:
- You have full control over when changes go live
- You can test changes before deploying
- Production content is never accidentally overwritten
- You can review all changes before they go live

## Deployment Process

### Step 1: Test Locally
```bash
npm run dev
```
Test all changes thoroughly on your local machine.

### Step 2: Build for Production
```bash
npm run build
```

### Step 3: Preview the Build
```bash
npm run preview
```
Verify everything looks correct in the production build.

### Step 4: Manual Deployment
Deploy through your hosting platform's interface:
- **Railway**: Use the Railway dashboard to deploy
- **Vercel**: Use `vercel --prod` command or dashboard
- **Netlify**: Use `netlify deploy --prod` or dashboard
- **Other platforms**: Follow their manual deployment process

## What Gets Deployed

When you deploy:
- ✅ Code changes (components, routes, styles)
- ✅ Build artifacts (compiled JavaScript, CSS)
- ❌ Content files are NOT overwritten (they're stored separately)

## Content Management

- Content is managed through the admin interface at `/admin`
- Content changes are saved to persistent storage (Railway volumes)
- Default/seed data is stored in `src/lib/data/*.json` files (version controlled in Git)
- Production content persists across deployments via Railway volumes
- Production content should be backed up before major updates

## Railway Volume Setup (Production)

This application uses Railway volumes for persistent data storage. The data persists across deployments.

### Step 1: Create Railway Volume

1. Go to your Railway project → Service
2. Click **"New"** → **"Volume"**
3. **Name:** `data-storage` (or any descriptive name)
4. **Mount Path:** `/data` (must be absolute path)
5. Click **"Add"**

### Step 2: Configure Environment Variables

In Railway, go to your service → **Variables** tab and add:

```
EPISODES_DB_PATH=/data/episodes.json
NEWS_DB_PATH=/data/news.json
BOOK_DB_PATH=/data/book.json
AMEVA_DB_PATH=/data/ameva.json
```

### Step 3: How It Works

- **Development:** Uses relative paths (`./data/*.json`) - files in `src/lib/data/`
- **Production:** Uses absolute paths (`/data/*.json`) - files in Railway volume
- **Auto-initialization:** On first read, if volume file doesn't exist, it copies from git-tracked defaults
- **Persistence:** All writes go to the volume, so data survives deployments

### Step 4: Verify Setup

After deployment, check Railway logs for:
```
[DB] Initializing episodes.json from git version...
[DB] Successfully initialized episodes.json
```

Make a test change via admin panel, then redeploy to verify data persists.

## Preventing Auto-Deployment

To ensure Git pushes never auto-deploy:

1. **Check hosting platform settings:**
   - Disable "Auto Deploy" or "Continuous Deployment"
   - Use manual deployment only

2. **No CI/CD pipelines:**
   - Do not set up GitHub Actions, GitLab CI, or similar
   - Keep deployment manual

3. **Review before deploying:**
   - Always test locally first
   - Review changes in Git before deploying
   - Use staging environment if available

## Emergency Rollback

If something goes wrong:
1. Revert to previous Git commit
2. Rebuild: `npm run build`
3. Redeploy manually
4. Restore content from backup if needed

