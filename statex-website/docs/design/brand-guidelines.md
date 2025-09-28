# Statex Brand Guidelines & Design System

## Overview

## 🔗 Related Documentation

- [Design Concept](design-concept.md) - Visual design specifications
- [Development Plan](../../development-plan.md) - Complete project plan
- [Terms of Reference](../business/terms-of-reference.md) - Business requirements
- **[A/B Testing Guide](../development/ab-testing-guide.md)** - A/B testing implementation for design variants
- [Frontend Architecture](../development/frontend.md) - Technical implementation of design system
- [Testing Guidelines](../development/testing-guidelines.md) - Testing design system components

## 🎨 Visual Identity

Statex is a premium AI-powered software development company specializing in rapid prototype creation and digital transformation for European and Middle Eastern markets. Our brand represents innovation, reliability, and cutting-edge technology solutions.

## Brand Identity

### Core Values
- **Innovation**: Leading-edge AI technology and creative solutions
- **Reliability**: Trusted partner for critical business transformations
- **Speed**: 24-48 hour prototype delivery
- **Quality**: Enterprise-grade solutions with attention to detail
- **Global Reach**: European and Middle Eastern market expertise

### Brand Personality
- **Professional**: Business-focused and trustworthy
- **Innovative**: Forward-thinking and technologically advanced
- **Accessible**: Approachable despite technical complexity
- **Confident**: Assured in our capabilities and expertise
- **Multicultural**: Embracing diverse European and Middle Eastern cultures

## Visual Identity

### Color Palette

#### Primary Colors
- **Primary Blue**: `#0066CC` - Trust, professionalism, technology
- **Accent Green**: `#F59E0B` - Growth, innovation, success
- **Primary Blue Light**: `#3B82F6` - Interactive elements
- **Primary Blue Dark**: `#1E3A8A` - Hover states, emphasis

#### Neutral Colors
- **Gray 50**: `#F9FAFB` - Background surfaces
- **Gray 100**: `#F3F4F6` - Secondary backgrounds
- **Gray 200**: `#E5E7EB` - Borders, dividers
- **Gray 300**: `#D1D5DB` - Disabled states
- **Gray 400**: `#9CA3AF` - Placeholder text
- **Gray 500**: `#6B7280` - Secondary text
- **Gray 600**: `#4B5563` - Body text
- **Gray 700**: `#374151` - Headings
- **Gray 800**: `#1F2937` - Primary text
- **Gray 900**: `#111827` - Strong emphasis

#### Semantic Colors
- **Success**: `#10B981` - Positive actions, confirmations
- **Warning**: `#F59E0B` - Caution, attention needed
- **Error**: `#EF4444` - Errors, destructive actions
- **Info**: `#3B82F6` - Information, neutral actions

### Typography

#### Font Family
- **Primary**: Inter - Modern, clean, highly readable
- **Monospace**: JetBrains Mono - Code examples, technical content

#### Font Weights
- **Light**: 300 - Subtle emphasis
- **Regular**: 400 - Body text
- **Medium**: 500 - Labels, buttons
- **Semibold**: 600 - Subheadings
- **Bold**: 700 - Headings, strong emphasis

#### Font Sizes
- **XS**: 0.75rem (12px) - Captions, small labels
- **SM**: 0.875rem (14px) - Small text, labels
- **Base**: 1rem (16px) - Body text
- **LG**: 1.125rem (18px) - Large body text
- **XL**: 1.25rem (20px) - Subheadings
- **2XL**: 1.5rem (24px) - Section headings
- **3XL**: 1.875rem (30px) - Page headings
- **4XL**: 2.25rem (36px) - Hero headings
- **5XL**: 3rem (48px) - Large hero headings
- **6XL**: 3.75rem (60px) - Extra large headings

#### Line Heights
- **Tight**: 1.25 - Headings
- **Normal**: 1.5 - Body text
- **Relaxed**: 1.75 - Large body text

### Spacing System

#### Base Unit: 4px
- **XS**: 0.25rem (4px) - Minimal spacing
- **SM**: 0.5rem (8px) - Small spacing
- **MD**: 1rem (16px) - Standard spacing
- **LG**: 1.5rem (24px) - Large spacing
- **XL**: 2rem (32px) - Extra large spacing
- **2XL**: 3rem (48px) - Section spacing
- **3XL**: 4rem (64px) - Large section spacing
- **4XL**: 6rem (96px) - Hero spacing

## 🧪 A/B Testing Design Support

The Statex design system is built to support A/B testing with consistent design variations across all components and sections.

### A/B Testing Design Principles

#### **Design Consistency Across Variants**
- All A/B test variants maintain brand consistency
- Visual hierarchy remains clear in all variations
- Typography scale and color palette stay consistent
- Component behavior follows established patterns

#### **Hero Section Variants**
The design system supports three distinct hero approaches:

**Classic Hero Design**
- Professional, trust-focused layout
- Balanced composition with prototype interface
- Primary blue (#0066CC) dominant color scheme
- Clean typography with clear hierarchy

**Benefit-Focused Hero Design**
- Outcome-oriented visual presentation
- Trust badges prominently displayed
- Accent green (#F59E0B) highlights for benefits
- Speed and efficiency visual metaphors

**Urgency Hero Design**
- High-contrast, attention-grabbing elements
- Scarcity indicators with countdown styling
- Warning colors (#F59E0B) for urgency messaging
- Simplified layout without prototype interface

#### **Layout Variants**
Design adapts to different section orderings:

**Standard Layout**
- Traditional funnel progression design
- Gradual trust-building visual flow
- Consistent section spacing and typography
- Progressive disclosure of information

**Conversion-Optimized Layout**
- Social proof prominent positioning
- Multiple conversion point design
- Testimonials get hero-level visual treatment
- CTA sections with enhanced visibility

### Design Token Support for A/B Testing

#### **Component-Specific Variables**
```css
/* Hero Variants */
--stx-hero-classic-bg: var(--stx-color-primary-50);
--stx-hero-benefit-focused-bg: var(--stx-color-success-50);
--stx-hero-urgency-bg: var(--stx-color-warning-50);

/* CTA Variants */
--stx-cta-primary-bg: var(--stx-color-primary-600);
--stx-cta-urgency-bg: var(--stx-color-warning-600);
--stx-cta-benefit-bg: var(--stx-color-success-600);

/* Typography Variants */
--stx-hero-classic-text-size: var(--stx-text-4xl);
--stx-hero-urgency-text-size: var(--stx-text-5xl);
--stx-hero-benefit-text-size: var(--stx-text-4xl);
```

#### **Theme Compatibility**
All A/B test variants work seamlessly across themes:
- **Light Theme**: Full variant support with optimal contrast
- **Dark Theme**: All variants adapt to dark mode color scheme
- **EU Theme**: European market-specific design adjustments
- **UAE Theme**: Middle Eastern market visual preferences

### Visual Hierarchy in A/B Tests

#### **Primary Visual Elements**
1. **Hero Headlines**: Consistent typography scale across variants
2. **CTA Buttons**: Variant-specific styling while maintaining usability
3. **Trust Indicators**: Flexible positioning and styling
4. **Social Proof**: Adaptable design for different layout positions

#### **Secondary Visual Elements**
1. **Navigation**: Consistent across all variants
2. **Footer**: Unchanged to maintain brand consistency
3. **Form Elements**: Standard styling regardless of page variant
4. **Typography**: Consistent scale and hierarchy

### Accessibility in A/B Testing

#### **WCAG 2.1 AA Compliance**
- All variants maintain minimum contrast ratios
- Focus indicators consistent across variants
- Screen reader compatibility in all variations
- Keyboard navigation preserved

#### **Color Accessibility**
- Semantic color usage consistent across variants
- Warning/urgency colors meet accessibility standards
- Alternative text and ARIA labels maintained
- High contrast mode support for all variants

### Performance Considerations

#### **Design Asset Optimization**
- Shared assets across variants to minimize bundle size
- Critical CSS inlined for above-the-fold variants
- Lazy loading for variant-specific images
- WebP/AVIF format support for all variant assets

#### **Animation Performance**
- Reduced motion preferences respected
- Hardware acceleration for smooth transitions
- Consistent animation timing across variants
- Performance budget maintained (<100ms render time)

### A/B Testing Design Guidelines

#### **Creating New Variants**
1. **Maintain Brand Consistency**: Always use established color palette and typography
2. **Test Single Variables**: Change one major design element per variant
3. **Consider Mobile First**: Ensure all variants work on mobile devices
4. **Accessibility First**: Verify WCAG compliance for new variants
5. **Performance Budget**: Keep design changes within performance constraints

#### **Design Documentation for A/B Tests**
- Document variant-specific design tokens
- Maintain Figma files for each variant
- Create mobile-responsive specifications
- Include accessibility annotations
- Define interaction states for all variants

## 🔗 A/B Testing Resources

### Implementation Documentation
- **[A/B Testing Guide](../development/ab-testing-guide.md)** - Complete implementation guide
- **[Testing Guidelines](../development/testing-guidelines.md)** - Testing design system with A/B variants
- **[Frontend Architecture](../development/frontend.md)** - Technical implementation details

### Design Tools
- **Figma Components**: All A/B test variants available in design system
- **Design Tokens**: CSS variables for all variant-specific styling
- **Accessibility Testing**: WAVE, axe tools for variant validation
- **Performance Testing**: Core Web Vitals monitoring for design changes

The design system's A/B testing support ensures that all variants maintain the Statex brand identity while allowing for optimization through data-driven design decisions.

## 🔗 Quick Navigation for Designers

### **Design System Documentation**
1. **[Design System Summary](design-system-summary.md)** - Component library overview and usage patterns
2. **[Component Library](component-library-documentation.md)** - Complete design component documentation
3. **[SEO A/B System](seo-ab-testing-system.md)** - Design considerations for SEO-compliant A/B testing
4. **[A/B Testing Guide](../development/ab-testing-guide.md)** - How design variants are implemented and tested

### **Design for A/B Testing**
- **Hero Variants**: 3 distinct design approaches maintaining brand consistency
- **Layout Variants**: Flexible section ordering with consistent visual hierarchy
- **Design Tokens**: All variants use centralized design tokens for consistency
- **Theme Support**: All A/B test variants work across Light, Dark, EU, and UAE themes

### **Design Tools & Resources**
- **Figma Components**: All A/B test variants available in design system
- **Design Tokens**: CSS variables for variant-specific styling
- **Accessibility Testing**: WAVE, axe tools for variant validation
- **Performance**: Design changes maintain <100ms render time budget

### **Implementation Standards**
- **Brand Consistency**: All variants maintain Statex visual identity
- **Accessibility**: WCAG 2.1 AA compliance across all design variants  
- **Performance**: Design optimizations for Core Web Vitals
- **Mobile-First**: All A/B test variants optimized for mobile experience

### Border Radius
- **SM**: 0.25rem (4px) - Small elements
- **MD**: 0.375rem (6px) - Standard elements
- **LG**: 0.5rem (8px) - Large elements
- **XL**: 0.75rem (12px) - Extra large elements
- **2XL**: 1rem (16px) - Hero elements

### Shadows
- **SM**: `0 1px 2px 0 rgb(0 0 0 / 0.05)` - Subtle elevation
- **MD**: `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)` - Standard elevation
- **LG**: `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)` - High elevation
- **XL**: `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)` - Maximum elevation

## Design System Architecture

### BEM Methodology
We use Block Element Modifier (BEM) methodology for consistent and maintainable CSS:

```css
/* Block */
.stx-button

/* Element */
.stx-button__icon

/* Modifier */
.stx-button--primary
.stx-button--large
```

### STX Prefix
All component classes use the `stx-` prefix to avoid conflicts and maintain brand consistency:

```css
.stx-button
.stx-input
.stx-card
.stx-text
.stx-container
.stx-section
.stx-grid
.stx-stack
.stx-spacing
```

### Component Structure
Each component follows a consistent structure:

```css
/* Base component */
.stx-component {
  /* Base styles */
}

/* Variants */
.stx-component--variant {
  /* Variant styles */
}

/* Sizes */
.stx-component--size {
  /* Size styles */
}

/* Elements */
.stx-component__element {
  /* Element styles */
}

/* States */
.stx-component--state {
  /* State styles */
}
```

## Theme System

### Light Theme (Default)
- Clean, professional appearance
- High contrast for readability
- Subtle shadows and borders
- Optimized for business environments

### Dark Theme
- Modern, sophisticated appearance
- Reduced eye strain in low-light conditions
- Maintained contrast ratios
- Professional alternative option

### EU Theme
- European business aesthetic
- Conservative color usage
- Professional typography
- GDPR-compliant design patterns

### UAE Theme
- Middle Eastern cultural elements
- Warm accent colors
- Luxurious visual treatment
- Arabic language support considerations

## Responsive Design

### Breakpoints
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px - 1279px
- **Large Desktop**: 1280px+

### Mobile-First Approach
- Design starts with mobile experience
- Progressive enhancement for larger screens
- Touch-friendly interaction targets (44px minimum)
- Optimized typography scaling

## Accessibility

### WCAG 2.1 AA Compliance
- **Color Contrast**: Minimum 4.5:1 for normal text
- **Focus Indicators**: Clear, visible focus states
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Semantic HTML and ARIA labels
- **Reduced Motion**: Respect user motion preferences

### Inclusive Design
- **High Contrast Mode**: Enhanced visibility options
- **Large Text**: Scalable typography
- **Multiple Input Methods**: Mouse, keyboard, touch, voice
- **Cultural Considerations**: RTL support, cultural color meanings

## Animation Guidelines

### Motion Principles
- **Purposeful**: Animations serve functional purposes
- **Smooth**: 150-300ms duration for micro-interactions
- **Consistent**: Standardized easing curves
- **Accessible**: Respect reduced motion preferences

### Easing Curves
- **Ease Out**: `cubic-bezier(0.0, 0.0, 0.2, 1)` - Entering elements
- **Ease In**: `cubic-bezier(0.4, 0.0, 1, 1)` - Exiting elements
- **Ease In Out**: `cubic-bezier(0.4, 0.0, 0.2, 1)` - Complex animations

### Animation Types
- **Fade**: Opacity transitions for content changes
- **Slide**: Transform-based movements
- **Scale**: Size changes for interactive feedback
- **Stagger**: Sequential animations for lists/grids

## Content Guidelines

### Voice and Tone
- **Professional**: Expert but approachable
- **Confident**: Assured in our capabilities
- **Clear**: Simple, direct communication
- **Multilingual**: Support for 10+ languages

### Content Hierarchy
- **H1**: Page titles (one per page)
- **H2**: Section headings
- **H3**: Subsection headings
- **H4**: Component headings
- **H5**: Small headings
- **H6**: Micro headings

### Call-to-Action (CTA) Strategy
- **Primary CTA**: "Get Free Prototype" - Main conversion goal
- **Secondary CTA**: "Learn More" - Information seeking
- **Tertiary CTA**: "Contact Us" - Support and consultation

## Implementation Guidelines

### CSS Architecture
- **Design Tokens**: CSS custom properties for consistency
- **Component-Specific CSS**: Each component has its own CSS file
- **Theme Files**: Separate theme files for different contexts
- **Utility Classes**: Minimal utility classes for common patterns

### File Organization
```
src/
├── themes/
│   ├── light.css
│   ├── dark.css
│   ├── eu.css
│   └── uae.css
├── components/
│   ├── atoms/
│   │   ├── Button.css
│   │   ├── Input.css
│   │   └── ...
│   ├── molecules/
│   └── organisms/
└── styles/
    └── design-tokens.css
```

### Naming Conventions
- **Components**: PascalCase (Button, Input, Card)
- **CSS Classes**: kebab-case with stx- prefix (stx-button, stx-input)
- **Files**: kebab-case (button.css, input.css)
- **Variables**: kebab-case (--primary-blue, --space-md)

## Quality Assurance

### Design Review Checklist
- [ ] Follows brand guidelines
- [ ] Uses correct color palette
- [ ] Implements proper typography
- [ ] Maintains consistent spacing
- [ ] Includes responsive behavior
- [ ] Meets accessibility standards
- [ ] Supports theme switching
- [ ] Uses BEM methodology
- [ ] Includes STX prefixing

### Testing Requirements
- **Cross-browser**: Chrome, Firefox, Safari, Edge
- **Cross-device**: Mobile, tablet, desktop
- **Accessibility**: Screen reader testing, keyboard navigation
- **Performance**: Lighthouse scores, bundle size
- **Internationalization**: RTL languages, cultural considerations

## Brand Assets

### Logo Usage
- **Primary Logo**: Statex wordmark with tagline
- **Icon Logo**: Simplified icon for small spaces
- **Monochrome**: Single color versions for backgrounds
- **Minimum Size**: 120px width for digital, 1 inch for print

### Photography Style
- **Professional**: Clean, modern business environments
- **Technology**: AI, coding, digital transformation themes
- **Diversity**: International team representation
- **Quality**: High-resolution, well-lit compositions

### Icon Style
- **Line Icons**: 2px stroke weight
- **Rounded Corners**: 2px border radius
- **Consistent Grid**: 24x24px base grid
- **Semantic Colors**: Context-appropriate color usage

## Maintenance and Updates

### Version Control
- **Semantic Versioning**: Major.Minor.Patch
- **Changelog**: Document all design system changes
- **Migration Guide**: Instructions for updating implementations

### Documentation
- **Component Library**: Interactive documentation
- **Code Examples**: Copy-paste ready code snippets
- **Best Practices**: Implementation guidelines
- **Troubleshooting**: Common issues and solutions

### Feedback Loop
- **Design Reviews**: Regular team feedback sessions
- **User Testing**: Validate design decisions
- **Analytics**: Monitor component usage and performance
- **Iteration**: Continuous improvement based on data

---

*This document is maintained by the Statex design team and should be updated as the brand evolves.* 