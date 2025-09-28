'use client';

import React, { useState, useEffect, useRef } from 'react';
import { HeroSpacer } from '@/components/atoms';

export default function BusinessAutomationPage() {
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
          <span className="stx-solution-hero__badge">Business Automation Solution</span>
          <h1 className="stx-solution-hero__title">Automate Your Business Processes for Maximum Efficiency</h1>
          <p className="stx-solution-hero__subtitle">Transform repetitive tasks into intelligent, automated workflows that operate 24/7. Reduce operational costs by up to 40% while improving accuracy and efficiency across your organization.</p>

          <div className="stx-solution-hero__stats" ref={heroStatsRef}>
            <div className="stx-solution-hero__stat-item">
              <span className="stx-solution-hero__stat-number" data-target="40" data-suffix="%">0%</span>
              <span className="stx-solution-hero__stat-label">Cost Reduction</span>
            </div>
            <div className="stx-solution-hero__stat-item">
              <span className="stx-solution-hero__stat-number" data-target="99" data-suffix="%">0%</span>
              <span className="stx-solution-hero__stat-label">Accuracy Rate</span>
            </div>
            <div className="stx-solution-hero__stat-item">
              <span className="stx-solution-hero__stat-number" data-target="24" data-suffix="/7">0/7</span>
              <span className="stx-solution-hero__stat-label">Operations</span>
            </div>
            <div className="stx-solution-hero__stat-item">
              <span className="stx-solution-hero__stat-number" data-target="70" data-suffix="%">0%</span>
              <span className="stx-solution-hero__stat-label">Time Savings</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Solution Section */}
      <section className="stx-problem-solution">
        <div className="stx-problem-solution__grid">
          <div className="stx-problem-solution__card stx-problem-solution__card--problem">
            <h3 className="stx-problem-solution__card-title stx-problem-solution__card-title--problem">🚫 Manual Process Challenges</h3>
            <ul className="stx-problem-solution__list">
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--problem">Repetitive tasks consuming valuable employee time</li>
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--problem">Human errors causing costly mistakes and delays</li>
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--problem">Inconsistent process execution and quality</li>
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--problem">Limited scalability during peak periods</li>
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--problem">High operational costs and resource waste</li>
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--problem">Difficulty tracking and measuring performance</li>
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--problem">Compliance risks and audit challenges</li>
            </ul>
          </div>
          <div className="stx-problem-solution__card stx-problem-solution__card--solution">
            <h3 className="stx-problem-solution__card-title stx-problem-solution__card-title--solution">🚀 Automation Solutions</h3>
            <ul className="stx-problem-solution__list">
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--solution">Intelligent workflows that operate 24/7 without breaks</li>
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--solution">99%+ accuracy rates eliminating human errors</li>
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--solution">Consistent, standardized process execution</li>
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--solution">Unlimited scalability to handle any workload</li>
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--solution">Significant cost reduction and resource optimization</li>
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--solution">Real-time monitoring and performance analytics</li>
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--solution">Built-in compliance and audit trail capabilities</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Solution Overview Section */}
      <section className="stx-features">
        <div className="stx-section-container">
          <div className="stx-section-header">
            <h2 className="stx-section-title">Comprehensive Business Automation Ecosystem</h2>
            <p className="stx-section-subtitle">End-to-end automation solutions that streamline operations, reduce costs, and improve efficiency across all business functions.</p>
          </div>

          <div className="stx-features__grid">
            <div className="stx-features__item">
              <div className="stx-features__header">
                <div className="stx-features__icon">🤖</div>
                <h3 className="stx-features__heading">Process Automation</h3>
              </div>
              <p className="stx-features__text">Automate repetitive business processes with intelligent workflows that adapt and optimize based on business rules and conditions.</p>
            </div>
            <div className="stx-features__item">
              <div className="stx-features__header">
                <div className="stx-features__icon">📄</div>
                <h3 className="stx-features__heading">Document Processing</h3>
              </div>
              <p className="stx-features__text">Automate document handling, data extraction, and processing with AI-powered recognition and validation.</p>
            </div>
            <div className="stx-features__item">
              <div className="stx-features__header">
                <div className="stx-features__icon">💬</div>
                <h3 className="stx-features__heading">Customer Service Automation</h3>
              </div>
              <p className="stx-features__text">Deploy intelligent chatbots and automated support systems to handle customer inquiries and service requests.</p>
            </div>
            <div className="stx-features__item">
              <div className="stx-features__header">
                <div className="stx-features__icon">📊</div>
                <h3 className="stx-features__heading">Data Analytics</h3>
              </div>
              <p className="stx-features__text">Automate data collection, analysis, and reporting to provide real-time insights and decision support.</p>
            </div>
            <div className="stx-features__item">
              <div className="stx-features__header">
                <div className="stx-features__icon">🔗</div>
                <h3 className="stx-features__heading">System Integration</h3>
              </div>
              <p className="stx-features__text">Connect disparate business systems with automated data synchronization and workflow orchestration.</p>
            </div>
            <div className="stx-features__item">
              <div className="stx-features__header">
                <div className="stx-features__icon">📈</div>
                <h3 className="stx-features__heading">Performance Monitoring</h3>
              </div>
              <p className="stx-features__text">Real-time monitoring and analytics to track automation performance and identify optimization opportunities.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Process Section */}
      <section className="stx-process">
        <div className="stx-section-container">
          <div className="stx-section-header">
            <h2 className="stx-section-title">Business Automation Implementation Process</h2>
            <p className="stx-section-subtitle">Our proven methodology ensures successful automation implementation with minimal disruption and maximum ROI.</p>
          </div>

          <div className="stx-process__steps">
            <div className="stx-process__step">
              <div className="stx-process__number">1</div>
              <h3 className="stx-process__heading">Process Analysis</h3>
              <p className="stx-process__text">Comprehensive analysis of current business processes to identify automation opportunities and quantify potential benefits.</p>
              <ul className="stx-process__details">
                <li>Process mapping and documentation</li>
                <li>Automation opportunity identification</li>
                <li>ROI analysis and business case</li>
                <li>Implementation priority ranking</li>
              </ul>
            </div>

            <div className="stx-process__step">
              <div className="stx-process__number">2</div>
              <h3 className="stx-process__heading">Solution Design</h3>
              <p className="stx-process__text">Design custom automation solutions tailored to your specific business requirements and existing systems.</p>
              <ul className="stx-process__details">
                <li>Automation architecture design</li>
                <li>Integration planning</li>
                <li>User interface design</li>
                <li>Security and compliance planning</li>
              </ul>
            </div>

            <div className="stx-process__step">
              <div className="stx-process__number">3</div>
              <h3 className="stx-process__heading">Development & Testing</h3>
              <p className="stx-process__text">Build and thoroughly test automation solutions to ensure reliability, accuracy, and performance.</p>
              <ul className="stx-process__details">
                <li>Automation development</li>
                <li>Comprehensive testing</li>
                <li>Performance optimization</li>
                <li>User acceptance testing</li>
              </ul>
            </div>

            <div className="stx-process__step">
              <div className="stx-process__number">4</div>
              <h3 className="stx-process__heading">Deployment & Optimization</h3>
              <p className="stx-process__text">Deploy automation solutions with ongoing monitoring, optimization, and continuous improvement.</p>
              <ul className="stx-process__details">
                <li>Phased deployment</li>
                <li>User training and adoption</li>
                <li>Performance monitoring</li>
                <li>Continuous optimization</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="stx-cta">
        <div className="stx-section-container">
          <div className="stx-cta__content">
            <h2 className="stx-cta__title">Ready to Automate Your Business Processes?</h2>
            <p className="stx-cta__description">Get your free automation assessment and discover how we can transform your operations with intelligent automation solutions.</p>
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
