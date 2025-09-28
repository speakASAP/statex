'use client';

import React, { useState, useEffect, useRef } from 'react';
import { HeroSpacer } from '@/components/atoms';

export default function AIAutomationPage() {
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
          <div className="stx-service-hero__icon">🤖</div>
          <h1 className="stx-service-hero__title">AI Automation Services</h1>
          <p className="stx-service-hero__subtitle">Automate repetitive tasks and streamline business processes with custom AI solutions. Reduce operational costs by up to 40% while improving accuracy and efficiency across your organization.</p>
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
              <h2>Intelligent Automation Solutions That Transform Business Operations</h2>
              <p>Transform repetitive tasks into intelligent, automated workflows that operate 24/7. Our AI automation solutions free your team to focus on strategic initiatives while ensuring consistent, error-free execution of routine business processes across European markets.</p>

              <p>We develop custom AI automation systems that revolutionize how European businesses operate. Our solutions combine machine learning, natural language processing, and robotic process automation to create intelligent systems that think, learn, and adapt to your business needs.</p>

              <p>Our AI automation solutions are designed specifically for European business environments, ensuring GDPR compliance, multilingual support, and integration with popular EU business software platforms.</p>
            </div>

            <div className="stx-service-overview__highlights">
              <h3 className="stx-service-overview__highlights-title">Service Highlights</h3>
              <ul className="stx-service-overview__highlights-list">
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Business Process Automation</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Intelligent Chatbots & Virtual Assistants</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Document Processing & Analysis</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Customer Service Automation</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Data Analysis & Reporting Automation</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Workflow Orchestration</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> GDPR Compliance</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Multilingual Support</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Using stx-values classes (same as Core Values) */}
      <section className="stx-values" id="features">
        <div className="stx-service-page-container">
          <div className="stx-section-header">
            <h2 className="stx-section-title">Comprehensive AI Automation Features</h2>
            <p className="stx-section-subtitle">Everything you need to streamline operations and accelerate business growth.</p>
          </div>

          <div className="stx-values__grid">
            <div className="stx-values__card">
              <div className="stx-values__icon">💰</div>
              <h3 className="stx-values__card-title">Dramatic Cost Reduction</h3>
              <p className="stx-values__card-description">Reduce operational costs by 30-50% through intelligent automation of repetitive tasks, eliminating human error, and optimizing resource allocation.</p>
            </div>

            <div className="stx-values__card">
              <div className="stx-values__icon">⏰</div>
              <h3 className="stx-values__card-title">24/7 Operations</h3>
              <p className="stx-values__card-description">AI systems work continuously without breaks, holidays, or sick days, ensuring consistent business operations and improved customer service availability.</p>
            </div>

            <div className="stx-values__card">
              <div className="stx-values__icon">🎯</div>
              <h3 className="stx-values__card-title">Enhanced Accuracy</h3>
              <p className="stx-values__card-description">Eliminate human error in data processing, document handling, and routine calculations, achieving 99%+ accuracy rates in automated processes.</p>
            </div>

            <div className="stx-values__card">
              <div className="stx-values__icon">📈</div>
              <h3 className="stx-values__card-title">Scalable Solutions</h3>
              <p className="stx-values__card-description">AI automation systems scale effortlessly with business growth, handling increased workloads without proportional increases in operational costs.</p>
            </div>

            <div className="stx-values__card">
              <div className="stx-values__icon">🧠</div>
              <h3 className="stx-values__card-title">Intelligent Decision Making</h3>
              <p className="stx-values__card-description">Advanced AI algorithms analyze patterns, predict outcomes, and make data-driven decisions faster than human counterparts.</p>
            </div>

            <div className="stx-values__card">
              <div className="stx-values__icon">🔗</div>
              <h3 className="stx-values__card-title">Seamless Integration</h3>
              <p className="stx-values__card-description">Custom-built automation solutions integrate smoothly with existing business systems, preserving current workflows while adding intelligent automation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="stx-process">
        <div className="stx-service-page-container">
          <div className="stx-section-header">
            <h2 className="stx-section-title">Our AI Automation Process</h2>
            <p className="stx-section-subtitle">A proven methodology that ensures successful automation implementation with minimal disruption.</p>
          </div>

          <div className="stx-process__steps">
            <div className="stx-process__step">
              <div className="stx-process__number">1</div>
              <h3 className="stx-process__title">Business Process Analysis</h3>
              <p className="stx-process__description">We begin with comprehensive analysis of your current workflows using our AI-powered assessment tools to identify automation opportunities.</p>
            </div>

            <div className="stx-process__step">
              <div className="stx-process__number">2</div>
              <h3 className="stx-process__title">AI Solution Design</h3>
              <p className="stx-process__description">Custom AI automation architecture designed specifically for your business requirements with clear success metrics.</p>
            </div>

            <div className="stx-process__step">
              <div className="stx-process__number">3</div>
              <h3 className="stx-process__title">Rapid Prototyping & Testing</h3>
              <p className="stx-process__description">Receive working AI automation prototypes within 48 hours demonstrating core functionality for early validation.</p>
            </div>

            <div className="stx-process__step">
              <div className="stx-process__number">4</div>
              <h3 className="stx-process__title">Phased Implementation</h3>
              <p className="stx-process__description">Deploy automation solutions in carefully planned phases to minimize business disruption while delivering immediate value.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Using same structure as prototype page */}
      <section className="stx-faq">
        <div className="stx-service-page-container">
          <div className="stx-section-header">
            <h2 className="stx-section-title">Frequently Asked Questions</h2>
            <p className="stx-section-subtitle">Get answers to common questions about our AI automation services.</p>
          </div>

          <div className="stx-faq-container">
            <div className="stx-faq-item">
              <button className="stx-faq-question">
                What types of business processes can be automated with AI?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>AI automation can streamline virtually any repetitive, rule-based process including customer service, document processing, data entry, invoice handling, email management, report generation, and workflow routing. We assess each business individually to identify optimal automation opportunities.</p>
              </div>
            </div>

            <div className="stx-faq-item">
              <button className="stx-faq-question">
                How long does it take to implement AI automation solutions?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>Implementation timelines vary by complexity. Simple automations like chatbots can be deployed in 2-3 weeks, while comprehensive business process automation may require 8-12 weeks. Our rapid prototyping delivers working demonstrations within 48 hours.</p>
              </div>
            </div>

            <div className="stx-faq-item">
              <button className="stx-faq-question">
                Will AI automation replace human employees?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>AI automation is designed to augment human capabilities, not replace employees. It handles repetitive tasks, allowing staff to focus on creative, strategic, and relationship-building activities that require human insight and decision-making.</p>
              </div>
            </div>

            <div className="stx-faq-item">
              <button className="stx-faq-question">
                How do you ensure data security and GDPR compliance?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>All AI automation solutions include robust security measures: encrypted data processing, access controls, audit trails, and full GDPR compliance. We follow European data protection standards and provide detailed compliance documentation.</p>
              </div>
            </div>

            <div className="stx-faq-item">
              <button className="stx-faq-question">
                Can AI automation integrate with our existing business systems?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>Yes, our AI solutions are designed to integrate seamlessly with popular business platforms including Salesforce, SAP, Microsoft 365, QuickBooks, and custom enterprise systems. We provide API connections and data synchronization capabilities.</p>
              </div>
            </div>

            <div className="stx-faq-item">
              <button className="stx-faq-question">
                How do you measure the success of AI automation projects?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>We establish clear KPIs before implementation including cost savings, time reduction, accuracy improvements, and user satisfaction. Regular reporting tracks progress against these metrics with detailed analytics and optimization recommendations.</p>
              </div>
            </div>

            <div className="stx-faq-item">
              <button className="stx-faq-question">
                What ongoing support do you provide after implementation?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>Comprehensive support includes system monitoring, performance optimization, user training, technical assistance, and regular updates. Our AI systems continue learning and improving with ongoing maintenance and optimization services.</p>
              </div>
            </div>

            <div className="stx-faq-item">
              <button className="stx-faq-question">
                Do you provide training for our team to manage AI systems?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>Yes, we provide comprehensive training covering system administration, performance monitoring, basic troubleshooting, and optimization techniques. Training includes documentation, video tutorials, and hands-on workshops for your technical team.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="stx-service-cta" id="contact">
        <div className="stx-service-page-container">
          <div className="stx-service-cta__content">
            <h2 className="stx-service-cta__title">Ready to Transform Your Business Operations?</h2>
            <p className="stx-service-cta__description">Get a free consultation and prototype to see how we can automate your business processes with intelligent AI solutions.</p>
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
