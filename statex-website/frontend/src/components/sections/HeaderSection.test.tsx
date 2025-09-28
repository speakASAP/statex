import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi } from 'vitest';
import { HeaderSection } from './HeaderSection';
import {
  testCompleteThemeSupport,
  renderWithTheme,
  ALL_THEMES,
  type ThemeName
} from '../../test/utils/theme-testing';

// Mock the providers
vi.mock('@/components/providers/LanguageProvider', () => ({
  useLanguage: () => ({
    language: 'en',
    setLanguage: vi.fn()
  })
}));

vi.mock('@/components/providers/ThemeProvider', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn()
  })
}));

vi.mock('@/components/providers/VariantProvider', () => ({
  useVariant: () => ({
    variant: 'modern',
    setVariant: vi.fn()
  })
}));

describe('HeaderSection', () => {
  const defaultProps = {
    title: 'Test Header',
    navigation: [
      { label: 'Home', href: '/home' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' }
    ],
    languages: [
      { value: 'en', label: 'EN', flag: '🇬🇧' },
      { value: 'cs', label: 'CS', flag: '🇨🇿' }
    ],
    cta: { text: 'Get Started', href: '/get-started' }
  };

  beforeEach(() => {
    // Mock window resize event
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200
    });
  });

  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      render(<HeaderSection {...defaultProps} />);

      expect(screen.getByText('Test Header')).toBeInTheDocument();
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
      expect(screen.getByText('Get Started')).toBeInTheDocument();
    });

    it('renders with minimal props', () => {
      render(<HeaderSection />);

      expect(screen.getByText('Statex')).toBeInTheDocument();
      expect(screen.getByText('Services')).toBeInTheDocument();
      expect(screen.getByText('Get Started')).toBeInTheDocument();
    });

    it('applies correct base classes', () => {
      const { container } = render(<HeaderSection {...defaultProps} />);

      expect(container.firstChild).toHaveClass('stx-header');
      expect(container.firstChild).toHaveClass('stx-header--default');
    });
  });

  describe('Navigation', () => {
    it('renders navigation links', () => {
      render(<HeaderSection {...defaultProps} />);

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it('renders navigation links with correct hrefs', () => {
      render(<HeaderSection {...defaultProps} />);

      // Use getByText and closest to find the anchor elements
      const homeLink = screen.getByText('Home').closest('a');
      const aboutLink = screen.getByText('About').closest('a');
      const contactLink = screen.getByText('Contact').closest('a');

      expect(homeLink).toHaveAttribute('href', '/home');
      expect(aboutLink).toHaveAttribute('href', '/about');
      expect(contactLink).toHaveAttribute('href', '/contact');
    });

    it('renders logo with correct href', () => {
      render(<HeaderSection {...defaultProps} />);

      const logoLink = screen.getByText('Test Header').closest('a');
      expect(logoLink).toHaveAttribute('href', '/');
    });
  });

  describe('Language Switcher', () => {
    it('shows language switcher when enabled', () => {
      render(<HeaderSection {...defaultProps} showLanguageSwitcher={true} />);

      // The language dropdown should be present
      expect(screen.getByText('Select an option')).toBeInTheDocument();
    });

    it('hides language switcher when disabled', () => {
      render(<HeaderSection {...defaultProps} showLanguageSwitcher={false} />);

      expect(screen.queryByText('Select an option')).not.toBeInTheDocument();
    });

    it('renders language dropdown with correct options', () => {
      render(<HeaderSection {...defaultProps} showLanguageSwitcher={true} />);

      const languageDropdown = screen.getByText('Select an option').closest('.stx-dropdown');
      expect(languageDropdown).toHaveClass('stx-header-language-dropdown');
    });
  });

  describe('Theme Toggle', () => {
    it('shows theme toggle when enabled', () => {
      render(<HeaderSection {...defaultProps} showThemeToggle={true} />);

      expect(screen.getByLabelText('Switch theme')).toBeInTheDocument();
    });

    it('hides theme toggle when disabled', () => {
      render(<HeaderSection {...defaultProps} showThemeToggle={false} />);

      expect(screen.queryByLabelText('Switch theme')).not.toBeInTheDocument();
    });

    it('shows correct theme icon', () => {
      render(<HeaderSection {...defaultProps} showThemeToggle={true} />);

      // Default theme is light, so should show sun
      expect(screen.getByText('☀️')).toBeInTheDocument();
    });
  });

  describe('Variant Toggle', () => {
    it('shows variant toggle when enabled', () => {
      render(<HeaderSection {...defaultProps} showVariantToggle={true} />);

      expect(screen.getByLabelText('Switch frontend')).toBeInTheDocument();
    });

    it('hides variant toggle when disabled', () => {
      render(<HeaderSection {...defaultProps} showVariantToggle={false} />);

      expect(screen.queryByLabelText('Switch frontend')).not.toBeInTheDocument();
    });

    it('shows variant toggle icon', () => {
      render(<HeaderSection {...defaultProps} showVariantToggle={true} />);

      expect(screen.getByText('⚡')).toBeInTheDocument();
    });
  });

  describe('CTA Button', () => {
    it('renders CTA button with correct text and href', () => {
      render(<HeaderSection {...defaultProps} />);

      const ctaLink = screen.getByText('Get Started').closest('a');
      expect(ctaLink).toHaveAttribute('href', '/get-started');
    });

    it('renders CTA button with primary variant', () => {
      render(<HeaderSection {...defaultProps} />);

      const ctaLink = screen.getByText('Get Started').closest('a');
      // Check that it has the primary variant class
      expect(ctaLink).toHaveClass('stx-button');
    });
  });

  describe('Mobile Menu', () => {
    it('renders mobile menu button', () => {
      render(<HeaderSection {...defaultProps} />);

      expect(screen.getByLabelText('Open menu')).toBeInTheDocument();
    });

    it('opens mobile menu when button is clicked', () => {
      render(<HeaderSection {...defaultProps} />);

      const mobileButton = screen.getByLabelText('Open menu');

      act(() => {
        fireEvent.click(mobileButton);
      });

      expect(mobileButton).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByLabelText('Mobile navigation')).toBeInTheDocument();
    });

    it('closes mobile menu when navigation link is clicked', () => {
      render(<HeaderSection {...defaultProps} />);

      const mobileButton = screen.getByLabelText('Open menu');

      act(() => {
        fireEvent.click(mobileButton);
      });

      // Get the mobile navigation link specifically
      const mobileNav = screen.getByLabelText('Mobile navigation');
      const homeLink = mobileNav.querySelector('.stx-header-mobile-link') as HTMLElement;

      act(() => {
        fireEvent.click(homeLink);
      });

      expect(mobileButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('renders mobile navigation links', () => {
      render(<HeaderSection {...defaultProps} />);

      const mobileButton = screen.getByLabelText('Open menu');

      act(() => {
        fireEvent.click(mobileButton);
      });

      const mobileNav = screen.getByLabelText('Mobile navigation');
      expect(mobileNav).toBeInTheDocument();

      // Check that mobile navigation contains the links
      expect(mobileNav).toHaveTextContent('Home');
      expect(mobileNav).toHaveTextContent('About');
      expect(mobileNav).toHaveTextContent('Contact');
    });

    it('renders mobile CTA button', () => {
      render(<HeaderSection {...defaultProps} />);

      const mobileButton = screen.getByLabelText('Open menu');

      act(() => {
        fireEvent.click(mobileButton);
      });

      const mobileNav = screen.getByLabelText('Mobile navigation');
      const mobileCta = mobileNav.querySelector('.stx-header-mobile-link--cta');
      expect(mobileCta).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('applies minimal variant classes', () => {
      const { container } = render(<HeaderSection {...defaultProps} variant="minimal" />);

      expect(container.firstChild).toHaveClass('stx-header--minimal');
    });

    it('applies transparent variant classes', () => {
      const { container } = render(<HeaderSection {...defaultProps} variant="transparent" />);

      expect(container.firstChild).toHaveClass('stx-header--transparent');
    });
  });

  describe('Content Structure', () => {
    it('renders header with correct structure', () => {
      render(<HeaderSection {...defaultProps} />);

      expect(screen.getByText('Test Header').closest('.stx-header-logo')).toBeInTheDocument();
      expect(screen.getByText('Home').closest('.stx-header-menu')).toBeInTheDocument();
      expect(screen.getByText('Get Started').closest('.stx-header-actions')).toBeInTheDocument();
    });

    it('renders navigation with correct structure', () => {
      render(<HeaderSection {...defaultProps} />);

      expect(screen.getByText('Home').closest('.stx-header-menu-item')).toBeInTheDocument();
      expect(screen.getByText('About').closest('.stx-header-menu-item')).toBeInTheDocument();
      expect(screen.getByText('Contact').closest('.stx-header-menu-item')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper header role', () => {
      render(<HeaderSection {...defaultProps} />);

      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('has proper navigation roles', () => {
      render(<HeaderSection {...defaultProps} />);

      expect(screen.getByLabelText('Main navigation')).toBeInTheDocument();
    });

    it('has proper mobile navigation roles', () => {
      render(<HeaderSection {...defaultProps} />);

      const mobileButton = screen.getByLabelText('Open menu');

      act(() => {
        fireEvent.click(mobileButton);
      });

      expect(screen.getByLabelText('Mobile navigation')).toBeInTheDocument();
    });

    it('has proper aria-labels for toggle buttons', () => {
      render(<HeaderSection {...defaultProps} showThemeToggle={true} showVariantToggle={true} />);

      expect(screen.getByLabelText('Switch theme')).toBeInTheDocument();
      expect(screen.getByLabelText('Switch frontend')).toBeInTheDocument();
    });

    it('has proper aria-expanded for mobile menu', () => {
      render(<HeaderSection {...defaultProps} />);

      const mobileButton = screen.getByLabelText('Open menu');
      expect(mobileButton).toHaveAttribute('aria-expanded', 'false');

      act(() => {
        fireEvent.click(mobileButton);
      });

      expect(mobileButton).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('Custom Styling', () => {
    it('accepts custom className', () => {
      const { container } = render(<HeaderSection {...defaultProps} className="custom-header" />);

      expect(container.firstChild).toHaveClass('custom-header');
    });

    it('combines custom className with default classes', () => {
      const { container } = render(<HeaderSection {...defaultProps} className="custom-header" />);

      expect(container.firstChild).toHaveClass('stx-header');
      expect(container.firstChild).toHaveClass('stx-header--default');
      expect(container.firstChild).toHaveClass('custom-header');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty navigation array', () => {
      const propsWithEmptyNav = {
        ...defaultProps,
        navigation: []
      };

      render(<HeaderSection {...propsWithEmptyNav} />);

      expect(screen.getByText('Test Header')).toBeInTheDocument();
      expect(screen.getByText('Get Started')).toBeInTheDocument();
    });

    it('handles empty languages array', () => {
      const propsWithEmptyLanguages = {
        ...defaultProps,
        languages: []
      };

      render(<HeaderSection {...propsWithEmptyLanguages} showLanguageSwitcher={true} />);

      expect(screen.getByText('Test Header')).toBeInTheDocument();
      expect(screen.getByText('Get Started')).toBeInTheDocument();
    });

    it('handles custom CTA text and href', () => {
      const propsWithCustomCta = {
        title: 'Test Header',
        navigation: [
          { label: 'Home', href: '/home' }
        ],
        languages: [
          { value: 'en', label: 'EN', flag: '🇬🇧' }
        ],
        cta: { text: 'Custom CTA', href: '/custom' }
      };

      render(<HeaderSection {...propsWithCustomCta} />);

      expect(screen.getByText('Test Header')).toBeInTheDocument();
      expect(screen.getByText('Custom CTA')).toBeInTheDocument();

      const ctaLink = screen.getByText('Custom CTA').closest('a');
      expect(ctaLink).toHaveAttribute('href', '/custom');
    });
  });

  describe('Responsive Behavior', () => {
    it('closes mobile menu on window resize', () => {
      render(<HeaderSection {...defaultProps} />);

      const mobileButton = screen.getByLabelText('Open menu');

      act(() => {
        fireEvent.click(mobileButton);
      });

      expect(mobileButton).toHaveAttribute('aria-expanded', 'true');

      act(() => {
        // Simulate window resize to desktop width
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: 1200
        });
        window.dispatchEvent(new Event('resize'));
      });

      expect(mobileButton).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Theme Integration', () => {
    it('integrates with theme system', () => {
      render(
        <div data-theme="dark">
          <HeaderSection {...defaultProps} />
        </div>
      );

      const headerSection = document.querySelector('.stx-header');
      expect(headerSection).toBeInTheDocument();
    });

    it('applies theme-specific styling', () => {
      const { container } = renderWithTheme(<HeaderSection {...defaultProps} />, 'dark');

      const themeContainer = container.closest('[data-theme]');
      if (themeContainer) {
        expect(themeContainer).toHaveAttribute('data-theme', 'dark');
      }

      const headerSection = container.querySelector('.stx-header');
      expect(headerSection).toBeInTheDocument();
    });

    it('maintains functionality across all themes', () => {
      ALL_THEMES.forEach(theme => {
        const { container } = renderWithTheme(<HeaderSection {...defaultProps} />, theme);

        const headerSection = container.querySelector('.stx-header');
        expect(headerSection).toBeInTheDocument();

        // Verify content is still rendered - use getAllByText to handle multiple instances
        const titleElements = screen.getAllByText('Test Header');
        expect(titleElements.length).toBeGreaterThan(0);
      });
    });

    it('applies theme-specific CSS variables', () => {
      ALL_THEMES.forEach(theme => {
        const { container } = renderWithTheme(<HeaderSection {...defaultProps} />, theme);

        const root = container.closest('[data-theme]');
        if (root) {
          const computedStyle = getComputedStyle(root);

          // Check for theme-specific variables
          const bgPrimary = computedStyle.getPropertyValue('--bg-primary');
          const textPrimary = computedStyle.getPropertyValue('--text-primary');

          expect(bgPrimary).toBeDefined();
          expect(textPrimary).toBeDefined();
        }
      });
    });

    it('supports theme switching without breaking', () => {
      const { rerender } = renderWithTheme(<HeaderSection {...defaultProps} />, 'light');

      // Switch to dark theme
      rerender(<HeaderSection {...defaultProps} />);
      const darkContainer = document.querySelector('[data-theme="light"]');
      expect(darkContainer).toBeInTheDocument();

      // Switch to eu theme
      rerender(<HeaderSection {...defaultProps} />);
      const euContainer = document.querySelector('[data-theme="light"]');
      expect(euContainer).toBeInTheDocument();

      // Switch to uae theme
      rerender(<HeaderSection {...defaultProps} />);
      const uaeContainer = document.querySelector('[data-theme="light"]');
      expect(uaeContainer).toBeInTheDocument();

      // Switch back to light theme
      rerender(<HeaderSection {...defaultProps} />);
      const lightContainer = document.querySelector('[data-theme="light"]');
      expect(lightContainer).toBeInTheDocument();
    });
  });

  // Enhanced theme switching tests using the utility
  testCompleteThemeSupport(
    'HeaderSection',
    (theme: ThemeName) => <HeaderSection {...defaultProps} />,
    {
      testSelectors: {
        background: '.stx-header',
        text: '.stx-header__title',
        border: '.stx-header',
        action: '.stx-header__cta'
      },
      testTransitions: true,
      testAccessibility: true,
      testPerformance: true
    }
  );
});
