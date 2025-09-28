'use client';

import React from 'react';
import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';
import { ClassComposer } from '@/lib/classComposition';
import { FormSection } from './FormSection';



interface MetricItem {
  number: string;
  label: string;
}

interface TrustBadge {
  icon: string;
  text: string;
}

interface HeroSectionProps {
  pageType: 'homepage' | 'about' | 'service' | 'solution' | 'legal' | 'prototype';
  variant?: 'default';
  title: string;
  subtitle?: string;
  highlight?: string;
  badge?: string;
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
  icon?: string;
  showTrustIndicators?: boolean;
  trustBadges?: TrustBadge[];
  showMetrics?: boolean;
  metrics?: MetricItem[];
  showStats?: boolean;
  stats?: MetricItem[];
  showPrototypeInterface?: boolean;
  className?: string;
  abTest?: { experimentId: string; variant: string };
}

export function HeroSection({
  pageType,
  variant = 'default',
  title,
  subtitle,
  highlight,
  badge,
  primaryAction,
  secondaryAction,
  icon,
  showTrustIndicators = false,
  trustBadges = [],
  showMetrics = false,
  metrics = [],
  showStats = false,
  stats = [],
  showPrototypeInterface = false,
  className = '',
  abTest
}: HeroSectionProps) {
  // Generate classes using composition engine
  const composer = new ClassComposer(pageType);
  const classSet = composer.compose({
    pageType,
    section: 'hero',
    variant,
    theme: 'light', // Default theme
    abTest,
    customClasses: []
  });

  const heroClasses = [classSet.container, className].filter(Boolean).join(' ');

  // Parse title with highlight for homepage
  const renderTitle = () => {
    if (pageType === 'homepage' && highlight) {
      const parts = title.split(highlight);
      return (
        <>
          {parts[0]}
          <span className={classSet.elements['highlight']}>{highlight}</span>
          {parts[1]}
        </>
      );
    }
    return title;
  };

  // Render trust indicators for homepage
  const renderTrustIndicators = () => {
    if (!showTrustIndicators || !trustBadges.length) return null;

    return (
      <div className={classSet.elements['trustIndicators']} data-testid="stx-trust-indicators">
        {trustBadges.map((badge, index) => (
          <div key={index} className={classSet.elements['trustBadge']}>
            <span className={classSet.elements['trustIcon']}>{badge.icon}</span>
            <span>{badge.text}</span>
          </div>
        ))}
      </div>
    );
  };

  // Render metrics for about page
  const renderMetrics = () => {
    if (!showMetrics || !metrics.length) return null;

    return (
      <div className={classSet.elements['metrics']} data-testid="stx-metrics">
        {metrics.map((metric, index) => (
          <div key={index} className={classSet.elements['metricsItem']}>
            <div className={classSet.elements['metricsNumber']}>{metric.number}</div>
            <div className={classSet.elements['metricsLabel']}>{metric.label}</div>
          </div>
        ))}
      </div>
    );
  };

  // Render stats for solution page
  const renderStats = () => {
    if (!showStats || !stats.length) return null;

    return (
      <div className={classSet.elements['stats']} data-testid="stx-stats">
        {stats.map((stat, index) => (
          <div key={index} className={classSet.elements['statItem']}>
            <span
              className={classSet.elements['statNumber']}
              data-target={stat.number.replace(/[^\d]/g, '')}
              data-suffix={stat.number.replace(/\d/g, '')}
            >
              {stat.number}
            </span>
            <span className={classSet.elements['statLabel']}>{stat.label}</span>
          </div>
        ))}
      </div>
    );
  };

  // Render prototype interface for homepage
  const renderPrototypeInterface = () => {
    if (!showPrototypeInterface) return null;

    return (
      <div className={classSet.elements['prototypeInterface']} data-testid="stx-prototype-interface">
        <FormSection
          pageType={pageType}
          variant="prototype"
          title="Get Your Free Prototype"
          subtitle="No commitment required • Delivered within 24-48 hours"
          showVoiceRecording={true}
          showFileUpload={true}
          placeholder="💡 Describe your idea - Tell us about your idea in a way you explain it to your friend:
• What do you want
• What problem are you solving
• How is this problem currently being solved
• What do you want to automate or improve
• What results do you expect
• Any additional details..."
          submitButtonText="🚀 Get Prototype in 24 Hours"
        />
      </div>
    );
  };

  // Render action buttons
  const renderActions = () => {
    if (!primaryAction && !secondaryAction) return null;

    return (
      <div className={classSet.elements['cta']} data-testid="stx-hero-actions">
        {primaryAction && (
          primaryAction.href ? (
            <Button
              variant="primary"
              size="lg"
              className={classSet.elements['btnPrimary'] || ''}
              asChild
            >
              <a href={primaryAction.href} onClick={primaryAction.onClick}>
                {primaryAction.text}
              </a>
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              className={classSet.elements['btnPrimary'] || ''}
              onClick={primaryAction.onClick}
            >
              {primaryAction.text}
            </Button>
          )
        )}
        {secondaryAction && (
          secondaryAction.href ? (
            <Button
              variant="secondary"
              size="lg"
              className={classSet.elements['btnSecondary'] || ''}
              asChild
            >
              <a href={secondaryAction.href} onClick={secondaryAction.onClick}>
                {secondaryAction.text}
              </a>
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="lg"
              className={classSet.elements['btnSecondary'] || ''}
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.text}
            </Button>
          )
        )}
      </div>
    );
  };

  return (
    <section className={heroClasses} data-testid="stx-hero-section">
      <div className={classSet.elements['container']}>
        <div className={classSet.elements['content']}>
          {/* Badge for solution pages */}
          {badge && (
            <span className={classSet.elements['badge']} data-testid="stx-hero-badge">
              {badge}
            </span>
          )}
          {/* Icon for service pages */}
          {icon && (
            <div className={classSet.elements['icon']} data-testid="stx-hero-icon">
              {icon}
            </div>
          )}
          {/* Main title */}
          <Text
            variant="h1"
            className={classSet.elements['title']}
            data-testid="stx-hero-title"
          >
            {renderTitle()}
          </Text>
          {/* Subtitle */}
          {subtitle && (
            <Text
              variant="bodyLarge"
              className={classSet.elements['subtitle']}
              data-testid="stx-hero-subtitle"
            >
              {subtitle}
            </Text>
          )}
          {/* Trust indicators for homepage */}
          {renderTrustIndicators()}
          {/* Action buttons */}
          {renderActions()}
          {/* Metrics for about page */}
          {renderMetrics()}
          {/* Stats for solution page */}
          {renderStats()}
        </div>
        {/* Prototype interface for homepage */}
        {renderPrototypeInterface()}
      </div>
    </section>
  );
}
