'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Variant = 'modern' | 'classic' | 'minimal' | 'corporate';

interface VariantContextType {
  variant: Variant;
  setVariant: (variant: Variant) => void;
  toggleVariant: () => void;
  resetVariant: () => void;
  variants: Variant[];
  isVariantActive: (variant: Variant) => boolean;
}

const VariantContext = createContext<VariantContextType | undefined>(undefined);

export function VariantProvider({ children }: { children: React.ReactNode }) {
  const [variant, setVariantState] = useState<Variant>('modern');

  useEffect(() => {
    // Load variant from localStorage on mount
    const savedVariant = localStorage.getItem('statex-variant') as Variant;
    if (savedVariant && ['modern', 'classic', 'minimal', 'corporate'].includes(savedVariant)) {
      setVariantState(savedVariant);
    } else {
      setVariantState('modern');
    }
  }, []);

  useEffect(() => {
    // Update data-variant attribute and localStorage when variant changes
    document.documentElement.setAttribute('data-variant', variant);
    localStorage.setItem('statex-variant', variant);
  }, [variant]);

  const setVariant = (newVariant: Variant) => {
    setVariantState(newVariant);
  };

  const variants: Variant[] = ['modern', 'classic', 'minimal', 'corporate'];

  const toggleVariant = () => {
    const currentIndex = variants.indexOf(variant);
    const nextIndex = (currentIndex + 1) % variants.length;
    setVariantState(variants[nextIndex]!);
  };

  const resetVariant = () => {
    setVariantState('modern');
  };

  const isVariantActive = (checkVariant: Variant) => {
    return variant === checkVariant;
  };

  return (
    <VariantContext.Provider value={{
      variant,
      setVariant,
      toggleVariant,
      resetVariant,
      variants,
      isVariantActive
    }}>
      {children}
    </VariantContext.Provider>
  );
}

export function useVariant() {
  const context = useContext(VariantContext);
  if (context === undefined) {
    throw new Error('useVariant must be used within a VariantProvider');
  }
  return context;
}
