import { useState, useCallback, useMemo } from 'react';
import { TemplateBuilder } from './TemplateBuilder';
import { TemplateBuilderOptions, BuiltTemplate } from './TemplateConfig';
import { TemplateSection } from '../sections/types';

interface UseTemplateBuilderOptions extends TemplateBuilderOptions {
  autoBuild?: boolean;
  validateOnBuild?: boolean;
}

// NOTE: This is NOT the main useTemplateBuilder hook. Use @/hooks/useTemplateBuilder for template composition.
export function useTemplateBuilderState(options: UseTemplateBuilderOptions = {}) {
  const [builder, setBuilder] = useState(() => new TemplateBuilder(options));
  const [builtTemplate, setBuiltTemplate] = useState<BuiltTemplate | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isBuilding, setIsBuilding] = useState(false);

  const {
    autoBuild = false,
    validateOnBuild = true,
    ...builderOptions
  } = options;

  // Update builder options
  const updateBuilderOptions = useCallback((newOptions: Partial<TemplateBuilderOptions>) => {
    setBuilder(prev => {
      const newBuilder = new TemplateBuilder({ ...builderOptions, ...newOptions });
      // Copy current configuration
      if (prev) {
        // This would need to be implemented in TemplateBuilder
        // For now, we'll create a new builder
      }
      return newBuilder;
    });
  }, [builderOptions]);

  // Build template
  const build = useCallback(async () => {
    setIsBuilding(true);
    setErrors([]);

    try {
      const template = builder.build();
      setBuiltTemplate(template);

      if (validateOnBuild) {
        // Additional validation can be added here
        console.log('Template built successfully:', template.metadata);
      }

      return template;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setErrors([errorMessage]);
      console.error('Template build failed:', error);
      return null;
    } finally {
      setIsBuilding(false);
    }
  }, [builder, validateOnBuild]);

  // Convenience methods for common operations
  const withId = useCallback((id: string) => {
    builder.withId(id);
    if (autoBuild) build();
  }, [builder, autoBuild, build]);

  const withName = useCallback((name: string) => {
    builder.withName(name);
    if (autoBuild) build();
  }, [builder, autoBuild, build]);

  const withLayout = useCallback((layout: 'default' | 'hero' | 'content' | 'dashboard') => {
    builder.withLayout(layout);
    if (autoBuild) build();
  }, [builder, autoBuild, build]);

  const withSections = useCallback((sections: TemplateSection[]) => {
    builder.withSections(sections);
    if (autoBuild) build();
  }, [builder, autoBuild, build]);

  const withSection = useCallback((section: TemplateSection) => {
    builder.withSection(section);
    if (autoBuild) build();
  }, [builder, autoBuild, build]);

  const withSEO = useCallback((seo: any) => {
    builder.withSEO(seo);
    if (autoBuild) build();
  }, [builder, autoBuild, build]);

  const withMarket = useCallback((market: 'EU' | 'UAE') => {
    builder.withMarket(market);
    if (autoBuild) build();
  }, [builder, autoBuild, build]);

  const withAIEnabled = useCallback((enabled: boolean = true) => {
    builder.withAIEnabled(enabled);
    if (autoBuild) build();
  }, [builder, autoBuild, build]);

  const withABTest = useCallback((experimentId: string, variant: string) => {
    builder.withABTest(experimentId, variant);
    if (autoBuild) build();
  }, [builder, autoBuild, build]);

  // Factory methods
  const createServicePage = useCallback((serviceData: any) => {
    const serviceBuilder = TemplateBuilder.createServicePage(serviceData);
    setBuilder(serviceBuilder);
    if (autoBuild) {
      const template = serviceBuilder.build();
      setBuiltTemplate(template);
    }
  }, [autoBuild]);

  const createHomePage = useCallback(() => {
    const homeBuilder = TemplateBuilder.createHomePage();
    setBuilder(homeBuilder);
    if (autoBuild) {
      const template = homeBuilder.build();
      setBuiltTemplate(template);
    }
  }, [autoBuild]);

  const createContentPage = useCallback(() => {
    const contentBuilder = TemplateBuilder.createContentPage();
    setBuilder(contentBuilder);
    if (autoBuild) {
      const template = contentBuilder.build();
      setBuiltTemplate(template);
    }
  }, [autoBuild]);

  // Reset builder
  const reset = useCallback(() => {
    setBuilder(new TemplateBuilder(options));
    setBuiltTemplate(null);
    setErrors([]);
  }, [options]);

  // Memoized values
  const templateMetadata = useMemo(() => {
    return builtTemplate?.metadata || null;
  }, [builtTemplate]);

  const isTemplateValid = useMemo(() => {
    return errors.length === 0 && builtTemplate !== null;
  }, [errors, builtTemplate]);

  const performanceScore = useMemo(() => {
    return builtTemplate?.metadata.performanceScore || 0;
  }, [builtTemplate]);

  return {
    // State
    builtTemplate,
    errors,
    isBuilding,
    isTemplateValid,
    performanceScore,
    templateMetadata,

    // Builder methods
    builder,
    build,
    reset,

    // Convenience methods
    withId,
    withName,
    withLayout,
    withSections,
    withSection,
    withSEO,
    withMarket,
    withAIEnabled,
    withABTest,

    // Factory methods
    createServicePage,
    createHomePage,
    createContentPage,

    // Options
    updateBuilderOptions
  };
}
