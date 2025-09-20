# Forward Meet - Deployment Guide

## GitHub Pages Deployment

The app is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Setup Steps:

1. **Add GitHub Secret:**
   - Go to your repository Settings → Secrets and variables → Actions
   - Add a new secret: `VITE_GOOGLE_MAPS_API_KEY` with your Google Maps API key

2. **Enable GitHub Pages:**
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` (will be created automatically)

3. **Trigger Deployment:**
   - Push to `main` or `deployment-setup` branch
   - GitHub Actions will automatically build and deploy

### Demo Mode:
- When deployed to GitHub Pages, the app runs in demo mode
- Shows sample restaurant data without requiring a backend server
- Perfect for showcasing the UI and functionality

### Live URL:
After deployment, your app will be available at:
`https://[username].github.io/forward-meet/`

## Local Development

### Frontend:
```bash
cd client
npm install --legacy-peer-deps
npm run dev
```

### Backend:
```bash
cd server
npm install
npm run dev
```

## Environment Variables

### Client (.env):
```
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
VITE_API_URL=http://localhost:8080  # for local development
```

### Server (.env):
```
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
PORT=8080
```