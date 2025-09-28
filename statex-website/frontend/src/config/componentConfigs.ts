export interface ComponentConfig {
  baseClasses: string[];
  pageVariants: Record<string, {
    additionalClasses: string[];
    elementOverrides: Record<string, string[]>;
    behaviorProps?: Record<string, any>;
  }>;
  behaviorProps: string[];
  abTestVariants: Record<string, ComponentConfig>;
}

export interface ElementConfig {
  container: string;
  content?: string;
  title?: string;
  subtitle?: string;
  cta?: string;
  buttons?: string;
  header?: string;
  icon?: string;
  text?: string;
  list?: string;
  grid?: string;
  item?: string;
  [key: string]: string | undefined;
}

export interface PageConfig {
  hero: ComponentConfig & { elements: ElementConfig };
  features: ComponentConfig & { elements: ElementConfig };
  process: ComponentConfig & { elements: ElementConfig };
  cta: ComponentConfig & { elements: ElementConfig };
  testimonials: ComponentConfig & { elements: ElementConfig };
  form: ComponentConfig & { elements: ElementConfig };
  legal?: ComponentConfig & { elements: ElementConfig };
  cards?: ComponentConfig & { elements: ElementConfig };
}

// Hero Component Configurations
export const heroConfigs: {
  homepage: ComponentConfig & { elements: ElementConfig };
  about: ComponentConfig & { elements: ElementConfig };
  service: ComponentConfig & { elements: ElementConfig };
  solution: ComponentConfig & { elements: ElementConfig };
  legal: ComponentConfig & { elements: ElementConfig };
  prototype: ComponentConfig & { elements: ElementConfig };
} = {
  homepage: {
    baseClasses: ['stx-homepage-hero'],
    elements: {
      container: 'stx-homepage-hero__container',
      content: 'stx-homepage-hero__content',
      title: 'stx-homepage-hero__title',
      subtitle: 'stx-homepage-hero__subtitle',
      trustIndicators: 'stx-homepage-hero__trust-indicators',
      trustBadge: 'stx-homepage-hero__trust-badge',
      trustIcon: 'stx-homepage-hero__trust-icon',
      prototypeInterface: 'stx-homepage-hero__prototype-interface',
      interfaceHeader: 'stx-homepage-hero__interface-header',
      interfaceTitle: 'stx-homepage-hero__interface-title',
      interfaceSubtitle: 'stx-homepage-hero__interface-subtitle',
      highlight: 'stx-homepage-hero__highlight'
    },
    pageVariants: {},
    behaviorProps: ['title', 'subtitle', 'showTrustIndicators', 'showPrototypeInterface'],
    abTestVariants: {}
  },
  about: {
    baseClasses: ['stx-about-hero'],
    elements: {
      container: 'stx-about-hero__container',
      content: 'stx-about-hero__content',
      title: 'stx-about-hero__title',
      subtitle: 'stx-about-hero__subtitle',
      cta: 'stx-about-hero__cta',
      metrics: 'stx-metrics',
      metricsItem: 'stx-metrics__item',
      metricsNumber: 'stx-metrics__number',
      metricsLabel: 'stx-metrics__label'
    },
    pageVariants: {},
    behaviorProps: ['title', 'subtitle', 'showMetrics', 'metrics'],
    abTestVariants: {}
  },
  service: {
    baseClasses: ['stx-service-hero'],
    elements: {
      container: 'stx-service-hero__container',
      icon: 'stx-service-hero__icon',
      title: 'stx-service-hero__title',
      subtitle: 'stx-service-hero__subtitle',
      cta: 'stx-service-hero__cta',
      btnPrimary: 'stx-service-hero__btn--primary',
      btnSecondary: 'stx-service-hero__btn--secondary'
    },
    pageVariants: {},
    behaviorProps: ['icon', 'title', 'subtitle', 'primaryAction', 'secondaryAction'],
    abTestVariants: {}
  },
  solution: {
    baseClasses: ['stx-solution-hero'],
    elements: {
      container: 'stx-solution-hero__container',
      badge: 'stx-solution-hero__badge',
      title: 'stx-solution-hero__title',
      subtitle: 'stx-solution-hero__subtitle',
      stats: 'stx-solution-hero__stats',
      statItem: 'stx-solution-hero__stat-item',
      statNumber: 'stx-solution-hero__stat-number',
      statLabel: 'stx-solution-hero__stat-label'
    },
    pageVariants: {},
    behaviorProps: ['badge', 'title', 'subtitle', 'stats', 'showStats'],
    abTestVariants: {}
  },
  legal: {
    baseClasses: ['stx-legal-hero'],
    elements: {
      container: 'stx-legal-hero__container',
      content: 'stx-legal-hero__content',
      icon: 'stx-legal-hero__icon',
      badge: 'stx-legal-hero__badge',
      title: 'stx-legal-hero__title',
      subtitle: 'stx-legal-hero__subtitle',
      cta: 'stx-legal-hero__cta',
      btnPrimary: 'stx-legal-hero__btn--primary',
      btnSecondary: 'stx-legal-hero__btn--secondary'
    },
    pageVariants: {},
    behaviorProps: ['icon', 'badge', 'title', 'subtitle', 'primaryAction', 'secondaryAction'],
    abTestVariants: {}
  },
  prototype: {
    baseClasses: ['stx-prototype-hero'],
    elements: {
      container: 'stx-prototype-hero__container',
      content: 'stx-prototype-hero__content',
      title: 'stx-prototype-hero__title',
      subtitle: 'stx-prototype-hero__subtitle',
      cta: 'stx-prototype-hero__cta',
      btnPrimary: 'stx-prototype-hero__btn--primary',
      btnSecondary: 'stx-prototype-hero__btn--secondary'
    },
    pageVariants: {},
    behaviorProps: ['title', 'subtitle', 'primaryAction', 'secondaryAction'],
    abTestVariants: {}
  }
};

// Form Component Configurations
export const formConfigs: {
  prototype: ComponentConfig & { elements: ElementConfig };
  contact: ComponentConfig & { elements: ElementConfig };
} = {
  prototype: {
    baseClasses: ['stx-form', 'stx-form--prototype'],
    elements: {
      container: 'stx-form__container',
      form: 'stx-form__form',
      section: 'stx-form__section',
      sectionTitle: 'stx-form__section-title',
      field: 'stx-form__field',
      fieldGroup: 'stx-form__field-group',
      label: 'stx-form__label',
      required: 'stx-form__required',
      input: 'stx-form__input',
      textarea: 'stx-form__textarea',
      select: 'stx-form__select',
      button: 'stx-form__button',
      submitBtn: 'stx-form__submit-btn',
      error: 'stx-form__error',
      success: 'stx-form__success',
      mediaRow: 'stx-form__media-row',
      mediaField: 'stx-form__media-field',
      audioSection: 'stx-form__audio-section',
      audioBtn: 'stx-form__audio-btn',
      recordingInfo: 'stx-form__recording-info',
      fileUpload: 'stx-form__file-upload',
      fileInput: 'stx-form__file-input',
      fileList: 'stx-form__file-list',
      fileItem: 'stx-form__file-item',
      fileRemove: 'stx-form__file-remove',
      privacyNote: 'stx-form__privacy-note'
    },
    pageVariants: {
      prototype: {
        additionalClasses: ['stx-form-block'],
        elementOverrides: {
          container: ['stx-form-block__container'],
          textarea: ['stx-form__description-textarea']
        }
      }
    },
    behaviorProps: ['showVoiceRecording', 'showFileUpload', 'sections'],
    abTestVariants: {}
  },
  contact: {
    baseClasses: ['stx-form', 'stx-form--contact'],
    elements: {
      container: 'stx-form__container',
      form: 'stx-form__form',
      section: 'stx-form__section',
      sectionTitle: 'stx-form__section-title',
      field: 'stx-form__field',
      fieldGroup: 'stx-form__field-group',
      label: 'stx-form__label',
      required: 'stx-form__required',
      input: 'stx-form__input',
      textarea: 'stx-form__textarea',
      select: 'stx-form__select',
      button: 'stx-form__button',
      submitBtn: 'stx-form__submit-btn',
      error: 'stx-form__error',
      success: 'stx-form__success'
    },
    pageVariants: {
      contact: {
        additionalClasses: ['stx-form-simple'],
        elementOverrides: {}
      }
    },
    behaviorProps: ['sections'],
    abTestVariants: {}
  }
};

// Features Component Configurations
export const featuresConfigs: ComponentConfig & { elements: ElementConfig } = {
  baseClasses: ['stx-features'],
  elements: {
    container: 'stx-section-container',
    header: 'stx-section-header',
    title: 'stx-section-title',
    subtitle: 'stx-section-subtitle',
    grid: 'stx-features__grid',
    item: 'stx-features__item',
    itemHeader: 'stx-features__header',
    icon: 'stx-features__icon',
    heading: 'stx-features__heading',
    text: 'stx-features__text',
    list: 'stx-features__list',
    link: 'stx-features__link',
    checkIcon: 'stx-check-icon'
  },
  pageVariants: {},
  behaviorProps: ['title', 'subtitle', 'features', 'showLinks'],
  abTestVariants: {}
};

// Process Component Configurations
export const processConfigs: {
  homepage: ComponentConfig & { elements: ElementConfig };
  about: ComponentConfig & { elements: ElementConfig };
  service: ComponentConfig & { elements: ElementConfig };
  solution: ComponentConfig & { elements: ElementConfig };
  legal: ComponentConfig & { elements: ElementConfig };
  prototype: ComponentConfig & { elements: ElementConfig };
} = {
  homepage: {
    baseClasses: ['stx-process'],
    elements: {
      container: 'stx-section-container',
      header: 'stx-section-header',
      title: 'stx-section-title',
      subtitle: 'stx-section-subtitle',
      steps: 'stx-process__steps',
      step: 'stx-process__step',
      number: 'stx-process__number',
      heading: 'stx-process__heading',
      text: 'stx-process__text',
      details: 'stx-process__details'
    },
    pageVariants: {},
    behaviorProps: ['title', 'subtitle', 'steps', 'showDetails'],
    abTestVariants: {}
  },
  about: {
    baseClasses: ['stx-process'],
    elements: {
      container: 'stx-section-container',
      header: 'stx-section-header',
      title: 'stx-section-title',
      subtitle: 'stx-section-subtitle',
      steps: 'stx-process__steps',
      step: 'stx-process__step',
      number: 'stx-process__number',
      heading: 'stx-process__heading',
      text: 'stx-process__text',
      details: 'stx-process__details'
    },
    pageVariants: {},
    behaviorProps: ['title', 'subtitle', 'steps', 'showDetails'],
    abTestVariants: {}
  },
  service: {
    baseClasses: ['stx-process'],
    elements: {
      container: 'stx-section-container',
      header: 'stx-section-header',
      title: 'stx-section-title',
      subtitle: 'stx-section-subtitle',
      steps: 'stx-process__steps',
      step: 'stx-process__step',
      number: 'stx-process__number',
      heading: 'stx-process__heading',
      text: 'stx-process__text',
      details: 'stx-process__details'
    },
    pageVariants: {},
    behaviorProps: ['title', 'subtitle', 'steps', 'showDetails'],
    abTestVariants: {}
  },
  solution: {
    baseClasses: ['stx-process'],
    elements: {
      container: 'stx-section-container',
      header: 'stx-section-header',
      title: 'stx-section-title',
      subtitle: 'stx-section-subtitle',
      steps: 'stx-process__steps',
      step: 'stx-process__step',
      number: 'stx-process__number',
      heading: 'stx-process__heading',
      text: 'stx-process__text',
      details: 'stx-process__details'
    },
    pageVariants: {},
    behaviorProps: ['title', 'subtitle', 'steps', 'showDetails'],
    abTestVariants: {}
  },
  legal: {
    baseClasses: ['stx-process'],
    elements: {
      container: 'stx-section-container',
      header: 'stx-section-header',
      title: 'stx-section-title',
      subtitle: 'stx-section-subtitle',
      steps: 'stx-process__steps',
      step: 'stx-process__step',
      number: 'stx-process__number',
      heading: 'stx-process__heading',
      text: 'stx-process__text',
      details: 'stx-process__details'
    },
    pageVariants: {},
    behaviorProps: ['title', 'subtitle', 'steps', 'showDetails'],
    abTestVariants: {}
  },
  prototype: {
    baseClasses: ['stx-process'],
    elements: {
      container: 'stx-section-container',
      header: 'stx-section-header',
      title: 'stx-section-title',
      subtitle: 'stx-section-subtitle',
      steps: 'stx-process__steps',
      step: 'stx-process__step',
      number: 'stx-process__number',
      heading: 'stx-process__heading',
      text: 'stx-process__text',
      details: 'stx-process__details'
    },
    pageVariants: {},
    behaviorProps: ['title', 'subtitle', 'steps', 'showDetails'],
    abTestVariants: {}
  }
};

// CTA Component Configurations
export const ctaConfigs: {
  homepage: ComponentConfig & { elements: ElementConfig };
  about: ComponentConfig & { elements: ElementConfig };
  service: ComponentConfig & { elements: ElementConfig };
  solution: ComponentConfig & { elements: ElementConfig };
  legal: ComponentConfig & { elements: ElementConfig };
  prototype: ComponentConfig & { elements: ElementConfig };
  default: ComponentConfig & { elements: ElementConfig };
} = {
  homepage: {
    baseClasses: ['stx-cta'],
    elements: {
      container: 'stx-section-container',
      content: 'stx-cta__content',
      title: 'stx-cta__title',
      description: 'stx-cta__description',
      buttons: 'stx-cta__buttons',
      button: 'stx-cta__button',
      buttonPrimary: 'stx-button-cta__primary',
      buttonSecondary: 'stx-button-cta__secondary'
    },
    pageVariants: {},
    behaviorProps: ['title', 'description', 'primaryAction', 'secondaryAction'],
    abTestVariants: {}
  },
  about: {
    baseClasses: ['stx-about-cta'],
    elements: {
      container: 'stx-section-container',
      content: 'stx-about-cta__content',
      title: 'stx-about-cta__title',
      description: 'stx-about-cta__description',
      buttons: 'stx-about-cta__buttons',
      btnPrimary: 'stx-about-cta__btn--primary',
      btnSecondary: 'stx-about-cta__btn--secondary'
    },
    pageVariants: {},
    behaviorProps: ['title', 'description', 'primaryAction', 'secondaryAction'],
    abTestVariants: {}
  },
  service: {
    baseClasses: ['stx-cta'],
    elements: {
      container: 'stx-section-container',
      content: 'stx-cta__content',
      title: 'stx-cta__title',
      description: 'stx-cta__description',
      buttons: 'stx-cta__buttons',
      button: 'stx-cta__button'
    },
    pageVariants: {},
    behaviorProps: ['title', 'description', 'primaryAction', 'secondaryAction'],
    abTestVariants: {}
  },
  solution: {
    baseClasses: ['stx-cta'],
    elements: {
      container: 'stx-section-container',
      content: 'stx-cta__content',
      title: 'stx-cta__title',
      description: 'stx-cta__description',
      buttons: 'stx-cta__buttons',
      button: 'stx-cta__button'
    },
    pageVariants: {},
    behaviorProps: ['title', 'description', 'primaryAction', 'secondaryAction'],
    abTestVariants: {}
  },
  legal: {
    baseClasses: ['stx-cta'],
    elements: {
      container: 'stx-section-container',
      content: 'stx-cta__content',
      title: 'stx-cta__title',
      description: 'stx-cta__description',
      buttons: 'stx-cta__buttons',
      button: 'stx-cta__button'
    },
    pageVariants: {},
    behaviorProps: ['title', 'description', 'primaryAction', 'secondaryAction'],
    abTestVariants: {}
  },
  prototype: {
    baseClasses: ['stx-cta'],
    elements: {
      container: 'stx-section-container',
      content: 'stx-cta__content',
      title: 'stx-cta__title',
      description: 'stx-cta__description',
      buttons: 'stx-cta__buttons',
      button: 'stx-cta__button'
    },
    pageVariants: {},
    behaviorProps: ['title', 'description', 'primaryAction', 'secondaryAction'],
    abTestVariants: {}
  },
  default: {
    baseClasses: ['stx-cta'],
    elements: {
      container: 'stx-section-container',
      content: 'stx-cta__content',
      title: 'stx-cta__title',
      description: 'stx-cta__description',
      buttons: 'stx-cta__buttons',
      button: 'stx-cta__button',
      buttonPrimary: 'stx-button-cta__primary',
      buttonSecondary: 'stx-button-cta__secondary'
    },
    pageVariants: {},
    behaviorProps: ['title', 'description', 'primaryAction', 'secondaryAction'],
    abTestVariants: {}
  }
};

// Testimonials Component Configurations
export const testimonialsConfigs: {
  homepage: ComponentConfig & { elements: ElementConfig };
  about: ComponentConfig & { elements: ElementConfig };
  service: ComponentConfig & { elements: ElementConfig };
  solution: ComponentConfig & { elements: ElementConfig };
  legal: ComponentConfig & { elements: ElementConfig };
  prototype: ComponentConfig & { elements: ElementConfig };
} = {
  homepage: {
    baseClasses: ['stx-testimonials', 'stx-testimonials--homepage'],
    elements: {
      container: 'stx-testimonials__container',
      header: 'stx-section-header',
      title: 'stx-section-title',
      subtitle: 'stx-section-subtitle',
      items: 'stx-testimonials__items',
      item: 'stx-testimonials__item',
      quote: 'stx-testimonials__quote',
      author: 'stx-testimonials__author',
      name: 'stx-testimonials__name',
      role: 'stx-testimonials__role',
      company: 'stx-testimonials__company'
    },
    pageVariants: {
      homepage: {
        additionalClasses: ['featured'],
        elementOverrides: {
          container: ['wide'],
          items: ['grid-3']
        }
      }
    },
    behaviorProps: ['title', 'subtitle', 'testimonials'],
    abTestVariants: {}
  },
  about: {
    baseClasses: ['stx-testimonials', 'stx-testimonials--homepage'],
    elements: {
      container: 'stx-testimonials__container',
      header: 'stx-section-header',
      title: 'stx-section-title',
      subtitle: 'stx-section-subtitle',
      items: 'stx-testimonials__items',
      item: 'stx-testimonials__item',
      quote: 'stx-testimonials__quote',
      author: 'stx-testimonials__author',
      name: 'stx-testimonials__name',
      role: 'stx-testimonials__role',
      company: 'stx-testimonials__company'
    },
    pageVariants: {},
    behaviorProps: ['title', 'subtitle', 'testimonials'],
    abTestVariants: {}
  },
  service: {
    baseClasses: ['stx-testimonials', 'stx-testimonials--homepage'],
    elements: {
      container: 'stx-testimonials__container',
      header: 'stx-section-header',
      title: 'stx-section-title',
      subtitle: 'stx-section-subtitle',
      items: 'stx-testimonials__items',
      item: 'stx-testimonials__item',
      quote: 'stx-testimonials__quote',
      author: 'stx-testimonials__author',
      name: 'stx-testimonials__name',
      role: 'stx-testimonials__role',
      company: 'stx-testimonials__company'
    },
    pageVariants: {},
    behaviorProps: ['title', 'subtitle', 'testimonials'],
    abTestVariants: {}
  },
  solution: {
    baseClasses: ['stx-testimonials', 'stx-testimonials--homepage'],
    elements: {
      container: 'stx-testimonials__container',
      header: 'stx-section-header',
      title: 'stx-section-title',
      subtitle: 'stx-section-subtitle',
      items: 'stx-testimonials__items',
      item: 'stx-testimonials__item',
      quote: 'stx-testimonials__quote',
      author: 'stx-testimonials__author',
      name: 'stx-testimonials__name',
      role: 'stx-testimonials__role',
      company: 'stx-testimonials__company'
    },
    pageVariants: {},
    behaviorProps: ['title', 'subtitle', 'testimonials'],
    abTestVariants: {}
  },
  legal: {
    baseClasses: ['stx-testimonials', 'stx-testimonials--homepage'],
    elements: {
      container: 'stx-testimonials__container',
      header: 'stx-section-header',
      title: 'stx-section-title',
      subtitle: 'stx-section-subtitle',
      items: 'stx-testimonials__items',
      item: 'stx-testimonials__item',
      quote: 'stx-testimonials__quote',
      author: 'stx-testimonials__author',
      name: 'stx-testimonials__name',
      role: 'stx-testimonials__role',
      company: 'stx-testimonials__company'
    },
    pageVariants: {},
    behaviorProps: ['title', 'subtitle', 'testimonials'],
    abTestVariants: {}
  },
  prototype: {
    baseClasses: ['stx-testimonials', 'stx-testimonials--homepage'],
    elements: {
      container: 'stx-testimonials__container',
      header: 'stx-testimonials__header',
      title: 'stx-testimonials__title',
      subtitle: 'stx-testimonials__subtitle',
      items: 'stx-testimonials__items',
      item: 'stx-testimonials__item',
      quote: 'stx-testimonials__quote',
      author: 'stx-testimonials__author',
      name: 'stx-testimonials__name',
      role: 'stx-testimonials__role',
      company: 'stx-testimonials__company'
    },
    pageVariants: {},
    behaviorProps: ['title', 'subtitle', 'testimonials'],
    abTestVariants: {}
  }
};

export const cardConfigs: {
  values: ComponentConfig & { elements: ElementConfig };
  team: ComponentConfig & { elements: ElementConfig };
  culture: ComponentConfig & { elements: ElementConfig };
  testimonial: ComponentConfig & { elements: ElementConfig };
} = {
  values: {
    baseClasses: ['stx-values__card'],
    elements: {
      container: 'stx-values__card',
      icon: 'stx-values__icon',
      title: 'stx-values__card-title',
      description: 'stx-values__card-description'
    },
    pageVariants: {},
    behaviorProps: ['icon', 'title', 'description'],
    abTestVariants: {}
  },
  team: {
    baseClasses: ['stx-values__card'],
    elements: {
      container: 'stx-values__card',
      icon: 'stx-values__icon',
      title: 'stx-values__card-title',
      description: 'stx-values__card-description'
    },
    pageVariants: {},
    behaviorProps: ['icon', 'title', 'description'],
    abTestVariants: {}
  },
  culture: {
    baseClasses: ['stx-values__card'],
    elements: {
      container: 'stx-values__card',
      icon: 'stx-values__icon',
      title: 'stx-values__card-title',
      description: 'stx-values__card-description'
    },
    pageVariants: {},
    behaviorProps: ['icon', 'title', 'description'],
    abTestVariants: {}
  },
  testimonial: {
    baseClasses: ['stx-values__card'],
    elements: {
      container: 'stx-values__card',
      icon: 'stx-values__icon',
      title: 'stx-values__card-title',
      description: 'stx-values__card-description'
    },
    pageVariants: {},
    behaviorProps: ['icon', 'title', 'description'],
    abTestVariants: {}
  }
};

// Page-specific complete configurations
export const pageConfigs: Record<string, PageConfig> = {
  homepage: {
    hero: heroConfigs.homepage,
    features: featuresConfigs,
    process: processConfigs.homepage,
    cta: ctaConfigs.homepage,
    testimonials: testimonialsConfigs.homepage,
    cards: cardConfigs.values,
    form: formConfigs.prototype
  },
  about: {
    hero: heroConfigs.about,
    features: featuresConfigs,
    process: processConfigs.about,
    cta: ctaConfigs.about,
    testimonials: testimonialsConfigs.about,
    cards: cardConfigs.team,
    form: formConfigs.contact
  },
  service: {
    hero: heroConfigs.service,
    features: featuresConfigs,
    process: processConfigs.service,
    cta: ctaConfigs.service,
    testimonials: testimonialsConfigs.service,
    cards: cardConfigs.team,
    form: formConfigs.contact
  },
  solution: {
    hero: heroConfigs.solution,
    features: featuresConfigs,
    process: processConfigs.solution,
    cta: ctaConfigs.solution,
    testimonials: testimonialsConfigs.solution,
    cards: cardConfigs.culture,
    form: formConfigs.contact
  },
  legal: {
    hero: heroConfigs.legal,
    features: featuresConfigs,
    process: processConfigs.legal,
    cta: ctaConfigs.legal,
    testimonials: testimonialsConfigs.legal,
    cards: cardConfigs.values,
    form: formConfigs.contact
  },
  prototype: {
    hero: heroConfigs.prototype,
    features: featuresConfigs,
    process: processConfigs.prototype,
    cta: ctaConfigs.prototype,
    testimonials: testimonialsConfigs.prototype,
    cards: cardConfigs.testimonial,
    form: formConfigs.prototype
  }
};
