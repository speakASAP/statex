'use client';

import { useTemplateBuilder } from '@/hooks/useTemplateBuilder';
import { TemplateRenderer } from '@/components/templates/TemplateRenderer';
import { useABTest } from '@/hooks/useABTest';
import { SectionVariant } from '@/types/templates';

export default function PrototypeContent() {
  // AB Testing variants
  const heroVariant = useABTest('prototype-hero', ['default', 'video', 'split']) as SectionVariant;
  const formVariant = useABTest('prototype-form', ['default', 'modal', 'floating']) as SectionVariant;

  const handleFormSubmit = (data: any) => {
    console.log('Prototype form submitted:', data);
    // Handle form submission
  };

  const template = useTemplateBuilder()
    .addSection('hero', heroVariant, {
      title: 'Get Your Free Prototype',
      subtitle: 'Transform your idea into a working prototype in 24-48 hours',
      description: 'Describe your app idea and get a working prototype in 24-48 hours. No commitment required, secure & confidential. AI-powered development by Statex.',
      cta: {
        primary: 'Get Free Prototype Now',
        secondary: 'Learn More'
      },
      video: heroVariant === 'video' ? '/videos/prototype-hero.mp4' : undefined,
      layout: heroVariant === 'split' ? 'split' : 'default'
    })
    .addSection('features', 'grid', {
      title: 'Why Choose Our Prototype Service?',
      features: [
        {
          icon: '⚡',
          title: '24-48 Hour Delivery',
          description: 'Get your working prototype in just 1-2 days'
        },
        {
          icon: '🆓',
          title: 'Completely Free',
          description: 'No cost, no commitment, no hidden fees'
        },
        {
          icon: '🤖',
          title: 'AI-Powered',
          description: 'Advanced AI technology for rapid development'
        },
        {
          icon: '🔒',
          title: 'Secure & Confidential',
          description: 'Your idea is protected with NDAs and security'
        },
        {
          icon: '📱',
          title: 'Interactive Prototype',
          description: 'Fully functional prototype with real features'
        },
        {
          icon: '💡',
          title: 'Expert Feedback',
          description: 'Get professional insights and recommendations'
        }
      ]
    })
    .addSection('process', 'steps', {
      title: 'How It Works',
      steps: [
        {
          step: 1,
          title: 'Describe Your Idea',
          description: 'Tell us about your app concept and requirements'
        },
        {
          step: 2,
          title: 'AI Analysis',
          description: 'Our AI analyzes your requirements and creates a plan'
        },
        {
          step: 3,
          title: 'Rapid Development',
          description: 'We build your prototype using advanced tools'
        },
        {
          step: 4,
          title: 'Quality Review',
          description: 'Our experts review and optimize your prototype'
        },
        {
          step: 5,
          title: 'Delivery',
          description: 'Get your working prototype with documentation'
        }
      ]
    })
    .addSection('prototypeForm', formVariant, {
      title: 'Get Your Free Prototype',
      subtitle: 'No commitment required • Delivered within 24-48 hours',
      formTitle: 'Prototype Request Form',
      formSubtitle: 'Tell us about your app idea and we\'ll create a working prototype',
      submitButtonText: 'Get Free Prototype Now',
      placeholder: '💡 Describe your app idea:• What problem does it solve• Who is your target audience• What are the main features• Any specific requirements• Your timeline• How did you hear about us',
      layout: formVariant,
      variant: 'prototype',
      showVoiceRecording: true,
      showFileUpload: true,
      onSubmit: handleFormSubmit
    })
    .addSection('testimonials', 'cards', {
      title: 'What Our Clients Say',
      testimonials: [
        {
          name: 'Sarah Johnson',
          role: 'Startup Founder',
          company: 'TechStart Inc.',
          content: 'Got my prototype in 36 hours! The quality was amazing and helped me secure funding.',
          rating: 5
        },
        {
          name: 'Michael Chen',
          role: 'Product Manager',
          company: 'InnovateCorp',
          content: 'The AI-powered development was incredible. Saved us weeks of development time.',
          rating: 5
        },
        {
          name: 'Emma Rodriguez',
          role: 'Entrepreneur',
          company: 'GreenTech Solutions',
          content: 'Free prototype service was exactly what I needed to validate my idea. Highly recommended!',
          rating: 5
        }
      ]
    })
    .build();

  return (
    <>
      <TemplateRenderer template={template} />
    </>
  );
}
