# 🚀 Deployment Guide - Vercel

This guide will help you deploy your **Calculadora de Notas** application to Vercel.

## Prerequisites

- GitHub account
- Vercel account (free tier is sufficient)
- Your project pushed to GitHub

## Method 1: One-Click Deploy (Recommended)

1. **Click the Deploy Button** in the README
2. **Connect your GitHub account** if not already connected
3. **Configure your repository**:
   - Repository name: `calculadora-de-notas`
   - Make it public or private
4. **Deploy**:
   - Vercel will automatically detect Next.js
   - No environment variables needed
   - Click "Deploy"
5. **Wait for deployment** (usually 1-2 minutes)
6. **Your app is live!** 🎉
   - URL: `https://your-project-name.vercel.app`

## Method 2: Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate.

### Step 3: Deploy

From your project root directory:

```bash
vercel
```

This will:
- Create a new project on Vercel
- Link your local directory
- Deploy a preview version

### Step 4: Deploy to Production

```bash
vercel --prod
```

## Method 3: GitHub Integration (Automatic Deployments)

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Calculadora de Notas"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/calculadora-de-notas.git
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Project**
3. Select **Import Git Repository**
4. Choose your GitHub repository
5. Configure:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
6. Click **Deploy**

### Step 3: Automatic Deployments

Every push to `main` branch will trigger:
- ✅ Automatic production deployment
- 🔍 Build logs and error reporting
- 🌐 Instant global CDN distribution

Every pull request will create:
- 🔗 Preview deployment with unique URL
- 📊 Lighthouse performance reports

## Post-Deployment

### Custom Domain (Optional)

1. Go to your project settings on Vercel
2. Navigate to **Domains**
3. Add your custom domain
4. Update DNS records as instructed

### Environment Variables (If Needed)

Currently, this project doesn't require environment variables, but if needed:

1. Go to **Settings** → **Environment Variables**
2. Add variables for:
   - Development
   - Preview
   - Production

## Vercel Configuration (Optional)

Create `vercel.json` in project root for custom configuration:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

## Troubleshooting

### Build Fails

**Check build logs** in Vercel dashboard:
- Look for TypeScript errors
- Verify all dependencies are in `package.json`
- Ensure `next build` works locally

### Page Not Found (404)

- Verify `app/page.tsx` exists
- Check Next.js App Router structure
- Clear Vercel cache and redeploy

### Styles Not Loading

- Ensure `globals.css` is imported in `layout.tsx`
- Verify Tailwind configuration
- Check PostCSS setup

### Theme Not Persisting

- localStorage is client-side only
- Check `'use client'` directive in `ThemeProvider.tsx`
- Verify browser localStorage is enabled

## Performance Optimization

Vercel automatically provides:
- ✨ Image optimization
- 🚀 Automatic code splitting
- 📦 Edge caching
- 🌍 Global CDN distribution

## Monitoring

Access analytics in Vercel dashboard:
- **Web Vitals**: LCP, FID, CLS scores
- **Real User Monitoring**: Actual user experience data
- **Function Logs**: Server-side debugging (if using API routes)

## Useful Commands

```bash
# Preview deployment
vercel

# Production deployment
vercel --prod

# View deployment logs
vercel logs

# List all deployments
vercel ls

# Remove a deployment
vercel rm [deployment-url]

# Open project in browser
vercel open
```

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

---

**Your app is now live and globally accessible! Share your `*.vercel.app` URL on your CV and LinkedIn.** 🎉
