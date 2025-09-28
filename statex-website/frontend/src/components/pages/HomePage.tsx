'use client';

import React, { useState, useEffect } from 'react';
import {
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  TestimonialsSection,
  SolutionCTASection
} from '@/components';
import { HeroSpacer } from '@/components/atoms';
import { useABTest } from '@/hooks/useABTest';
import { generateUserId, ABTestManager } from '@/config/abTestConfig';

interface HomePageProps {
  userId?: string; // Optional: pass from your auth system
}

export function HomePage({ userId: propUserId }: HomePageProps) {
  const [userId, setUserId] = useState<string>('');

  // Initialize user ID
  useEffect(() => {
    const id = propUserId || generateUserId();
    setUserId(id);
  }, [propUserId]);

  // A/B Test 1: Hero Section Variants (3 variants)
  const heroTest = useABTest('homepage-hero-variants', userId);

  // A/B Test 2: Page Layout Variants (2 layouts)
  const layoutTest = useABTest('homepage-layout-variants', userId);

  // Track page view for both experiments
  useEffect(() => {
    if (heroTest.isInExperiment && userId) {
      console.log(`User ${userId} is in hero experiment, variant: ${heroTest.variantId}`);
    }
    if (layoutTest.isInExperiment && userId) {
      console.log(`User ${userId} is in layout experiment, variant: ${layoutTest.variantId}`);
    }
  }, [heroTest.isInExperiment, heroTest.variantId, layoutTest.isInExperiment, layoutTest.variantId, userId]);

  // Get configurations from A/B tests
  const heroConfig = heroTest.config || {
    // Default fallback config
    title: 'Transform Your Ideas Into Working Prototypes in 24 Hours',
    subtitle: 'Experience the future of software development with AI-powered prototype creation. Simply describe your vision through voice, text, or files, and receive a functional web application prototype — completely free.',
    highlight: 'Working Prototypes',
    showTrustIndicators: true,
    showPrototypeInterface: true, // Force this to true for debugging
    trustBadges: [
      { icon: '⚡', text: '24-48 Hour Delivery' },
      { icon: '🌍', text: 'EU Market Expertise' },
      { icon: '🗣️', text: '9 Languages Supported' },
      { icon: '🆓', text: 'Completely Free Prototype' }
    ],
    primaryAction: {
      text: 'Get Free Prototype',
      href: '/free-prototype'
    }
  };

  // Default testimonials data
  const defaultTestimonials = [
    {
      quote: "Incredible speed and quality! Statex delivered a working prototype of our e-commerce platform in just 36 hours. The AI-powered approach saved us months of development time.",
      author: {
        name: "Heinrich Kainz",
        role: "CEO",
        company: "TechVision GmbH"
      }
    },
    {
      quote: "The prototype they created exceeded our expectations. The team understood our complex requirements perfectly and delivered a solution that our stakeholders loved.",
      author: {
        name: "Sophie Dubois",
        role: "CTO",
        company: "InnovaCorp France"
      }
    },
    {
      quote: "Working with Statex was a game-changer for our digital transformation. Their expertise in both AI and traditional development is unmatched in the EU market.",
      author: {
        name: "Alessandro Rossi",
        role: "Director",
        company: "Milano Solutions"
      }
    },
    {
      quote: "From concept to working prototype in less than 48 hours - I couldn't believe it was possible until I experienced it myself. Highly recommended!",
      author: {
        name: "Jan Novák",
        role: "Founder",
        company: "Prague Digital"
      }
    },
    {
      quote: "The free prototype convinced our board immediately. The quality and functionality were production-ready from day one. We're now planning our full development with Statex.",
      author: {
        name: "Elena Weber",
        role: "Product Manager",
        company: "Berlin Startup Hub"
      }
    }
  ];

  // Default features data
  const defaultFeatures = [
    {
      icon: "🌐",
      heading: "Web Development",
      text: "Create lightning-fast, responsive websites and web applications using cutting-edge technologies.",
      list: [
        "Progressive Web Apps (PWA)",
        "Mobile-responsive design",
        "EU accessibility compliance",
        "Multi-language support"
      ],
      link: {
        text: "Learn More About Web Development →",
        href: "/services/web-development"
      }
    },
    {
      icon: "🤖",
      heading: "AI Automation",
      text: "Automate repetitive tasks and streamline business processes with custom AI solutions.",
      list: [
        "Business process automation",
        "Chatbot development",
        "Document processing systems",
        "Workflow optimization"
      ],
      link: {
        text: "Discover AI Automation Solutions →",
        href: "/services/ai-automation"
      }
    },
    {
      icon: "🔄",
      heading: "System Modernization",
      text: "Transform outdated systems into modern, scalable solutions without disrupting your business operations.",
      list: [
        "Legacy system migration",
        "Cloud infrastructure setup",
        "API development & integration",
        "Database modernization"
      ],
      link: {
        text: "Explore System Modernization →",
        href: "/services/system-modernization"
      }
    },
    {
      icon: "🛒",
      heading: "E-Commerce Solutions",
      text: "Launch powerful e-commerce platforms optimized for European markets with multi-currency support.",
      list: [
        "Custom online stores",
        "Payment gateway integration",
        "Multi-currency & multi-language",
        "Inventory management systems"
      ],
      link: {
        text: "Build Your E-Commerce Platform →",
        href: "/services/e-commerce"
      }
    },
    {
      icon: "💡",
      heading: "IT Consulting",
      text: "Navigate complex technology decisions with expert guidance from our experienced consultants.",
      list: [
        "Digital transformation strategy",
        "Technology assessment",
        "Architecture planning",
        "Implementation guidance"
      ],
      link: {
        text: "Get Expert IT Consulting →",
        href: "/services/consulting"
      }
    },
    {
      icon: "🔧",
      heading: "Custom Software",
      text: "Build tailored software solutions that perfectly match your business requirements and workflows.",
      list: [
        "Custom application development",
        "Enterprise software solutions",
        "Integration with existing systems",
        "Scalable architecture design"
      ],
      link: {
        text: "Develop Custom Software →",
        href: "/services/custom-software"
      }
    }
  ];

  // Default steps data for How It Works section
  const defaultSteps = [
    {
      number: "1",
      title: "Describe Your Idea",
      description: "Share your project vision through voice messages, detailed text descriptions, or by uploading relevant files and documents."
    },
    {
      number: "2",
      title: "AI Analysis",
      description: "Our advanced AI system analyzes your requirements, identifies key features, and creates a comprehensive development plan."
    },
    {
      number: "3",
      title: "Rapid Development",
      description: "Our expert team combines AI-generated code with human expertise to build your working prototype in 24-48 hours."
    },
    {
      number: "4",
      title: "Receive & Test",
      description: "Get your live, functional prototype hosted on our platform. Test all features and request one free modification if needed."
    }
  ];

  const layoutConfig = layoutTest.config || {
    // Default fallback layout
    sections: ['hero', 'features', 'process', 'testimonials', 'cta'],
    featuresConfig: { 
      title: 'Our Core Services for European Businesses', 
      subtitle: 'Transform your business with our comprehensive suite of AI-powered development services. Each solution is tailored to meet the unique needs of European Union markets.',
      variant: 'grid' 
    },
    processConfig: { 
      title: 'How It Works', 
      subtitle: 'Get your working prototype in just 4 simple steps. Our AI-powered process makes development faster and more efficient than ever before.',
      variant: 'steps' 
    },
    testimonialsConfig: {
      title: 'What Our Clients Say',
      subtitle: 'Trusted by businesses across Europe for rapid development and exceptional results.'
    }
  };

  // Ensure sections is always defined
  const sections = layoutConfig.sections || ['hero', 'features', 'process', 'testimonials', 'cta'];
  
  // Debug logging
  console.log('HomePage Debug:', {
    userId,
    heroTest: {
      isInExperiment: heroTest.isInExperiment,
      variantId: heroTest.variantId,
      config: heroTest.config
    },
    layoutTest: {
      isInExperiment: layoutTest.isInExperiment,
      variantId: layoutTest.variantId,
      config: layoutTest.config
    },
    heroConfig: {
      showPrototypeInterface: heroConfig.showPrototypeInterface,
      showTrustIndicators: heroConfig.showTrustIndicators,
      title: heroConfig.title,
      subtitle: heroConfig.subtitle
    },
    layoutConfig: {
      sections: layoutConfig.sections,
      featuresConfig: layoutConfig.featuresConfig
    },
    finalSections: sections,
    // Force prototype interface for debugging
    forceShowPrototype: true
  });

  // Handle conversion tracking
  const handleHeroClick = () => {
    if (userId) {
      heroTest.trackConversion('hero_cta_click');
      layoutTest.trackConversion('primary_cta_click');
    }
    // Redirect to prototype page
    window.location.href = '/free-prototype';
  };

  const handleSecondaryClick = () => {
    if (userId) {
      heroTest.trackConversion('hero_secondary_click');
      layoutTest.trackConversion('secondary_cta_click');
    }
  };

  // Render sections based on layout variant
  const renderSection = (sectionType: string, key: string) => {
    switch (sectionType) {
      case 'hero':
        return (
          <HeroSection
            key={key}
            pageType="homepage"
            title={heroConfig.title}
            subtitle={heroConfig.subtitle}
            highlight={heroConfig.highlight}
            showTrustIndicators={heroConfig.showTrustIndicators}
            showPrototypeInterface={heroConfig.showPrototypeInterface}
            trustBadges={heroConfig.trustBadges}
            primaryAction={{
              text: 'Get Free Prototype',
              href: '/free-prototype',
              onClick: handleHeroClick
            }}
            secondaryAction={{
              text: 'Learn More',
              href: '/about',
              onClick: handleSecondaryClick
            }}
          />
        );
      case 'features':
        return (
          <FeaturesSection
            key={key}
            title={layoutConfig.featuresConfig?.title || 'Our Core Services for European Businesses'}
            subtitle={layoutConfig.featuresConfig?.subtitle}
            variant={layoutConfig.featuresConfig?.variant || 'grid'}
            features={defaultFeatures}
          />
        );
      case 'process':
        return (
          <HowItWorksSection 
            key={key} 
            steps={defaultSteps}
            title={layoutConfig.processConfig?.title}
            subtitle={layoutConfig.processConfig?.subtitle}
          />
        );
      case 'testimonials':
        return (
          <TestimonialsSection 
            key={key} 
            testimonials={defaultTestimonials}
            title={layoutConfig.testimonialsConfig?.title}
            subtitle={layoutConfig.testimonialsConfig?.subtitle}
          />
        );
      case 'cta':
        return <SolutionCTASection key={key} />;
      default:
        console.warn(`Unknown section type: ${sectionType}`);
        return null;
    }
  };

  // Always render content, even if userId is not ready
  // Ensure sections is always defined for SSR
  const safeSections = sections;
  
  return (
    <>
      {/* Debug Display - Only in development */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '10px',
          fontSize: '12px',
          zIndex: 9998,
          maxWidth: '300px',
          borderRadius: '0 0 0 8px'
        }}>
          <div><strong>HomePage Debug</strong></div>
          <div>Hero Variant: {heroTest.variantId || 'default'}</div>
          <div>Layout Variant: {layoutTest.variantId || 'default'}</div>
          <div>Prototype Interface: {heroConfig.showPrototypeInterface ? '✅' : '❌'}</div>
          <div>Trust Indicators: {heroConfig.showTrustIndicators ? '✅' : '❌'}</div>
          <div>Sections: {sections.join(', ')}</div>
        </div>
      )}
      
      <HeroSpacer />
      {safeSections.map((section, index) => {
        const uniqueKey = `${section}-${index}-${userId || 'default'}`;
        console.log(`Rendering section: ${section} with key: ${uniqueKey}`);
        return renderSection(section, uniqueKey);
      })}
      {/* A/B Test Controller for development */}
      <ABTestController />
    </>
  );
}

// Testing utility component for easy variant switching
export function ABTestController() {
  // Use localStorage for userId persistence and allow reset
  const [userId, setUserId] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('abtest_userId') || generateUserId();
    }
    return '';
  });
  const manager = ABTestManager.getInstance();

  useEffect(() => {
    if (userId) {
      localStorage.setItem('abtest_userId', userId);
    }
  }, [userId]);

  // Helper to force both hero and layout variants
  const forceCombination = (heroVariant: string, layoutVariant: string) => {
    manager.forceAssign(userId, 'homepage-hero-variants', heroVariant);
    manager.forceAssign(userId, 'homepage-layout-variants', layoutVariant);
    window.location.reload();
  };

  // Helper to force only hero or layout
  const forceHeroVariant = (variantId: string) => {
    manager.forceAssign(userId, 'homepage-hero-variants', variantId);
    window.location.reload();
  };
  const forceLayoutVariant = (variantId: string) => {
    manager.forceAssign(userId, 'homepage-layout-variants', variantId);
    window.location.reload();
  };

  // Reset: new userId, randomize both variants
  const handleReset = () => {
    const newId = generateUserId();
    localStorage.setItem('abtest_userId', newId);
    setUserId(newId);
    // Assign random hero/layout
    const heroVariants = ['hero-classic', 'hero-benefit-focused', 'hero-urgency'];
    const layoutVariants = ['layout-standard', 'layout-conversion-optimized'];
    const hero = heroVariants[Math.floor(Math.random() * heroVariants.length)] || 'hero-classic';
    const layout = layoutVariants[Math.floor(Math.random() * layoutVariants.length)] || 'layout-standard';
    manager.forceAssign(newId, 'homepage-hero-variants', hero);
    manager.forceAssign(newId, 'homepage-layout-variants', layout);
    window.location.reload();
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      background: 'white',
      border: '1px solid #ccc',
      padding: '10px',
      fontSize: '12px',
      zIndex: 9999,
      borderRadius: '0 8px 0 0',
      boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
    }}>
      <div><strong>A/B Test Controller</strong></div>
      <div style={{ marginTop: '8px' }}>
        <div>Hero Variants:</div>
        <button style={{ marginRight: 8 }} onClick={() => forceCombination('hero-classic', 'layout-standard')}>ClassicStandard</button>
        <button style={{ marginRight: 8 }} onClick={() => forceCombination('hero-classic', 'layout-conversion-optimized')}>ClassicOptimized</button><br />
        <button style={{ marginRight: 8 }} onClick={() => forceCombination('hero-benefit-focused', 'layout-standard')}>BenefitsStandard</button>
        <button style={{ marginRight: 8 }} onClick={() => forceCombination('hero-benefit-focused', 'layout-conversion-optimized')}>BenefitsOptimized</button><br />
        <button style={{ marginRight: 8 }} onClick={() => forceCombination('hero-urgency', 'layout-standard')}>UrgencyStandard</button>
        <button style={{ marginRight: 8 }} onClick={() => forceCombination('hero-urgency', 'layout-conversion-optimized')}>UrgencyOptimized</button><br />
      </div>
      <div style={{ marginTop: '8px' }}>
        <div>Individual Hero:</div>
        <button style={{ marginRight: 8 }} onClick={() => forceHeroVariant('hero-classic')}>Classic</button>
        <button style={{ marginRight: 8 }} onClick={() => forceHeroVariant('hero-benefit-focused')}>Benefits</button>
        <button style={{ marginRight: 8 }} onClick={() => forceHeroVariant('hero-urgency')}>Urgency</button>
      </div>
      <div style={{ marginTop: '8px' }}>
        <div>Individual Layout:</div>
        <button style={{ marginRight: 8 }} onClick={() => forceLayoutVariant('layout-standard')}>Standard</button>
        <button style={{ marginRight: 8 }} onClick={() => forceLayoutVariant('layout-conversion-optimized')}>Optimized</button>
      </div>
      <div style={{ marginTop: '8px' }}>
        <button style={{ marginRight: 8 }} onClick={handleReset}>Random</button>
      </div>
    </div>
  );
}
