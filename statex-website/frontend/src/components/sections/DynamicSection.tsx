'use client';

import React, { useState, useEffect } from 'react';
import { SectionRegistry, getDefaultVariant } from './SectionRegistry';
import { SectionInstance } from './types';
import { Container, Section } from '@/components/atoms';

interface DynamicSectionProps {
  section: SectionInstance;
  pageType?: 'homepage' | 'about' | 'service' | 'solution' | 'legal' | 'prototype';
  className?: string;
  onLoad?: (sectionType: string) => void;
  onError?: (sectionType: string, error: Error) => void;
}

// Loading fallback component
const SectionLoading = () => (
  <div className="stx-section-loading" data-testid="section-loading">
    <div className="stx-section-loading-skeleton" data-testid="section-loading-skeleton">
      <div className="stx-section-loading-title" />
      <div className="stx-section-loading-content">
        <div className="stx-section-loading-line" />
        <div className="stx-section-loading-line" />
        <div className="stx-section-loading-line" />
      </div>
    </div>
  </div>
);

// Error fallback component
const SectionError = ({ sectionType, error }: { sectionType: string; error: Error }) => (
  <div className="stx-section-error">
    <div className="stx-section-error-content">
      <h3>Error loading {sectionType} section</h3>
      <p>{error.message}</p>
    </div>
  </div>
);

export function DynamicSection({
  section,
  onLoad,
  onError
}: DynamicSectionProps) {
  const [error, setError] = useState<Error | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const { type, variant, abTest } = section;

  // Get the effective variant (AB test or default)
  const effectiveVariant = abTest?.variant || variant || getDefaultVariant(type);

  // Get the section component
  const SectionComponent = SectionRegistry.getComponent(type, effectiveVariant);

  // Handle loading and error states
  useEffect(() => {
    if (!SectionComponent) {
      const error = new Error(`Section component not found: ${type}-${effectiveVariant}`);
      setError(error);
      onError?.(type, error);
    } else if (!isLoaded) {
      setIsLoaded(true);
      onLoad?.(type);
    }
  }, [SectionComponent, type, effectiveVariant, isLoaded, onLoad, onError]);

  if (error) {
    return <SectionError sectionType={type} error={error} />;
  }

  // Show loading state while component is being loaded
  if (!isLoaded || !SectionComponent) {
    return <SectionLoading />;
  }

  // Get the section data with default values
  // const sectionData = { ... }; // Removed unused variable

  // Render the section component with provided data
  return (
    <Section spacing="lg" background="default">
      <Container size="lg">
        {/* ...dynamic content... */}
      </Container>
    </Section>
  );
}
