import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { TemplateRenderer } from './TemplateRenderer';
import { SectionRegistry } from '@/components/sections/SectionRegistry';
import { TemplateConfig, SectionConfig } from '@/types/templates';
import { testCompleteThemeSupport, renderWithTheme, ALL_THEMES, ThemeName } from '../../test/utils/theme-testing';

// Mock the SectionRegistry
vi.mock('@/components/sections/SectionRegistry', () => ({
  SectionRegistry: {
    getComponent: vi.fn(),
  },
}));

// Mock DynamicSection component
vi.mock('@/components/sections/DynamicSection', () => ({
  DynamicSection: ({ section }: { section: any }) => (
    <div data-testid={`dynamic-section-${section.id}`} className="stx-dynamic-section">
      <span data-testid="section-type">{section.type}</span>
      <span data-testid="section-variant">{section.variant}</span>
      <span data-testid="section-id">{section.id}</span>
    </div>
  ),
}));

// Mock section components
const MockHeroSection = () => <div data-testid="hero-section">Hero Section</div>;
const MockFeaturesSection = () => <div data-testid="features-section">Features Section</div>;
const MockProcessSection = () => <div data-testid="process-section">Process Section</div>;

describe('TemplateRenderer', () => {
  const mockGetComponent = vi.mocked(SectionRegistry.getComponent);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Cleanup
  });

  const createMockTemplate = (sections: SectionConfig[]): TemplateConfig => ({
    id: 'test-template',
    name: 'Test Template',
    description: 'A test template',
    sections,
    metadata: {
      seo: {
        title: 'Test Template',
        description: 'Test template description',
      },
      performance: {
        preload: false,
        lazy: true,
        priority: 'medium',
      },
      analytics: {
        trackEvents: true,
      },
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  });

  describe('STX Classes', () => {
    it('applies correct STX classes to template container', () => {
      const template = createMockTemplate([]);

      render(<TemplateRenderer template={template} />);

      const templateContainer = document.querySelector('.stx-template');
      expect(templateContainer).toBeInTheDocument();
    });

    it('applies custom className to template container', () => {
      const template = createMockTemplate([]);

      render(<TemplateRenderer template={template} className="custom-template" />);

      const templateContainer = document.querySelector('.stx-template');
      expect(templateContainer).toHaveClass('custom-template');
    });

    it('applies data-template-id attribute', () => {
      const template = createMockTemplate([]);

      render(<TemplateRenderer template={template} />);

      const templateContainer = document.querySelector('.stx-template');
      expect(templateContainer).toHaveAttribute('data-template-id', 'test-template');
    });

    it('applies BEM-style classes to template elements', () => {
      const template = createMockTemplate([]);

      render(<TemplateRenderer template={template} />);

      const templateContainer = document.querySelector('.stx-template');
      expect(templateContainer).toHaveClass('stx-template');
    });
  });

  describe('Template Section Functionality', () => {
    it('renders template with sections', () => {
      const sections: SectionConfig[] = [
        {
          id: 'hero-1',
          type: 'hero',
          variant: 'default',
          config: { title: 'Test Hero' },
          priority: 'high',
          aiOptimized: true,
        },
        {
          id: 'features-1',
          type: 'features',
          variant: 'grid',
          config: { title: 'Test Features' },
          priority: 'medium',
          aiOptimized: false,
        },
      ];

      const template = createMockTemplate(sections);
      mockGetComponent.mockReturnValue(MockHeroSection);

      render(<TemplateRenderer template={template} />);

      expect(screen.getByTestId('dynamic-section-hero-1')).toBeInTheDocument();
      expect(screen.getByTestId('dynamic-section-features-1')).toBeInTheDocument();
    });

    it('renders empty template without sections', () => {
      const template = createMockTemplate([]);

      render(<TemplateRenderer template={template} />);

      const templateContainer = document.querySelector('.stx-template');
      expect(templateContainer).toBeInTheDocument();
      expect(templateContainer?.children.length).toBe(0);
    });

    it('handles template with single section', () => {
      const sections: SectionConfig[] = [
        {
          id: 'hero-1',
          type: 'hero',
          variant: 'default',
          config: { title: 'Single Hero' },
          priority: 'high',
          aiOptimized: true,
        },
      ];

      const template = createMockTemplate(sections);
      mockGetComponent.mockReturnValue(MockHeroSection);

      render(<TemplateRenderer template={template} />);

      expect(screen.getByTestId('dynamic-section-hero-1')).toBeInTheDocument();
      expect(screen.getByTestId('section-type')).toHaveTextContent('hero');
      expect(screen.getByTestId('section-variant')).toHaveTextContent('default');
    });

    it('renders sections in correct order', () => {
      const sections: SectionConfig[] = [
        {
          id: 'hero-1',
          type: 'hero',
          variant: 'default',
          config: { title: 'First Section' },
          priority: 'high',
          aiOptimized: true,
        },
        {
          id: 'features-1',
          type: 'features',
          variant: 'grid',
          config: { title: 'Second Section' },
          priority: 'medium',
          aiOptimized: false,
        },
        {
          id: 'process-1',
          type: 'process',
          variant: 'steps',
          config: { title: 'Third Section' },
          priority: 'low',
          aiOptimized: true,
        },
      ];

      const template = createMockTemplate(sections);
      mockGetComponent.mockReturnValue(MockHeroSection);

      render(<TemplateRenderer template={template} />);

      const dynamicSections = screen.getAllByTestId(/dynamic-section-/);
      expect(dynamicSections).toHaveLength(3);
      expect(dynamicSections[0]).toHaveAttribute('data-testid', 'dynamic-section-hero-1');
      expect(dynamicSections[1]).toHaveAttribute('data-testid', 'dynamic-section-features-1');
      expect(dynamicSections[2]).toHaveAttribute('data-testid', 'dynamic-section-process-1');
    });
  });

  describe('Section Registry Integration', () => {
    it('calls SectionRegistry.getComponent for each section', () => {
      const sections: SectionConfig[] = [
        {
          id: 'hero-1',
          type: 'hero',
          variant: 'default',
          config: { title: 'Test Hero' },
          priority: 'high',
          aiOptimized: true,
        },
        {
          id: 'features-1',
          type: 'features',
          variant: 'grid',
          config: { title: 'Test Features' },
          priority: 'medium',
          aiOptimized: false,
        },
      ];

      const template = createMockTemplate(sections);
      mockGetComponent.mockReturnValue(MockHeroSection);

      render(<TemplateRenderer template={template} />);

      expect(mockGetComponent).toHaveBeenCalledTimes(2);
      expect(mockGetComponent).toHaveBeenCalledWith('hero', 'default');
      expect(mockGetComponent).toHaveBeenCalledWith('features', 'grid');
    });

    it('handles missing section component gracefully', () => {
      const sections: SectionConfig[] = [
        {
          id: 'invalid-1',
          type: 'invalid' as any,
          variant: 'default' as any,
          config: { title: 'Invalid Section' },
          priority: 'high',
          aiOptimized: true,
        },
      ];

      const template = createMockTemplate(sections);
      mockGetComponent.mockReturnValue(null);

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      render(<TemplateRenderer template={template} />);

      expect(mockGetComponent).toHaveBeenCalledWith('invalid', 'default');
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('renders sections when component is found', () => {
      const sections: SectionConfig[] = [
        {
          id: 'hero-1',
          type: 'hero',
          variant: 'default',
          config: { title: 'Test Hero' },
          priority: 'high',
          aiOptimized: true,
        },
      ];

      const template = createMockTemplate(sections);
      mockGetComponent.mockReturnValue(MockHeroSection);

      render(<TemplateRenderer template={template} />);

      expect(screen.getByTestId('dynamic-section-hero-1')).toBeInTheDocument();
      expect(screen.getByTestId('section-type')).toHaveTextContent('hero');
      expect(screen.getByTestId('section-variant')).toHaveTextContent('default');
    });
  });

  describe('Section Instance Conversion', () => {
    it('converts section config to section instance correctly', () => {
      const sections: SectionConfig[] = [
        {
          id: 'hero-1',
          type: 'hero',
          variant: 'default',
          config: { title: 'Test Hero' },
          priority: 'high',
          aiOptimized: true,
        },
      ];

      const template = createMockTemplate(sections);
      mockGetComponent.mockReturnValue(MockHeroSection);

      render(<TemplateRenderer template={template} />);

      expect(screen.getByTestId('section-id')).toHaveTextContent('hero-1');
      expect(screen.getByTestId('section-type')).toHaveTextContent('hero');
      expect(screen.getByTestId('section-variant')).toHaveTextContent('default');
    });

    it('preserves all section properties in conversion', () => {
      const sections: SectionConfig[] = [
        {
          id: 'features-1',
          type: 'features',
          variant: 'grid',
          config: { title: 'Test Features' },
          priority: 'medium',
          aiOptimized: false,
        },
      ];

      const template = createMockTemplate(sections);
      mockGetComponent.mockReturnValue(MockFeaturesSection);

      render(<TemplateRenderer template={template} />);

      expect(screen.getByTestId('section-id')).toHaveTextContent('features-1');
      expect(screen.getByTestId('section-type')).toHaveTextContent('features');
      expect(screen.getByTestId('section-variant')).toHaveTextContent('grid');
    });
  });

  describe('Error Handling', () => {
    it('handles template with invalid section type', () => {
      const sections: SectionConfig[] = [
        {
          id: 'invalid-1',
          type: 'invalid' as any,
          variant: 'default' as any,
          config: { title: 'Invalid Section' },
          priority: 'high',
          aiOptimized: true,
        },
      ];

      const template = createMockTemplate(sections);
      mockGetComponent.mockReturnValue(null);

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      render(<TemplateRenderer template={template} />);

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('handles template with missing config properties', () => {
      const sections: SectionConfig[] = [
        {
          id: 'hero-1',
          type: 'hero',
          variant: 'default',
          config: { title: 'Test Hero' },
          priority: 'high',
          aiOptimized: true,
        },
      ];

      const template = createMockTemplate(sections);
      mockGetComponent.mockReturnValue(MockHeroSection);

      render(<TemplateRenderer template={template} />);

      expect(screen.getByTestId('dynamic-section-hero-1')).toBeInTheDocument();
    });

    it('handles template with null or undefined sections', () => {
      const template = createMockTemplate([]);

      render(<TemplateRenderer template={template} />);

      const templateContainer = document.querySelector('.stx-template');
      expect(templateContainer).toBeInTheDocument();
    });
  });

  describe('Performance & Optimization', () => {
    it('renders template efficiently with many sections', () => {
      const sections: SectionConfig[] = Array.from({ length: 10 }, (_, i) => ({
        id: `section-${i}`,
        type: 'hero',
        variant: 'default',
        config: { title: `Section ${i}` },
        priority: 'medium',
        aiOptimized: false,
      }));

      const template = createMockTemplate(sections);
      mockGetComponent.mockReturnValue(MockHeroSection);

      const startTime = performance.now();
      render(<TemplateRenderer template={template} />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(200); // Should render quickly
      expect(screen.getAllByTestId(/dynamic-section-/)).toHaveLength(10);
    });

    it('handles template with AI-optimized sections', () => {
      const sections: SectionConfig[] = [
        {
          id: 'ai-section-1',
          type: 'hero',
          variant: 'default',
          config: { title: 'AI Optimized Section' },
          priority: 'high',
          aiOptimized: true,
        },
      ];

      const template = createMockTemplate(sections);
      mockGetComponent.mockReturnValue(MockHeroSection);

      render(<TemplateRenderer template={template} />);

      expect(screen.getByTestId('dynamic-section-ai-section-1')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('maintains proper semantic structure', () => {
      const sections: SectionConfig[] = [
        {
          id: 'hero-1',
          type: 'hero',
          variant: 'default',
          config: { title: 'Test Hero' },
          priority: 'high',
          aiOptimized: true,
        },
      ];

      const template = createMockTemplate(sections);
      mockGetComponent.mockReturnValue(MockHeroSection);

      render(<TemplateRenderer template={template} />);

      const templateContainer = document.querySelector('.stx-template');
      expect(templateContainer).toHaveAttribute('data-template-id', 'test-template');
    });

    it('provides template identification for screen readers', () => {
      const template = createMockTemplate([]);

      render(<TemplateRenderer template={template} />);

      const templateContainer = document.querySelector('.stx-template');
      expect(templateContainer).toHaveAttribute('data-template-id', 'test-template');
    });
  });

  describe('Integration Testing', () => {
    it('integrates with different section types', () => {
      const sections: SectionConfig[] = [
        {
          id: 'hero-1',
          type: 'hero',
          variant: 'default',
          config: { title: 'Hero Section' },
          priority: 'high',
          aiOptimized: true,
        },
        {
          id: 'features-1',
          type: 'features',
          variant: 'grid',
          config: { title: 'Features Section' },
          priority: 'medium',
          aiOptimized: false,
        },
      ];

      const template = createMockTemplate(sections);

      // Mock different components for different sections
      mockGetComponent
        .mockReturnValueOnce(MockHeroSection)
        .mockReturnValueOnce(MockFeaturesSection);

      render(<TemplateRenderer template={template} />);

      expect(screen.getByTestId('dynamic-section-hero-1')).toBeInTheDocument();
      expect(screen.getByTestId('dynamic-section-features-1')).toBeInTheDocument();
    });

    it('handles template metadata correctly', () => {
      const template = createMockTemplate([]);

      render(<TemplateRenderer template={template} />);

      const templateContainer = document.querySelector('.stx-template');
      expect(templateContainer).toHaveAttribute('data-template-id', 'test-template');
    });
  });

  // Enhanced theme support tests using the utility
  testCompleteThemeSupport(
    'TemplateRenderer',
    (theme: ThemeName) => {
      const template = createMockTemplate([]);
      return <TemplateRenderer template={template} />;
    },
    {
      testSelectors: {
        background: '.stx-template',
        text: '.stx-template',
        border: '.stx-template',
        action: '.stx-template'
      },
      testTransitions: true,
      testAccessibility: true,
      testPerformance: true,
      testEnhancedIntegration: true,
      testEnhancedPerformance: true
    }
  );
});
