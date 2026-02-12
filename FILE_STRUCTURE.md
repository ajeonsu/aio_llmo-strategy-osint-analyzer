# 📚 Complete File Structure & Documentation Index

## 📂 Project Structure

```
aio_llmo-strategy-osint-analyzer/
│
├── 📖 Documentation Files
│   ├── README.md                        # Main project documentation
│   ├── QUICKSTART.md                    # 5-minute quick start guide  
│   ├── DEPLOYMENT.md                    # Production deployment guide
│   ├── IMPLEMENTATION_SUMMARY.md        # What was built and why
│   ├── CHECKLIST.md                     # Setup & deployment checklist
│   └── THIS FILE                        # File structure reference
│
├── 🔧 Setup & Configuration
│   ├── setup.js                         # Interactive setup script
│   ├── .env.local                       # Frontend environment (create this)
│   ├── .gitignore                       # Git ignore rules
│   ├── package.json                     # Frontend dependencies
│   ├── tsconfig.json                    # TypeScript config
│   ├── vite.config.ts                   # Vite config
│   └── config.ts                        # Frontend configuration
│
├── 🎨 Frontend Source
│   ├── index.html                       # HTML entry point
│   ├── index.tsx                        # React entry point
│   ├── App.tsx                          # Main React component
│   ├── constants.tsx                    # System instructions
│   ├── types.ts                         # TypeScript types
│   │
│   ├── components/                      # React components
│   │   ├── Header.tsx
│   │   ├── InputForm.tsx
│   │   └── AnalysisReport.tsx
│   │
│   └── services/                        # API services
│       └── geminiService.ts             # Backend API client
│
└── 🚀 Backend (Next.js API)
    └── api/
        ├── 📖 Documentation
        │   └── README.md                # Backend API documentation
        │
        ├── 🔧 Configuration
        │   ├── .env.local               # Backend environment (create this)
        │   ├── package.json             # Backend dependencies
        │   ├── tsconfig.json            # TypeScript config
        │   ├── next.config.js           # Next.js config
        │   ├── vercel.json              # Vercel deployment config
        │   └── .gitignore               # Git ignore rules
        │
        ├── 🧪 Testing
        │   └── test-api.js              # API test suite
        │
        ├── 📦 Source Code
        │   ├── app/api/                 # API Routes
        │   │   ├── analyze/
        │   │   │   └── route.ts         # POST /api/analyze
        │   │   ├── analysis/[id]/
        │   │   │   └── route.ts         # GET /api/analysis/:id
        │   │   ├── history/
        │   │   │   └── route.ts         # GET /api/history
        │   │   └── health/
        │   │       └── route.ts         # GET /api/health
        │   │
        │   ├── lib/                     # Shared libraries
        │   │   ├── firebase-admin.ts    # Firebase Admin SDK
        │   │   └── gemini.ts            # Gemini API integration
        │   │
        │   └── types/                   # TypeScript types
        │       └── index.ts
        │
        └── 🔐 Secrets (DO NOT COMMIT)
            ├── .env.local               # Environment variables
            └── serviceAccountKey.json   # Firebase credentials (optional)
```

## 📖 Documentation Guide

### For Getting Started
1. **Start Here**: [QUICKSTART.md](./QUICKSTART.md)
   - 5-minute setup guide
   - Fastest way to get running locally
   
2. **Then Read**: [README.md](./README.md)
   - Complete project overview
   - Architecture explanation
   - Feature list

### For Development
3. **Frontend**: [config.ts](./config.ts) + [services/geminiService.ts](./services/geminiService.ts)
   - How frontend connects to backend
   - API client implementation

4. **Backend**: [api/README.md](./api/README.md)
   - API endpoint documentation
   - Request/response formats
   - Integration guides

### For Deployment
5. **Deployment Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)
   - Step-by-step deployment to Vercel
   - DNS configuration for aio-llmo.fshp.jp
   - Environment variable setup

6. **Checklist**: [CHECKLIST.md](./CHECKLIST.md)
   - Pre-deployment checklist
   - Post-deployment verification
   - Security checklist

### For Understanding
7. **Implementation Summary**: [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
   - What was built
   - Why it was built this way
   - Architecture decisions

## 🔑 Key Files Explained

### Configuration Files

#### `.env.local` (Frontend - create manually)
```env
VITE_API_URL=http://localhost:3001
```
- Optional for local dev (defaults to localhost:3001)
- Required for production with deployed backend URL

#### `api/.env.local` (Backend - create manually)
```env
GEMINI_API_KEY=your_key_here
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json  # Optional
```
- **Required** - contains Gemini API key
- Optional Firebase credentials for database features

#### `config.ts` (Frontend)
- Centralized configuration
- Reads environment variables
- Sets API URL

#### `api/next.config.js` (Backend)
- Next.js configuration
- CORS headers
- API routes setup

#### `api/vercel.json` (Backend)
- Vercel deployment configuration
- Environment variable references
- Build settings

### Source Files

#### Frontend Core
- **`App.tsx`** - Main React component, handles state and UI flow
- **`services/geminiService.ts`** - API client for backend communication
- **`components/InputForm.tsx`** - Form for analysis input
- **`components/AnalysisReport.tsx`** - Displays analysis results
- **`constants.tsx`** - System instructions for Gemini AI

#### Backend Core
- **`api/lib/gemini.ts`** - Gemini API integration
- **`api/lib/firebase-admin.ts`** - Firebase Admin SDK setup
- **`api/app/api/analyze/route.ts`** - Main analysis endpoint
- **`api/app/api/health/route.ts`** - Health check endpoint

### Utility Files

#### `setup.js`
- Interactive setup script
- Helps create .env.local files
- Guides through configuration

#### `api/test-api.js`
- Automated API testing
- Verifies endpoints work correctly
- Run with: `cd api && npm run test:api`

## 🚀 Common Tasks

### Local Development
```bash
# First time setup
node setup.js              # Interactive setup

# Or manual setup
cd api
npm install
echo "GEMINI_API_KEY=xxx" > .env.local
npm run dev               # Terminal 1: Backend

cd ..
npm install
npm run dev               # Terminal 2: Frontend
```

### Testing
```bash
# Test backend API
cd api && npm run test:api

# Test manually
curl http://localhost:3001/api/health
```

### Building
```bash
# Build frontend
npm run build

# Build backend
cd api && npm run build
```

### Deployment
```bash
# Deploy backend
cd api && vercel

# Deploy frontend  
vercel

# Configure domain in Vercel dashboard
```

## 📋 Files You Need to Create

Before running the project, create these files:

1. **`api/.env.local`** (Required)
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

2. **`.env.local`** (Optional - for custom backend URL)
   ```env
   VITE_API_URL=http://localhost:3001
   ```

3. **`api/serviceAccountKey.json`** (Optional - for Firebase)
   - Download from Firebase Console
   - Place in `api/` directory

## 🚫 Files to NEVER Commit

These are in `.gitignore` but be extra careful:

- `api/.env.local` - Contains API keys
- `.env.local` - May contain sensitive URLs
- `api/serviceAccountKey.json` - Firebase credentials
- `node_modules/` - Dependencies
- `dist/` - Build output
- `.next/` - Next.js cache

## 🔍 Finding Things

### "Where is the API key used?"
→ `api/lib/gemini.ts` (reads from environment)

### "Where are API endpoints defined?"
→ `api/app/api/*/route.ts` files

### "How does frontend call backend?"
→ `services/geminiService.ts`

### "Where are types defined?"
→ `types.ts` (frontend) and `api/types/index.ts` (backend)

### "Where is CORS configured?"
→ `api/next.config.js`

### "Where are Gemini prompts?"
→ `constants.tsx` (system instructions) and `api/lib/gemini.ts` (prompt template)

### "Where is Firebase setup?"
→ `api/lib/firebase-admin.ts`

## 📞 Getting Help

1. **Setup issues**: See `QUICKSTART.md`
2. **API errors**: See `api/README.md`
3. **Deployment issues**: See `DEPLOYMENT.md`
4. **General questions**: See `README.md`
5. **Step-by-step**: See `CHECKLIST.md`

## 🎯 Quick Links

- [Get Gemini API Key](https://aistudio.google.com/app/apikey)
- [Firebase Console](https://console.firebase.google.com/)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Next.js Docs](https://nextjs.org/docs)
- [Gemini API Docs](https://ai.google.dev/docs)

---

**Need to find something quickly?** Use your editor's file search:
- VS Code: `Ctrl+P` (Windows) or `Cmd+P` (Mac)
- Search by filename or content

**Pro Tip**: All documentation files are in Markdown format and can be read directly in GitHub or any Markdown viewer.
