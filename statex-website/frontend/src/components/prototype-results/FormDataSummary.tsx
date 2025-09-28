import { FormData } from '@/types/prototype-results';

interface FormDataSummaryProps {
  formData: FormData;
}

export function FormDataSummary({ formData }: FormDataSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
        <span className="mr-3">📝</span>
        Original Submission Data
      </h2>
      
      <div className="space-y-6">
        {/* Text Content */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Text Description</h3>
          <div className="bg-gray-50 rounded-lg p-4 border">
            <p className="text-gray-700 whitespace-pre-wrap">{formData.textContent}</p>
          </div>
        </div>

        {/* Requirements */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Requirements</h3>
          <div className="bg-gray-50 rounded-lg p-4 border">
            <p className="text-gray-700">{formData.requirements}</p>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Contact Information</h3>
          <div className="bg-gray-50 rounded-lg p-4 border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-500">Name</span>
                <p className="text-gray-900">{formData.contactInfo.name}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Contact Type</span>
                <p className="text-gray-900 capitalize">{formData.contactInfo.contactType}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Contact Value</span>
                <p className="text-gray-900">{formData.contactInfo.contactValue}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Files and Voice */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Voice Recording */}
          {formData.voiceFileUrl && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">🎤 Voice Recording</h3>
              <div className="bg-gray-50 rounded-lg p-4 border">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600">🎤</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Audio file processed</p>
                    <p className="text-xs text-gray-500">{formData.voiceFileUrl}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Files */}
          {formData.fileUrls.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">📄 Uploaded Files</h3>
              <div className="bg-gray-50 rounded-lg p-4 border">
                <div className="space-y-2">
                  {formData.fileUrls.map((file, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                        <span className="text-green-600 text-xs">📄</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-700">{file}</p>
                        <p className="text-xs text-gray-500">Processed</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
