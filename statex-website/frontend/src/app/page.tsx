import React from 'react';
import dynamic from 'next/dynamic';
import { headers } from 'next/headers';

// Import HomePage with dynamic import
const HomePage = dynamic(() => import('@/components/pages/HomePage').then(mod => ({ default: mod.HomePage })), {
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your personalized experience...</p>
      </div>
    </div>
  )
});

// Function to check if a project exists (same as in CatchAllPage)
function checkProjectExists(prototypeId: string): boolean {
  // For now, we'll use a simple check - you can integrate with your actual project database
  // This could check against your DNS service, database, or AI service
  
  // Example: Check if it's a valid format (you can make this more sophisticated)
  if (!prototypeId || prototypeId.length < 3) {
    return false;
  }
  
  // For development, we'll consider some test projects as valid
  const validTestProjects = [
    'test',
    'test-1', 
    'project-test-1',
    'project-final-test',
    'project-no-redirect-1',
    'project-direct-1',
    'project-fixed-1'
  ];
  
  if (validTestProjects.includes(prototypeId)) {
    return true;
  }
  
  // For real projects, you would check against your database or API
  // Example: const response = await fetch(`/api/projects/${prototypeId}`);
  // return response.ok;
  
  // For now, return false for unknown projects
  return false;
}

export default async function Home() {
  // Check if this is a subdomain request on the server side
  const headersList = await headers();
  const host = headersList.get('host') || '';
  
  console.log(`[MAIN PAGE] Processing request - Host: ${host}`);
  
  // Check if this is a prototype subdomain
  const prototypeMatch = host.match(/^project-([a-zA-Z0-9_-]+)\.localhost(:\d+)?$/);
  
  if (prototypeMatch) {
    const prototypeId = prototypeMatch[1];
    console.log(`[MAIN PAGE] Found prototype subdomain: ${prototypeId} - checking project validity`);
    
    // Check if this is a valid project
    const isValidProject = checkProjectExists(prototypeId);
    
    if (!isValidProject) {
      // Project doesn't exist - show empty page
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.291A7.962 7.962 0 0012 5c-2.34 0-4.29 1.009-5.824 2.709" />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold text-gray-600 mb-2">Project Not Found</h1>
              <p className="text-gray-500">This project doesn't exist yet or has been removed.</p>
            </div>
          </div>
        </div>
      );
    } else {
      // Valid project - show prototype content
      return (
        <div className="min-h-screen bg-gray-100">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Prototype: {prototypeId}</h1>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your AI-Generated Prototype</h2>
              <p className="text-gray-600 mb-6">
                This is where your actual prototype will be displayed. The AI system will generate 
                a functional website/application based on your requirements and deploy it here.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Prototype Status</h3>
                <p className="text-blue-700">Status: In Development</p>
                <p className="text-blue-700">Framework: Next.js 14</p>
                <p className="text-blue-700">Deployment: {host}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  // Regular main website
  return <HomePage />;
}
