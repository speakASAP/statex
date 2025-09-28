import React from 'react';
import { Metadata } from 'next';
import { LegalContentSection } from '@/components/sections/LegalContentSection';
import { HeroSpacer } from '@/components/atoms';

export const metadata: Metadata = {
  title: 'Cookie Policy | Statex - Cookie Usage and Consent',
  description: 'Learn about how Statex uses cookies and similar technologies to enhance your browsing experience and manage your preferences.',
  keywords: 'cookie policy, cookies, tracking, consent, GDPR, Statex',
  openGraph: {
    title: 'Cookie Policy | Statex',
    description: 'Comprehensive cookie policy and consent management',
    type: 'website',
  },
};

const cookiePolicyContent = {
  title: 'Cookie Policy',
  subtitle: 'How we use cookies and similar technologies',
  lastUpdated: '2024-01-15',
  sections: [
    {
      id: 'introduction',
      title: 'What Are Cookies?',
      content: `
        <div class="stx-cookie-policy-content">
          <p>Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit our website. They help us provide you with a better experience by:</p>
          <ul class="stx-cookie-policy-list">
            <li>Remembering your preferences and settings</li>
            <li>Analyzing how you use our website</li>
            <li>Personalizing content and advertisements</li>
            <li>Ensuring security and preventing fraud</li>
          </ul>

          <p>This Cookie Policy explains how Statex uses cookies and similar technologies on our website.</p>
        </div>
      `
    },
    {
      id: 'cookie-types',
      title: 'Types of Cookies We Use',
      content: `
        <div class="stx-cookie-policy-content">
          <h4 class="stx-cookie-policy-subtitle">1. Essential Cookies</h4>
          <p>These cookies are necessary for the website to function properly and cannot be disabled.</p>
          <ul class="stx-cookie-policy-list">
            <li><strong>Session Management:</strong> Maintain your login status and session information</li>
            <li><strong>Security:</strong> Protect against fraud and ensure secure transactions</li>
            <li><strong>Language Preferences:</strong> Remember your language choice</li>
            <li><strong>Form Functionality:</strong> Enable contact forms and other interactive features</li>
          </ul>

          <h4 class="stx-cookie-policy-subtitle">2. Analytics Cookies</h4>
          <p>These cookies help us understand how visitors interact with our website.</p>
          <ul class="stx-cookie-policy-list">
            <li><strong>Google Analytics:</strong> Track page views, user behavior, and website performance</li>
            <li><strong>Performance Monitoring:</strong> Monitor website speed and technical issues</li>
            <li><strong>User Journey Analysis:</strong> Understand how users navigate our site</li>
          </ul>

          <h4 class="stx-cookie-policy-subtitle">3. Marketing Cookies</h4>
          <p>These cookies are used to deliver relevant advertisements and track marketing campaign effectiveness.</p>
          <ul class="stx-cookie-policy-list">
            <li><strong>Retargeting:</strong> Show relevant ads based on your previous visits</li>
            <li><strong>Social Media Integration:</strong> Enable sharing and social media features</li>
            <li><strong>Campaign Tracking:</strong> Measure the effectiveness of marketing campaigns</li>
          </ul>

          <h4 class="stx-cookie-policy-subtitle">4. Preference Cookies</h4>
          <p>These cookies remember your choices and preferences to provide a personalized experience.</p>
          <ul class="stx-cookie-policy-list">
            <li><strong>Theme Preferences:</strong> Remember your color scheme or layout choices</li>
            <li><strong>Content Preferences:</strong> Remember your content interests and settings</li>
            <li><strong>Accessibility Settings:</strong> Remember accessibility preferences</li>
          </ul>
        </div>
      `
    },
    {
      id: 'specific-cookies',
      title: 'Specific Cookies We Use',
      content: `
        <div class="stx-cookie-policy-content">
          <h4 class="stx-cookie-policy-subtitle">Essential Cookies</h4>
          <table class="stx-cookie-policy-table">
            <thead>
              <tr>
                <th>Cookie Name</th>
                <th>Purpose</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>statex_session</td>
                <td>Session management and security</td>
                <td>Session</td>
              </tr>
              <tr>
                <td>statex_language</td>
                <td>Language preference</td>
                <td>1 year</td>
              </tr>
              <tr>
                <td>statex_consent</td>
                <td>Cookie consent preferences</td>
                <td>1 year</td>
              </tr>
            </tbody>
          </table>

          <h4 class="stx-cookie-policy-subtitle">Analytics Cookies</h4>
          <table class="stx-cookie-policy-table">
            <thead>
              <tr>
                <th>Cookie Name</th>
                <th>Purpose</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>_ga</td>
                <td>Google Analytics - distinguish users</td>
                <td>2 years</td>
              </tr>
              <tr>
                <td>_ga_*</td>
                <td>Google Analytics - session state</td>
                <td>2 years</td>
              </tr>
              <tr>
                <td>_gid</td>
                <td>Google Analytics - distinguish users</td>
                <td>24 hours</td>
              </tr>
            </tbody>
          </table>

          <h4 class="stx-cookie-policy-subtitle">Marketing Cookies</h4>
          <table class="stx-cookie-policy-table">
            <thead>
              <tr>
                <th>Cookie Name</th>
                <th>Purpose</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>_fbp</td>
                <td>Facebook Pixel - ad delivery</td>
                <td>3 months</td>
              </tr>
              <tr>
                <td>_fbc</td>
                <td>Facebook Pixel - conversion tracking</td>
                <td>2 years</td>
              </tr>
            </tbody>
          </table>
        </div>
      `
    },
    {
      id: 'third-party-cookies',
      title: 'Third-Party Cookies',
      content: `
        <div class="stx-cookie-policy-content">
          <p>We may use third-party services that place their own cookies on your device:</p>

          <h4 class="stx-cookie-policy-subtitle">Google Analytics</h4>
          <p>We use Google Analytics to understand how visitors use our website. Google Analytics uses cookies to collect information about your use of our website, including:</p>
          <ul class="stx-cookie-policy-list">
            <li>Pages you visit and time spent on each page</li>
            <li>How you arrived at our website</li>
            <li>Your device and browser information</li>
            <li>General location information (country/city level)</li>
          </ul>

          <h4 class="stx-cookie-policy-subtitle">Social Media Platforms</h4>
          <p>We may integrate social media features that use cookies from platforms such as:</p>
          <ul class="stx-cookie-policy-list">
            <li>Facebook (for sharing and advertising)</li>
            <li>LinkedIn (for professional networking)</li>
            <li>Twitter (for social sharing)</li>
          </ul>

          <h4 class="stx-cookie-policy-subtitle">Advertising Networks</h4>
          <p>We may use advertising networks that place cookies to:</p>
          <ul class="stx-cookie-policy-list">
            <li>Show relevant advertisements</li>
            <li>Track ad performance</li>
            <li>Prevent fraud</li>
          </ul>

          <p>These third-party cookies are subject to the privacy policies of the respective third-party providers.</p>
        </div>
      `
    },
    {
      id: 'cookie-consent',
      title: 'Cookie Consent and Management',
      content: `
        <div class="stx-cookie-policy-content">
          <h4 class="stx-cookie-policy-subtitle">Your Cookie Choices</h4>
          <p>You have control over which cookies are placed on your device:</p>
          <ul class="stx-cookie-policy-list">
            <li><strong>Essential Cookies:</strong> Cannot be disabled (required for website functionality)</li>
            <li><strong>Analytics Cookies:</strong> Toggle on/off for website usage analysis</li>
            <li><strong>Marketing Cookies:</strong> Toggle on/off for personalized advertising</li>
            <li><strong>Preference Cookies:</strong> Toggle on/off for personalized experience</li>
          </ul>

          <h4 class="stx-cookie-policy-subtitle">Impact of Disabling Cookies</h4>
          <p>Disabling certain cookies may affect your experience:</p>
          <ul class="stx-cookie-policy-list">
            <li><strong>Essential Cookies:</strong> Website may not function properly</li>
            <li><strong>Analytics Cookies:</strong> We won't be able to improve our website based on usage data</li>
            <li><strong>Marketing Cookies:</strong> You may see less relevant advertisements</li>
            <li><strong>Preference Cookies:</strong> Your preferences won't be remembered</li>
          </ul>
        </div>
      `
    },
    {
      id: 'data-collection',
      title: 'Data Collection and Use',
      content: `
        <div class="stx-cookie-policy-content">
          <h4 class="stx-cookie-policy-subtitle">Information Collected</h4>
          <p>Cookies may collect the following types of information:</p>
          <ul class="stx-cookie-policy-list">
            <li><strong>Technical Information:</strong> IP address, browser type, operating system</li>
            <li><strong>Usage Information:</strong> Pages visited, time spent, navigation patterns</li>
            <li><strong>Preference Information:</strong> Language, theme, accessibility settings</li>
            <li><strong>Location Information:</strong> Country/city level (not precise location)</li>
          </ul>

          <h4 class="stx-cookie-policy-subtitle">How We Use This Information</h4>
          <p>We use cookie data to:</p>
          <ul class="stx-cookie-policy-list">
            <li>Provide and improve our services</li>
            <li>Analyze website performance and user behavior</li>
            <li>Personalize content and advertisements</li>
            <li>Ensure security and prevent fraud</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h4 class="stx-cookie-policy-subtitle">Data Sharing</h4>
          <p>We may share cookie data with:</p>
          <ul class="stx-cookie-policy-list">
            <li><strong>Service Providers:</strong> Analytics and advertising partners</li>
            <li><strong>Legal Authorities:</strong> When required by law</li>
            <li><strong>Business Partners:</strong> Only with your explicit consent</li>
          </ul>
        </div>
      `
    },
    {
      id: 'retention',
      title: 'Cookie Retention Periods',
      content: `
        <div class="stx-cookie-policy-content">
          <p>Different types of cookies have different retention periods:</p>

          <h4 class="stx-cookie-policy-subtitle">Session Cookies</h4>
          <p>These cookies are deleted when you close your browser and are used for:</p>
          <ul class="stx-cookie-policy-list">
            <li>Maintaining your session while browsing</li>
            <li>Temporary form data</li>
            <li>Security tokens</li>
          </ul>

          <h4 class="stx-cookie-policy-subtitle">Persistent Cookies</h4>
          <p>These cookies remain on your device for a specified period:</p>
          <ul class="stx-cookie-policy-list">
            <li><strong>Short-term (1-30 days):</strong> Temporary preferences and analytics</li>
            <li><strong>Medium-term (1-12 months):</strong> Language preferences, consent settings</li>
            <li><strong>Long-term (1-2 years):</strong> Analytics tracking, advertising preferences</li>
          </ul>

          <h4 class="stx-cookie-policy-subtitle">Automatic Deletion</h4>
          <p>Cookies are automatically deleted when they expire. You can also manually delete cookies through your browser settings at any time.</p>
        </div>
      `
    },
    {
      id: 'updates',
      title: 'Updates to This Policy',
      content: `
        <div class="stx-cookie-policy-content">
          <p>We may update this Cookie Policy from time to time to reflect:</p>
          <ul class="stx-cookie-policy-list">
            <li>Changes in our cookie usage</li>
            <li>New technologies or services</li>
            <li>Legal or regulatory requirements</li>
            <li>User feedback and preferences</li>
          </ul>

          <h4 class="stx-cookie-policy-subtitle">Notification of Changes</h4>
          <p>When we make significant changes to this policy, we will:</p>
          <ul class="stx-cookie-policy-list">
            <li>Update the "Last Updated" date</li>
            <li>Display a notice on our website</li>
            <li>Request renewed consent if necessary</li>
            <li>Send email notifications to registered users</li>
          </ul>

          <h4 class="stx-cookie-policy-subtitle">Your Rights</h4>
          <p>You have the right to:</p>
          <ul class="stx-cookie-policy-list">
            <li>Withdraw consent at any time</li>
            <li>Request information about our cookie usage</li>
            <li>Request deletion of cookie data</li>
            <li>Lodge a complaint with supervisory authorities</li>
          </ul>
        </div>
      `
    },
    {
      id: 'contact',
      title: 'Contact Information',
      content: `
        <div class="stx-cookie-policy-content">
          <p>If you have questions about our Cookie Policy or cookie usage, please contact us:</p>

          <p><strong>Data Protection Officer:</strong><br>
          Email: {env.DPO_EMAIL}<br>
          Phone: +420 774 287 541</p>

          <p><strong>General Privacy Inquiries:</strong><br>
          Email: {env.PRIVACY_EMAIL}<br>
          Address: [Your Business Address]</p>

          <p><strong>Cookie Management:</strong><br>
          You can manage your cookie preferences through our cookie consent banner or contact us directly.</p>

          <p><strong>Last Updated:</strong> January 15, 2024</p>
        </div>
      `
    }
  ]
};

function CookiePolicyPageContent() {
  return (
    <LegalContentSection
      title={cookiePolicyContent.title}
      sections={cookiePolicyContent.sections}
      className="stx-cookie-policy-page"
    />
  );
}

export default function CookiePolicyPage() {
  return (
    <>
      <HeroSpacer />
      <CookiePolicyPageContent />
    </>
  );
}
