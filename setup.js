#!/usr/bin/env node

/**
 * Setup Script for AIO/LLMO Backend
 * 
 * This script helps you set up the project quickly by:
 * 1. Checking prerequisites
 * 2. Creating .env.local files
 * 3. Installing dependencies
 * 
 * Usage:
 *   node setup.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(color, ...args) {
  console.log(color, ...args, colors.reset);
}

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function checkNodeVersion() {
  const version = process.version;
  const major = parseInt(version.slice(1).split('.')[0]);
  
  if (major < 18) {
    log(colors.red, '❌ Node.js 18 or higher is required');
    log(colors.yellow, `   Current version: ${version}`);
    log(colors.yellow, '   Please upgrade Node.js: https://nodejs.org/');
    return false;
  }
  
  log(colors.green, `✅ Node.js ${version}`);
  return true;
}

async function setupBackendEnv() {
  log(colors.cyan, '\n📝 Setting up backend environment...');
  
  const envPath = path.join(__dirname, 'api', '.env.local');
  
  if (fs.existsSync(envPath)) {
    log(colors.yellow, '⚠️  api/.env.local already exists');
    const overwrite = await question('   Overwrite? (y/N): ');
    if (overwrite.toLowerCase() !== 'y') {
      log(colors.yellow, '   Skipping backend .env.local');
      return;
    }
  }
  
  log(colors.cyan, '\n🔑 Gemini API Key Setup');
  log(colors.yellow, '   Get your API key from: https://aistudio.google.com/app/apikey');
  
  const apiKey = await question('   Enter your Gemini API key: ');
  
  if (!apiKey) {
    log(colors.red, '❌ API key is required');
    return false;
  }
  
  log(colors.cyan, '\n💾 Firebase Setup (Optional - press Enter to skip)');
  log(colors.yellow, '   Firebase enables history features. You can set this up later.');
  
  const useFirebase = await question('   Set up Firebase now? (y/N): ');
  
  let envContent = `# Gemini API Key
GEMINI_API_KEY=${apiKey}

# Firebase Configuration (Optional)
# Uncomment and fill these if you want to use Firebase
`;
  
  if (useFirebase.toLowerCase() === 'y') {
    const projectId = await question('   Firebase Project ID: ');
    const clientEmail = await question('   Firebase Client Email: ');
    const hasKeyFile = await question('   Do you have a serviceAccountKey.json file? (Y/n): ');
    
    if (hasKeyFile.toLowerCase() !== 'n') {
      envContent += `FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
`;
      log(colors.yellow, '\n   ⚠️  Don\'t forget to place serviceAccountKey.json in the api/ directory!');
    } else {
      log(colors.yellow, '\n   You\'ll need to manually add FIREBASE_ADMIN_PRIVATE_KEY to .env.local');
      envContent += `FIREBASE_ADMIN_PROJECT_ID=${projectId}
FIREBASE_ADMIN_CLIENT_EMAIL=${clientEmail}
# FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"
`;
    }
  } else {
    envContent += `# FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
# Or use individual variables:
# FIREBASE_ADMIN_PROJECT_ID=your-project-id
# FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
# FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"
`;
  }
  
  fs.writeFileSync(envPath, envContent);
  log(colors.green, '✅ Backend .env.local created');
  
  return true;
}

async function setupFrontendEnv() {
  log(colors.cyan, '\n📝 Setting up frontend environment...');
  
  const envPath = path.join(__dirname, '.env.local');
  
  if (fs.existsSync(envPath)) {
    log(colors.yellow, '⚠️  .env.local already exists');
    const overwrite = await question('   Overwrite? (y/N): ');
    if (overwrite.toLowerCase() !== 'y') {
      log(colors.yellow, '   Skipping frontend .env.local');
      return;
    }
  }
  
  log(colors.cyan, '\n🌐 Backend API URL');
  log(colors.yellow, '   For local development, use: http://localhost:3001');
  log(colors.yellow, '   For production, use your deployed backend URL');
  
  const apiUrl = await question('   Backend API URL (press Enter for localhost:3001): ');
  
  const envContent = `# Backend API URL
VITE_API_URL=${apiUrl || 'http://localhost:3001'}
`;
  
  fs.writeFileSync(envPath, envContent);
  log(colors.green, '✅ Frontend .env.local created');
}

async function main() {
  log(colors.bold + colors.cyan, '\n========================================');
  log(colors.bold + colors.cyan, '🚀 AIO/LLMO Setup Script');
  log(colors.bold + colors.cyan, '========================================\n');
  
  // Check Node.js version
  log(colors.cyan, '🔍 Checking prerequisites...');
  const nodeOk = await checkNodeVersion();
  
  if (!nodeOk) {
    rl.close();
    process.exit(1);
  }
  
  // Setup backend environment
  const backendOk = await setupBackendEnv();
  
  if (!backendOk) {
    log(colors.red, '\n❌ Setup failed. Please try again.');
    rl.close();
    process.exit(1);
  }
  
  // Setup frontend environment
  await setupFrontendEnv();
  
  // Next steps
  log(colors.bold + colors.green, '\n✅ Setup complete!');
  log(colors.cyan, '\n📚 Next Steps:');
  log(colors.yellow, '\n1. Install backend dependencies:');
  log(colors.reset, '   cd api && npm install');
  log(colors.yellow, '\n2. Install frontend dependencies:');
  log(colors.reset, '   npm install');
  log(colors.yellow, '\n3. Start the backend:');
  log(colors.reset, '   cd api && npm run dev');
  log(colors.yellow, '\n4. In a new terminal, start the frontend:');
  log(colors.reset, '   npm run dev');
  log(colors.yellow, '\n5. Open your browser:');
  log(colors.reset, '   http://localhost:5173');
  
  log(colors.cyan, '\n📖 For more information, see:');
  log(colors.reset, '   - QUICKSTART.md for quick start guide');
  log(colors.reset, '   - README.md for complete documentation');
  log(colors.reset, '   - DEPLOYMENT.md for deployment guide');
  
  log(colors.green, '\n🎉 Happy coding!\n');
  
  rl.close();
}

main().catch((error) => {
  log(colors.red, '\n❌ Setup failed:', error);
  rl.close();
  process.exit(1);
});
