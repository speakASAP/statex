'use client';

import React from 'react';
import { TemplateConfig } from '@/types/templates';

interface TemplateRendererProps {
  template: TemplateConfig;
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({ template }) => {
  if (!template || !template.sections) {
    console.error('Invalid template provided to TemplateRenderer');
    return <div>Error: Invalid template</div>;
  }

  return (
    <div className="template-renderer">
      {template.sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className={`section section-${section.variant} ${section.config?.['theme'] || ''}`}
          data-section-id={section.id}
        >
          <div className={`container ${section.config?.['layout'] || 'contained'}`}>
            {section.config?.['title'] && (
              <h2 className="section-title">{section.config['title']}</h2>
            )}
            {section.config?.['subtitle'] && (
              <p className="section-subtitle">{section.config['subtitle']}</p>
            )}
            {/* Add more section content rendering as needed */}
          </div>
        </section>
      ))}
    </div>
  );
};
