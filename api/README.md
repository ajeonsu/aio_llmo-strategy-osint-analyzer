# AIO/LLMO Backend API

Backend API for the AIO/LLMO Strategy OSINT Analyzer. This Next.js backend handles Gemini API integration and Firebase database operations.

## Features

- **Gemini API Integration**: Securely processes analysis requests using Google's Gemini AI
- **Firebase Database**: Stores analysis history and results
- **REST API**: Clean API endpoints for frontend integration
- **CORS Support**: Configured for cross-origin requests
- **Vercel Ready**: Optimized for Vercel deployment

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Gemini API Key (required)
GEMINI_API_KEY=your_gemini_api_key_here

# Firebase Admin SDK (optional - for database features)
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 3. Get Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your `.env.local` file

### 4. Setup Firebase (Optional)

If you want to store analysis history:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Go to Project Settings > Service Accounts
4. Click "Generate New Private Key"
5. Download the JSON file
6. Extract the values to your `.env.local` file

### 5. Run Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## API Endpoints

### POST `/api/analyze`

Analyze a brand using Gemini AI.

**Request Body:**
```json
{
  "brandName": "Example Brand",
  "officialUrls": "https://example.com",
  "additionalUrls": "https://news.example.com",
  "competitors": "Competitor A, Competitor B",
  "goal": "増加認知度",
  "conditions": "競争が激しい市場",
  "extraNotes": "特別な要件"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "analysis_123456789_abc",
    "result": "詳細な分析レポート..."
  }
}
```

### GET `/api/analysis/[id]`

Get a specific analysis by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "analysis_123456789_abc",
    "input": { ... },
    "result": "...",
    "timestamp": 1234567890
  }
}
```

### GET `/api/history`

List recent analyses (requires Firebase).

**Query Parameters:**
- `limit` (default: 10): Number of results
- `offset` (default: 0): Offset for pagination

**Response:**
```json
{
  "success": true,
  "data": {
    "analyses": [...],
    "total": 10
  }
}
```

### GET `/api/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-12T00:00:00.000Z",
  "message": "AIO/LLMO Backend API is running"
}
```

## Deploy to Vercel

### Option 1: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

### Option 2: Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." > "Project"
3. Import your Git repository
4. Set the root directory to `api`
5. Add environment variables:
   - `GEMINI_API_KEY`
   - `FIREBASE_ADMIN_PROJECT_ID`
   - `FIREBASE_ADMIN_CLIENT_EMAIL`
   - `FIREBASE_ADMIN_PRIVATE_KEY`
6. Deploy

### Environment Variables on Vercel

Add these in Project Settings > Environment Variables:

- `GEMINI_API_KEY`: Your Gemini API key
- `FIREBASE_ADMIN_PROJECT_ID`: Firebase project ID
- `FIREBASE_ADMIN_CLIENT_EMAIL`: Firebase service account email
- `FIREBASE_ADMIN_PRIVATE_KEY`: Firebase private key (keep the `\n` characters)

## Project Structure

```
api/
├── app/
│   └── api/
│       ├── analyze/
│       │   └── route.ts          # Main analysis endpoint
│       ├── analysis/
│       │   └── [id]/
│       │       └── route.ts      # Get analysis by ID
│       ├── history/
│       │   └── route.ts          # List analyses
│       └── health/
│           └── route.ts          # Health check
├── lib/
│   ├── firebase-admin.ts         # Firebase Admin SDK setup
│   └── gemini.ts                 # Gemini API integration
├── types/
│   └── index.ts                  # TypeScript types
├── next.config.js                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies
└── vercel.json                   # Vercel configuration
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Runtime**: Node.js
- **AI**: Google Gemini API
- **Database**: Firebase Firestore
- **Deployment**: Vercel
- **Language**: TypeScript

## Notes

- Firebase is optional - the API will work without it, but history features won't be available
- The `/api/analyze` endpoint has a 60-second timeout (Vercel Pro)
- CORS is enabled for all origins in development
- All API responses follow the `ApiResponse<T>` format

## License

MIT
