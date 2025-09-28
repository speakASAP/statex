'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Container } from '@/components/atoms';
import { FooterSectionConfig } from '@/types/templates';
import { useLanguage } from '@/components/providers/LanguageProvider';

import { env } from '@/config/env';
import { getFooterTranslation } from '@/lib/translations';
import { getLocalizedUrlWithFallback } from '@/lib/utils/localization';
import './FooterSection.css';

export function FooterSection({
  variant = 'default',
  className = '',
  showCompanyInfo = true,
  showQuickLinks = true,
  showResources = true,
  showLegal = true,
  showContact = true,
  showSocial = true,
  showNewsletter = true,
  showBackToTop = true,
  maxWidth = 'lg',
  padding = 'lg',
  social = [
    { name: 'LinkedIn', href: 'https://linkedin.com/company/statex', icon: '🔗' },
    { name: 'Twitter', href: 'https://twitter.com/statex_cz', icon: '🐦' },
    { name: 'GitHub', href: 'https://github.com/statex', icon: '💻' },
  ]
}: FooterSectionConfig) {
  const { language } = useLanguage();
  const pathname = usePathname();
  const t = getFooterTranslation(language);



  // Update company description with translation
  const translatedCompany = {
    name: t.company.name,
    description: t.company.description,
    contact: {
      phone: t.company.contact.phone,
      email: t.company.contact.email,
      address: t.company.contact.address,
    },
  };

  // Create translated link arrays with proper native slugs and fallback handling
  const translatedServices = [
    { title: t.links.aiAutomation, href: getLocalizedUrlWithFallback('/services/ai-automation', language) },
    { title: t.links.customSoftware, href: getLocalizedUrlWithFallback('/services/custom-software', language) },
    { title: t.links.webDevelopment, href: getLocalizedUrlWithFallback('/services/web-development', language) },
    { title: t.links.ecommerce, href: getLocalizedUrlWithFallback('/services/e-commerce', language) },
    { title: t.links.systemModernization, href: getLocalizedUrlWithFallback('/services/system-modernization', language) },
    { title: t.links.consulting, href: getLocalizedUrlWithFallback('/services/consulting', language) },
  ];

  const translatedSolutions = [
    { title: t.links.aiIntegration, href: getLocalizedUrlWithFallback('/solutions/ai-integration', language) },
    { title: t.links.businessAutomation, href: getLocalizedUrlWithFallback('/solutions/business-automation', language) },
    { title: t.links.digitalTransformation, href: getLocalizedUrlWithFallback('/solutions/digital-transformation', language) },
    { title: t.links.legacyModernization, href: getLocalizedUrlWithFallback('/solutions/legacy-modernization', language) },
  ];

  const translatedResources = [
    { title: t.links.aboutUs, href: getLocalizedUrlWithFallback('/about', language) },
    { title: t.links.companyStory, href: getLocalizedUrlWithFallback('/about/company-story', language) },
    { title: t.links.czechPresence, href: getLocalizedUrlWithFallback('/about/czech-presence', language) },
    { title: t.links.internationalTeam, href: getLocalizedUrlWithFallback('/about/international-team', language) },
    { title: t.links.valuesMission, href: getLocalizedUrlWithFallback('/about/values-mission', language) },
    { title: t.quickLinks.blog, href: getLocalizedUrlWithFallback('/blog', language) },
  ];

  const translatedLegal = [
    { title: t.links.privacyPolicy, href: getLocalizedUrlWithFallback('/legal/privacy-policy', language) },
    { title: t.links.termsOfService, href: getLocalizedUrlWithFallback('/legal/terms-of-service', language) },
    { title: t.links.cookiePolicy, href: getLocalizedUrlWithFallback('/legal/cookie-policy', language) },
    { title: t.links.gdprCompliance, href: getLocalizedUrlWithFallback('/legal/gdpr-compliance', language) },
    { title: t.links.legalDisclaimers, href: getLocalizedUrlWithFallback('/legal/legal-disclaimers', language) },
    { title: t.links.legalAddendum, href: getLocalizedUrlWithFallback('/legal/legal-addendum', language) },
  ];

  // Generate AI-friendly URL for current page
  const getAIFriendlyUrl = () => {
    // Remove leading slash and handle root path
    const cleanPath = pathname === '/' ? '' : pathname.replace(/^\//, '');
    
    // If it's already an AI page, return the current path
    if (cleanPath.startsWith('ai/')) {
      return `/${cleanPath}`;
    }
    
    // For language-specific blog pages, use the AI blog structure
    if (cleanPath.match(/^(cs|de|fr)\/blog/)) {
      const [lang, ...rest] = cleanPath.split('/');
      const blogSlug = rest.join('/').replace('blog/', '');
      return `/${lang}/ai/blog/${blogSlug}`;
    }
    
    // For blog posts, use the AI blog structure
    if (cleanPath.startsWith('blog/')) {
      const blogSlug = cleanPath.replace('blog/', '');
      return `/ai/blog/${blogSlug}`;
    }
    
    // For language-specific pages, use the AI language structure
    if (cleanPath.match(/^(cs|de|fr)\//)) {
      const [lang, ...rest] = cleanPath.split('/');
      const slug = rest.join('/');
      return `/${lang}/ai/${slug}`;
    }
    
    // For root page in different languages
    if (language !== 'en') {
      return `/${language}/ai/`;
    }
    
    // For other pages, use the AI catch-all structure
    return `/ai/${cleanPath || ''}`;
  };

  const renderFooterSection = (title: string, links: Array<{ title: string; href: string }>) => (
    <div className="stx-footer__section">
      <h3 className="stx-footer__section-title">{title}</h3>
      <ul className="stx-footer__section-links">
        {links.map(link => (
          <li key={link.href} className="stx-footer__section-link-item">
            <Link href={link.href} className="stx-footer__section-link">
              {link.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );



  const footerClasses = `stx-footer stx-footer--${variant} ${className}`;

  return (
    <footer className={footerClasses} data-testid="stx-footer-section">
      <Container size="lg" padding="md">
        <div className="stx-footer__content">
          {/* Company Information */}
          <div className="stx-footer__company">
            <div className="stx-footer__company-info">
              <Link href="/" className="stx-footer__logo">
                {translatedCompany.name}
              </Link>
              <p className="stx-footer__company-description">
                {translatedCompany.description}
              </p>
            </div>
            
            <div className="stx-footer__contact">
              <div className="stx-footer__contact-item">
                <span className="stx-footer__contact-label">{t.contact.phone}</span>
                <a href={`tel:${translatedCompany.contact.phone}`} className="stx-footer__contact-link">
                  {translatedCompany.contact.phone}
                </a>
              </div>
              <div className="stx-footer__contact-item">
                <span className="stx-footer__contact-label">{t.contact.email}</span>
                <a href={`mailto:${translatedCompany.contact.email}`} className="stx-footer__contact-link">
                  {translatedCompany.contact.email}
                </a>
              </div>
              <div className="stx-footer__contact-item">
                <span className="stx-footer__contact-label">{t.contact.address}</span>
                <span className="stx-footer__contact-text">
                  {translatedCompany.contact.address}
                </span>
              </div>
            </div>

            {/* Social Links */}
            <div className="stx-footer__social">
              <h4 className="stx-footer__social-title">{t.social.followUs}</h4>
              <ul className="stx-footer__social-links">
                {social.map(socialLink => (
                  <li key={socialLink.href} className="stx-footer__social-link-item">
                    <a
                      href={socialLink.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="stx-footer__social-link"
                      aria-label={`Follow us on ${socialLink.name}`}
                    >
                      <span className="stx-footer__social-icon">{socialLink.icon}</span>
                      <span className="stx-footer__social-name">{socialLink.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer Sections */}
          <div className="stx-footer__sections">
            {renderFooterSection(t.sections.solutions, translatedSolutions)}
            {renderFooterSection(t.sections.services, translatedServices)}
            {renderFooterSection(t.sections.company, translatedResources)}
            {renderFooterSection(t.sections.legal, translatedLegal)}
          </div>

          {/* Additional Links */}
          <div className="stx-footer__additional-links">
            <h3 className="stx-footer__additional-links-title">{t.quickLinks.title}</h3>
            <ul className="stx-footer__additional-links-list">
              <li className="stx-footer__additional-links-item">
                <Link href={getLocalizedUrlWithFallback('/blog', language)} className="stx-footer__additional-links-link">
                  {t.quickLinks.blog}
                </Link>
              </li>
              <li className="stx-footer__additional-links-item">
                <Link href={getLocalizedUrlWithFallback('/careers', language)} className="stx-footer__additional-links-link">
                  {t.quickLinks.careers}
                </Link>
              </li>
              <li className="stx-footer__additional-links-item">
                <Link href={getLocalizedUrlWithFallback('/contact', language)} className="stx-footer__additional-links-link">
                  {t.quickLinks.contact}
                </Link>
              </li>
              <li className="stx-footer__additional-links-item">
                <Link href={getLocalizedUrlWithFallback('/support', language)} className="stx-footer__additional-links-link">
                  {t.quickLinks.support}
                </Link>
              </li>
              <li className="stx-footer__additional-links-item">
                <Link href={getAIFriendlyUrl()} className="stx-footer__additional-links-link">
                  {t.quickLinks.aiFriendly}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="stx-footer__bottom">
          <div className="stx-footer__bottom-content">
            <p className="stx-footer__copyright">
              © {new Date().getFullYear()} {translatedCompany.name}. {t.bottom.copyright}
            </p>
            <div className="stx-footer__bottom-links">
              <Link href={getLocalizedUrlWithFallback('/legal/privacy-policy', language)} className="stx-footer__bottom-link">
                {t.links.privacyPolicy}
              </Link>
              <Link href={getLocalizedUrlWithFallback('/legal/terms-of-service', language)} className="stx-footer__bottom-link">
                {t.links.termsOfService}
              </Link>
              <Link href={getLocalizedUrlWithFallback('/legal/cookie-policy', language)} className="stx-footer__bottom-link">
                {t.links.cookiePolicy}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
} 