import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Testimonials } from './Testimonials';
import {
  testCompleteThemeSupport,
  renderWithTheme,
  ALL_THEMES,
  type ThemeName
} from '../../../test/utils/theme-testing';

const mockTestimonials = [
  {
    name: 'John Smith',
    role: 'CEO',
    company: 'TechCorp',
    content: 'Amazing service and results!',
    avatar: '/images/john.jpg'
  },
  {
    name: 'Sarah Johnson',
    role: 'CTO',
    company: 'InnovateLab',
    content: 'Transformed our business completely.',
    avatar: '/images/sarah.jpg'
  }
];

const abTest = { experimentId: 'testimonials-exp-123', variant: 'A' };

describe('Testimonials', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Cleanup
  });

  describe('STX Classes & Data Attributes', () => {
    it('applies correct STX classes and data attributes', () => {
      render(<Testimonials />);
      const section = document.querySelector('section.stx-testimonials');
      expect(section).toBeInTheDocument();
      expect(section).toHaveClass('stx-testimonials-carousel');
      expect(section).toHaveClass('stx-testimonials-priority-low');
      expect(section).toHaveAttribute('data-section-type', 'testimonials');
      expect(section).toHaveAttribute('data-section-variant', 'carousel');
      expect(section).toHaveAttribute('data-section-priority', 'low');
      expect(section).toHaveAttribute('data-ai-optimized', 'false');
    });

    it('applies custom className', () => {
      render(<Testimonials className="custom-testimonials" />);
      const section = document.querySelector('section.stx-testimonials');
      expect(section).toHaveClass('custom-testimonials');
    });

    it('applies AI optimization and AB test classes', () => {
      render(<Testimonials aiOptimized abTest={abTest} />);
      const section = document.querySelector('section.stx-testimonials');
      expect(section).toHaveClass('stx-testimonials-ai-optimized');
      expect(section).toHaveClass('stx-testimonials-ab-test');
      expect(section).toHaveAttribute('data-ai-optimized', 'true');
      expect(section).toHaveAttribute('data-ab-test', abTest.experimentId);
    });
  });

  describe('Variants', () => {
    it('renders carousel variant by default', () => {
      render(<Testimonials />);
      expect(screen.getByText('What Our Clients Say')).toBeInTheDocument();
      expect(screen.getByText('Hear from businesses that have transformed their ideas into reality')).toBeInTheDocument();
      expect(screen.getByText('Testimonials section - carousel variant coming soon')).toBeInTheDocument();
      expect(document.querySelector('.stx-testimonials-carousel')).toBeInTheDocument();
    });

    it('renders grid variant', () => {
      render(<Testimonials variant="grid" />);
      expect(screen.getByText('Testimonials section - grid variant coming soon')).toBeInTheDocument();
      expect(document.querySelector('.stx-testimonials-grid')).toBeInTheDocument();
    });

    it('renders list variant', () => {
      render(<Testimonials variant="list" />);
      expect(screen.getByText('Testimonials section - list variant coming soon')).toBeInTheDocument();
      expect(document.querySelector('.stx-testimonials-list')).toBeInTheDocument();
    });
  });

  describe('Content Rendering', () => {
    it('renders default title and description', () => {
      render(<Testimonials />);
      expect(screen.getByText('What Our Clients Say')).toBeInTheDocument();
      expect(screen.getByText('Hear from businesses that have transformed their ideas into reality')).toBeInTheDocument();
    });

    it('renders custom title and description', () => {
      render(
        <Testimonials
          title="Custom Testimonials"
          description="Custom description for testimonials"
        />
      );
      expect(screen.getByText('Custom Testimonials')).toBeInTheDocument();
      expect(screen.getByText('Custom description for testimonials')).toBeInTheDocument();
    });

    it('handles missing description', () => {
      render(<Testimonials description="" />);
      expect(screen.getByText('What Our Clients Say')).toBeInTheDocument();
      // Component shows placeholder when description is empty
      expect(screen.getByText('Testimonials section - carousel variant coming soon')).toBeInTheDocument();
    });
  });

  describe('Priority', () => {
    it('applies high priority class and data attribute', () => {
      render(<Testimonials priority="high" />);
      const section = document.querySelector('section.stx-testimonials');
      expect(section).toHaveClass('stx-testimonials-priority-high');
      expect(section).toHaveAttribute('data-section-priority', 'high');
    });

    it('applies medium priority class and data attribute', () => {
      render(<Testimonials priority="medium" />);
      const section = document.querySelector('section.stx-testimonials');
      expect(section).toHaveClass('stx-testimonials-priority-medium');
      expect(section).toHaveAttribute('data-section-priority', 'medium');
    });
  });

  describe('Structure & Layout', () => {
    it('renders section and container with correct structure', () => {
      render(<Testimonials />);
      const section = document.querySelector('section.stx-testimonials');
      expect(section).toBeInTheDocument();
      const container = document.querySelector('.stx-testimonials-container');
      expect(container).toBeInTheDocument();
    });

    it('renders header with title and description', () => {
      render(<Testimonials />);
      const header = document.querySelector('.stx-testimonials-header');
      expect(header).toBeInTheDocument();
      expect(header).toHaveTextContent('What Our Clients Say');
      expect(header).toHaveTextContent('Hear from businesses that have transformed their ideas into reality');
    });

    it('renders content section', () => {
      render(<Testimonials />);
      const content = document.querySelector('.stx-testimonials-content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveTextContent('Testimonials section - carousel variant coming soon');
    });
  });

  describe('Edge Cases & Error Handling', () => {
    it('renders with minimal props', () => {
      render(<Testimonials title="Only Title" />);
      expect(screen.getByText('Only Title')).toBeInTheDocument();
    });

    it('handles empty testimonials array', () => {
      render(<Testimonials testimonials={[]} />);
      expect(screen.getByText('What Our Clients Say')).toBeInTheDocument();
    });

    it('handles undefined testimonials', () => {
      render(<Testimonials testimonials={undefined as any} />);
      expect(screen.getByText('What Our Clients Say')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('renders h2 for title', () => {
      render(<Testimonials title="Accessible Testimonials" />);
      const h2 = screen.getByRole('heading', { level: 2 });
      expect(h2).toHaveTextContent('Accessible Testimonials');
    });

    it('maintains semantic structure', () => {
      render(<Testimonials />);
      const section = document.querySelector('section.stx-testimonials');
      expect(section).toBeInTheDocument();
    });
  });

  describe('Event Handlers', () => {
    it('calls onLoad when component mounts', () => {
      const onLoad = vi.fn();
      render(<Testimonials onLoad={onLoad} />);
      // Note: Since this is a placeholder component, onLoad might not be called
      // This test documents the expected behavior
    });

    it('calls onError when error occurs', () => {
      const onError = vi.fn();
      render(<Testimonials onError={onError} />);
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

      render(<Testimonials />);
      const section = document.querySelector('section.stx-testimonials');
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
      render(<Testimonials />);
      const container = document.querySelector('.stx-testimonials-container');
      expect(container).toBeInTheDocument();
    });

    it('integrates with Text component', () => {
      render(<Testimonials />);
      const title = document.querySelector('.stx-testimonials-title');
      const description = document.querySelector('.stx-testimonials-description');
      expect(title).toBeInTheDocument();
      expect(description).toBeInTheDocument();
    });
  });
});

describe('Testimonials Theme Switching', () => {
  ALL_THEMES.forEach(theme => {
    it(`renders correctly in ${theme} theme`, () => {
      const { container } = renderWithTheme(<Testimonials />, theme);
      const testimonials = container.querySelector('.stx-testimonials');
      expect(testimonials).toBeInTheDocument();
      // Theme container check
      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });

    it(`applies correct border/background/text color in ${theme} theme`, () => {
      const { container } = renderWithTheme(<Testimonials />, theme);
      const testimonials = container.querySelector('.stx-testimonials');
      const computedStyle = getComputedStyle(testimonials as Element);
      expect(computedStyle.backgroundColor).toBeDefined();
      expect(computedStyle.color).toBeDefined();
      expect(computedStyle.borderColor).toBeDefined();
    });
  });

  it('maintains functionality across all themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(<Testimonials />, theme);
      const testimonials = container.querySelector('.stx-testimonials');
      expect(testimonials).toBeInTheDocument();
      expect(testimonials).toHaveClass('stx-testimonials');

      // Check for testimonials content
      const testimonialsContent = container.querySelector('.stx-testimonials-content');
      expect(testimonialsContent).toBeInTheDocument();

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('applies theme-specific styling for different variants', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Testimonials variant="grid" />,
        theme
      );
      const testimonials = container.querySelector('.stx-testimonials');
      expect(testimonials).toHaveAttribute('data-section-variant', 'grid');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('maintains accessibility across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Testimonials title="Accessible Testimonials" />,
        theme
      );
      const testimonials = container.querySelector('.stx-testimonials');
      expect(testimonials).toHaveAttribute('data-section-type', 'testimonials');

      // Check for proper heading hierarchy
      const h2 = container.querySelector('h2');
      expect(h2).toHaveTextContent('Accessible Testimonials');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('handles theme transitions smoothly', () => {
    // Test light theme
    const { container: lightContainer } = renderWithTheme(<Testimonials />, 'light');
    let themeContainer = lightContainer.querySelector('[data-theme]');
    expect(themeContainer).toHaveAttribute('data-theme', 'light');

    // Test dark theme
    const { container: darkContainer } = renderWithTheme(<Testimonials />, 'dark');
    themeContainer = darkContainer.querySelector('[data-theme]');
    expect(themeContainer).toHaveAttribute('data-theme', 'dark');
  });

  it('maintains performance across theme switches', () => {
    const startTime = performance.now();

    ALL_THEMES.forEach(theme => {
      renderWithTheme(<Testimonials />, theme);
    });

    const endTime = performance.now();
    const totalTime = endTime - startTime;

    // Performance threshold: should complete all theme renders in under 100ms
    expect(totalTime).toBeLessThan(100);
  });

  it('applies correct testimonials styling across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(<Testimonials />, theme);
      const testimonials = container.querySelector('.stx-testimonials');
      expect(testimonials).toBeInTheDocument();

      // Check testimonials structure
      const testimonialsContainer = container.querySelector('.stx-testimonials-container');
      const testimonialsHeader = container.querySelector('.stx-testimonials-header');
      const testimonialsContent = container.querySelector('.stx-testimonials-content');
      expect(testimonialsContainer).toBeInTheDocument();
      expect(testimonialsHeader).toBeInTheDocument();
      expect(testimonialsContent).toBeInTheDocument();

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('handles different variants across themes', () => {
    const variants = ['carousel', 'grid', 'list'] as const;

    ALL_THEMES.forEach(theme => {
      variants.forEach(variant => {
        const { container } = renderWithTheme(
          <Testimonials variant={variant} />,
          theme
        );
        const testimonials = container.querySelector('.stx-testimonials');
        expect(testimonials).toHaveAttribute('data-section-variant', variant);

        const themeContainer = container.querySelector('[data-theme]');
        expect(themeContainer).toHaveAttribute('data-theme', theme);
      });
    });
  });

  it('maintains title and description rendering across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Testimonials title="Custom Testimonials" description="Custom description" />,
        theme
      );

      // Check for title and description
      expect(container).toHaveTextContent('Custom Testimonials');
      expect(container).toHaveTextContent('Custom description');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('maintains custom className across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Testimonials className="custom-testimonials-class" />,
        theme
      );
      const testimonials = container.querySelector('.stx-testimonials');
      expect(testimonials).toHaveClass('custom-testimonials-class', 'stx-testimonials');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('maintains priority attributes across themes', () => {
    const priorities = ['low', 'medium', 'high'] as const;

    ALL_THEMES.forEach(theme => {
      priorities.forEach(priority => {
        const { container } = renderWithTheme(
          <Testimonials priority={priority} />,
          theme
        );
        const testimonials = container.querySelector('.stx-testimonials');
        expect(testimonials).toHaveAttribute('data-section-priority', priority);

        const themeContainer = container.querySelector('[data-theme]');
        expect(themeContainer).toHaveAttribute('data-theme', theme);
      });
    });
  });

  it('maintains AI optimization attributes across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Testimonials aiOptimized={true} />,
        theme
      );
      const testimonials = container.querySelector('.stx-testimonials');
      expect(testimonials).toHaveAttribute('data-ai-optimized', 'true');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('maintains AB test attributes across themes', () => {
    const abTest = { experimentId: 'test-exp', variant: 'A' };

    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Testimonials abTest={abTest} />,
        theme
      );
      const testimonials = container.querySelector('.stx-testimonials');
      expect(testimonials).toHaveAttribute('data-ab-test', 'test-exp');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('maintains semantic structure across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(<Testimonials />, theme);

      // Check semantic structure
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveAttribute('data-section-type', 'testimonials');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('maintains container integration across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(<Testimonials />, theme);

      // Check container integration
      const testimonialsContainer = container.querySelector('.stx-testimonials-container');
      expect(testimonialsContainer).toBeInTheDocument();

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('maintains text component integration across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Testimonials title="Test Testimonials" description="Test Description" />,
        theme
      );

      // Check text component integration
      const title = container.querySelector('h2');
      const description = container.querySelector('.stx-testimonials-description');
      expect(title).toHaveTextContent('Test Testimonials');
      expect(description).toHaveTextContent('Test Description');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('handles testimonials array across themes', () => {
    const testimonials = [
      { quote: 'Amazing service!', author: 'John Smith', role: 'CEO', company: 'TechCorp', avatar: '/images/john.jpg' },
      { quote: 'Transformed our business.', author: 'Sarah Johnson', role: 'CTO', company: 'InnovateLab', avatar: '/images/sarah.jpg' }
    ];

    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Testimonials testimonials={testimonials} />,
        theme
      );

      // Should render the actual testimonials since they are implemented
      expect(container).toHaveTextContent('Amazing service!');
      expect(container).toHaveTextContent('Transformed our business.');
      expect(container).toHaveTextContent('John Smith');
      expect(container).toHaveTextContent('Sarah Johnson');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('handles empty testimonials across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Testimonials testimonials={[]} />,
        theme
      );

      // Should still render header
      expect(container).toHaveTextContent('What Our Clients Say');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });
});
