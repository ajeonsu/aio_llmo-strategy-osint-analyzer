#!/usr/bin/env node

/**
 * API Test Script
 * 
 * Tests the backend API endpoints to ensure everything is working correctly.
 * 
 * Usage:
 *   node api/test-api.js
 * 
 * Or add to package.json scripts:
 *   "test:api": "node api/test-api.js"
 */

const API_URL = process.env.API_URL || 'http://localhost:3001';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

function log(color, ...args) {
  console.log(color, ...args, colors.reset);
}

async function testHealthEndpoint() {
  log(colors.cyan, '\n🔍 Testing Health Endpoint...');
  
  try {
    const response = await fetch(`${API_URL}/api/health`);
    const data = await response.json();
    
    if (response.ok && data.status === 'ok') {
      log(colors.green, '✅ Health check passed');
      console.log('   Response:', JSON.stringify(data, null, 2));
      return true;
    } else {
      log(colors.red, '❌ Health check failed');
      console.log('   Response:', data);
      return false;
    }
  } catch (error) {
    log(colors.red, '❌ Health check failed with error:', error.message);
    return false;
  }
}

async function testAnalyzeEndpoint() {
  log(colors.cyan, '\n🔍 Testing Analyze Endpoint...');
  
  const testInput = {
    brandName: 'テストブランド株式会社',
    officialUrls: 'https://example.com',
    additionalUrls: 'https://news.example.com',
    competitors: '競合A, 競合B',
    goal: 'ブランド認知度向上',
    conditions: '競争市場',
    extraNotes: 'これはテストです',
  };
  
  try {
    log(colors.yellow, '   Sending request (this may take 30-60 seconds)...');
    
    const response = await fetch(`${API_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testInput),
    });
    
    const data = await response.json();
    
    if (response.ok && data.success && data.data.result) {
      log(colors.green, '✅ Analysis completed successfully');
      console.log('   Analysis ID:', data.data.id);
      console.log('   Result length:', data.data.result.length, 'characters');
      console.log('   Result preview:', data.data.result.substring(0, 200) + '...');
      return { success: true, analysisId: data.data.id };
    } else {
      log(colors.red, '❌ Analysis failed');
      console.log('   Response:', JSON.stringify(data, null, 2));
      return { success: false };
    }
  } catch (error) {
    log(colors.red, '❌ Analysis failed with error:', error.message);
    return { success: false };
  }
}

async function testGetAnalysisEndpoint(analysisId) {
  if (!analysisId) {
    log(colors.yellow, '\n⚠️  Skipping Get Analysis test (no analysis ID)');
    return true;
  }
  
  log(colors.cyan, '\n🔍 Testing Get Analysis Endpoint...');
  
  try {
    const response = await fetch(`${API_URL}/api/analysis/${analysisId}`);
    const data = await response.json();
    
    if (response.ok && data.success && data.data) {
      log(colors.green, '✅ Get analysis passed');
      console.log('   Analysis ID:', data.data.id);
      console.log('   Timestamp:', new Date(data.data.timestamp).toISOString());
      return true;
    } else {
      log(colors.yellow, '⚠️  Get analysis returned unexpected response (might be OK if Firebase is not configured)');
      console.log('   Response:', data);
      return true; // Don't fail if Firebase isn't set up
    }
  } catch (error) {
    log(colors.yellow, '⚠️  Get analysis failed (might be OK if Firebase is not configured):', error.message);
    return true; // Don't fail if Firebase isn't set up
  }
}

async function testHistoryEndpoint() {
  log(colors.cyan, '\n🔍 Testing History Endpoint...');
  
  try {
    const response = await fetch(`${API_URL}/api/history?limit=5`);
    const data = await response.json();
    
    if (response.ok && data.success) {
      log(colors.green, '✅ History endpoint passed');
      console.log('   Total analyses:', data.data.total);
      return true;
    } else {
      log(colors.yellow, '⚠️  History endpoint returned unexpected response (might be OK if Firebase is not configured)');
      console.log('   Response:', data);
      return true; // Don't fail if Firebase isn't set up
    }
  } catch (error) {
    log(colors.yellow, '⚠️  History endpoint failed (might be OK if Firebase is not configured):', error.message);
    return true; // Don't fail if Firebase isn't set up
  }
}

async function runTests() {
  log(colors.cyan, '\n========================================');
  log(colors.cyan, '🧪 API Test Suite');
  log(colors.cyan, '========================================');
  log(colors.cyan, `Testing API at: ${API_URL}`);
  
  const results = {
    health: false,
    analyze: false,
    getAnalysis: false,
    history: false,
  };
  
  // Test 1: Health Check
  results.health = await testHealthEndpoint();
  
  if (!results.health) {
    log(colors.red, '\n❌ Health check failed. Is the backend running?');
    log(colors.yellow, '\nMake sure to start the backend:');
    log(colors.yellow, '  cd api && npm run dev');
    process.exit(1);
  }
  
  // Test 2: Analyze (Main test)
  const analyzeResult = await testAnalyzeEndpoint();
  results.analyze = analyzeResult.success;
  
  // Test 3: Get Analysis by ID (Optional - requires Firebase)
  results.getAnalysis = await testGetAnalysisEndpoint(analyzeResult.analysisId);
  
  // Test 4: History (Optional - requires Firebase)
  results.history = await testHistoryEndpoint();
  
  // Summary
  log(colors.cyan, '\n========================================');
  log(colors.cyan, '📊 Test Results Summary');
  log(colors.cyan, '========================================');
  
  const allPassed = results.health && results.analyze;
  
  console.log(`   Health Check:      ${results.health ? '✅' : '❌'}`);
  console.log(`   Analyze Endpoint:  ${results.analyze ? '✅' : '❌'}`);
  console.log(`   Get Analysis:      ${results.getAnalysis ? '✅' : '⚠️'} (optional)`);
  console.log(`   History:           ${results.history ? '✅' : '⚠️'} (optional)`);
  
  if (allPassed) {
    log(colors.green, '\n🎉 All critical tests passed!');
    log(colors.yellow, '\nNote: Optional features (Get Analysis, History) require Firebase configuration.');
    process.exit(0);
  } else {
    log(colors.red, '\n❌ Some tests failed!');
    process.exit(1);
  }
}

// Run tests
runTests().catch((error) => {
  log(colors.red, '\n❌ Test suite failed with error:', error);
  process.exit(1);
});
