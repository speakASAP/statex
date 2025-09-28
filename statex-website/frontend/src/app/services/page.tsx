'use client';

import React, { useState, useEffect } from 'react';
import { HeroSpacer } from '@/components/atoms';

export default function ServicesPage() {
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
      {/* Service Hero Section */}
      <section className="stx-service-hero">
        <div className="stx-service-hero__container">
          <div className="stx-service-hero__icon">🌐</div>
          <h1 className="stx-service-hero__title">Web Development Services</h1>
          <p className="stx-service-hero__subtitle">Create lightning-fast, responsive websites and web applications using cutting-edge technologies. From corporate websites to complex web platforms, we deliver solutions that engage users and convert visitors into customers.</p>
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
              <h2>Modern Web Applications That Drive Results</h2>
              <p>In today's digital landscape, your website is often the first interaction customers have with your business. Our web development services combine cutting-edge technology with proven design principles to create websites that not only look exceptional but also perform flawlessly across all devices and platforms.</p>

              <p>We specialize in building Progressive Web Apps (PWAs) that provide native app-like experiences while maintaining the accessibility and reach of traditional websites. Our development approach prioritizes speed, security, and scalability, ensuring your web application can grow with your business needs.</p>

              <p>Every project includes comprehensive testing, performance optimization, and ongoing support to ensure your website continues to deliver exceptional results long after launch.</p>
            </div>

            <div className="stx-service-overview__highlights">
              <h3 className="stx-service-overview__highlights-title">Service Highlights</h3>
              <ul className="stx-service-overview__highlights-list">
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Progressive Web Apps (PWA)</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Mobile-responsive design</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> EU accessibility compliance</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Multi-language support</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> SEO optimization</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Performance optimization</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Security best practices</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Analytics integration</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Using stx-values classes (same as Core Values) */}
      <section className="stx-values" id="features">
        <div className="stx-service-page-container">
          <div className="stx-section-header">
            <h2 className="stx-section-title">Comprehensive Web Development Features</h2>
            <p className="stx-section-subtitle">Everything you need to establish a powerful online presence and drive business growth.</p>
          </div>

          <div className="stx-values__grid">
            <div className="stx-values__card">
              <div className="stx-values__icon">📱</div>
              <h3 className="stx-values__card-title">Responsive Design</h3>
              <p className="stx-values__card-description">Seamless user experience across all devices, from desktop computers to mobile phones and tablets.</p>
            </div>

            <div className="stx-values__card">
              <div className="stx-values__icon">⚡</div>
              <h3 className="stx-values__card-title">Lightning Fast</h3>
              <p className="stx-values__card-description">Optimized for speed with advanced caching, compression, and modern web technologies.</p>
            </div>

            <div className="stx-values__card">
              <div className="stx-values__icon">🔒</div>
              <h3 className="stx-values__card-title">Secure & Reliable</h3>
              <p className="stx-values__card-description">Built with security best practices, SSL certificates, and regular security updates.</p>
            </div>

            <div className="stx-values__card">
              <div className="stx-values__icon">🎨</div>
              <h3 className="stx-values__card-title">Custom Design</h3>
              <p className="stx-values__card-description">Unique, brand-focused designs that reflect your company's identity and values.</p>
            </div>

            <div className="stx-values__card">
              <div className="stx-values__icon">📊</div>
              <h3 className="stx-values__card-title">Analytics Integration</h3>
              <p className="stx-values__card-description">Comprehensive tracking and analytics to measure performance and user engagement.</p>
            </div>

            <div className="stx-values__card">
              <div className="stx-values__icon">🌍</div>
              <h3 className="stx-values__card-title">EU Compliance</h3>
              <p className="stx-values__card-description">GDPR compliant with proper cookie consent management and data protection.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="stx-process">
        <div className="stx-service-page-container">
          <div className="stx-section-header">
            <h2 className="stx-section-title">Our Development Process</h2>
            <p className="stx-section-subtitle">A proven methodology that ensures successful project delivery every time.</p>
          </div>

          <div className="stx-process__steps">
            <div className="stx-process__step">
              <div className="stx-process__number">1</div>
              <h3 className="stx-process__title">Discovery & Planning</h3>
              <p className="stx-process__description">We analyze your requirements, target audience, and business goals to create a comprehensive project plan.</p>
            </div>

            <div className="stx-process__step">
              <div className="stx-process__number">2</div>
              <h3 className="stx-process__title">Design & Prototyping</h3>
              <p className="stx-process__description">Create wireframes, mockups, and interactive prototypes to visualize the final product.</p>
            </div>

            <div className="stx-process__step">
              <div className="stx-process__number">3</div>
              <h3 className="stx-process__title">Development & Testing</h3>
              <p className="stx-process__description">Build your website using modern technologies with comprehensive testing throughout the process.</p>
            </div>

            <div className="stx-process__step">
              <div className="stx-process__number">4</div>
              <h3 className="stx-process__title">Launch & Support</h3>
              <p className="stx-process__description">Deploy your website and provide ongoing maintenance, updates, and technical support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Using same structure as prototype page */}
      <section className="stx-faq">
        <div className="stx-service-page-container">
          <div className="stx-section-header">
            <h2 className="stx-section-title">Frequently Asked Questions</h2>
            <p className="stx-section-subtitle">Get answers to common questions about our web development services.</p>
          </div>

          <div className="stx-faq-container">
            <div className={`stx-faq-item ${activeFAQ === 0 ? 'stx-faq-item--active' : ''}`}>
              <button className="stx-faq-question" onClick={() => toggleFAQ(0)}>
                How long does it take to develop a website?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>Development time varies based on project complexity. Simple websites take 2-4 weeks, while complex web applications may take 2-3 months. We provide detailed timelines during the planning phase.</p>
              </div>
            </div>

            <div className={`stx-faq-item ${activeFAQ === 1 ? 'stx-faq-item--active' : ''}`}>
              <button className="stx-faq-question" onClick={() => toggleFAQ(1)}>
                Do you provide website hosting and maintenance?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>Yes, we offer comprehensive hosting solutions and maintenance packages. This includes regular updates, security monitoring, backups, and technical support.</p>
              </div>
            </div>

            <div className={`stx-faq-item ${activeFAQ === 2 ? 'stx-faq-item--active' : ''}`}>
              <button className="stx-faq-question" onClick={() => toggleFAQ(2)}>
                Can you redesign my existing website?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>Absolutely! We can completely redesign your existing website while preserving valuable SEO rankings and migrating existing content seamlessly.</p>
              </div>
            </div>

            <div className={`stx-faq-item ${activeFAQ === 3 ? 'stx-faq-item--active' : ''}`}>
              <button className="stx-faq-question" onClick={() => toggleFAQ(3)}>
                Will my website be mobile-friendly?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>Yes, all our websites are built with responsive design principles, ensuring perfect functionality and appearance across all devices and screen sizes.</p>
              </div>
            </div>

            <div className={`stx-faq-item ${activeFAQ === 4 ? 'stx-faq-item--active' : ''}`}>
              <button className="stx-faq-question" onClick={() => toggleFAQ(4)}>
                Do you provide SEO optimization?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>Yes, we include basic SEO optimization in all projects, including proper meta tags, structured data, and performance optimization for better search rankings.</p>
              </div>
            </div>

            <div className={`stx-faq-item ${activeFAQ === 5 ? 'stx-faq-item--active' : ''}`}>
              <button className="stx-faq-question" onClick={() => toggleFAQ(5)}>
                What technologies do you use?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>We use modern technologies including React, Next.js, Node.js, and other cutting-edge frameworks, always choosing the best technology stack for your specific project needs.</p>
              </div>
            </div>

            <div className={`stx-faq-item ${activeFAQ === 6 ? 'stx-faq-item--active' : ''}`}>
              <button className="stx-faq-question" onClick={() => toggleFAQ(6)}>
                Can you integrate with existing systems?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>Yes, we specialize in system integration and can connect your website with CRM systems, payment gateways, databases, and other business tools.</p>
              </div>
            </div>

            <div className={`stx-faq-item ${activeFAQ === 7 ? 'stx-faq-item--active' : ''}`}>
              <button className="stx-faq-question" onClick={() => toggleFAQ(7)}>
                Do you offer multilingual website development?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>Yes, we create multilingual websites with proper internationalization support for European markets, including right-to-left languages when needed.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="stx-service-cta" id="contact">
        <div className="stx-service-page-container">
          <div className="stx-service-cta__content">
            <h2 className="stx-service-cta__title">Ready to Build Your Website?</h2>
            <p className="stx-service-cta__description">Get a free consultation and prototype to see how we can transform your online presence with modern web development.</p>
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
