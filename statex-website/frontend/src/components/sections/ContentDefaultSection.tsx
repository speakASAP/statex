import React from 'react';
import { ClassComposer } from '@/lib/classComposition';
import { Container, Section } from '@/components/atoms';

interface ContentDefaultSectionProps {
  title?: string;
  content?: string;
  className?: string;
}

export function ContentDefaultSection({ 
  title = "Content Section",
  content = "This is a default content section. Please provide specific content for this section.",
  className = "" 
}: ContentDefaultSectionProps) {
  const composer = new ClassComposer('content-default-section', className);

  return (
    <Section className={composer.getClasses()}>
      <Container>
        <div className="max-w-4xl mx-auto">
          {title && (
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              {title}
            </h2>
          )}
          
          <div className="prose prose-lg max-w-none">
            <div 
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}
