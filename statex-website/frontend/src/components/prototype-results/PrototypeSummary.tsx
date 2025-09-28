import { PrototypeInfo } from '@/types/prototype-results';

interface PrototypeSummaryProps {
  prototypeInfo: PrototypeInfo;
}

export function PrototypeSummary({ prototypeInfo }: PrototypeSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <span className="mr-3">🚀</span>
        Generated Prototype Information
      </h2>
      
      <div className="space-y-6">
        {/* Prototype Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Prototype Name</span>
              <p className="text-gray-900 font-medium">{prototypeInfo.name}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Type</span>
              <p className="text-gray-900 capitalize">{prototypeInfo.type}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Version</span>
              <p className="text-gray-900">{prototypeInfo.version}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Status</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {prototypeInfo.status}
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Deployment Time</span>
              <p className="text-gray-900">{prototypeInfo.deploymentTime}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Description</span>
              <p className="text-gray-700">{prototypeInfo.description}</p>
            </div>
          </div>
        </div>

        {/* URLs */}
        <div className="space-y-4">
          <div>
            <span className="text-sm font-medium text-gray-500">Prototype URL</span>
            <div className="mt-1 flex items-center space-x-2">
              <code className="flex-1 bg-gray-100 px-3 py-2 rounded border text-sm text-gray-700 break-all">
                {prototypeInfo.url}
              </code>
              <a
                href={prototypeInfo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
              >
                Open
              </a>
            </div>
          </div>
          
          <div>
            <span className="text-sm font-medium text-gray-500">Repository URL</span>
            <div className="mt-1 flex items-center space-x-2">
              <code className="flex-1 bg-gray-100 px-3 py-2 rounded border text-sm text-gray-700 break-all">
                {prototypeInfo.repositoryUrl}
              </code>
              <a
                href={prototypeInfo.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm"
              >
                View Code
              </a>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <a
              href={prototypeInfo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span className="mr-2">🌐</span>
              View Live Prototype
            </a>
            <a
              href={prototypeInfo.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <span className="mr-2">📁</span>
              View Source Code
            </a>
            <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <span className="mr-2">📋</span>
              Copy URLs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
