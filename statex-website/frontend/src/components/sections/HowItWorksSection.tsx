'use client';

import React from 'react';

interface HowItWorksStep {
  number: string;
  title: string;
  description: string;
}

interface HowItWorksSectionProps {
  title?: string;
  subtitle?: string;
  steps?: HowItWorksStep[]; // Make optional
  className?: string;
}

export function HowItWorksSection({
  title = 'How It Works',
  subtitle,
  steps
}: HowItWorksSectionProps) {
  // Defensive programming: ensure steps is always an array
  const safeSteps = steps || [];
  
  // const sectionClasses = ['stx-how-it-works', className].filter(Boolean).join(' '); // Removed unused variable

  return (
    <section className="stx-how-it-works-section">
      <div className="stx-section-container">
        <div className="stx-section-header">
          <h2 className="stx-section-title">{title}</h2>
          {subtitle && (
            <p className="stx-section-subtitle">{subtitle}</p>
          )}
        </div>

        <div className="stx-how-it-works__steps">
          {safeSteps.length > 0 ? (
            safeSteps.map((step, index) => (
              <div key={index} className="stx-how-it-works__step" data-testid="stx-how-it-works-step">
                <div className="stx-how-it-works__number">{step.number}</div>
                <h3 className="stx-how-it-works__title">{step.title}</h3>
                <p className="stx-how-it-works__description">{step.description}</p>
              </div>
            ))
          ) : (
            <div className="stx-how-it-works__no-data">
              <p>No steps available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
