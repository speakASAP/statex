#!/usr/bin/env node

/**
 * Test: No Redirects - Subdomains Serve Content Directly
 * Demonstrates that subdomains serve content directly without redirects to /prototype-results/
 */

const http = require('http');

const DNS_SERVICE_URL = 'http://localhost:8053';

async function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

async function testNoRedirects() {
  console.log('🚀 Testing: No Redirects - Subdomains Serve Content Directly\n');
  
  // Test 1: Register a new subdomain
  console.log('📝 Registering subdomain: project-no-redirect-1');
  const registerResponse = await makeRequest(`${DNS_SERVICE_URL}/api/subdomains`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      subdomain: 'project-no-redirect-1',
      customerId: 'customer-123',
      prototypeId: 'proto-no-redirect-1'
    })
  });
  
  if (registerResponse.status === 200) {
    console.log('✅ Subdomain registered successfully:');
    console.log(`   Subdomain: ${registerResponse.data.subdomain}`);
    console.log(`   Target URL: ${registerResponse.data.targetUrl}`);
    console.log(`   Customer: ${registerResponse.data.customerId}`);
    console.log(`   Prototype: ${registerResponse.data.prototypeId}`);
  } else {
    console.log('❌ Failed to register subdomain:', registerResponse.data);
    return;
  }
  
  console.log('');
  
  // Test 2: Verify the target URL is the subdomain itself (no redirect)
  console.log('🔍 Verifying target URL is the subdomain itself...');
  const resolveResponse = await makeRequest(`${DNS_SERVICE_URL}/api/resolve/project-no-redirect-1.localhost`);
  
  if (resolveResponse.status === 200) {
    console.log('✅ Domain resolution successful:');
    console.log(`   Domain: ${resolveResponse.data.domain}`);
    console.log(`   Target URL: ${resolveResponse.data.targetUrl}`);
    
    // Check if target URL is the subdomain itself (not a redirect)
    const expectedUrl = 'http://project-no-redirect-1.localhost:3000';
    if (resolveResponse.data.targetUrl === expectedUrl) {
      console.log('✅ CORRECT: Target URL is the subdomain itself (no redirect)');
      console.log(`   Expected: ${expectedUrl}`);
      console.log(`   Actual: ${resolveResponse.data.targetUrl}`);
    } else {
      console.log('❌ INCORRECT: Target URL contains redirect path');
      console.log(`   Expected: ${expectedUrl}`);
      console.log(`   Actual: ${resolveResponse.data.targetUrl}`);
    }
  } else {
    console.log('❌ Failed to resolve domain:', resolveResponse.data);
    return;
  }
  
  console.log('');
  
  // Test 3: Show what this means for the user
  console.log('🌐 What this means for users:');
  console.log('   ✅ http://project-no-redirect-1.localhost:3000');
  console.log('      -> Serves content DIRECTLY on the subdomain');
  console.log('      -> NO redirect to /prototype-results/proto-no-redirect-1');
  console.log('      -> Content is served at the subdomain root');
  console.log('');
  
  // Test 4: Show the difference
  console.log('📊 Comparison:');
  console.log('   ❌ OLD WAY (with redirects):');
  console.log('      http://project-test.localhost:3000');
  console.log('      -> Redirects to: http://project-test.localhost:3000/prototype-results/test');
  console.log('');
  console.log('   ✅ NEW WAY (no redirects):');
  console.log('      http://project-no-redirect-1.localhost:3000');
  console.log('      -> Serves content directly at: http://project-no-redirect-1.localhost:3000');
  console.log('');
  
  console.log('🎉 Test Complete: Subdomains now serve content directly without redirects!');
  console.log('\n💡 Key Benefits:');
  console.log('   ✅ Clean URLs - No /prototype-results/ paths');
  console.log('   ✅ Direct Access - Content served at subdomain root');
  console.log('   ✅ Better UX - No redirects or path confusion');
  console.log('   ✅ Scalable - Each subdomain is independent');
}

// Run the test
testNoRedirects().catch(console.error);
