'use client';

import React from 'react';
import { Text } from '../../atoms/Text';
import { Button } from '../../atoms/Button';
import { Container } from '../../atoms/Container';

// Dynamic class generation function
export const getPricingClasses = (props: {
  variant?: 'default' | 'cards' | 'table' | 'comparison';
  priority?: 'high' | 'medium' | 'low';
  aiOptimized?: boolean;
  abTest?: boolean;
  className?: string;
}) => {
  const classes: string[] = ['stx-pricing'];

  // Add variant class - default should be 'cards' not 'default'
  const variant = props.variant === 'default' ? 'cards' : props.variant || 'cards';
  classes.push(`stx-pricing-${variant}`);

  // Add priority class
  if (props.priority) {
    classes.push(`stx-pricing-priority-${props.priority}`);
  }

  // Add AI optimization class
  if (props.aiOptimized) {
    classes.push('stx-pricing-ai-optimized');
  }

  // Add AB test class
  if (props.abTest) {
    classes.push('stx-pricing-ab-test');
  }

  // Add custom className if provided
  if (props.className) {
    classes.push(props.className);
  }

  return classes.join(' ');
};

interface PricingProps {
  variant?: 'default' | 'cards' | 'table' | 'comparison';
  title?: string;
  description?: string;
  plans?: Array<{
    name: string;
    price: string;
    period?: string;
    features: string[];
    ctaText?: string;
    ctaLink?: string;
    featured?: boolean;
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

export function Pricing({
  variant = 'default',
  title = 'Pricing Plans',
  description = 'Choose the perfect plan for your needs',
  plans = [],
  className = '',
  priority = 'medium',
  aiOptimized = false,
  abTest
}: PricingProps) {
  const pricingClasses = getPricingClasses({
    variant,
    priority,
    aiOptimized,
    abTest: !!abTest,
    className
  });

  // Get the actual variant for placeholder text
  const actualVariant = variant === 'default' ? 'cards' : variant;

  return (
    <section
      className={pricingClasses}
      data-section-type="pricing"
      data-section-variant={variant}
      data-section-priority={priority}
      data-ai-optimized={aiOptimized}
      data-ab-test={abTest?.experimentId}
    >
      <Container size="80vw">
        <div className="stx-pricing-header">
          <Text variant="h2" className="stx-pricing-title">
            {title}
          </Text>
          {description && (
            <Text variant="bodyLarge" className="stx-pricing-description">
              {description}
            </Text>
          )}
        </div>
        <div className="stx-pricing-content">
          {plans.length > 0 ? (
            <div className="stx-pricing-plans">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className={`stx-pricing-plan ${plan.featured ? 'stx-pricing-plan--featured' : ''}`}
                >
                  <div className="stx-pricing-plan-header">
                    <Text variant="h3" className="stx-pricing-plan-name">
                      {plan.name}
                    </Text>
                    <div className="stx-pricing-plan-price">
                      <Text variant="h2">{plan.price}</Text>
                      {plan.period && (
                        <Text variant="bodySmall">/{plan.period}</Text>
                      )}
                    </div>
                  </div>
                  <ul className="stx-pricing-plan-features">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="stx-pricing-plan-feature">
                        <Text variant="bodyMedium">{feature}</Text>
                      </li>
                    ))}
                  </ul>
                  {plan.ctaText && (
                    <div className="stx-pricing-plan-button">
                      <Button variant="primary" asChild>
                        <a href={plan.ctaLink}>
                          {plan.ctaText}
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="stx-pricing-placeholder">
              <Text variant="bodyMedium">
                {actualVariant === 'table'
                  ? 'Pricing section - table variant coming soon'
                  : actualVariant === 'comparison'
                    ? 'Pricing section - comparison variant coming soon'
                    : 'Pricing section - cards variant coming soon'
                }
              </Text>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
