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
            const statNumbers = entry.target.querySelectorAll('.stx-solution-hero__stat-number[data-target]');

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
      {/* Solution Hero Section */}
      <section className="stx-solution-hero">
        <div className="stx-solution-hero__container">
          <span className="stx-solution-hero__badge">Digital Transformation Solution</span>
          <h1 className="stx-solution-hero__title">Accelerate Your Digital Transformation Journey</h1>
          <p className="stx-solution-hero__subtitle">Transform your business operations with comprehensive digital solutions that drive innovation, improve efficiency, and create competitive advantages in the digital economy.</p>

          <div className="stx-solution-hero__stats" ref={heroStatsRef}>
            <div className="stx-solution-hero__stat-item">
              <span className="stx-solution-hero__stat-number" data-target="40" data-suffix="%">0%</span>
              <span className="stx-solution-hero__stat-label">Efficiency Improvement</span>
            </div>
            <div className="stx-solution-hero__stat-item">
              <span className="stx-solution-hero__stat-number" data-target="60" data-suffix="%">0%</span>
              <span className="stx-solution-hero__stat-label">Cost Reduction</span>
            </div>
            <div className="stx-solution-hero__stat-item">
              <span className="stx-solution-hero__stat-number" data-target="12" data-suffix=" months">0 months</span>
              <span className="stx-solution-hero__stat-label">Implementation Time</span>
            </div>
            <div className="stx-solution-hero__stat-item">
              <span className="stx-solution-hero__stat-number" data-target="100" data-suffix="%">0%</span>
              <span className="stx-solution-hero__stat-label">Success Rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Solution Section */}
      <section className="stx-problem-solution">
        <div className="stx-problem-solution__grid">
          <div className="stx-problem-solution__card stx-problem-solution__card--problem">
            <h3 className="stx-problem-solution__card-title stx-problem-solution__card-title--problem">🚫 Digital Transformation Challenges</h3>
            <ul className="stx-problem-solution__list">
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--problem">Resistance to change and lack of digital culture</li>
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--problem">Complex legacy systems and technical debt</li>
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--problem">Limited digital skills and expertise</li>
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--problem">High implementation costs and long timelines</li>
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--problem">Data silos and integration challenges</li>
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--problem">Cybersecurity and compliance concerns</li>
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--problem">Difficulty measuring ROI and success</li>
            </ul>
          </div>
          <div className="stx-problem-solution__card stx-problem-solution__card--solution">
            <h3 className="stx-problem-solution__card-title stx-problem-solution__card-title--solution">🚀 Digital Transformation Solutions</h3>
            <ul className="stx-problem-solution__list">
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--solution">Change management and digital culture development</li>
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--solution">Modern technology stack and cloud migration</li>
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--solution">Comprehensive training and skill development</li>
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--solution">Phased implementation with rapid ROI</li>
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--solution">Unified data platform and seamless integration</li>
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--solution">Enterprise-grade security and compliance</li>
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--solution">Clear metrics and performance tracking</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Solution Overview Section */}
      <section className="stx-features">
        <div className="stx-section-container">
          <div className="stx-section-header">
            <h2 className="stx-section-title">Comprehensive Digital Transformation Ecosystem</h2>
            <p className="stx-section-subtitle">End-to-end digital transformation solutions that modernize business operations, enhance customer experiences, and drive sustainable growth in the digital economy.</p>
          </div>

          <div className="stx-features__grid">
            <div className="stx-features__item">
              <div className="stx-features__header">
                <div className="stx-features__icon">🎯</div>
                <h3 className="stx-features__heading">Strategic Planning</h3>
              </div>
              <p className="stx-features__text">Comprehensive digital transformation strategies aligned with business objectives and market opportunities.</p>
            </div>
            <div className="stx-features__item">
              <div className="stx-features__header">
                <div className="stx-features__icon">🔄</div>
                <h3 className="stx-features__heading">Process Optimization</h3>
              </div>
              <p className="stx-features__text">Streamline business processes with automation, AI, and digital workflows to improve efficiency and reduce costs.</p>
            </div>
            <div className="stx-features__item">
              <div className="stx-features__header">
                <div className="stx-features__icon">📊</div>
                <h3 className="stx-features__heading">Data Analytics</h3>
              </div>
              <p className="stx-features__text">Implement advanced analytics and business intelligence to drive data-driven decision making and insights.</p>
            </div>
            <div className="stx-features__item">
              <div className="stx-features__header">
                <div className="stx-features__icon">👥</div>
                <h3 className="stx-features__heading">Change Management</h3>
              </div>
              <p className="stx-features__text">Develop digital culture and provide comprehensive training to ensure successful adoption and transformation.</p>
            </div>
            <div className="stx-features__item">
              <div className="stx-features__header">
                <div className="stx-features__icon">🔗</div>
                <h3 className="stx-features__heading">System Integration</h3>
              </div>
              <p className="stx-features__text">Connect disparate systems and create unified platforms for seamless data flow and collaboration.</p>
            </div>
            <div className="stx-features__item">
              <div className="stx-features__header">
                <div className="stx-features__icon">📱</div>
                <h3 className="stx-features__heading">Digital Experience</h3>
              </div>
              <p className="stx-features__text">Create exceptional digital experiences for customers and employees across all touchpoints and devices.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Process Section */}
      <section className="stx-process">
        <div className="stx-section-container">
          <div className="stx-section-header">
            <h2 className="stx-section-title">Digital Transformation Process</h2>
            <p className="stx-section-subtitle">Our proven methodology ensures successful digital transformation with minimal disruption and maximum business impact.</p>
          </div>

          <div className="stx-process__steps">
            <div className="stx-process__step">
              <div className="stx-process__number">1</div>
              <h3 className="stx-process__heading">Assessment & Strategy</h3>
              <p className="stx-process__text">Comprehensive analysis of current state and development of digital transformation strategy aligned with business goals.</p>
              <ul className="stx-process__details">
                <li>Digital maturity assessment</li>
                <li>Technology gap analysis</li>
                <li>Business case development</li>
                <li>Transformation roadmap creation</li>
              </ul>
            </div>

            <div className="stx-process__step">
              <div className="stx-process__number">2</div>
              <h3 className="stx-process__heading">Foundation & Infrastructure</h3>
              <p className="stx-process__text">Establish modern technology foundation and infrastructure to support digital transformation initiatives.</p>
              <ul className="stx-process__details">
                <li>Cloud infrastructure setup</li>
                <li>Data platform implementation</li>
                <li>Security framework establishment</li>
                <li>Integration architecture design</li>
              </ul>
            </div>

            <div className="stx-process__step">
              <div className="stx-process__number">3</div>
              <h3 className="stx-process__heading">Implementation & Optimization</h3>
              <p className="stx-process__text">Execute digital transformation initiatives with continuous optimization and performance improvement.</p>
              <ul className="stx-process__details">
                <li>Phased solution deployment</li>
                <li>Process automation implementation</li>
                <li>User training and adoption</li>
                <li>Performance monitoring and tuning</li>
              </ul>
            </div>

            <div className="stx-process__step">
              <div className="stx-process__number">4</div>
              <h3 className="stx-process__heading">Scale & Innovate</h3>
              <p className="stx-process__text">Scale successful initiatives and drive continuous innovation to maintain competitive advantage.</p>
              <ul className="stx-process__details">
                <li>Solution scaling and expansion</li>
                <li>Innovation framework development</li>
                <li>Continuous improvement processes</li>
                <li>Future technology planning</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="stx-cta">
        <div className="stx-section-container">
          <div className="stx-cta__content">
            <h2 className="stx-cta__title">Ready to Transform Your Business Digitally?</h2>
            <p className="stx-cta__description">Get your free digital transformation assessment and discover how we can accelerate your journey to digital excellence.</p>
            <div className="stx-cta__buttons">
              <a href="/free-prototype" className="stx-button stx-button--primary">Get Free Assessment</a>
              <a href="/contact" className="stx-button stx-button--secondary">Schedule Consultation</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
