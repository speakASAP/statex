'use client';

import React from 'react';
import { Text } from '@/components/atoms/Text';
import { Container, Section } from '@/components/atoms';

interface ContactFormProps {
  variant?: 'default' | 'compact' | 'minimal' | 'expanded';
  title?: string;
  description?: string;
  fields?: Array<{
    name: string;
    label: string;
    type: 'text' | 'email' | 'tel' | 'textarea';
    required?: boolean;
  }>;
  submitText?: string;
  className?: string;
  priority?: 'high' | 'medium' | 'low';
  aiOptimized?: boolean;
  abTest?: {
    experimentId: string;
    variant: string;
  };
  onSubmit?: (data: any) => void;
  onLoad?: () => void;
  onError?: (error: any) => void;
}

export function ContactForm({
  variant = 'default',
  title = 'Get In Touch',
  description = 'Ready to start your project? Let\'s talk!'
}: ContactFormProps) {
  // Generate BEM classes using bulletproof system
  // Remove all unused class variables

  return (
    <Section spacing="lg" background="default">
      <Container size="lg">
        <div className="stx-contact-form-header">
          <Text variant="h2" className="stx-contact-form-title">
            {title}
          </Text>
          {description && (
            <Text variant="bodyLarge" className="stx-contact-form-description">
              {description}
            </Text>
          )}
        </div>
        <div className="stx-contact-form-content">
          <div className="stx-contact-form-placeholder">
            Contact form - {variant} variant coming soon
          </div>
        </div>
      </Container>
    </Section>
  );
}
