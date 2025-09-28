'use client';

import React, { useState, useEffect, useRef } from 'react';
import { HeroSpacer } from '@/components/atoms';

export default function DigitalTransformationPage() {
  // State for animated counters
  const [countersAnimated, setCountersAnimated] = useState(false);
  const heroStatsRef = useRef<HTMLDivElement>(null);

  // Counter animation function
  const animateCounter = (element: HTMLElement, target: number, suffix: string, duration = 2000) => {
    let current = 0;
    const increment = target / (duration / 16);

    element.classList.add('counting');

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
        element.classList.remove('counting');
      }
      element.textContent = Math.floor(current) + suffix;
    }, 16);
  };

  // Initialize counter animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          setCountersAnimated(true);

          setTimeout(() => {
            const statNumbers = entry.target.querySelectorAll('.stx-service-hero__stat-number[data-target]');

            statNumbers.forEach((stat, index) => {
              const target = parseInt(stat.getAttribute('data-target') || '0');
              const suffix = stat.getAttribute('data-suffix') || '';

              stat.textContent = '0' + suffix;

              const delay = index * 150;
              setTimeout(() => {
                animateCounter(stat as HTMLElement, target, suffix, 800);
              }, delay);
            });
          }, 200);
        }
      });
    }, { threshold: 0.3 });

    if (heroStatsRef.current) {
      observer.observe(heroStatsRef.current);
    }

    return () => observer.disconnect();
  }, [countersAnimated]);

  return (
    <div className="stx-page">
      <HeroSpacer />
      {/* Service Hero Section */}
      <section className="stx-service-hero">
        <div className="stx-service-hero__container">
          <div className="stx-service-hero__icon">🚀</div>
          <h1 className="stx-service-hero__title">Digital Transformation Services</h1>
          <p className="stx-service-hero__subtitle">Modernize your business for the digital age with comprehensive transformation services. We help organizations modernize their technology, processes, and culture for sustainable growth.</p>
          <div className="stx-service-hero__cta">
            <a href="#contact" className="stx-service-hero__btn--primary">Start Your Transformation</a>
            <a href="#features" className="stx-service-hero__btn--secondary">Get Assessment</a>
          </div>
        </div>
      </section>

      {/* Service Overview */}
      <section className="stx-service-overview">
        <div className="stx-service-page-container">
          <div className="stx-service-overview__grid">
            <div className="stx-service-overview__content">
              <h2>Comprehensive Digital Transformation for Modern Business</h2>
              <p>Transform your business operations with end-to-end digital transformation services designed for European markets. Our experts guide you through every step of your transformation journey, from initial assessment to full implementation and ongoing optimization.</p>

              <p>We help organizations modernize their technology, processes, and culture for the digital age. Our comprehensive approach ensures successful transformation with minimal disruption while delivering maximum business value and competitive advantage.</p>

              <p>From cloud migration to process optimization, our digital transformation services are tailored to your specific business needs and industry requirements, ensuring sustainable growth and long-term success.</p>
            </div>

            <div className="stx-service-overview__highlights">
              <h3 className="stx-service-overview__highlights-title">Service Highlights</h3>
              <ul className="stx-service-overview__highlights-list">
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Digital Strategy & Assessment</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Cloud Migration & Infrastructure</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Process Optimization</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Change Management</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Technology Implementation</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Data Analytics & Insights</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Continuous Improvement</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Training & Support</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Using stx-values classes (same as Core Values) */}
      <section className="stx-values" id="features">
        <div className="stx-service-page-container">
          <div className="stx-section-header">
            <h2 className="stx-section-title">Benefits of Digital Transformation</h2>
            <p className="stx-section-subtitle">Everything you need to modernize your business and drive sustainable growth in the digital economy.</p>
          </div>

          <div className="stx-values__grid">
            <div className="stx-values__card">
              <div className="stx-values__icon">🚀</div>
              <h3 className="stx-values__card-title">Increased Agility</h3>
              <p className="stx-values__card-description">Faster response to market changes and customer needs with flexible, scalable digital solutions.</p>
            </div>

            <div className="stx-values__card">
              <div className="stx-values__icon">💰</div>
              <h3 className="stx-values__card-title">Cost Savings</h3>
              <p className="stx-values__card-description">Reduced operational costs through automation, efficiency improvements, and optimized processes.</p>
            </div>

            <div className="stx-values__card">
              <div className="stx-values__icon">🎯</div>
              <h3 className="stx-values__card-title">Better Customer Experience</h3>
              <p className="stx-values__card-description">Enhanced customer interactions and satisfaction through digital channels and personalized experiences.</p>
            </div>

            <div className="stx-values__card">
              <div className="stx-values__icon">📊</div>
              <h3 className="stx-values__card-title">Data-Driven Insights</h3>
              <p className="stx-values__card-description">Better decision making with real-time analytics, reporting, and business intelligence capabilities.</p>
            </div>

            <div className="stx-values__card">
              <div className="stx-values__icon">🔄</div>
              <h3 className="stx-values__card-title">Process Optimization</h3>
              <p className="stx-values__card-description">Streamlined workflows and improved productivity through digital process automation and optimization.</p>
            </div>

            <div className="stx-values__card">
              <div className="stx-values__icon">🌐</div>
              <h3 className="stx-values__card-title">Global Reach</h3>
              <p className="stx-values__card-description">Expand your market reach with digital capabilities and online presence across European markets.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="stx-process">
        <div className="stx-service-page-container">
          <div className="stx-section-header">
            <h2 className="stx-section-title">Our Digital Transformation Process</h2>
            <p className="stx-section-subtitle">A proven methodology that ensures successful transformation with minimal disruption and maximum business impact.</p>
          </div>

          <div className="stx-process__steps">
            <div className="stx-process__step">
              <div className="stx-process__number">1</div>
              <h3 className="stx-process__title">Assessment & Strategy</h3>
              <p className="stx-process__description">We analyze your current state and create a comprehensive transformation strategy aligned with your business goals.</p>
            </div>

            <div className="stx-process__step">
              <div className="stx-process__number">2</div>
              <h3 className="stx-process__title">Roadmap & Solution Design</h3>
              <p className="stx-process__description">Detailed planning and solution design for your transformation journey with clear milestones and success metrics.</p>
            </div>

            <div className="stx-process__step">
              <div className="stx-process__number">3</div>
              <h3 className="stx-process__title">Implementation & Migration</h3>
              <p className="stx-process__description">Expert implementation of new technologies and processes with minimal disruption to your business operations.</p>
            </div>

            <div className="stx-process__step">
              <div className="stx-process__number">4</div>
              <h3 className="stx-process__title">Change Management</h3>
              <p className="stx-process__description">Supporting your team through the transformation with comprehensive training, guidance, and ongoing support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Using same structure as prototype page */}
      <section className="stx-faq">
        <div className="stx-service-page-container">
          <div className="stx-section-header">
            <h2 className="stx-section-title">Frequently Asked Questions</h2>
            <p className="stx-section-subtitle">Get answers to common questions about our digital transformation services.</p>
          </div>

          <div className="stx-faq-container">
            <div className="stx-faq-item">
              <button className="stx-faq-question">
                How long does digital transformation typically take?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>Digital transformation timelines vary by scope and complexity. Simple transformations take 6-12 months, while comprehensive enterprise transformations may require 18-24 months. We provide detailed timelines during the assessment phase.</p>
              </div>
            </div>

            <div className="stx-faq-item">
              <button className="stx-faq-question">
                What is the ROI of digital transformation?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>Digital transformation typically delivers 20-40% cost savings, 30-50% efficiency improvements, and significant competitive advantages. We provide detailed ROI analysis during the planning phase.</p>
              </div>
            </div>

            <div className="stx-faq-item">
              <button className="stx-faq-question">
                How do you handle change management?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>We provide comprehensive change management including stakeholder communication, training programs, user adoption strategies, and ongoing support to ensure successful transformation.</p>
              </div>
            </div>

            <div className="stx-faq-item">
              <button className="stx-faq-question">
                Can you work with existing systems?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>Yes, we specialize in working with existing systems and can integrate new digital solutions with your current technology stack while preserving critical business functionality.</p>
              </div>
            </div>

            <div className="stx-faq-item">
              <button className="stx-faq-question">
                What industries do you specialize in?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>We have experience across various industries including manufacturing, retail, healthcare, finance, and technology. Our approach is tailored to your specific industry requirements and compliance needs.</p>
              </div>
            </div>

            <div className="stx-faq-item">
              <button className="stx-faq-question">
                Do you provide ongoing support after transformation?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>Yes, we provide comprehensive post-transformation support including system monitoring, performance optimization, continuous improvement, and strategic guidance for long-term success.</p>
              </div>
            </div>

            <div className="stx-faq-item">
              <button className="stx-faq-question">
                How do you ensure data security during transformation?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>We implement enterprise-grade security measures throughout the transformation process, including data encryption, access controls, and compliance with European data protection regulations.</p>
              </div>
            </div>

            <div className="stx-faq-item">
              <button className="stx-faq-question">
                What about cloud migration and infrastructure?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>We provide comprehensive cloud migration services including infrastructure assessment, migration planning, implementation, and optimization for AWS, Google Cloud, and Microsoft Azure.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="stx-service-cta" id="contact">
        <div className="stx-service-page-container">
          <div className="stx-service-cta__content">
            <h2 className="stx-service-cta__title">Ready to Transform Your Business?</h2>
            <p className="stx-service-cta__description">Get a free assessment and discover how we can accelerate your digital transformation journey.</p>
            <div className="stx-service-cta__buttons">
              <a href="/free-prototype" className="stx-service-hero__btn--primary">Get Free Assessment</a>
              <a href="/contact" className="stx-service-hero__btn--secondary">Schedule Consultation</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
