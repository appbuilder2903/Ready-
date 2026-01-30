# Deployment Guide - Codesphere 2.0

This guide covers deploying Codesphere 2.0 to various hosting platforms.

## Prerequisites

Before deploying, ensure you have:
- Node.js >= 18.0.0 installed
- All required API keys (see `.env.example`)
- Completed a successful local build (`npm run build`)

## Environment Variables

All platforms require the following environment variables to be configured:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GITHUB_CLIENT_ID=your_github_client_id
VITE_GITHUB_CLIENT_SECRET=your_github_secret
VITE_EDEN_AI_KEY=your_eden_ai_key
VITE_OPENAI_KEY=your_openai_key
VITE_OPENROUTER_KEY=your_openrouter_key
```

**Important**: Only `VITE_GEMINI_API_KEY` is required. Others are optional.

---

## Vercel Deployment

### Option 1: Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Configure environment variables:
   ```bash
   vercel env add VITE_GEMINI_API_KEY
   vercel env add VITE_GOOGLE_CLIENT_ID
   # ... add other variables
   ```

5. Redeploy with environment variables:
   ```bash
   vercel --prod
   ```

### Option 2: Vercel Dashboard

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Click "New Project" and import your repository
4. Configure environment variables in "Settings" → "Environment Variables"
5. Deploy

### Vercel Configuration

The included `vercel.json` provides:
- Automatic SPA routing
- Optimized caching for static assets
- Node.js 18 runtime

---

## Netlify Deployment

### Option 1: Netlify CLI

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Login:
   ```bash
   netlify login
   ```

3. Initialize site:
   ```bash
   netlify init
   ```

4. Configure environment variables:
   ```bash
   netlify env:set VITE_GEMINI_API_KEY your_key_here
   # ... add other variables
   ```

5. Deploy:
   ```bash
   netlify deploy --prod
   ```

### Option 2: Netlify Drop

1. Build the project:
   ```bash
   npm run build
   ```

2. Visit [app.netlify.com/drop](https://app.netlify.com/drop)
3. Drag and drop the `dist/` folder
4. After deployment, go to "Site settings" → "Environment variables"
5. Add all required variables
6. Trigger a rebuild

### Option 3: GitHub Integration

1. Push code to GitHub
2. Visit [app.netlify.com](https://app.netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect GitHub and select repository
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variables
7. Deploy

### Netlify Configuration

The included `netlify.toml` provides:
- Build configuration
- SPA routing
- Security headers
- Asset caching

---

## GitHub Pages Deployment

1. Update `vite.config.ts`:
   ```ts
   export default defineConfig({
     base: '/your-repo-name/', // Change this
     // ... rest of config
   })
   ```

2. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

3. Add script to `package.json`:
   ```json
   {
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist"
     }
   }
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

5. Enable GitHub Pages in repository settings:
   - Go to Settings → Pages
   - Select "gh-pages" branch
   - Save

**Note**: GitHub Pages doesn't support environment variables at build time. You'll need to use GitHub Actions for that.

### GitHub Pages with Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        env:
          VITE_GEMINI_API_KEY: ${{ secrets.VITE_GEMINI_API_KEY }}
          VITE_GOOGLE_CLIENT_ID: ${{ secrets.VITE_GOOGLE_CLIENT_ID }}
        run: npm run build
        
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

Then add secrets in repository Settings → Secrets → Actions.

---

## Railway Deployment

1. Visit [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add environment variables in "Variables" tab
5. Railway will auto-detect Vite and deploy

---

## Docker Deployment

Create `Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }
    }
}
```

Build and run:

```bash
docker build -t codesphere .
docker run -p 8080:80 codesphere
```

---

## Environment-Specific Builds

### Development
```bash
npm run dev
```

### Production
```bash
npm run build:prod
npm run preview:prod
```

---

## Post-Deployment Checklist

- [ ] Verify all environment variables are set correctly
- [ ] Test login functionality (GitHub/Google OAuth)
- [ ] Test AI features (Gemini API calls)
- [ ] Check browser console for errors
- [ ] Test on mobile devices
- [ ] Verify HTTPS is enabled
- [ ] Configure custom domain (if applicable)
- [ ] Set up analytics (optional)
- [ ] Configure error monitoring (optional)

---

## Troubleshooting

### API Keys Not Working

**Problem**: API calls fail with authentication errors

**Solution**: 
- Ensure environment variables are prefixed with `VITE_`
- Verify variables are set in deployment platform
- Rebuild and redeploy after adding variables

### 404 Errors on Refresh

**Problem**: Page shows 404 when refreshing on routes

**Solution**: 
- Enable SPA routing in your hosting platform
- For Vercel: Already configured in `vercel.json`
- For Netlify: Already configured in `netlify.toml`
- For others: Configure server to serve `index.html` for all routes

### Build Fails

**Problem**: TypeScript or build errors during deployment

**Solution**:
- Run `npm run type-check` locally first
- Ensure Node.js version is 18 or higher
- Clear cache and reinstall: `rm -rf node_modules package-lock.json && npm install`

### Large Bundle Size

**Problem**: Slow load times

**Solution**:
- Bundle is already optimized with code splitting
- Enable gzip/brotli compression on server
- Use CDN for assets
- Check Network tab to identify large files

---

## Performance Optimization

1. **Enable Compression**: Most platforms enable this by default
2. **Use CDN**: Vercel and Netlify provide CDN automatically
3. **Monitor Performance**: Use Lighthouse or WebPageTest
4. **Lazy Loading**: Already implemented for heavy modules
5. **Caching**: Static assets are cached for 1 year

---

## Security Considerations

- Never commit `.env` files
- Rotate API keys regularly
- Use HTTPS only (enforced by most platforms)
- Keep dependencies updated: `npm audit fix`
- Monitor for security vulnerabilities

---

## Support

For deployment issues:
- Check platform-specific documentation
- Review build logs for errors
- Ensure all prerequisites are met
- Test production build locally first: `npm run preview:prod`

---

**Last Updated**: 2026-01-30
