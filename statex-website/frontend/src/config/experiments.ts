export interface Experiment {
  id: string;
  name: string;
  description: string;
  variants: string[];
  trafficSplit: number[];
  metrics: string[];
  enabled: boolean;
  startDate?: string;
  endDate?: string;
}

export const experiments: Record<string, Experiment> = {
  'ecommerce-hero': {
    id: 'ecommerce-hero',
    name: 'E-commerce Hero Section Variants',
    description: 'Test different hero section layouts for e-commerce pages',
    variants: ['default', 'video', 'split'],
    trafficSplit: [50, 25, 25],
    metrics: ['engagement', 'conversion', 'time_on_page'],
    enabled: true,
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  },
  'ecommerce-pricing': {
    id: 'ecommerce-pricing',
    name: 'E-commerce Pricing Display',
    description: 'Test different pricing section layouts',
    variants: ['cards', 'table', 'toggle'],
    trafficSplit: [60, 20, 20],
    metrics: ['conversion', 'revenue', 'engagement'],
    enabled: true,
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  },
  'ecommerce-process': {
    id: 'ecommerce-process',
    name: 'E-commerce Process Visualization',
    description: 'Test different process section layouts',
    variants: ['steps', 'timeline', 'cards'],
    trafficSplit: [70, 15, 15],
    metrics: ['engagement', 'conversion'],
    enabled: true,
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  },
  'ecommerce-contact': {
    id: 'ecommerce-contact',
    name: 'E-commerce Contact Form',
    description: 'Test different contact form layouts',
    variants: ['split', 'modal', 'floating'],
    trafficSplit: [50, 25, 25],
    metrics: ['conversion', 'form_submissions'],
    enabled: true,
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  },
  'system-modernization-hero': {
    id: 'system-modernization-hero',
    name: 'System Modernization Hero Section Variants',
    description: 'Test different hero section layouts for system modernization pages',
    variants: ['default', 'video', 'split'],
    trafficSplit: [50, 25, 25],
    metrics: ['engagement', 'conversion', 'time_on_page'],
    enabled: true,
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  },
  'system-modernization-pricing': {
    id: 'system-modernization-pricing',
    name: 'System Modernization Pricing Display',
    description: 'Test different pricing section layouts for system modernization',
    variants: ['cards', 'table', 'toggle'],
    trafficSplit: [60, 20, 20],
    metrics: ['conversion', 'revenue', 'engagement'],
    enabled: true,
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  },
  'system-modernization-process': {
    id: 'system-modernization-process',
    name: 'System Modernization Process Visualization',
    description: 'Test different process section layouts for system modernization',
    variants: ['steps', 'timeline', 'cards'],
    trafficSplit: [70, 15, 15],
    metrics: ['engagement', 'conversion'],
    enabled: true,
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  },
  'system-modernization-contact': {
    id: 'system-modernization-contact',
    name: 'System Modernization Contact Form',
    description: 'Test different contact form layouts for system modernization',
    variants: ['split', 'modal', 'floating'],
    trafficSplit: [50, 25, 25],
    metrics: ['conversion', 'form_submissions'],
    enabled: true,
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  },
  'web-development-hero': {
    id: 'web-development-hero',
    name: 'Web Development Hero Section Variants',
    description: 'Test different hero section layouts for web development pages',
    variants: ['default', 'video', 'split'],
    trafficSplit: [50, 25, 25],
    metrics: ['engagement', 'conversion', 'time_on_page'],
    enabled: true,
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  },
  'web-development-features': {
    id: 'web-development-features',
    name: 'Web Development Features Display',
    description: 'Test different features section layouts for web development',
    variants: ['grid', 'list', 'cards'],
    trafficSplit: [60, 20, 20],
    metrics: ['engagement', 'conversion'],
    enabled: true,
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  },
  'web-development-process': {
    id: 'web-development-process',
    name: 'Web Development Process Visualization',
    description: 'Test different process section layouts for web development',
    variants: ['steps', 'timeline', 'cards'],
    trafficSplit: [70, 15, 15],
    metrics: ['engagement', 'conversion'],
    enabled: true,
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  },
  'web-development-contact': {
    id: 'web-development-contact',
    name: 'Web Development Contact Form',
    description: 'Test different contact form layouts for web development',
    variants: ['split', 'modal', 'floating'],
    trafficSplit: [50, 25, 25],
    metrics: ['conversion', 'form_submissions'],
    enabled: true,
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  },
  'digital-transformation-hero': {
    id: 'digital-transformation-hero',
    name: 'Digital Transformation Hero Section Variants',
    description: 'Test different hero section layouts for digital transformation pages',
    variants: ['default', 'video', 'split'],
    trafficSplit: [50, 25, 25],
    metrics: ['engagement', 'conversion', 'time_on_page'],
    enabled: true,
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  },
  'digital-transformation-features': {
    id: 'digital-transformation-features',
    name: 'Digital Transformation Features Display',
    description: 'Test different features section layouts for digital transformation',
    variants: ['grid', 'list', 'cards'],
    trafficSplit: [60, 20, 20],
    metrics: ['engagement', 'conversion'],
    enabled: true,
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  },
  'digital-transformation-process': {
    id: 'digital-transformation-process',
    name: 'Digital Transformation Process Visualization',
    description: 'Test different process section layouts for digital transformation',
    variants: ['steps', 'timeline', 'cards'],
    trafficSplit: [70, 15, 15],
    metrics: ['engagement', 'conversion'],
    enabled: true,
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  },
  'digital-transformation-contact': {
    id: 'digital-transformation-contact',
    name: 'Digital Transformation Contact Form',
    description: 'Test different contact form layouts for digital transformation',
    variants: ['split', 'modal', 'floating'],
    trafficSplit: [50, 25, 25],
    metrics: ['conversion', 'form_submissions'],
    enabled: true,
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  },
  'custom-software-hero': {
    id: 'custom-software-hero',
    name: 'Custom Software Hero Section Variants',
    description: 'Test different hero section layouts for custom software pages',
    variants: ['default', 'video', 'split'],
    trafficSplit: [50, 25, 25],
    metrics: ['engagement', 'conversion', 'time_on_page'],
    enabled: true,
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  },
  'custom-software-features': {
    id: 'custom-software-features',
    name: 'Custom Software Features Display',
    description: 'Test different features section layouts for custom software',
    variants: ['grid', 'list', 'cards'],
    trafficSplit: [60, 20, 20],
    metrics: ['engagement', 'conversion'],
    enabled: true,
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  },
  'custom-software-process': {
    id: 'custom-software-process',
    name: 'Custom Software Process Visualization',
    description: 'Test different process section layouts for custom software',
    variants: ['steps', 'timeline', 'cards'],
    trafficSplit: [70, 15, 15],
    metrics: ['engagement', 'conversion'],
    enabled: true,
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  },
  'custom-software-contact': {
    id: 'custom-software-contact',
    name: 'Custom Software Contact Form',
    description: 'Test different contact form layouts for custom software',
    variants: ['split', 'modal', 'floating'],
    trafficSplit: [50, 25, 25],
    metrics: ['conversion', 'form_submissions'],
    enabled: true,
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  },
  'ai-automation-hero': {
    id: 'ai-automation-hero',
    name: 'AI Automation Hero Section Variants',
    description: 'Test different hero section layouts for AI automation pages',
    variants: ['default', 'video', 'split'],
    trafficSplit: [50, 25, 25],
    metrics: ['engagement', 'conversion', 'time_on_page'],
    enabled: true,
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  },
  'ai-automation-features': {
    id: 'ai-automation-features',
    name: 'AI Automation Features Display',
    description: 'Test different features section layouts for AI automation',
    variants: ['grid', 'list', 'cards'],
    trafficSplit: [60, 20, 20],
    metrics: ['engagement', 'conversion'],
    enabled: true,
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  },
  'ai-automation-process': {
    id: 'ai-automation-process',
    name: 'AI Automation Process Visualization',
    description: 'Test different process section layouts for AI automation',
    variants: ['steps', 'timeline', 'cards'],
    trafficSplit: [70, 15, 15],
    metrics: ['engagement', 'conversion'],
    enabled: true,
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  },
  'ai-automation-contact': {
    id: 'ai-automation-contact',
    name: 'AI Automation Contact Form',
    description: 'Test different contact form layouts for AI automation',
    variants: ['split', 'modal', 'floating'],
    trafficSplit: [50, 25, 25],
    metrics: ['conversion', 'form_submissions'],
    enabled: true,
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  },
  'prototype-hero': {
    id: 'prototype-hero',
    name: 'Prototype Hero Section Variants',
    description: 'Test different hero section layouts for prototype pages',
    variants: ['default', 'video', 'split'],
    trafficSplit: [50, 25, 25],
    metrics: ['engagement', 'conversion', 'time_on_page'],
    enabled: true,
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  },
  'prototype-features': {
    id: 'prototype-features',
    name: 'Prototype Features Display',
    description: 'Test different features section layouts for prototype pages',
    variants: ['grid', 'list', 'cards'],
    trafficSplit: [60, 20, 20],
    metrics: ['engagement', 'conversion'],
    enabled: true,
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  },
  'prototype-contact': {
    id: 'prototype-contact',
    name: 'Prototype Contact Form',
    description: 'Test different contact form layouts for prototype pages',
    variants: ['split', 'modal', 'floating'],
    trafficSplit: [50, 25, 25],
    metrics: ['conversion', 'form_submissions'],
    enabled: true,
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  },
  'business-automation-hero': {
    id: 'business-automation-hero',
    name: 'Business Automation Hero Section Variants',
    description: 'Test different hero section layouts for business automation pages',
    variants: ['default', 'video', 'split'],
    trafficSplit: [50, 25, 25],
    metrics: ['engagement', 'conversion', 'time_on_page'],
    enabled: true,
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  },
  'business-automation-features': {
    id: 'business-automation-features',
    name: 'Business Automation Features Display',
    description: 'Test different features section layouts for business automation pages',
    variants: ['grid', 'list', 'cards'],
    trafficSplit: [60, 20, 20],
    metrics: ['engagement', 'conversion'],
    enabled: true,
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  },
  'business-automation-process': {
    id: 'business-automation-process',
    name: 'Business Automation Process Visualization',
    description: 'Test different process section layouts for business automation pages',
    variants: ['steps', 'timeline', 'cards'],
    trafficSplit: [70, 15, 15],
    metrics: ['engagement', 'conversion'],
    enabled: true,
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  },
  'business-automation-contact': {
    id: 'business-automation-contact',
    name: 'Business Automation Contact Form',
    description: 'Test different contact form layouts for business automation pages',
    variants: ['split', 'modal', 'floating'],
    trafficSplit: [50, 25, 25],
    metrics: ['conversion', 'form_submissions'],
    enabled: true,
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  }
};

export function getExperiment(id: string): Experiment | null {
  return experiments[id] || null;
}

export function isExperimentEnabled(id: string): boolean {
  const experiment = getExperiment(id);
  if (!experiment) return false;

  if (!experiment.enabled) return false;

  const now = new Date();
  if (experiment.startDate && new Date(experiment.startDate) > now) return false;
  if (experiment.endDate && new Date(experiment.endDate) < now) return false;

  return true;
}

export function getExperimentVariants(id: string): string[] {
  const experiment = getExperiment(id);
  return experiment?.variants || [];
}

export function getExperimentTrafficSplit(id: string): number[] {
  const experiment = getExperiment(id);
  return experiment?.trafficSplit || [100];
}
