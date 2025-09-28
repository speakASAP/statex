import { PrototypeResults } from '@/types/prototype-results';

interface ResultsHeaderProps {
  results: PrototypeResults;
}

export function ResultsHeader({ results }: ResultsHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Prototype Results
          </h1>
          <p className="text-gray-600 mb-4">
            Comprehensive AI analysis results for your prototype
          </p>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>Prototype ID: <code className="bg-gray-100 px-2 py-1 rounded">{results.prototypeId}</code></span>
            <span>Status: <span className="text-green-600 font-medium">Completed</span></span>
            <span>Processing Time: {results.summary.totalProcessingTime}s</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl mb-2">🚀</div>
          <div className="text-sm text-gray-500">Prototype Ready</div>
        </div>
      </div>
      
      {results.prototypeInfo.url && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Your Prototype is Ready!</h3>
              <p className="text-blue-700 text-sm">
                Access your prototype at the URL below
              </p>
            </div>
            <a
              href={results.prototypeInfo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Prototype
            </a>
          </div>
          <div className="mt-2 text-xs text-blue-600 break-all">
            {results.prototypeInfo.url}
          </div>
        </div>
      )}
    </div>
  );
}
