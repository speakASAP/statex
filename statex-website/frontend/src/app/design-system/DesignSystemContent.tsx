'use client';

import { useTemplateBuilder } from '@/hooks/useTemplateBuilder';
import { TemplateRenderer } from '@/components/templates/TemplateRenderer';

export default function DesignSystemContent() {
  const template = useTemplateBuilder()
    .addSection('hero', 'default', {
      title: 'Statex Design System',
      subtitle: 'Interactive demo showcasing our design system with themes, variants, and components',
      icon: '🎨',
      layout: 'default'
    })
    .addSection('features', 'cards', {
      title: 'Theme System',
      subtitle: 'Multiple themes for different markets and preferences',
      features: [
        {
          icon: '☀️',
          title: 'Light Theme',
          description: 'Clean and modern light theme for general use'
        },
        {
          icon: '🌙',
          title: 'Dark Theme',
          description: 'Easy on the eyes dark theme for better contrast'
        },
        {
          icon: '🇪🇺',
          title: 'EU Theme',
          description: 'European market optimized theme with local colors'
        },
        {
          icon: '🇦🇪',
          title: 'UAE Theme',
          description: 'Middle Eastern market theme with cultural elements'
        }
      ]
    })
    .addSection('features', 'grid', {
      title: 'Frontend Variants',
      subtitle: 'Different design approaches for various use cases',
      features: [
        {
          icon: '🔥',
          title: 'Modern',
          description: 'Contemporary design with bold colors and effects'
        },
        {
          icon: '📐',
          title: 'Classic',
          description: 'Traditional design with refined typography'
        },
        {
          icon: '✨',
          title: 'Minimal',
          description: 'Clean and simple design focusing on content'
        },
        {
          icon: '🏢',
          title: 'Corporate',
          description: 'Professional design for business applications'
        }
      ]
    })
    .addSection('features', 'list', {
      title: 'Component Library',
      subtitle: 'Comprehensive collection of reusable UI components',
      features: [
        {
          icon: '🔘',
          title: 'Buttons',
          description: 'Multiple button variants with different styles and sizes'
        },
        {
          icon: '🃏',
          title: 'Cards',
          description: 'Flexible card components for content display'
        },
        {
          icon: '📝',
          title: 'Input Fields',
          description: 'Form inputs with validation and state management'
        },
        {
          icon: '🎨',
          title: 'Color Palette',
          description: 'Consistent color system across all components'
        }
      ]
    })
    .addSection('features', 'cards', {
      title: 'Typography System',
      subtitle: 'Hierarchical typography for consistent text styling',
      features: [
        {
          icon: '📖',
          title: 'Headings',
          description: 'H1-H6 hierarchy with consistent spacing and weights'
        },
        {
          icon: '📝',
          title: 'Body Text',
          description: 'Readable body text with optimal line height and spacing'
        },
        {
          icon: '🔤',
          title: 'Font Families',
          description: 'Carefully selected fonts for different use cases'
        },
        {
          icon: '📏',
          title: 'Scale System',
          description: 'Consistent typography scale across all components'
        }
      ]
    })
    .addSection('features', 'grid', {
      title: 'Responsive Design',
      subtitle: 'Mobile-first approach with breakpoint system',
      features: [
        {
          icon: '📱',
          title: 'Mobile First',
          description: 'Design starts from mobile and scales up'
        },
        {
          icon: '💻',
          title: 'Tablet',
          description: 'Optimized layouts for tablet devices'
        },
        {
          icon: '🖥️',
          title: 'Desktop',
          description: 'Full-featured desktop experience'
        },
        {
          icon: '📺',
          title: 'Large Screens',
          description: 'Enhanced layouts for large displays'
        }
      ]
    })
    .addSection('features', 'list', {
      title: 'Accessibility',
      subtitle: 'WCAG 2.1 AA compliance and inclusive design',
      features: [
        {
          icon: '♿',
          title: 'Screen Readers',
          description: 'Full support for screen reader technology'
        },
        {
          icon: '⌨️',
          title: 'Keyboard Navigation',
          description: 'Complete keyboard accessibility'
        },
        {
          icon: '🎨',
          title: 'Color Contrast',
          description: 'High contrast ratios for readability'
        },
        {
          icon: '🔊',
          title: 'Audio Support',
          description: 'Audio cues and alternative content'
        }
      ]
    })
    .addSection('features', 'cards', {
      title: 'Performance',
      subtitle: 'Optimized for speed and user experience',
      features: [
        {
          icon: '⚡',
          title: 'Fast Loading',
          description: 'Optimized bundle sizes and lazy loading'
        },
        {
          icon: '🔄',
          title: 'Caching',
          description: 'Efficient caching strategies'
        },
        {
          icon: '📦',
          title: 'Code Splitting',
          description: 'Automatic code splitting for better performance'
        },
        {
          icon: '🎯',
          title: 'Bundle Analysis',
          description: 'Tools for monitoring bundle performance'
        }
      ]
    })
    .build();

  return <TemplateRenderer template={template} />;
}
