'use client';

import React, { useState, useEffect, useRef } from 'react';
import { HeroSpacer } from '@/components/atoms';

export default function ECommercePage() {
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
          <div className="stx-service-hero__icon">🛒</div>
          <h1 className="stx-service-hero__title">E-Commerce Solutions</h1>
          <p className="stx-service-hero__subtitle">Launch powerful e-commerce platforms optimized for European markets with multi-currency support. Create seamless shopping experiences that drive sales and customer satisfaction.</p>
          <div className="stx-service-hero__cta">
            <a href="#contact" className="stx-service-hero__btn--primary">Get Your Free Prototype</a>
            <a href="#features" className="stx-service-hero__btn--secondary">Learn More</a>
          </div>
        </div>
      </section>

      {/* Service Overview */}
      <section className="stx-service-overview">
        <div className="stx-service-page-container">
          <div className="stx-service-overview__grid">
            <div className="stx-service-overview__content">
              <h2>Powerful E-Commerce Platforms That Drive Sales</h2>
              <p>Transform your business with custom e-commerce solutions designed specifically for European markets. Our platforms combine cutting-edge technology with deep understanding of EU consumer behavior to create shopping experiences that convert visitors into loyal customers.</p>

              <p>We build scalable e-commerce solutions that grow with your business, from simple online stores to complex multi-vendor marketplaces. Every platform is optimized for performance, security, and user experience across all devices and European markets.</p>

              <p>Our e-commerce solutions include comprehensive features like multi-currency support, localized payment gateways, inventory management, and advanced analytics to help you maximize sales and customer satisfaction.</p>
            </div>

            <div className="stx-service-overview__highlights">
              <h3 className="stx-service-overview__highlights-title">Service Highlights</h3>
              <ul className="stx-service-overview__highlights-list">
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Custom Online Stores</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Payment Gateway Integration</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Multi-currency & Multi-language</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Inventory Management Systems</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Order Processing & Fulfillment</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Customer Management & Analytics</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> GDPR Compliance</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Mobile-Optimized Shopping</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Using stx-values classes (same as Core Values) */}
      <section className="stx-values" id="features">
        <div className="stx-service-page-container">
          <div className="stx-section-header">
            <h2 className="stx-section-title">Comprehensive E-Commerce Features</h2>
            <p className="stx-section-subtitle">Everything you need to create successful online stores and drive sales growth.</p>
          </div>

          <div className="stx-values__grid">
            <div className="stx-values__card">
              <div className="stx-values__icon">💳</div>
              <h3 className="stx-values__card-title">Secure Payment Processing</h3>
              <p className="stx-values__card-description">Multiple payment gateways with PCI compliance, fraud protection, and support for all major European payment methods.</p>
            </div>

            <div className="stx-values__card">
              <div className="stx-values__icon">🌍</div>
              <h3 className="stx-values__card-title">Multi-Currency Support</h3>
              <p className="stx-values__card-description">Automatic currency conversion, localized pricing, and support for all EU currencies to reach customers across Europe.</p>
            </div>

            <div className="stx-values__card">
              <div className="stx-values__icon">📱</div>
              <h3 className="stx-values__card-title">Mobile-First Design</h3>
              <p className="stx-values__card-description">Responsive design optimized for mobile shopping with fast loading times and intuitive navigation.</p>
            </div>

            <div className="stx-values__card">
              <div className="stx-values__icon">📊</div>
              <h3 className="stx-values__card-title">Advanced Analytics</h3>
              <p className="stx-values__card-description">Comprehensive reporting and analytics to track sales, customer behavior, and optimize your store performance.</p>
            </div>

            <div className="stx-values__card">
              <div className="stx-values__icon">📦</div>
              <h3 className="stx-values__card-title">Inventory Management</h3>
              <p className="stx-values__card-description">Real-time inventory tracking, automated reordering, and multi-location warehouse management systems.</p>
            </div>

            <div className="stx-values__card">
              <div className="stx-values__icon">🔒</div>
              <h3 className="stx-values__card-title">EU Compliance</h3>
              <p className="stx-values__card-description">GDPR compliance, cookie consent management, and adherence to European e-commerce regulations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="stx-process">
        <div className="stx-service-page-container">
          <div className="stx-section-header">
            <h2 className="stx-section-title">Our E-Commerce Development Process</h2>
            <p className="stx-section-subtitle">A proven methodology that ensures successful online store launch and growth.</p>
          </div>

          <div className="stx-process__steps">
            <div className="stx-process__step">
              <div className="stx-process__number">1</div>
              <h3 className="stx-process__title">Business Analysis & Planning</h3>
              <p className="stx-process__description">We analyze your business model, target market, and requirements to create a comprehensive e-commerce strategy.</p>
            </div>

            <div className="stx-process__step">
              <div className="stx-process__number">2</div>
              <h3 className="stx-process__title">Design & User Experience</h3>
              <p className="stx-process__description">Create intuitive, conversion-optimized designs that provide seamless shopping experiences across all devices.</p>
            </div>

            <div className="stx-process__step">
              <div className="stx-process__number">3</div>
              <h3 className="stx-process__title">Development & Integration</h3>
              <p className="stx-process__description">Build your e-commerce platform with secure payment processing, inventory management, and analytics integration.</p>
            </div>

            <div className="stx-process__step">
              <div className="stx-process__number">4</div>
              <h3 className="stx-process__title">Launch & Optimization</h3>
              <p className="stx-process__description">Deploy your store with comprehensive testing, performance optimization, and ongoing support for growth.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Using same structure as prototype page */}
      <section className="stx-faq">
        <div className="stx-service-page-container">
          <div className="stx-section-header">
            <h2 className="stx-section-title">Frequently Asked Questions</h2>
            <p className="stx-section-subtitle">Get answers to common questions about our e-commerce development services.</p>
          </div>

          <div className="stx-faq-container">
            <div className="stx-faq-item">
              <button className="stx-faq-question">
                How long does it take to build an e-commerce website?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>E-commerce development timelines vary by complexity. Simple stores take 4-6 weeks, while complex multi-vendor platforms may take 8-12 weeks. We provide detailed timelines during the planning phase.</p>
              </div>
            </div>

            <div className="stx-faq-item">
              <button className="stx-faq-question">
                What payment methods do you support?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>We integrate with all major European payment gateways including Stripe, PayPal, Klarna, iDEAL, and local payment methods. We ensure PCI compliance and secure transaction processing.</p>
              </div>
            </div>

            <div className="stx-faq-item">
              <button className="stx-faq-question">
                Can you handle multi-language and multi-currency?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>Yes, our e-commerce platforms support multiple languages and currencies. We implement automatic currency conversion and localized content for European markets.</p>
              </div>
            </div>

            <div className="stx-faq-item">
              <button className="stx-faq-question">
                Do you provide inventory management?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>Yes, all our e-commerce solutions include comprehensive inventory management with real-time tracking, automated reordering, and multi-location support.</p>
              </div>
            </div>

            <div className="stx-faq-item">
              <button className="stx-faq-question">
                What about SEO and marketing features?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>Our e-commerce platforms include built-in SEO optimization, marketing tools, email integration, and analytics to help you drive traffic and increase sales.</p>
              </div>
            </div>

            <div className="stx-faq-item">
              <button className="stx-faq-question">
                Can you integrate with existing business systems?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>Yes, we can integrate your e-commerce platform with existing ERP, CRM, accounting, and shipping systems to streamline your business operations.</p>
              </div>
            </div>

            <div className="stx-faq-item">
              <button className="stx-faq-question">
                Do you provide ongoing support and maintenance?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>Yes, we provide comprehensive support including security updates, performance optimization, feature additions, and technical assistance to ensure your store continues performing optimally.</p>
              </div>
            </div>

            <div className="stx-faq-item">
              <button className="stx-faq-question">
                What about mobile optimization?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>All our e-commerce platforms are built with mobile-first design principles, ensuring optimal performance and user experience across all devices and screen sizes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="stx-service-cta" id="contact">
        <div className="stx-service-page-container">
          <div className="stx-service-cta__content">
            <h2 className="stx-service-cta__title">Ready to Launch Your E-Commerce Store?</h2>
            <p className="stx-service-cta__description">Get a free consultation and prototype to see how we can create a powerful e-commerce platform that drives sales and customer satisfaction.</p>
            <div className="stx-service-cta__buttons">
              <a href="/free-prototype" className="stx-service-hero__btn--primary">Get Free Prototype</a>
              <a href="/contact" className="stx-service-hero__btn--secondary">Schedule Consultation</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
