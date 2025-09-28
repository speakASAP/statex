// Simple script to set up a test user session for dashboard testing
// Run this in the browser console or as a bookmark

// Set up test user session
localStorage.setItem('statex_user_id', 'dev-user-1757845974658');
localStorage.setItem('statex_session_id', 'test-session-' + Date.now());

console.log('Test user session set up!');
console.log('User ID:', localStorage.getItem('statex_user_id'));
console.log('Session ID:', localStorage.getItem('statex_session_id'));
console.log('Now refresh the dashboard page to see the profile and results.');

// Optional: redirect to dashboard
// window.location.href = '/dashboard';

