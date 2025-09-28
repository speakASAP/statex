'use client';

import React, { useState, useEffect, useRef } from 'react';
import { HeroSpacer } from '@/components/atoms';

export default function SolutionsPage() {
  // State for animated counters
  const [countersAnimated, setCountersAnimated] = useState(false);
  const heroStatsRef = useRef<HTMLDivElement>(null);

  // Counter animation function
  const animateCounter = (element: HTMLElement, target: number, suffix: string, duration = 2000) => {
    let current = 0;
    const increment = target / (duration / 16);

    // Add counting class for pulse animation
    element.classList.add('counting');

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
        // Remove counting class when animation is complete
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

          // Delay to ensure hero stats are visible first
          setTimeout(() => {
            const statNumbers = entry.target.querySelectorAll('.stx-solution-hero__stat-number[data-target]');

            statNumbers.forEach((stat, index) => {
              const target = parseInt(stat.getAttribute('data-target') || '0');
              const suffix = stat.getAttribute('data-suffix') || '';

              // Reset to 0 and start animation
              stat.textContent = '0' + suffix;

              // Start animation with a staggered delay for each counter
              const delay = index * 150;
              setTimeout(() => {
                animateCounter(stat as HTMLElement, target, suffix, 800);
              }, delay);
            });
          }, 200);
        }
      });
    }, { threshold: 0.3 });

    // Observe the hero stats section
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
          <span className="stx-solution-hero__badge">AI Integration Solution</span>
          <h1 className="stx-solution-hero__title">Transform Your Business with Intelligent AI Integration</h1>
          <p className="stx-solution-hero__subtitle">Harness the full potential of artificial intelligence through comprehensive integration solutions that increase productivity by 60%, reduce costs by 35%, and create new revenue streams across European markets.</p>

          <div className="stx-solution-hero__stats" ref={heroStatsRef}>
            <div className="stx-solution-hero__stat-item">
              <span className="stx-solution-hero__stat-number" data-target="60" data-suffix="%">0%</span>
              <span className="stx-solution-hero__stat-label">Productivity Increase</span>
            </div>
            <div className="stx-solution-hero__stat-item">
              <span className="stx-solution-hero__stat-number" data-target="35" data-suffix="%">0%</span>
              <span className="stx-solution-hero__stat-label">Cost Reduction</span>
            </div>
            <div className="stx-solution-hero__stat-item">
              <span className="stx-solution-hero__stat-number" data-target="24" data-suffix="-48h">0-48h</span>
              <span className="stx-solution-hero__stat-label">Implementation Start</span>
            </div>
            <div className="stx-solution-hero__stat-item">
              <span className="stx-solution-hero__stat-number" data-target="100" data-suffix="%">0%</span>
              <span className="stx-solution-hero__stat-label">EU Compliance</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Solution Section */}
      <section className="stx-problem-solution">
        <div className="stx-problem-solution__grid">
          <div className="stx-problem-solution__card stx-problem-solution__card--problem">
            <h3 className="stx-problem-solution__card-title stx-problem-solution__card-title--problem">🚫 Traditional Challenges</h3>
            <ul className="stx-problem-solution__list">
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--problem">Manual processes slow down operations and create bottlenecks</li>
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--problem">Limited data insights prevent informed decision-making</li>
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--problem">Repetitive tasks consume valuable employee time</li>
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--problem">Inconsistent service quality affects customer satisfaction</li>
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--problem">High operational costs reduce profit margins</li>
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--problem">Difficulty scaling operations without proportional cost increases</li>
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--problem">Competitive disadvantage in rapidly evolving markets</li>
            </ul>
          </div>
          <div className="stx-problem-solution__card stx-problem-solution__card--solution">
            <h3 className="stx-problem-solution__card-title stx-problem-solution__card-title--solution">🚀 AI-Powered Solutions</h3>
            <ul className="stx-problem-solution__list">
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--solution">Automated intelligent workflows that adapt and optimize</li>
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--solution">Predictive analytics provide actionable business insights</li>
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--solution">AI handles routine tasks, freeing employees for strategic work</li>
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--solution">Consistent, personalized customer experiences at scale</li>
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--solution">Optimized operations reduce costs by 35-50%</li>
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--solution">Smart scaling capabilities support unlimited growth</li>
              <li className="stx-problem-solution__list-item stx-problem-solution__list-item--solution">Competitive advantage through cutting-edge AI capabilities</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Solution Overview Section */}
      <section className="stx-features">
        <div className="stx-section-container">
          <div className="stx-section-header">
            <h2 className="stx-section-title">Comprehensive AI Integration Ecosystem</h2>
            <p className="stx-section-subtitle">End-to-end AI integration that transforms traditional business operations into intelligent, self-optimizing systems that learn, adapt, and continuously improve performance.</p>
          </div>

          <div className="stx-features__grid">
            <div className="stx-features__item">
              <div className="stx-features__header">
                <div className="stx-features__icon">🤖</div>
                <h3 className="stx-features__heading">Intelligent Process Automation</h3>
              </div>
              <p className="stx-features__text">Transform business processes with AI that understands context, makes decisions, and adapts to changing conditions while maintaining human oversight.</p>
            </div>
            <div className="stx-features__item">
              <div className="stx-features__header">
                <div className="stx-features__icon">📊</div>
                <h3 className="stx-features__heading">Predictive Analytics & Forecasting</h3>
              </div>
              <p className="stx-features__text">Deploy machine learning models that analyze patterns, predict outcomes, and recommend actions for demand planning and risk management.</p>
            </div>
            <div className="stx-features__item">
              <div className="stx-features__header">
                <div className="stx-features__icon">💬</div>
                <h3 className="stx-features__heading">Natural Language Processing</h3>
              </div>
              <p className="stx-features__text">Enable human-like communication through chatbots, document analysis, and voice interfaces across multiple European languages.</p>
            </div>
            <div className="stx-features__item">
              <div className="stx-features__header">
                <div className="stx-features__icon">👁️</div>
                <h3 className="stx-features__heading">Computer Vision & Recognition</h3>
              </div>
              <p className="stx-features__text">Implement visual AI for quality control, inventory management, security monitoring, and customer experience enhancement.</p>
            </div>
            <div className="stx-features__item">
              <div className="stx-features__header">
                <div className="stx-features__icon">🎯</div>
                <h3 className="stx-features__heading">Intelligent Customer Experience</h3>
              </div>
              <p className="stx-features__text">Create personalized, adaptive customer journeys using AI to deliver the right message at the optimal moment.</p>
            </div>
            <div className="stx-features__item">
              <div className="stx-features__header">
                <div className="stx-features__icon">🧠</div>
                <h3 className="stx-features__heading">AI-Powered Decision Support</h3>
              </div>
              <p className="stx-features__text">Build intelligent systems that analyze complex data and provide actionable recommendations for strategic decisions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Process Section */}
      <section className="stx-process">
        <div className="stx-section-container">
          <div className="stx-section-header">
            <h2 className="stx-section-title">Strategic AI Implementation Process</h2>
            <p className="stx-section-subtitle">Our proven methodology ensures successful AI integration with minimal disruption and maximum impact on your business operations.</p>
          </div>

          <div className="stx-process__steps">
            <div className="stx-process__step">
              <div className="stx-process__number">1</div>
              <h3 className="stx-process__heading">AI Readiness & Strategy Development</h3>
              <p className="stx-process__text">Comprehensive analysis of business processes, data assets, and strategic objectives to identify high-impact AI integration opportunities.</p>
              <ul className="stx-process__details">
                <li>AI opportunity assessment report</li>
                <li>Data readiness evaluation</li>
                <li>Technology infrastructure analysis</li>
                <li>Strategic AI roadmap with business case</li>
              </ul>
            </div>

            <div className="stx-process__step">
              <div className="stx-process__number">2</div>
              <h3 className="stx-process__heading">Foundation & Pilot Implementation</h3>
              <p className="stx-process__text">Implementation of core AI platforms and deployment of initial high-impact AI solution to demonstrate value and validate approach.</p>
              <ul className="stx-process__details">
                <li>AI infrastructure deployment</li>
                <li>Pilot AI project execution</li>
                <li>Team capability development</li>
                <li>Governance framework establishment</li>
              </ul>
            </div>

            <div className="stx-process__step">
              <div className="stx-process__number">3</div>
              <h3 className="stx-process__heading">Comprehensive AI Integration</h3>
              <p className="stx-process__text">Systematic implementation of AI solutions across identified business areas with integration testing and optimization.</p>
              <ul className="stx-process__details">
                <li>Multi-domain AI deployment</li>
                <li>Advanced AI capability development</li>
                <li>Business process enhancement</li>
                <li>Performance monitoring system</li>
              </ul>
            </div>

            <div className="stx-process__step">
              <div className="stx-process__number">4</div>
              <h3 className="stx-process__heading">AI Excellence & Innovation</h3>
              <p className="stx-process__text">Fine-tuning and enhancement of AI systems with implementation of cutting-edge capabilities and innovation framework.</p>
              <ul className="stx-process__details">
                <li>AI system optimization</li>
                <li>Advanced AI feature rollout</li>
                <li>Innovation framework development</li>
                <li>AI Center of Excellence</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="stx-solution-case-studies">
        <div className="stx-section-header">
          <h2 className="stx-section-title">Success Stories from European Businesses</h2>
          <p className="stx-section-subtitle">Real results from companies that transformed their operations with our AI integration solutions.</p>
        </div>

        <div className="stx-solution-case-studies__grid">
          <div className="stx-solution-case-study">
            <div className="stx-solution-case-study__header">
              <div className="stx-solution-case-study__company">Automotive Parts GmbH</div>
              <div className="stx-solution-case-study__industry">Manufacturing • Germany</div>
            </div>
            <div className="stx-solution-case-study__content">
              <div className="stx-solution-case-study__challenge">
                <h4 className="stx-solution-case-study__challenge-title">Challenge</h4>
                <p className="stx-solution-case-study__challenge-description">Quality control inefficiencies and unpredictable equipment maintenance causing production disruptions and safety concerns.</p>
              </div>
              <div className="stx-solution-case-study__results">
                <div className="stx-solution-case-study__result-item">
                  <span className="stx-solution-case-study__result-number">95%</span>
                  <span className="stx-solution-case-study__result-label">Defect Detection</span>
                </div>
                <div className="stx-solution-case-study__result-item">
                  <span className="stx-solution-case-study__result-number">60%</span>
                  <span className="stx-solution-case-study__result-label">Downtime Reduction</span>
                </div>
                <div className="stx-solution-case-study__result-item">
                  <span className="stx-solution-case-study__result-number">€3.2M</span>
                  <span className="stx-solution-case-study__result-label">Annual Savings</span>
                </div>
                <div className="stx-solution-case-study__result-item">
                  <span className="stx-solution-case-study__result-number">0</span>
                  <span className="stx-solution-case-study__result-label">Safety Incidents</span>
                </div>
              </div>
            </div>
          </div>

          <div className="stx-solution-case-study">
            <div className="stx-solution-case-study__header">
              <div className="stx-solution-case-study__company">Construction Solutions Italia</div>
              <div className="stx-solution-case-study__industry">Construction & Infrastructure • Italy</div>
            </div>
            <div className="stx-solution-case-study__content">
              <div className="stx-solution-case-study__challenge">
                <h4 className="stx-solution-case-study__challenge-title">Challenge</h4>
                <p className="stx-solution-case-study__challenge-description">Complex project coordination, resource planning inefficiencies, and subcontractor management issues causing delays and budget overruns.</p>
              </div>
              <div className="stx-solution-case-study__results">
                <div className="stx-solution-case-study__result-item">
                  <span className="stx-solution-case-study__result-number">85%</span>
                  <span className="stx-solution-case-study__result-label">Planning Accuracy</span>
                </div>
                <div className="stx-solution-case-study__result-item">
                  <span className="stx-solution-case-study__result-number">60%</span>
                  <span className="stx-solution-case-study__result-label">Delivery Time</span>
                </div>
                <div className="stx-solution-case-study__result-item">
                  <span className="stx-solution-case-study__result-number">70%</span>
                  <span className="stx-solution-case-study__result-label">Coordination</span>
                </div>
                <div className="stx-solution-case-study__result-item">
                  <span className="stx-solution-case-study__result-number">€3.5M</span>
                  <span className="stx-solution-case-study__result-label">Project Savings</span>
                </div>
              </div>
            </div>
          </div>

          <div className="stx-solution-case-study">
            <div className="stx-solution-case-study__header">
              <div className="stx-solution-case-study__company">Fashion Retail Chain</div>
              <div className="stx-solution-case-study__industry">Retail • Czech Republic</div>
            </div>
            <div className="stx-solution-case-study__content">
              <div className="stx-solution-case-study__challenge">
                <h4 className="stx-solution-case-study__challenge-title">Challenge</h4>
                <p className="stx-solution-case-study__challenge-description">Inventory management inefficiencies and limited personalization affecting sales and customer experience across multiple markets.</p>
              </div>
              <div className="stx-solution-case-study__results">
                <div className="stx-solution-case-study__result-item">
                  <span className="stx-solution-case-study__result-number">40%</span>
                  <span className="stx-solution-case-study__result-label">Forecast Accuracy</span>
                </div>
                <div className="stx-solution-case-study__result-item">
                  <span className="stx-solution-case-study__result-number">35%</span>
                  <span className="stx-solution-case-study__result-label">Inventory Costs</span>
                </div>
                <div className="stx-solution-case-study__result-item">
                  <span className="stx-solution-case-study__result-number">25%</span>
                  <span className="stx-solution-case-study__result-label">Order Value</span>
                </div>
                <div className="stx-solution-case-study__result-item">
                  <span className="stx-solution-case-study__result-number">6</span>
                  <span className="stx-solution-case-study__result-label">New Markets</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="stx-solution-metrics">
        <div className="stx-section-container">
          <div className="stx-section-header">
            <h2 className="stx-section-title">Proven Results Across Industries</h2>
            <p className="stx-section-subtitle">Our AI integration solutions deliver measurable impact across key business metrics</p>
          </div>

          <div className="stx-solution-metrics__grid">
            <div className="stx-solution-metrics__item">
              <span className="stx-solution-metrics__number">60%</span>
              <span className="stx-solution-metrics__label">Average Productivity Gain</span>
            </div>
            <div className="stx-solution-metrics__item">
              <span className="stx-solution-metrics__number">35%</span>
              <span className="stx-solution-metrics__label">Cost Reduction</span>
            </div>
            <div className="stx-solution-metrics__item">
              <span className="stx-solution-metrics__number">95%</span>
              <span className="stx-solution-metrics__label">Error Reduction</span>
            </div>
            <div className="stx-solution-metrics__item">
              <span className="stx-solution-metrics__number">300%</span>
              <span className="stx-solution-metrics__label">Process Speed Increase</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="stx-cta">
        <div className="stx-section-container">
          <div className="stx-cta__content">
            <h2 className="stx-cta__title">Ready to Transform Your Business with AI?</h2>
            <p className="stx-cta__description">Get your free AI integration assessment and discover how intelligent automation can revolutionize your operations in just 24-48 hours.</p>
            <div className="stx-cta__buttons">
              <a href="/free-prototype" className="stx-button stx-button--primary">Get Free AI Assessment</a>
              <a href="/contact" className="stx-button stx-button--secondary">Schedule Consultation</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
