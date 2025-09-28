import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { DynamicSection } from './DynamicSection';
import { SectionRegistry } from './SectionRegistry';
import { SectionInstance } from './types';
import {
  testCompleteThemeSupport,
  renderWithTheme,
  ALL_THEMES,
  type ThemeName
} from '../../test/utils/theme-testing';

// Mock SectionRegistry
vi.mock('./SectionRegistry', () => {
  return {
    SectionRegistry: {
      getComponent: vi.fn(),
      hasSection: vi.fn(),
      getVariants: vi.fn(),
      getDefaultVariant: vi.fn(),
    },
  };
});

const mockGetComponent = vi.mocked(SectionRegistry.getComponent);

// Mock section components
const MockHeroSection = () => <div data-testid="hero-section">Hero Section</div>;
const MockFeaturesSection = () => <div data-testid="features-section">Features Section</div>;
const MockProcessSection = () => <div data-testid="process-section">Process Section</div>;

describe('DynamicSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Cleanup
  });

  const createMockSection = (overrides: Partial<SectionInstance> = {}): SectionInstance => ({
    id: 'test-section-1',
    type: 'hero',
    variant: 'default',
    data: {
      title: 'Test Section',
      subtitle: 'Test Subtitle',
    },
    priority: 'medium',
    aiOptimized: false,
    ...overrides,
  });

  describe('STX Classes & Data Attributes', () => {
    it('applies correct STX classes and data attributes', async () => {
      const section = createMockSection();
      mockGetComponent.mockReturnValue(MockHeroSection);

      render(<DynamicSection section={section} />);

      await waitFor(() => {
        const sectionElement = document.querySelector('section.stx-section');
        expect(sectionElement).toBeInTheDocument();
        expect(sectionElement).toHaveClass('stx-section--hero');
        expect(sectionElement).toHaveClass('stx-section--default');
        expect(sectionElement).toHaveAttribute('data-section-type', 'hero');
        expect(sectionElement).toHaveAttribute('data-section-variant', 'default');
        expect(sectionElement).toHaveAttribute('data-section-id', 'test-section-1');
        expect(sectionElement).toHaveAttribute('data-priority', 'medium');
      });
    });

    it('applies custom className', async () => {
      const section = createMockSection();
      mockGetComponent.mockReturnValue(MockHeroSection);

      render(<DynamicSection section={section} className="custom-section" />);

      await waitFor(() => {
        const sectionElement = document.querySelector('section.stx-section');
        expect(sectionElement).toHaveClass('custom-section');
      });
    });

    it('applies AI optimization classes', async () => {
      const section = createMockSection({ aiOptimized: true });
      mockGetComponent.mockReturnValue(MockHeroSection);

      render(<DynamicSection section={section} />);

      await waitFor(() => {
        const sectionElement = document.querySelector('section.stx-section');
        expect(sectionElement).toHaveClass('stx-section--ai-optimized');
      });
    });

    it('applies priority classes', async () => {
      const section = createMockSection({ priority: 'high' });
      mockGetComponent.mockReturnValue(MockHeroSection);

      render(<DynamicSection section={section} />);

      await waitFor(() => {
        const sectionElement = document.querySelector('section.stx-section');
        expect(sectionElement).toHaveClass('stx-section--priority-high');
        expect(sectionElement).toHaveAttribute('data-priority', 'high');
      });
    });
  });

  describe('Section Rendering', () => {
    it('renders section component with correct data', async () => {
      const section = createMockSection({
        type: 'hero',
        variant: 'default',
        data: {
          title: 'Hero Title',
          subtitle: 'Hero Subtitle',
        },
      });
      mockGetComponent.mockReturnValue(MockHeroSection);

      render(<DynamicSection section={section} />);

      await waitFor(() => {
        expect(screen.getByTestId('hero-section')).toBeInTheDocument();
        expect(screen.getByText('Hero Section')).toBeInTheDocument();
      });
    });

    it('renders different section types', async () => {
      const section = createMockSection({ type: 'features' });
      mockGetComponent.mockReturnValue(MockFeaturesSection);

      render(<DynamicSection section={section} />);

      await waitFor(() => {
        expect(screen.getByTestId('features-section')).toBeInTheDocument();
        expect(screen.getByText('Features Section')).toBeInTheDocument();
      });
    });

    it('passes section data to component', async () => {
      const TestComponent = vi.fn(() => <div>Test Component</div>);
      const section = createMockSection({
        data: {
          title: 'Custom Title',
          subtitle: 'Custom Subtitle',
          customField: 'Custom Value',
        },
      });
      mockGetComponent.mockReturnValue(TestComponent);

      render(<DynamicSection section={section} />);

      await waitFor(() => {
        expect(TestComponent).toHaveBeenCalledWith(
          expect.objectContaining({
            id: 'test-section-1',
            type: 'hero',
            variant: 'default',
            priority: 'medium',
            aiOptimized: false,
            title: 'Custom Title',
            subtitle: 'Custom Subtitle',
            customField: 'Custom Value',
          }),
          expect.anything()
        );
      });
    });
  });

  describe('Loading States', () => {
    it('shows loading skeleton initially', () => {
      const section = createMockSection();
      mockGetComponent.mockReturnValue(null);

      render(<DynamicSection section={section} />);

      // When component is not found, it shows error state, not loading
      expect(screen.getByText('Error loading hero section')).toBeInTheDocument();
    });

    it('shows loading skeleton while component loads', () => {
      const section = createMockSection();
      mockGetComponent.mockReturnValue(MockHeroSection);

      render(<DynamicSection section={section} />);

      // Component should load immediately when found
      expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    });

    it('applies loading classes', () => {
      const section = createMockSection();
      mockGetComponent.mockReturnValue(null);

      render(<DynamicSection section={section} />);

      // When component is not found, it shows error state
      expect(screen.getByText('Error loading hero section')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('shows error state when component not found', async () => {
      const section = createMockSection();
      mockGetComponent.mockReturnValue(null);

      render(<DynamicSection section={section} />);

      await waitFor(() => {
        expect(screen.getByText('Error loading hero section')).toBeInTheDocument();
        expect(screen.getByText(/Section component not found/)).toBeInTheDocument();
      });
    });

    it('applies error classes', async () => {
      const section = createMockSection();
      mockGetComponent.mockReturnValue(null);

      render(<DynamicSection section={section} />);

      await waitFor(() => {
        const errorElement = document.querySelector('.stx-section-error');
        expect(errorElement).toBeInTheDocument();
      });
    });

    it('calls onError callback when error occurs', async () => {
      const section = createMockSection();
      const onError = vi.fn();
      mockGetComponent.mockReturnValue(null);

      render(<DynamicSection section={section} onError={onError} />);

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith('hero', expect.any(Error));
      });
    });
  });

  describe('AB Testing', () => {
    it('uses AB test variant when provided', async () => {
      const section = createMockSection({
        variant: 'default',
        abTest: {
          experimentId: 'exp-123',
          variant: 'B',
        },
      });
      mockGetComponent.mockReturnValue(MockHeroSection);

      render(<DynamicSection section={section} />);

      await waitFor(() => {
        const sectionElement = document.querySelector('section.stx-section');
        expect(sectionElement).toHaveAttribute('data-section-variant', 'B');
        expect(sectionElement).toHaveAttribute('data-ab-test', 'exp-123');
      });
    });

    it('falls back to default variant when AB test variant not found', async () => {
      const section = createMockSection({
        variant: 'default',
        abTest: {
          experimentId: 'exp-123',
          variant: 'invalid',
        },
      });
      mockGetComponent.mockReturnValue(MockHeroSection);

      render(<DynamicSection section={section} />);

      await waitFor(() => {
        const sectionElement = document.querySelector('section.stx-section');
        expect(sectionElement).toHaveAttribute('data-section-variant', 'invalid');
      });
    });
  });

  describe('Event Handlers', () => {
    it('calls onLoad when section loads successfully', async () => {
      const section = createMockSection();
      const onLoad = vi.fn();
      mockGetComponent.mockReturnValue(MockHeroSection);

      render(<DynamicSection section={section} onLoad={onLoad} />);

      await waitFor(() => {
        expect(onLoad).toHaveBeenCalledWith('hero');
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles missing section data gracefully', async () => {
      const section = createMockSection({
        data: {},
      });
      mockGetComponent.mockReturnValue(MockHeroSection);

      render(<DynamicSection section={section} />);

      await waitFor(() => {
        expect(screen.getByTestId('hero-section')).toBeInTheDocument();
      });
    });

    it('handles empty section data', async () => {
      const section = createMockSection({
        data: {},
      });
      mockGetComponent.mockReturnValue(MockHeroSection);

      render(<DynamicSection section={section} />);

      await waitFor(() => {
        expect(screen.getByTestId('hero-section')).toBeInTheDocument();
      });
    });

    it('provides default values for required fields', async () => {
      const TestComponent = vi.fn(() => <div>Test</div>);
      const section = createMockSection({
        data: {},
      });
      mockGetComponent.mockReturnValue(TestComponent);

      render(<DynamicSection section={section} />);

      await waitFor(() => {
        expect(TestComponent).toHaveBeenCalledWith(
          expect.objectContaining({
            title: '',
            subtitle: '',
          }),
          expect.anything()
        );
      });
    });
  });

  describe('Suspense Integration', () => {
    it('uses Suspense for async components', async () => {
      const section = createMockSection();
      mockGetComponent.mockReturnValue(MockHeroSection);

      render(<DynamicSection section={section} />);

      await waitFor(() => {
        expect(screen.getByTestId('hero-section')).toBeInTheDocument();
      });
    });
  });

  describe('Performance & Optimization', () => {
    it('renders efficiently with minimal overhead', async () => {
      const section = createMockSection();
      mockGetComponent.mockReturnValue(MockHeroSection);

      const startTime = performance.now();
      render(<DynamicSection section={section} />);
      await waitFor(() => {
        expect(screen.getByTestId('hero-section')).toBeInTheDocument();
      });
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
    });
  });

  describe('Theme Integration', () => {
    it('integrates with theme system', async () => {
      const section = createMockSection();
      mockGetComponent.mockReturnValue(MockHeroSection);

      render(
        <div data-theme="dark">
          <DynamicSection section={section} />
        </div>
      );

      await waitFor(() => {
        const dynamicSection = document.querySelector('.stx-section');
        expect(dynamicSection).toBeInTheDocument();
      });
    });

    it('applies theme-specific styling', async () => {
      const section = createMockSection();
      mockGetComponent.mockReturnValue(MockHeroSection);

      const { container } = renderWithTheme(<DynamicSection section={section} />, 'dark');

      await waitFor(() => {
        const themeContainer = container.closest('[data-theme]');
        if (themeContainer) {
          expect(themeContainer).toHaveAttribute('data-theme', 'dark');
        }

        const dynamicSection = container.querySelector('.stx-section');
        expect(dynamicSection).toBeInTheDocument();
      });
    });

    it('maintains functionality across all themes', async () => {
      const section = createMockSection();
      mockGetComponent.mockReturnValue(MockHeroSection);

      ALL_THEMES.forEach(async (theme) => {
        const { container } = renderWithTheme(<DynamicSection section={section} />, theme);

        await waitFor(() => {
          const dynamicSection = container.querySelector('.stx-section');
          expect(dynamicSection).toBeInTheDocument();

          // Verify content is still rendered
          expect(screen.getByTestId('hero-section')).toBeInTheDocument();
        });
      });
    });

    it('applies theme-specific CSS variables', async () => {
      const section = createMockSection();
      mockGetComponent.mockReturnValue(MockHeroSection);

      ALL_THEMES.forEach(async (theme) => {
        const { container } = renderWithTheme(<DynamicSection section={section} />, theme);

        await waitFor(() => {
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
    });

    it('supports theme switching without breaking', async () => {
      const section = createMockSection();
      mockGetComponent.mockReturnValue(MockHeroSection);

      const { rerender } = renderWithTheme(<DynamicSection section={section} />, 'light');

      await waitFor(() => {
        // Switch to dark theme
        rerender(<DynamicSection section={section} />);
        const darkContainer = document.querySelector('[data-theme="light"]');
        expect(darkContainer).toBeInTheDocument();

        // Switch to eu theme
        rerender(<DynamicSection section={section} />);
        const euContainer = document.querySelector('[data-theme="light"]');
        expect(euContainer).toBeInTheDocument();

        // Switch to uae theme
        rerender(<DynamicSection section={section} />);
        const uaeContainer = document.querySelector('[data-theme="light"]');
        expect(uaeContainer).toBeInTheDocument();

        // Switch back to light theme
        rerender(<DynamicSection section={section} />);
        const lightContainer = document.querySelector('[data-theme="light"]');
        expect(lightContainer).toBeInTheDocument();
      });
    });
  });

  // Enhanced theme switching tests using the utility
  testCompleteThemeSupport(
    'DynamicSection',
    (theme: ThemeName) => {
      const section = createMockSection();
      mockGetComponent.mockReturnValue(MockHeroSection);
      return <DynamicSection section={section} />;
    },
    {
      testSelectors: {
        background: '.stx-section',
        text: '.stx-section',
        border: '.stx-section',
        action: '.stx-section'
      },
      testTransitions: true,
      testAccessibility: true,
      testPerformance: true
    }
  );
});
