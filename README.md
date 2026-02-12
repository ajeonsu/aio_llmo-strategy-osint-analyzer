# AIO/LLMO Strategy OSINT Analyzer

A complete full-stack application for analyzing AI search optimization (AIO/LLMO) strategies using Google's Gemini AI, with Firebase database integration.

## 🏗️ Architecture

This project consists of two parts:

1. **Frontend** (Vite + React + TypeScript) - Current directory
2. **Backend** (Next.js API) - Located in `./api/`

## 📁 Project Structure

```
aio_llmo-strategy-osint-analyzer/
├── api/                          # Backend (Next.js)
│   ├── app/
│   │   └── api/
│   │       ├── analyze/          # Main analysis endpoint
│   │       ├── analysis/[id]/    # Get analysis by ID
│   │       ├── history/          # List analyses
│   │       └── health/           # Health check
│   ├── lib/
│   │   ├── firebase-admin.ts     # Firebase setup
│   │   └── gemini.ts             # Gemini API integration
│   ├── types/
│   │   └── index.ts              # TypeScript types
│   ├── package.json
│   ├── next.config.js
│   └── README.md                 # Backend documentation
├── components/                    # Frontend React components
│   ├── AnalysisReport.tsx
│   ├── Header.tsx
│   └── InputForm.tsx
├── services/
│   └── geminiService.ts          # Frontend API service
├── App.tsx                        # Main React component
├── config.ts                      # Frontend configuration
├── types.ts                       # Frontend types
├── constants.tsx                  # System instructions
├── index.html
├── index.tsx
├── package.json
├── vite.config.ts
└── README.md                      # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))
- (Optional) Firebase project for database features

### 1. Setup Backend

```bash
cd api
npm install

# Create .env.local file
cp .env.local.example .env.local

# Edit .env.local and add your Gemini API key
# GEMINI_API_KEY=your_key_here

# Start backend server
npm run dev
```

The backend will run on `http://localhost:3001`

### 2. Setup Frontend

```bash
# Return to project root
cd ..

# Install dependencies
npm install

# Create .env.local file (optional - uses localhost:3001 by default)
echo "VITE_API_URL=http://localhost:3001" > .env.local

# Start frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

### 3. Test the Application

1. Open `http://localhost:5173` in your browser
2. Fill in the analysis form with brand information
3. Submit and wait for the Gemini AI analysis

## 🌐 Deployment

### Deploy Backend to Vercel

1. Navigate to the `api` directory
2. Install Vercel CLI: `npm install -g vercel`
3. Login: `vercel login`
4. Deploy: `vercel`
5. Add environment variables in Vercel dashboard:
   - `GEMINI_API_KEY`
   - (Optional) Firebase credentials for database

See `api/README.md` for detailed backend deployment instructions.

### Deploy Frontend

You can deploy the frontend to any static hosting service (Vercel, Netlify, etc.):

1. Update `.env.local` with your deployed backend URL:
   ```
   VITE_API_URL=https://your-backend.vercel.app
   ```

2. Build the frontend:
   ```bash
   npm run build
   ```

3. Deploy the `dist` folder to your hosting service

#### Deploy Frontend to Vercel

```bash
vercel --prod
```

#### Deploy Frontend to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

## 🔧 Configuration

### Frontend Configuration

Edit `config.ts` to change the backend API URL:

```typescript
export const ENV = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
};
```

### Backend Configuration

See `api/README.md` for backend configuration options.

## 📡 API Endpoints

### POST `/api/analyze`
Analyze a brand using Gemini AI

**Request:**
```json
{
  "brandName": "Example Corp",
  "officialUrls": "https://example.com",
  "additionalUrls": "https://news.example.com",
  "competitors": "Competitor A, Competitor B",
  "goal": "ブランド認知度向上",
  "conditions": "競争市場",
  "extraNotes": "追加要件"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "analysis_123",
    "result": "詳細な分析レポート..."
  }
}
```

### GET `/api/history?limit=10&offset=0`
Get analysis history (requires Firebase)

### GET `/api/analysis/[id]`
Get specific analysis by ID (requires Firebase)

### GET `/api/health`
Health check endpoint

## 🗄️ Firebase Setup (Optional)

Firebase is optional. The app works without it, but you won't have history features.

### Setup Steps:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Firestore Database
4. Go to Project Settings > Service Accounts
5. Click "Generate New Private Key"
6. Download the JSON file and save as `api/serviceAccountKey.json`

**OR** use environment variables (recommended for production):

```env
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk@...
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Vite + React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS (inline)

### Backend
- **Framework**: Next.js 15 (App Router)
- **Runtime**: Node.js
- **AI**: Google Gemini API
- **Database**: Firebase Firestore
- **Deployment**: Vercel

## 📝 Environment Variables

### Frontend (`.env.local`)
```env
VITE_API_URL=http://localhost:3001
```

### Backend (`api/.env.local`)
```env
GEMINI_API_KEY=your_gemini_api_key
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk@...
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

## 🔒 Security Notes

- **Never commit `.env.local` or `serviceAccountKey.json`** to version control
- The Gemini API key is kept secure on the backend
- CORS is configured in the backend for production
- Firebase Admin SDK credentials should be stored as Vercel environment variables

## 🐛 Troubleshooting

### Backend not connecting
- Ensure backend is running on port 3001
- Check `VITE_API_URL` in frontend `.env.local`
- Verify CORS settings in `api/next.config.js`

### Gemini API errors
- Verify `GEMINI_API_KEY` is set correctly in backend
- Check you have API quota remaining
- Ensure you're using a valid model name

### Firebase errors
- Firebase is optional - the app works without it
- Check service account credentials
- Ensure Firestore is enabled in Firebase Console

## 📄 License

MIT

## 👨‍💻 Development

### Run tests
```bash
# Frontend
npm test

# Backend
cd api && npm test
```

### Build for production
```bash
# Frontend
npm run build

# Backend
cd api && npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

**Domain**: aio-llmo.fshp.jp  
**Backend**: Vercel  
**Database**: Firebase Firestore  
**AI Provider**: Google Gemini
