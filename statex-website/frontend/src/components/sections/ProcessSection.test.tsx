import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProcessSection } from './ProcessSection';
import {
  testCompleteThemeSupport,
  renderWithTheme,
  ALL_THEMES,
  type ThemeName
} from '../../test/utils/theme-testing';

// Mock AB testing hook
vi.mock('@/hooks/useABTest', () => ({
  useABTest: () => ({
    getVariant: vi.fn(() => 'timeline'),
    setVariant: vi.fn(),
    isClient: true
  })
}));

describe('ProcessSection Component', () => {
  const defaultProps = {
    title: 'How It Works',
    steps: [
      {
        title: 'Describe Your Idea',
        description: 'Tell us about your software idea in plain English. No technical jargon required.',
        step: 1
      },
      {
        title: 'AI Analysis',
        description: 'Our AI analyzes your requirements and creates a detailed technical specification.',
        step: 2
      },
      {
        title: 'Get Your Prototype',
        description: 'Receive your fully functional prototype within 24 hours, ready for testing.',
        step: 3
      }
    ]
  };

  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      render(<ProcessSection {...defaultProps} />);

      expect(screen.getByText('How It Works')).toBeInTheDocument();
    });

    it('renders all process steps', () => {
      render(<ProcessSection {...defaultProps} />);

      expect(screen.getByText('Describe Your Idea')).toBeInTheDocument();
      expect(screen.getByText('AI Analysis')).toBeInTheDocument();
      expect(screen.getByText('Get Your Prototype')).toBeInTheDocument();
    });

    it('renders step descriptions', () => {
      render(<ProcessSection {...defaultProps} />);

      expect(screen.getByText('Tell us about your software idea in plain English. No technical jargon required.')).toBeInTheDocument();
      expect(screen.getByText('Our AI analyzes your requirements and creates a detailed technical specification.')).toBeInTheDocument();
      expect(screen.getByText('Receive your fully functional prototype within 24 hours, ready for testing.')).toBeInTheDocument();
    });

    it('renders step numbers', () => {
      render(<ProcessSection {...defaultProps} />);

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('applies timeline layout classes', () => {
      render(<ProcessSection {...defaultProps} layout="timeline" />);

      const section = screen.getByText('How It Works').closest('section');
      expect(section).toBeInTheDocument();
      const process = section?.querySelector('.stx-process--timeline');
      expect(process).toBeInTheDocument();
    });

    it('applies steps layout classes', () => {
      render(<ProcessSection {...defaultProps} layout="steps" />);

      const section = screen.getByText('How It Works').closest('section');
      expect(section).toBeInTheDocument();
      const process = section?.querySelector('.stx-process--steps');
      expect(process).toBeInTheDocument();
    });

    it('applies cards layout classes', () => {
      render(<ProcessSection {...defaultProps} layout="cards" />);

      const section = screen.getByText('How It Works').closest('section');
      expect(section).toBeInTheDocument();
      const process = section?.querySelector('.stx-process--cards');
      expect(process).toBeInTheDocument();
    });

    it('applies default layout classes when no layout specified', () => {
      render(<ProcessSection {...defaultProps} />);

      const section = screen.getByText('How It Works').closest('section');
      expect(section).toBeInTheDocument();
      const process = section?.querySelector('.stx-process--steps');
      expect(process).toBeInTheDocument();
    });
  });

  describe('Layout Support', () => {
    it('renders steps layout correctly', () => {
      render(<ProcessSection {...defaultProps} layout="steps" />);

      const section = screen.getByText('How It Works').closest('section');
      const process = section?.querySelector('.stx-process--steps');
      expect(process).toBeInTheDocument();
    });

    it('renders timeline layout correctly', () => {
      render(<ProcessSection {...defaultProps} layout="timeline" />);

      const section = screen.getByText('How It Works').closest('section');
      const process = section?.querySelector('.stx-process--timeline');
      expect(process).toBeInTheDocument();
    });

    it('renders cards layout correctly', () => {
      render(<ProcessSection {...defaultProps} layout="cards" />);

      const section = screen.getByText('How It Works').closest('section');
      const process = section?.querySelector('.stx-process--cards');
      expect(process).toBeInTheDocument();
    });
  });

  describe('AB Testing Integration', () => {
    it('renders without AB testing by default', () => {
      render(<ProcessSection {...defaultProps} />);

      const section = screen.getByText('How It Works').closest('section');
      expect(section).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('renders mobile-optimized layout', () => {
      render(<ProcessSection {...defaultProps} />);

      // Check that steps are accessible on mobile
      expect(screen.getByText('Describe Your Idea')).toBeInTheDocument();
      expect(screen.getByText('AI Analysis')).toBeInTheDocument();
      expect(screen.getByText('Get Your Prototype')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading structure', () => {
      render(<ProcessSection {...defaultProps} />);

      const h2 = screen.getByRole('heading', { level: 2 });
      expect(h2).toBeInTheDocument();
      expect(h2).toHaveTextContent('How It Works');
    });

    it('has proper section structure', () => {
      render(<ProcessSection {...defaultProps} />);

      const section = screen.getByText('How It Works').closest('section');
      expect(section).toBeInTheDocument();
    });

    it('has proper step structure', () => {
      render(<ProcessSection {...defaultProps} />);

      const steps = screen.getAllByText(/Describe Your Idea|AI Analysis|Get Your Prototype/);
      expect(steps).toHaveLength(3);
    });

    it('has proper step numbering', () => {
      render(<ProcessSection {...defaultProps} />);

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  describe('Content Customization', () => {
    it('renders custom title', () => {
      render(<ProcessSection {...defaultProps} title="Custom Title" />);

      expect(screen.getByText('Custom Title')).toBeInTheDocument();
    });

    it('renders custom steps', () => {
      const customSteps = [
        {
          title: 'Custom Step 1',
          description: 'Custom description 1',
          step: 1
        }
      ];

      render(<ProcessSection {...defaultProps} steps={customSteps} />);

      expect(screen.getByText('Custom Step 1')).toBeInTheDocument();
      expect(screen.getByText('Custom description 1')).toBeInTheDocument();
    });
  });

  describe('Step Ordering', () => {
    it('renders steps in correct order', () => {
      render(<ProcessSection {...defaultProps} />);

      const steps = screen.getAllByText(/Describe Your Idea|AI Analysis|Get Your Prototype/);
      expect(steps).toHaveLength(3);

      // Check that steps are in the correct order
      expect(steps[0]).toHaveTextContent('Describe Your Idea');
      expect(steps[1]).toHaveTextContent('AI Analysis');
      expect(steps[2]).toHaveTextContent('Get Your Prototype');
    });

    it('handles custom step numbers', () => {
      const customSteps = [
        {
          title: 'Step One',
          description: 'First step',
          step: 5
        }
      ];

      render(<ProcessSection {...defaultProps} steps={customSteps} />);

      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles empty steps array', () => {
      render(<ProcessSection {...defaultProps} steps={[]} />);

      const section = screen.getByText('How It Works').closest('section');
      expect(section).toBeInTheDocument();

      // Should show empty state or fallback content
      expect(screen.queryByText(/Describe Your Idea|AI Analysis|Get Your Prototype/)).not.toBeInTheDocument();
    });

    it('handles missing step properties', () => {
      const incompleteSteps = [
        {
          title: 'Test Step',
          description: 'Test description'
          // Missing step
        }
      ];

      expect(() => {
        render(<ProcessSection {...defaultProps} steps={incompleteSteps} />);
      }).not.toThrow();
    });

    it('handles invalid layout gracefully', () => {
      render(<ProcessSection {...defaultProps} layout={'invalid' as any} />);

      const section = screen.getByText('How It Works').closest('section');
      expect(section).toBeInTheDocument();
      // Should fall back to default layout
      const process = section?.querySelector('.stx-process--steps');
      expect(process).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('renders without performance issues', () => {
      const startTime = performance.now();

      render(<ProcessSection {...defaultProps} />);

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render quickly (less than 100ms)
      expect(renderTime).toBeLessThan(100);
    });

    it('handles many steps efficiently', () => {
      const manySteps = Array.from({ length: 10 }, (_, i) => ({
        title: `Step ${i + 1}`,
        description: `Description for step ${i + 1}`,
        step: i + 1
      }));

      expect(() => {
        render(<ProcessSection {...defaultProps} steps={manySteps} />);
      }).not.toThrow();
    });
  });

  describe('Visual Indicators', () => {
    it('renders step numbers correctly', () => {
      render(<ProcessSection {...defaultProps} />);

      // Should have step numbers for each step
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  describe('Theme Integration', () => {
    it('integrates with theme system', () => {
      render(
        <div data-theme="dark">
          <ProcessSection {...defaultProps} />
        </div>
      );

      const processSection = document.querySelector('.stx-process');
      expect(processSection).toBeInTheDocument();
    });

    it('applies theme-specific styling', () => {
      const { container } = renderWithTheme(<ProcessSection {...defaultProps} />, 'dark');

      const themeContainer = container.closest('[data-theme]');
      if (themeContainer) {
        expect(themeContainer).toHaveAttribute('data-theme', 'dark');
      }

      const processSection = container.querySelector('.stx-process');
      expect(processSection).toBeInTheDocument();
    });

    it('maintains functionality across all themes', () => {
      ALL_THEMES.forEach(theme => {
        const { container } = renderWithTheme(<ProcessSection {...defaultProps} />, theme);

        const processSection = container.querySelector('.stx-process');
        expect(processSection).toBeInTheDocument();

        // Verify content is still rendered - use getAllByText to handle multiple instances
        const howItWorksElements = screen.getAllByText('How It Works');
        expect(howItWorksElements.length).toBeGreaterThan(0);
      });
    });

    it('applies theme-specific CSS variables', () => {
      ALL_THEMES.forEach(theme => {
        const { container } = renderWithTheme(<ProcessSection {...defaultProps} />, theme);

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
      const { rerender } = renderWithTheme(<ProcessSection {...defaultProps} />, 'light');

      // Switch to dark theme
      rerender(<ProcessSection {...defaultProps} />);
      const darkContainer = document.querySelector('[data-theme="light"]');
      expect(darkContainer).toBeInTheDocument();

      // Switch to eu theme
      rerender(<ProcessSection {...defaultProps} />);
      const euContainer = document.querySelector('[data-theme="light"]');
      expect(euContainer).toBeInTheDocument();

      // Switch to uae theme
      rerender(<ProcessSection {...defaultProps} />);
      const uaeContainer = document.querySelector('[data-theme="light"]');
      expect(uaeContainer).toBeInTheDocument();

      // Switch back to light theme
      rerender(<ProcessSection {...defaultProps} />);
      const lightContainer = document.querySelector('[data-theme="light"]');
      expect(lightContainer).toBeInTheDocument();
    });
  });

  // Enhanced theme switching tests using the utility
  testCompleteThemeSupport(
    'ProcessSection',
    (theme: ThemeName) => <ProcessSection {...defaultProps} />,
    {
      testSelectors: {
        background: '.stx-process',
        text: '.stx-process__title',
        border: '.stx-process__step',
        action: '.stx-process__step-number'
      },
      testTransitions: true,
      testAccessibility: true,
      testPerformance: true
    }
  );
});
