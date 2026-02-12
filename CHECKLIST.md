# ✅ Backend Setup Checklist

Use this checklist to ensure your backend is properly configured and deployed.

## 📋 Pre-Deployment Checklist

### 1. Prerequisites
- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm or yarn installed (`npm --version`)
- [ ] Gemini API key obtained from [Google AI Studio](https://aistudio.google.com/app/apikey)
- [ ] (Optional) Firebase project created for database features

### 2. Local Development Setup

#### Backend Setup
- [ ] Navigate to `api/` directory: `cd api`
- [ ] Install dependencies: `npm install`
- [ ] Create `.env.local` file
- [ ] Add `GEMINI_API_KEY` to `.env.local`
- [ ] (Optional) Add Firebase credentials to `.env.local`
- [ ] Start backend: `npm run dev`
- [ ] Backend running on `http://localhost:3001`
- [ ] Health check works: `curl http://localhost:3001/api/health`
- [ ] Run test script: `npm run test:api`

#### Frontend Setup
- [ ] Navigate to project root: `cd ..`
- [ ] Install dependencies: `npm install`
- [ ] (Optional) Create `.env.local` with `VITE_API_URL=http://localhost:3001`
- [ ] Start frontend: `npm run dev`
- [ ] Frontend running on `http://localhost:5173`
- [ ] Can access frontend in browser
- [ ] Submit test analysis successfully

### 3. Testing

#### Manual Testing
- [ ] Health endpoint works: `/api/health`
- [ ] Analysis endpoint accepts requests: `/api/analyze`
- [ ] Analysis completes and returns result
- [ ] No CORS errors in browser console
- [ ] Error messages display correctly
- [ ] (Optional) History endpoint works if Firebase configured

#### Automated Testing
- [ ] Run API test suite: `cd api && npm run test:api`
- [ ] All critical tests pass

### 4. Code Quality
- [ ] No TypeScript errors: `cd api && npx tsc --noEmit`
- [ ] No linter errors: `cd api && npm run lint`
- [ ] Frontend builds successfully: `npm run build`
- [ ] Backend builds successfully: `cd api && npm run build`

## 🚀 Deployment Checklist

### 1. Backend Deployment (Vercel)

#### Setup
- [ ] Vercel account created
- [ ] Vercel CLI installed: `npm install -g vercel`
- [ ] Logged into Vercel: `vercel login`

#### Deploy Backend
- [ ] Navigate to `api/` directory
- [ ] Run deployment: `vercel`
- [ ] Set project name (e.g., `aio-llmo-backend`)
- [ ] Note deployment URL (e.g., `https://xxx.vercel.app`)

#### Configure Environment Variables
- [ ] Go to Vercel Dashboard → Project → Settings → Environment Variables
- [ ] Add `GEMINI_API_KEY`
- [ ] (Optional) Add `FIREBASE_ADMIN_PROJECT_ID`
- [ ] (Optional) Add `FIREBASE_ADMIN_CLIENT_EMAIL`
- [ ] (Optional) Add `FIREBASE_ADMIN_PRIVATE_KEY` (with `\n` characters)
- [ ] Redeploy after adding variables: `vercel --prod`

#### Verify Backend
- [ ] Health check works: `curl https://your-backend.vercel.app/api/health`
- [ ] Analysis endpoint accessible
- [ ] No 500 errors in Vercel logs
- [ ] CORS headers present in response

### 2. Frontend Deployment (Vercel)

#### Setup
- [ ] Update `.env.production` or Vercel env vars with backend URL
- [ ] `VITE_API_URL=https://your-backend.vercel.app`

#### Deploy Frontend
- [ ] Navigate to project root
- [ ] Run deployment: `vercel --prod`
- [ ] Set project name (e.g., `aio-llmo-frontend`)
- [ ] Note deployment URL

#### Configure Custom Domain
- [ ] Go to Vercel Dashboard → Project → Settings → Domains
- [ ] Add domain: `aio-llmo.fshp.jp`
- [ ] Note the DNS records provided by Vercel

### 3. DNS Configuration

#### At Your DNS Provider (fshp.jp)
- [ ] Log into DNS provider dashboard
- [ ] Add CNAME record:
  - Type: `CNAME`
  - Name: `aio-llmo`
  - Value: `cname.vercel-dns.com` (or as provided by Vercel)
  - TTL: `3600` or default
- [ ] Save DNS changes
- [ ] Wait for propagation (5 minutes to 48 hours)

#### Verify DNS
- [ ] Check DNS: `nslookup aio-llmo.fshp.jp`
- [ ] Check propagation: https://dnschecker.org/
- [ ] Vercel detects domain
- [ ] SSL certificate issued (automatic)

### 4. Post-Deployment Verification

#### Smoke Tests
- [ ] Visit `https://aio-llmo.fshp.jp`
- [ ] Site loads without errors
- [ ] No mixed content warnings (HTTP/HTTPS)
- [ ] SSL certificate valid (green lock)
- [ ] Submit test analysis
- [ ] Analysis completes successfully
- [ ] Result displays correctly
- [ ] No errors in browser console

#### Full Integration Test
- [ ] Test with real brand data
- [ ] Verify Gemini response quality
- [ ] Check response time (should be < 60 seconds)
- [ ] Test error handling (invalid input)
- [ ] Test different input combinations
- [ ] (Optional) Verify Firebase storage if configured

#### Performance
- [ ] Page loads in < 3 seconds
- [ ] Time to First Byte (TTFB) < 600ms
- [ ] No console errors or warnings
- [ ] Mobile responsive design works

### 5. Monitoring & Maintenance

#### Setup Monitoring
- [ ] Enable Vercel Analytics for frontend
- [ ] Enable Vercel Analytics for backend
- [ ] Set up Vercel log streaming (optional)
- [ ] Configure alerts for errors (optional)

#### Documentation
- [ ] Document deployed URLs
- [ ] Document environment variables
- [ ] Document DNS settings
- [ ] Note any custom configurations

#### Ongoing
- [ ] Monitor Gemini API usage/quota
- [ ] Check Vercel function logs regularly
- [ ] Monitor Firebase usage if configured
- [ ] Keep dependencies updated
- [ ] Review and rotate API keys periodically

## 🔒 Security Checklist

- [ ] No API keys in frontend code
- [ ] No API keys committed to Git
- [ ] `.env.local` in `.gitignore`
- [ ] `serviceAccountKey.json` in `.gitignore`
- [ ] CORS restricted to your domain (optional - can keep `*` for public API)
- [ ] HTTPS enforced (automatic with Vercel)
- [ ] Environment variables stored securely in Vercel
- [ ] Firebase security rules configured (if using Firebase)

## 📊 Success Criteria

### Minimum Viable Deployment
- [x] Backend deployed and accessible
- [x] Frontend deployed at custom domain
- [x] Gemini API integration working
- [x] No critical errors
- [x] Basic functionality works

### Full Featured Deployment
- [ ] All above ✓
- [ ] Firebase history enabled
- [ ] Custom domain with SSL
- [ ] Monitoring enabled
- [ ] Error tracking configured
- [ ] Performance optimized

## 🆘 Troubleshooting Reference

If any checklist item fails, refer to:

- **Setup issues**: See `QUICKSTART.md`
- **Deployment issues**: See `DEPLOYMENT.md`
- **API issues**: See `api/README.md`
- **General help**: See `README.md`

## 📝 Notes Section

Use this space to track your specific configuration:

```
Backend URL: _________________________________

Frontend URL: _________________________________

Vercel Project (Backend): _____________________

Vercel Project (Frontend): ____________________

Firebase Project ID: __________________________

Domain Registrar: _____________________________

DNS Provider: _________________________________

Last Updated: _________________________________

Additional Notes:
_________________________________________________
_________________________________________________
_________________________________________________
```

---

**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed | [ ] Live in Production

**Date Completed**: _______________

**Deployed By**: _______________
