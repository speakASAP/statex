'use client';

import React from 'react';
import { Text } from '../../atoms/Text';
import { Container, Section } from '../../atoms';

// Dynamic class generation function
export const getTestimonialsClasses = (props: {
  variant?: 'default' | 'carousel' | 'grid' | 'featured' | 'list';
  priority?: 'high' | 'medium' | 'low';
  aiOptimized?: boolean;
  abTest?: boolean;
  className?: string;
}) => {
  const classes: string[] = ['stx-testimonials'];

  // Add variant class - default should be 'carousel' not 'default'
  const variant = props.variant === 'default' ? 'carousel' : props.variant || 'carousel';
  classes.push(`stx-testimonials-${variant}`);

  // Add priority class
  if (props.priority) {
    classes.push(`stx-testimonials-priority-${props.priority}`);
  }

  // Add AI optimization class
  if (props.aiOptimized) {
    classes.push('stx-testimonials-ai-optimized');
  }

  // Add AB test class
  if (props.abTest) {
    classes.push('stx-testimonials-ab-test');
  }

  // Add custom className if provided
  if (props.className) {
    classes.push(props.className);
  }

  return classes.join(' ');
};

interface TestimonialsProps {
  variant?: 'default' | 'carousel' | 'grid' | 'featured' | 'list';
  title?: string;
  description?: string;
  testimonials?: Array<{
    quote: string;
    author: string;
    role: string;
    company: string;
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

export function Testimonials({
  title = 'What Our Clients Say',
  description = 'Hear from businesses that have transformed their ideas into reality',
  testimonials = []
}: TestimonialsProps) {

  return (
    <Section spacing="lg" background="muted">
      <Container size="lg">
        <div className="stx-testimonials-header">
          <Text variant="h2" className="stx-testimonials-title">
            {title}
          </Text>
          {description && (
            <Text variant="bodyLarge" className="stx-testimonials-description">
              {description}
            </Text>
          )}
        </div>
        <div className="stx-testimonials-content">
          {testimonials.length > 0 ? (
            <div className="stx-testimonials-items">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="stx-testimonials-item">
                  <blockquote className="stx-testimonials-quote">
                    <Text variant="bodyLarge">
                      "{testimonial.quote}"
                    </Text>
                  </blockquote>
                  <div className="stx-testimonials-author">
                    <div className="stx-testimonials-author-info">
                      <Text variant="bodyMedium" className="stx-testimonials-name">
                        {testimonial.author}
                      </Text>
                      <Text variant="bodySmall" className="stx-testimonials-role">
                        {testimonial.role}
                      </Text>
                      <Text variant="bodySmall" className="stx-testimonials-company">
                        {testimonial.company}
                      </Text>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Text variant="bodyMedium">No testimonials available.</Text>
          )}
        </div>
      </Container>
    </Section>
  );
}
