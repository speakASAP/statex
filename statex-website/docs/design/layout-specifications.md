# Layout Specifications - Statex Design System

## Project Status: [MILESTONE 4] - 2025-06-27 - Design System Complete ✅

### Implementation Overview
**Complete**: All 25 website pages have professional layout designs
**Brand Consistency**: Systematic implementation across all mockups
**Mobile Responsive**: Full responsive design for all layouts
**Accessibility**: WCAG 2.1 AA compliance features included
**Component Library**: Reusable elements for development efficiency

---

## 🎨 Design System Foundation

### Brand Colors
```css
:root {
    /* Primary Brand Colors */
    --primary-blue: #0066CC;
    --primary-blue-light: #3385DD;
    --primary-blue-dark: #004499;
    --accent-green: #00CC66;
    --accent-green-light: #33DD88;
    --accent-green-dark: #009944;
    
    /* Neutral Palette */
    --gray-50: #F9FAFB;
    --gray-100: #F3F4F6;
    --gray-200: #E5E7EB;
    --gray-300: #D1D5DB;
    --gray-400: #9CA3AF;
    --gray-500: #6B7280;
    --gray-600: #4B5563;
    --gray-700: #374151;
    --gray-800: #1F2937;
    --gray-900: #111827;
    
    /* Status Colors */
    --success: #10B981;
    --warning: #F59E0B;
    --error: #EF4444;
    --info: #3B82F6;
}
```

### Typography Scale
```css
/* Inter Font Family Implementation */
--font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Heading Sizes */
.text-4xl { font-size: 3.5rem; line-height: 1.1; } /* Hero Headlines */
.text-3xl { font-size: 3rem; line-height: 1.2; }   /* Page Headlines */
.text-2xl { font-size: 2.5rem; line-height: 1.2; } /* Section Headlines */
.text-xl { font-size: 1.5rem; line-height: 1.3; }  /* Subsection Headlines */
.text-lg { font-size: 1.25rem; line-height: 1.4; } /* Card Headlines */

/* Body Text Sizes */
.text-base { font-size: 1rem; line-height: 1.5; }      /* Standard Body */
.text-lg-body { font-size: 1.125rem; line-height: 1.6; } /* Large Body */
.text-sm { font-size: 0.875rem; line-height: 1.4; }    /* Small Text */
.text-xs { font-size: 0.75rem; line-height: 1.3; }     /* Micro Text */

/* Font Weights */
--font-light: 300;    /* Subtle text */
--font-regular: 400;  /* Body text */
--font-medium: 500;   /* Emphasized text */
--font-semibold: 600; /* Subheadings */
--font-bold: 700;     /* Headlines */
```

### Spacing System
```css
/* 8px Baseline Grid */
--space-xs: 8px;    /* Micro spacing */
--space-sm: 16px;   /* Small spacing */
--space-md: 24px;   /* Medium spacing */
--space-lg: 32px;   /* Large spacing */
--space-xl: 48px;   /* Extra large spacing */
--space-2xl: 64px;  /* Section spacing */

/* Border Radius Scale */
--radius-sm: 4px;     /* Small elements */
--radius-md: 8px;     /* Standard elements */
--radius-lg: 12px;    /* Cards and containers */
--radius-xl: 16px;    /* Large containers */
--radius-full: 9999px; /* Buttons and badges */
```

---

## 📐 Grid System

### 12-Column Responsive Grid
```css
.container {
    max-width: 80vw;
    margin: 0 auto;
    padding: 0 var(--space-md);
}

/* Grid Implementation */
.grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: var(--space-lg);
}

/* Common Grid Patterns */
.grid-2-col { grid-template-columns: 1fr 1fr; }
.grid-3-col { grid-template-columns: repeat(3, 1fr); }
.grid-auto-fit { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
```

### Responsive Breakpoints
```css
/* Mobile First Approach */
@media (max-width: 768px) {
    .container { padding: 0 var(--space-sm); }
    .grid { grid-template-columns: 1fr; }
    .text-4xl { font-size: 2.5rem; }
    .text-3xl { font-size: 2rem; }
}

@media (min-width: 769px) and (max-width: 1024px) {
    .grid-3-col { grid-template-columns: repeat(2, 1fr); }
}
```

---

## 🧩 Component Specifications

### Navigation Header
**Structure**: Fixed header with backdrop blur
**Height**: 80px with 16px padding
**Elements**: Logo, main menu, CTA button
**Responsive**: Collapses to hamburger menu on mobile

```css
.header {
    position: fixed;
    top: 0;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--gray-200);
    z-index: 1000;
}
```

### Button System
**Primary Button**: Gradient background, white text
**Secondary Button**: Transparent with border
**CTA Button**: Accent green for conversion actions

```css
.btn-primary {
    background: linear-gradient(135deg, var(--primary-blue), var(--primary-blue-light));
    color: white;
    padding: 12px 24px;
    border-radius: var(--radius-full);
}

.btn-secondary {
    background: transparent;
    border: 2px solid var(--gray-300);
    color: var(--gray-700);
}
```

### Card Components
**Standard Card**: White background, subtle shadow, rounded corners
**Service Card**: Hover effects, icon, title, description, features list
**Testimonial Card**: Author info, content, company details

```css
.card {
    background: white;
    border-radius: var(--radius-xl);
    padding: var(--space-xl);
    border: 1px solid var(--gray-200);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}
```

---

## 📱 Page Layout Templates

### 1. Homepage Layout
**Structure**: Hero + Services + How It Works + Testimonials + Contact
**Hero**: Full viewport height with gradient background
**Sections**: Alternating white and gray-50 backgrounds
**CTA**: Prominent prototype request form integration

### 2. Service Page Layout
**Structure**: Hero + Overview + Features + Process + FAQ + CTA
**Hero**: Service-specific color scheme (primary blue)
**Content**: 2-column layout with sidebar highlights
**Process**: Timeline visualization with numbered steps

### 3. Solution Page Layout
**Structure**: Hero + Problem + Solution + Case Studies + Implementation + CTA
**Problem/Solution**: Side-by-side comparison layout
**Case Studies**: Grid of 3 success story cards
**Metrics**: Animated counters on scroll

### 4. About Page Layout
**Structure**: Hero + Story + Values + Team + Culture + CTA
**Values**: 6-card grid with icons and descriptions
**Team**: Team member cards with avatars and skills
**Culture**: Visual culture elements with emojis

### 5. Free Prototype Layout
**Structure**: Hero + Process + Form + Deliverables + FAQ
**Form**: Multi-step prototype request with file upload
**Process**: Detailed 4-step timeline
**Guarantees**: Trust indicators and value propositions

### 6. Legal Page Layout
**Structure**: Header + Navigation Sidebar + Content
**Sidebar**: Sticky table of contents navigation
**Content**: Structured legal sections with numbering
**Compliance**: GDPR compliance indicators

---

## 🎯 Interactive Elements

### Hover States
- **Cards**: Lift effect with enhanced shadow
- **Buttons**: Color transitions and slight scale
- **Links**: Color transitions to primary blue
- **Images**: Subtle scale and overlay effects

### Animation Guidelines
- **Duration**: 0.3s for most transitions
- **Easing**: ease-in-out for smooth natural motion
- **Transforms**: translateY for lift effects
- **Opacity**: For fade-in animations on scroll

### Focus States
- **Accessibility**: 3px blue outline for keyboard navigation
- **Form Inputs**: Blue border and subtle glow
- **Buttons**: Enhanced outline for clarity

---

## 📐 Measurement Standards

### Section Spacing
- **Section Padding**: 64px top and bottom (--space-2xl)
- **Content Spacing**: 32px between major elements (--space-lg)
- **Text Spacing**: 16px between paragraphs (--space-sm)

### Grid Gaps
- **Card Grids**: 32px gap (--space-lg)
- **Form Elements**: 24px vertical spacing (--space-md)
- **Navigation Items**: 32px horizontal spacing (--space-lg)

### Maximum Content Width
- **Main Container**: 1200px maximum width
- **Text Content**: 800px for optimal readability
- **Form Content**: 600px for focused interaction

---

## 🔧 Implementation Guidelines

### CSS Architecture
- **CSS Custom Properties**: For consistent theming
- **Mobile-First**: Responsive design approach
- **Component-Based**: Reusable class structures
- **Performance**: Optimized selectors and minimal nesting

### Asset Optimization
- **Images**: WebP format with fallbacks
- **Icons**: SVG sprites for scalability
- **Fonts**: Google Fonts with display=swap
- **Loading**: Lazy loading for below-fold content

### Accessibility Features
- **Color Contrast**: Minimum 4.5:1 ratio for text
- **Focus Management**: Clear keyboard navigation
- **Screen Readers**: Semantic HTML and ARIA labels
- **Alternative Text**: Descriptive alt attributes

---

## 📋 Quality Checklist

### Visual Consistency
- ✅ Brand colors used systematically
- ✅ Typography scale applied consistently
- ✅ Spacing system followed throughout
- ✅ Component styles standardized

### Responsive Design
- ✅ Mobile-first implementation
- ✅ Tablet and desktop optimizations
- ✅ Touch-friendly interactive elements
- ✅ Readable text at all sizes

### Performance
- ✅ Optimized images and assets
- ✅ Minimal CSS and efficient selectors
- ✅ Progressive loading strategies
- ✅ Core Web Vitals considerations

### Accessibility
- ✅ WCAG 2.1 AA compliance
- ✅ Keyboard navigation support
- ✅ Screen reader compatibility
- ✅ Color-blind friendly palette

---

## 🚀 Development Handoff

### File Structure
```
docs/design/mockups/
├── homepage-mockup.html           # Complete homepage design
├── service-page-layout.html       # Service page template
├── solution-page-layout.html      # Solution page template
├── about-page-layout.html         # About page template
├── prototype-page-layout.html     # Free prototype template
├── legal-page-layout.html         # Legal page template
└── component-library.html         # Reusable components
```

### Next Steps for Development
1. **Extract CSS**: Convert inline styles to external stylesheets
2. **Component Creation**: Build reusable React/Next.js components
3. **Content Integration**: Connect with content management system
4. **Dynamic Functionality**: Implement interactive features
5. **Testing**: Cross-browser and accessibility testing

### Notes for Developers
- All mockups use semantic HTML structure
- CSS custom properties enable easy theming
- Responsive patterns are mobile-first
- Interactive elements have proper focus states
- Forms include validation state styling

---

**Design System Complete**: All 25 website pages now have comprehensive layout specifications ready for development implementation in Milestone 5. 