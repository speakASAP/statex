import {
  TemplateBuilderConfig,
  TemplateBuilderOptions,
  BuiltTemplate,
  createTemplateConfig,
  validateTemplateConfig,
  calculateTemplatePerformance
} from './TemplateConfig';
import { TemplateSection, SectionInstance } from '../sections/types';
import { getDefaultVariant } from '../sections/SectionRegistry';

export class TemplateBuilder {
  private config: Partial<TemplateBuilderConfig>;
  private sections: TemplateSection[];
  private options: TemplateBuilderOptions;
  private abTests: Map<string, string>;

  constructor(options: TemplateBuilderOptions = {}) {
    this.config = {};
    this.sections = [];
    this.options = {
      enableABTesting: true,
      enableAIOptimization: true,
      enablePerformanceMonitoring: true,
      enableLazyLoading: true,
      defaultPriority: 'medium',
      ...options
    };
    this.abTests = new Map();
  }

  withId(id: string): TemplateBuilder {
    this.config.id = id;
    return this;
  }

  withName(name: string): TemplateBuilder {
    this.config.name = name;
    return this;
  }

  withLayout(layout: 'default' | 'hero' | 'content' | 'dashboard'): TemplateBuilder {
    this.config.layout = layout;
    return this;
  }

  withSections(sections: TemplateSection[]): TemplateBuilder {
    this.sections = sections;
    return this;
  }

  withSection(section: TemplateSection): TemplateBuilder {
    this.sections.push(section);
    return this;
  }

  withSEO(seo: TemplateBuilderConfig['seo']): TemplateBuilder {
    if (seo) {
      this.config.seo = seo;
    }
    return this;
  }

  withMarket(market: 'EU' | 'UAE'): TemplateBuilder {
    this.config.market = market;
    return this;
  }

  withAIEnabled(enabled: boolean = true): TemplateBuilder {
    this.config.aiEnabled = enabled;
    return this;
  }

  withHeader(show: boolean = true): TemplateBuilder {
    this.config.showHeader = show;
    return this;
  }

  withFooter(show: boolean = true): TemplateBuilder {
    this.config.showFooter = show;
    return this;
  }

  withClassName(className: string): TemplateBuilder {
    this.config.className = className;
    return this;
  }

  withABTest(experimentId: string, variant: string): TemplateBuilder {
    if (this.options.enableABTesting) {
      this.abTests.set(experimentId, variant);
    }
    return this;
  }

  withPerformanceOptimization(): TemplateBuilder {
    // Apply performance optimizations to sections
    this.sections = this.sections.map((section, index) => ({
      ...section,
      priority: section.priority || this.options.defaultPriority || 'medium',
      // Set high priority for first 2 sections (above the fold)
      ...(index < 2 && !section.priority && { priority: 'high' as const })
    }));
    return this;
  }

  withAIOptimization(): TemplateBuilder {
    if (this.options.enableAIOptimization) {
      // Apply AI optimizations to sections
      this.sections = this.sections.map(section => ({
        ...section,
        aiOptimized: true
      }));
    }
    return this;
  }

  private processSections(): SectionInstance[] {
    return this.sections.map((section) => {
      const sectionInstance: SectionInstance = {
        id: `${section.type}-${section.variant || getDefaultVariant(section.type)}`,
        type: section.type,
        variant: section.variant || getDefaultVariant(section.type),
        data: section.data || {},
        priority: section.priority || this.options.defaultPriority || 'medium',
        aiOptimized: this.options.enableAIOptimization || false
      };

      // Apply AB testing if configured
      if (this.abTests.has(section.type)) {
        sectionInstance.abTest = {
          experimentId: section.type,
          variant: this.abTests.get(section.type)!
        };
      }

      return sectionInstance;
    });
  }

  private validateConfiguration(): string[] {
    if (!this.config.id) {
      return ['Template ID is required'];
    }

    if (!this.config.name) {
      return ['Template name is required'];
    }

    if (this.sections.length === 0) {
      return ['At least one section is required'];
    }

    const templateConfig = createTemplateConfig(
      this.config.id,
      this.config.name,
      this.sections,
      this.config
    );

    return validateTemplateConfig(templateConfig);
  }

  build(): BuiltTemplate {
    // Validate configuration
    const errors = this.validateConfiguration();
    if (errors.length > 0) {
      throw new Error(`Template validation failed: ${errors.join(', ')}`);
    }

    // Apply optimizations
    this.withPerformanceOptimization();
    if (this.options.enableAIOptimization) {
      this.withAIOptimization();
    }

    // Process sections
    const processedSections = this.processSections();

    // Create template config
    const templateConfig = createTemplateConfig(
      this.config.id!,
      this.config.name!,
      this.sections,
      this.config
    );

    // Calculate metadata
    const metadata = {
      totalSections: processedSections.length,
      requiredSections: processedSections.filter(s => s.priority === 'high').length,
      optionalSections: processedSections.filter(s => s.priority === 'low').length,
      abTests: Array.from(this.abTests.keys()),
      performanceScore: calculateTemplatePerformance(templateConfig)
    };

    return {
      config: templateConfig,
      sections: processedSections,
      metadata
    };
  }

  // Static factory methods for common templates
  static createServicePage(serviceData: any): TemplateBuilder {
    return new TemplateBuilder()
      .withLayout('hero')
      .withSections([
        { type: 'hero', variant: 'service', data: serviceData.hero, priority: 'high' },
        { type: 'features', variant: 'grid', data: serviceData.features, priority: 'high' },
        { type: 'process', variant: 'steps', data: serviceData.process, priority: 'medium' },
        { type: 'testimonials', variant: 'carousel', data: serviceData.testimonials, priority: 'low' },
        { type: 'pricing', variant: 'cards', data: serviceData.pricing, priority: 'medium' },
        { type: 'cta', variant: 'primary', data: serviceData.cta, priority: 'high' }
      ])
      .withAIEnabled(true)
      .withPerformanceOptimization();
  }

  static createHomePage(): TemplateBuilder {
    return new TemplateBuilder()
      .withLayout('hero')
      .withSections([
        { type: 'hero', variant: 'landing', priority: 'high' },
        { type: 'features', variant: 'grid', priority: 'high' },
        { type: 'testimonials', variant: 'carousel', priority: 'medium' },
        { type: 'blog', variant: 'preview', priority: 'low' },
        { type: 'cta', variant: 'primary', priority: 'high' }
      ])
      .withAIEnabled(true)
      .withPerformanceOptimization();
  }

  static createContentPage(): TemplateBuilder {
    return new TemplateBuilder()
      .withLayout('content')
      .withSections([
        { type: 'hero', variant: 'minimal', priority: 'high' },
        { type: 'cta', variant: 'secondary', priority: 'medium' }
      ])
      .withAIEnabled(false)
      .withPerformanceOptimization();
  }
}
