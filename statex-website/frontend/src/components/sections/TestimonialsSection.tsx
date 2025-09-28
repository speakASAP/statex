'use client';

import React from 'react';
import { ClassComposer } from '@/lib/classComposition';



interface TestimonialItem {
  quote: string;
  author: {
    name: string;
    role: string;
    company: string;
    avatar?: string;
  };
}

interface TestimonialsSectionProps {
  pageType?: 'homepage' | 'about' | 'service' | 'solution' | 'legal' | 'prototype';
  variant?: 'default' | 'grid' | 'carousel' | 'cards';
  title?: string;
  subtitle?: string;
  description?: string;
  testimonials?: TestimonialItem[]; // Make optional
  className?: string;
  abTest?: { experimentId: string; variant: string };
}

function TestimonialsSection({
  pageType = 'homepage',
  variant = 'default',
  title = 'What Our Clients Say',
  subtitle,
  description,
  testimonials,
  abTest
}: TestimonialsSectionProps) {
  // Defensive programming: ensure testimonials is always an array
  const safeTestimonials = testimonials || [];
  
  // Generate classes using composition engine
  const composer = new ClassComposer(pageType);
  const classSet = composer.compose({
    pageType,
    section: 'testimonials',
    variant,
    theme: 'light',
    abTest,
    customClasses: []
  });

  const renderTestimonial = (testimonial: TestimonialItem, index: number) => {
    return (
      <div
        key={index}
        className={classSet.elements['item']}
        data-testid="stx-testimonial-item"
      >
        <div
          className={classSet.elements['quote'] || 'stx-testimonials__quote'}
          data-testid="stx-testimonial-quote"
        >
          "{testimonial.quote}"
        </div>

        <div
          className={classSet.elements['author'] || 'stx-testimonials__author'}
          data-testid="stx-testimonial-author"
        >
                      <div className={classSet.elements['authorInfo'] || 'stx-testimonials__author-info'}>
            <div
              className={classSet.elements['name'] || 'stx-testimonials__name'}
              data-testid="stx-testimonial-name"
            >
              {testimonial.author.name}
            </div>
            <div
              className={classSet.elements['role'] || 'stx-testimonials__role'}
              data-testid="stx-testimonial-role"
            >
              {testimonial.author.role}
            </div>
            <div
              className={classSet.elements['company'] || 'stx-testimonials__company'}
              data-testid="stx-testimonial-company"
            >
              {testimonial.author.company}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="stx-testimonials-section">
      {(title || subtitle || description) && (
        <div className={classSet.elements['header']}>
          {title && (
            <h2
                              className={classSet.elements['title']}
              data-testid="stx-testimonials-title"
            >
              {title}
            </h2>
          )}
                      {subtitle && (
              <p
                className={classSet.elements['subtitle']}
                data-testid="stx-testimonials-subtitle"
              >
                {subtitle}
              </p>
            )}
                      {description && (
              <p
                className={classSet.elements['subtitle']}
                data-testid="stx-testimonials-description"
              >
                {description}
              </p>
            )}
        </div>
      )}
              <div
          className={classSet.elements['items']}
          data-testid="stx-testimonials-items"
        >
          {safeTestimonials.length > 0 ? (
            safeTestimonials.map((testimonial, index) => renderTestimonial(testimonial, index))
          ) : (
            <div className="stx-testimonials__no-data">
              <p>No testimonials available at the moment.</p>
            </div>
          )}
        </div>
    </section>
  );
}

export default TestimonialsSection;
export { TestimonialsSection };
