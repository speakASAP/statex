'use client';

import React, { useState } from 'react';
import { HeroSpacer } from '@/components/atoms';
import { FormSection } from '@/components/sections/FormSection';

export default function FreePrototypePage() {
  // FAQ accordion functionality
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  return (
    <div className="stx-page">
      <HeroSpacer />
      {/* Hero Section */}
      <section className="stx-hero">
        <div className="stx-hero__content">
          <div className="stx-badge">100% FREE • NO COMMITMENT</div>
          <h1 className="stx-hero__title">Get Your Working Prototype in 24-48 Hours</h1>
          <p className="stx-hero__subtitle">Experience the future of rapid development. Describe your idea through voice, text, or files, and receive a fully functional prototype — completely free with one modification included.</p>

          <div className="stx-guarantees">
            <div className="stx-guarantee-item">
              <div className="stx-guarantee-icon">⚡</div>
              <div className="stx-guarantee-text">24-48 Hour Delivery</div>
            </div>
            <div className="stx-guarantee-item">
              <div className="stx-guarantee-icon">🆓</div>
              <div className="stx-guarantee-text">Completely Free</div>
            </div>
            <div className="stx-guarantee-item">
              <div className="stx-guarantee-icon">🔧</div>
              <div className="stx-guarantee-text">One Free Modification</div>
            </div>
            <div className="stx-guarantee-item">
              <div className="stx-guarantee-icon">🚀</div>
              <div className="stx-guarantee-text">Production Ready</div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Block */}
      <section className="stx-form-block">
        <div className="stx-form-block__container">
          <div className="stx-section-header">
            <h1 className="stx-section-title">Submit your requirements</h1>
            <p className="stx-section-subtitle">Tell us about your idea — we'll create a working prototype for free</p>
          </div>

          <div className="stx-form__container">
            <FormSection
              pageType="prototype"
              variant="prototype"
              title="Get Your Free Prototype"
              subtitle="No commitment required • Delivered within 24-48 hours"
              showVoiceRecording={true}
              showFileUpload={true}
              showContactFields={true}
              placeholder="💡 Describe your idea - Tell us about your idea in a way you explain it to your friend:
• What do you want
• What problem are you solving
• How is this problem currently being solved
• What do you want to automate or improve
• What results do you expect
• Any additional details..."
              submitButtonText="🚀 Get Prototype in 24 Hours"
            />
          </div>
        </div>
      </section>


      {/* Process Section */}
      <section className="stx-process">
        <div className="stx-section-container">
          <div className="stx-section-header">
            <h2 className="stx-section-title">How Our Free Prototype Process Works</h2>
            <p className="stx-section-subtitle">From your initial idea to a working prototype in just 4 simple steps. No hidden fees, no commitments—just results.</p>
          </div>

          <div className="stx-timeline">
            <div className="stx-timeline-item">
              <div className="stx-timeline-number">1</div>
              <div className="stx-timeline-content">
                <h3 className="stx-timeline-title">Share Your Vision</h3>
                <p className="stx-timeline-description">Describe your project through voice recording, detailed text, or file uploads. The more details you provide, the better we can understand your needs.</p>
                <div className="stx-timeline-details">
                  <ul>
                    <li><span className="stx-check-icon">✓</span> Voice message recording (up to 10 minutes)</li>
                    <li><span className="stx-check-icon">✓</span> Detailed text descriptions</li>
                    <li><span className="stx-check-icon">✓</span> File uploads (documents, images, sketches)</li>
                    <li><span className="stx-check-icon">✓</span> Reference websites or applications</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="stx-timeline-item">
              <div className="stx-timeline-number">2</div>
              <div className="stx-timeline-content">
                <h3 className="stx-timeline-title">AI Analysis & Planning</h3>
                <p className="stx-timeline-description">Our advanced AI system analyzes your requirements, identifies key features, and creates a comprehensive development plan.</p>
                <div className="stx-timeline-details">
                  <ul>
                    <li><span className="stx-check-icon">✓</span> Requirement analysis and feature extraction</li>
                    <li><span className="stx-check-icon">✓</span> Technical architecture planning</li>
                    <li><span className="stx-check-icon">✓</span> UI/UX design recommendations</li>
                    <li><span className="stx-check-icon">✓</span> Development timeline estimation</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="stx-timeline-item">
              <div className="stx-timeline-number">3</div>
              <div className="stx-timeline-content">
                <h3 className="stx-timeline-title">Rapid Development</h3>
                <p className="stx-timeline-description">Our expert team combines AI-generated code with human expertise to build your prototype using modern technologies and best practices.</p>
                <div className="stx-timeline-details">
                  <ul>
                    <li><span className="stx-check-icon">✓</span> AI-assisted code generation</li>
                    <li><span className="stx-check-icon">✓</span> Human review and optimization</li>
                    <li><span className="stx-check-icon">✓</span> Responsive design implementation</li>
                    <li><span className="stx-check-icon">✓</span> Quality assurance testing</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="stx-timeline-item">
              <div className="stx-timeline-number">4</div>
              <div className="stx-timeline-content">
                <h3 className="stx-timeline-title">Delivery & Refinement</h3>
                <p className="stx-timeline-description">Receive your live, hosted prototype with full functionality. Test everything and request one free modification to perfect your vision.</p>
                <div className="stx-timeline-details">
                  <ul>
                    <li><span className="stx-check-icon">✓</span> Live hosted prototype on our platform</li>
                    <li><span className="stx-check-icon">✓</span> Complete source code access</li>
                    <li><span className="stx-check-icon">✓</span> Documentation and setup instructions</li>
                    <li><span className="stx-check-icon">✓</span> One free modification included</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deliverables Section */}
      <section className="stx-deliverables">
        <div className="stx-section-container">
          <div className="stx-section-header">
            <h2 className="stx-section-title">What You'll Receive</h2>
            <p className="stx-section-subtitle">Your free prototype includes everything you need to evaluate and continue development.</p>
          </div>

          <div className="stx-deliverables-grid">
            <div className="stx-deliverable-card">
              <div className="stx-deliverable-icon">🚀</div>
              <h3 className="stx-deliverable-title">Live Working Prototype</h3>
              <p className="stx-deliverable-description">Fully functional application hosted on our platform with all core features implemented and ready for testing.</p>
              <ul className="stx-deliverable-features">
                <li><span className="stx-check-icon">✓</span> Live hosted application</li>
                <li><span className="stx-check-icon">✓</span> Responsive mobile design</li>
                <li><span className="stx-check-icon">✓</span> Core functionality implemented</li>
                <li><span className="stx-check-icon">✓</span> Test data and examples</li>
              </ul>
            </div>

            <div className="stx-deliverable-card">
              <div className="stx-deliverable-icon">💻</div>
              <h3 className="stx-deliverable-title">Complete Source Code</h3>
              <p className="stx-deliverable-description">Full access to clean, documented source code using modern technologies and best practices.</p>
              <ul className="stx-deliverable-features">
                <li><span className="stx-check-icon">✓</span> Clean, commented code</li>
                <li><span className="stx-check-icon">✓</span> Modern framework (React/Next.js)</li>
                <li><span className="stx-check-icon">✓</span> Database schema and setup</li>
                <li><span className="stx-check-icon">✓</span> Development documentation</li>
              </ul>
            </div>

            <div className="stx-deliverable-card">
              <div className="stx-deliverable-icon">📋</div>
              <h3 className="stx-deliverable-title">Technical Documentation</h3>
              <p className="stx-deliverable-description">Comprehensive documentation including setup instructions, feature explanations, and development roadmap.</p>
              <ul className="stx-deliverable-features">
                <li><span className="stx-check-icon">✓</span> Setup and installation guide</li>
                <li><span className="stx-check-icon">✓</span> Feature documentation</li>
                <li><span className="stx-check-icon">✓</span> API documentation</li>
                <li><span className="stx-check-icon">✓</span> Future development roadmap</li>
              </ul>
            </div>

            <div className="stx-deliverable-card">
              <div className="stx-deliverable-icon">🔧</div>
              <h3 className="stx-deliverable-title">One Free Modification</h3>
              <p className="stx-deliverable-description">After reviewing your prototype, request one free modification to better align with your vision.</p>
              <ul className="stx-deliverable-features">
                <li><span className="stx-check-icon">✓</span> Feature adjustments</li>
                <li><span className="stx-check-icon">✓</span> Design modifications</li>
                <li><span className="stx-check-icon">✓</span> Additional functionality</li>
                <li><span className="stx-check-icon">✓</span> Performance optimizations</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="stx-faq">
        <div className="stx-section-container">
          <div className="stx-section-header">
            <h2 className="stx-section-title">Frequently Asked Questions</h2>
            <p className="stx-section-subtitle">Get answers to common questions about our free prototype service.</p>
          </div>

          <div className="stx-faq-container">
            <div className={`stx-faq-item ${activeFAQ === 0 ? 'stx-faq-item--active' : ''}`}>
              <button className="stx-faq-question" onClick={() => toggleFAQ(0)}>
                Is the prototype really completely free?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>Yes, absolutely! There are no hidden fees, no credit card required, and no commitment. We provide a fully functional prototype including source code and documentation at no cost.</p>
              </div>
            </div>

            <div className={`stx-faq-item ${activeFAQ === 1 ? 'stx-faq-item--active' : ''}`}>
              <button className="stx-faq-question" onClick={() => toggleFAQ(1)}>
                How long does it take to receive my prototype?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>Most prototypes are delivered within 24-48 hours. Complex projects may take up to 72 hours. We'll provide you with a specific timeline after reviewing your requirements.</p>
              </div>
            </div>

            <div className={`stx-faq-item ${activeFAQ === 2 ? 'stx-faq-item--active' : ''}`}>
              <button className="stx-faq-question" onClick={() => toggleFAQ(2)}>
                What technologies do you use for prototypes?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>We use modern, industry-standard technologies including React, Next.js, Node.js, and PostgreSQL. All prototypes are built with production-ready code and best practices.</p>
              </div>
            </div>

            <div className={`stx-faq-item ${activeFAQ === 3 ? 'stx-faq-item--active' : ''}`}>
              <button className="stx-faq-question" onClick={() => toggleFAQ(3)}>
                Can I use the prototype for my business?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>Yes! The prototype and source code are yours to use, modify, and deploy. You have full ownership and can continue development with any team or use it as-is.</p>
              </div>
            </div>

            <div className={`stx-faq-item ${activeFAQ === 4 ? 'stx-faq-item--active' : ''}`}>
              <button className="stx-faq-question" onClick={() => toggleFAQ(4)}>
                What if I need changes to the prototype?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>One modification is included free of charge. Additional changes can be made through our paid development services, but you're also free to modify the code yourself or hire any developer.</p>
              </div>
            </div>

            <div className={`stx-faq-item ${activeFAQ === 5 ? 'stx-faq-item--active' : ''}`}>
              <button className="stx-faq-question" onClick={() => toggleFAQ(5)}>
                Do you provide ongoing support?
                <span className="stx-faq-icon">▼</span>
              </button>
              <div className="stx-faq-answer">
                <p>The prototype includes basic documentation and setup support. For ongoing development, maintenance, and support, we offer paid service plans starting from €9.90/month.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
