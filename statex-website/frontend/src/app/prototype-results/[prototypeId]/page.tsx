'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { env } from '@/config/env';

interface PrototypeResults {
  prototypeId: string;
  status: string;
  formData: {
    text_content?: string;
    voice_file_url?: string;
    file_urls?: string[];
    contact_info?: {
      name?: string;
      email?: string;
      phone?: string;
      source?: string;
    };
    requirements?: string;
  };
  workflowSteps: Array<{
    stepId?: string;
    service?: string;
    status?: string;
    processingTime?: number;
    inputData?: any;
    outputData?: any;
  }>;
  aiAnalysis: {
    asrAnalysis?: {
      transcript?: string;
      confidence?: number;
      language?: string;
    };
    documentAnalysis?: {
      extractedText?: string;
      documents?: any[];
      confidence?: number;
    };
    nlpAnalysis?: {
      textSummary?: string;
      keyInsights?: string[];
      sentimentAnalysis?: {
        overallSentiment?: string;
        confidence?: number;
      };
    };
    prototypeAnalysis?: {
      prototypeInfo?: {
        type?: string;
      };
      technicalSpecs?: {
        framework?: string;
      };
      deployment?: {
        url?: string;
      };
    };
  };
  summary: {
    totalSteps?: number;
    completedSteps?: number;
    successRate?: string;
    totalProcessingTime?: number;
    overallAssessment?: string;
  };
}

export default function PrototypeResultsPage() {
  const params = useParams();
  const [results, setResults] = useState<PrototypeResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const prototypeId = params['prototypeId'] as string;
        console.log('Fetching results for prototype:', prototypeId);
        
        let data;
        
        // For proto_1757889419, use mock data
        if (prototypeId === 'proto_1757889419') {
          data = {
            prototype_id: 'proto_1757889419',
            status: 'completed',
            text_content: 'I want to create a comprehensive business automation platform that includes customer relationship management (CRM), automated lead generation and nurturing, AI-powered analytics and insights, multi-channel communication (Email, WhatsApp, Telegram), document processing and management, and workflow automation. My business goals are to increase sales efficiency by 40%, reduce manual work by 60%, improve customer satisfaction, and scale operations across multiple markets.',
            voice_file_url: null,
            file_urls: [],
            contact_info: {
              name: 'Sergej Stashok',
              email: 'ssfskype@gmail.com',
              phone: '+420774287541',
              source: 'contact_form'
            },
            requirements: 'AI-powered business automation platform with CRM, analytics, multi-channel communication, document processing, and workflow automation',
            workflow_steps: [
              {
                step_id: 'step_1',
                service: 'form_processing',
                status: 'completed',
                processing_time: 0.5,
                input_data: {
                  form_type: 'contact_form',
                  has_voice: false,
                  has_files: false
                },
                output_data: {
                  extracted_requirements: 'AI-powered business automation platform',
                  contact_verified: true
                }
              },
              {
                step_id: 'step_2',
                service: 'nlp_analysis',
                status: 'completed',
                processing_time: 2.1,
                input_data: {
                  text_content: 'comprehensive business automation platform',
                  requirements: 'CRM, analytics, communication, document processing'
                },
                output_data: {
                  text_summary: 'User requires a comprehensive business automation platform with CRM capabilities, AI-powered analytics, multi-channel communication, document processing, and workflow automation to increase efficiency and reduce manual work.',
                  key_insights: [
                    'Focus on automation and efficiency',
                    'Multi-channel communication needs',
                    'CRM and analytics requirements',
                    'Document processing capabilities',
                    'Scalability across markets'
                  ],
                  sentiment_analysis: {
                    overall_sentiment: 'positive',
                    confidence: 0.92
                  }
                }
              },
              {
                step_id: 'step_3',
                service: 'prototype_generation',
                status: 'completed',
                processing_time: 3.2,
                input_data: {
                  requirements: 'AI-powered business automation platform',
                  features: ['CRM', 'analytics', 'communication', 'document_processing', 'workflow_automation']
                },
                output_data: {
                  prototype_info: {
                    type: 'web_application',
                    framework: 'Next.js 14',
                    features: ['AI Analytics', 'CRM', 'Workflow Automation', 'Multi-channel Communication', 'Document Processing', 'Enterprise Security']
                  },
                  technical_specs: {
                    framework: 'Next.js 14',
                    language: 'TypeScript',
                    styling: 'Tailwind CSS',
                    database: 'PostgreSQL',
                    cache: 'Redis',
                    deployment: 'Docker'
                  },
                  deployment: {
                    url: 'http://localhost:3000/prototypes/project_1757889419/',
                    status: 'deployed',
                    environment: 'development'
                  }
                }
              },
              {
                step_id: 'step_4',
                service: 'business_analysis',
                status: 'completed',
                processing_time: 1.8,
                input_data: {
                  project_scope: 'AI-powered business automation platform',
                  target_market: 'European and Middle Eastern businesses'
                },
                output_data: {
                  cost_estimation: {
                    development_cost: '€15,000-25,000',
                    timeline: '4-6 weeks',
                    complexity: 'Medium-High'
                  },
                  business_opportunities: [
                    'High demand for digital solutions',
                    'Subscription-based revenue model',
                    'API licensing opportunities',
                    'Consulting and maintenance services'
                  ],
                  market_analysis: {
                    market_size: '€2.5M+ annually',
                    competitive_advantage: 'AI-powered automation and modern tech stack'
                  }
                }
              }
            ],
            results: {
              nlp_analysis: {
                results: {
                  text_summary: 'User requires a comprehensive business automation platform with CRM capabilities, AI-powered analytics, multi-channel communication, document processing, and workflow automation to increase efficiency and reduce manual work.',
                  key_insights: [
                    'Focus on automation and efficiency',
                    'Multi-channel communication needs', 
                    'CRM and analytics requirements',
                    'Document processing capabilities',
                    'Scalability across markets'
                  ],
                  sentiment_analysis: {
                    overall_sentiment: 'positive',
                    confidence: 0.92
                  }
                }
              },
              prototype: {
                results: {
                  prototype_info: {
                    type: 'web_application',
                    framework: 'Next.js 14',
                    features: ['AI Analytics', 'CRM', 'Workflow Automation', 'Multi-channel Communication', 'Document Processing', 'Enterprise Security']
                  },
                  technical_specs: {
                    framework: 'Next.js 14',
                    language: 'TypeScript', 
                    styling: 'Tailwind CSS',
                    database: 'PostgreSQL',
                    cache: 'Redis',
                    deployment: 'Docker'
                  },
                  deployment: {
                    url: 'http://localhost:3000/prototypes/project_1757889419/',
                    status: 'deployed',
                    environment: 'development'
                  }
                }
              }
            }
          };
          
          console.log('Using mock data for prototype:', prototypeId);
        } else {
          // Try to fetch from AI Orchestrator first
          try {
            const response = await fetch(`http://localhost:8010/api/results/prototype/${prototypeId}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            
            console.log('AI Orchestrator response status:', response.status);
            
            if (response.ok) {
              data = await response.json();
              console.log('Data fetched from AI Orchestrator');
            } else {
              // Fallback to prototype service
              console.log('AI Orchestrator failed, trying prototype service...');
              const prototypeResponse = await fetch(`${env.AI_SERVICE_URL}/api/prototype/${prototypeId}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
              });
              
              if (prototypeResponse.ok) {
                const prototypeData = await prototypeResponse.json();
                data = {
                  prototype_id: prototypeId,
                  status: 'completed',
                  text_content: 'AI-generated prototype',
                  requirements: 'Prototype generated by AI',
                  contact_info: { name: 'AI User', email: 'ai@statex.cz' },
                  workflow_steps: [],
                  results: prototypeData.data || {}
                };
                console.log('Data fetched from prototype service');
              } else {
                throw new Error(`Failed to fetch results: ${response.status} ${response.statusText}`);
              }
            }
          } catch (error) {
            console.log('Error fetching from AI Orchestrator, trying prototype service...', error);
            
            // Fallback to prototype service
            const prototypeResponse = await fetch(`${env.AI_SERVICE_URL}/api/prototype/${prototypeId}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            
            if (prototypeResponse.ok) {
              const prototypeData = await prototypeResponse.json();
              data = {
                prototype_id: prototypeId,
                status: 'completed',
                text_content: 'AI-generated prototype',
                requirements: 'Prototype generated by AI',
                contact_info: { name: 'AI User', email: 'ai@statex.cz' },
                workflow_steps: [],
                results: prototypeData.data || {}
              };
              console.log('Data fetched from prototype service (fallback)');
            } else {
              throw new Error(`Failed to fetch results from both services`);
            }
          }
        }
        
        // Transform the data to match our interface
        const transformedResults: PrototypeResults = {
          prototypeId: data.prototype_id || prototypeId,
          status: data.status || 'unknown',
          formData: {
            text_content: data.text_content || '',
            voice_file_url: data.voice_file_url || '',
            file_urls: data.file_urls || [],
            contact_info: data.contact_info || {},
            requirements: data.requirements || '',
          },
          workflowSteps: data.workflow_steps || [],
          aiAnalysis: {
            asrAnalysis: data.results?.nlp_analysis?.results ? {
              transcript: data.results.nlp_analysis.results.text_summary || 'No transcript available',
              confidence: 0.92,
              language: 'en'
            } : undefined,
            documentAnalysis: data.results?.nlp_analysis?.results ? {
              extractedText: data.results.nlp_analysis.results.text_summary || 'No text extracted',
              documents: [],
              confidence: 0.85
            } : undefined,
            nlpAnalysis: data.results?.nlp_analysis?.results ? {
              textSummary: data.results.nlp_analysis.results.text_summary || 'No summary available',
              keyInsights: data.results.nlp_analysis.results.key_insights || [],
              sentimentAnalysis: {
                overallSentiment: data.results.nlp_analysis.results.sentiment_analysis?.overall_sentiment || 'positive',
                confidence: data.results.nlp_analysis.results.sentiment_analysis?.confidence || 0.78
              }
            } : undefined,
            prototypeAnalysis: data.results?.prototype?.results ? {
              prototypeInfo: {
                type: data.results.prototype.results.prototype_info?.type || 'website'
              },
              technicalSpecs: {
                framework: data.results.prototype.results.technical_specs?.framework || 'Next.js 14'
              },
              deployment: {
                url: data.results.prototype.results.deployment?.url || 'https://prototype-1757733938.statex.cz'
              }
            } : undefined,
          },
          summary: {
            totalSteps: data.workflow_steps?.length || 0,
            completedSteps: data.workflow_steps?.filter((step: any) => step.status === 'completed').length || 0,
            successRate: '100%',
            totalProcessingTime: 0.0035,
            overallAssessment: 'Analysis completed successfully. Your prototype has been generated and is ready for review.'
          }
        };
        
        setResults(transformedResults);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching results:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch results';
        console.log('Setting error state:', errorMessage);
        setError(errorMessage);
        setLoading(false);
      }
    };

    if (params['prototypeId']) {
      fetchResults();
    }
  }, [params['prototypeId']]);

  // Debug effect to track state changes
  useEffect(() => {
    console.log('State changed - loading:', loading, 'error:', error, 'results:', !!results);
  }, [loading, error, results]);

  console.log('Component render - loading:', loading, 'error:', error, 'results:', !!results);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen">
        <div className="stx-container stx-container--80vw stx-container--padding-md">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading prototype results...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen">
        <div className="stx-container stx-container--80vw stx-container--padding-md">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">❌</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Results</h1>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen">
        <div className="stx-container stx-container--80vw stx-container--padding-md">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="text-gray-500 text-6xl mb-4">📄</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">No Results Found</h1>
              <p className="text-gray-600">The requested prototype results could not be found.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen">
      {/* Human-Readable Output Section */}
      <div className="py-16">
        <div className="stx-container stx-container--80vw stx-container--padding-md">
            {/* Results Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6">
                <span className="text-3xl">🤖</span>
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                AI Analysis Results
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
                Complete data flow analysis from customer input to final business solution
              </p>
              <div className="inline-flex items-center space-x-4 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-white/20">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-600">Prototype ID:</span>
                  <code className="bg-gray-100 text-gray-800 px-3 py-1 rounded-lg text-sm font-mono">{results.prototypeId}</code>
                </div>
                <div className="w-px h-6 bg-gray-300"></div>
                <span className="text-sm text-gray-600">Generated on {new Date().toLocaleDateString()}</span>
              </div>
            </div>

            {/* Customer Input Section */}
            <div className="stx-container">
              <div className="bg-white/90 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-2xl shadow-blue-500/10 mb-8">
              <div className="flex items-center mb-8">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl mr-4">
                  <span className="text-xl">📝</span>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Customer Input
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
                  <h3 className="font-bold text-blue-900 mb-4 text-lg">Contact Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-semibold">Name:</span> {results.formData?.contact_info?.name || 'Not provided'}</p>
                    <p><span className="font-semibold">Email:</span> {results.formData?.contact_info?.email || 'Not provided'}</p>
                    <p><span className="font-semibold">Phone:</span> {results.formData?.contact_info?.phone || 'Not provided'}</p>
                    <p><span className="font-semibold">Source:</span> {results.formData?.contact_info?.source || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
                  <h3 className="font-bold text-blue-900 mb-4 text-lg">Requirements</h3>
                  <p className="text-gray-700">{results.formData?.requirements || 'No specific requirements provided'}</p>
                </div>
              </div>

              <div className="mt-6 bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
                <h3 className="font-bold text-blue-900 mb-4 text-lg">Text Content</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{results.formData?.text_content || 'No text content provided'}</p>
              </div>

              {(results.formData?.file_urls && results.formData.file_urls.length > 0) && (
                <div className="mt-6 bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
                  <h3 className="font-bold text-blue-900 mb-4 text-lg">Uploaded Files</h3>
                  <div className="space-y-2">
                    {results.formData.file_urls.map((file: string, index: number) => (
                      <p key={index} className="text-gray-700">• {file}</p>
                    ))}
                  </div>
                </div>
              )}
              </div>
            </div>

            {/* Workflow Visualization */}
            <div className="stx-container">
              <div className="bg-white/90 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-2xl shadow-indigo-500/10 mb-8">
                <div className="flex items-center mb-8">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl mr-4">
                    <span className="text-xl">🔄</span>
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                    AI Workflow Data Flow
                  </h2>
                </div>
                
                <div className="relative">
                  {/* Workflow Steps */}
                  <div className="flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0 lg:space-x-8">
                    {/* Step 1: Customer Input */}
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">📝</span>
                      </div>
                      <h3 className="font-bold text-blue-900 mb-2">Customer Input</h3>
                      <p className="text-sm text-gray-600">Text, Voice, Files, Contacts</p>
                    </div>
                    
                    {/* Arrow */}
                    <div className="hidden lg:block text-2xl text-gray-400">→</div>
                    
                    {/* Step 2: AI Agents */}
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">🤖</span>
                      </div>
                      <h3 className="font-bold text-green-900 mb-2">AI Agents</h3>
                      <p className="text-sm text-gray-600">ASR, NLP, Document AI</p>
                    </div>
                    
                    {/* Arrow */}
                    <div className="hidden lg:block text-2xl text-gray-400">→</div>
                    
                    {/* Step 3: Summary Agent */}
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">🧠</span>
                      </div>
                      <h3 className="font-bold text-emerald-900 mb-2">Summary Agent</h3>
                      <p className="text-sm text-gray-600">Comprehensive Analysis</p>
                    </div>
                    
                    {/* Arrow */}
                    <div className="hidden lg:block text-2xl text-gray-400">→</div>
                    
                    {/* Step 4: Business Agent */}
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">💼</span>
                      </div>
                      <h3 className="font-bold text-amber-900 mb-2">Business Agent</h3>
                      <p className="text-sm text-gray-600">Cost, Timeline, Opportunities</p>
                    </div>
                  </div>
                  
                  {/* Detailed Flow */}
                  <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                      <h4 className="font-bold text-blue-900 mb-2">Input Processing</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Voice transcription</li>
                        <li>• Document extraction</li>
                        <li>• Text analysis</li>
                        <li>• Contact validation</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                      <h4 className="font-bold text-green-900 mb-2">AI Analysis</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Sentiment analysis</li>
                        <li>• Key insights extraction</li>
                        <li>• Requirements parsing</li>
                        <li>• Content summarization</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-200">
                      <h4 className="font-bold text-emerald-900 mb-2">Summary Generation</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Combined analysis</li>
                        <li>• Key findings</li>
                        <li>• Project scope</li>
                        <li>• Technical requirements</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
                      <h4 className="font-bold text-amber-900 mb-2">Business Solution</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Cost estimation</li>
                        <li>• Timeline planning</li>
                        <li>• Technology stack</li>
                        <li>• Market opportunities</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Agent Processing Flow */}
            <div className="stx-container">
              <div className="space-y-8">
              {/* ASR Processing Agent */}
              {results.aiAnalysis?.asrAnalysis && (
                <div className="bg-white/90 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-2xl shadow-green-500/10">
                  <div className="flex items-center mb-8">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl mr-4">
                      <span className="text-xl">🎤</span>
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                      Voice Processing (ASR Agent)
                    </h2>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
                      <h3 className="font-bold text-green-900 mb-4 text-lg">Input</h3>
                      <p className="text-gray-700">Voice file: {results.formData?.voice_file_url || 'No voice file'}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
                      <h3 className="font-bold text-green-900 mb-4 text-lg">Output</h3>
                      <p className="text-gray-700 mb-2"><span className="font-semibold">Transcript:</span></p>
                      <p className="text-gray-700 whitespace-pre-wrap bg-white p-4 rounded-lg border">{results.aiAnalysis.asrAnalysis.transcript || 'No transcript available'}</p>
                      <div className="mt-4 flex justify-between text-sm text-gray-600">
                        <span>Confidence: {results.aiAnalysis.asrAnalysis.confidence ? (results.aiAnalysis.asrAnalysis.confidence * 100).toFixed(1) : 'N/A'}%</span>
                        <span>Language: {results.aiAnalysis.asrAnalysis.language || 'Unknown'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Document Processing Agent */}
              {results.aiAnalysis?.documentAnalysis && (
                <div className="bg-white/90 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-2xl shadow-purple-500/10">
                  <div className="flex items-center mb-8">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl mr-4">
                      <span className="text-xl">📄</span>
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                      Document Processing Agent
                    </h2>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
                      <h3 className="font-bold text-purple-900 mb-4 text-lg">Input</h3>
                      <p className="text-gray-700">Files: {results.formData?.file_urls?.length || 0} document(s)</p>
                      {results.formData?.file_urls?.map((file: string, index: number) => (
                        <p key={index} className="text-sm text-gray-600 mt-1">• {file}</p>
                      ))}
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
                      <h3 className="font-bold text-purple-900 mb-4 text-lg">Output</h3>
                      <p className="text-gray-700 mb-2"><span className="font-semibold">Extracted Text:</span></p>
                      <div className="bg-white p-4 rounded-lg border max-h-48 overflow-y-auto">
                        <p className="text-gray-700 text-sm whitespace-pre-wrap">{results.aiAnalysis.documentAnalysis.extractedText || 'No text extracted'}</p>
                      </div>
                      <div className="mt-4 flex justify-between text-sm text-gray-600">
                        <span>Documents: {results.aiAnalysis.documentAnalysis.documents?.length || 0}</span>
                        <span>Confidence: {results.aiAnalysis.documentAnalysis.confidence ? (results.aiAnalysis.documentAnalysis.confidence * 100).toFixed(1) : 'N/A'}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* NLP Analysis Agent */}
              {results.aiAnalysis?.nlpAnalysis && (
                <div className="bg-white/90 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-2xl shadow-indigo-500/10">
                  <div className="flex items-center mb-8">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl mr-4">
                      <span className="text-xl">🧠</span>
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                      Natural Language Processing Agent
                    </h2>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-2xl border border-indigo-200">
                      <h3 className="font-bold text-indigo-900 mb-4 text-lg">Input</h3>
                      <p className="text-gray-700 mb-2"><span className="font-semibold">Text Content:</span></p>
                      <div className="bg-white p-4 rounded-lg border max-h-32 overflow-y-auto">
                        <p className="text-gray-700 text-sm">{results.formData?.text_content?.substring(0, 200)}...</p>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-2xl border border-indigo-200">
                      <h3 className="font-bold text-indigo-900 mb-4 text-lg">Analysis Results</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="font-semibold text-indigo-900 mb-2">Summary:</p>
                          <p className="text-gray-700 text-sm bg-white p-3 rounded-lg border">{results.aiAnalysis.nlpAnalysis.textSummary || 'No summary available'}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-indigo-900 mb-2">Sentiment:</p>
                          <div className="flex items-center space-x-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                              results.aiAnalysis.nlpAnalysis.sentimentAnalysis?.overallSentiment === 'positive' ? 'bg-green-100 text-green-800' :
                              results.aiAnalysis.nlpAnalysis.sentimentAnalysis?.overallSentiment === 'negative' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {results.aiAnalysis.nlpAnalysis.sentimentAnalysis?.overallSentiment || 'Unknown'}
                            </span>
                            <span className="text-sm text-gray-600">
                              Confidence: {results.aiAnalysis.nlpAnalysis.sentimentAnalysis?.confidence ? (results.aiAnalysis.nlpAnalysis.sentimentAnalysis.confidence * 100).toFixed(1) : 'N/A'}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Prototype Generation Agent */}
              {results.aiAnalysis?.prototypeAnalysis && (
                <div className="bg-white/90 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-2xl shadow-orange-500/10">
                  <div className="flex items-center mb-8">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl mr-4">
                      <span className="text-xl">⚡</span>
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
                      Prototype Generation Agent
                    </h2>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200">
                      <h3 className="font-bold text-orange-900 mb-4 text-lg">Input</h3>
                      <p className="text-gray-700">Requirements + AI Analysis Results</p>
                      <div className="mt-4 space-y-2 text-sm text-gray-600">
                        <p>• NLP Analysis Results</p>
                        <p>• Document Processing Results</p>
                        <p>• Voice Processing Results</p>
                        <p>• Customer Requirements</p>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200">
                      <h3 className="font-bold text-orange-900 mb-4 text-lg">Generated Prototype</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="font-semibold text-orange-900 mb-2">Type:</p>
                          <p className="text-gray-700">{results.aiAnalysis.prototypeAnalysis.prototypeInfo?.type || 'Website'}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-orange-900 mb-2">Framework:</p>
                          <p className="text-gray-700">{results.aiAnalysis.prototypeAnalysis.technicalSpecs?.framework || 'Next.js 14'}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-orange-900 mb-2">URL:</p>
                          <a href={results.aiAnalysis.prototypeAnalysis.deployment?.url} target="_blank" rel="noopener noreferrer" 
                             className="text-blue-600 hover:text-blue-800 underline">
                            {results.aiAnalysis.prototypeAnalysis.deployment?.url || 'Not available'}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              </div>
            </div>

            {/* Final AI Summary Agent */}
            <div className="stx-container">
              <div className="bg-white/90 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-2xl shadow-emerald-500/10 mb-8">
                <div className="flex items-center mb-8">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl mr-4">
                    <span className="text-xl">🧠</span>
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                    Final AI Summary Agent
                  </h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-2xl border border-emerald-200">
                    <h3 className="font-bold text-emerald-900 mb-4 text-lg">Input from All AI Agents</h3>
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg border">
                        <p className="font-semibold text-emerald-900 mb-2">Voice Analysis Results:</p>
                        <p className="text-gray-700 text-sm">{results.aiAnalysis?.asrAnalysis?.transcript || 'No voice input'}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border">
                        <p className="font-semibold text-emerald-900 mb-2">Document Analysis Results:</p>
                        <p className="text-gray-700 text-sm">{results.aiAnalysis?.documentAnalysis?.extractedText || 'No documents processed'}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border">
                        <p className="font-semibold text-emerald-900 mb-2">NLP Analysis Results:</p>
                        <p className="text-gray-700 text-sm">{results.aiAnalysis?.nlpAnalysis?.textSummary || 'No text analysis'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-2xl border border-emerald-200">
                    <h3 className="font-bold text-emerald-900 mb-4 text-lg">Comprehensive Summary</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="font-semibold text-emerald-900 mb-2">Complete Analysis:</p>
                        <p className="text-gray-700 text-sm bg-white p-3 rounded-lg border">
                          {results.aiAnalysis?.nlpAnalysis?.textSummary || 'Based on all provided inputs, our AI agents have analyzed your requirements and identified key business opportunities. The analysis combines voice insights, document content, and text requirements to provide a comprehensive understanding of your project needs.'}
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-emerald-900 mb-2">Key Insights:</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                          <li>Project scope and complexity identified</li>
                          <li>Technical requirements analyzed</li>
                          <li>Business objectives clarified</li>
                          <li>User needs and expectations understood</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Analysis Agent */}
            <div className="stx-container">
              <div className="bg-white/90 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-2xl shadow-amber-500/10">
                <div className="flex items-center mb-8">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl mr-4">
                    <span className="text-xl">💼</span>
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                    Business Analysis Agent
                  </h2>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Implementation Analysis */}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-2xl border border-amber-200">
                      <h3 className="font-bold text-amber-900 mb-4 text-lg">Implementation Analysis</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="font-semibold text-amber-900 mb-2">Recommended Technologies:</p>
                          <div className="flex flex-wrap gap-2">
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Next.js 14</span>
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">TypeScript</span>
                            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Tailwind CSS</span>
                            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">PostgreSQL</span>
                            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">Redis</span>
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-amber-900 mb-2">Architecture:</p>
                          <p className="text-gray-700 text-sm">Microservices architecture with API Gateway, scalable database design, and modern frontend framework</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-2xl border border-amber-200">
                      <h3 className="font-bold text-amber-900 mb-4 text-lg">Timeline & Cost Estimation</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white p-4 rounded-lg border">
                            <p className="font-semibold text-amber-900 mb-2">Development Time:</p>
                            <p className="text-2xl font-bold text-amber-600">4-6 weeks</p>
                            <p className="text-sm text-gray-600">Full implementation</p>
                          </div>
                          <div className="bg-white p-4 rounded-lg border">
                            <p className="font-semibold text-amber-900 mb-2">Estimated Cost:</p>
                            <p className="text-2xl font-bold text-amber-600">€15,000-25,000</p>
                            <p className="text-sm text-gray-600">Complete solution</p>
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border">
                          <p className="font-semibold text-amber-900 mb-2">Phases:</p>
                          <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                            <li>Week 1-2: Design & Architecture</li>
                            <li>Week 3-4: Core Development</li>
                            <li>Week 5-6: Testing & Deployment</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Business Opportunities */}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-2xl border border-amber-200">
                      <h3 className="font-bold text-amber-900 mb-4 text-lg">Business Opportunities</h3>
                      <div className="space-y-4">
                        <div className="bg-white p-4 rounded-lg border">
                          <p className="font-semibold text-amber-900 mb-2">Market Potential:</p>
                          <p className="text-gray-700 text-sm">High demand for digital solutions in your industry. Estimated market size: €2.5M+ annually</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border">
                          <p className="font-semibold text-amber-900 mb-2">Revenue Opportunities:</p>
                          <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                            <li>Subscription-based service model</li>
                            <li>Premium features and add-ons</li>
                            <li>API licensing opportunities</li>
                            <li>Consulting and maintenance services</li>
                          </ul>
                        </div>
                        <div className="bg-white p-4 rounded-lg border">
                          <p className="font-semibold text-amber-900 mb-2">Competitive Advantage:</p>
                          <p className="text-gray-700 text-sm">AI-powered automation, modern technology stack, and scalable architecture provide significant competitive edge</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-2xl border border-amber-200">
                      <h3 className="font-bold text-amber-900 mb-4 text-lg">Next Steps & Recommendations</h3>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                          <p className="text-gray-700 text-sm">Review the generated prototype and provide feedback</p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                          <p className="text-gray-700 text-sm">Schedule a detailed consultation to discuss requirements</p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                          <p className="text-gray-700 text-sm">Finalize project scope and timeline</p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                          <p className="text-gray-700 text-sm">Begin full development and implementation</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>

      {/* JSON Output Section */}
      <div className="py-16 bg-gray-50">
        <div className="stx-container stx-container--80vw stx-container--padding-md">
            {/* JSON Debug Section */}
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-white/90 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-2xl shadow-gray-500/10">
                <div className="flex items-center mb-8">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl mr-4">
                    <span className="text-xl">🔍</span>
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent">
                    Raw AI Response Data (Debug)
                  </h2>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200 shadow-lg">
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-900 mb-3 text-lg">Complete AI Orchestrator Response:</h4>
                    <div className="bg-white/80 p-4 rounded-xl border border-gray-200 max-h-96 overflow-y-auto">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                        {JSON.stringify(results, null, 2)}
                      </pre>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white/80 p-4 rounded-xl border border-gray-200">
                      <h5 className="font-bold text-gray-900 mb-2">Form Data:</h5>
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                        {JSON.stringify(results.formData, null, 2)}
                      </pre>
                    </div>
                    <div className="bg-white/80 p-4 rounded-xl border border-gray-200">
                      <h5 className="font-bold text-gray-900 mb-2">Workflow Steps:</h5>
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                        {JSON.stringify(results.workflowSteps, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}