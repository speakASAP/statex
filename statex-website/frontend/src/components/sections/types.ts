
export interface SectionData {
  [key: string]: any;
}

export interface SectionVariant {
  name: string;
  component: React.ComponentType<any>;
  defaultProps?: Record<string, any>;
}

export interface SectionConfig {
  type: string;
  variants: SectionVariant[];
  defaultVariant: string;
  required?: boolean;
  optional?: boolean;
}

export interface SectionInstance {
  id: string;
  type: string;
  variant: string;
  data: SectionData;
  priority: 'high' | 'medium' | 'low';
  aiOptimized?: boolean;
  abTest?: {
    experimentId: string;
    variant: string;
  };
}

export interface SectionRegistry {
  [sectionType: string]: SectionConfig;
}

export interface TemplateSection {
  type: string;
  variant: string;
  data?: SectionData;
  priority?: 'high' | 'medium' | 'low';
  required?: boolean;
  optional?: boolean;
  abTest?: {
    experimentId: string;
    variants: string[];
  };
}

export interface TemplateConfig {
  id: string;
  name: string;
  layout: 'default' | 'hero' | 'content' | 'dashboard';
  sections: TemplateSection[];
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
}
