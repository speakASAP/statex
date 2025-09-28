'use client';

import React, { useState, useEffect, useRef } from 'react';
import { HeroSpacer } from '@/components/atoms';

export default function SystemModernizationPage() {
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
          <div className="stx-service-hero__icon">🔄</div>
          <h1 className="stx-service-hero__title">System Modernization Services</h1>
          <p className="stx-service-hero__subtitle">Transform outdated systems into modern, scalable solutions without disrupting your business operations. Seamlessly migrate to cloud platforms and integrate with contemporary technologies.</p>
          <div className="stx-service-hero__cta">
            <a href="#contact" className="stx-service-hero__btn--primary">Get Your Free Assessment</a>
            <a href="#features" className="stx-service-hero__btn--secondary">Learn More</a>
          </div>
        </div>
      </section>

      {/* Service Overview */}
      <section className="stx-service-overview">
        <div className="stx-service-page-container">
          <div className="stx-service-overview__grid">
            <div className="stx-service-overview__content">
              <h2>Complete IT Modernization Services That Transform Legacy Systems</h2>
              <p>Don't let legacy systems hold back your business growth. Our expert team specializes in seamless migration and modernization of outdated IT infrastructure, ensuring minimal disruption while delivering maximum performance improvements and future-ready scalability.</p>

              <p>We help European businesses break free from outdated technology constraints through strategic system modernization. Our comprehensive approach ensures seamless transitions from legacy platforms to modern, cloud-native solutions that drive business growth and operational efficiency.</p>

              <p>Our modernization approach focuses on business continuity, ensuring your operations continue smoothly throughout the transformation process while delivering immediate performance improvements and long-term strategic advantages.</p>
            </div>

            <div className="stx-service-overview__highlights">
              <h3 className="stx-service-overview__highlights-title">Service Highlights</h3>
              <ul className="stx-service-overview__highlights-list">
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Legacy Application Modernization</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Database Migration & Optimization</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Cloud Migration & Infrastructure</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> API Integration & Modernization</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Platform Migration</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Security Enhancement</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Business Continuity</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Zero Downtime Migration</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Using stx-values classes (same as Core Values) */}
      <section className="stx-values" id="features">
        <div className="stx-service-page-container">
          <div className="stx-section-header">
            <h2 className="stx-section-title">Comprehensive Modernization Features</h2>
            <p className="stx-section-subtitle">Everything you need to transform legacy systems into competitive advantages.</p>
          </div>

          <div className="stx-values__grid">
            <div className="stx-values__card">
              <div className="stx-values__icon">⚡</div>
              <h3 className="stx-values__card-title">Dramatic Performance Improvements</h3>
              <p className="stx-values__card-description">Achieve 300-500% performance improvements through modern architectures, optimized databases, and cloud-native technologies.</p>
            </div>

            <div className="stx-values__card">
              <div className="stx-values__icon">💰</div>
              <h3 className="stx-values__card-title">Reduced Maintenance Costs</h3>
              <p className="stx-values__card-description">Cut IT maintenance expenses by 40-60% by eliminating expensive legacy system support and outdated licensing fees.</p>
            </div>

            <div className="stx-values__card">
              <div className="stx-values__icon">🔒</div>
              <h3 className="stx-values__card-title">Enhanced Security & Compliance</h3>
              <p className="stx-values__card-description">Implement modern security standards, encryption protocols, and GDPR compliance features that protect business data.</p>
            </div>

            <div className="stx-values__card">
              <div className="stx-values__card-title">Improved Scalability</div>
              <p className="stx-values__card-description">Modern systems scale effortlessly with business growth, supporting increased users, data volumes, and transaction loads.</p>
            </div>

            <div className="stx-values__card">
              <div className="stx-values__icon">🔗</div>
              <h3 className="stx-values__card-title">Better Integration Capabilities</h3>
              <p className="stx-values__card-description">Connect modernized systems with current business tools, third-party services, and emerging technologies.</p>
            </div>

            <div className="stx-values__card">
              <div className="stx-values__icon">🚀</div>
              <h3 className="stx-values__card-title">Future-Ready Architecture</h3>
              <p className="stx-values__card-description">Build technology foundations that adapt to changing business needs and integrate easily with new innovations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="stx-process">
        <div className="stx-service-page-container">
          <div className="stx-section-header">
            <h2 className="stx-section-title">Our Modernization Process</h2>
            <p className="stx-section-subtitle">A proven methodology that ensures successful system transformation with minimal disruption.</p>
          </div>

          <div className="stx-process__steps">
            <div className="stx-process__step">
              <div className="stx-process__number">1</div>
              <h3 className="stx-process__title">Comprehensive System Assessment</h3>
              <p className="stx-process__description">We begin with detailed analysis of your existing IT infrastructure using automated assessment tools and expert evaluation.</p>
            </div>

            <div className="stx-process__step">
              <div className="stx-process__number">2</div>
              <h3 className="stx-process__title">Strategic Modernization Roadmap</h3>
              <p className="stx-process__description">Create detailed transformation plans that prioritize business-critical systems and minimize operational disruption.</p>
            </div>

            <div className="stx-process__step">
              <div className="stx-process__number">3</div>
              <h3 className="stx-process__title">Phased Implementation</h3>
              <p className="stx-process__description">Execute modernization in carefully planned phases that maintain business continuity and ensure consistent results.</p>
            </div>

            <div className="stx-process__step">
              <div className="stx-process__number">4</div>
              <h3 className="stx-process__title">User Training & Support</h3>
              <p className="stx-process__description">Comprehensive training programs help teams adapt to modernized systems quickly and maximize productivity.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Using same structure as prototype page */}
      <section className="stx-faq">
        <div className="stx-service-page-container">
          <div className="stx-section-header">
            <h2 className="stx-section-title">Frequently Asked Questions</h2>
            <p className="stx-section-subtitle">Get answers to common questions about our system modernization services.</p>
          </div>

          <div className="stx-faq-container">
            <div className="stx-faq-item">
              <button className="stx-faq-question">
                How long does system modernization typically take?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>Modernization timelines vary by system complexity and scope. Simple migrations can take 4-8 weeks, while comprehensive enterprise modernization may require 6-12 months. We provide detailed timelines during the assessment phase.</p>
              </div>
            </div>

            <div className="stx-faq-item">
              <button className="stx-faq-question">
                Will modernization disrupt our business operations?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>No, our modernization approach prioritizes business continuity. We use phased implementation strategies, comprehensive testing, and backup procedures to ensure zero downtime and minimal disruption to your operations.</p>
              </div>
            </div>

            <div className="stx-faq-item">
              <button className="stx-faq-question">
                Can you modernize our legacy applications?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>Yes, we specialize in modernizing legacy applications of all types. Our team has experience with COBOL, Java, .NET, and other legacy technologies, transforming them into modern, scalable solutions.</p>
              </div>
            </div>

            <div className="stx-faq-item">
              <button className="stx-faq-question">
                What about data migration and security?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>We ensure 100% data integrity during migration with comprehensive validation procedures. All modernized systems include enhanced security features, encryption, and GDPR compliance to protect your business data.</p>
              </div>
            </div>

            <div className="stx-faq-item">
              <button className="stx-faq-question">
                Do you provide ongoing support after modernization?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>Yes, we provide comprehensive post-modernization support including system monitoring, performance optimization, user training, and technical assistance to ensure your modernized systems continue performing optimally.</p>
              </div>
            </div>

            <div className="stx-faq-item">
              <button className="stx-faq-question">
                Can you help with cloud migration?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>Absolutely! We specialize in cloud migration to AWS, Google Cloud, and Microsoft Azure. Our experts handle infrastructure setup, application migration, and optimization to ensure maximum performance and cost efficiency.</p>
              </div>
            </div>

            <div className="stx-faq-item">
              <button className="stx-faq-question">
                What are the cost benefits of modernization?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>Modernization typically reduces IT maintenance costs by 40-60%, improves operational efficiency by 300-500%, and eliminates expensive legacy system licensing fees while providing better scalability and security.</p>
              </div>
            </div>

            <div className="stx-faq-item">
              <button className="stx-faq-question">
                How do you ensure compatibility with existing systems?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>We conduct thorough compatibility analysis and create integration layers to ensure modernized systems work seamlessly with your existing technology stack. Our approach preserves critical business functionality while upgrading technology.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="stx-service-cta" id="contact">
        <div className="stx-service-page-container">
          <div className="stx-service-cta__content">
            <h2 className="stx-service-cta__title">Ready to Modernize Your Systems?</h2>
            <p className="stx-service-cta__description">Get a free assessment and prototype to see how we can transform your legacy systems into modern, scalable solutions.</p>
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
