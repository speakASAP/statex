'use client';

import React, { useState, useEffect, useRef } from 'react';
import { HeroSpacer } from '@/components/atoms';

export default function ConsultingPage() {
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
          <div className="stx-service-hero__icon">💡</div>
          <h1 className="stx-service-hero__title">IT Consulting Services</h1>
          <p className="stx-service-hero__subtitle">Navigate complex technology decisions with expert guidance from our experienced consultants. Get strategic insights to optimize your digital transformation journey.</p>
          <div className="stx-service-hero__cta">
            <a href="#contact" className="stx-service-hero__btn--primary">Get Your Free Consultation</a>
            <a href="#features" className="stx-service-hero__btn--secondary">Learn More</a>
          </div>
        </div>
      </section>

      {/* Service Overview */}
      <section className="stx-service-overview">
        <div className="stx-service-page-container">
          <div className="stx-service-overview__grid">
            <div className="stx-service-overview__content">
              <h2>Strategic IT Consulting That Drives Business Success</h2>
              <p>Make informed technology decisions with expert guidance from our experienced consultants. We help European businesses navigate complex digital transformation challenges and implement solutions that deliver measurable business value.</p>

              <p>Our consulting services combine deep technical expertise with business acumen to provide strategic insights that align technology investments with your business objectives. We help you avoid costly mistakes and accelerate your digital transformation journey.</p>

              <p>From technology assessment to implementation planning, our consultants provide comprehensive guidance to ensure your technology investments drive business growth and competitive advantage in European markets.</p>
            </div>

            <div className="stx-service-overview__highlights">
              <h3 className="stx-service-overview__highlights-title">Service Highlights</h3>
              <ul className="stx-service-overview__highlights-list">
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Digital Transformation Strategy</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Technology Assessment</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Project Management</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> AI Implementation Planning</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> System Architecture Design</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Vendor Selection & Evaluation</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> Risk Assessment & Mitigation</li>
                <li className="stx-service-overview__highlights-item"><span className="stx-service-overview__check-icon">✓</span> ROI Analysis & Business Case</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Using stx-values classes (same as Core Values) */}
      <section className="stx-values" id="features">
        <div className="stx-service-page-container">
          <div className="stx-section-header">
            <h2 className="stx-section-title">Comprehensive Consulting Features</h2>
            <p className="stx-section-subtitle">Everything you need to make informed technology decisions and drive business success.</p>
          </div>

          <div className="stx-values__grid">
            <div className="stx-values__card">
              <div className="stx-values__icon">🎯</div>
              <h3 className="stx-values__card-title">Strategic Planning</h3>
              <p className="stx-values__card-description">Comprehensive digital transformation strategies aligned with your business objectives and market opportunities.</p>
            </div>

            <div className="stx-values__card">
              <div className="stx-values__icon">🔍</div>
              <h3 className="stx-values__card-title">Technology Assessment</h3>
              <p className="stx-values__card-description">Thorough evaluation of current technology stack, identifying opportunities for improvement and modernization.</p>
            </div>

            <div className="stx-values__card">
              <div className="stx-values__icon">📊</div>
              <h3 className="stx-values__card-title">ROI Analysis</h3>
              <p className="stx-values__card-description">Detailed business case development with cost-benefit analysis and projected return on investment.</p>
            </div>

            <div className="stx-values__card">
              <div className="stx-values__icon">🤖</div>
              <h3 className="stx-values__card-title">AI Strategy</h3>
              <p className="stx-values__card-description">AI implementation planning and strategy development to leverage artificial intelligence for business growth.</p>
            </div>

            <div className="stx-values__card">
              <div className="stx-values__icon">🏗️</div>
              <h3 className="stx-values__card-title">Architecture Design</h3>
              <p className="stx-values__card-description">Scalable system architecture design that supports business growth and future technology needs.</p>
            </div>

            <div className="stx-values__card">
              <div className="stx-values__icon">🛡️</div>
              <h3 className="stx-values__card-title">Risk Management</h3>
              <p className="stx-values__card-description">Comprehensive risk assessment and mitigation strategies to ensure successful project delivery.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="stx-process">
        <div className="stx-service-page-container">
          <div className="stx-section-header">
            <h2 className="stx-section-title">Our Consulting Process</h2>
            <p className="stx-section-subtitle">A proven methodology that ensures successful technology decisions and implementation.</p>
          </div>

          <div className="stx-process__steps">
            <div className="stx-process__step">
              <div className="stx-process__number">1</div>
              <h3 className="stx-process__title">Business Analysis</h3>
              <p className="stx-process__description">We analyze your business objectives, current challenges, and market opportunities to understand your technology needs.</p>
            </div>

            <div className="stx-process__step">
              <div className="stx-process__number">2</div>
              <h3 className="stx-process__title">Technology Assessment</h3>
              <p className="stx-process__description">Evaluate your current technology stack and identify opportunities for improvement and modernization.</p>
            </div>

            <div className="stx-process__step">
              <div className="stx-process__number">3</div>
              <h3 className="stx-process__title">Strategy Development</h3>
              <p className="stx-process__description">Create comprehensive technology strategies and implementation roadmaps aligned with your business goals.</p>
            </div>

            <div className="stx-process__step">
              <div className="stx-process__number">4</div>
              <h3 className="stx-process__title">Implementation Support</h3>
              <p className="stx-process__description">Provide ongoing guidance and support throughout the implementation process to ensure successful delivery.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Using same structure as prototype page */}
      <section className="stx-faq">
        <div className="stx-service-page-container">
          <div className="stx-section-header">
            <h2 className="stx-section-title">Frequently Asked Questions</h2>
            <p className="stx-section-subtitle">Get answers to common questions about our IT consulting services.</p>
          </div>

          <div className="stx-faq-container">
            <div className="stx-faq-item">
              <button className="stx-faq-question">
                What types of consulting services do you offer?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>We offer comprehensive IT consulting including digital transformation strategy, technology assessment, AI implementation planning, system architecture design, vendor selection, and project management.</p>
              </div>
            </div>

            <div className="stx-faq-item">
              <button className="stx-faq-question">
                How long does a typical consulting engagement take?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>Consulting engagements vary by scope and complexity. Strategy projects typically take 2-4 weeks, while comprehensive assessments may require 6-8 weeks. We provide detailed timelines during initial discussions.</p>
              </div>
            </div>

            <div className="stx-faq-item">
              <button className="stx-faq-question">
                Do you provide ongoing support after consulting?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>Yes, we provide ongoing support throughout implementation and can continue as strategic technology advisors to ensure successful project delivery and long-term success.</p>
              </div>
            </div>

            <div className="stx-faq-item">
              <button className="stx-faq-question">
                Can you help with vendor selection?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>Absolutely! We provide vendor evaluation, selection criteria development, and negotiation support to help you choose the best technology partners for your business needs.</p>
              </div>
            </div>

            <div className="stx-faq-item">
              <button className="stx-faq-question">
                What industries do you specialize in?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>We have experience across various industries including manufacturing, retail, healthcare, finance, and technology. Our consultants understand industry-specific challenges and compliance requirements.</p>
              </div>
            </div>

            <div className="stx-faq-item">
              <button className="stx-faq-question">
                Do you provide ROI analysis for technology investments?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>Yes, we provide detailed ROI analysis and business case development to help you understand the financial impact and benefits of proposed technology investments.</p>
              </div>
            </div>

            <div className="stx-faq-item">
              <button className="stx-faq-question">
                Can you help with AI implementation strategy?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>Yes, we specialize in AI strategy development and implementation planning. We help businesses identify AI opportunities and create roadmaps for successful AI adoption.</p>
              </div>
            </div>

            <div className="stx-faq-item">
              <button className="stx-faq-question">
                What about risk assessment and mitigation?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>We provide comprehensive risk assessment and mitigation strategies for technology projects, helping you identify potential issues and develop contingency plans.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="stx-service-cta" id="contact">
        <div className="stx-service-page-container">
          <div className="stx-service-cta__content">
            <h2 className="stx-service-cta__title">Ready to Get Expert IT Guidance?</h2>
            <p className="stx-service-cta__description">Get a free consultation to discuss your technology challenges and discover how our expert guidance can drive your business success.</p>
            <div className="stx-service-cta__buttons">
              <a href="/free-prototype" className="stx-service-hero__btn--primary">Get Free Consultation</a>
              <a href="/contact" className="stx-service-hero__btn--secondary">Schedule Meeting</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
