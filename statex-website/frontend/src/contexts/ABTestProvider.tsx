'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ABTestContextType {
  getVariant: (experimentName: string, variantOptions: string[]) => string;
  setVariant: (experimentName: string, variant: string) => void;
  isClient: boolean;
}

const ABTestContext = createContext<ABTestContextType | undefined>(undefined);

interface ABTestProviderProps {
  children: ReactNode;
}

export function ABTestProvider({ children }: ABTestProviderProps) {
  const [variants, setVariants] = useState<Record<string, string>>({});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Load stored variants from localStorage
    try {
      const stored = localStorage.getItem('ab-test-variants');
      if (stored) {
        setVariants(JSON.parse(stored));
      }
    } catch (error) {
      console.warn('Failed to load AB test variants from localStorage:', error);
    }
  }, []);

  const getVariant = (experimentName: string, variantOptions: string[]): string => {
    if (!isClient) {
      // During SSR, return the first variant
      return variantOptions[0] || 'default';
    }

    // Check if we already have a variant for this experiment
    if (variants[experimentName]) {
      return variants[experimentName];
    }

    // Generate a random variant
    const randomVariant = variantOptions[Math.floor(Math.random() * variantOptions.length)] || 'default';

    // Store the variant
    setVariant(experimentName, randomVariant);

    return randomVariant;
  };

  const setVariant = (experimentName: string, variant: string) => {
    if (!isClient) return;

    const newVariants = { ...variants, [experimentName]: variant };
    setVariants(newVariants);

    try {
      localStorage.setItem('ab-test-variants', JSON.stringify(newVariants));
    } catch (error) {
      console.warn('Failed to store AB test variant:', error);
    }
  };

  const value: ABTestContextType = {
    getVariant,
    setVariant,
    isClient
  };

  return (
    <ABTestContext.Provider value={value}>
      {children}
    </ABTestContext.Provider>
  );
}

export function useABTestContext() {
  const context = useContext(ABTestContext);
  if (context === undefined) {
    throw new Error('useABTestContext must be used within an ABTestProvider');
  }
  return context;
}
