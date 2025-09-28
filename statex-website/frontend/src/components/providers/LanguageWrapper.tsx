'use client';

import React from 'react';
import { LanguageProvider, Language } from '@/components/providers/LanguageProvider';

interface LanguageWrapperProps {
  children: React.ReactNode;
  initialLanguage?: Language;
}

export function LanguageWrapper({ children, initialLanguage }: LanguageWrapperProps) {
  return (
    <LanguageProvider {...(initialLanguage ? { initialLanguage } : {})}>
      {children}
    </LanguageProvider>
  );
} 