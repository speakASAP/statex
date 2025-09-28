'use client';

import React, { useState } from 'react';
import { HeroSpacer } from '@/components/atoms';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function FAQPage() {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setActiveItem(activeItem === id ? null : id);
  };

  const faqData: FAQItem[] = [
    // Company & Services Overview
    {
      id: 'company-overview',
      question: 'What is Statex and what do you do?',
      answer: `Statex is a cutting-edge technology company specializing in AI-powered software development and business automation solutions. We help businesses transform their operations through intelligent automation, custom software development, and digital transformation services.

Our core services include:
• AI Integration & Automation
• Custom Software Development
• Digital Transformation Consulting
• E-commerce Solutions
• System Modernization
• Web Development

We combine artificial intelligence with human expertise to deliver innovative solutions that drive business growth and operational efficiency.`,
      category: 'company'
    },
    {
      id: 'ai-expertise',
      question: 'How does Statex use artificial intelligence in development?',
      answer: `Statex leverages advanced AI technologies throughout our development process to deliver superior results faster and more efficiently:

AI-Powered Development Process:
• Automated code generation and optimization
• Intelligent requirement analysis and feature extraction
• AI-assisted UI/UX design recommendations
• Automated testing and quality assurance
• Smart project planning and timeline estimation

Our AI systems can:
• Analyze complex business requirements and translate them into technical specifications
• Generate production-ready code with best practices
• Identify potential issues before they become problems
• Optimize performance and user experience automatically
• Provide intelligent recommendations for technology stack selection

This AI-first approach allows us to deliver prototypes in 24-48 hours and complete projects 3-5x faster than traditional development methods.`,
      category: 'technology'
    },
    {
      id: 'free-prototype',
      question: 'How does your free prototype service work?',
      answer: `Our free prototype service is designed to demonstrate our capabilities and help you visualize your project before making any commitments:

Free Prototype Process:
1. Submit your project requirements through our detailed form
2. Our AI analyzes your needs and creates a development plan
3. We build a fully functional prototype in 24-48 hours
4. You receive a working demo with one free modification included
5. No strings attached - you own the prototype code

What's Included:
• Complete functional prototype
• Modern, responsive design
• Database integration
• User authentication system
• One free modification/improvement
• Source code ownership
• 30-day support

This service is completely free with no hidden fees or obligations. It's our way of proving our capabilities and building trust with potential clients.`,
      category: 'services'
    },
    {
      id: 'development-process',
      question: 'What is your development process and timeline?',
      answer: `Our development process is optimized for speed, quality, and transparency:

Phase 1: Discovery & Planning (1-3 days)
• Requirement analysis and feature extraction
• Technology stack selection
• Project architecture planning
• Timeline and milestone definition

Phase 2: Design & Prototyping (2-5 days)
• UI/UX design creation
• Interactive prototype development
• User feedback integration
• Design approval and sign-off

Phase 3: Development (1-4 weeks)
• AI-assisted code generation
• Human review and optimization
• Continuous testing and quality assurance
• Regular progress updates

Phase 4: Testing & Deployment (2-5 days)
• Comprehensive testing across devices
• Performance optimization
• Security audit and implementation
• Production deployment

Phase 5: Launch & Support (Ongoing)
• Go-live support
• User training and documentation
• Post-launch monitoring
• Ongoing maintenance and updates

Typical project timelines:
• Small projects: 1-2 weeks
• Medium projects: 2-4 weeks
• Large projects: 4-8 weeks
• Enterprise solutions: 8-16 weeks`,
      category: 'process'
    },
    {
      id: 'pricing-structure',
      question: 'What are your pricing options and payment terms?',
      answer: `We offer flexible pricing options to accommodate different business needs and budgets:

Pricing Tiers:

Free Prototype (€0)
• Complete working prototype
• One free modification
• Source code ownership
• 30-day support

Starter Package (€5,000 - €15,000)
• Small to medium applications
• Basic features and functionality
• 3 months of support
• 2 rounds of revisions

Professional Package (€15,000 - €50,000)
• Complex applications with advanced features
• Custom integrations and APIs
• 6 months of support
• Unlimited revisions during development
• Performance optimization

Enterprise Package (€50,000+)
• Large-scale enterprise solutions
• Custom AI integration
• Dedicated project manager
• 12 months of support
• Ongoing maintenance and updates
• Priority support and SLA

Payment Terms:
• 50% upfront, 50% upon completion
• Milestone-based payments available
• Net 30 payment terms for established clients
• No hidden fees or surprise charges

We also offer:
• Monthly retainer options for ongoing development
• Custom pricing for unique requirements
• Volume discounts for multiple projects
• Referral bonuses for new clients`,
      category: 'pricing'
    },
    {
      id: 'technology-stack',
      question: 'What technologies and platforms do you work with?',
      answer: `We work with modern, cutting-edge technologies to deliver robust and scalable solutions:

Frontend Technologies:
• React.js, Next.js, Vue.js, Angular
• TypeScript and JavaScript
• Tailwind CSS, Material-UI, Bootstrap
• Progressive Web Apps (PWA)
• Mobile-responsive design

Backend Technologies:
• Node.js, Python, PHP, Java, .NET
• Express.js, Django, Laravel, Spring Boot
• RESTful APIs and GraphQL
• Microservices architecture
• Serverless computing

Databases & Storage:
• PostgreSQL, MySQL, MongoDB
• Redis for caching
• AWS S3, Google Cloud Storage
• Elasticsearch for search functionality

Cloud & DevOps:
• AWS, Google Cloud, Azure
• Docker and Kubernetes
• CI/CD pipelines
• Automated testing and deployment
• Monitoring and logging

AI & Machine Learning:
• TensorFlow, PyTorch, Scikit-learn
• Natural Language Processing (NLP)
• Computer Vision
• Predictive Analytics
• Chatbots and Virtual Assistants

E-commerce & CMS:
• Shopify, WooCommerce, Magento
• WordPress, Drupal, Strapi
• Payment gateways integration
• Inventory management systems

We choose the best technology stack for each project based on requirements, scalability needs, and budget constraints.`,
      category: 'technology'
    },
    {
      id: 'quality-assurance',
      question: 'How do you ensure code quality and project success?',
      answer: `We maintain the highest standards of quality through our comprehensive quality assurance process:

Code Quality Standards:
• AI-powered code review and optimization
• Human expert review for business logic
• Automated testing (unit, integration, e2e)
• Performance benchmarking
• Security vulnerability scanning
• Code documentation and comments

Testing Process:
• Unit testing with 90%+ coverage
• Integration testing for all components
• End-to-end testing for user workflows
• Cross-browser and device testing
• Performance and load testing
• Security penetration testing

Quality Metrics:
• Code maintainability scores
• Performance benchmarks
• Security compliance checks
• Accessibility standards (WCAG 2.1)
• SEO optimization
• Mobile responsiveness

Project Success Factors:
• Clear requirement documentation
• Regular client communication
• Milestone-based progress tracking
• Risk assessment and mitigation
• Change management process
• Post-launch support and monitoring

We also provide:
• Comprehensive project documentation
• User training and onboarding
• Ongoing maintenance and updates
• Performance monitoring and optimization
• Security updates and patches`,
      category: 'quality'
    },
    {
      id: 'support-maintenance',
      question: 'What kind of support and maintenance do you provide?',
      answer: `We provide comprehensive support and maintenance to ensure your project continues to perform optimally:

Support Tiers:

Basic Support (Included with all projects)
• 30-day post-launch support
• Bug fixes and critical updates
• Email support during business hours
• Response time: 24-48 hours

Standard Support (€500/month)
• 6 months of extended support
• Priority email and phone support
• Monthly performance reviews
• Security updates and patches
• Response time: 8-24 hours

Premium Support (€1,000/month)
• 12 months of comprehensive support
• Dedicated support engineer
• 24/7 emergency support
• Weekly performance monitoring
• Proactive issue resolution
• Response time: 2-8 hours

Enterprise Support (Custom pricing)
• Custom SLA and response times
• On-site support available
• Dedicated account manager
• Custom monitoring and reporting
• Training and consultation

Maintenance Services:
• Regular security updates
• Performance optimization
• Feature enhancements
• Database maintenance
• Backup and disaster recovery
• Third-party integration updates

We also offer:
• Monthly maintenance packages
• Annual support contracts
• Custom support agreements
• Training and documentation updates`,
      category: 'support'
    },
    {
      id: 'security-compliance',
      question: 'How do you handle security and data protection?',
      answer: `Security and data protection are our top priorities. We implement enterprise-grade security measures:

Security Standards:
• GDPR compliance for European clients
• SOC 2 Type II certification
• ISO 27001 information security management
• OWASP security guidelines
• Regular security audits and penetration testing

Data Protection:
• End-to-end encryption for data in transit
• AES-256 encryption for data at rest
• Secure authentication and authorization
• Role-based access control (RBAC)
• Regular security updates and patches

Infrastructure Security:
• Cloud security best practices
• Network segmentation and firewalls
• Intrusion detection and prevention
• 24/7 security monitoring
• Automated threat detection

Development Security:
• Secure coding practices
• Regular dependency vulnerability scanning
• Code security reviews
• Input validation and sanitization
• SQL injection and XSS prevention

Client Data Handling:
• Data minimization principles
• Secure data transmission protocols
• Regular data backup and recovery testing
• Client data isolation and privacy
• Transparent data handling policies

We also provide:
• Security documentation and compliance reports
• Regular security assessments
• Incident response procedures
• Security training for client teams
• Compliance consulting services`,
      category: 'security'
    },
    {
      id: 'team-expertise',
      question: 'What is your team structure and expertise?',
      answer: `Our team consists of experienced professionals with diverse expertise in modern technologies:

Core Team Structure:

Project Management (2-3 members per project)
• Senior Project Managers
• Business Analysts
• Scrum Masters
• Client Success Managers

Development Team (4-8 members per project)
• Senior Full-Stack Developers
• Frontend Specialists (React, Vue, Angular)
• Backend Engineers (Node.js, Python, Java)
• DevOps Engineers
• Database Architects

Design & UX (2-3 members per project)
• Senior UI/UX Designers
• Visual Designers
• User Research Specialists
• Accessibility Experts

AI & Machine Learning (2-4 members per project)
• AI Engineers and Data Scientists
• ML Model Developers
• NLP Specialists
• Computer Vision Experts

Quality Assurance (2-3 members per project)
• Senior QA Engineers
• Automation Testers
• Performance Testers
• Security Testers

Support & Maintenance (Dedicated team)
• Technical Support Engineers
• System Administrators
• Security Specialists
• Documentation Specialists

Team Expertise:
• Average 8+ years of experience
• Certifications in relevant technologies
• Continuous learning and training
• Industry best practices knowledge
• Problem-solving and innovation focus

We also collaborate with:
• Industry experts and consultants
• Technology partners and vendors
• Academic institutions for research
• Open-source community contributors`,
      category: 'team'
    },
    {
      id: 'client-success',
      question: 'What are some examples of successful projects you\'ve delivered?',
      answer: `We've successfully delivered hundreds of projects across various industries. Here are some notable examples:

E-commerce Solutions:
• Multi-vendor marketplace platform (€150K project)
  - 50,000+ products, 200+ vendors
  - AI-powered recommendation engine
  - Advanced inventory management
  - 300% increase in sales within 6 months

• B2B procurement platform (€200K project)
  - Automated purchase order processing
  - Supplier management system
  - Real-time inventory tracking
  - 40% reduction in procurement costs

AI & Automation Projects:
• Customer service chatbot (€80K project)
  - 24/7 automated support
  - 70% reduction in support tickets
  - Multi-language support
  - Integration with CRM systems

• Predictive analytics dashboard (€120K project)
  - Sales forecasting and trend analysis
  - Real-time data visualization
  - Automated reporting
  - 25% improvement in decision-making accuracy

Digital Transformation:
• Legacy system modernization (€300K project)
  - Migration from old ERP to modern cloud solution
  - Process automation and optimization
  - Employee training and change management
  - 60% improvement in operational efficiency

• Healthcare management system (€250K project)
  - Patient portal and appointment scheduling
  - Electronic health records integration
  - Telemedicine capabilities
  - HIPAA compliance and security

Success Metrics:
• 95% client satisfaction rate
• Average 40% improvement in business metrics
• 100% project completion rate
• 80% of clients return for additional projects
• Average 3-week delivery time for prototypes`,
      category: 'success'
    },
    {
      id: 'communication-collaboration',
      question: 'How do you communicate and collaborate with clients?',
      answer: `We believe in transparent and effective communication throughout the project lifecycle:

Communication Channels:
• Dedicated project management platform
• Regular video conference calls
• Email and instant messaging
• Phone support for urgent matters
• Client portal for project tracking

Project Collaboration:
• Weekly progress meetings
• Bi-weekly sprint reviews
• Monthly stakeholder updates
• Real-time project dashboard
• Collaborative design and development tools

Communication Schedule:
• Daily stand-ups (for active development)
• Weekly progress reports
• Bi-weekly milestone reviews
• Monthly executive summaries
• Quarterly business reviews

Tools We Use:
• Project management: Jira, Asana, Monday.com
• Communication: Slack, Microsoft Teams, Zoom
• Design collaboration: Figma, Adobe Creative Suite
• Development: GitHub, GitLab, Bitbucket
• Documentation: Confluence, Notion, Google Docs

Client Involvement:
• Regular feedback sessions
• Design review and approval process
• Feature prioritization workshops
• User acceptance testing
• Training and knowledge transfer

We also provide:
• Dedicated client success manager
• 24/7 emergency contact
• Transparent pricing and billing
• Regular performance reports
• Post-launch support and consultation`,
      category: 'communication'
    },
    {
      id: 'scalability-future',
      question: 'How do you ensure solutions are scalable for future growth?',
      answer: `We design all solutions with scalability and future growth in mind:

Architecture Design:
• Microservices architecture for modular scaling
• Cloud-native development for elastic scaling
• API-first design for easy integration
• Database optimization for performance at scale
• Load balancing and auto-scaling capabilities

Technology Choices:
• Modern, scalable frameworks and languages
• Cloud platforms (AWS, Google Cloud, Azure)
• Containerization with Docker and Kubernetes
• Serverless computing for cost-effective scaling
• CDN integration for global performance

Performance Optimization:
• Database indexing and query optimization
• Caching strategies (Redis, CDN)
• Code optimization and lazy loading
• Image and asset optimization
• Progressive Web App capabilities

Scalability Features:
• Horizontal and vertical scaling support
• Multi-tenant architecture where applicable
• Geographic distribution for global reach
• Automated scaling based on demand
• Performance monitoring and alerting

Future-Proofing:
• Modular code architecture
• Comprehensive API documentation
• Version control and backward compatibility
• Technology stack flexibility
• Regular updates and maintenance

Growth Support:
• Feature expansion capabilities
• Third-party integration readiness
• Multi-language and localization support
• Advanced analytics and reporting
• Enterprise-level security and compliance

We also provide:
• Scalability consulting and planning
• Performance optimization services
• Technology migration support
• Capacity planning and forecasting
• Growth strategy recommendations`,
      category: 'scalability'
    }
  ];

  const categories = [
    { id: 'company', name: 'Company & Services', icon: '🏢' },
    { id: 'technology', name: 'Technology & AI', icon: '🤖' },
    { id: 'services', name: 'Services & Process', icon: '⚙️' },
    { id: 'process', name: 'Development Process', icon: '📋' },
    { id: 'pricing', name: 'Pricing & Packages', icon: '💰' },
    { id: 'quality', name: 'Quality & Standards', icon: '✅' },
    { id: 'support', name: 'Support & Maintenance', icon: '🛠️' },
    { id: 'security', name: 'Security & Compliance', icon: '🔒' },
    { id: 'team', name: 'Team & Expertise', icon: '👥' },
    { id: 'success', name: 'Success Stories', icon: '🏆' },
    { id: 'communication', name: 'Communication', icon: '💬' },
    { id: 'scalability', name: 'Scalability & Growth', icon: '📈' }
  ];

  return (
    <>
      <HeroSpacer />
      {/* Hero Section */}
      <section className="stx-hero stx-faq-hero">
        <div className="stx-hero__content">
          <h1 className="stx-hero__title">Frequently Asked Questions</h1>
          <p className="stx-hero__subtitle">
            Everything you need to know about Statex, our services, and how we can help transform your business with AI-powered solutions.
          </p>
          <div className="stx-hero__cta">
            <a href="#faq-section" className="stx-button stx-button--primary">
              Explore Questions
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="stx-faq" id="faq-section">
        <div className="stx-container">
          <div className="stx-section-header">
            <h2 className="stx-section-title">Comprehensive Answers to Your Questions</h2>
            <p className="stx-section-subtitle">
              From technical details to business processes, find answers to all your questions about working with Statex
            </p>
          </div>

          <div className="stx-faq-container">
            {categories.map((category) => {
              const categoryFAQs = faqData.filter(faq => faq.category === category.id);

              return (
                <div key={category.id} className="stx-faq-category">
                  <h3 className="stx-faq-category-title">
                    {category.icon} {category.name}
                  </h3>
                  <div className="stx-faq-category-items">
                    {categoryFAQs.map((faq) => (
                      <div key={faq.id} className={`stx-faq-item ${activeItem === faq.id ? 'stx-faq-item--active' : ''}`}>
                        <button
                          className="stx-faq-question"
                          onClick={() => toggleFAQ(faq.id)}
                          aria-expanded={activeItem === faq.id}
                        >
                          <span>{faq.question}</span>
                          <span className="stx-faq-icon">
                            {activeItem === faq.id ? '−' : '+'}
                          </span>
                        </button>
                        <div className="stx-faq-answer">
                          <p>{faq.answer}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA Section */}
          <div className="stx-cta stx-faq-cta">
            <div className="stx-cta__content">
              <h3 className="stx-cta__title">Still Have Questions?</h3>
              <p className="stx-cta__description">
                Can't find the answer you're looking for? Our team is here to help. Get in touch with us for personalized assistance.
              </p>
              <div className="stx-cta__buttons">
                <a href="/contact" className="stx-button stx-button--primary">
                  Contact Us
                </a>
                <a href="/free-prototype" className="stx-button stx-button--secondary">
                  Get Free Prototype
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
