# GitHub Pages Deployment Guide

## Setup Steps:

### 1. Add GitHub Secret
- Go to your repository Settings → Secrets and variables → Actions
- Add: `VITE_GOOGLE_MAPS_API_KEY` = your Google Maps API key

### 2. Enable GitHub Pages
- Go to Settings → Pages
- Source: Deploy from a branch
- Branch: `gh-pages` (will be created automatically)

### 3. Deploy
```bash
git add .
git commit -m "Setup GitHub Pages deployment"
git push origin main
```

### 4. Access Your Site
After deployment (2-3 minutes): `https://[username].github.io/forward-meet/`

## What's Configured:
- ✅ GitHub Actions workflow for CI/CD
- ✅ Automatic deployment on push to main/deployment-setup
- ✅ React 19 dependency handling
- ✅ Proper GitHub Pages artifact upload

## Note:
The app will show "Failed to connect to server" errors since there's no backend deployed. This is expected for a frontend-only GitHub Pages deployment.