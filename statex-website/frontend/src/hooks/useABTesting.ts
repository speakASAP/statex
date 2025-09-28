// React Hooks for A/B Testing Integration
// Provides easy-to-use hooks for components

import { useState, useEffect, useCallback } from 'react';
import { ABTestManager, generateUserId } from '@/config/abTestConfig';

export interface ABTestResult {
  variantId: string | null;
  config: any;
  isInExperiment: boolean;
  isLoading: boolean;
  trackConversion: (conversionType: string, value?: number) => void;
  trackEvent: (eventType: string, properties?: Record<string, any>) => void;
}

// Main hook for A/B testing
export function useABTest(experimentId: string, userId?: string): ABTestResult {
  const [variantId, setVariantId] = useState<string | null>(null);
  const [config, setConfig] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>('');

  const manager = ABTestManager.getInstance();

  // Initialize user ID and variant assignment
  useEffect(() => {
    const id = userId || generateUserId();
    setCurrentUserId(id);

    try {
      const assignedVariant = manager.getUserVariant(id, experimentId);
      setVariantId(assignedVariant);

      if (assignedVariant) {
        const variantConfig = manager.getVariantConfig(experimentId, assignedVariant);
        setConfig(variantConfig);
      }
    } catch (error) {
      console.error('Error in A/B test assignment:', error);
    } finally {
      setIsLoading(false);
    }
  }, [experimentId, userId, manager]);

  // Track conversion events
  const trackConversion = useCallback((conversionType: string, value?: number) => {
    if (currentUserId && variantId) {
      manager.trackConversion(currentUserId, experimentId, conversionType, value);
    }
  }, [currentUserId, variantId, experimentId, manager]);

  // Track custom events
  const trackEvent = useCallback((eventType: string, properties?: Record<string, any>) => {
    if (currentUserId && variantId) {
      console.log('A/B Test Event:', {
        userId: currentUserId,
        experimentId,
        variantId,
        eventType,
        properties,
        timestamp: new Date().toISOString()
      });

      // Send to analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'ab_test_event', {
          experiment_id: experimentId,
          variant_id: variantId,
          event_type: eventType,
          ...properties
        });
      }
    }
  }, [currentUserId, variantId, experimentId]);

  return {
    variantId,
    config,
    isInExperiment: variantId !== null,
    isLoading,
    trackConversion,
    trackEvent
  };
}

// Hook for multiple experiments at once
export function useMultipleABTests(experiments: string[], userId?: string): Record<string, ABTestResult> {
  const [results, setResults] = useState<Record<string, ABTestResult>>({});

  useEffect(() => {
    const id = userId || generateUserId();
    const manager = ABTestManager.getInstance();
    const experimentResults: Record<string, ABTestResult> = {};

    experiments.forEach(experimentId => {
      try {
        const variantId = manager.getUserVariant(id, experimentId);
        const config = variantId ? manager.getVariantConfig(experimentId, variantId) : null;

        experimentResults[experimentId] = {
          variantId,
          config,
          isInExperiment: variantId !== null,
          isLoading: false,
          trackConversion: (conversionType: string, value?: number) => {
            manager.trackConversion(id, experimentId, conversionType, value);
          },
          trackEvent: (eventType: string, properties?: Record<string, any>) => {
            console.log('A/B Test Event:', {
              userId: id,
              experimentId,
              variantId,
              eventType,
              properties,
              timestamp: new Date().toISOString()
            });
          }
        };
      } catch (error) {
        console.error(`Error in A/B test assignment for ${experimentId}:`, error);
        experimentResults[experimentId] = {
          variantId: null,
          config: null,
          isInExperiment: false,
          isLoading: false,
          trackConversion: () => {},
          trackEvent: () => {}
        };
      }
    });

    setResults(experimentResults);
  }, [experiments, userId]);

  return results;
}

// Hook for page-level A/B testing
export function usePageABTests(pageType: string, userId?: string) {
  const [experiments, setExperiments] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get all active experiments for this page
  useEffect(() => {
    const manager = ABTestManager.getInstance();
    const activeExperiments = manager.getActiveExperiments(pageType);
    const experimentIds = activeExperiments.map(exp => exp.id);
    setExperiments(experimentIds);
    setIsLoading(false);
  }, [pageType]);

  const results = useMultipleABTests(experiments, userId);

  return {
    experiments: results,
    isLoading: isLoading || Object.values(results).some(r => r.isLoading),
    trackPageView: () => {
      Object.entries(results).forEach(([_experimentId, result]) => {
        if (result.isInExperiment) {
          result.trackEvent('page_view', { pageType });
        }
      });
    }
  };
}

// Hook for component-level conversion tracking
export function useConversionTracking(experimentIds: string[], userId?: string) {
  const results = useMultipleABTests(experimentIds, userId);

  const trackConversion = useCallback((conversionType: string, value?: number, experimentId?: string) => {
    if (experimentId) {
      // Track for specific experiment
      results[experimentId]?.trackConversion(conversionType, value);
    } else {
      // Track for all experiments
      Object.values(results).forEach(result => {
        if (result.isInExperiment) {
          result.trackConversion(conversionType, value);
        }
      });
    }
  }, [results]);

  const trackEvent = useCallback((eventType: string, properties?: Record<string, any>, experimentId?: string) => {
    if (experimentId) {
      // Track for specific experiment
      results[experimentId]?.trackEvent(eventType, properties);
    } else {
      // Track for all experiments
      Object.values(results).forEach(result => {
        if (result.isInExperiment) {
          result.trackEvent(eventType, properties);
        }
      });
    }
  }, [results]);

  return {
    trackConversion,
    trackEvent,
    experiments: results,
    isInAnyExperiment: Object.values(results).some(r => r.isInExperiment)
  };
}

// Hook for A/B test debugging (development only)
export function useABTestDebug() {
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const manager = ABTestManager.getInstance();
    const userId = generateUserId();

    // Get all active experiments
    const allExperiments = Object.values(manager.getActiveExperiments('homepage'));

    const info = allExperiments.map(exp => {
      const variantId = manager.getUserVariant(userId, exp.id);
      const config = variantId ? manager.getVariantConfig(exp.id, variantId) : null;

      return {
        experimentId: exp.id,
        experimentName: exp.name,
        variantId,
        config,
        isInExperiment: variantId !== null
      };
    });

    setDebugInfo({ userId, experiments: info });
  }, []);

  return debugInfo;
}

// Utility function to force a specific variant (testing only)
export function useForceVariant() {
  const forceVariant = useCallback((experimentId: string, variantId: string) => {
    if (process.env.NODE_ENV !== 'development') {
      console.warn('forceVariant should only be used in development');
      return;
    }

    const manager = ABTestManager.getInstance();
    const userId = generateUserId();
    manager.forceAssign(userId, experimentId, variantId);

    // Reload to see changes
    window.location.reload();
  }, []);

  return { forceVariant };
}
