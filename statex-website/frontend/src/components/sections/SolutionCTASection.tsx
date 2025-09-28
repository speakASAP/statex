'use client';

import React from 'react';

interface SolutionCTASectionProps {
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
}

export function SolutionCTASection({
  title = 'Ready to Transform Your Business?',
  description = 'Start your digital transformation journey today and unlock the full potential of your business operations.',
  primaryAction = {
    text: 'Get Free Assessment',
    href: '/free-prototype'
  },
  secondaryAction = {
    text: 'Schedule Consultation',
    href: '/contact'
  }
}: SolutionCTASectionProps) {
  return (
    <section className="stx-cta">
      <div className="stx-cta__content">
        <h2 className="stx-cta__title">{title}</h2>
        <p className="stx-cta__description">{description}</p>
        <div className="stx-cta__buttons">
          <a
            href={primaryAction.href}
            className="stx-button-cta__primary"
            onClick={primaryAction.onClick}
          >
            {primaryAction.text}
          </a>
          <a
            href={secondaryAction.href}
            className="stx-button-cta__secondary"
            onClick={secondaryAction.onClick}
          >
            {secondaryAction.text}
          </a>
        </div>
      </div>
    </section>
  );
}
