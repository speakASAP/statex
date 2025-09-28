'use client';

import React from 'react';
import '../legal.css';
import { HeroSpacer } from '@/components/atoms';
import { env } from '@/config/env';

export default function PrivacyPolicyPage() {
  return (
    <>
      <HeroSpacer />
      {/* Legal Header */}
      <section className="stx-legal-header">
        <div className="stx-container">
          <div className="stx-legal-header__container">
            <div className="stx-legal-header__badge">Legal Document</div>
            <h1 className="stx-section-title">Privacy Policy</h1>
            <p className="stx-section-subtitle">We are committed to protecting your privacy and ensuring the security of your personal information in compliance with GDPR and European data protection standards.</p>

            <div className="stx-legal-header__meta">
              <div className="stx-legal-header__meta-item">
                <span className="stx-legal-header__meta-icon">📅</span>
                Last Updated: June 27, 2025
              </div>
              <div className="stx-legal-header__meta-item">
                <span className="stx-legal-header__meta-icon">🌍</span>
                Applies to: EU Residents
              </div>
              <div className="stx-legal-header__meta-item">
                <span className="stx-legal-header__meta-icon">⚖️</span>
                GDPR Compliant
              </div>
              <div className="stx-legal-header__meta-item">
                <span className="stx-legal-header__meta-icon">🔒</span>
                Data Protected
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Content Layout */}
      <div className="stx-container">
        <div className="stx-legal-layout">
          {/* Navigation Sidebar */}
          <aside className="stx-legal-nav">
            <h3 className="stx-legal-nav__title">Table of Contents</h3>
            <ul className="stx-legal-nav__list">
              <li className="stx-legal-nav__list-item"><a href="#section-1" className="stx-legal-nav__link">Information We Collect</a></li>
              <li className="stx-legal-nav__list-item"><a href="#section-2" className="stx-legal-nav__link">How We Use Information</a></li>
              <li className="stx-legal-nav__list-item"><a href="#section-3" className="stx-legal-nav__link">Data Sharing & Disclosure</a></li>
              <li className="stx-legal-nav__list-item"><a href="#section-4" className="stx-legal-nav__link">Your Rights Under GDPR</a></li>
              <li className="stx-legal-nav__list-item"><a href="#section-5" className="stx-legal-nav__link">Data Security</a></li>
              <li className="stx-legal-nav__list-item"><a href="#section-6" className="stx-legal-nav__link">Cookies & Tracking</a></li>
              <li className="stx-legal-nav__list-item"><a href="#section-7" className="stx-legal-nav__link">International Transfers</a></li>
              <li className="stx-legal-nav__list-item"><a href="#section-8" className="stx-legal-nav__link">Data Retention</a></li>
              <li className="stx-legal-nav__list-item"><a href="#section-9" className="stx-legal-nav__link">Children's Privacy</a></li>
              <li className="stx-legal-nav__list-item"><a href="#section-10" className="stx-legal-nav__link">Changes to Policy</a></li>
              <li className="stx-legal-nav__list-item"><a href="#contact" className="stx-legal-nav__link">Contact Information</a></li>
            </ul>

            <div className="stx-legal-nav__compliance-indicator">
              <div className="stx-legal-nav__compliance-title">
                <span>🛡️</span>
                GDPR Compliant
              </div>
              <p className="stx-legal-nav__compliance-text">This policy meets all requirements of the General Data Protection Regulation (EU) 2016/679.</p>
            </div>
          </aside>

          {/* Main Content */}
          <main className="stx-legal-content">
            <div className="stx-legal-content__header">
              <div className="stx-legal-content__last-updated">
                <strong>Last Updated:</strong> June 27, 2025 • <strong>Effective Date:</strong> June 27, 2025
              </div>

              <div className="stx-legal-content__summary">
                <h3 className="stx-legal-content__summary-title">Privacy Policy Summary</h3>
                <p className="stx-legal-content__summary-text">This Privacy Policy explains how Statex ("we," "our," or "us") collects, uses, and protects your personal information when you use our AI-powered development services. We are committed to transparency and giving you control over your data in accordance with GDPR requirements.</p>
              </div>
            </div>

            {/* Section 1 */}
            <section className="stx-legal-section" id="section-1">
              <h2><span className="stx-legal-section__number">1</span>Information We Collect</h2>

              <h3>1.1 Personal Information</h3>
              <p>We collect the following types of personal information when you use our services:</p>
              <ul>
                <li><strong>Contact Information:</strong> Name, email address, phone number, company name</li>
                <li><strong>Project Information:</strong> Technical specifications, project descriptions, uploaded files</li>
                <li><strong>Communication Data:</strong> Voice recordings, chat messages, support inquiries</li>
                <li><strong>Account Information:</strong> Username, password, preferences, service history</li>
              </ul>

              <h3>1.2 Technical Information</h3>
              <p>We automatically collect certain technical information:</p>
              <ul>
                <li><strong>Device Information:</strong> IP address, browser type, operating system</li>
                <li><strong>Usage Data:</strong> Pages visited, features used, time spent on services</li>
                <li><strong>Performance Data:</strong> Error logs, response times, system performance metrics</li>
              </ul>

              <div className="stx-legal-section__gdpr-highlight">
                <h4 className="stx-legal-section__gdpr-title">
                  <span>🛡️</span>
                  GDPR Lawful Basis
                </h4>
                <p>We process your personal data based on the following lawful bases under GDPR Article 6:</p>
                <ul>
                  <li><strong>Contract Performance:</strong> To provide our development services</li>
                  <li><strong>Legitimate Interest:</strong> To improve our services and ensure security</li>
                  <li><strong>Consent:</strong> For marketing communications (where obtained)</li>
                </ul>
              </div>
            </section>

            {/* Section 2 */}
            <section className="stx-legal-section" id="section-2">
              <h2><span className="stx-legal-section__number">2</span>How We Use Your Information</h2>

              <p>We use your personal information for the following purposes:</p>

              <h3>2.1 Service Delivery</h3>
              <ul>
                <li>Creating and delivering prototype applications</li>
                <li>Processing your project requirements using AI analysis</li>
                <li>Providing customer support and technical assistance</li>
                <li>Communicating about your projects and services</li>
              </ul>

              <h3>2.2 Service Improvement</h3>
              <ul>
                <li>Analyzing usage patterns to improve our AI algorithms</li>
                <li>Conducting quality assurance and testing</li>
                <li>Developing new features and services</li>
                <li>Ensuring security and preventing fraud</li>
              </ul>

              <h3>2.3 Legal and Compliance</h3>
              <ul>
                <li>Complying with legal obligations and regulations</li>
                <li>Protecting our rights and property</li>
                <li>Responding to legal requests and preventing harm</li>
              </ul>

              <div className="stx-legal-section__important-notice">
                <h4 className="stx-legal-section__notice-title">
                  <span>⚠️</span>
                  Important Notice
                </h4>
                <p className="stx-legal-section__notice-content">We never sell your personal data to third parties. Your project information and source code remain confidential and are used solely for delivering our services to you.</p>
              </div>
            </section>

            {/* Section 3 */}
            <section className="stx-legal-section" id="section-3">
              <h2><span className="stx-legal-section__number">3</span>Data Sharing & Disclosure</h2>

              <p>We may share your information in the following limited circumstances:</p>

              <h3>3.1 Service Providers</h3>
              <p>We work with trusted third-party service providers who assist us in delivering our services:</p>

              <table className="stx-legal-table">
                <thead>
                  <tr>
                    <th>Service Provider</th>
                    <th>Purpose</th>
                    <th>Data Shared</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Cloud Hosting</td>
                    <td>Application hosting and storage</td>
                    <td>Project data, user accounts</td>
                    <td>EU (GDPR compliant)</td>
                  </tr>
                  <tr>
                    <td>Email Services</td>
                    <td>Communication and notifications</td>
                    <td>Email addresses, names</td>
                    <td>EU (GDPR compliant)</td>
                  </tr>
                  <tr>
                    <td>Analytics</td>
                    <td>Usage analysis and improvement</td>
                    <td>Anonymized usage data</td>
                    <td>EU (GDPR compliant)</td>
                  </tr>
                </tbody>
              </table>

              <h3>3.2 Legal Requirements</h3>
              <p>We may disclose your information if required by law or to:</p>
              <ul>
                <li>Comply with legal process or governmental requests</li>
                <li>Enforce our terms of service</li>
                <li>Protect the rights, property, or safety of our company, users, or others</li>
                <li>Investigate fraud or security issues</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="stx-legal-section" id="section-4">
              <h2><span className="stx-legal-section__number">4</span>Your Rights Under GDPR</h2>

              <p>As a European resident, you have the following rights regarding your personal data:</p>

              <h3>4.1 Individual Rights</h3>
              <ul>
                <li><strong>Right of Access:</strong> Request a copy of your personal data</li>
                <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
                <li><strong>Right to Restrict Processing:</strong> Limit how we use your data</li>
                <li><strong>Right to Data Portability:</strong> Receive your data in a portable format</li>
                <li><strong>Right to Object:</strong> Object to processing based on legitimate interests</li>
                <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for data processing</li>
              </ul>

              <h3>4.2 Exercising Your Rights</h3>
              <p>To exercise any of these rights, please contact us using the information provided in the Contact section. We will respond to your request within 30 days as required by GDPR.</p>

              <div className="stx-legal-section__gdpr-highlight">
                <h4 className="stx-legal-section__gdpr-title">
                  <span>📞</span>
                  Data Protection Officer
                </h4>
                <p>For any data protection concerns, you can contact our Data Protection Officer at: <strong>{env.DPO_EMAIL}</strong></p>
              </div>
            </section>

            {/* Section 5 */}
            <section className="stx-legal-section" id="section-5">
              <h2><span className="stx-legal-section__number">5</span>Data Security</h2>

              <p>We implement comprehensive security measures to protect your personal information:</p>

              <h3>5.1 Technical Safeguards</h3>
              <ul>
                <li><strong>Encryption:</strong> All data is encrypted in transit and at rest using AES-256</li>
                <li><strong>Access Controls:</strong> Role-based access with multi-factor authentication</li>
                <li><strong>Network Security:</strong> Firewalls, intrusion detection, and monitoring</li>
                <li><strong>Regular Audits:</strong> Security assessments and penetration testing</li>
              </ul>

              <h3>5.2 Organizational Measures</h3>
              <ul>
                <li>Employee training on data protection and security</li>
                <li>Confidentiality agreements with all personnel</li>
                <li>Incident response and breach notification procedures</li>
                <li>Regular security policy reviews and updates</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section className="stx-legal-section" id="section-6">
              <h2><span className="stx-legal-section__number">6</span>Cookies & Tracking</h2>

              <p>We use cookies and similar technologies to:</p>
              <ul>
                <li>Improve website functionality</li>
                <li>Analyze website traffic</li>
                <li>Personalize your experience</li>
              </ul>
              <p>You can control cookie settings through your browser preferences.</p>
            </section>

            {/* Section 7 */}
            <section className="stx-legal-section" id="section-7">
              <h2><span className="stx-legal-section__number">7</span>International Transfers</h2>

              <p>Your personal information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.</p>
            </section>

            {/* Section 8 */}
            <section className="stx-legal-section" id="section-8">
              <h2><span className="stx-legal-section__number">8</span>Data Retention</h2>

              <p>We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law.</p>
            </section>

            {/* Section 9 */}
            <section className="stx-legal-section" id="section-9">
              <h2><span className="stx-legal-section__number">9</span>Children's Privacy</h2>

              <p>Our services are not intended for children under 16. We do not knowingly collect personal information from children under 16.</p>
            </section>

            {/* Section 10 */}
            <section className="stx-legal-section" id="section-10">
              <h2><span className="stx-legal-section__number">10</span>Changes to This Policy</h2>

              <div className="stx-legal-section__important-notice">
                <h4 className="stx-legal-section__notice-title">
                  <span>⚠️</span>
                  Important Notice
                </h4>
                <p className="stx-legal-section__notice-content">
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date.
                </p>
              </div>
            </section>

            {/* Contact Section */}
            <section className="stx-legal-contact" id="contact">
              <h3 className="stx-legal-contact__title">Contact Information</h3>
              <p>If you have any questions about this Privacy Policy or wish to exercise your data protection rights, please contact us:</p>

              <div className="stx-legal-contact__info">
                <div className="stx-legal-contact__item">
                  <span className="stx-legal-contact__icon">📧</span>
                  <span>{env.PRIVACY_EMAIL}</span>
                </div>
                <div className="stx-legal-contact__item">
                  <span className="stx-legal-contact__icon">📞</span>
                  <span>+420 774 287 541</span>
                </div>
                <div className="stx-legal-contact__item">
                  <span className="stx-legal-contact__icon">📍</span>
                  <span>Czech Republic</span>
                </div>
                <div className="stx-legal-contact__item">
                  <span className="stx-legal-contact__icon">⚖️</span>
                  <span>DPO: {env.DPO_EMAIL}</span>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
          // Smooth scrolling for navigation links
          document.querySelectorAll('.stx-legal-nav__link[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
              e.preventDefault();

              // Update active state
              document.querySelectorAll('.stx-legal-nav__link').forEach(link => link.classList.remove('stx-legal-nav__link--active'));
              this.classList.add('stx-legal-nav__link--active');

              // Smooth scroll to target
              const target = document.querySelector(this.getAttribute('href'));
              if (target) {
                target.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start'
                });
              }
            });
          });

          // Update active navigation on scroll
          const sections = document.querySelectorAll('.stx-legal-section, .stx-legal-contact');
          const navLinks = document.querySelectorAll('.stx-legal-nav__link');

          const observerOptions = {
            rootMargin: '-100px 0px -70% 0px',
            threshold: 0
          };

          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                const correspondingNavLink = document.querySelector(\`.stx-legal-nav__link[href="#\${id}"]\`);

                if (correspondingNavLink) {
                  navLinks.forEach(link => link.classList.remove('stx-legal-nav__link--active'));
                  correspondingNavLink.classList.add('stx-legal-nav__link--active');
                }
              }
            });
          }, observerOptions);

          sections.forEach(section => {
            observer.observe(section);
          });
        `
      }} />
    </>
  );
}
