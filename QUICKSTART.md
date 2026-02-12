# Quick Start Guide

Get your AIO/LLMO analyzer running in 5 minutes!

## 🚀 Fastest Setup (Local Development)

### 1. Get Gemini API Key (1 minute)

1. Go to https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy your key

### 2. Setup Backend (2 minutes)

```bash
# Navigate to backend
cd api

# Install dependencies
npm install

# Create environment file
echo "GEMINI_API_KEY=your_key_here" > .env.local

# Start backend
npm run dev
```

✅ Backend running on `http://localhost:3001`

### 3. Setup Frontend (1 minute)

Open a new terminal:

```bash
# Navigate to project root (if not already there)
cd ..

# Install dependencies
npm install

# Start frontend
npm run dev
```

✅ Frontend running on `http://localhost:5173`

### 4. Test It! (1 minute)

1. Open http://localhost:5173 in your browser
2. Fill in the form with any brand name
3. Click submit
4. Watch the AI analysis appear!

## 📦 What You Just Created

```
Browser (localhost:5173)
    ↓ HTTP POST
Backend API (localhost:3001)
    ↓ API Call
Google Gemini AI
    ↓ Response
Backend
    ↓ JSON Response
Frontend displays result
```

## 🎯 Next Steps

### Add Firebase Database (Optional)

This enables history features:

1. Go to https://console.firebase.google.com/
2. Create a project
3. Enable Firestore
4. Download service account key
5. Save as `api/serviceAccountKey.json`
6. Add to `api/.env.local`:
   ```
   FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
   ```
7. Restart backend

### Deploy to Production

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full deployment guide.

**Quick deploy with Vercel:**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy backend
cd api
vercel

# Deploy frontend
cd ..
vercel
```

## 🐛 Troubleshooting

### "Failed to connect to backend"
- Ensure backend is running on port 3001
- Check no other process is using port 3001

### "Gemini API error"
- Verify your API key is correct
- Check you have API quota
- Try creating a new API key

### Port already in use
```bash
# Kill process on port 3001
# Windows:
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3001 | xargs kill -9
```

## 📝 Environment Files

### Backend (`api/.env.local`)
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Frontend (`.env.local`) - optional
```env
VITE_API_URL=http://localhost:3001
```

## 🔧 Useful Commands

```bash
# Backend
cd api
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## ✅ Verification Checklist

- [ ] Node.js 18+ installed (`node --version`)
- [ ] Backend dependencies installed (`api/node_modules` exists)
- [ ] Frontend dependencies installed (`node_modules` exists)
- [ ] Gemini API key in `api/.env.local`
- [ ] Backend running on port 3001
- [ ] Frontend running on port 5173
- [ ] Can access frontend in browser
- [ ] Analysis completes successfully

## 💡 Tips

1. **Keep both terminals open** - one for backend, one for frontend
2. **Check backend logs** if frontend shows errors
3. **Firebase is optional** - app works without it
4. **Hot reload enabled** - changes appear automatically
5. **DevTools is your friend** - use Network tab to debug API calls

## 📚 Learn More

- [Full README](./README.md) - Complete documentation
- [Backend README](./api/README.md) - API documentation
- [Deployment Guide](./DEPLOYMENT.md) - Production deployment
- [Gemini API Docs](https://ai.google.dev/docs) - AI integration details

---

**Questions?** Check the troubleshooting section above or open an issue on GitHub.

Happy analyzing! 🎉
