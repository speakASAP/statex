#!/usr/bin/env node

/**
 * Test script for DNS Service
 * Demonstrates subdomain registration and DNS resolution
 */

const dns = require('dns2');
const { promisify } = require('util');

const DNS_SERVICE_URL = 'http://localhost:8053';
const DNS_SERVER_PORT = 5353;

// Test data
const testSubdomains = [
  {
    subdomain: 'project-test-1',
    customerId: 'customer-123',
    prototypeId: 'proto-456',
    targetUrl: 'http://localhost:3000/prototype-results/proto-456'
  },
  {
    subdomain: 'project-test-2',
    customerId: 'customer-789',
    prototypeId: 'proto-789',
    targetUrl: 'http://localhost:3000/prototype-results/proto-789'
  }
];

async function makeRequest(url, options = {}) {
  const fetch = (await import('node-fetch')).default;
  const response = await fetch(url, options);
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  }
  
  return response.json();
}

async function testHealthCheck() {
  console.log('🔍 Testing health check...');
  try {
    const health = await makeRequest(`${DNS_SERVICE_URL}/health`);
    console.log('✅ Health check passed:', health);
    return true;
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return false;
  }
}

async function registerSubdomain(subdomainData) {
  console.log(`📝 Registering subdomain: ${subdomainData.subdomain}`);
  try {
    const result = await makeRequest(`${DNS_SERVICE_URL}/api/subdomains`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subdomainData)
    });
    console.log('✅ Subdomain registered:', result);
    return result;
  } catch (error) {
    console.error('❌ Failed to register subdomain:', error.message);
    return null;
  }
}

async function testDNSResolution(subdomain) {
  console.log(`🔍 Testing DNS resolution for: ${subdomain}.localhost`);
  
  return new Promise((resolve) => {
    const resolver = new dns.Resolver({
      nameServers: ['127.0.0.1'],
      port: DNS_SERVER_PORT
    });
    
    resolver.resolve(`${subdomain}.localhost`, 'A')
      .then((response) => {
        console.log('✅ DNS resolution successful:', response);
        resolve(true);
      })
      .catch((error) => {
        console.error('❌ DNS resolution failed:', error.message);
        resolve(false);
      });
  });
}

async function testAPIResolution(subdomain) {
  console.log(`🔍 Testing API resolution for: ${subdomain}.localhost`);
  try {
    const result = await makeRequest(`${DNS_SERVICE_URL}/api/resolve/${subdomain}.localhost`);
    console.log('✅ API resolution successful:', result);
    return true;
  } catch (error) {
    console.error('❌ API resolution failed:', error.message);
    return false;
  }
}

async function listSubdomains() {
  console.log('📋 Listing all subdomains...');
  try {
    const result = await makeRequest(`${DNS_SERVICE_URL}/api/subdomains`);
    console.log('✅ Subdomains listed:', result);
    return result;
  } catch (error) {
    console.error('❌ Failed to list subdomains:', error.message);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Starting DNS Service Tests\n');
  
  // Test 1: Health check
  const healthOk = await testHealthCheck();
  if (!healthOk) {
    console.log('\n❌ DNS service is not running. Please start it first:');
    console.log('   cd statex-dns-service && npm start');
    process.exit(1);
  }
  
  console.log('');
  
  // Test 2: Register subdomains
  const registeredSubdomains = [];
  for (const subdomainData of testSubdomains) {
    const result = await registerSubdomain(subdomainData);
    if (result) {
      registeredSubdomains.push(result.subdomain);
    }
    console.log('');
  }
  
  // Test 3: List subdomains
  await listSubdomains();
  console.log('');
  
  // Test 4: Test DNS resolution
  for (const subdomain of registeredSubdomains) {
    await testDNSResolution(subdomain);
    console.log('');
  }
  
  // Test 5: Test API resolution
  for (const subdomain of registeredSubdomains) {
    await testAPIResolution(subdomain);
    console.log('');
  }
  
  console.log('🎉 All tests completed!');
  console.log('\nYou can now test the subdomains in your browser:');
  for (const subdomain of registeredSubdomains) {
    console.log(`   http://${subdomain}.localhost:3000`);
  }
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});

// Run tests
runTests().catch(console.error);

