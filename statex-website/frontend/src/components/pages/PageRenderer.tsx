import React from 'react';
import { RenderedContent } from '@/lib/content/templateRenderer';
import { HeroSpacer } from '@/components/atoms';

interface PageRendererProps {
  content: RenderedContent;
}

export default function PageRenderer({ 
  content
}: PageRendererProps) {
  const renderSection = (section: any) => {
    switch (section.type) {
      case 'hero':
        return renderHeroSection(section);
      case 'content':
        return renderContentSection(section);
      case 'cta':
        return renderCTASection(section);
      default:
        return null;
    }
  };

  const renderHeroSection = (section: any) => {
    const { content: heroContent, config } = section;
    
    return (
      <section className="stx-hero">
        <div className="stx-container">
          <div className="stx-hero__content">
            {config.showBreadcrumbs && (
              <nav className="stx-breadcrumbs">
                <a href="/">Home</a>
                <span> / </span>
                <span>{heroContent.title}</span>
              </nav>
            )}
            
            {config.showTitle && (
              <h1 className="stx-hero__title">{heroContent.title}</h1>
            )}
            
            {config.showSubtitle && (
              <p className="stx-hero__subtitle">{heroContent.description}</p>
            )}
            
            {config.showCTA && (
              <div className="stx-hero__cta">
                <a href="#contact" className="stx-button stx-button--primary">
                  Get Started
                </a>
                <a href="#learn-more" className="stx-button stx-button--secondary">
                  Learn More
                </a>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  };

  const renderContentSection = (section: any) => {
    const { content: contentData, config } = section;
    
    return (
      <section className="stx-section">
        <div className="stx-container">
          <div 
            className="stx-content"
            style={{ maxWidth: config.maxWidth || '1200px' }}
          >
            <div 
              className={`stx-content__body ${config.typography || 'prose'}`}
              dangerouslySetInnerHTML={{ __html: contentData.html }}
            />
          </div>
        </div>
      </section>
    );
  };

  const renderCTASection = (section: any) => {
    const { config } = section;
    
    return (
      <section className="stx-cta">
        <div className="stx-container">
          <div className="stx-cta__content">
            <h2 className="stx-cta__title">Ready to Get Started?</h2>
            <p className="stx-cta__description">
              Contact us today to discuss your project and discover how we can help you achieve your goals.
            </p>
            
            {config.showContactForm && (
              <div className="stx-cta__form">
                <a href="/contact" className="stx-button stx-button--primary">
                  Contact Us
                </a>
              </div>
            )}
            
            {config.showSocialProof && (
              <div className="stx-cta__social-proof">
                <p>Trusted by 500+ European businesses</p>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  };

  return (
    <>
      <HeroSpacer />
      {content.sections.map((section) => (
        <React.Fragment key={section.id}>
          {renderSection(section)}
        </React.Fragment>
      ))}
    </>
  );
} 