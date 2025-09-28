import React from 'react';
import { Metadata } from 'next';
import { LegalContentSection } from '@/components/sections/LegalContentSection';
import { HeroSpacer } from '@/components/atoms';

export const metadata: Metadata = {
  title: 'Terms of Service | Statex - Legal Terms and Conditions',
  description: 'Read our terms of service to understand the legal agreement between Statex and our clients regarding the use of our services.',
  keywords: 'terms of service, legal terms, conditions, agreement, Statex',
  openGraph: {
    title: 'Terms of Service | Statex',
    description: 'Legal terms and conditions for Statex services',
    type: 'website',
  },
};

const termsOfServiceContent = {
  title: 'Terms of Service',
  subtitle: 'Legal terms and conditions for our services',
  lastUpdated: '2024-01-15',
  sections: [
    {
      id: 'introduction',
      title: 'Introduction',
      content: `
        <div class="stx-terms-content">
          <p>These Terms of Service ("Terms") govern your use of Statex services, including our website, software development services, consulting, and related offerings.</p>
          <p>By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part of these terms, you may not access our services.</p>
          <p>These Terms are effective as of the date listed above and apply to all users of our services.</p>
        </div>
      `
    },
    {
      id: 'definitions',
      title: 'Definitions',
      content: `
        <div class="stx-terms-content">
          <ul class="stx-terms-list">
            <li><strong>"Company," "we," "us," "our":</strong> Statex s.r.o.</li>
            <li><strong>"Client," "you," "your":</strong> The individual or entity using our services</li>
            <li><strong>"Services":</strong> All services provided by Statex, including but not limited to web development, software consulting, AI automation, and related services</li>
            <li><strong>"Project":</strong> Any specific work or deliverable agreed upon between the parties</li>
            <li><strong>"Deliverables":</strong> Any work product, code, documentation, or other materials provided to the client</li>
          </ul>
        </div>
      `
    },
    {
      id: 'services',
      title: 'Services Description',
      content: `
        <div class="stx-terms-content">
          <p>Statex provides the following services:</p>
          <ul class="stx-terms-list">
            <li><strong>Web Development:</strong> Custom website and web application development</li>
            <li><strong>AI Automation:</strong> Artificial intelligence integration and automation solutions</li>
            <li><strong>Custom Software:</strong> Tailored software solutions for specific business needs</li>
            <li><strong>Digital Transformation:</strong> Strategic consulting and implementation services</li>
            <li><strong>Consulting:</strong> Technical and business consulting services</li>
            <li><strong>System Modernization:</strong> Legacy system upgrades and modernization</li>
          </ul>

          <p>Specific service details, scope, and deliverables will be defined in individual project agreements or statements of work.</p>
        </div>
      `
    },
    {
      id: 'acceptance',
      title: 'Acceptance and Agreement',
      content: `
        <div class="stx-terms-content">
          <p>By using our services, you represent and warrant that:</p>
          <ul class="stx-terms-list">
            <li>You have the legal capacity to enter into these Terms</li>
            <li>You are at least 18 years old or have parental/guardian consent</li>
            <li>You will use our services in compliance with applicable laws</li>
            <li>You will provide accurate and complete information</li>
            <li>You will not use our services for any illegal or unauthorized purpose</li>
          </ul>
        </div>
      `
    },
    {
      id: 'project-agreements',
      title: 'Project Agreements',
      content: `
        <div class="stx-terms-content">
          <p>For specific projects, we will provide:</p>
          <ul class="stx-terms-list">
            <li><strong>Project Proposal:</strong> Detailed scope, timeline, and cost estimate</li>
            <li><strong>Statement of Work (SOW):</strong> Specific deliverables and milestones</li>
            <li><strong>Service Agreement:</strong> Legal terms specific to the project</li>
          </ul>

          <p>These documents will supplement these Terms and take precedence in case of conflicts.</p>

          <h4 class="stx-terms-subtitle">Project Changes</h4>
          <p>Any changes to project scope, timeline, or deliverables must be agreed upon in writing by both parties. Additional work may result in additional costs and timeline adjustments.</p>
        </div>
      `
    },
    {
      id: 'payment-terms',
      title: 'Payment Terms',
      content: `
        <div class="stx-terms-content">
          <h4 class="stx-terms-subtitle">Pricing and Invoicing</h4>
          <ul class="stx-terms-list">
            <li>Prices are quoted in Czech Koruna (CZK) unless otherwise specified</li>
            <li>All prices are exclusive of VAT unless stated otherwise</li>
            <li>Invoices are due within 30 days of issue unless otherwise agreed</li>
            <li>Late payments may incur interest charges of 1.5% per month</li>
          </ul>

          <h4 class="stx-terms-subtitle">Payment Methods</h4>
          <ul class="stx-terms-list">
            <li>Bank transfer to our designated account</li>
            <li>Credit card payments (subject to processing fees)</li>
            <li>Other methods as agreed upon in writing</li>
          </ul>

          <h4 class="stx-terms-subtitle">Milestone Payments</h4>
          <p>For larger projects, payment may be structured in milestones as defined in the project agreement.</p>
        </div>
      `
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property Rights',
      content: `
        <div class="stx-terms-content">
          <h4 class="stx-terms-subtitle">Client Ownership</h4>
          <p>Upon full payment, the client owns:</p>
          <ul class="stx-terms-list">
            <li>Custom code and software developed specifically for the client</li>
            <li>Custom designs and creative work created for the project</li>
            <li>Project-specific documentation and deliverables</li>
          </ul>

          <h4 class="stx-terms-subtitle">Company Retained Rights</h4>
          <p>Statex retains ownership of:</p>
          <ul class="stx-terms-list">
            <li>Pre-existing intellectual property and proprietary technology</li>
            <li>General methodologies, frameworks, and tools</li>
            <li>Reusable code libraries and components</li>
            <li>Portfolio rights to showcase completed work</li>
          </ul>

          <h4 class="stx-terms-subtitle">Third-Party Components</h4>
          <p>Open-source and third-party components used in projects remain subject to their respective licenses.</p>
        </div>
      `
    },
    {
      id: 'confidentiality',
      title: 'Confidentiality and Non-Disclosure',
      content: `
        <div class="stx-terms-content">
          <p>Both parties agree to maintain the confidentiality of:</p>
          <ul class="stx-terms-list">
            <li>Business information and trade secrets</li>
            <li>Technical specifications and proprietary technology</li>
            <li>Client data and project details</li>
            <li>Financial and commercial information</li>
          </ul>

          <p>Confidentiality obligations survive termination of these Terms for a period of 5 years.</p>

          <h4 class="stx-terms-subtitle">Exceptions</h4>
          <p>Confidentiality obligations do not apply to information that:</p>
          <ul class="stx-terms-list">
            <li>Was already publicly known</li>
            <li>Becomes publicly known through no fault of the receiving party</li>
            <li>Is required to be disclosed by law or court order</li>
            <li>Is independently developed without access to confidential information</li>
          </ul>
        </div>
      `
    },
    {
      id: 'warranties',
      title: 'Warranties and Disclaimers',
      content: `
        <div class="stx-terms-content">
          <h4 class="stx-terms-subtitle">Company Warranties</h4>
          <p>Statex warrants that:</p>
          <ul class="stx-terms-list">
            <li>Services will be performed with reasonable skill and care</li>
            <li>Deliverables will substantially conform to agreed specifications</li>
            <li>We have the right to provide the services</li>
          </ul>

          <h4 class="stx-terms-subtitle">Client Warranties</h4>
          <p>The client warrants that:</p>
          <ul class="stx-terms-list">
            <li>They have the right to engage our services</li>
            <li>They will provide necessary cooperation and information</li>
            <li>They will use deliverables in compliance with applicable laws</li>
          </ul>

          <h4 class="stx-terms-subtitle">Disclaimers</h4>
          <p>EXCEPT AS EXPRESSLY PROVIDED, ALL SERVICES ARE PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.</p>
        </div>
      `
    },
    {
      id: 'limitation-liability',
      title: 'Limitation of Liability',
      content: `
        <div class="stx-terms-content">
          <p>IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR:</p>
          <ul class="stx-terms-list">
            <li>Indirect, incidental, special, or consequential damages</li>
            <li>Loss of profits, revenue, or business opportunities</li>
            <li>Data loss or corruption</li>
            <li>Third-party claims</li>
          </ul>

          <p><strong>Total Liability:</strong> Each party's total liability shall not exceed the amount paid by the client for the specific project giving rise to the claim.</p>

          <p>This limitation does not apply to:</p>
          <ul class="stx-terms-list">
            <li>Intentional misconduct or gross negligence</li>
            <li>Breach of confidentiality obligations</li>
            <li>Infringement of intellectual property rights</li>
          </ul>
        </div>
      `
    },
    {
      id: 'termination',
      title: 'Termination',
      content: `
        <div class="stx-terms-content">
          <h4 class="stx-terms-subtitle">Termination by Client</h4>
          <p>The client may terminate these Terms or any project agreement with written notice. Upon termination:</p>
          <ul class="stx-terms-list">
            <li>Client remains liable for work completed and expenses incurred</li>
            <li>Company will deliver completed work and transfer ownership</li>
            <li>Confidentiality obligations survive termination</li>
          </ul>

          <h4 class="stx-terms-subtitle">Termination by Company</h4>
          <p>We may terminate these Terms if:</p>
          <ul class="stx-terms-list">
            <li>Client breaches these Terms and fails to cure within 30 days</li>
            <li>Client becomes insolvent or files for bankruptcy</li>
            <li>Client engages in illegal or unauthorized use of our services</li>
          </ul>
        </div>
      `
    },
    {
      id: 'governing-law',
      title: 'Governing Law and Dispute Resolution',
      content: `
        <div class="stx-terms-content">
          <p><strong>Governing Law:</strong> These Terms are governed by the laws of the Czech Republic.</p>

          <p><strong>Dispute Resolution:</strong> Any disputes arising from these Terms will be resolved through:</p>
          <ol class="stx-terms-ordered-list">
            <li>Good faith negotiations between the parties</li>
            <li>Mediation if negotiations fail</li>
            <li>Arbitration or court proceedings as a last resort</li>
          </ol>

          <p><strong>Jurisdiction:</strong> The courts of the Czech Republic have exclusive jurisdiction over any legal proceedings.</p>
        </div>
      `
    },
    {
      id: 'contact',
      title: 'Contact Information',
      content: `
        <div class="stx-terms-content">
          <p>For questions about these Terms of Service, please contact us:</p>

          <p><strong>Legal Department:</strong><br>
                      Email: {env.LEGAL_EMAIL}<br>
          Phone: +420 774 287 541<br>
          Address: [Your Business Address]</p>

          <p><strong>Last Updated:</strong> January 15, 2024</p>
        </div>
      `
    }
  ]
};

function TermsOfServicePageContent() {
  return (
    <LegalContentSection
      title={termsOfServiceContent.title}
      sections={termsOfServiceContent.sections}
    />
  );
}

export default function TermsOfServicePage() {
  return (
    <>
      <HeroSpacer />
      <TermsOfServicePageContent />
    </>
  );
}
