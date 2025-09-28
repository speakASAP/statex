'use client';

import React from 'react';
import { Text } from '@/components/atoms/Text';
import { ClassComposer } from '@/lib/classComposition';

import { Container, Section } from '@/components/atoms';

interface MetaItem {
  icon: string;
  text: string;
}

interface NavigationItem {
  title: string;
  href: string;
  active?: boolean;
}

interface LegalSection {
  number: string;
  title: string;
  content: string | React.ReactNode;
  isImportant?: boolean;
  isGdprHighlight?: boolean;
}

interface ContactInfo {
  icon: string;
  label: string;
  value: string;
  href?: string;
}

interface LegalSectionProps {
  pageType?: 'legal';
  variant?: 'default' | 'privacy' | 'terms' | 'gdpr' | 'cookies';
  title: string;
  subtitle?: string;
  badge?: string;
  meta?: MetaItem[];
  navigation?: NavigationItem[];
  lastUpdated?: string;
  summary?: {
    title: string;
    text: string;
  };
  sections: LegalSection[];
  contactInfo?: ContactInfo[];
  showCompliance?: boolean;
  complianceText?: string;
  className?: string;
  abTest?: { experimentId: string; variant: string };
}

export function LegalSection({
  pageType = 'legal',
  variant = 'default',
  title,
  subtitle,
  badge,
  meta = [],
  navigation = [],
  lastUpdated,
  summary,
  sections,
  contactInfo = [],
  showCompliance = true,
  complianceText = 'EU GDPR & Data Protection Compliant',
  abTest
}: LegalSectionProps) {
  // Generate classes using composition engine
  const composer = new ClassComposer(pageType);
  const classSet = composer.compose({
    pageType,
    section: 'legal',
    variant,
    theme: 'light', // Default theme
    abTest,
    customClasses: []
  });

  // const legalClasses = [classSet.container, className].filter(Boolean).join(' '); // Removed unused variable

  const renderMetaItem = (metaItem: MetaItem, index: number) => (
    <div key={index} className={classSet.elements['metaItem']}>
      <span className={classSet.elements['metaIcon']}>{metaItem.icon}</span>
      <span>{metaItem.text}</span>
    </div>
  );

  const renderNavigationItem = (navItem: NavigationItem, index: number) => (
    <li key={index} className={classSet.elements['navItem']}>
      <a
        href={navItem.href}
        className={`${classSet.elements['navLink']} ${navItem.active ? classSet.elements['navLinkActive'] : ''}`}
        data-testid="stx-legal-nav-link"
      >
        {navItem.title}
      </a>
    </li>
  );

  const renderSection = (section: LegalSection, index: number) => (
    <div
      key={index}
      className={classSet.elements['section']}
      data-testid="stx-legal-section"
    >
      <div className={classSet.elements['sectionNumber']}>{section.number}</div>

      <Text
        variant="h2"
        className={classSet.elements['title']}
        data-testid="stx-legal-section-title"
      >
        {section.title}
      </Text>

      <div className="stx-legal-section__content">
        {section.isImportant && (
          <div className="stx-legal-section__important-notice">
            <div className="stx-legal-section__notice-title">Important Notice</div>
            <div className="stx-legal-section__notice-content">
              {section.content}
            </div>
          </div>
        )}

        {section.isGdprHighlight && (
          <div className="stx-legal-section__gdpr-highlight">
            <div className="stx-legal-section__gdpr-title">GDPR Compliance</div>
            <div className="stx-legal-section__notice-content">
              {section.content}
            </div>
          </div>
        )}

        {!section.isImportant && !section.isGdprHighlight && (
          typeof section.content === 'string' ? (
            <Text variant="bodyMedium">{section.content}</Text>
          ) : (
            section.content
          )
        )}
      </div>
    </div>
  );

  const renderContactInfo = (contact: ContactInfo, index: number) => (
    <div key={index} className={classSet.elements['contactItem']}>
      <span className={classSet.elements['contactIcon']}>{contact.icon}</span>
      <div>
        <strong>{contact.label}:</strong>{' '}
        {contact.href ? (
          <a href={contact.href}>{contact.value}</a>
        ) : (
          contact.value
        )}
      </div>
    </div>
  );

  return (
    <Section spacing="lg" background="default">
      <Container size="lg">
        {/* Legal Header */}
        <header className={classSet.elements['header']}>
          <div className={classSet.elements['headerContainer']}>
            {badge && (
              <span className={classSet.elements['badge']} data-testid="stx-legal-badge">
                {badge}
              </span>
            )}

            <h2
              className="stx-section-title"
              data-testid="stx-legal-title"
            >
              {title}
            </h2>

            {subtitle && (
              <p
                className="stx-section-subtitle"
                data-testid="stx-legal-subtitle"
              >
                {subtitle}
              </p>
            )}

            {meta.length > 0 && (
              <div className={classSet.elements['meta']} data-testid="stx-legal-meta">
                {meta.map((metaItem, index) => renderMetaItem(metaItem, index))}
              </div>
            )}
          </div>
        </header>

        {/* Main Layout */}
        <div className={classSet.elements['layout']}>
          {/* Navigation Sidebar */}
          {navigation.length > 0 && (
            <nav className={classSet.elements['nav']} data-testid="stx-legal-nav">
              <Text
                variant="h3"
                className={classSet.elements['navTitle']}
              >
                Quick Navigation
              </Text>

              <ul className={classSet.elements['navList']}>
                {navigation.map((navItem, index) => renderNavigationItem(navItem, index))}
              </ul>

              {showCompliance && (
                <div className="stx-legal-nav__compliance-indicator">
                  <div className="stx-legal-nav__compliance-title">Compliance Status</div>
                  <div className="stx-legal-nav__compliance-text">
                    ✅ {complianceText}
                  </div>
                </div>
              )}
            </nav>
          )}

          {/* Main Content */}
          <main className={classSet.elements['content']}>
            {/* Content Header */}
            <div className={classSet.elements['contentHeader']}>
              {lastUpdated && (
                <div
                  className={classSet.elements['lastUpdated']}
                  data-testid="stx-legal-last-updated"
                >
                  📅 Last updated: {lastUpdated}
                </div>
              )}

              {summary && (
                <div
                  className={classSet.elements['summary']}
                  data-testid="stx-legal-summary"
                >
                  <Text
                    variant="h2"
                    className={classSet.elements['summaryTitle']}
                  >
                    {summary.title}
                  </Text>
                  <Text
                    variant="bodyLarge"
                    className={classSet.elements['summaryText']}
                  >
                    {summary.text}
                  </Text>
                </div>
              )}
            </div>

            {/* Legal Sections */}
            <div className="stx-legal-sections">
              {sections.map((section, index) => renderSection(section, index))}
            </div>

            {/* Contact Information */}
            {contactInfo.length > 0 && (
              <div
                className={classSet.elements['contact']}
                data-testid="stx-legal-contact"
              >
                <Text
                  variant="h2"
                  className={classSet.elements['contactTitle']}
                >
                  Contact Information
                </Text>

                <div className={classSet.elements['contactInfo']}>
                  {contactInfo.map((contact, index) => renderContactInfo(contact, index))}
                </div>
              </div>
            )}
          </main>
        </div>
      </Container>
    </Section>
  );
}
