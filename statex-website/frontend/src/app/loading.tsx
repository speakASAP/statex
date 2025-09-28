import { Container } from '@/components/atoms/Container';
import { Card } from '@/components/atoms/Card';
import { Text } from '@/components/atoms/Text';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <Container className="text-center">
        <Card className="p-8 max-w-md mx-auto bg-white shadow-lg">
          <div className="mb-6">
            {/* Animated Logo */}
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 bg-blue-600 rounded-lg animate-pulse" />
              <div className="absolute inset-2 bg-white rounded-md flex items-center justify-center">
                <Text variant="h3" className="font-bold text-blue-600">
                  S
                </Text>
              </div>
            </div>

            <Text variant="h2" className="text-2xl font-bold text-gray-800 mb-2">
              Loading...
            </Text>
            <Text variant="body" className="text-gray-600">
              Please wait while we prepare your content
            </Text>
          </div>

          {/* Loading Animation */}
          <div className="flex justify-center space-x-2 mb-6">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" />
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
          </div>

          <Text variant="small" className="text-gray-500">
            This usually takes just a few seconds
          </Text>
        </Card>
      </Container>
    </div>
  );
}
