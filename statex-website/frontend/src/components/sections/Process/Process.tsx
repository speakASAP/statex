'use client';

import React from 'react';
import { Text } from '../../atoms/Text';
import { Container, Section } from '../../atoms';

// Dynamic class generation function
export const getProcessClasses = (props: {
  variant?: 'default' | 'timeline' | 'cards' | 'steps';
  priority?: 'high' | 'medium' | 'low';
  aiOptimized?: boolean;
  abTest?: boolean;
  className?: string;
}) => {
  const classes: string[] = ['stx-process'];

  // Add variant class - default should be 'steps' not 'default'
  const variant = props.variant === 'default' ? 'steps' : props.variant || 'steps';
  classes.push(`stx-process-${variant}`);

  // Add priority class
  if (props.priority) {
    classes.push(`stx-process-priority-${props.priority}`);
  }

  // Add AI optimization class
  if (props.aiOptimized) {
    classes.push('stx-process-ai-optimized');
  }

  // Add AB test class
  if (props.abTest) {
    classes.push('stx-process-ab-test');
  }

  // Add custom className if provided
  if (props.className) {
    classes.push(props.className);
  }

  return classes.join(' ');
};

interface ProcessProps {
  variant?: 'default' | 'timeline' | 'cards' | 'steps';
  title?: string;
  description?: string;
  steps?: Array<{
    number: number;
    title: string;
    description: string;
  }>;
  className?: string;
  priority?: 'high' | 'medium' | 'low';
  aiOptimized?: boolean;
  abTest?: {
    experimentId: string;
    variant: string;
  };
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export function Process({
  variant = 'default',
  title = 'How It Works',
  description = 'Simple steps to get your prototype'
}: ProcessProps) {
  return (
    <Section spacing="lg" background="default">
      <Container size="lg">
        <div className="stx-process-header">
          <Text variant="h2" className="stx-process-title">
            {title}
          </Text>
          {description && (
            <Text variant="bodyLarge" className="stx-process-description">
              {description}
            </Text>
          )}
        </div>
        <div className="stx-process-content">
          <Text variant="bodyMedium" className="stx-process-placeholder">
            Process section - {variant} variant coming soon
          </Text>
        </div>
      </Container>
    </Section>
  );
}
