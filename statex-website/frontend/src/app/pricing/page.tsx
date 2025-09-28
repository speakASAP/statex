'use client';

import React, { useState, useEffect } from 'react';
import { HeroSpacer } from '@/components/atoms';

export default function PricingPage() {
  // FAQ accordion functionality
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  // Smooth scrolling for anchor links
  useEffect(() => {
    function handleAnchorClick(e: Event) {
      e.preventDefault();
      const target = e.currentTarget as HTMLAnchorElement;
      const id = target.getAttribute('href')?.substring(1);
      if (id) {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', handleAnchorClick);
    });

    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', handleAnchorClick);
      });
    };
  }, []);

  return (
    <div className="stx-page">
      <HeroSpacer />
      {/* Pricing Hero Section */}
      <section className="stx-service-hero">
        <div className="stx-service-hero__container">
          <div className="stx-service-hero__icon">💰</div>
          <h1 className="stx-service-hero__title">Transparent Pricing Plans</h1>
          <p className="stx-service-hero__subtitle">Choose the plan that fits your needs. Transparent pricing, no hidden fees. Start with a free prototype, then scale as you grow.</p>
          <div className="stx-service-hero__cta">
            <a href="#pricing" className="stx-service-hero__btn--primary">View Plans</a>
            <a href="/free-prototype" className="stx-service-hero__btn--secondary">Get Free Prototype</a>
          </div>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section className="stx-pricing" id="pricing">
        <div className="stx-service-page-container">
          <div className="stx-section-header">
            <h2 className="stx-section-title">Choose Your Perfect Plan</h2>
            <p className="stx-section-subtitle">Flexible pricing options designed to grow with your business. Start small and scale up as you need more features and support.</p>
          </div>

          <div className="stx-pricing__plans">
            {/* Free Prototype Plan */}
            <div className="stx-pricing__plan">
              <div className="stx-pricing__header">
                <h3 className="stx-pricing__name">Free Prototype</h3>
                <div className="stx-pricing__price">
                  <span className="stx-pricing-plan-amount">€0</span>
                  <span className="stx-pricing-plan-period">/forever</span>
                </div>
                <p className="stx-pricing-plan-description">Perfect for testing ideas and validating concepts</p>
              </div>
              <ul className="stx-pricing__features">
                <li className="stx-pricing__feature">✓ Working prototype in 24-48 hours</li>
                <li className="stx-pricing__feature">✓ Basic functionality demonstration</li>
                <li className="stx-pricing__feature">✓ Technical feasibility assessment</li>
                <li className="stx-pricing__feature">✓ Development roadmap</li>
                <li className="stx-pricing__feature">✓ No commitment required</li>
                <li className="stx-pricing__feature">✓ Source code included</li>
              </ul>
              <div className="stx-pricing__button">
                <a href="/free-prototype" className="stx-button stx-button--primary">Get Free Prototype</a>
              </div>
            </div>

            {/* Starter Plan */}
            <div className="stx-pricing__plan stx-pricing__plan--featured">
              <div className="stx-pricing-plan-badge">Most Popular</div>
              <div className="stx-pricing__header">
                <h3 className="stx-pricing__name">Starter</h3>
                <div className="stx-pricing__price">
                  <span className="stx-pricing-plan-amount">€5,000</span>
                  <span className="stx-pricing-plan-period">/project</span>
                </div>
                <p className="stx-pricing-plan-description">Ideal for small businesses and startups</p>
              </div>
              <ul className="stx-pricing__features">
                <li className="stx-pricing__feature">✓ Custom web application</li>
                <li className="stx-pricing__feature">✓ Responsive design</li>
                <li className="stx-pricing__feature">✓ Basic integrations</li>
                <li className="stx-pricing__feature">✓ 3 months support</li>
                <li className="stx-pricing__feature">✓ Documentation</li>
                <li className="stx-pricing__feature">✓ Training session</li>
                <li className="stx-pricing__feature">✓ SEO optimization</li>
                <li className="stx-pricing__feature">✓ Performance optimization</li>
              </ul>
              <div className="stx-pricing__button">
                <a href="/contact" className="stx-button stx-button--primary">Get Started</a>
              </div>
            </div>

            {/* Professional Plan */}
            <div className="stx-pricing__plan">
              <div className="stx-pricing__header">
                <h3 className="stx-pricing__name">Professional</h3>
                <div className="stx-pricing__price">
                  <span className="stx-pricing-plan-amount">€15,000</span>
                  <span className="stx-pricing-plan-period">/project</span>
                </div>
                <p className="stx-pricing-plan-description">For growing businesses with complex needs</p>
              </div>
              <ul className="stx-pricing__features">
                <li className="stx-pricing__feature">✓ Everything in Starter</li>
                <li className="stx-pricing__feature">✓ Advanced integrations</li>
                <li className="stx-pricing__feature">✓ Custom API development</li>
                <li className="stx-pricing__feature">✓ Database design</li>
                <li className="stx-pricing__feature">✓ 6 months support</li>
                <li className="stx-pricing__feature">✓ Performance monitoring</li>
                <li className="stx-pricing__feature">✓ Security implementation</li>
                <li className="stx-pricing__feature">✓ Advanced analytics</li>
                <li className="stx-pricing__feature">✓ User management system</li>
              </ul>
              <div className="stx-pricing__button">
                <a href="/contact" className="stx-button stx-button--primary">Get Professional</a>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="stx-pricing__plan">
              <div className="stx-pricing__header">
                <h3 className="stx-pricing__name">Enterprise</h3>
                <div className="stx-pricing__price">
                  <span className="stx-pricing-plan-amount">€50,000+</span>
                  <span className="stx-pricing-plan-period">/project</span>
                </div>
                <p className="stx-pricing-plan-description">Custom solutions for large organizations</p>
              </div>
              <ul className="stx-pricing__features">
                <li className="stx-pricing__feature">✓ Everything in Professional</li>
                <li className="stx-pricing__feature">✓ Custom enterprise features</li>
                <li className="stx-pricing__feature">✓ Multi-tenant architecture</li>
                <li className="stx-pricing__feature">✓ Advanced security & compliance</li>
                <li className="stx-pricing__feature">✓ 12 months support</li>
                <li className="stx-pricing__feature">✓ Dedicated project manager</li>
                <li className="stx-pricing__feature">✓ Custom integrations</li>
                <li className="stx-pricing__feature">✓ Scalable infrastructure</li>
                <li className="stx-pricing__feature">✓ 24/7 monitoring</li>
                <li className="stx-pricing__feature">✓ SLA guarantees</li>
              </ul>
              <div className="stx-pricing__button">
                <a href="/contact" className="stx-button stx-button--primary">Contact Sales</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Services Section */}
      <section className="stx-service-overview">
        <div className="stx-service-page-container">
          <div className="stx-section-header">
            <h2 className="stx-section-title">Additional Services</h2>
            <p className="stx-section-subtitle">Enhance your project with our specialized services and ongoing support options.</p>
          </div>

          <div className="stx-service-overview__grid">
            <div className="stx-service-overview__content">
              <h3>Maintenance & Support</h3>
              <p>Keep your application running smoothly with our ongoing maintenance and support services. We handle updates, bug fixes, security patches, and performance optimization.</p>

              <h3>Custom Integrations</h3>
              <p>Connect your application with third-party services, APIs, and existing systems. We specialize in seamless integrations that enhance functionality and user experience.</p>

              <h3>Performance Optimization</h3>
              <p>Improve speed, efficiency, and user experience with our performance optimization services. We analyze and enhance every aspect of your application.</p>
            </div>

            <div className="stx-service-overview__highlights">
              <h3 className="stx-service-overview__highlights-title">Service Add-ons</h3>
              <ul className="stx-service-overview__highlights-list">
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Monthly Maintenance: €500/month</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Custom Integrations: €2,000+</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Performance Audit: €1,500</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Security Assessment: €2,000</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> SEO Optimization: €1,000</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Training Sessions: €300/hour</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Emergency Support: €150/hour</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Custom Features: €100/hour</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="stx-faq">
        <div className="stx-service-page-container">
          <div className="stx-section-header">
            <h2 className="stx-section-title">Frequently Asked Questions</h2>
            <p className="stx-section-subtitle">Get answers to common questions about our pricing and services.</p>
          </div>

          <div className="stx-faq-container">
            <div className="stx-faq-item">
              <button className="stx-faq-question" onClick={() => toggleFAQ(0)}>
                What's included in the free prototype?
                <span className="stx-faq-icon">{activeFAQ === 0 ? '▲' : '▼'}</span>
              </button>
              <div className={`stx-faq-answer ${activeFAQ === 0 ? 'stx-faq-answer--active' : ''}`}>
                <p>The free prototype includes a working demonstration of your core concept, basic functionality, technical feasibility assessment, development roadmap, and source code. No commitment required.</p>
              </div>
            </div>

            <div className="stx-faq-item">
              <button className="stx-faq-question" onClick={() => toggleFAQ(1)}>
                How long does development take?
                <span className="stx-faq-icon">{activeFAQ === 1 ? '▲' : '▼'}</span>
              </button>
              <div className={`stx-faq-answer ${activeFAQ === 1 ? 'stx-faq-answer--active' : ''}`}>
                <p>Development timelines vary by project complexity. Free prototypes are delivered in 24-48 hours. Starter projects typically take 4-6 weeks, Professional projects 8-12 weeks, and Enterprise projects 12-20 weeks.</p>
              </div>
            </div>

            <div className="stx-faq-item">
              <button className="stx-faq-question" onClick={() => toggleFAQ(2)}>
                Do you offer payment plans?
                <span className="stx-faq-icon">{activeFAQ === 2 ? '▲' : '▼'}</span>
              </button>
              <div className={`stx-faq-answer ${activeFAQ === 2 ? 'stx-faq-answer--active' : ''}`}>
                <p>Yes, we offer flexible payment plans. Typically 50% upfront and 50% upon completion. For larger projects, we can arrange milestone-based payments. Enterprise projects may have custom payment terms.</p>
              </div>
            </div>

            <div className="stx-faq-item">
              <button className="stx-faq-question" onClick={() => toggleFAQ(3)}>
                What happens after the project is complete?
                <span className="stx-faq-icon">{activeFAQ === 3 ? '▲' : '▼'}</span>
              </button>
              <div className={`stx-faq-answer ${activeFAQ === 3 ? 'stx-faq-answer--active' : ''}`}>
                <p>After completion, we provide documentation, training, and support for the specified period. You can also purchase ongoing maintenance, updates, and additional features as needed.</p>
              </div>
            </div>

            <div className="stx-faq-item">
              <button className="stx-faq-question" onClick={() => toggleFAQ(4)}>
                Can I upgrade my plan later?
                <span className="stx-faq-icon">{activeFAQ === 4 ? '▲' : '▼'}</span>
              </button>
              <div className={`stx-faq-answer ${activeFAQ === 4 ? 'stx-faq-answer--active' : ''}`}>
                <p>Absolutely! You can upgrade your plan at any time. We'll assess the additional requirements and provide a quote for the enhanced features and extended support.</p>
              </div>
            </div>

            <div className="stx-faq-item">
              <button className="stx-faq-question" onClick={() => toggleFAQ(5)}>
                Do you provide hosting and domain services?
                <span className="stx-faq-icon">{activeFAQ === 5 ? '▲' : '▼'}</span>
              </button>
              <div className={`stx-faq-answer ${activeFAQ === 5 ? 'stx-faq-answer--active' : ''}`}>
                <p>Yes, we can provide hosting, domain registration, SSL certificates, and ongoing server management. These services are included in our maintenance packages or available as add-ons.</p>
              </div>
            </div>

            <div className="stx-faq-item">
              <button className="stx-faq-question" onClick={() => toggleFAQ(6)}>
                What technologies do you use?
                <span className="stx-faq-icon">{activeFAQ === 6 ? '▲' : '▼'}</span>
              </button>
              <div className={`stx-faq-answer ${activeFAQ === 6 ? 'stx-faq-answer--active' : ''}`}>
                <p>We use modern, scalable technologies including React, Next.js, Node.js, Python, and cloud platforms like AWS, Google Cloud, and Azure. We choose the best technology stack for your specific needs.</p>
              </div>
            </div>

            <div className="stx-faq-item">
              <button className="stx-faq-question" onClick={() => toggleFAQ(7)}>
                Is there a warranty or guarantee?
                <span className="stx-faq-icon">{activeFAQ === 7 ? '▲' : '▼'}</span>
              </button>
              <div className={`stx-faq-answer ${activeFAQ === 7 ? 'stx-faq-answer--active' : ''}`}>
                <p>Yes, we provide a 30-day warranty on all development work. We also offer SLA guarantees for Enterprise clients and ongoing support to ensure your application continues to perform optimally.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="stx-service-cta">
        <div className="stx-service-page-container">
          <div className="stx-service-cta__content">
            <h2 className="stx-service-cta__title">Ready to Get Started?</h2>
            <p className="stx-service-cta__description">Start with a free prototype to see your idea come to life, or contact us to discuss your project requirements and get a custom quote.</p>
            <div className="stx-service-cta__buttons">
              <a href="/free-prototype" className="stx-service-hero__btn--primary">Get Free Prototype</a>
              <a href="/contact" className="stx-service-hero__btn--secondary">Get Custom Quote</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
