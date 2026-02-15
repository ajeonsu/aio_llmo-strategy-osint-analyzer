# 🔧 Vercel Environment Variables Setup

## Frontend Environment Variables
Go to: https://vercel.com/adrian-james-magisas-projects/aio_llmo-strategy-osint-analyzer/settings/environment-variables

Add these variables for **Production**:

```
VITE_FIREBASE_API_KEY=AIzaSyDZhpCypvu-Jqpne8Fr_kfmRz36r9Ik_Ys
VITE_FIREBASE_AUTH_DOMAIN=aio-llmo-analyzer.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=aio-llmo-analyzer
VITE_FIREBASE_STORAGE_BUCKET=aio-llmo-analyzer.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=672681578580
VITE_FIREBASE_APP_ID=1:672681578580:web:6161a53e37e0f529489dc1
VITE_API_URL=https://aio-llmo-strategy-osint-analyzer.vercel.app
```

---

## Backend Environment Variables (Already Set)
Go to: https://vercel.com/adrian-james-magisas-projects/aio-llmo-strategy-osint-analyzer/settings/environment-variables

Backend should already have:
```
GEMINI_API_KEY
FIREBASE_ADMIN_PROJECT_ID
FIREBASE_ADMIN_CLIENT_EMAIL
FIREBASE_ADMIN_PRIVATE_KEY
```

---

## After Adding Variables:
1. Go to: https://vercel.com/adrian-james-magisas-projects/aio_llmo-strategy-osint-analyzer
2. Click **"Redeploy"** to apply the new environment variables

---

## Firebase Authorized Domains
Add your production domain to Firebase:
1. Go to: https://console.firebase.google.com/project/aio-llmo-analyzer/authentication/settings
2. Scroll to **"Authorized domains"**
3. Click **"Add domain"**
4. Add: `aiollmo-strategy-osint-analyzer.vercel.app`
5. Add: `aiollmo-strategy-osint-analyzer-f5ld81v3h.vercel.app` (deployment URL)

---

## Test URLs
- **Frontend**: https://aiollmo-strategy-osint-analyzer.vercel.app
- **Backend API**: https://aio-llmo-strategy-osint-analyzer.vercel.app/api/health
