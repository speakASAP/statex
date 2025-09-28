export interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  features: string[];
}

export const SERVICES: ServiceCardProps[] = [
  {
    id: 'web-development',
    title: 'Web Development',
    description: 'Create lightning-fast, responsive websites and web applications using cutting-edge technologies.',
    icon: '🌐',
    href: '/services/web-development',
    features: [
      'Progressive Web Apps (PWA)',
      'Mobile-responsive design',
      'EU accessibility compliance',
      'Multi-language support'
    ]
  },
  {
    id: 'ai-automation',
    title: 'AI Automation',
    description: 'Automate repetitive tasks and streamline business processes with custom AI solutions.',
    icon: '🤖',
    href: '/services/ai-automation',
    features: [
      'Business process automation',
      'Chatbot development',
      'Document processing systems',
      'Workflow optimization'
    ]
  },
  {
    id: 'system-modernization',
    title: 'System Modernization',
    description: 'Transform outdated systems into modern, scalable solutions without disrupting your business operations.',
    icon: '🔄',
    href: '/services/system-modernization',
    features: [
      'Legacy system migration',
      'Cloud infrastructure setup',
      'API development & integration',
      'Database modernization'
    ]
  },
  {
    id: 'e-commerce',
    title: 'E-Commerce Solutions',
    description: 'Launch powerful e-commerce platforms optimized for European markets with multi-currency support.',
    icon: '🛒',
    href: '/services/e-commerce',
    features: [
      'Custom online stores',
      'Payment gateway integration',
      'Multi-currency & multi-language',
      'Inventory management systems'
    ]
  },
  {
    id: 'consulting',
    title: 'IT Consulting',
    description: 'Navigate complex technology decisions with expert guidance from our experienced consultants.',
    icon: '💡',
    href: '/services/consulting',
    features: [
      'Digital transformation strategy',
      'Technology assessment',
      'Project management',
      'AI implementation planning'
    ]
  },
  {
    id: 'custom-software',
    title: 'Custom Software',
    description: 'Build bespoke applications tailored to your exact requirements with enterprise-grade solutions.',
    icon: '🛠️',
    href: '/services/custom-software',
    features: [
      'Enterprise applications',
      'SaaS platform development',
      'Mobile app creation',
      'Integration solutions'
    ]
  }
];
