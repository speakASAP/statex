'use client';

import React from 'react';
import { Text } from '@/components/atoms/Text';
import { Container, Section } from '@/components/atoms';

// Dynamic class generation function
export const getFeaturesClasses = (props: {
  variant?: 'grid' | 'list' | 'cards' | 'timeline';
  priority?: 'high' | 'medium' | 'low';
  aiOptimized?: boolean;
  className?: string;
}) => {
  const classes: string[] = ['stx-features'];

  // Add variant class - handle invalid variants by defaulting to grid
  const validVariants = ['grid', 'list', 'cards', 'timeline'];
  const variant = validVariants.includes(props.variant || '') ? props.variant : 'grid';
  classes.push(`stx-features-${variant}`);

  // Add priority class
  if (props.priority) {
    classes.push(`stx-features-priority-${props.priority}`);
  }

  // Add AI optimization class
  if (props.aiOptimized) {
    classes.push('stx-features-ai-optimized');
  }

  // Add custom className if provided
  if (props.className) {
    classes.push(props.className);
  }

  return {
    container: classes.join(' '),
    title: 'stx-features__title',
    description: 'stx-features__description',
    grid: 'stx-features__grid',
    item: 'stx-features__item',
    icon: 'stx-features__icon',
    heading: 'stx-features__heading',
    text: 'stx-features__text'
  };
};

interface FeaturesProps {
  variant?: 'grid' | 'list' | 'cards' | 'timeline';
  title?: string;
  description?: string;
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

export function Features({
  variant = 'grid',
  title = 'Key Features',
  description = 'Discover what makes our platform unique',
  className = '',
  priority = 'medium',
  aiOptimized = false
}: FeaturesProps) {
  const classes = getFeaturesClasses({ variant, priority, aiOptimized, className });

  return (
    <Section spacing="lg" background="default">
      <Container size="lg">
        <div className="stx-features-header">
          <Text variant="h2" className={classes.title}>
            {title}
          </Text>
          {description && (
            <Text variant="bodyLarge" className={classes.description}>
              {description}
            </Text>
          )}
        </div>
        <div className="stx-features-content">
          <Text variant="bodyMedium" className="stx-features-placeholder">
            Features section - {variant} variant coming soon
          </Text>
        </div>
      </Container>
    </Section>
  );
}
