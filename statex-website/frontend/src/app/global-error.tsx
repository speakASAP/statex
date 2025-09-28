'use client';

import { Container } from '@/components/atoms/Container';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { Text } from '@/components/atoms/Text';
import { env, getEmailLink } from '@/config/env';

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
          <Container className="text-center">
            <Card className="p-8 max-w-lg mx-auto bg-white shadow-lg">
              <div className="mb-6">
                <div className="text-5xl mb-4">🚨</div>
                <Text variant="h1" className="text-3xl font-bold text-gray-800 mb-4">
                  Critical Error
                </Text>
                <Text variant="body" className="text-lg text-gray-600 mb-6">
                  We're experiencing technical difficulties. Please try again later or contact our support team.
                </Text>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <Button onClick={reset} variant="primary" size="lg">
                  🔄 Try Again
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <a href={getEmailLink(env.SUPPORT_EMAIL, 'Website Error Report')}>
                    📧 Contact Support
                  </a>
                </Button>
              </div>

              <div className="text-center">
                <Text variant="small" className="text-gray-500">
                  Error ID: {error.digest || 'unknown'} • {new Date().toLocaleString()}
                </Text>
              </div>
            </Card>
          </Container>
        </div>
      </body>
    </html>
  );
}
