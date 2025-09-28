import { AIAnalysisResults } from '@/types/prototype-results';

interface AIAnalysisSummaryProps {
  aiAnalysis: AIAnalysisResults;
}

export function AIAnalysisSummary({ aiAnalysis }: AIAnalysisSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <span className="mr-3">🤖</span>
        AI Agents Analysis Results
      </h2>
      
      <div className="space-y-6">
        {/* ASR Analysis */}
        {aiAnalysis.asrAnalysis && (
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <span className="mr-2">🎤</span>
              Voice Analysis (ASR Service)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-500">Transcript</span>
                <p className="text-gray-700 mt-1 bg-gray-50 p-3 rounded border">
                  {aiAnalysis.asrAnalysis.transcript}
                </p>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Confidence</span>
                  <p className="text-gray-900">{(aiAnalysis.asrAnalysis.confidence * 100).toFixed(1)}%</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Language</span>
                  <p className="text-gray-900 uppercase">{aiAnalysis.asrAnalysis.language}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Processing Time</span>
                  <p className="text-gray-900">{aiAnalysis.asrAnalysis.processingTime}s</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Document Analysis */}
        {aiAnalysis.documentAnalysis && (
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <span className="mr-2">📄</span>
              Document Analysis (Document AI)
            </h3>
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-500">Extracted Text</span>
                <p className="text-gray-700 mt-1 bg-gray-50 p-3 rounded border">
                  {aiAnalysis.documentAnalysis.extractedText}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Document Type</span>
                  <p className="text-gray-900 uppercase">{aiAnalysis.documentAnalysis.documentType}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Key Points</span>
                  <div className="mt-1">
                    {aiAnalysis.documentAnalysis.keyPoints.map((point, index) => (
                      <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1 mb-1">
                        {point}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Processing Time</span>
                  <p className="text-gray-900">{aiAnalysis.documentAnalysis.processingTime}s</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NLP Analysis */}
        {aiAnalysis.nlpAnalysis && (
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <span className="mr-2">🧠</span>
              Text Analysis (NLP Service)
            </h3>
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-500">Summary</span>
                <p className="text-gray-700 mt-1 bg-gray-50 p-3 rounded border">
                  {aiAnalysis.nlpAnalysis.textSummary}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Key Insights</span>
                  <div className="mt-1">
                    {aiAnalysis.nlpAnalysis.keyInsights.map((insight, index) => (
                      <span key={index} className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-1 mb-1">
                        {insight}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Sentiment</span>
                  <p className="text-gray-900 capitalize">{aiAnalysis.nlpAnalysis.sentimentAnalysis.overallSentiment}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Topics</span>
                  <div className="mt-1">
                    {aiAnalysis.nlpAnalysis.topicCategorization.map((topic, index) => (
                      <span key={index} className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded mr-1 mb-1">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Processing Time</span>
                  <p className="text-gray-900">{aiAnalysis.nlpAnalysis.processingTime}s</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
