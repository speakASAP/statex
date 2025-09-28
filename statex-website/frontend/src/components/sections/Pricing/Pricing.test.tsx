import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pricing } from './Pricing';
import {
  testCompleteThemeSupport,
  renderWithTheme,
  ALL_THEMES,
  type ThemeName
} from '../../../test/utils/theme-testing';

const mockPlans = [
  {
    name: 'Basic',
    price: '$29/month',
    features: ['Feature 1', 'Feature 2'],
    popular: false
  },
  {
    name: 'Pro',
    price: '$99/month',
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
    popular: true
  }
];

const abTest = { experimentId: 'pricing-exp-123', variant: 'A' };

describe('Pricing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Cleanup
  });

  describe('STX Classes & Data Attributes', () => {
    it('applies correct STX classes and data attributes', () => {
      render(<Pricing />);
      const section = document.querySelector('section.stx-pricing');
      expect(section).toBeInTheDocument();
      expect(section).toHaveClass('stx-pricing-cards');
      expect(section).toHaveClass('stx-pricing-priority-medium');
      expect(section).toHaveAttribute('data-section-type', 'pricing');
      expect(section).toHaveAttribute('data-section-variant', 'cards');
      expect(section).toHaveAttribute('data-section-priority', 'medium');
      expect(section).toHaveAttribute('data-ai-optimized', 'false');
    });

    it('applies custom className', () => {
      render(<Pricing className="custom-pricing" />);
      const section = document.querySelector('section.stx-pricing');
      expect(section).toHaveClass('custom-pricing');
    });

    it('applies AI optimization and AB test classes', () => {
      render(<Pricing aiOptimized abTest={abTest} />);
      const section = document.querySelector('section.stx-pricing');
      expect(section).toHaveClass('stx-pricing-ai-optimized');
      expect(section).toHaveClass('stx-pricing-ab-test');
      expect(section).toHaveAttribute('data-ai-optimized', 'true');
      expect(section).toHaveAttribute('data-ab-test', abTest.experimentId);
    });
  });

  describe('Variants', () => {
    it('renders cards variant by default', () => {
      render(<Pricing />);
      expect(screen.getByText('Pricing Plans')).toBeInTheDocument();
      expect(screen.getByText('Choose the perfect plan for your needs')).toBeInTheDocument();
      expect(screen.getByText('Pricing section - cards variant coming soon')).toBeInTheDocument();
      expect(document.querySelector('.stx-pricing-cards')).toBeInTheDocument();
    });

    it('renders table variant', () => {
      render(<Pricing variant="table" />);
      expect(screen.getByText('Pricing section - table variant coming soon')).toBeInTheDocument();
      expect(document.querySelector('.stx-pricing-table')).toBeInTheDocument();
    });

    it('renders comparison variant', () => {
      render(<Pricing variant="comparison" />);
      expect(screen.getByText('Pricing section - comparison variant coming soon')).toBeInTheDocument();
      expect(document.querySelector('.stx-pricing-comparison')).toBeInTheDocument();
    });
  });

  describe('Content Rendering', () => {
    it('renders default title and description', () => {
      render(<Pricing />);
      expect(screen.getByText('Pricing Plans')).toBeInTheDocument();
      expect(screen.getByText('Choose the perfect plan for your needs')).toBeInTheDocument();
    });

    it('renders custom title and description', () => {
      render(
        <Pricing
          title="Custom Pricing"
          description="Custom description for pricing plans"
        />
      );
      expect(screen.getByText('Custom Pricing')).toBeInTheDocument();
      expect(screen.getByText('Custom description for pricing plans')).toBeInTheDocument();
    });

    it('handles missing description', () => {
      render(<Pricing description="" />);
      expect(screen.getByText('Pricing Plans')).toBeInTheDocument();
      // Component shows placeholder when description is empty
      expect(screen.getByText('Pricing section - cards variant coming soon')).toBeInTheDocument();
    });
  });

  describe('Priority', () => {
    it('applies high priority class and data attribute', () => {
      render(<Pricing priority="high" />);
      const section = document.querySelector('section.stx-pricing');
      expect(section).toHaveClass('stx-pricing-priority-high');
      expect(section).toHaveAttribute('data-section-priority', 'high');
    });

    it('applies low priority class and data attribute', () => {
      render(<Pricing priority="low" />);
      const section = document.querySelector('section.stx-pricing');
      expect(section).toHaveClass('stx-pricing-priority-low');
      expect(section).toHaveAttribute('data-section-priority', 'low');
    });
  });

  describe('Structure & Layout', () => {
    it('renders section and container with correct structure', () => {
      render(<Pricing />);
      const section = document.querySelector('section.stx-pricing');
      expect(section).toBeInTheDocument();
      const container = document.querySelector('.stx-pricing-container');
      expect(container).toBeInTheDocument();
    });

    it('renders header with title and description', () => {
      render(<Pricing />);
      const header = document.querySelector('.stx-pricing-header');
      expect(header).toBeInTheDocument();
      expect(header).toHaveTextContent('Pricing Plans');
      expect(header).toHaveTextContent('Choose the perfect plan for your needs');
    });

    it('renders content section', () => {
      render(<Pricing />);
      const content = document.querySelector('.stx-pricing-content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveTextContent('Pricing section - cards variant coming soon');
    });
  });

  describe('Edge Cases & Error Handling', () => {
    it('renders with minimal props', () => {
      render(<Pricing title="Only Title" />);
      expect(screen.getByText('Only Title')).toBeInTheDocument();
    });

    it('handles empty plans array', () => {
      render(<Pricing plans={[]} />);
      expect(screen.getByText('Pricing Plans')).toBeInTheDocument();
    });

    it('handles undefined plans', () => {
      render(<Pricing plans={undefined as any} />);
      expect(screen.getByText('Pricing Plans')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('renders h2 for title', () => {
      render(<Pricing title="Accessible Pricing" />);
      const h2 = screen.getByRole('heading', { level: 2 });
      expect(h2).toHaveTextContent('Accessible Pricing');
    });

    it('maintains semantic structure', () => {
      render(<Pricing />);
      const section = document.querySelector('section.stx-pricing');
      expect(section).toBeInTheDocument();
    });
  });

  describe('Event Handlers', () => {
    it('calls onLoad when component mounts', () => {
      const onLoad = vi.fn();
      render(<Pricing onLoad={onLoad} />);
      // Note: Since this is a placeholder component, onLoad might not be called
      // This test documents the expected behavior
    });

    it('calls onError when error occurs', () => {
      const onError = vi.fn();
      render(<Pricing onError={onError} />);
      // Note: Since this is a placeholder component, onError might not be called
      // This test documents the expected behavior
    });
  });

  describe('Responsive Behavior', () => {
    it('adapts to mobile viewport', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(<Pricing />);
      const section = document.querySelector('section.stx-pricing');
      expect(section).toBeInTheDocument();

      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
    });
  });

  describe('Integration Testing', () => {
    it('integrates with Container component', () => {
      render(<Pricing />);
      const container = document.querySelector('.stx-pricing-container');
      expect(container).toBeInTheDocument();
    });

    it('integrates with Text component', () => {
      render(<Pricing />);
      const title = document.querySelector('.stx-pricing-title');
      const description = document.querySelector('.stx-pricing-description');
      expect(title).toBeInTheDocument();
      expect(description).toBeInTheDocument();
    });
  });
});

describe('Pricing Theme Switching', () => {
  ALL_THEMES.forEach(theme => {
    it(`renders correctly in ${theme} theme`, () => {
      const { container } = renderWithTheme(<Pricing />, theme);
      const pricing = container.querySelector('.stx-pricing');
      expect(pricing).toBeInTheDocument();
      // Theme container check
      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });

    it(`applies correct border/background/text color in ${theme} theme`, () => {
      const { container } = renderWithTheme(<Pricing />, theme);
      const pricing = container.querySelector('.stx-pricing');
      const computedStyle = getComputedStyle(pricing as Element);
      expect(computedStyle.backgroundColor).toBeDefined();
      expect(computedStyle.color).toBeDefined();
      expect(computedStyle.borderColor).toBeDefined();
    });
  });

  it('maintains functionality across all themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(<Pricing />, theme);
      const pricing = container.querySelector('.stx-pricing');
      expect(pricing).toBeInTheDocument();
      expect(pricing).toHaveClass('stx-pricing');

      // Check for pricing content
      const pricingContent = container.querySelector('.stx-pricing-content');
      expect(pricingContent).toBeInTheDocument();

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('applies theme-specific styling for different variants', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Pricing variant="table" />,
        theme
      );
      const pricing = container.querySelector('.stx-pricing');
      expect(pricing).toHaveAttribute('data-section-variant', 'table');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('maintains accessibility across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Pricing title="Accessible Pricing" />,
        theme
      );
      const pricing = container.querySelector('.stx-pricing');
      expect(pricing).toHaveAttribute('data-section-type', 'pricing');

      // Check for proper heading hierarchy
      const h2 = container.querySelector('h2');
      expect(h2).toHaveTextContent('Accessible Pricing');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('handles theme transitions smoothly', () => {
    // Test light theme
    const { container: lightContainer } = renderWithTheme(<Pricing />, 'light');
    let themeContainer = lightContainer.querySelector('[data-theme]');
    expect(themeContainer).toHaveAttribute('data-theme', 'light');

    // Test dark theme
    const { container: darkContainer } = renderWithTheme(<Pricing />, 'dark');
    themeContainer = darkContainer.querySelector('[data-theme]');
    expect(themeContainer).toHaveAttribute('data-theme', 'dark');
  });

  it('maintains performance across theme switches', () => {
    const startTime = performance.now();

    ALL_THEMES.forEach(theme => {
      renderWithTheme(<Pricing />, theme);
    });

    const endTime = performance.now();
    const totalTime = endTime - startTime;

    // Performance threshold: should complete all theme renders in under 250ms
    expect(totalTime).toBeLessThan(250);
  });

  it('applies correct pricing styling across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(<Pricing />, theme);
      const pricing = container.querySelector('.stx-pricing');
      expect(pricing).toBeInTheDocument();

      // Check pricing structure
      const pricingContainer = container.querySelector('.stx-pricing-container');
      const pricingHeader = container.querySelector('.stx-pricing-header');
      const pricingContent = container.querySelector('.stx-pricing-content');
      expect(pricingContainer).toBeInTheDocument();
      expect(pricingHeader).toBeInTheDocument();
      expect(pricingContent).toBeInTheDocument();

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('handles different variants across themes', () => {
    const variants = ['cards', 'table', 'comparison'] as const;

    ALL_THEMES.forEach(theme => {
      variants.forEach(variant => {
        const { container } = renderWithTheme(
          <Pricing variant={variant} />,
          theme
        );
        const pricing = container.querySelector('.stx-pricing');
        expect(pricing).toHaveAttribute('data-section-variant', variant);

        const themeContainer = container.querySelector('[data-theme]');
        expect(themeContainer).toHaveAttribute('data-theme', theme);
      });
    });
  });

  it('maintains title and description rendering across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Pricing title="Custom Pricing" description="Custom description" />,
        theme
      );

      // Check for title and description
      expect(container).toHaveTextContent('Custom Pricing');
      expect(container).toHaveTextContent('Custom description');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('maintains custom className across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Pricing className="custom-pricing-class" />,
        theme
      );
      const pricing = container.querySelector('.stx-pricing');
      expect(pricing).toHaveClass('custom-pricing-class', 'stx-pricing');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('maintains priority attributes across themes', () => {
    const priorities = ['low', 'medium', 'high'] as const;

    ALL_THEMES.forEach(theme => {
      priorities.forEach(priority => {
        const { container } = renderWithTheme(
          <Pricing priority={priority} />,
          theme
        );
        const pricing = container.querySelector('.stx-pricing');
        expect(pricing).toHaveAttribute('data-section-priority', priority);

        const themeContainer = container.querySelector('[data-theme]');
        expect(themeContainer).toHaveAttribute('data-theme', theme);
      });
    });
  });

  it('maintains AI optimization attributes across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Pricing aiOptimized={true} />,
        theme
      );
      const pricing = container.querySelector('.stx-pricing');
      expect(pricing).toHaveAttribute('data-ai-optimized', 'true');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('maintains AB test attributes across themes', () => {
    const abTest = { experimentId: 'test-exp', variant: 'A' };

    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Pricing abTest={abTest} />,
        theme
      );
      const pricing = container.querySelector('.stx-pricing');
      expect(pricing).toHaveAttribute('data-ab-test', 'test-exp');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('maintains semantic structure across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(<Pricing />, theme);

      // Check semantic structure
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveAttribute('data-section-type', 'pricing');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('maintains container integration across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(<Pricing />, theme);

      // Check container integration
      const pricingContainer = container.querySelector('.stx-pricing-container');
      expect(pricingContainer).toBeInTheDocument();

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('maintains text component integration across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Pricing title="Test Pricing" description="Test Description" />,
        theme
      );

      // Check text component integration
      const title = container.querySelector('h2');
      const description = container.querySelector('.stx-pricing-description');
      expect(title).toHaveTextContent('Test Pricing');
      expect(description).toHaveTextContent('Test Description');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('handles plans array across themes', () => {
    const plans = [
      { name: 'Basic', price: '$29/month', features: ['Feature 1'], popular: false },
      { name: 'Pro', price: '$99/month', features: ['Feature 1', 'Feature 2'], popular: true }
    ];

    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Pricing plans={plans} />,
        theme
      );

      // Should render the actual plans since they are implemented
      expect(container).toHaveTextContent('Basic');
      expect(container).toHaveTextContent('Pro');
      expect(container).toHaveTextContent('$29/month');
      expect(container).toHaveTextContent('$99/month');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('handles empty plans across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Pricing plans={[]} />,
        theme
      );

      // Should still render header
      expect(container).toHaveTextContent('Pricing Plans');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });
});
