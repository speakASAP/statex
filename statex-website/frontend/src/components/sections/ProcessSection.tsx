'use client';

import React from 'react';
import { Text } from '@/components/atoms/Text';
import { ClassComposer } from '@/lib/classComposition';

import { Container, Section } from '@/components/atoms';

interface ProcessStep {
  number: string;
  heading: string;
  text: string;
  details?: string[];
}

interface ProcessSectionProps {
  pageType?: 'homepage' | 'about' | 'service' | 'solution' | 'legal' | 'prototype';
  variant?: 'default' | 'steps' | 'timeline' | 'cards';
  title?: string;
  subtitle?: string;
  description?: string;
  steps: ProcessStep[];
  showDetails?: boolean;
  abTest?: { experimentId: string; variant: string };
}

export function ProcessSection({
  pageType = 'homepage',
  variant = 'steps',
  title = 'Our Development Process',
  subtitle,
  description = 'A proven methodology that ensures successful project delivery every time.',
  steps,
  showDetails = true,
  abTest
}: ProcessSectionProps) {
  // Generate classes using composition engine
  const composer = new ClassComposer(pageType);
  const classSet = composer.compose({
    pageType,
    section: 'process',
    variant,
    theme: 'light',
    abTest,
    customClasses: []
  });

  const renderStep = (step: ProcessStep, index: number) => {
    return (
      <div
        key={index}
        className={classSet.elements['step']}
        data-testid="stx-process-step"
      >
        <div
          className={classSet.elements['number']}
          data-testid="stx-process-number"
        >
          {step.number}
        </div>

        <Text
          variant="h3"
          className={classSet.elements['heading']}
          data-testid="stx-process-heading"
        >
          {step.heading}
        </Text>

        <Text
          variant="bodyMedium"
          className={classSet.elements['text']}
          data-testid="stx-process-text"
        >
          {step.text}
        </Text>

        {showDetails && step.details && step.details.length > 0 && (
          <ul
            className={classSet.elements['details']}
            data-testid="stx-process-details"
          >
            {step.details.map((detail, detailIndex) => (
              <li key={detailIndex}>{detail}</li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <Section spacing="lg" background="default">
      <Container size="lg">
        {(title || subtitle || description) && (
          <div className={classSet.elements['header']}>
            {title && (
              <h2
                className={classSet.elements['title']}
                data-testid="stx-process-title"
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                className={classSet.elements['subtitle']}
                data-testid="stx-process-subtitle"
              >
                {subtitle}
              </p>
            )}
            {description && (
              <p
                className={classSet.elements['subtitle']}
                data-testid="stx-process-description"
              >
                {description}
              </p>
            )}
          </div>
        )}
        <div
          className={classSet.elements['steps']}
          data-testid="stx-process-steps"
        >
          {steps.map((step, index) => renderStep(step, index))}
        </div>
      </Container>
    </Section>
  );
}
