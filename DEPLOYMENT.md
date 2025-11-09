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
- Content changes are saved to `src/lib/data/*.json` files
- These files are version controlled in Git
- Production content should be backed up before major updates

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

