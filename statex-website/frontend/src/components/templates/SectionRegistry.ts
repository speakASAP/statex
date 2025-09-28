import { ComponentType } from 'react';
import { SectionType, SectionVariant } from '@/types/templates';

// Import section components
import { HeroSection } from '@/components/sections/HeroSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { PricingSection } from '@/components/sections/PricingSection';
import { ContactFormSection } from '@/components/sections/ContactFormSection';
import { LegalContentSection } from '@/components/sections/LegalContentSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';

type SectionComponent = ComponentType<any>;

class SectionRegistryClass {
  private sections: Map<string, SectionComponent> = new Map();

  constructor() {
    this.registerDefaultSections();
  }

  private registerDefaultSections() {
    // Hero sections
    this.register('hero', 'default', HeroSection);
    this.register('hero', 'video', HeroSection);
    this.register('hero', 'split', HeroSection);

    // Features sections - using only valid variants
    this.register('features', 'grid', FeaturesSection);
    this.register('features', 'list', FeaturesSection);
    this.register('features', 'cards', FeaturesSection);

    // Process sections - using only valid variants
    this.register('process', 'steps', ProcessSection);
    this.register('process', 'timeline', ProcessSection);
    this.register('process', 'cards', ProcessSection);

    // Pricing sections
    this.register('pricing', 'cards', PricingSection);
    this.register('pricing', 'table', PricingSection);
    this.register('pricing', 'toggle', PricingSection);

    // Contact form sections
    this.register('contactForm', 'split', ContactFormSection);
    this.register('contactForm', 'modal', ContactFormSection);
    this.register('contactForm', 'floating', ContactFormSection);

    // Legal content sections
    this.register('content', 'legal', LegalContentSection);

    // Testimonials sections - using only valid variants
    this.register('testimonials', 'default', TestimonialsSection);
    this.register('testimonials', 'cards', TestimonialsSection);

    // Prototype form sections
    this.register('prototypeForm', 'default', ContactFormSection);
    this.register('prototypeForm', 'modal', ContactFormSection);
    this.register('prototypeForm', 'floating', ContactFormSection);
  }

  register(type: SectionType, variant: SectionVariant, component: SectionComponent) {
    const key = `${type}-${variant}`;
    this.sections.set(key, component);
  }

  getSection(type: SectionType, variant: SectionVariant): SectionComponent | null {
    const key = `${type}-${variant}`;
    return this.sections.get(key) || null;
  }

  hasSection(type: SectionType, variant: SectionVariant): boolean {
    const key = `${type}-${variant}`;
    return this.sections.has(key);
  }

  getAllSections(): Array<{ type: SectionType; variant: SectionVariant; component: SectionComponent }> {
    const result: Array<{ type: SectionType; variant: SectionVariant; component: SectionComponent }> = [];

    for (const [key, component] of this.sections.entries()) {
      const [type, variant] = key.split('-') as [SectionType, SectionVariant];
      result.push({ type, variant, component });
    }

    return result;
  }

  getSectionsByType(type: SectionType): Array<{ variant: SectionVariant; component: SectionComponent }> {
    const result: Array<{ variant: SectionVariant; component: SectionComponent }> = [];

    for (const [key, component] of this.sections.entries()) {
      if (key.startsWith(`${type}-`)) {
        const variant = key.split('-')[1] as SectionVariant;
        result.push({ variant, component });
      }
    }

    return result;
  }
}

export const SectionRegistry = new SectionRegistryClass();
