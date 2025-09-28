export type SectionType =
  | 'hero'
  | 'features'
  | 'process'
  | 'pricing'
  | 'contactForm'
  | 'content'
  | 'testimonials'
  | 'prototypeForm'
  | 'header'
  | 'footer';

export type SectionVariant =
  | 'default'
  | 'video'
  | 'split'
  | 'grid'
  | 'list'
  | 'cards'
  | 'steps'
  | 'timeline'
  | 'table'
  | 'toggle'
  | 'modal'
  | 'floating'
  | 'legal';

export type SectionPriority = 'low' | 'medium' | 'high';

export interface SectionConfig {
  id: string;
  type: SectionType;
  variant: SectionVariant;
  config: Record<string, any>;
  priority: SectionPriority;
  aiOptimized: boolean;
}

export interface TemplateMetadata {
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    structuredData?: Record<string, any>;
  };
  performance?: {
    preload?: boolean;
    lazy?: boolean;
    priority?: SectionPriority;
  };
  analytics?: {
    trackEvents?: boolean;
    customMetrics?: Record<string, any>;
  };
}

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  sections: SectionConfig[];
  metadata: TemplateMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface HeroSectionConfig {
  title: string;
  subtitle?: string;
  description?: string;
  cta?: {
    primary?: string | { text: string; href: string };
    secondary?: string | { text: string; href: string };
  };
  video?: string;
  layout?: 'default' | 'split' | 'video';
  lastUpdated?: string;
}

export interface FeaturesSectionConfig {
  title: string;
  features: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  layout?: 'grid' | 'list' | 'cards';
}

export interface ProcessSectionConfig {
  title: string;
  steps: Array<{
    step?: number;
    title: string;
    description: string;
  }>;
  layout?: 'steps' | 'timeline' | 'cards';
}

export interface PricingSectionConfig {
  title: string;
  plans: Array<{
    name: string;
    price: string;
    description: string;
    features: string[];
    popular?: boolean;
  }>;
}

export interface ContactFormSectionConfig {
  title: string;
  subtitle?: string;
  formTitle?: string;
  formSubtitle?: string;
  submitButtonText?: string;
  placeholder?: string;
  layout?: 'split' | 'modal' | 'floating';
  variant?: 'default' | 'prototype';
  showVoiceRecording?: boolean;
  showFileUpload?: boolean;
  customForm?: React.ReactNode;
  onSubmit?: (data: any) => void;
}

export interface HeaderSectionConfig {
  title?: string;
  navigation?: Array<{
    label: string;
    href: string;
  }>;
  languages?: Array<{
    value: string;
    label: string;
    flag: string;
  }>;
  cta?: {
    text: string;
    href: string;
  };
  variant?: 'default' | 'minimal' | 'transparent';
  showLanguageSwitcher?: boolean;
  showThemeToggle?: boolean;
  showVariantToggle?: boolean;
  className?: string;
}

export interface FooterSectionConfig {
  company?: {
    name: string;
    description: string;
    contact: {
      phone: string;
      email: string;
      address: string;
    };
  };
  services?: Array<{
    title: string;
    href: string;
  }>;
  solutions?: Array<{
    title: string;
    href: string;
  }>;
  resources?: Array<{
    title: string;
    href: string;
  }>;
  legal?: Array<{
    title: string;
    href: string;
  }>;
  social?: Array<{
    name: string;
    href: string;
    icon: string;
  }>;
  variant?: 'default' | 'minimal' | 'compact';
  showNewsletter?: boolean;
  className?: string;
}

export interface LegalContentSectionConfig {
  title: string;
  sections: Array<{
    id: string;
    title: string;
    content: string;
  }>;
  className?: string;
}

export interface TestimonialsSectionConfig {
  title: string;
  testimonials: Array<{
    name: string;
    role: string;
    company: string;
    content: string;
    rating: number;
  }>;
}

export type SectionConfigMap = {
  hero: HeroSectionConfig;
  features: FeaturesSectionConfig;
  process: ProcessSectionConfig;
  pricing: PricingSectionConfig;
  contactForm: ContactFormSectionConfig;
  content: LegalContentSectionConfig;
  testimonials: TestimonialsSectionConfig;
  prototypeForm: ContactFormSectionConfig;
  header: HeaderSectionConfig;
  footer: FooterSectionConfig;
};
