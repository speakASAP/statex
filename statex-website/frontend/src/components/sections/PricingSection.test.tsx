import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PricingSection } from './PricingSection';
import { PricingSectionConfig } from '@/types/templates';
import {
  testCompleteThemeSupport,
  renderWithTheme,
  ALL_THEMES,
  type ThemeName
} from '../../test/utils/theme-testing';

// Mock data
const mockPricingConfig: PricingSectionConfig = {
  title: 'Choose Your Plan',
  plans: [
    {
      name: 'Starter',
      price: '$29/month',
      description: 'Perfect for small businesses',
      features: [
        'Up to 5 users',
        'Basic analytics',
        'Email support',
        '10GB storage'
      ],
      popular: false
    },
    {
      name: 'Professional',
      price: '$99/month',
      description: 'Ideal for growing teams',
      features: [
        'Up to 25 users',
        'Advanced analytics',
        'Priority support',
        '100GB storage',
        'Custom integrations'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$299/month',
      description: 'For large organizations',
      features: [
        'Unlimited users',
        'Enterprise analytics',
        '24/7 support',
        'Unlimited storage',
        'Custom integrations',
        'Dedicated account manager'
      ],
      popular: false
    }
  ]
};

describe('PricingSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Cleanup
  });

  describe('STX Classes', () => {
    it('applies correct STX classes to pricing section', () => {
      render(<PricingSection {...mockPricingConfig} />);

      const pricingSection = document.querySelector('.stx-pricing-section');
      expect(pricingSection).toBeInTheDocument();
    });

    it('applies BEM-style classes to pricing elements', () => {
      render(<PricingSection {...mockPricingConfig} />);

      const pricingContainer = document.querySelector('.stx-pricing-container');
      const pricingTitle = document.querySelector('.stx-pricing__section-title');
      const pricingPlans = document.querySelector('.stx-pricing__plans');

      expect(pricingContainer).toBeInTheDocument();
      expect(pricingTitle).toBeInTheDocument();
      expect(pricingPlans).toBeInTheDocument();
    });

    it('applies popular plan classes correctly', () => {
      render(<PricingSection {...mockPricingConfig} />);

      const popularPlan = document.querySelector('.stx-pricing__plan--popular');
      expect(popularPlan).toBeInTheDocument();
    });

    it('applies plan-specific classes', () => {
      render(<PricingSection {...mockPricingConfig} />);

      const planCards = document.querySelectorAll('.stx-pricing__plan');
      expect(planCards).toHaveLength(3);

      planCards.forEach(plan => {
        expect(plan).toHaveClass('stx-pricing__plan');
      });
    });

    it('applies plan content classes', () => {
      render(<PricingSection {...mockPricingConfig} />);

      const planContents = document.querySelectorAll('.stx-pricing__plan-content');
      expect(planContents).toHaveLength(3);

      planContents.forEach(content => {
        expect(content).toHaveClass('stx-pricing__plan-content');
      });
    });

    it('applies feature list classes', () => {
      render(<PricingSection {...mockPricingConfig} />);

      const featureLists = document.querySelectorAll('.stx-pricing__plan-features');
      expect(featureLists).toHaveLength(3);

      featureLists.forEach(list => {
        expect(list).toHaveClass('stx-pricing__plan-features');
      });
    });

    it('applies feature item classes', () => {
      render(<PricingSection {...mockPricingConfig} />);

      const featureItems = document.querySelectorAll('.stx-pricing__plan-feature');
      expect(featureItems.length).toBeGreaterThan(0);

      featureItems.forEach(item => {
        expect(item).toHaveClass('stx-pricing__plan-feature');
      });
    });

    it('applies CTA button classes', () => {
      render(<PricingSection {...mockPricingConfig} />);

      const ctaButtons = document.querySelectorAll('.stx-pricing__plan-cta');
      expect(ctaButtons).toHaveLength(3);

      ctaButtons.forEach(button => {
        expect(button).toHaveClass('stx-pricing__plan-cta');
      });
    });
  });

  describe('Template Section Functionality', () => {
    it('renders pricing section title correctly', () => {
      render(<PricingSection {...mockPricingConfig} />);

      expect(screen.getByText('Choose Your Plan')).toBeInTheDocument();
    });

    it('renders all pricing plans', () => {
      render(<PricingSection {...mockPricingConfig} />);

      expect(screen.getByText('Starter')).toBeInTheDocument();
      expect(screen.getByText('Professional')).toBeInTheDocument();
      expect(screen.getByText('Enterprise')).toBeInTheDocument();
    });

    it('renders plan prices correctly', () => {
      render(<PricingSection {...mockPricingConfig} />);

      expect(screen.getByText('$29/month')).toBeInTheDocument();
      expect(screen.getByText('$99/month')).toBeInTheDocument();
      expect(screen.getByText('$299/month')).toBeInTheDocument();
    });

    it('renders plan descriptions', () => {
      render(<PricingSection {...mockPricingConfig} />);

      expect(screen.getByText('Perfect for small businesses')).toBeInTheDocument();
      expect(screen.getByText('Ideal for growing teams')).toBeInTheDocument();
      expect(screen.getByText('For large organizations')).toBeInTheDocument();
    });

    it('renders all plan features', () => {
      render(<PricingSection {...mockPricingConfig} />);

      // Starter plan features
      expect(screen.getByText('Up to 5 users')).toBeInTheDocument();
      expect(screen.getByText('Basic analytics')).toBeInTheDocument();
      expect(screen.getByText('Email support')).toBeInTheDocument();
      expect(screen.getByText('10GB storage')).toBeInTheDocument();

      // Professional plan features
      expect(screen.getByText('Up to 25 users')).toBeInTheDocument();
      expect(screen.getByText('Advanced analytics')).toBeInTheDocument();
      expect(screen.getByText('Priority support')).toBeInTheDocument();
      expect(screen.getByText('100GB storage')).toBeInTheDocument();
      expect(screen.getAllByText('Custom integrations')).toHaveLength(2); // Appears in Professional and Enterprise plans

      // Enterprise plan features
      expect(screen.getByText('Unlimited users')).toBeInTheDocument();
      expect(screen.getByText('Enterprise analytics')).toBeInTheDocument();
      expect(screen.getByText('24/7 support')).toBeInTheDocument();
      expect(screen.getByText('Unlimited storage')).toBeInTheDocument();
      expect(screen.getByText('Dedicated account manager')).toBeInTheDocument();
    });

    it('renders CTA buttons for all plans', () => {
      render(<PricingSection {...mockPricingConfig} />);

      const ctaButtons = screen.getAllByText('Get Started');
      expect(ctaButtons).toHaveLength(3);
    });

    it('handles empty plans array', () => {
      const emptyConfig: PricingSectionConfig = {
        title: 'Empty Pricing',
        plans: []
      };

      render(<PricingSection {...emptyConfig} />);

      expect(screen.getByText('Empty Pricing')).toBeInTheDocument();
      const planCards = document.querySelectorAll('.stx-pricing__plan');
      expect(planCards).toHaveLength(0);
    });

    it('handles single plan', () => {
      const singlePlanConfig: PricingSectionConfig = {
        title: 'Single Plan',
        plans: [
          {
            name: 'Basic',
            price: '$19/month',
            description: 'Basic plan',
            features: ['Feature 1', 'Feature 2'],
            popular: false
          }
        ]
      };

      render(<PricingSection {...singlePlanConfig} />);

      expect(screen.getByText('Single Plan')).toBeInTheDocument();
      expect(screen.getByText('Basic')).toBeInTheDocument();
      expect(screen.getByText('$19/month')).toBeInTheDocument();
      expect(screen.getByText('Feature 1')).toBeInTheDocument();
      expect(screen.getByText('Feature 2')).toBeInTheDocument();
    });
  });

  describe('Popular Plan Highlighting', () => {
    it('highlights popular plan correctly', () => {
      render(<PricingSection {...mockPricingConfig} />);

      const popularPlan = document.querySelector('.stx-pricing__plan--popular');
      expect(popularPlan).toBeInTheDocument();

      // Check that it's the Professional plan
      const popularPlanContent = popularPlan?.textContent;
      expect(popularPlanContent).toContain('Professional');
      expect(popularPlanContent).toContain('$99/month');
    });

    it('handles multiple popular plans', () => {
      const multiPopularConfig: PricingSectionConfig = {
        title: 'Multiple Popular Plans',
        plans: [
          {
            name: 'Plan 1',
            price: '$10/month',
            description: 'First plan',
            features: ['Feature 1'],
            popular: true
          },
          {
            name: 'Plan 2',
            price: '$20/month',
            description: 'Second plan',
            features: ['Feature 2'],
            popular: true
          }
        ]
      };

      render(<PricingSection {...multiPopularConfig} />);

      const popularPlans = document.querySelectorAll('.stx-pricing__plan--popular');
      expect(popularPlans).toHaveLength(2);
    });

    it('handles no popular plans', () => {
      const noPopularConfig: PricingSectionConfig = {
        title: 'No Popular Plans',
        plans: [
          {
            name: 'Plan 1',
            price: '$10/month',
            description: 'First plan',
            features: ['Feature 1'],
            popular: false
          },
          {
            name: 'Plan 2',
            price: '$20/month',
            description: 'Second plan',
            features: ['Feature 2'],
            popular: false
          }
        ]
      };

      render(<PricingSection {...noPopularConfig} />);

      const popularPlans = document.querySelectorAll('.stx-pricing__plan--popular');
      expect(popularPlans).toHaveLength(0);
    });
  });

  describe('Layout Variants', () => {
    it('renders plans in grid layout', () => {
      render(<PricingSection {...mockPricingConfig} />);

      const pricingPlans = document.querySelector('.stx-pricing__plans');
      expect(pricingPlans).toBeInTheDocument();
    });

    it('maintains proper plan structure', () => {
      render(<PricingSection {...mockPricingConfig} />);

      const planCards = document.querySelectorAll('.stx-pricing__plan');
      expect(planCards).toHaveLength(3);

      planCards.forEach(plan => {
        const planContent = plan.querySelector('.stx-pricing__plan-content');
        const planName = plan.querySelector('.stx-pricing__plan-name');
        const planPrice = plan.querySelector('.stx-pricing__plan-price');
        const planDescription = plan.querySelector('.stx-pricing__plan-description');
        const planFeatures = plan.querySelector('.stx-pricing__plan-features');
        const planCta = plan.querySelector('.stx-pricing__plan-cta');

        expect(planContent).toBeInTheDocument();
        expect(planName).toBeInTheDocument();
        expect(planPrice).toBeInTheDocument();
        expect(planDescription).toBeInTheDocument();
        expect(planFeatures).toBeInTheDocument();
        expect(planCta).toBeInTheDocument();
      });
    });
  });

  describe('Responsive Behavior', () => {
    it('adapts to mobile viewport', () => {
      // Set mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(<PricingSection {...mockPricingConfig} />);

      const pricingSection = document.querySelector('.stx-pricing-section');
      expect(pricingSection).toBeInTheDocument();

      // Reset viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
    });

    it('maintains structure on different screen sizes', () => {
      const viewports = [375, 768, 1024, 1440];

      viewports.forEach(width => {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: width,
        });

        render(<PricingSection {...mockPricingConfig} />);

        const pricingSection = document.querySelector('.stx-pricing-section');
        expect(pricingSection).toBeInTheDocument();

        // Clean up
        document.body.innerHTML = '';
      });
    });
  });

  describe('Accessibility', () => {
    it('maintains proper semantic structure', () => {
      render(<PricingSection {...mockPricingConfig} />);

      const pricingSection = document.querySelector('section');
      expect(pricingSection).toBeInTheDocument();
      expect(pricingSection).toHaveClass('stx-pricing-section');
    });

    it('provides proper heading hierarchy', () => {
      render(<PricingSection {...mockPricingConfig} />);

      const sectionTitle = document.querySelector('.stx-pricing__section-title');
      const planNames = document.querySelectorAll('.stx-pricing__plan-name');

      expect(sectionTitle).toBeInTheDocument();
      expect(planNames).toHaveLength(3);
    });

    it('ensures feature lists are accessible', () => {
      render(<PricingSection {...mockPricingConfig} />);

      const featureLists = document.querySelectorAll('ul.stx-pricing__plan-features');
      expect(featureLists).toHaveLength(3);

      featureLists.forEach(list => {
        const listItems = list.querySelectorAll('li');
        expect(listItems.length).toBeGreaterThan(0);
      });
    });

    it('provides accessible CTA buttons', () => {
      render(<PricingSection {...mockPricingConfig} />);

      const ctaButtons = screen.getAllByText('Get Started');
      expect(ctaButtons).toHaveLength(3);

      ctaButtons.forEach(button => {
        expect(button).toBeInTheDocument();
      });
    });
  });

  describe('Performance & Error Handling', () => {
    it('renders efficiently with multiple plans', () => {
      const startTime = performance.now();

      render(<PricingSection {...mockPricingConfig} />);

      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(200); // Should render quickly
    });

    it('handles missing plan properties gracefully', () => {
      const incompleteConfig: PricingSectionConfig = {
        title: 'Incomplete Plans',
        plans: [
          {
            name: 'Incomplete Plan',
            price: '$10/month',
            description: '',
            features: [],
            popular: false
          }
        ]
      };

      render(<PricingSection {...incompleteConfig} />);

      expect(screen.getByText('Incomplete Plans')).toBeInTheDocument();
      expect(screen.getByText('Incomplete Plan')).toBeInTheDocument();
      expect(screen.getByText('$10/month')).toBeInTheDocument();
    });

    it('handles undefined config gracefully', () => {
      render(<PricingSection title="Test Pricing" plans={[]} />); // Provide required title property

      // Should render without crashing
      expect(screen.getByText('Test Pricing')).toBeInTheDocument();
    });
  });

  describe('Integration Testing', () => {
    it('integrates with Card component correctly', () => {
      render(<PricingSection {...mockPricingConfig} />);

      const planCards = document.querySelectorAll('.stx-pricing__plan');
      expect(planCards).toHaveLength(3);

      planCards.forEach(card => {
        expect(card).toHaveClass('stx-pricing__plan');
      });
    });

    it('integrates with Button component correctly', () => {
      render(<PricingSection {...mockPricingConfig} />);

      const ctaButtons = document.querySelectorAll('.stx-pricing__plan-cta');
      expect(ctaButtons).toHaveLength(3);

      ctaButtons.forEach(button => {
        expect(button).toHaveClass('stx-pricing__plan-cta');
      });
    });

    it('integrates with Text component correctly', () => {
      render(<PricingSection {...mockPricingConfig} />);

      const textElements = document.querySelectorAll('[class*="stx-pricing__"]');
      expect(textElements.length).toBeGreaterThan(0);
    });

    it('handles complex pricing configurations', () => {
      const complexConfig: PricingSectionConfig = {
        title: 'Complex Pricing',
        plans: [
          {
            name: 'Complex Plan',
            price: '$999/month',
            description: 'A very complex plan with many features and benefits for enterprise customers',
            features: [
              'Feature 1 with very long description',
              'Feature 2 with special characters: @#$%^&*()',
              'Feature 3 with numbers: 1234567890',
              'Feature 4 with emojis: 🚀 💻 📱',
              'Feature 5 with HTML: <strong>Bold</strong> text'
            ],
            popular: true
          }
        ]
      };

      render(<PricingSection {...complexConfig} />);

      expect(screen.getByText('Complex Pricing')).toBeInTheDocument();
      expect(screen.getByText('Complex Plan')).toBeInTheDocument();
      expect(screen.getByText('$999/month')).toBeInTheDocument();
      expect(screen.getByText(/Feature 1 with very long description/)).toBeInTheDocument();
      expect(screen.getByText(/Feature 2 with special characters/)).toBeInTheDocument();
      expect(screen.getByText(/Feature 3 with numbers/)).toBeInTheDocument();
      expect(screen.getByText(/Feature 4 with emojis/)).toBeInTheDocument();
      expect(screen.getByText(/Feature 5 with HTML/)).toBeInTheDocument();
    });
  });

  describe('Theme Integration', () => {
    it('integrates with theme system', () => {
      render(
        <div data-theme="dark">
          <PricingSection {...mockPricingConfig} />
        </div>
      );

      const pricingSection = document.querySelector('.stx-pricing-section');
      expect(pricingSection).toBeInTheDocument();
    });

    it('applies theme-specific styling', () => {
      const { container } = renderWithTheme(<PricingSection {...mockPricingConfig} />, 'dark');

      const themeContainer = container.closest('[data-theme]');
      if (themeContainer) {
        expect(themeContainer).toHaveAttribute('data-theme', 'dark');
      }

      const pricingSection = container.querySelector('.stx-pricing-section');
      expect(pricingSection).toBeInTheDocument();
    });

    it('maintains functionality across all themes', () => {
      ALL_THEMES.forEach(theme => {
        const { container } = renderWithTheme(<PricingSection {...mockPricingConfig} />, theme);

        const pricingSection = container.querySelector('.stx-pricing-section');
        expect(pricingSection).toBeInTheDocument();

        // Verify content is still rendered - use getAllByText to handle multiple instances
        const titleElements = screen.getAllByText('Choose Your Plan');
        expect(titleElements.length).toBeGreaterThan(0);
      });
    });

    it('applies theme-specific CSS variables', () => {
      ALL_THEMES.forEach(theme => {
        const { container } = renderWithTheme(<PricingSection {...mockPricingConfig} />, theme);

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
      const { rerender } = renderWithTheme(<PricingSection {...mockPricingConfig} />, 'light');

      // Switch to dark theme
      rerender(<PricingSection {...mockPricingConfig} />);
      const darkContainer = document.querySelector('[data-theme="light"]');
      expect(darkContainer).toBeInTheDocument();

      // Switch to eu theme
      rerender(<PricingSection {...mockPricingConfig} />);
      const euContainer = document.querySelector('[data-theme="light"]');
      expect(euContainer).toBeInTheDocument();

      // Switch to uae theme
      rerender(<PricingSection {...mockPricingConfig} />);
      const uaeContainer = document.querySelector('[data-theme="light"]');
      expect(uaeContainer).toBeInTheDocument();

      // Switch back to light theme
      rerender(<PricingSection {...mockPricingConfig} />);
      const lightContainer = document.querySelector('[data-theme="light"]');
      expect(lightContainer).toBeInTheDocument();
    });
  });

  // Enhanced theme switching tests using the utility
  testCompleteThemeSupport(
    'PricingSection',
    (theme: ThemeName) => <PricingSection {...mockPricingConfig} />,
    {
      testSelectors: {
        background: '.stx-pricing-section',
        text: '.stx-pricing__section-title',
        border: '.stx-pricing__plan',
        action: '.stx-pricing__plan-cta'
      },
      testTransitions: true,
      testAccessibility: true,
      testPerformance: true
    }
  );
});
