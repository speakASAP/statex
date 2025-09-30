// Environment configuration utility
//
// Current Email Accounts:
// ✅ sergej@statex.cz - Your personal account (Password: sergejPass2024!)
// ✅ contact@statex.cz - Business contact (Password: ContactPass123!)
// ✅ sales@statex.cz - Sales inquiries (Password: SalesPass123!)
// ✅ noreply@statex.cz - System notifications
// ✅ admin@statex.cz - Admin account
export const env = {
  // Base URL for the application
  BASE_URL: process.env['NEXT_PUBLIC_BASE_URL'] || 
    (process.env.NODE_ENV === 'production' 
      ? 'https://statex.cz' 
      : `http://localhost:${process.env['FRONTEND_PORT'] || '3000'}`),
  
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // API URL - Use environment variable or derive from BASE_URL
  API_URL: process.env['NEXT_PUBLIC_API_URL'] || 
    (process.env.NODE_ENV === 'production' 
      ? 'https://api.statex.cz/api' 
      : 'http://localhost:8002/api'),
  
  // External Notification Service URL
  NOTIFICATION_SERVICE_URL: process.env['NEXT_PUBLIC_NOTIFICATION_SERVICE_URL'] || 
    (process.env.NODE_ENV === 'production' 
      ? 'https://notifications.statex.cz' 
      : 'http://localhost:8005'),
  
  // External Notification Service API Key
  NOTIFICATION_SERVICE_API_KEY: process.env['NEXT_PUBLIC_NOTIFICATION_SERVICE_API_KEY'] || 'dev-notification-api-key',
  
  // User Portal Service URL
  USER_PORTAL_URL: process.env['NEXT_PUBLIC_USER_PORTAL_URL'] || 
    (process.env.NODE_ENV === 'production' 
      ? 'https://users.statex.cz' 
      : 'http://localhost:8006'),
  
  // AI Service URL
  AI_SERVICE_URL: process.env['NEXT_PUBLIC_AI_SERVICE_URL'] || 
    (process.env.NODE_ENV === 'production' 
      ? 'https://ai.statex.cz' 
      : 'http://localhost:8010'),
  
  // Contact email (can be made environment-specific if needed)
  CONTACT_EMAIL: 'contact@statex.cz',
  
  // Support email (using sales for now)
  SUPPORT_EMAIL: 'sales@statex.cz',
  
  // Legal email (using contact for now)
  LEGAL_EMAIL: 'contact@statex.cz',
  
  // Privacy email (using contact for now)
  PRIVACY_EMAIL: 'contact@statex.cz',
  
  // DPO email (using contact for now)  
  DPO_EMAIL: 'contact@statex.cz',
  
  // Debug mode
  DEBUG: process.env['DEBUG'] === 'true' || process.env.NODE_ENV === 'development',
} as const;

// Helper function to get full URL for a path
export const getFullUrl = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${env.BASE_URL}${cleanPath}`;
};

// Helper function to get email link
export const getEmailLink = (email: string, subject?: string): string => {
  const baseLink = `mailto:${email}`;
  return subject ? `${baseLink}?subject=${encodeURIComponent(subject)}` : baseLink;
};

// Helper function to get prototype URL
export const getPrototypeUrl = (prototypeId: string, path?: string): string => {
  const basePath = path ? `/${path}` : '';
  if (env.NODE_ENV === 'production') {
    return `https://project-${prototypeId}.statex.cz${basePath}`;
  } else {
    // Use the current port from the environment or detect from window location
    let port = process.env['FRONTEND_PORT'] || '3000';
    
    // If running in browser, detect the current port
    if (typeof window !== 'undefined' && window.location.port) {
      port = window.location.port;
    }
    
    return `http://project-${prototypeId}.localhost:${port}${basePath}`;
  }
};

// Helper function to get subdomain URL
export const getSubdomainUrl = (subdomain: string, path?: string): string => {
  const basePath = path ? `/${path}` : '';
  if (env.NODE_ENV === 'production') {
    return `https://${subdomain}.statex.cz${basePath}`;
  } else {
    return `http://${subdomain}.localhost:3000${basePath}`;
  }
};

// DNS Service URL
export const DNS_SERVICE_URL = process.env['NEXT_PUBLIC_DNS_SERVICE_URL'] || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://dns.statex.cz' 
    : 'http://localhost:8053');

console.log('API_URL:', process.env['NEXT_PUBLIC_API_URL']);
