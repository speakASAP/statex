'use client';

import React from 'react';
import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';
import { Container } from '@/components/atoms/Container';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface CTAProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'floating';
  title?: string;
  description?: string;
  primaryAction?: {
    text: string;
    href: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    text: string;
    href: string;
    onClick?: () => void;
  };
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

export function CTA({
  variant = 'primary',
  title = 'Ready to Get Started?',
  description = 'Get your free prototype in 24 hours. No strings attached.',
  primaryAction,
  secondaryAction,
  className = '',
  priority = 'high',
  aiOptimized = false,
  abTest,
  onLoad
}: CTAProps) {
  // Generate BEM classes using bulletproof system
  const baseClass = 'stx-cta';
  const variantClass = `stx-cta-${variant}`;
  const priorityClass = `stx-cta-priority-${priority}`;
  const aiClass = aiOptimized ? 'stx-cta-ai-optimized' : '';
  const abTestClass = abTest ? 'stx-cta-ab-test' : '';

  const ctaClasses = cn(
    baseClass,
    variantClass,
    priorityClass,
    aiClass,
    abTestClass,
    className
  );

  // Call onLoad callback when component mounts
  React.useEffect(() => {
    if (onLoad) {
      onLoad();
    }
  }, [onLoad]);

  return (
    <section
      className={ctaClasses}
      data-section-type="cta"
      data-section-variant={variant}
      data-section-priority={priority}
      data-ai-optimized={aiOptimized}
      data-ab-test={abTest?.experimentId}
    >
      <Container size="xl">
        <div className={variant === 'floating' ? 'stx-cta-floating-content' : 'stx-cta-primary-content'}>
          <Text variant="h2" className={variant === 'floating' ? 'stx-cta-floating-title' : 'stx-cta-primary-title'}>
            {title}
          </Text>
          {description && (
            <Text variant="bodyLarge" className={variant === 'floating' ? 'stx-cta-floating-description' : 'stx-cta-primary-description'}>
              {description}
            </Text>
          )}
          {(primaryAction || secondaryAction) && (
            <div className={variant === 'floating' ? 'stx-cta-floating-actions' : 'stx-cta-primary-actions'}>
              {primaryAction && (
                <Button
                  variant={variant === 'secondary' ? 'outline' : 'primary'}
                  asChild
                >
                  <Link
                    href={primaryAction.href}
                    {...(primaryAction.onClick && { onClick: primaryAction.onClick })}
                  >
                    {primaryAction.text}
                  </Link>
                </Button>
              )}
              {secondaryAction && (
                <Button
                  variant="outline"
                  asChild
                >
                  <Link
                    href={secondaryAction.href}
                    {...(secondaryAction.onClick && { onClick: secondaryAction.onClick })}
                  >
                    {secondaryAction.text}
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
