# Deployment Guide for aio-llmo.fshp.jp

This guide covers deploying both frontend and backend to production.

## Prerequisites

- Vercel account ([Sign up](https://vercel.com/signup))
- Domain: `aio-llmo.fshp.jp` configured in your DNS provider
- Google Gemini API key
- (Optional) Firebase project for database

## Part 1: Deploy Backend API

### Step 1: Prepare Backend

```bash
cd api
```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Set project name (e.g., aio-llmo-backend)
# - Choose production deployment
```

#### Option B: Using Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your Git repository
4. **Important**: Set root directory to `api`
5. Deploy

### Step 3: Configure Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables, add:

**Required:**
```
GEMINI_API_KEY=your_gemini_api_key_here
```

**Optional (for Firebase database features):**
```
FIREBASE_ADMIN_PROJECT_ID=your-firebase-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n
```

**Note**: Keep the `\n` characters in the private key - they're important!

### Step 4: Note Your Backend URL

After deployment, Vercel will give you a URL like:
```
https://aio-llmo-backend.vercel.app
```

Or configure custom domain in Vercel:
```
https://api.aio-llmo.fshp.jp
```

## Part 2: Deploy Frontend

### Step 1: Update Frontend Configuration

Edit `.env.local` (or `.env.production`):

```env
VITE_API_URL=https://your-backend-url.vercel.app
```

Or if using custom domain:
```env
VITE_API_URL=https://api.aio-llmo.fshp.jp
```

### Step 2: Deploy Frontend

#### Option A: Using Vercel CLI

```bash
# From project root
vercel --prod

# Follow prompts:
# - Set project name (e.g., aio-llmo-frontend)
# - Choose production deployment
```

#### Option B: Using Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your Git repository
4. **Important**: Root directory should be project root (not `api`)
5. Add environment variable: `VITE_API_URL=https://your-backend-url.vercel.app`
6. Deploy

#### Option C: Manual Build and Upload

```bash
# Build frontend
npm run build

# Upload dist/ folder to any static hosting service
# (Vercel, Netlify, Cloudflare Pages, etc.)
```

### Step 3: Configure Custom Domain

#### In Vercel Dashboard:

1. Go to your frontend project
2. Navigate to Settings → Domains
3. Add domain: `aio-llmo.fshp.jp`
4. Vercel will provide DNS records

#### In Your DNS Provider (fshp.jp):

Add the DNS records provided by Vercel. Typically:

**For subdomain `aio-llmo.fshp.jp`:**
```
Type: CNAME
Name: aio-llmo
Value: cname.vercel-dns.com
TTL: 3600 (or default)
```

**Or if using A record:**
```
Type: A
Name: aio-llmo
Value: 76.76.21.21 (Vercel's IP - check their docs)
TTL: 3600
```

### Step 4: Wait for DNS Propagation

DNS changes can take 1-48 hours to propagate. Check status:
```bash
dig aio-llmo.fshp.jp
# or
nslookup aio-llmo.fshp.jp
```

## Part 3: SSL Certificate

Vercel automatically provisions SSL certificates for custom domains. Once DNS propagates:

1. Vercel will detect the domain
2. SSL certificate will be issued (usually within minutes)
3. Your site will be available at `https://aio-llmo.fshp.jp`

## Part 4: Verify Deployment

### Test Backend API:

```bash
curl https://your-backend-url.vercel.app/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-02-12T...",
  "message": "AIO/LLMO Backend API is running"
}
```

### Test Frontend:

1. Visit `https://aio-llmo.fshp.jp`
2. Fill out the analysis form
3. Submit and verify analysis completes

### Test Full Flow:

1. Open browser DevTools (F12)
2. Go to Network tab
3. Submit an analysis
4. Verify API call to backend succeeds
5. Check for any CORS errors

## Part 5: Environment Variables Summary

### Backend (`api/.env.local` or Vercel Environment Variables)

```env
# Required
GEMINI_API_KEY=your_gemini_api_key_here

# Optional - Firebase (for database features)
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Frontend (Vercel Environment Variables or `.env.production`)

```env
VITE_API_URL=https://your-backend-url.vercel.app
```

## Troubleshooting

### Issue: CORS errors in browser

**Solution:** Verify CORS configuration in `api/next.config.js`:

```javascript
async headers() {
  return [
    {
      source: "/api/:path*",
      headers: [
        { key: "Access-Control-Allow-Origin", value: "*" },
        // or restrict to your domain:
        // { key: "Access-Control-Allow-Origin", value: "https://aio-llmo.fshp.jp" },
        { key: "Access-Control-Allow-Methods", value: "GET,POST,OPTIONS" },
        { key: "Access-Control-Allow-Headers", value: "Content-Type" },
      ],
    },
  ];
}
```

### Issue: Gemini API returns 400/403

**Solutions:**
1. Verify API key is correct
2. Check API quota in Google AI Studio
3. Ensure model name is correct (`gemini-2.0-flash-exp`)
4. Check billing is enabled if required

### Issue: Firebase connection fails

**Solutions:**
1. Verify environment variables are set correctly in Vercel
2. Check private key has `\n` characters properly escaped
3. Ensure Firestore is enabled in Firebase Console
4. Remember: Firebase is optional - app works without it

### Issue: DNS not resolving

**Solutions:**
1. Wait longer (DNS can take up to 48 hours)
2. Clear DNS cache: `ipconfig /flushdns` (Windows) or `sudo dscacheutil -flushcache` (Mac)
3. Verify DNS records in your provider dashboard
4. Use online DNS checker tools

### Issue: Build fails on Vercel

**Solutions:**
1. Check build logs in Vercel dashboard
2. Verify all dependencies are in `package.json`
3. Ensure TypeScript compiles locally: `npm run build`
4. Check Node.js version compatibility

## Monitoring & Maintenance

### Vercel Analytics

Enable in Vercel Dashboard → Your Project → Analytics

### Logs

View real-time logs in Vercel Dashboard → Your Project → Logs

### Updating

#### Backend:
```bash
cd api
git commit -am "Update backend"
git push
# Vercel auto-deploys
```

#### Frontend:
```bash
git commit -am "Update frontend"
git push
# Vercel auto-deploys
```

## Cost Estimates

### Vercel
- **Hobby Plan**: Free (suitable for this project)
- **Pro Plan**: $20/month (if you need longer function timeouts)

### Google Gemini API
- Check current pricing: https://ai.google.dev/pricing
- Free tier available with generous limits

### Firebase
- **Spark Plan**: Free (suitable for moderate usage)
- **Blaze Plan**: Pay-as-you-go (only if free tier exceeded)

## Security Best Practices

1. ✅ Never commit `.env.local` or `serviceAccountKey.json`
2. ✅ Use Vercel environment variables for secrets
3. ✅ Enable HTTPS only (Vercel does this automatically)
4. ✅ Restrict CORS to your domain in production
5. ✅ Rotate API keys periodically
6. ✅ Monitor API usage in Gemini dashboard

## Next Steps

After successful deployment:

1. [ ] Test all features on production URL
2. [ ] Set up monitoring/alerts
3. [ ] Configure analytics
4. [ ] Set up error tracking (Sentry, etc.)
5. [ ] Document any custom configurations
6. [ ] Set up CI/CD if not using Vercel auto-deploy

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Gemini API Docs**: https://ai.google.dev/docs
- **Firebase Docs**: https://firebase.google.com/docs

---

**Deployment Checklist:**

- [ ] Backend deployed to Vercel
- [ ] Backend environment variables configured
- [ ] Backend health check returns 200
- [ ] Frontend environment variable updated with backend URL
- [ ] Frontend deployed to Vercel
- [ ] Custom domain configured (aio-llmo.fshp.jp)
- [ ] DNS records added to fshp.jp provider
- [ ] SSL certificate issued
- [ ] Full analysis test completed successfully
- [ ] No CORS errors in browser console
- [ ] Firebase configured (optional)

Congratulations! Your AIO/LLMO analyzer is now live at `https://aio-llmo.fshp.jp` 🎉
