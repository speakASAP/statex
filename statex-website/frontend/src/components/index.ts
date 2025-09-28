// Centralized exports for all refactored components
// Optimized for tree-shaking and clean imports

// Atom Components
export { Button } from './atoms/Button';
export { Text } from './atoms/Text';
export { Container } from './atoms/Container';
export {
  Card,
  ValuesCard,
  TeamCard,
  CultureCard,
  TestimonialCard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from './atoms/Card';

// Section Components
export { HeroSection } from './sections/HeroSection';
export { FeaturesSection } from './sections/FeaturesSection';
export { HowItWorksSection } from './sections/HowItWorksSection';
export { ProcessSection } from './sections/ProcessSection';
export { TestimonialsSection } from './sections/TestimonialsSection';
export { CTASection } from './sections/CTASection';
export { SolutionCTASection } from './sections/SolutionCTASection';
export { FormSection } from './sections/FormSection';
export { LegalSection } from './sections/LegalSection';

// Form Components
export { ProcessingFeedback } from './forms/ProcessingFeedback';

// Configuration & Utils
export { pageConfigs } from '../config/componentConfigs';
export { ClassComposer, OptimizedClassComposer } from '../lib/classComposition';
export { PerformanceMonitor, BundleOptimizer, MemoryOptimizer } from '../lib/performance';
