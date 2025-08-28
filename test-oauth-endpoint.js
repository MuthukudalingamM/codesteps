// Simple test to verify OAuth endpoint is working
const testOAuthEndpoint = async () => {
  try {
    console.log('🧪 Testing OAuth endpoint...');
    
    const response = await fetch('http://localhost:5000/api/auth/oauth-status');
    console.log('📡 Response status:', response.status);
    console.log('📄 Content-Type:', response.headers.get('content-type'));
    
    if (!response.ok) {
      console.error('❌ HTTP Error:', response.status, response.statusText);
      return;
    }
    
    const data = await response.json();
    console.log('✅ Response data:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('❌ Fetch error:', error.message);
  }
};

// Test the auth test endpoint too
const testAuthEndpoint = async () => {
  try {
    console.log('🧪 Testing Auth test endpoint...');
    
    const response = await fetch('http://localhost:5000/api/auth/test');
    console.log('📡 Response status:', response.status);
    console.log('📄 Content-Type:', response.headers.get('content-type'));
    
    if (!response.ok) {
      console.error('❌ HTTP Error:', response.status, response.statusText);
      return;
    }
    
    const data = await response.json();
    console.log('✅ Response data:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('❌ Fetch error:', error.message);
  }
};

// Run tests
testAuthEndpoint();
testOAuthEndpoint();
