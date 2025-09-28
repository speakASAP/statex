import { notFound } from 'next/navigation';
import { env } from '@/config/env';

interface PrototypePlanPageProps {
  params: {
    prototypeId: string;
  };
}

export default async function PrototypePlanPage({ params }: PrototypePlanPageProps) {
  const { prototypeId } = await params;
  
  try {
    // Fetch the prototype results from the AI service
    const response = await fetch(`${env.AI_SERVICE_URL}/api/results/prototype/${prototypeId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Always fetch fresh data
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        notFound();
      }
      throw new Error(`Failed to fetch plan: ${response.status}`);
    }
    
    const planData = await response.json();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Development Plan - {prototypeId}
                </h1>
                <p className="mt-2 text-gray-600">
                  AI-generated development plan and technical specifications
                </p>
              </div>
              <div className="flex space-x-4">
                <a 
                  href={`/prototype-results/${prototypeId}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  ← Back to Results
                </a>
                <a 
                  href={`/prototype-results/${prototypeId}/offer`}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  View Offer →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Status Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Development Plan</h2>
                  <p className="text-blue-100">
                    Status: {planData.status || 'Processing...'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-blue-100 text-sm">Project ID</p>
                  <p className="text-white font-mono text-sm">{prototypeId}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {planData.workflow_results?.development_plan || planData.workflow_results?.plan ? (
                <div className="prose prose-lg max-w-none">
                  <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg text-sm">
                    {planData.workflow_results.development_plan || planData.workflow_results.plan}
                  </pre>
                </div>
              ) : planData.status === 'completed' ? (
                <div className="text-center py-12">
                  <div className="text-green-500 text-6xl mb-4">✅</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Workflow Completed - Plan Available Soon</h3>
                  <p className="text-gray-600 mb-6">
                    The AI analysis is complete. The development plan is being generated and will be available shortly.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Requirements Preview:</strong> {planData.requirements?.substring(0, 300)}...
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Generating Development Plan</h3>
                  <p className="text-gray-600">
                    Our AI agents are analyzing your requirements and creating a comprehensive development plan...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading plan:', error);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Plan</h1>
          <p className="text-gray-600 mb-6">
            There was an error loading the development plan for project {prototypeId}.
          </p>
          <div className="space-y-3">
            <a 
              href={`/prototype-results/${prototypeId}`}
              className="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Results
            </a>
            <a 
              href="/contact" 
              className="block w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export async function generateMetadata({ params }: PrototypePlanPageProps) {
  const { prototypeId } = await params;
  
  return {
    title: `Development Plan - ${prototypeId} - Statex AI`,
    description: `AI-generated development plan and technical specifications for project ${prototypeId}`,
  };
}

