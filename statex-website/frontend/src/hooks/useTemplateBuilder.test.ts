import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTemplateBuilder } from './useTemplateBuilder';

describe('useTemplateBuilder Hook', () => {
  beforeEach(() => {
    // Clear any cached instances
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up after each test
    vi.clearAllMocks();
  });

  describe('Basic Functionality', () => {
    it('should return a TemplateBuilder instance', () => {
      const { result } = renderHook(() => useTemplateBuilder());

      expect(result.current).toBeDefined();
      expect(typeof result.current.addSection).toBe('function');
      expect(typeof result.current.setMetadata).toBe('function');
      expect(typeof result.current.build).toBe('function');
    });

    it('should create a new builder instance', () => {
      const { result } = renderHook(() => useTemplateBuilder());

      const builder = result.current;
      expect(builder).toBeInstanceOf(Object);
    });
  });

  describe('Template Building', () => {
    it('should build template with sections', () => {
      const { result } = renderHook(() => useTemplateBuilder());

      const template = result.current
        .addSection('hero', 'default', { title: 'Test Hero' })
        .addSection('features', 'grid', { features: ['Feature 1', 'Feature 2'] })
        .build();

      expect(template.id).toBeDefined();
      expect(template.name).toBe('Dynamic Template');
      expect(template.description).toBe('Generated template');
      expect(template.sections).toHaveLength(2);
      expect(template.sections[0].type).toBe('hero');
      expect(template.sections[0].variant).toBe('default');
      expect(template.sections[0].config).toEqual({ title: 'Test Hero' });
      expect(template.sections[1].type).toBe('features');
      expect(template.sections[1].variant).toBe('grid');
      expect(template.sections[1].config).toEqual({ features: ['Feature 1', 'Feature 2'] });
    });

    it('should generate unique IDs for sections', () => {
      const { result } = renderHook(() => useTemplateBuilder());

      const template = result.current
        .addSection('hero', 'default', { title: 'Hero' })
        .addSection('features', 'grid', { features: [] })
        .build();

      expect(template.sections[0].id).toBeDefined();
      expect(template.sections[1].id).toBeDefined();
      expect(template.sections[0].id).not.toBe(template.sections[1].id);
    });

    it('should set default priority and aiOptimized for sections', () => {
      const { result } = renderHook(() => useTemplateBuilder());

      const template = result.current
        .addSection('hero', 'default', { title: 'Test Hero' })
        .build();

      expect(template.sections[0].priority).toBe('medium');
      expect(template.sections[0].aiOptimized).toBe(false);
    });
  });

  describe('Metadata Management', () => {
    it('should set template metadata', () => {
      const { result } = renderHook(() => useTemplateBuilder());

      const template = result.current
        .setMetadata({
          name: 'Custom Template',
          description: 'Custom description'
        })
        .addSection('hero', 'default', { title: 'Test Hero' })
        .build();

      expect(template.name).toBe('Custom Template');
      expect(template.description).toBe('Custom description');
    });

    it('should merge metadata correctly', () => {
      const { result } = renderHook(() => useTemplateBuilder());

      const template = result.current
        .setMetadata({ name: 'First Name' })
        .setMetadata({ description: 'First Description' })
        .setMetadata({ name: 'Final Name' })
        .addSection('hero', 'default', { title: 'Test Hero' })
        .build();

      expect(template.name).toBe('Final Name');
      expect(template.description).toBe('First Description');
    });

    it('should set SEO metadata', () => {
      const { result } = renderHook(() => useTemplateBuilder());

      const template = result.current
        .setMetadata({
          metadata: {
            seo: {
              title: 'SEO Title',
              description: 'SEO Description'
            }
          }
        })
        .addSection('hero', 'default', { title: 'Test Hero' })
        .build();

      expect(template.metadata.seo.title).toBe('SEO Title');
      expect(template.metadata.seo.description).toBe('SEO Description');
    });

    it('should set performance metadata', () => {
      const { result } = renderHook(() => useTemplateBuilder());

      const template = result.current
        .setMetadata({
          metadata: {
            performance: {
              lazyLoad: true,
              preload: false
            }
          }
        })
        .addSection('hero', 'default', { title: 'Test Hero' })
        .build();

      expect(template.metadata.performance.lazyLoad).toBe(true);
      expect(template.metadata.performance.preload).toBe(false);
    });

    it('should set analytics metadata', () => {
      const { result } = renderHook(() => useTemplateBuilder());

      const template = result.current
        .setMetadata({
          metadata: {
            analytics: {
              trackingId: 'GA-123456',
              conversionGoals: ['contact_form']
            }
          }
        })
        .addSection('hero', 'default', { title: 'Test Hero' })
        .build();

      expect(template.metadata.analytics.trackingId).toBe('GA-123456');
      expect(template.metadata.analytics.conversionGoals).toEqual(['contact_form']);
    });
  });

  describe('Chaining', () => {
    it('should support method chaining', () => {
      const { result } = renderHook(() => useTemplateBuilder());

      const template = result.current
        .addSection('hero', 'default', { title: 'Hero' })
        .addSection('features', 'grid', { features: [] })
        .addSection('cta', 'primary', { text: 'Click me' })
        .setMetadata({ name: 'Chained Template' })
        .build();

      expect(template.name).toBe('Chained Template');
      expect(template.sections).toHaveLength(3);
    });

    it('should return builder instance for chaining', () => {
      const { result } = renderHook(() => useTemplateBuilder());

      const builder = result.current;
      const chainedBuilder = builder.addSection('hero', 'default', { title: 'Test' });

      expect(chainedBuilder).toBe(builder);
    });
  });

  describe('Template Structure', () => {
    it('should generate template with required fields', () => {
      const { result } = renderHook(() => useTemplateBuilder());

      const template = result.current
        .addSection('hero', 'default', { title: 'Test Hero' })
        .build();

      expect(template.id).toBeDefined();
      expect(template.name).toBeDefined();
      expect(template.description).toBeDefined();
      expect(template.sections).toBeInstanceOf(Array);
      expect(template.metadata).toBeDefined();
      expect(template.createdAt).toBeDefined();
      expect(template.updatedAt).toBeDefined();
    });

    it('should generate unique template IDs with sufficient delay', async () => {
      const { result } = renderHook(() => useTemplateBuilder());

      const template1 = result.current
        .addSection('hero', 'default', { title: 'Test Hero' })
        .build();

      // Add a small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 10));

      const template2 = result.current
        .addSection('hero', 'default', { title: 'Test Hero 2' })
        .build();

      expect(template1.id).not.toBe(template2.id);
    });
  });

  describe('Section Configuration', () => {
    it('should handle different section types', () => {
      const { result } = renderHook(() => useTemplateBuilder());

      const template = result.current
        .addSection('hero', 'default', { title: 'Hero' })
        .addSection('features', 'grid', { features: [] })
        .addSection('testimonials', 'carousel', { testimonials: [] })
        .build();

      expect(template.sections[0].type).toBe('hero');
      expect(template.sections[1].type).toBe('features');
      expect(template.sections[2].type).toBe('testimonials');
    });

    it('should handle different section variants', () => {
      const { result } = renderHook(() => useTemplateBuilder());

      const template = result.current
        .addSection('hero', 'default', { title: 'Default Hero' })
        .addSection('hero', 'video', { title: 'Video Hero' })
        .addSection('hero', 'minimal', { title: 'Minimal Hero' })
        .build();

      expect(template.sections[0].variant).toBe('default');
      expect(template.sections[1].variant).toBe('video');
      expect(template.sections[2].variant).toBe('minimal');
    });

    it('should handle complex configuration objects', () => {
      const { result } = renderHook(() => useTemplateBuilder());

      const complexConfig = {
        title: 'Complex Section',
        subtitle: 'With multiple properties',
        items: [
          { id: 1, name: 'Item 1' },
          { id: 2, name: 'Item 2' }
        ],
        settings: {
          showTitle: true,
          showSubtitle: false,
          maxItems: 5
        }
      };

      const template = result.current
        .addSection('complex', 'advanced', complexConfig)
        .build();

      expect(template.sections[0].config).toEqual(complexConfig);
    });
  });

  describe('Performance', () => {
    it('should memoize builder instance across re-renders', () => {
      const { result, rerender } = renderHook(() => useTemplateBuilder());

      const firstBuilder = result.current;

      // Re-render
      rerender();

      expect(result.current).toBe(firstBuilder);
    });

    it('should create new builder instance for each hook call', () => {
      const { result: result1 } = renderHook(() => useTemplateBuilder());
      const { result: result2 } = renderHook(() => useTemplateBuilder());

      expect(result1.current).not.toBe(result2.current);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty section configuration', () => {
      const { result } = renderHook(() => useTemplateBuilder());

      const template = result.current
        .addSection('hero', 'default', {})
        .build();

      expect(template.sections[0].config).toEqual({});
    });

    it('should handle null section configuration', () => {
      const { result } = renderHook(() => useTemplateBuilder());

      const template = result.current
        .addSection('hero', 'default', null as any)
        .build();

      expect(template.sections[0].config).toBeNull();
    });

    it('should handle empty metadata', () => {
      const { result } = renderHook(() => useTemplateBuilder());

      const template = result.current
        .setMetadata({})
        .addSection('hero', 'default', { title: 'Test Hero' })
        .build();

      expect(template.name).toBe('Dynamic Template');
      expect(template.description).toBe('Generated template');
    });
  });
});
