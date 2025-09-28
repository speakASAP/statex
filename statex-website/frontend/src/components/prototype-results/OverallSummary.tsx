import { OverallSummary } from '@/types/prototype-results';

interface OverallSummaryProps {
  summary: OverallSummary;
}

export function OverallSummary({ summary }: OverallSummaryProps) {
  const successRate = parseFloat(summary.successRate.replace('%', ''));
  
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-blue-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <span className="mr-3">📊</span>
        Overall Analysis Summary
      </h2>
      
      <div className="space-y-6">
        {/* Success Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {summary.completedSteps}/{summary.totalSteps}
            </div>
            <div className="text-sm text-gray-600">Steps Completed</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {summary.successRate}
            </div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {summary.totalProcessingTime}s
            </div>
            <div className="text-sm text-gray-600">Total Processing Time</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Processing Progress</span>
            <span className="text-sm text-gray-500">{summary.successRate}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${successRate}%` }}
            ></div>
          </div>
        </div>

        {/* Overall Assessment */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <span className="mr-2">✅</span>
            Final Assessment
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {summary.overallAssessment}
          </p>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <span className="mr-2">🚀</span>
            Next Steps
          </h3>
          <div className="space-y-2">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-xs">1</span>
              </div>
              <p className="text-gray-700">Review your prototype and test all functionality</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-xs">2</span>
              </div>
              <p className="text-gray-700">Share the prototype with your team for feedback</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-xs">3</span>
              </div>
              <p className="text-gray-700">Contact us to discuss further development and customization</p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Need help with your prototype or want to discuss next steps?
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span className="mr-2">💬</span>
              Contact Us
            </a>
            <a
              href="/services"
              className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <span className="mr-2">🔧</span>
              View Services
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
