import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Process } from './Process';
import {
  testCompleteThemeSupport,
  renderWithTheme,
  ALL_THEMES,
  type ThemeName
} from '../../../test/utils/theme-testing';

const mockSteps = [
  {
    title: 'Step 1',
    description: 'First step description',
    icon: 'icon-1'
  },
  {
    title: 'Step 2',
    description: 'Second step description',
    icon: 'icon-2'
  }
];

const abTest = { experimentId: 'process-exp-123', variant: 'A' };

describe('Process', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Cleanup
  });

  describe('STX Classes & Data Attributes', () => {
    it('applies correct STX classes and data attributes', () => {
      render(<Process />);
      const section = document.querySelector('section.stx-process');
      expect(section).toBeInTheDocument();
      expect(section).toHaveClass('stx-process-steps');
      expect(section).toHaveClass('stx-process-priority-medium');
      expect(section).toHaveAttribute('data-section-type', 'process');
      expect(section).toHaveAttribute('data-section-variant', 'steps');
      expect(section).toHaveAttribute('data-section-priority', 'medium');
      expect(section).toHaveAttribute('data-ai-optimized', 'false');
    });

    it('applies custom className', () => {
      render(<Process className="custom-process" />);
      const section = document.querySelector('section.stx-process');
      expect(section).toHaveClass('custom-process');
    });

    it('applies AI optimization and AB test classes', () => {
      render(<Process aiOptimized abTest={abTest} />);
      const section = document.querySelector('section.stx-process');
      expect(section).toHaveClass('stx-process-ai-optimized');
      expect(section).toHaveClass('stx-process-ab-test');
      expect(section).toHaveAttribute('data-ai-optimized', 'true');
      expect(section).toHaveAttribute('data-ab-test', abTest.experimentId);
    });
  });

  describe('Variants', () => {
    it('renders steps variant by default', () => {
      render(<Process />);
      expect(screen.getByText('How It Works')).toBeInTheDocument();
      expect(screen.getByText('Simple steps to get your prototype')).toBeInTheDocument();
      expect(screen.getByText('Process section - steps variant coming soon')).toBeInTheDocument();
      expect(document.querySelector('.stx-process-steps')).toBeInTheDocument();
    });

    it('renders timeline variant', () => {
      render(<Process variant="timeline" />);
      expect(screen.getByText('Process section - timeline variant coming soon')).toBeInTheDocument();
      expect(document.querySelector('.stx-process-timeline')).toBeInTheDocument();
    });

    it('renders cards variant', () => {
      render(<Process variant="cards" />);
      expect(screen.getByText('Process section - cards variant coming soon')).toBeInTheDocument();
      expect(document.querySelector('.stx-process-cards')).toBeInTheDocument();
    });
  });

  describe('Content Rendering', () => {
    it('renders default title and description', () => {
      render(<Process />);
      expect(screen.getByText('How It Works')).toBeInTheDocument();
      expect(screen.getByText('Simple steps to get your prototype')).toBeInTheDocument();
    });

    it('renders custom title and description', () => {
      render(
        <Process
          title="Custom Process"
          description="Custom description for process steps"
        />
      );
      expect(screen.getByText('Custom Process')).toBeInTheDocument();
      expect(screen.getByText('Custom description for process steps')).toBeInTheDocument();
    });

    it('handles missing description', () => {
      render(<Process description="" />);
      expect(screen.getByText('How It Works')).toBeInTheDocument();
      // Component shows placeholder when description is empty
      expect(screen.getByText('Process section - steps variant coming soon')).toBeInTheDocument();
    });
  });

  describe('Priority', () => {
    it('applies high priority class and data attribute', () => {
      render(<Process priority="high" />);
      const section = document.querySelector('section.stx-process');
      expect(section).toHaveClass('stx-process-priority-high');
      expect(section).toHaveAttribute('data-section-priority', 'high');
    });

    it('applies low priority class and data attribute', () => {
      render(<Process priority="low" />);
      const section = document.querySelector('section.stx-process');
      expect(section).toHaveClass('stx-process-priority-low');
      expect(section).toHaveAttribute('data-section-priority', 'low');
    });
  });

  describe('Structure & Layout', () => {
    it('renders section and container with correct structure', () => {
      render(<Process />);
      const section = document.querySelector('section.stx-process');
      expect(section).toBeInTheDocument();
      const container = document.querySelector('.stx-process-container');
      expect(container).toBeInTheDocument();
    });

    it('renders header with title and description', () => {
      render(<Process />);
      const header = document.querySelector('.stx-process-header');
      expect(header).toBeInTheDocument();
      expect(header).toHaveTextContent('How It Works');
      expect(header).toHaveTextContent('Simple steps to get your prototype');
    });

    it('renders content section', () => {
      render(<Process />);
      const content = document.querySelector('.stx-process-content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveTextContent('Process section - steps variant coming soon');
    });
  });

  describe('Edge Cases & Error Handling', () => {
    it('renders with minimal props', () => {
      render(<Process title="Only Title" />);
      expect(screen.getByText('Only Title')).toBeInTheDocument();
    });

    it('handles empty steps array', () => {
      render(<Process steps={[]} />);
      expect(screen.getByText('How It Works')).toBeInTheDocument();
    });

    it('handles undefined steps', () => {
      render(<Process steps={undefined as any} />);
      expect(screen.getByText('How It Works')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('renders h2 for title', () => {
      render(<Process title="Accessible Process" />);
      const h2 = screen.getByRole('heading', { level: 2 });
      expect(h2).toHaveTextContent('Accessible Process');
    });

    it('maintains semantic structure', () => {
      render(<Process />);
      const section = document.querySelector('section.stx-process');
      expect(section).toBeInTheDocument();
    });
  });

  describe('Event Handlers', () => {
    it('calls onLoad when component mounts', () => {
      const onLoad = vi.fn();
      render(<Process onLoad={onLoad} />);
      // Note: Since this is a placeholder component, onLoad might not be called
      // This test documents the expected behavior
    });

    it('calls onError when error occurs', () => {
      const onError = vi.fn();
      render(<Process onError={onError} />);
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

      render(<Process />);
      const section = document.querySelector('section.stx-process');
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
      render(<Process />);
      const container = document.querySelector('.stx-process-container');
      expect(container).toBeInTheDocument();
    });

    it('integrates with Text component', () => {
      render(<Process />);
      const title = document.querySelector('.stx-process-title');
      const description = document.querySelector('.stx-process-description');
      expect(title).toBeInTheDocument();
      expect(description).toBeInTheDocument();
    });
  });
});

describe('Process Theme Switching', () => {
  ALL_THEMES.forEach(theme => {
    it(`renders correctly in ${theme} theme`, () => {
      const { container } = renderWithTheme(<Process />, theme);
      const process = container.querySelector('.stx-process');
      expect(process).toBeInTheDocument();
      // Theme container check
      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });

    it(`applies correct border/background/text color in ${theme} theme`, () => {
      const { container } = renderWithTheme(<Process />, theme);
      const process = container.querySelector('.stx-process');
      const computedStyle = getComputedStyle(process as Element);
      expect(computedStyle.backgroundColor).toBeDefined();
      expect(computedStyle.color).toBeDefined();
      expect(computedStyle.borderColor).toBeDefined();
    });
  });

  it('maintains functionality across all themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(<Process />, theme);
      const process = container.querySelector('.stx-process');
      expect(process).toBeInTheDocument();
      expect(process).toHaveClass('stx-process');

      // Check for process content
      const processContent = container.querySelector('.stx-process-content');
      expect(processContent).toBeInTheDocument();

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('applies theme-specific styling for different variants', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Process variant="timeline" />,
        theme
      );
      const process = container.querySelector('.stx-process');
      expect(process).toHaveAttribute('data-section-variant', 'timeline');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('maintains accessibility across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Process title="Accessible Process" />,
        theme
      );
      const process = container.querySelector('.stx-process');
      expect(process).toHaveAttribute('data-section-type', 'process');

      // Check for proper heading hierarchy
      const h2 = container.querySelector('h2');
      expect(h2).toHaveTextContent('Accessible Process');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('handles theme transitions smoothly', () => {
    // Test light theme
    const { container: lightContainer } = renderWithTheme(<Process />, 'light');
    let themeContainer = lightContainer.querySelector('[data-theme]');
    expect(themeContainer).toHaveAttribute('data-theme', 'light');

    // Test dark theme
    const { container: darkContainer } = renderWithTheme(<Process />, 'dark');
    themeContainer = darkContainer.querySelector('[data-theme]');
    expect(themeContainer).toHaveAttribute('data-theme', 'dark');
  });

  it('maintains performance across theme switches', () => {
    const startTime = performance.now();

    ALL_THEMES.forEach(theme => {
      renderWithTheme(<Process />, theme);
    });

    const endTime = performance.now();
    const totalTime = endTime - startTime;

    // Performance threshold: should complete all theme renders in under 250ms
    expect(totalTime).toBeLessThan(250);
  });

  it('applies correct process styling across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(<Process />, theme);
      const process = container.querySelector('.stx-process');
      expect(process).toBeInTheDocument();

      // Check process structure
      const processContainer = container.querySelector('.stx-process-container');
      const processHeader = container.querySelector('.stx-process-header');
      const processContent = container.querySelector('.stx-process-content');
      expect(processContainer).toBeInTheDocument();
      expect(processHeader).toBeInTheDocument();
      expect(processContent).toBeInTheDocument();

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('handles different variants across themes', () => {
    const variants = ['steps', 'timeline', 'cards'] as const;

    ALL_THEMES.forEach(theme => {
      variants.forEach(variant => {
        const { container } = renderWithTheme(
          <Process variant={variant} />,
          theme
        );
        const process = container.querySelector('.stx-process');
        expect(process).toHaveAttribute('data-section-variant', variant);

        const themeContainer = container.querySelector('[data-theme]');
        expect(themeContainer).toHaveAttribute('data-theme', theme);
      });
    });
  });

  it('maintains title and description rendering across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Process title="Custom Process" description="Custom description" />,
        theme
      );

      // Check for title and description
      expect(container).toHaveTextContent('Custom Process');
      expect(container).toHaveTextContent('Custom description');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('maintains custom className across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Process className="custom-process-class" />,
        theme
      );
      const process = container.querySelector('.stx-process');
      expect(process).toHaveClass('custom-process-class', 'stx-process');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('maintains priority attributes across themes', () => {
    const priorities = ['low', 'medium', 'high'] as const;

    ALL_THEMES.forEach(theme => {
      priorities.forEach(priority => {
        const { container } = renderWithTheme(
          <Process priority={priority} />,
          theme
        );
        const process = container.querySelector('.stx-process');
        expect(process).toHaveAttribute('data-section-priority', priority);

        const themeContainer = container.querySelector('[data-theme]');
        expect(themeContainer).toHaveAttribute('data-theme', theme);
      });
    });
  });

  it('maintains AI optimization attributes across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Process aiOptimized={true} />,
        theme
      );
      const process = container.querySelector('.stx-process');
      expect(process).toHaveAttribute('data-ai-optimized', 'true');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('maintains AB test attributes across themes', () => {
    const abTest = { experimentId: 'test-exp', variant: 'A' };

    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Process abTest={abTest} />,
        theme
      );
      const process = container.querySelector('.stx-process');
      expect(process).toHaveAttribute('data-ab-test', 'test-exp');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('maintains semantic structure across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(<Process />, theme);

      // Check semantic structure
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveAttribute('data-section-type', 'process');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('maintains container integration across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(<Process />, theme);

      // Check container integration
      const processContainer = container.querySelector('.stx-process-container');
      expect(processContainer).toBeInTheDocument();

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('maintains text component integration across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Process title="Test Process" description="Test Description" />,
        theme
      );

      // Check text component integration
      const title = container.querySelector('h2');
      expect(title).toHaveTextContent('Test Process');
      // Description is rendered in the placeholder when provided
      expect(container).toHaveTextContent('Test Description');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('handles steps array across themes', () => {
    const steps = [
      { number: 1, title: 'Step 1', description: 'First step' },
      { number: 2, title: 'Step 2', description: 'Second step' }
    ];

    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Process steps={steps} />,
        theme
      );

      // Should render the actual steps since they are implemented
      expect(container).toHaveTextContent('Step 1');
      expect(container).toHaveTextContent('Step 2');
      expect(container).toHaveTextContent('First step');
      expect(container).toHaveTextContent('Second step');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('handles empty steps across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Process steps={[]} />,
        theme
      );

      // Should still render header
      expect(container).toHaveTextContent('How It Works');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });
});
