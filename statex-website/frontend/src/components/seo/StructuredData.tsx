import React from 'react';

interface StructuredDataProps {
  data: any;
}

/**
 * Component to inject structured data (JSON-LD) into the page head
 */
export function StructuredData({ data }: StructuredDataProps) {
  if (!data) return null;
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 0),
      }}
    />
  );
}

/**
 * Generate organization structured data for the site
 */
export function OrganizationStructuredData() {
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'Statex',
    'url': 'https://statex.cz',
    'logo': 'https://statex.cz/favicon-512x512.png',
    'description': 'European technology company specializing in digital transformation, AI automation, and custom software development.',
    'foundingDate': '2020',
    'address': {
      '@type': 'PostalAddress',
      'addressCountry': 'CZ',
      'addressRegion': 'Prague',
    },
    'contactPoint': {
      '@type': 'ContactPoint',
      'telephone': '+420-774-287-541',
      'contactType': 'customer service',
      'availableLanguage': ['English', 'Czech', 'German', 'French'],
    },
    'sameAs': [
      'https://linkedin.com/company/statex',
      'https://twitter.com/statex_cz',
    ],
    'serviceArea': {
      '@type': 'Place',
      'name': 'Europe',
    },
    'hasOfferCatalog': {
      '@type': 'OfferCatalog',
      'name': 'Technology Services',
      'itemListElement': [
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'Digital Transformation',
            'description': 'Comprehensive digital transformation services for European businesses',
          },
        },
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'AI Automation',
            'description': 'AI-powered automation solutions to streamline business processes',
          },
        },
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'Custom Software Development',
            'description': 'Tailored software solutions for specific business needs',
          },
        },
      ],
    },
  };
  
  return <StructuredData data={organizationData} />;
}

/**
 * Generate website structured data
 */
export function WebsiteStructuredData() {
  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'Statex',
    'url': 'https://statex.cz',
    'description': 'European technology company specializing in digital transformation and AI automation',
    'inLanguage': ['en', 'cs', 'de', 'fr'],
    'publisher': {
      '@type': 'Organization',
      'name': 'Statex',
    },
    'potentialAction': {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': 'https://statex.cz/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
  
  return <StructuredData data={websiteData} />;
}

/**
 * Generate breadcrumb structured data
 */
interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbStructuredDataProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbStructuredData({ items }: BreadcrumbStructuredDataProps) {
  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.url,
    })),
  };
  
  return <StructuredData data={breadcrumbData} />;
}

/**
 * Generate FAQ structured data
 */
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQStructuredDataProps {
  faqs: FAQItem[];
}

export function FAQStructuredData({ faqs }: FAQStructuredDataProps) {
  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer,
      },
    })),
  };
  
  return <StructuredData data={faqData} />;
}

export default StructuredData;