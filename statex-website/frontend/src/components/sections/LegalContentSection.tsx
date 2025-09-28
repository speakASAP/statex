'use client';

import React from 'react';
import { Text } from '@/components/atoms';
import { LegalContentSectionConfig } from '@/types/templates';
import { Container, Section } from '@/components/atoms';

export function LegalContentSection(config: LegalContentSectionConfig) {
  const { title, sections } = config;

  return (
    <Section spacing="lg" background="default">
      <Container size="lg">
        <Text variant="h2" className="stx-legal-content__section-title">{title}</Text>
        <div className="stx-legal-content__sections">
          {sections.map((section) => (
            <div key={section.id} className="stx-legal-content__section">
              <Text variant="h3" className="stx-legal-content__section-title">{section.title}</Text>
              <div
                className="stx-legal-content__section-content"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
