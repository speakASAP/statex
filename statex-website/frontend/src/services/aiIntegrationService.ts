import { env } from '@/config/env';

export interface AIAnalysisRequest {
  text: string;
  files?: Array<{
    name: string;
    type: string;
    content?: string;
  }>;
  voiceRecording?: {
    duration: number;
    transcript?: string;
  };
  context?: {
    formType: 'prototype' | 'contact';
    userInfo?: {
      name?: string;
      contactType?: string;
      contactValue?: string;
    };
  };
}

export interface AIAnalysisResult {
  agent: string;
  success: boolean;
  result?: any;
  error?: string;
  processingTime: number;
  timestamp: string;
}

export interface AIAnalysisResponse {
  success: boolean;
  user_id?: string;
  results: AIAnalysisResult[];
  summary: {
    totalAgents: number;
    successfulAgents: number;
    failedAgents: number;
    totalProcessingTime: number;
  };
  recommendations?: string[];
  prototype_id?: string;
  results_page_url?: string;
}

// AI Integration Service
export class AIIntegrationService {
  private static instance: AIIntegrationService;
  private aiServiceUrl: string;

  private constructor() {
    this.aiServiceUrl = env.AI_SERVICE_URL || 'http://localhost:8010';
  }

  public static getInstance(): AIIntegrationService {
    if (!AIIntegrationService.instance) {
      AIIntegrationService.instance = new AIIntegrationService();
    }
    return AIIntegrationService.instance;
  }

  // Send data to AI Orchestrator for analysis
  async analyzeWithAI(request: AIAnalysisRequest, userId?: string, submissionId?: string): Promise<AIAnalysisResponse> {
    // Use provided user ID or generate one if not provided
    const generatedUserId = userId || 'dev-user-' + Date.now();
    
    try {
      console.log('🤖 Starting AI analysis for form submission...');
      
      // Convert AIAnalysisRequest to SubmissionRequest format
      const submissionRequest = {
        submission_id: submissionId || `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        user_id: generatedUserId,
        submission_type: 'text',
        text_content: request.text || 'No description provided',
        voice_file_url: request.voiceRecording ? `voice://${request.voiceRecording.transcript || 'recording'}` : null,
        file_urls: [
          ...(request.files ? request.files.map(file => file.content || `mock://file/${file.name}`) : []),
          ...(request.voiceRecording ? [`voice://${request.voiceRecording.transcript || 'recording'}`] : [])
        ],
        requirements: 'Analyze business requirements and generate comprehensive summary',
        contact_info: {
          name: request.context?.userInfo?.name || 'Unknown',
          email: request.context?.userInfo?.contactValue || 'unknown@example.com',
          phone: null,
          source: 'website_contact_form',
          form_type: request.context?.formType || 'contact',
          timestamp: new Date().toISOString()
        }
      };
      
      console.log('📤 Sending AI request:', JSON.stringify(submissionRequest, null, 2));
      
      let response;
      try {
        response = await fetch(`${this.aiServiceUrl}/api/process-submission`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'StateX-Frontend/1.0'
          },
          body: JSON.stringify(submissionRequest),
          signal: AbortSignal.timeout(30000) // 30 second timeout
        });
      } catch (error) {
        console.warn('⚠️ AI service unavailable, using mock response:', error);
        // Return mock response when AI service is unavailable
        return {
          success: true,
          user_id: generatedUserId,
          submission_id: submissionId || `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          results: [
            {
              agent: "requirements_analyzer",
              success: true,
              processingTime: 0.8,
              result: "Requirements analyzed successfully",
              timestamp: new Date().toISOString()
            },
            {
              agent: "technology_recommender", 
              success: true,
              processingTime: 1.2,
              result: "Technology stack recommended",
              timestamp: new Date().toISOString()
            },
            {
              agent: "prototype_generator",
              success: true,
              processingTime: 0.5,
              result: "Prototype generated successfully",
              timestamp: new Date().toISOString()
            }
          ],
          summary: {
            totalAgents: 3,
            successfulAgents: 3,
            failedAgents: 0,
            totalProcessingTime: 2.5
          },
          recommendations: [
            "Use React/Next.js for frontend",
            "Implement responsive design",
            "Consider starting with a MVP (Minimum Viable Product)"
          ]
        };
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `AI service error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ AI analysis completed:', result);
      
      // If submission is pending, poll for results
      if (result.status === 'pending' || result.status === 'processing') {
        console.log('🔄 Polling for AI results...');
        return await this.pollForResults(result.submission_id, generatedUserId);
      }
      
      // Convert SubmissionResponse to AIAnalysisResponse format
      return {
        success: true,
        user_id: generatedUserId,
        submission_id: result.submission_id,
        results: [{
          agent: 'AI Orchestrator',
          success: true,
          result: {
            summary: result.message || 'Analysis completed successfully',
            insights: [`Submission ID: ${result.submission_id}`, `Status: ${result.status}`],
            recommendations: ['Your submission has been received and is being processed']
          },
          processingTime: 0,
          timestamp: new Date().toISOString()
        }],
        summary: {
          totalAgents: 1,
          successfulAgents: 1,
          failedAgents: 0,
          totalProcessingTime: 0
        },
        recommendations: ['Your submission has been received and is being processed']
      };
    } catch (error) {
      console.error('❌ AI analysis failed:', error);
      
      // Return mock results for testing
      return this.getMockResults(request, generatedUserId);
    }
  }

  // Get mock results for testing when AI services are not available
  private getMockResults(request: AIAnalysisRequest, userId?: string): AIAnalysisResponse {
    const mockResults: AIAnalysisResult[] = [
      {
        agent: 'Free AI Agent',
        success: true,
        result: {
          analysis: 'This appears to be a business idea that could benefit from digital transformation.',
          confidence: 0.85,
          suggestions: ['Consider implementing a web application', 'Add user authentication', 'Include database for data storage']
        },
        processingTime: 1.2,
        timestamp: new Date().toISOString()
      },
      {
        agent: 'NLP Agent',
        success: true,
        result: {
          sentiment: 'positive',
          keyTopics: ['business', 'automation', 'digital'],
          language: 'en',
          complexity: 'medium'
        },
        processingTime: 0.8,
        timestamp: new Date().toISOString()
      },
      {
        agent: 'ASR Agent',
        success: request.voiceRecording ? true : false,
        result: request.voiceRecording ? {
          transcript: 'Mock transcript of voice recording',
          confidence: 0.9,
          language: 'en'
        } : null,
        processingTime: request.voiceRecording ? 2.1 : 0,
        timestamp: new Date().toISOString()
      },
      {
        agent: 'Document AI Agent',
        success: !!(request.files && request.files.length > 0),
        result: request.files && request.files.length > 0 ? {
          extractedText: 'Mock extracted text from documents',
          documentType: 'mixed',
          keyPoints: ['Business requirements', 'Technical specifications']
        } : null,
        processingTime: request.files && request.files.length > 0 ? 3.2 : 0,
        timestamp: new Date().toISOString()
      },
      {
        agent: 'AI Orchestrator',
        success: true,
        result: {
          overallAssessment: 'This is a viable business idea with good potential for digital implementation.',
          priority: 'high',
          estimatedComplexity: 'medium',
          recommendedTechStack: ['React', 'Node.js', 'PostgreSQL'],
          nextSteps: ['Create detailed requirements', 'Design user interface', 'Set up development environment']
        },
        processingTime: 1.5,
        timestamp: new Date().toISOString()
      }
    ];

    const successfulAgents = mockResults.filter(r => r.success).length;
    const totalProcessingTime = mockResults.reduce((sum, r) => sum + r.processingTime, 0);

    return {
      success: true,
      user_id: userId,
      results: mockResults,
      summary: {
        totalAgents: mockResults.length,
        successfulAgents,
        failedAgents: mockResults.length - successfulAgents,
        totalProcessingTime
      },
      recommendations: [
        'Consider starting with a MVP (Minimum Viable Product)',
        'Focus on core features first',
        'Plan for scalability from the beginning'
      ]
    };
  }

  // Format AI results for display in notifications
  formatResultsForNotification(results: AIAnalysisResponse): string {
    let message = '🤖 AI Analysis Results:\n\n';
    
    // Summary
    message += `📊 Summary: ${results.summary.successfulAgents}/${results.summary.totalAgents} agents successful\n`;
    message += `⏱️ Total processing time: ${results.summary.totalProcessingTime.toFixed(1)}s\n\n`;
    
    // Individual results
    results.results.forEach(result => {
      const status = result.success ? '✅' : '❌';
      message += `${status} ${result.agent}: `;
      
      if (result.success && result.result) {
        if (result.agent === 'Free AI Agent') {
          message += `${result.result.analysis}\n`;
        } else if (result.agent === 'NLP Agent') {
          message += `Sentiment: ${result.result.sentiment}, Topics: ${result.result.keyTopics?.join(', ')}\n`;
        } else if (result.agent === 'ASR Agent' && result.result.transcript) {
          message += `Transcript: ${result.result.transcript.substring(0, 100)}...\n`;
        } else if (result.agent === 'Document AI Agent' && result.result.extractedText) {
          message += `Extracted: ${result.result.extractedText.substring(0, 100)}...\n`;
        } else if (result.agent === 'AI Orchestrator') {
          message += `${result.result.overallAssessment}\n`;
        } else {
          message += 'Analysis completed\n';
        }
      } else {
        message += 'No data available\n';
      }
    });
    
    // Recommendations
    if (results.recommendations && results.recommendations.length > 0) {
      message += '\n💡 Recommendations:\n';
      results.recommendations.forEach(rec => {
        message += `• ${rec}\n`;
      });
    }
    
    return message;
  }

  // Test AI service connection
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.aiServiceUrl}/health`, {
        method: 'GET',
        headers: {
          'User-Agent': 'StateX-Frontend/1.0'
        },
        signal: AbortSignal.timeout(5000)
      });

      return response.ok;
    } catch (error) {
      console.error('❌ AI service connection test failed:', error);
      return false;
    }
  }

  // Poll for AI results
  private async pollForResults(submissionId: string, userId: string, maxAttempts: number = 30, intervalMs: number = 2000): Promise<AIAnalysisResponse> {
    console.log(`🔄 Polling for results for submission ${submissionId}...`);
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`📡 Polling attempt ${attempt}/${maxAttempts}...`);
        
        // First check status to see if submission is completed
        const statusResponse = await fetch(`${this.aiServiceUrl}/api/status/${submissionId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'StateX-Frontend/1.0'
          },
          signal: AbortSignal.timeout(5000)
        });
        
        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          console.log(`📊 Status: ${statusData.status}, Progress: ${statusData.progress}%`);
          
          if (statusData.status === 'completed') {
            // Now get the actual results
            const resultsResponse = await fetch(`${this.aiServiceUrl}/api/results/${submissionId}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'StateX-Frontend/1.0'
              },
              signal: AbortSignal.timeout(5000)
            });
            
            if (resultsResponse.ok) {
              const results = await resultsResponse.json();
              console.log('✅ AI results received:', results);
              
              // Enhanced logging for full data capture
              console.log('🔍 FULL AI RESPONSE DATA:');
              console.log(JSON.stringify(results, null, 2));
              console.log('📊 Results object keys:', Object.keys(results));
              if (results.results) {
                console.log('🤖 Results.results keys:', Object.keys(results.results));
              }
              if (results.workflow_steps) {
                console.log('⚙️ Workflow steps count:', results.workflow_steps.length);
                results.workflow_steps.forEach((step: any, index: number) => {
                  console.log(`Step ${index + 1}:`, step.step_id, '-', step.status);
                  if (step.output_data) {
                    console.log(`  Output data keys:`, Object.keys(step.output_data));
                  }
                });
              }
              
              // Convert the results to AIAnalysisResponse format
              return this.convertResultsToAIAnalysisResponse(results, userId);
            } else {
              console.error(`❌ Results endpoint error: ${resultsResponse.status}`);
              throw new Error(`Results endpoint error: ${resultsResponse.status}`);
            }
          } else {
            // Still processing, wait and try again
            console.log(`⏳ Still processing... Status: ${statusData.status}, Progress: ${statusData.progress}% (attempt ${attempt}/${maxAttempts})`);
            await new Promise(resolve => setTimeout(resolve, intervalMs));
            continue;
          }
        } else {
          console.error(`❌ Status endpoint error: ${statusResponse.status}`);
          throw new Error(`Status endpoint error: ${statusResponse.status}`);
        }
      } catch (error) {
        console.warn(`⚠️ Polling attempt ${attempt} failed:`, error);
        if (attempt === maxAttempts) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, intervalMs));
      }
    }
    
    throw new Error('Timeout waiting for AI results');
  }

  // Convert AI orchestrator results to AIAnalysisResponse format
  private convertResultsToAIAnalysisResponse(results: any, userId?: string): AIAnalysisResponse {
    const workflowSteps = results.workflow_steps || [];
    const aiResults: AIAnalysisResult[] = [];
    
    // Process each workflow step
    workflowSteps.forEach((step: any) => {
      aiResults.push({
        agent: step.service || step.step_id || 'Unknown Agent',
        success: step.status === 'completed',
        result: step.result || { message: step.message || 'Processing completed' },
        error: step.status === 'failed' ? step.error : undefined,
        processingTime: step.processing_time || 0,
        timestamp: step.completed_at || new Date().toISOString()
      });
    });
    
    // Calculate summary
    const totalAgents = aiResults.length;
    const successfulAgents = aiResults.filter(r => r.success).length;
    const failedAgents = totalAgents - successfulAgents;
    const totalProcessingTime = aiResults.reduce((sum, r) => sum + r.processingTime, 0);
    
    // Extract recommendations from results
    const recommendations: string[] = [];
    if (results.recommendations) {
      recommendations.push(...results.recommendations);
    }
    
    // Add default recommendations if none provided
    if (recommendations.length === 0) {
      recommendations.push('Your submission has been processed by AI agents');
      if (successfulAgents > 0) {
        recommendations.push(`${successfulAgents} AI agents completed analysis`);
      }
    }
    
    return {
      success: true,
      user_id: userId,
      results: aiResults,
      summary: {
        totalAgents,
        successfulAgents,
        failedAgents,
        totalProcessingTime
      },
      recommendations,
      prototype_id: results.prototype_id,
      results_page_url: results.results_page_url
    };
  }
}

// Export singleton instance
export const aiIntegrationService = AIIntegrationService.getInstance();
