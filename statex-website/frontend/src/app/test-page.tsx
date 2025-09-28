'use client';

import { useTemplateBuilder } from '@/hooks/useTemplateBuilder';

export default function TestPage() {
  try {
    const builder = useTemplateBuilder();

    const template = builder
      .addSection('hero', 'default', {
        title: 'Test Page',
        subtitle: 'Testing the template builder'
      })
      .build();

    return (
      <div>
        <h1>Test Page</h1>
        <p>Template ID: {template.id}</p>
        <p>Sections: {template.sections?.length || 0}</p>
      </div>
    );
  } catch (error) {
    return (
      <div>
        <h1>Error in Test Page</h1>
        <p>Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
        <p>Stack: {error instanceof Error ? error.stack : 'No stack'}</p>
      </div>
    );
  }
}
