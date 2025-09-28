'use client';

import React from 'react';
import { Text } from '@/components/atoms/Text';
import { ClassComposer } from '@/lib/classComposition';

interface FeatureItem {
  icon: string;
  heading: string;
  text: string;
  list?: string[];
  link?: {
    text: string;
    href: string;
  };
}

interface FeaturesSectionProps {
  pageType?: 'homepage' | 'about' | 'service' | 'solution' | 'legal' | 'prototype';
  variant?: 'default' | 'grid' | 'list' | 'cards';
  title?: string;
  subtitle?: string;
  description?: string;
  features?: FeatureItem[]; // Make optional
  showLinks?: boolean;
  className?: string;
  abTest?: { experimentId: string; variant: string };
}

export function FeaturesSection({
  pageType = 'homepage',
  variant = 'grid',
  title = 'Our Core Services for European Businesses',
  subtitle = 'Transform your business with our comprehensive suite of AI-powered development services. Each solution is tailored to meet the unique needs of European Union markets.',
  description = 'We offer a wide range of services to help your business grow and succeed.',
  features,
  showLinks = true,
  abTest
}: FeaturesSectionProps) {
  // Defensive programming: ensure features is always an array
  const safeFeatures = features || [];
  
  // Generate classes using composition engine
  const composer = new ClassComposer(pageType);
  const classSet = composer.compose({
    pageType,
    section: 'features',
    variant,
    theme: 'light', // Default theme
    abTest,
    customClasses: []
  });

  // const featuresClasses = [classSet.container, className].filter(Boolean).join(' '); // Removed unused variable

  const renderFeature = (feature: FeatureItem, index: number) => {
    return (
      <div
        key={index}
        className={classSet.elements['item']}
        data-testid="stx-feature-item"
      >
        <div className={classSet.elements['itemHeader']}>
          <div
            className={classSet.elements['icon']}
            data-testid="stx-feature-icon"
          >
            {feature.icon}
          </div>
          <Text
            variant="h3"
            className={classSet.elements['heading']}
            data-testid="stx-feature-heading"
          >
            {feature.heading}
          </Text>
        </div>

        <Text
          variant="bodyMedium"
          className={classSet.elements['text']}
          data-testid="stx-feature-text"
        >
          {feature.text}
        </Text>

        {feature.list && feature.list.length > 0 && (
          <ul
            className={classSet.elements['list']}
            data-testid="stx-feature-list"
          >
            {feature.list.map((listItem, listIndex) => (
              <li key={listIndex}>
                <span className={classSet.elements['checkIcon']}>✅</span> {listItem}
              </li>
            ))}
          </ul>
        )}

        {showLinks && feature.link && (
          <a
            href={feature.link.href}
            className={classSet.elements['link']}
            data-testid="stx-feature-link"
          >
            {feature.link.text}
          </a>
        )}
      </div>
    );
  };

  return (
    <section className="stx-features-section">
      {(title || subtitle || description) && (
        <div className={classSet.elements['header']}>
          {title && (
            <h2
              className={classSet.elements['title']}
              data-testid="stx-features-title"
            >
              {title}
            </h2>
          )}
          {subtitle && (
            <p
              className={classSet.elements['subtitle']}
              data-testid="stx-features-subtitle"
            >
              {subtitle}
            </p>
          )}
          {description && (
            <p
              className={classSet.elements['description'] || classSet.elements['subtitle']}
              data-testid="stx-features-description"
            >
              {description}
            </p>
          )}
        </div>
      )}
      <div
        className={classSet.elements['grid']}
        data-testid="stx-features-grid"
      >
        {safeFeatures.length > 0 ? (
          safeFeatures.map((feature, index) => renderFeature(feature, index))
        ) : (
          <div className="stx-features__no-data">
            <p>No features available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}
