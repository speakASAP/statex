'use client';

import { useMemo } from 'react';
import { ABTestManager } from '@/config/abTestConfig';

// Full AB testing hook with proper functionality
export function useABTest(experimentId: string, userId: string) {
  return useMemo(() => {
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
  }, [experimentId, userId]);
}
