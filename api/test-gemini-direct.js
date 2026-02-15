// Direct test of Gemini API with fetch (no SDK)
const API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyDJ_OGqjLHPfjmQnDogJi6jXCxXVo1vr6Y';

// Test 1: List available models
async function listModels() {
  console.log('\n🔍 Testing: List available models...\n');
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ Error:', data);
      return null;
    }
    
    console.log('✅ Available models:');
    if (data.models) {
      data.models.forEach(model => {
        console.log(`  - ${model.name}`);
      });
    }
    return data.models;
  } catch (error) {
    console.error('❌ Failed to list models:', error.message);
    return null;
  }
}

// Test 2: Try to generate content with a model
async function testGenerate(modelName) {
  console.log(`\n🧪 Testing generation with: ${modelName}\n`);
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/${modelName}:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: 'Say hello in Japanese' }]
          }]
        })
      }
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ Error:', data);
      return false;
    }
    
    console.log('✅ Success! Response:');
    console.log(JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('❌ Failed:', error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting Gemini API Tests...');
  console.log(`🔑 Using API Key: ${API_KEY.substring(0, 20)}...`);
  
  // Step 1: List models
  const models = await listModels();
  
  if (!models || models.length === 0) {
    console.log('\n❌ No models available! This means:');
    console.log('   1. The API key is invalid');
    console.log('   2. The Generative Language API is not enabled');
    console.log('   3. The project does not have access to Gemini models');
    console.log('\n💡 Go to: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com');
    console.log('   And make sure the API is enabled for project: 304594818596');
    return;
  }
  
  // Step 2: Try to use the first available model
  console.log(`\n🎯 Found ${models.length} models. Testing the first one...`);
  const firstModel = models[0].name;
  await testGenerate(firstModel);
}

runTests();
