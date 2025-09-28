'use client';

import React, { useState, useEffect, useRef } from 'react';
import { HeroSpacer } from '@/components/atoms';

export default function CustomSoftwarePage() {
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
          <div className="stx-service-hero__icon">🛠️</div>
          <h1 className="stx-service-hero__title">Custom Software Development</h1>
          <p className="stx-service-hero__subtitle">Build bespoke applications tailored to your exact requirements with enterprise-grade solutions. Create software that perfectly fits your business processes and drives growth.</p>
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
              <h2>Bespoke Software Solutions That Drive Business Growth</h2>
              <p>Transform your business with custom software solutions designed specifically for your unique requirements. Our expert development team creates enterprise-grade applications that streamline operations, improve efficiency, and provide competitive advantages in European markets.</p>

              <p>We build scalable, secure, and maintainable software solutions that grow with your business. From simple business applications to complex enterprise systems, our custom software development services deliver solutions that perfectly align with your business objectives.</p>

              <p>Our development process ensures high-quality, reliable software with comprehensive testing, documentation, and ongoing support to maximize the value of your technology investment.</p>
            </div>

            <div className="stx-service-overview__highlights">
              <h3 className="stx-service-overview__highlights-title">Service Highlights</h3>
              <ul className="stx-service-overview__highlights-list">
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Enterprise Applications</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> SaaS Platform Development</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Mobile App Creation</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Integration Solutions</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Business Process Automation</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Data Management Systems</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> API Development</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Cloud-Native Solutions</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Using stx-values classes (same as Core Values) */}
      <section className="stx-values" id="features">
        <div className="stx-service-page-container">
          <div className="stx-section-header">
            <h2 className="stx-section-title">Comprehensive Custom Software Features</h2>
            <p className="stx-section-subtitle">Everything you need to create powerful, scalable software solutions that drive business success.</p>
          </div>

          <div className="stx-values__grid">
            <div className="stx-values__card">
              <div className="stx-values__icon">🎯</div>
              <h3 className="stx-values__card-title">Tailored Solutions</h3>
              <p className="stx-values__card-description">Custom software designed specifically for your business processes, requirements, and unique challenges.</p>
            </div>

            <div className="stx-values__card">
              <div className="stx-values__icon">📈</div>
              <h3 className="stx-values__card-title">Scalable Architecture</h3>
              <p className="stx-values__card-description">Built with scalability in mind to grow with your business and handle increased workloads efficiently.</p>
            </div>

            <div className="stx-values__card">
              <div className="stx-values__icon">🔒</div>
              <h3 className="stx-values__card-title">Enterprise Security</h3>
              <p className="stx-values__card-description">Bank-level security implementation with encryption, access controls, and compliance with European standards.</p>
            </div>

            <div className="stx-values__card">
              <div className="stx-values__icon">🔗</div>
              <h3 className="stx-values__card-title">Seamless Integration</h3>
              <p className="stx-values__card-description">Easy integration with existing business systems, third-party services, and cloud platforms.</p>
            </div>

            <div className="stx-values__card">
              <div className="stx-values__icon">📱</div>
              <h3 className="stx-values__card-title">Multi-Platform Support</h3>
              <p className="stx-values__card-description">Applications that work across web, mobile, and desktop platforms for maximum accessibility.</p>
            </div>

            <div className="stx-values__card">
              <div className="stx-values__icon">⚡</div>
              <h3 className="stx-values__card-title">High Performance</h3>
              <p className="stx-values__card-description">Optimized for speed and efficiency with modern technologies and best practices for maximum performance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="stx-process">
        <div className="stx-service-page-container">
          <div className="stx-section-header">
            <h2 className="stx-section-title">Our Custom Software Development Process</h2>
            <p className="stx-section-subtitle">A proven methodology that ensures successful software delivery and long-term success.</p>
          </div>

          <div className="stx-process__steps">
            <div className="stx-process__step">
              <div className="stx-process__number">1</div>
              <h3 className="stx-process__title">Requirements Analysis</h3>
              <p className="stx-process__description">We thoroughly analyze your business requirements, processes, and objectives to create detailed specifications.</p>
            </div>

            <div className="stx-process__step">
              <div className="stx-process__number">2</div>
              <h3 className="stx-process__title">Design & Architecture</h3>
              <p className="stx-process__description">Create comprehensive system architecture and user interface designs that align with your business needs.</p>
            </div>

            <div className="stx-process__step">
              <div className="stx-process__number">3</div>
              <h3 className="stx-process__title">Development & Testing</h3>
              <p className="stx-process__description">Build your custom software using modern technologies with comprehensive testing throughout development.</p>
            </div>

            <div className="stx-process__step">
              <div className="stx-process__number">4</div>
              <h3 className="stx-process__title">Deployment & Support</h3>
              <p className="stx-process__description">Deploy your software with comprehensive documentation, training, and ongoing support for success.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Using same structure as prototype page */}
      <section className="stx-faq">
        <div className="stx-service-page-container">
          <div className="stx-section-header">
            <h2 className="stx-section-title">Frequently Asked Questions</h2>
            <p className="stx-section-subtitle">Get answers to common questions about our custom software development services.</p>
          </div>

          <div className="stx-faq-container">
            <div className="stx-faq-item">
              <button className="stx-faq-question">
                How long does custom software development take?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>Development timelines vary by complexity. Simple applications take 6-12 weeks, while complex enterprise systems may require 6-12 months. We provide detailed timelines during the planning phase.</p>
              </div>
            </div>

            <div className="stx-faq-item">
              <button className="stx-faq-question">
                What technologies do you use for custom software?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>We use modern technologies including React, Node.js, Python, Java, and cloud platforms. We choose the best technology stack based on your specific requirements and business needs.</p>
              </div>
            </div>

            <div className="stx-faq-item">
              <button className="stx-faq-question">
                Can you integrate with our existing systems?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>Yes, we specialize in system integration and can connect your custom software with existing ERP, CRM, databases, and third-party services to create seamless workflows.</p>
              </div>
            </div>

            <div className="stx-faq-item">
              <button className="stx-faq-question">
                Do you provide ongoing maintenance and support?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>Yes, we provide comprehensive maintenance and support services including updates, bug fixes, performance optimization, and feature enhancements to ensure your software continues performing optimally.</p>
              </div>
            </div>

            <div className="stx-faq-item">
              <button className="stx-faq-question">
                Can you develop mobile applications?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>Yes, we develop native and cross-platform mobile applications for iOS and Android. We can also create Progressive Web Apps (PWAs) that work across all devices.</p>
              </div>
            </div>

            <div className="stx-faq-item">
              <button className="stx-faq-question">
                What about security and compliance?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>All our custom software includes enterprise-grade security features, GDPR compliance, and follows industry best practices to protect your business data and ensure regulatory compliance.</p>
              </div>
            </div>

            <div className="stx-faq-item">
              <button className="stx-faq-question">
                Can you help with cloud deployment?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>Yes, we provide cloud deployment services on AWS, Google Cloud, and Microsoft Azure. We handle infrastructure setup, deployment automation, and ongoing cloud management.</p>
              </div>
            </div>

            <div className="stx-faq-item">
              <button className="stx-faq-question">
                Do you provide training and documentation?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>Yes, we provide comprehensive user training, technical documentation, and admin guides to ensure your team can effectively use and maintain the custom software.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="stx-service-cta" id="contact">
        <div className="stx-service-page-container">
          <div className="stx-service-cta__content">
            <h2 className="stx-service-cta__title">Ready to Build Your Custom Software?</h2>
            <p className="stx-service-cta__description">Get a free consultation and prototype to see how we can create custom software that perfectly fits your business needs.</p>
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
