'use client';

import { createContext, useContext, ReactNode } from 'react';
import { designSystem } from '@/lib/design-system';

interface DesignSystemContextType {
  fluidTypography: typeof designSystem.fluidTypography;
  modularScale: typeof designSystem.modularScale;
  fluidSpacing: typeof designSystem.fluidSpacing;
  generateColorScale: typeof designSystem.generateColorScale;
}

const DesignSystemContext = createContext<DesignSystemContextType | undefined>(undefined);

export function DesignSystemProvider({ children }: { children: ReactNode }) {
  const value = {
    fluidTypography: designSystem.fluidTypography,
    modularScale: designSystem.modularScale,
    fluidSpacing: designSystem.fluidSpacing,
    generateColorScale: designSystem.generateColorScale,
  };

  return (
    <DesignSystemContext.Provider value={value}>
      {children}
    </DesignSystemContext.Provider>
  );
}

export function useDesignSystem() {
  const context = useContext(DesignSystemContext);
  if (context === undefined) {
    throw new Error('useDesignSystem must be used within a DesignSystemProvider');
  }
  return context;
}
