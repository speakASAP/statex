import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { DynamicSection } from './DynamicSection';
import { SectionPriority } from '@/types/templates';
import { testCompleteThemeSupport, renderWithTheme, ALL_THEMES, ThemeName } from '../../test/utils/theme-testing';

// Mock components for testing
const MockComponent = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div data-testid="mock-component">
    <h1>{title}</h1>
    {subtitle && <p>{subtitle}</p>}
  </div>
);

const AsyncMockComponent = ({ title }: { title: string }) => {
  return new Promise<JSX.Element>((resolve) => {
    setTimeout(() => {
      resolve(
        <div data-testid="async-mock-component">
          <h1>{title}</h1>
        </div>
      );
    }, 100);
  });
};

const ErrorMockComponent = () => {
  throw new Error('Component error');
};

describe('DynamicSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Cleanup
  });

  describe('STX Classes', () => {
    it('applies correct STX classes to section container', () => {
      render(
        <DynamicSection
          component={MockComponent}
          config={{ title: 'Test Section' }}
          priority="medium"
          aiOptimized={false}
        />
      );

      const sectionContainer = document.querySelector('.stx-section');
      expect(sectionContainer).toBeInTheDocument();
    });

    it('applies priority-based classes correctly', () => {
      render(
        <DynamicSection
          component={MockComponent}
          config={{ title: 'High Priority Section' }}
          priority="high"
          aiOptimized={false}
        />
      );

      const sectionContainer = document.querySelector('.stx-section');
      expect(sectionContainer).toHaveClass('stx-section--high');
    });

    it('applies AI optimization classes when enabled', () => {
      render(
        <DynamicSection
          component={MockComponent}
          config={{ title: 'AI Optimized Section' }}
          priority="medium"
          aiOptimized={true}
        />
      );

      const sectionContainer = document.querySelector('.stx-section');
      expect(sectionContainer).toHaveClass('stx-section--ai-optimized');
    });

    it('applies BEM-style classes to section elements', () => {
      render(
        <DynamicSection
          component={MockComponent}
          config={{ title: 'BEM Section' }}
          priority="low"
          aiOptimized={false}
        />
      );

      const sectionContainer = document.querySelector('.stx-section');
      expect(sectionContainer).toHaveClass('stx-section');
    });

    it('combines multiple STX classes correctly', () => {
      render(
        <DynamicSection
          component={MockComponent}
          config={{ title: 'Combined Classes Section' }}
          priority="high"
          aiOptimized={true}
        />
      );

      const sectionContainer = document.querySelector('.stx-section');
      expect(sectionContainer).toHaveClass('stx-section');
      expect(sectionContainer).toHaveClass('stx-section--high');
      expect(sectionContainer).toHaveClass('stx-section--ai-optimized');
    });
  });

  describe('Template Section Functionality', () => {
    it('renders component with config props', () => {
      render(
        <DynamicSection
          component={MockComponent}
          config={{ title: 'Test Title', subtitle: 'Test Subtitle' }}
          priority="medium"
          aiOptimized={false}
        />
      );

      expect(screen.getByTestId('mock-component')).toBeInTheDocument();
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    });

    it('renders component with minimal config', () => {
      render(
        <DynamicSection
          component={MockComponent}
          config={{ title: 'Minimal Config' }}
          priority="low"
          aiOptimized={false}
        />
      );

      expect(screen.getByTestId('mock-component')).toBeInTheDocument();
      expect(screen.getByText('Minimal Config')).toBeInTheDocument();
    });

    it('renders component with empty config', () => {
      const EmptyConfigComponent = () => <div data-testid="empty-config">Empty Config</div>;

      render(
        <DynamicSection
          component={EmptyConfigComponent}
          config={{}}
          priority="medium"
          aiOptimized={false}
        />
      );

      expect(screen.getByTestId('empty-config')).toBeInTheDocument();
    });

    it('renders component with complex config object', () => {
      const ComplexComponent = ({ data }: { data: any }) => (
        <div data-testid="complex-component">
          <span>{data.name}</span>
          <span>{data.age}</span>
          <span>{data.city}</span>
        </div>
      );

      const complexConfig = {
        data: {
          name: 'John Doe',
          age: 30,
          city: 'New York',
        },
      };

      render(
        <DynamicSection
          component={ComplexComponent}
          config={complexConfig}
          priority="high"
          aiOptimized={true}
        />
      );

      expect(screen.getByTestId('complex-component')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('30')).toBeInTheDocument();
      expect(screen.getByText('New York')).toBeInTheDocument();
    });
  });

  describe('Priority Handling', () => {
    it('handles high priority sections', () => {
      render(
        <DynamicSection
          component={MockComponent}
          config={{ title: 'High Priority' }}
          priority="high"
          aiOptimized={false}
        />
      );

      const sectionContainer = document.querySelector('.stx-section');
      expect(sectionContainer).toHaveAttribute('data-priority', 'high');
      expect(sectionContainer).toHaveClass('stx-section--high');
    });

    it('handles medium priority sections', () => {
      render(
        <DynamicSection
          component={MockComponent}
          config={{ title: 'Medium Priority' }}
          priority="medium"
          aiOptimized={false}
        />
      );

      const sectionContainer = document.querySelector('.stx-section');
      expect(sectionContainer).toHaveAttribute('data-priority', 'medium');
      expect(sectionContainer).toHaveClass('stx-section--medium');
    });

    it('handles low priority sections', () => {
      render(
        <DynamicSection
          component={MockComponent}
          config={{ title: 'Low Priority' }}
          priority="low"
          aiOptimized={false}
        />
      );

      const sectionContainer = document.querySelector('.stx-section');
      expect(sectionContainer).toHaveAttribute('data-priority', 'low');
      expect(sectionContainer).toHaveClass('stx-section--low');
    });
  });

  describe('AI Optimization', () => {
    it('applies AI optimization attributes when enabled', () => {
      render(
        <DynamicSection
          component={MockComponent}
          config={{ title: 'AI Optimized' }}
          priority="medium"
          aiOptimized={true}
        />
      );

      const sectionContainer = document.querySelector('.stx-section');
      expect(sectionContainer).toHaveAttribute('data-ai-optimized', 'true');
      expect(sectionContainer).toHaveClass('stx-section--ai-optimized');
    });

    it('applies AI optimization attributes when disabled', () => {
      render(
        <DynamicSection
          component={MockComponent}
          config={{ title: 'Not AI Optimized' }}
          priority="medium"
          aiOptimized={false}
        />
      );

      const sectionContainer = document.querySelector('.stx-section');
      expect(sectionContainer).toHaveAttribute('data-ai-optimized', 'false');
      expect(sectionContainer).not.toHaveClass('stx-section--ai-optimized');
    });
  });

  describe('Suspense & Loading', () => {
    it('shows loading fallback for async components', async () => {
      const AsyncComponent = React.lazy(() =>
        new Promise<{ default: React.ComponentType }>((resolve) => {
          setTimeout(() => {
            resolve({
              default: () => <div data-testid="async-loaded">Async Content</div>
            });
          }, 50);
        })
      );

      render(
        <DynamicSection
          component={AsyncComponent}
          config={{ title: 'Async Section' }}
          priority="medium"
          aiOptimized={false}
        />
      );

      // Should show loading fallback initially
      expect(screen.getByText('Loading...')).toBeInTheDocument();

      // Wait for async content to load
      await waitFor(() => {
        expect(screen.getByTestId('async-loaded')).toBeInTheDocument();
      }, { timeout: 200 });
    });

    it('applies loading class to fallback', async () => {
      const AsyncComponent = React.lazy(() =>
        new Promise<{ default: React.ComponentType }>((resolve) => {
          setTimeout(() => {
            resolve({
              default: () => <div data-testid="async-loaded">Async Content</div>
            });
          }, 100);
        })
      );

      render(
        <DynamicSection
          component={AsyncComponent}
          config={{ title: 'Loading Test' }}
          priority="medium"
          aiOptimized={false}
        />
      );

      const loadingFallback = document.querySelector('.stx-section__loading');
      expect(loadingFallback).toBeInTheDocument();
    });

    it('handles component loading states correctly', () => {
      render(
        <DynamicSection
          component={MockComponent}
          config={{ title: 'Loading States' }}
          priority="high"
          aiOptimized={true}
        />
      );

      // Should render immediately for sync components
      expect(screen.getByTestId('mock-component')).toBeInTheDocument();
      expect(screen.getByText('Loading States')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles component errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(
          <DynamicSection
            component={ErrorMockComponent}
            config={{}}
            priority="medium"
            aiOptimized={false}
          />
        );
      }).toThrow('Component error');

      consoleSpy.mockRestore();
    });

    it('handles invalid config gracefully', () => {
      const ConfigComponent = ({ invalidProp }: { invalidProp?: any }) => (
        <div data-testid="config-component">
          {invalidProp ? 'Has Invalid Prop' : 'No Invalid Prop'}
        </div>
      );

      render(
        <DynamicSection
          component={ConfigComponent}
          config={{ invalidProp: undefined }}
          priority="medium"
          aiOptimized={false}
        />
      );

      expect(screen.getByTestId('config-component')).toBeInTheDocument();
      expect(screen.getByText('No Invalid Prop')).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('maintains responsive structure', () => {
      render(
        <DynamicSection
          component={MockComponent}
          config={{ title: 'Responsive Section' }}
          priority="medium"
          aiOptimized={false}
        />
      );

      const sectionContainer = document.querySelector('.stx-section');
      expect(sectionContainer).toBeInTheDocument();

      // Check that the section maintains proper semantic structure
      expect(sectionContainer?.tagName).toBe('SECTION');
    });

    it('adapts to different viewport sizes', () => {
      // Set mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(
        <DynamicSection
          component={MockComponent}
          config={{ title: 'Mobile Section' }}
          priority="medium"
          aiOptimized={false}
        />
      );

      const sectionContainer = document.querySelector('.stx-section');
      expect(sectionContainer).toBeInTheDocument();

      // Reset viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
    });
  });

  describe('Accessibility', () => {
    it('maintains proper semantic structure', () => {
      render(
        <DynamicSection
          component={MockComponent}
          config={{ title: 'Accessible Section' }}
          priority="medium"
          aiOptimized={false}
        />
      );

      const sectionContainer = document.querySelector('.stx-section');
      expect(sectionContainer?.tagName).toBe('SECTION');
    });

    it('provides priority information for screen readers', () => {
      render(
        <DynamicSection
          component={MockComponent}
          config={{ title: 'Screen Reader Section' }}
          priority="high"
          aiOptimized={true}
        />
      );

      const sectionContainer = document.querySelector('.stx-section');
      expect(sectionContainer).toHaveAttribute('data-priority', 'high');
      expect(sectionContainer).toHaveAttribute('data-ai-optimized', 'true');
    });

    it('ensures loading state is accessible', async () => {
      const AsyncComponent = React.lazy(() =>
        new Promise<{ default: React.ComponentType }>((resolve) => {
          setTimeout(() => {
            resolve({
              default: () => <div data-testid="async-loaded">Async Content</div>
            });
          }, 100);
        })
      );

      render(
        <DynamicSection
          component={AsyncComponent}
          config={{ title: 'Accessible Loading' }}
          priority="medium"
          aiOptimized={false}
        />
      );

      const loadingFallback = document.querySelector('.stx-section__loading');
      expect(loadingFallback).toHaveTextContent('Loading...');
    });
  });

  describe('Performance & Optimization', () => {
    it('renders efficiently with minimal overhead', () => {
      const startTime = performance.now();

      render(
        <DynamicSection
          component={MockComponent}
          config={{ title: 'Performance Test' }}
          priority="medium"
          aiOptimized={false}
        />
      );

      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(100); // Should render quickly
    });

    it('handles AI-optimized sections efficiently', () => {
      render(
        <DynamicSection
          component={MockComponent}
          config={{ title: 'AI Performance Test' }}
          priority="high"
          aiOptimized={true}
        />
      );

      const sectionContainer = document.querySelector('.stx-section');
      expect(sectionContainer).toHaveClass('stx-section--ai-optimized');
    });

    it('optimizes rendering for different priorities', () => {
      const priorities: SectionPriority[] = ['low', 'medium', 'high'];

      priorities.forEach(priority => {
        render(
          <DynamicSection
            component={MockComponent}
            config={{ title: `${priority} priority` }}
            priority={priority}
            aiOptimized={false}
          />
        );

        const sectionContainer = document.querySelector(`.stx-section--${priority}`);
        expect(sectionContainer).toBeInTheDocument();
      });
    });
  });

  describe('Integration Testing', () => {
    it('integrates with different component types', () => {
      const components = [
        MockComponent,
        () => <div data-testid="functional-component">Functional</div>,
        class ClassComponent extends React.Component {
          override render() {
            return <div data-testid="class-component">Class</div>;
          }
        },
      ];

      components.forEach((Component, index) => {
        // Clean up before each render
        document.body.innerHTML = '';

        render(
          <DynamicSection
            component={Component}
            config={{ title: `Component ${index}` }}
            priority="medium"
            aiOptimized={false}
          />
        );

        // Check for the specific component type
        if (index === 0) {
          expect(screen.getByTestId('mock-component')).toBeInTheDocument();
        } else if (index === 1) {
          expect(screen.getByTestId('functional-component')).toBeInTheDocument();
        } else if (index === 2) {
          expect(screen.getByTestId('class-component')).toBeInTheDocument();
        }
      });
    });

    it('handles complex integration scenarios', () => {
      const ComplexIntegrationComponent = ({
        title,
        items,
        callback
      }: {
        title: string;
        items: string[];
        callback: (item: string) => void;
      }) => (
        <div data-testid="complex-integration">
          <h1>{title}</h1>
          <ul>
            {items.map((item, index) => (
              <li key={index} onClick={() => callback(item)}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      );

      const mockCallback = vi.fn();
      const complexConfig = {
        title: 'Complex Integration',
        items: ['Item 1', 'Item 2', 'Item 3'],
        callback: mockCallback,
      };

      render(
        <DynamicSection
          component={ComplexIntegrationComponent}
          config={complexConfig}
          priority="high"
          aiOptimized={true}
        />
      );

      expect(screen.getByTestId('complex-integration')).toBeInTheDocument();
      expect(screen.getByText('Complex Integration')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });
  });

  // Enhanced theme support tests using the utility
  testCompleteThemeSupport(
    'DynamicSection',
    (theme: ThemeName) => (
      <DynamicSection
        component={MockComponent}
        config={{ title: 'Enhanced Theme Test' }}
        priority="medium"
        aiOptimized={false}
      />
    ),
    {
      testSelectors: {
        background: '.stx-section',
        text: '.stx-section',
        border: '.stx-section',
        action: '.stx-section'
      },
      testTransitions: true,
      testAccessibility: true,
      testPerformance: true,
      testEnhancedIntegration: true,
      testEnhancedPerformance: true
    }
  );
});
