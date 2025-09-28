// A/B Testing Configuration System
// Manages experiments, variants, and user assignment

export interface ABTestExperiment {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  variants: ABTestVariant[];
  trafficAllocation: number; // Percentage of traffic to include in test
  targetPage?: string; // Optional: specific page targeting
  startDate?: Date;
  endDate?: Date;
}

export interface ABTestVariant {
  id: string;
  name: string;
  description: string;
  weight: number; // Relative weight for traffic split
  config: any; // Component-specific configuration
}

export interface UserAssignment {
  userId: string;
  experimentId: string;
  variantId: string;
  assignedAt: Date;
}

// Your specific A/B test configuration: 3 hero variants × 2 page layouts
export const abTestExperiments: Record<string, ABTestExperiment> = {
  // Experiment 1: Hero Section Variants
  'homepage-hero-variants': {
    id: 'homepage-hero-variants',
    name: 'Homepage Hero Variants',
    description: 'Testing 3 different hero section approaches',
    isActive: true,
    trafficAllocation: 100, // 100% of traffic
    targetPage: 'homepage',
    variants: [
      {
        id: 'hero-classic',
        name: 'Classic Hero',
        description: 'Traditional hero with large title and single CTA',
        weight: 33,
        config: {
          title: 'Transform Your Ideas Into Working Prototypes in 24 Hours',
          subtitle: 'Experience the future of software development with AI-powered prototype creation. Simply describe your vision through voice, text, or files, and receive a functional web application prototype — completely free.',
          highlight: 'Working Prototypes',
          showTrustIndicators: true,
          showPrototypeInterface: true,
          trustBadges: [
            { icon: '⚡', text: '24-48 Hour Delivery' },
            { icon: '🌍', text: 'EU Market Expertise' },
            { icon: '🗣️', text: '9 Languages Supported' },
            { icon: '🆓', text: 'Completely Free Prototype' }
          ],
          primaryAction: {
            text: 'Get Free Prototype',
            href: '/free-prototype'
          }
        }
      },
      {
        id: 'hero-benefit-focused',
        name: 'Benefit-Focused Hero',
        description: 'Hero emphasizing key benefits and social proof',
        weight: 33,
        config: {
          title: 'Transform Your Ideas Into Working Prototypes in 24 Hours',
          subtitle: 'Experience the future of software development with AI-powered prototype creation. Simply describe your vision through voice, text, or files, and receive a functional web application prototype — completely free.',
          highlight: 'Working Prototypes',
          showTrustIndicators: true,
          showPrototypeInterface: true,
          trustBadges: [
            { icon: '⚡', text: '24-48 Hour Delivery' },
            { icon: '🌍', text: 'EU Market Expertise' },
            { icon: '🗣️', text: '9 Languages Supported' },
            { icon: '🆓', text: 'Completely Free Prototype' }
          ],
          primaryAction: {
            text: 'Get Free Prototype',
            href: '/free-prototype'
          }
        }
      },
      {
        id: 'hero-urgency',
        name: 'Urgency-Driven Hero',
        description: 'Hero with urgency and scarcity elements',
        weight: 34,
        config: {
          title: 'Transform Your Ideas Into Working Prototypes in 24 Hours',
          subtitle: 'Experience the future of software development with AI-powered prototype creation. Simply describe your vision through voice, text, or files, and receive a functional web application prototype — completely free.',
          highlight: 'Working Prototypes',
          showTrustIndicators: true,
          showPrototypeInterface: true,
          trustBadges: [
            { icon: '⚡', text: '24-48 Hour Delivery' },
            { icon: '🌍', text: 'EU Market Expertise' },
            { icon: '🗣️', text: '9 Languages Supported' },
            { icon: '🆓', text: 'Completely Free Prototype' }
          ],
          primaryAction: {
            text: 'Get Free Prototype',
            href: '/free-prototype'
          }
        }
      }
    ]
  },

  // Experiment 2: Page Layout Variants
  'homepage-layout-variants': {
    id: 'homepage-layout-variants',
    name: 'Homepage Layout Variants',
    description: 'Testing 2 different overall page layouts',
    isActive: true,
    trafficAllocation: 100,
    targetPage: 'homepage',
    variants: [
      {
        id: 'layout-standard',
        name: 'Standard Layout',
        description: 'Traditional layout: Hero → Features → Process → Testimonials → CTA',
        weight: 50,
        config: {
          sections: ['hero', 'features', 'process', 'testimonials', 'cta'],
          featuresConfig: {
            title: 'Our Core Services for European Businesses',
            variant: 'grid'
          },
          processConfig: {
            title: 'How We Work',
            variant: 'steps'
          },
          testimonialsConfig: {
            title: 'What Our Clients Say',
            subtitle: 'Trusted by businesses across Europe for rapid development and exceptional results.'
          },
          featuresConfig: {
            title: 'Our Core Services for European Businesses',
            variant: 'grid'
          },
          processConfig: {
            title: 'How It Works',
            subtitle: 'Get your working prototype in just 4 simple steps. Our AI-powered process makes development faster and more efficient than ever before.',
            variant: 'steps'
          }
        }
      },
      {
        id: 'layout-conversion-optimized',
        name: 'Conversion-Optimized Layout',
        description: 'Optimized layout: Hero → Testimonials → Features → CTA → Process',
        weight: 50,
        config: {
          sections: ['hero', 'testimonials', 'features', 'cta', 'process'],
          featuresConfig: {
            title: 'Why 500+ Companies Choose Us',
            variant: 'cards'
          },
          processConfig: {
            title: 'Simple 3-Step Process',
            variant: 'timeline'
          },
          testimonialsConfig: {
            title: 'What Our Clients Say',
            subtitle: 'Trusted by businesses across Europe for rapid development and exceptional results.'
          },
          featuresConfig: {
            title: 'Why 500+ Companies Choose Us',
            variant: 'cards'
          },
          processConfig: {
            title: 'Simple 3-Step Process',
            subtitle: 'Get your working prototype in just 3 simple steps with our streamlined AI-powered process.',
            variant: 'timeline'
          },
          ctaConfig: {
            title: 'Ready to 10x Your Development Speed?',
            description: 'Join hundreds of companies who ship faster with our AI-powered development.'
          }
        }
      }
    ]
  }
};

// Cookie helpers
function setCookie(name: string, value: string, days = 365) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
}
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const found = document.cookie.split('; ').find(v => v.startsWith(name + '='));
  if (!found) return null;
  const parts = found.split('=');
  if (parts.length < 2 || typeof parts[1] === 'undefined') return null;
  return decodeURIComponent(parts[1]);
}

export class ABTestManager {
  private static instance: ABTestManager;
  private userAssignments: Map<string, Map<string, string>> = new Map();

  constructor() {
    // Load assignments from cookie
    if (typeof document !== 'undefined') {
      const cookie = getCookie('abtest_assignments') || '';
      if (cookie) {
        try {
          const obj = JSON.parse(cookie) || {};
          if (obj && typeof obj === 'object') {
            Object.entries(obj ?? {}).forEach(([userId, experiments]) => {
              if (experiments && typeof experiments === 'object') {
                const expMap = new Map<string, string>();
                Object.entries((experiments as Record<string, string>) ?? {}).forEach(([expId, variantId]) => {
                  expMap.set(expId ?? '', variantId ?? '');
                });
                this.userAssignments.set(userId ?? '', expMap);
              }
            });
          }
        } catch {}
      }
    }
  }

  static getInstance(): ABTestManager {
    if (!ABTestManager.instance) {
      ABTestManager.instance = new ABTestManager();
    }
    return ABTestManager.instance;
  }

  // Get user's variant for a specific experiment
  getUserVariant(userId: string, experimentId: string): string | null {
    const experiment = abTestExperiments[experimentId];
    if (!experiment || !experiment.isActive) {
      return null;
    }

    // Check if user already has assignment
    const userExperiments = this.userAssignments.get(userId);
    if (userExperiments?.has(experimentId)) {
      return userExperiments.get(experimentId)!;
    }

    // Check traffic allocation
    if (Math.random() * 100 > experiment.trafficAllocation) {
      return null; // User not in experiment
    }

    // Assign variant based on weights
    const variantId = this.assignVariant(userId, experiment);

    // Store assignment
    if (!this.userAssignments.has(userId)) {
      this.userAssignments.set(userId, new Map());
    }
    this.userAssignments.get(userId)!.set(experimentId, variantId);

    // Track assignment (you'd send this to your analytics)
    this.trackAssignment(userId, experimentId, variantId);

    return variantId;
  }

  private assignVariant(userId: string, experiment: ABTestExperiment): string {
    // Deterministic assignment based on user ID
    const hash = this.hashUserId(userId + experiment.id);
    const totalWeight = experiment.variants.reduce((sum, v) => sum + v.weight, 0);
    const targetWeight = (hash % totalWeight);

    let currentWeight = 0;
    for (const variant of experiment.variants) {
      currentWeight += variant.weight;
      if (targetWeight < currentWeight) {
        return variant.id;
      }
    }

    return experiment.variants[0]?.id || 'default'; // Fallback
  }

  private hashUserId(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  // Get variant configuration
  getVariantConfig(experimentId: string, variantId: string): any {
    const experiment = abTestExperiments[experimentId];
    if (!experiment) return null;

    const variant = experiment.variants.find(v => v.id === variantId);
    return variant?.config || null;
  }

  // Track assignment for analytics
  private trackAssignment(userId: string, experimentId: string, variantId: string): void {
    // In production, send to your analytics platform
    console.log('A/B Test Assignment:', {
      userId,
      experimentId,
      variantId,
      timestamp: new Date().toISOString()
    });

    // Example: Send to Google Analytics, Mixpanel, etc.
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'ab_test_assignment', {
        experiment_id: experimentId,
        variant_id: variantId,
        user_id: userId
      });
    }
  }

  // Track conversion events
  trackConversion(userId: string, experimentId: string, conversionType: string, value?: number): void {
    const variantId = this.userAssignments.get(userId)?.get(experimentId);
    if (!variantId) return;

    console.log('A/B Test Conversion:', {
      userId,
      experimentId,
      variantId,
      conversionType,
      value,
      timestamp: new Date().toISOString()
    });

    // Send to analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'ab_test_conversion', {
        experiment_id: experimentId,
        variant_id: variantId,
        conversion_type: conversionType,
        value: value || 0
      });
    }
  }

  // Get all active experiments for a page
  getActiveExperiments(pageType: string): ABTestExperiment[] {
    return Object.values(abTestExperiments).filter(
      exp => exp.isActive && (!exp.targetPage || exp.targetPage === pageType)
    );
  }

  // Force assign user to specific variant (for testing)
  forceAssign(userId: string, experimentId: string, variantId: string): void {
    if (!this.userAssignments.has(userId)) {
      this.userAssignments.set(userId, new Map());
    }
    this.userAssignments.get(userId)!.set(experimentId, variantId);
    // Persist to cookie
    const obj: Record<string, Record<string, string>> = {};
    const assignments: Map<string, Map<string, string>> = this.userAssignments instanceof Map ? this.userAssignments : new Map();
    assignments.forEach((expMap, uid) => {
      const safeUid = uid ?? '';
      obj[safeUid] = {};
      if (expMap instanceof Map) {
        expMap.forEach((variant, expId) => {
          const safeExpId = expId ?? '';
          const safeVariant = variant ?? '';
          if (obj[safeUid]) {
        obj[safeUid][safeExpId] = safeVariant;
      }
        });
      }
    });
    setCookie('abtest_assignments', JSON.stringify(obj));
  }
}

// Utility functions for React components
export function useABTest(experimentId: string, userId: string) {
  const manager = ABTestManager.getInstance();
  const variantId = manager.getUserVariant(userId, experimentId);
  const config = variantId ? manager.getVariantConfig(experimentId, variantId) : null;

  return {
    variantId,
    config,
    isInExperiment: variantId !== null,
    trackConversion: (conversionType: string, value?: number) => {
      manager.trackConversion(userId, experimentId, conversionType, value);
    }
  };
}

// Generate user ID (in production, use your auth system)
export function generateUserId(): string {
  if (typeof window !== 'undefined') {
    let userId = localStorage.getItem('stx_user_id');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('stx_user_id', userId);
    }
    return userId;
  }
  return 'user_' + Math.random().toString(36).substr(2, 9);
}
