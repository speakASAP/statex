'use client';

import React from 'react';
import { ClassComposer } from '@/lib/classComposition';
import { Container, Section } from '@/components/atoms';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { getLocalizedUrl } from '@/lib/utils/localization';

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  primaryButton?: {
    text: string;
    action: string;
  };
  secondaryButton?: {
    text: string;
    action: string;
  };
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function CTASection({ 
  title = "Ready to Get Started?",
  subtitle = "Join thousands of businesses that trust us with their digital transformation",
  primaryButton = { text: "Get Started", action: "/contact" },
  secondaryButton = { text: "Learn More", action: "/about" },
  variant = 'primary',
  className = "" 
}: CTASectionProps) {
  const { language } = useLanguage();
  const composer = new ClassComposer('cta-section', className);

  const isPrimary = variant === 'primary';

  return (
    <Section className={composer.getClasses()}>
      <Container>
        <div className={`text-center py-16 px-6 rounded-2xl ${
          isPrimary 
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
            : 'bg-gray-50 text-gray-900'
        }`}>
          <h2 className={`text-4xl font-bold mb-4 ${
            isPrimary ? 'text-white' : 'text-gray-900'
          }`}>
            {title}
          </h2>
          
          <p className={`text-xl mb-8 max-w-2xl mx-auto ${
            isPrimary ? 'text-blue-100' : 'text-gray-600'
          }`}>
            {subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={getLocalizedUrl(primaryButton.action, language)}
              className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 ${
                isPrimary
                  ? 'bg-white text-blue-600 hover:bg-gray-100'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {primaryButton.text}
            </a>
            
            {secondaryButton && (
              <a
                href={getLocalizedUrl(secondaryButton.action, language)}
                className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 ${
                  isPrimary
                    ? 'border-2 border-white text-white hover:bg-white hover:text-blue-600'
                    : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                }`}
              >
                {secondaryButton.text}
              </a>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
