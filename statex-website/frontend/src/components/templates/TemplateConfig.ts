import { TemplateConfig, TemplateSection, SectionInstance } from '../sections/types';

export interface TemplateBuilderConfig {
  id: string;
  name: string;
  layout?: 'default' | 'hero' | 'content' | 'dashboard';
  sections?: TemplateSection[];
  seo?: {
    title: string;
    description: string;
    keywords: string[];
    structuredData?: object;
    ogImage?: string;
    canonicalUrl?: string;
  };
  market?: 'EU' | 'UAE';
  aiEnabled?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
  className?: string;
  abTests?: {
    [experimentId: string]: {
      variants: string[];
      traffic: number[];
    };
  };
}

export interface TemplateBuilderOptions {
  enableABTesting?: boolean;
  enableAIOptimization?: boolean;
  enablePerformanceMonitoring?: boolean;
  enableLazyLoading?: boolean;
  defaultPriority?: 'high' | 'medium' | 'low';
}

export interface BuiltTemplate {
  config: TemplateConfig;
  sections: SectionInstance[];
  metadata: {
    totalSections: number;
    requiredSections: number;
    optionalSections: number;
    abTests: string[];
    performanceScore: number;
  };
}

export const createTemplateConfig = (
  id: string,
  name: string,
  sections: TemplateSection[],
  options: Partial<TemplateBuilderConfig> = {}
): TemplateConfig => {
  const config: TemplateConfig = {
    id,
    name,
    layout: options.layout || 'default',
    sections,
    market: options.market || 'EU',
    aiEnabled: options.aiEnabled !== false,
    showHeader: options.showHeader !== false,
    showFooter: options.showFooter !== false,
    className: options.className || ''
  };

  if (options.seo) {
    config.seo = options.seo;
  }

  return config;
};

export const validateTemplateConfig = (config: TemplateConfig): string[] => {
  const errors: string[] = [];

  // Validate required fields
  if (!config.id) errors.push('Template ID is required');
  if (!config.name) errors.push('Template name is required');
  if (!config.sections || config.sections.length === 0) {
    errors.push('At least one section is required');
  }

  // Validate sections
  config.sections?.forEach((section, index) => {
    if (!section.type) {
      errors.push(`Section ${index + 1}: Type is required`);
    }
    if (!section.variant) {
      errors.push(`Section ${index + 1}: Variant is required`);
    }
  });

  // Validate SEO
  if (config.seo) {
    if (!config.seo.title) errors.push('SEO title is required');
    if (!config.seo.description) errors.push('SEO description is required');
    if (!config.seo.keywords || config.seo.keywords.length === 0) {
      errors.push('SEO keywords are required');
    }
  }

  return errors;
};

export const calculateTemplatePerformance = (config: TemplateConfig): number => {
  let score = 100;

  // Penalize for too many sections
  if (config.sections.length > 10) {
    score -= (config.sections.length - 10) * 5;
  }

  // Penalize for heavy sections
  const heavySections = ['testimonials', 'blog', 'pricing'];
  const heavyCount = config.sections.filter(s => heavySections.includes(s.type)).length;
  score -= heavyCount * 3;

  // Bonus for optimized sections
  const optimizedCount = config.sections.filter(s => s.priority === 'high').length;
  score += optimizedCount * 2;

  return Math.max(0, Math.min(100, score));
};
