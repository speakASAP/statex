import { ComponentType } from 'react';
import { HeroSection } from './HeroSection';
import { FeaturesSection } from './FeaturesSection';
import { ProcessSection } from './ProcessSection';
import { ContactFormSection } from './ContactFormSection';
import { LegalContentSection } from './LegalContentSection';
import TestimonialsSection from './TestimonialsSection';
import { HeaderSection } from './HeaderSection';
import { FooterSection } from './FooterSection';
import { PricingSection } from './PricingSection';
import { CTASection } from './CTASection';
import { BlogSection } from './BlogSection';
import { ContentDefaultSection } from './ContentDefaultSection';

type SectionComponent = ComponentType<any>;

interface SectionRegistryType {
  [key: string]: {
    component: SectionComponent;
    variants: {
      [key: string]: {
        component: SectionComponent;
        defaultVariant?: string;
      };
    };
  };
}

const sectionComponents: SectionRegistryType = {
  hero: {
    component: HeroSection,
    variants: {
      default: { component: HeroSection },
      video: { component: HeroSection },
      split: { component: HeroSection }
    }
  },
  features: {
    component: FeaturesSection,
    variants: {
      default: { component: FeaturesSection },
      grid: { component: FeaturesSection },
      list: { component: FeaturesSection },
      cards: { component: FeaturesSection }
    }
  },
  process: {
    component: ProcessSection,
    variants: {
      default: { component: ProcessSection },
      steps: { component: ProcessSection },
      timeline: { component: ProcessSection },
      cards: { component: ProcessSection }
    }
  },
  testimonials: {
    component: TestimonialsSection,
    variants: {
      default: { component: TestimonialsSection },
      grid: { component: TestimonialsSection },
      list: { component: TestimonialsSection },
      carousel: { component: TestimonialsSection }
    }
  },
  'contact-form': {
    component: ContactFormSection,
    variants: {
      default: { component: ContactFormSection },
      split: { component: ContactFormSection },
      modal: { component: ContactFormSection },
      floating: { component: ContactFormSection }
    }
  },
  'legal-content': {
    component: LegalContentSection,
    variants: {
      default: { component: LegalContentSection }
    }
  },
  header: {
    component: HeaderSection,
    variants: {
      default: { component: HeaderSection }
    }
  },
  footer: {
    component: FooterSection,
    variants: {
      default: { component: FooterSection }
    }
  },
  pricing: {
    component: PricingSection,
    variants: {
      default: { component: PricingSection },
      cards: { component: PricingSection },
      table: { component: PricingSection }
    }
  },
  cta: {
    component: CTASection,
    variants: {
      default: { component: CTASection },
      primary: { component: CTASection },
      secondary: { component: CTASection }
    }
  },
  blog: {
    component: BlogSection,
    variants: {
      default: { component: BlogSection },
      preview: { component: BlogSection },
      grid: { component: BlogSection },
      list: { component: BlogSection }
    }
  },
  'content-default': {
    component: ContentDefaultSection,
    variants: {
      default: { component: ContentDefaultSection }
    }
  }
};

export const SectionRegistry = {
  getComponent: (sectionType: string, variant: string = 'default'): SectionComponent | null => {
    const section = sectionComponents[sectionType];
    if (!section) return null;

    const variantConfig = section.variants[variant] || section.variants['default'];
    return variantConfig?.component || section.component;
  },

  hasSection: (sectionType: string): boolean => {
    return sectionType in sectionComponents;
  },

  getVariants: (sectionType: string): string[] => {
    const section = sectionComponents[sectionType];
    return section ? Object.keys(section.variants) : [];
  },

  getDefaultVariant: (sectionType: string): string => {
    const section = sectionComponents[sectionType];
    if (!section) return 'default';

    const defaultVariant = Object.entries(section.variants).find(([_, config]) => config.defaultVariant);
    return defaultVariant ? defaultVariant[0] : 'default';
  }
};

export type SectionType = keyof typeof sectionComponents;

export const getSectionVariant = (sectionType: string, variantName: string): SectionComponent | null => {
  return SectionRegistry.getComponent(sectionType, variantName);
};

export const getDefaultVariant = (sectionType: string): string => {
  return SectionRegistry.getDefaultVariant(sectionType);
};
