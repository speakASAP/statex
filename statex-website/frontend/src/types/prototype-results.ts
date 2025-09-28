export interface PrototypeResults {
  prototypeId: string;
  formData: FormData;
  workflowSteps: WorkflowStep[];
  aiAnalysis: AIAnalysisResults;
  prototypeInfo: PrototypeInfo;
  summary: OverallSummary;
}

export interface FormData {
  textContent: string;
  voiceFileUrl?: string;
  fileUrls: string[];
  contactInfo: ContactInfo;
  requirements: string;
}

export interface ContactInfo {
  name: string;
  contactType: string;
  contactValue: string;
}

export interface WorkflowStep {
  stepId: string;
  service: string;
  status: string;
  inputData: any;
  outputData?: any;
  processingTime?: number;
  errorMessage?: string;
}

export interface AIAnalysisResults {
  asrAnalysis?: ASRAnalysis;
  documentAnalysis?: DocumentAnalysis;
  nlpAnalysis?: NLPAnalysis;
  prototypeGeneration?: PrototypeGeneration;
}

export interface ASRAnalysis {
  transcript: string;
  confidence: number;
  language: string;
  processingTime: number;
}

export interface DocumentAnalysis {
  extractedText: string;
  documentType: string;
  keyPoints: string[];
  processingTime: number;
}

export interface NLPAnalysis {
  textSummary: string;
  keyInsights: string[];
  sentimentAnalysis: {
    overallSentiment: string;
  };
  topicCategorization: string[];
  processingTime: number;
}

export interface PrototypeGeneration {
  prototypeId: string;
  url: string;
  repositoryUrl: string;
  status: string;
  deploymentTime: string;
  processingTime: number;
}

export interface PrototypeInfo {
  type: string;
  name: string;
  description: string;
  version: string;
  url: string;
  repositoryUrl: string;
  status: string;
  deploymentTime: string;
}

export interface OverallSummary {
  totalSteps: number;
  completedSteps: number;
  successRate: string;
  totalProcessingTime: number;
  overallAssessment: string;
}
