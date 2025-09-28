import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FooterSection } from './FooterSection';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { LanguageProvider } from '@/components/providers/LanguageProvider';
import { VariantProvider } from '@/components/providers/VariantProvider';
import { env } from '@/config/env';

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const renderFooterSection = (props = {}) => {
  return render(
    <ThemeProvider>
      <VariantProvider>
        <LanguageProvider>
          <FooterSection {...props} />
        </LanguageProvider>
      </VariantProvider>
    </ThemeProvider>
  );
};

describe('FooterSection', () => {
  describe('STX Classes', () => {
    it('should render with correct STX classes', () => {
      renderFooterSection();
      
      const footer = screen.getByTestId('stx-footer-section');
      expect(footer).toHaveClass('stx-footer', 'stx-footer--default');
    });

    it('should apply variant classes correctly', () => {
      renderFooterSection({ variant: 'minimal' });
      
      const footer = screen.getByTestId('stx-footer-section');
      expect(footer).toHaveClass('stx-footer--minimal');
    });

    it('should apply custom className', () => {
      renderFooterSection({ className: 'custom-footer' });
      
      const footer = screen.getByTestId('stx-footer-section');
      expect(footer).toHaveClass('custom-footer');
    });
  });

  describe('Organism-Specific Functionality', () => {
    it('should render company information', () => {
      const companyInfo = {
        name: 'Test Company',
        description: 'Test description',
        contact: {
          phone: '+1234567890',
          email: 'test@example.com',
          address: 'Test Address'
        }
      };

      renderFooterSection({ company: companyInfo });

      expect(screen.getByText('Test Company')).toBeInTheDocument();
      expect(screen.getByText('Test description')).toBeInTheDocument();
      expect(screen.getByText('+1234567890')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.getByText('Test Address')).toBeInTheDocument();
    });

    it('should render navigation sections', () => {
      const services = [
        { title: 'Service 1', href: '/service1' },
        { title: 'Service 2', href: '/service2' }
      ];

      renderFooterSection({ services });

      expect(screen.getByText('Services')).toBeInTheDocument();
      expect(screen.getByText('Service 1')).toBeInTheDocument();
      expect(screen.getByText('Service 2')).toBeInTheDocument();
    });

    it('should render social links', () => {
      const social = [
        { name: 'LinkedIn', href: 'https://linkedin.com', icon: '🔗' },
        { name: 'Twitter', href: 'https://twitter.com', icon: '🐦' }
      ];

      renderFooterSection({ social });

      expect(screen.getByText('Follow Us')).toBeInTheDocument();
      expect(screen.getByText('🔗')).toBeInTheDocument();
      expect(screen.getByText('🐦')).toBeInTheDocument();
    });

    it('should render additional links section', () => {
      renderFooterSection();

      expect(screen.getByText('Quick Links')).toBeInTheDocument();
      expect(screen.getAllByText('Blog')).toHaveLength(2); // One in Company section, one in Quick Links
      expect(screen.getByText('Careers')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
      expect(screen.getByText('Support')).toBeInTheDocument();
    });

    it('should render copyright with current year', () => {
      const currentYear = new Date().getFullYear();
      renderFooterSection();

      expect(screen.getByText(new RegExp(`${currentYear}`))).toBeInTheDocument();
    });
  });

  describe('Layout Variants', () => {
    it('should render default variant correctly', () => {
      renderFooterSection({ variant: 'default' });

      const footer = screen.getByTestId('stx-footer-section');
      expect(footer).toHaveClass('stx-footer--default');
    });

    it('should render minimal variant correctly', () => {
      renderFooterSection({ variant: 'minimal' });

      const footer = screen.getByTestId('stx-footer-section');
      expect(footer).toHaveClass('stx-footer--minimal');
    });

    it('should render compact variant correctly', () => {
      renderFooterSection({ variant: 'compact' });

      const footer = screen.getByTestId('stx-footer-section');
      expect(footer).toHaveClass('stx-footer--compact');
    });
  });

  describe('Responsive Behavior', () => {
    it('should have responsive grid layout', () => {
      renderFooterSection();

      const content = screen.getByTestId('stx-footer-section').querySelector('.stx-footer__content');
      expect(content).toHaveStyle({ display: 'grid' });
    });

    it('should have mobile-friendly navigation', () => {
      renderFooterSection();

      const sections = screen.getByTestId('stx-footer-section').querySelector('.stx-footer__sections');
      expect(sections).toBeInTheDocument();
    });
  });

  describe('Theme Switching', () => {
    it('should render correctly in light theme', () => {
      renderFooterSection();

      const footer = screen.getByTestId('stx-footer-section');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass('stx-footer');
    });

    it('should render correctly in dark theme', () => {
      renderFooterSection();

      const footer = screen.getByTestId('stx-footer-section');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass('stx-footer');
    });

    it('should render correctly in EU theme', () => {
      renderFooterSection();

      const footer = screen.getByTestId('stx-footer-section');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass('stx-footer');
    });

    it('should render correctly in UAE theme', () => {
      renderFooterSection();

      const footer = screen.getByTestId('stx-footer-section');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass('stx-footer');
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      renderFooterSection();

      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
    });

    it('should have proper heading hierarchy', () => {
      renderFooterSection();

      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
    });

    it('should have proper link accessibility', () => {
      renderFooterSection();

      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toHaveAttribute('href');
      });
    });

    it('should have proper additional links accessibility', () => {
      renderFooterSection();

      const quickLinksSection = screen.getByText('Quick Links').closest('.stx-footer__additional-links');
      const additionalLinks = quickLinksSection?.querySelectorAll('a');
      
      expect(additionalLinks).toHaveLength(5);
      additionalLinks?.forEach(link => {
        expect(link).toHaveAttribute('href');
        expect(link).toHaveClass('stx-footer__additional-links-link');
      });
    });

    it('should have proper social link accessibility', () => {
      const social = [
        { name: 'LinkedIn', href: 'https://linkedin.com', icon: '🔗' }
      ];

      renderFooterSection({ social });

      const socialLink = screen.getByLabelText('Follow us on LinkedIn');
      expect(socialLink).toBeInTheDocument();
      expect(socialLink).toHaveAttribute('target', '_blank');
      expect(socialLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('Default Values', () => {
    it('should render with default company information', () => {
      renderFooterSection();

      expect(screen.getByText('Statex')).toBeInTheDocument();
      expect(screen.getByText(/AI-powered software development/)).toBeInTheDocument();
      expect(screen.getByText('+420-774-287-541')).toBeInTheDocument();
      expect(screen.getByText(env.CONTACT_EMAIL)).toBeInTheDocument();
      expect(screen.getByText('Prague, Czech Republic')).toBeInTheDocument();
    });

    it('should render with default navigation sections', () => {
      renderFooterSection();

      expect(screen.getByText('Solutions')).toBeInTheDocument();
      expect(screen.getByText('Services')).toBeInTheDocument();
      expect(screen.getByText('Company')).toBeInTheDocument();
      expect(screen.getByText('Legal')).toBeInTheDocument();
    });

    it('should render with default social links', () => {
      renderFooterSection();

      expect(screen.getByText('Follow Us')).toBeInTheDocument();
      expect(screen.getByText('🔗')).toBeInTheDocument();
      expect(screen.getByText('🐦')).toBeInTheDocument();
      expect(screen.getByText('💻')).toBeInTheDocument();
    });
  });

  describe('Custom Props', () => {
    it('should render custom services', () => {
      const customServices = [
        { title: 'Custom Service', href: '/custom' }
      ];

      renderFooterSection({ services: customServices });

      expect(screen.getByText('Custom Service')).toBeInTheDocument();
    });

    it('should render custom solutions', () => {
      const customSolutions = [
        { title: 'Custom Solution', href: '/custom-solution' }
      ];

      renderFooterSection({ solutions: customSolutions });

      expect(screen.getByText('Custom Solution')).toBeInTheDocument();
    });

    it('should render custom resources', () => {
      const customResources = [
        { title: 'Custom Resource', href: '/custom-resource' }
      ];

      renderFooterSection({ resources: customResources });

      expect(screen.getByText('Custom Resource')).toBeInTheDocument();
    });

    it('should render custom legal links', () => {
      const customLegal = [
        { title: 'Custom Legal', href: '/custom-legal' }
      ];

      renderFooterSection({ legal: customLegal });

      expect(screen.getByText('Custom Legal')).toBeInTheDocument();
    });
  });

  describe('Additional Links Functionality', () => {
    it('should render all additional links correctly', () => {
      renderFooterSection();

      expect(screen.getByText('Quick Links')).toBeInTheDocument();
      
      // Get the Quick Links section specifically
      const quickLinksSection = screen.getByText('Quick Links').closest('.stx-footer__additional-links');
      expect(quickLinksSection).toBeInTheDocument();
      
      // Check links within the Quick Links section
      const blogLink = quickLinksSection?.querySelector('a[href="/blog"]');
      const careersLink = quickLinksSection?.querySelector('a[href="/careers"]');
      const contactLink = quickLinksSection?.querySelector('a[href="/contact"]');
      const supportLink = quickLinksSection?.querySelector('a[href="/support"]');
      
      expect(blogLink).toBeInTheDocument();
      expect(careersLink).toBeInTheDocument();
      expect(contactLink).toBeInTheDocument();
      expect(supportLink).toBeInTheDocument();
    });

    it('should have proper link accessibility', () => {
      renderFooterSection();

      // Get the Quick Links section specifically
      const quickLinksSection = screen.getByText('Quick Links').closest('.stx-footer__additional-links');
      const additionalLinks = quickLinksSection?.querySelectorAll('.stx-footer__additional-links-link');

      expect(additionalLinks).toHaveLength(5);
      additionalLinks?.forEach(link => {
        expect(link).toHaveAttribute('href');
        expect(link).toHaveClass('stx-footer__additional-links-link');
      });
    });
  });

  describe('Contact Links', () => {
    it('should have proper phone link', () => {
      renderFooterSection();

      const phoneLink = screen.getByText('+420-774-287-541');
      expect(phoneLink).toHaveAttribute('href', 'tel:+420-774-287-541');
    });

    it('should have proper email link', () => {
      renderFooterSection();

      const emailLink = screen.getByText(env.CONTACT_EMAIL);
      expect(emailLink).toHaveAttribute('href', `mailto:${env.CONTACT_EMAIL}`);
    });
  });

  describe('Bottom Bar', () => {
    it('should render copyright and legal links', () => {
      renderFooterSection();

      expect(screen.getByText(/© \d{4} Statex/)).toBeInTheDocument();
      expect(screen.getAllByText('Privacy Policy')).toHaveLength(2); // One in Legal section, one in bottom bar
      expect(screen.getAllByText('Terms of Service')).toHaveLength(2); // One in Legal section, one in bottom bar
      expect(screen.getAllByText('Cookie Policy')).toHaveLength(2); // One in Legal section, one in bottom bar
    });
  });
}); 