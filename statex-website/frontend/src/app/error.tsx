'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/atoms';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { getLocalizedUrl } from '../lib/utils/localization';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { language } = useLanguage();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <Container size="lg" padding="lg">
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-red-600 mb-4">500</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Something went wrong!
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            We encountered an unexpected error. Please try again or contact our support team if the problem persists.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={reset}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try again
            </button>
            
            <Link
              href={getLocalizedUrl('/about', language)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              About Us
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
