'use client';

import React, { useState, useEffect, useRef } from 'react';
import { HeroSpacer } from '@/components/atoms';

export default function LegacyModernizationPage() {
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
          <span className="stx-solution-hero__badge">Legacy Modernization Solution</span>
          <h1 className="stx-solution-hero__title">Transform Legacy Systems Into Modern, Scalable Solutions</h1>
          <p className="stx-solution-hero__subtitle">Modernize outdated IT infrastructure and legacy systems to unlock business agility, reduce maintenance costs, and accelerate digital transformation across European markets.</p>

          <div className="stx-solution-hero__stats" ref={heroStatsRef}>
            <div className="stx-solution-hero__stat-item">
              <span className="stx-solution-hero__stat-number" data-target="300" data-suffix="%">0%</span>
              <span className="stx-solution-hero__stat-label">Performance Improvement</span>
            </div>
            <div className="stx-solution-hero__stat-item">
              <span className="stx-solution-hero__stat-number" data-target="50" data-suffix="%">0%</span>
              <span className="stx-solution-hero__stat-label">Cost Reduction</span>
            </div>
            <div className="stx-solution-hero__stat-item">
              <span className="stx-solution-hero__stat-number" data-target="0" data-suffix=" Downtime">0 Downtime</span>
              <span className="stx-solution-hero__stat-label">Zero Disruption</span>
            </div>
            <div className="stx-solution-hero__stat-item">
              <span className="stx-solution-hero__stat-number" data-target="100" data-suffix="%">0%</span>
              <span className="stx-solution-hero__stat-label">Data Integrity</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Solution Section */}
      <section className="stx-problem-solution">
        <div className="stx-problem-solution__grid">
          <div className="stx-problem-solution__card stx-problem-solution__card--problem">
            <h3 className="stx-problem-solution__card-title stx-problem-solution__card-title--problem">🚫 Legacy System Challenges</h3>
            <ul className="stx-problem-solution__list">
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--problem">Outdated technology stacks limit business growth</li>
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--problem">High maintenance costs and specialized support requirements</li>
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--problem">Poor performance and scalability limitations</li>
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--problem">Security vulnerabilities and compliance risks</li>
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--problem">Difficulty integrating with modern systems</li>
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--problem">Limited access to new features and capabilities</li>
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--problem">Talent shortage for legacy technologies</li>
            </ul>
          </div>
          <div className="stx-problem-solution__card stx-problem-solution__card--solution">
            <h3 className="stx-problem-solution__card-title stx-problem-solution__card-title--solution">🚀 Modernization Solutions</h3>
            <ul className="stx-problem-solution__list">
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--solution">Cloud-native architectures with unlimited scalability</li>
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--solution">Reduced operational costs and simplified maintenance</li>
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--solution">Enhanced performance and user experience</li>
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--solution">Modern security standards and compliance features</li>
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--solution">Seamless integration with contemporary systems</li>
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--solution">Access to cutting-edge features and capabilities</li>
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--solution">Future-ready technology stack with broad talent pool</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Solution Overview Section */}
      <section className="stx-features">
        <div className="stx-section-container">
          <div className="stx-section-header">
            <h2 className="stx-section-title">Complete Legacy Modernization Ecosystem</h2>
            <p className="stx-section-subtitle">Comprehensive modernization solutions that transform outdated systems into competitive advantages while preserving business continuity and data integrity.</p>
          </div>

          <div className="stx-features__grid">
            <div className="stx-features__item">
              <div className="stx-features__header">
                <div className="stx-features__icon">🔄</div>
                <h3 className="stx-features__heading">Application Modernization</h3>
              </div>
              <p className="stx-features__text">Transform monolithic applications into modern, microservices-based architectures that are easier to maintain, scale, and integrate.</p>
            </div>
            <div className="stx-features__item">
              <div className="stx-features__header">
                <div className="stx-features__icon">☁️</div>
                <h3 className="stx-features__heading">Cloud Migration</h3>
              </div>
              <p className="stx-features__text">Move on-premises systems to secure, scalable cloud environments with optimized performance and reduced operational costs.</p>
            </div>
            <div className="stx-features__item">
              <div className="stx-features__header">
                <div className="stx-features__icon">🗄️</div>
                <h3 className="stx-features__heading">Database Modernization</h3>
              </div>
              <p className="stx-features__text">Migrate legacy databases to modern platforms with improved performance, security, and scalability while ensuring zero data loss.</p>
            </div>
            <div className="stx-features__item">
              <div className="stx-features__header">
                <div className="stx-features__icon">🔗</div>
                <h3 className="stx-features__heading">API Integration</h3>
              </div>
              <p className="stx-features__text">Connect legacy systems with modern applications through robust API layers, enabling seamless data exchange and workflow automation.</p>
            </div>
            <div className="stx-features__item">
              <div className="stx-features__header">
                <div className="stx-features__icon">🛡️</div>
                <h3 className="stx-features__heading">Security Enhancement</h3>
              </div>
              <p className="stx-features__text">Upgrade legacy systems with modern security protocols, encryption standards, and compliance frameworks to meet current regulations.</p>
            </div>
            <div className="stx-features__item">
              <div className="stx-features__header">
                <div className="stx-features__icon">📊</div>
                <h3 className="stx-features__heading">Performance Optimization</h3>
              </div>
              <p className="stx-features__text">Optimize system performance through modern architectures, caching strategies, and efficient resource utilization.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Process Section */}
      <section className="stx-process">
        <div className="stx-section-container">
          <div className="stx-section-header">
            <h2 className="stx-section-title">Strategic Modernization Process</h2>
            <p className="stx-section-subtitle">Our proven methodology ensures successful legacy system transformation with minimal disruption and maximum business value.</p>
          </div>

          <div className="stx-process__steps">
            <div className="stx-process__step">
              <div className="stx-process__number">1</div>
              <h3 className="stx-process__heading">Comprehensive Assessment</h3>
              <p className="stx-process__text">Detailed analysis of existing IT infrastructure using automated assessment tools and expert evaluation to identify modernization opportunities.</p>
              <ul className="stx-process__details">
                <li>Technology stack evaluation</li>
                <li>Business impact analysis</li>
                <li>Risk assessment and mitigation</li>
                <li>Modernization roadmap creation</li>
              </ul>
            </div>

            <div className="stx-process__step">
              <div className="stx-process__number">2</div>
              <h3 className="stx-process__heading">Strategic Planning</h3>
              <p className="stx-process__text">Create detailed transformation plans that prioritize business-critical systems and minimize operational disruption.</p>
              <ul className="stx-process__details">
                <li>Modernization strategy development</li>
                <li>Resource planning and allocation</li>
                <li>Timeline and milestone definition</li>
                <li>Success metrics establishment</li>
              </ul>
            </div>

            <div className="stx-process__step">
              <div className="stx-process__number">3</div>
              <h3 className="stx-process__heading">Phased Implementation</h3>
              <p className="stx-process__text">Execute modernization in carefully planned phases that maintain business continuity and ensure consistent results.</p>
              <ul className="stx-process__details">
                <li>Incremental system migration</li>
                <li>Data migration and validation</li>
                <li>Integration testing and optimization</li>
                <li>Performance monitoring and tuning</li>
              </ul>
            </div>

            <div className="stx-process__step">
              <div className="stx-process__number">4</div>
              <h3 className="stx-process__heading">Training & Support</h3>
              <p className="stx-process__text">Comprehensive training programs help teams adapt to modernized systems quickly and maximize productivity.</p>
              <ul className="stx-process__details">
                <li>User training and documentation</li>
                <li>System administration training</li>
                <li>Ongoing support and maintenance</li>
                <li>Continuous improvement planning</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="stx-cta">
        <div className="stx-section-container">
          <div className="stx-cta__content">
            <h2 className="stx-cta__title">Ready to Modernize Your Legacy Systems?</h2>
            <p className="stx-cta__description">Get your free modernization assessment and discover how we can transform your outdated systems into modern, scalable solutions.</p>
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
