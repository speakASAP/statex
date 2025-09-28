'use client';

import Link from 'next/link';
import { Container } from '@/components/atoms';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { getLocalizedUrl } from '../lib/utils/localization';

export default function NotFound() {
  const { language } = useLanguage();

  return (
    <Container size="lg" padding="lg">
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-400 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Page not found
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Homepage
            </Link>
            
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
