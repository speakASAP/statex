# System Architecture

## 🎯 Overview

Statex is built as a modern, scalable Progressive Web Application (PWA) with a microservices-oriented architecture and **composition-based template system**. The system is designed for high availability, security, and performance while serving the European Union market with multilingual support and cost-effective infrastructure.

## Choosing technologies
I don't care about complexity and learning curve at all. I am not afraid of it. We can use any technology.

I prefer complex technical solutions but fast and cost effective than more simple but expensive. My focus is also speed - not only costs.

## 🔗 Related Documentation

- [AI Agents Ecosystem](ai-agents.md) - Comprehensive AI agents documentation with infrastructure management
- [AI Implementation Master Plan](ai-implementation-master-plan.md) - Overall AI strategy
- [Technology Stack](technology.md) - Complete technology decisions and Milestone 6 infrastructure specifications
- [Infrastructure Implementation Guide](infrastructure-implementation.md) - Comprehensive technical implementation for microservices architecture
- [Milestone 6 Research Summary](milestone-6-research-summary.md) - Complete infrastructure research findings and decisions
- [PWA Requirements](pwa-requirements.md) - Progressive Web App features
- [SEO Documentation](seo.md) - Search engine optimization strategies
- [Frontend Documentation](frontend.md) - Frontend architecture details
- [Backend Documentation](backend.md) - Backend architecture details
- [PWA Requirements](pwa-requirements.md) - Progressive Web App specifications
- [EU Compliance](eu-compliance.md) - Legal and regulatory requirements
- [Client Portal](client-portal.md) - User management and authentication
- [Scheduled Tasks](scheduled-tasks.md) - Background job processing
- [Monitoring System](monitoring-system.md) - Sentry error tracking
- [Email System](email-system.md) - Amazon SES integration
- [Crypto Payments](crypto-payments.md) - Payment processing stack
- [AI Chat System](ai-chat-system.md) - 3-tier AI integration
- [Testing](testing.md) - Vitest testing framework
- [Template System Overview](templates/template-system-overview.md) - Complete guide to the modern template system
- [Template Builder Documentation](templates/template-builder.md) - TemplateBuilder pattern and usage
- [Section Components](templates/section-components.md) - All available section components
- [AB Testing Integration](templates/ab-testing.md) - AB testing with templates
- [Template Migration Guide](templates/migration-guide.md) - Migration from legacy templates
- [Template Performance](templates/performance.md) - Performance optimization and monitoring
- [Template Testing](templates/testing.md) - Testing strategies for templates
- [Development Plan](../../development-plan.md) - Complete project plan
- [Markdown-First Architecture Plan](markdown-first-architecture-plan.md) - Content architecture and rendering system

# **System Architecture**

Statex follows a modern microservices-inspired architecture with clear separation of concerns, cost-optimized infrastructure, and **composition-based template system**:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │  Backend API    │    │   Database      │
│   (Next.js 14)  │◄──►│   (Fastify)     │◄──►│ (PostgreSQL 15) │
│ + Template      │    │                 │    │                 │
│   System        │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  File Storage   │    │  AI Services    │    │  Cache & Queue  │
│ (Cloudflare R2) │    │ (3-Tier Stack)  │    │    (Redis)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Monitoring    │    │   Payments      │    │      CDN        │
│    (Sentry)     │    │ (Multi-gateway) │    │  (Cloudflare)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

# **Core Components**

## **Frontend Application**

* **Purpose**: User interface for chat interactions and file uploads with real-time AI prototype generation
* **Technology**: Next.js 14+ with TypeScript and Tailwind CSS
* **Features**: Voice chat, file upload, fast real-time responses, PWA capabilities
* **Build Tool**: Vite-powered Next.js for optimized builds and minimal page size
* **Testing**: Vitest + React Testing Library + Playwright
* **Template System**: **Composition-based templates** with AB testing support

### **Template System Architecture**
```typescript
const TEMPLATE_SYSTEM = {
  architecture: {
    pattern: 'Composition-based templates',
    builder: 'TemplateBuilder pattern',
    sections: 'Dynamic section registry',
    rendering: 'TemplateRenderer component',
    performance: 'Lazy loading with Suspense'
  },
  
  features: {
    ab_testing: 'Built-in AB testing support',
    themes: 'Multi-theme support (light, dark, EU, UAE)',
    responsive: 'Mobile-first responsive design',
    accessibility: 'WCAG 2.1 AA compliance',
    seo: 'Dynamic SEO optimization'
  },
  
  performance: {
    lazy_loading: 'Sections load only when needed',
    code_splitting: 'Template-specific code splitting',
    caching: 'Template component caching',
    optimization: 'Performance monitoring and optimization'
  }
};
```

### **Frontend Performance Targets**
- **Core Web Vitals**: LCP <2.5s, FID <100ms, CLS <0.1
- **Lighthouse Score**: 95+ across all metrics
- **Bundle Size**: <500KB compressed main bundle
- **Time to Interactive**: <3s on 3G networks
- **Template Performance**: <100ms template render time

## **Backend API**

* **Purpose**: High-performance API server handling business logic with 2-3x better performance
* **Technology**: **Fastify** with TypeScript (instead of Express)
* **Features**: File processing, 3-tier AI integration, automatic OpenAPI documentation
* **Process Management**: PM2 with cluster mode
* **Task Queue**: **BullMQ** for background job processing

### **Fastify Advantages**
- **Performance**: 65,000 req/sec vs Express 25,000 req/sec
- **Memory Efficiency**: 30% lower memory usage
- **TypeScript-First**: Built-in TypeScript support
- **JSON Performance**: 15-20% faster JSON operations
- **Schema Validation**: Built-in JSON schema validation
- **Auto Documentation**: OpenAPI generation from schemas

## **Database Layer**

* **Purpose**: Persistent data storage for chat history, user data, and AI-generated content
* **Technology**: PostgreSQL 15+ with Prisma ORM
* **Features**: JSONB for AI data, full-text search, ACID compliance
* **Backup**: Automated backup procedures with retention policies (user data deleted after use)

## **3-Tier AI Integration Layer**

* **Purpose**: Cost-optimized AI processing with compliance options and autonomous agent orchestration
* **Development**: **Ollama** (local, free testing)
* **Production Standard**: **OpenAI GPT-4** + Whisper
* **Production EU Compliance**: **Azure OpenAI** (EU data residency, 2x cost)
* **Features**: Voice recognition, Natural language processing, code generation
* **AI Agents**: **Specialized agents** for development, business intelligence, research, analytics, and conversational AI
* **Agent Communication**: Redis-based message queuing and BullMQ workflow orchestration
* **Caching**: Redis for AI response caching and cost optimization

### **AI Cost Optimization Strategy**
```typescript
const AI_ROUTING_STRATEGY = {
  development: {
    service: 'Ollama',
    cost: '$0 (hardware only)',
    use_case: 'Local development and testing'
  },
  production_standard: {
    service: 'OpenAI',
    cost: '$0.03/1K tokens',
    use_case: 'Standard client requests'
  },
  production_eu_compliance: {
    service: 'Azure OpenAI',
    cost: '$0.06/1K tokens',
    use_case: 'EU compliance required clients'
  }
};
```

# **Template System Architecture**

## **Composition-Based Template Design**

The template system follows a modern composition pattern that enables flexible page building with AB testing support:

### **Core Components**
- **TemplateBuilder**: Pattern for building templates with sections
- **TemplateRenderer**: Engine for rendering templates with sections
- **SectionRegistry**: Dynamic registry for section components
- **DynamicSection**: Component for rendering individual sections

### **Template System Benefits**
```typescript
const TEMPLATE_BENEFITS = {
  flexibility: {
    composition: 'Mix and match sections for any page layout',
    variants: 'Multiple variants for AB testing',
    themes: 'Theme support across all templates'
  },
  
  performance: {
    lazy_loading: 'Sections load only when needed',
    code_splitting: 'Template-specific code splitting',
    caching: 'Template component caching'
  },
  
  maintainability: {
    modular: 'Each section is independent and reusable',
    testing: 'Individual section testing',
    documentation: 'Comprehensive template documentation'
  },
  
  seo: {
    dynamic: 'Dynamic SEO optimization per template',
    structured_data: 'Automatic schema markup generation',
    performance: 'Template-specific performance optimization'
  }
};
```

### **AB Testing Integration**
- **Built-in Support**: Native AB testing capabilities
- **Variant Management**: Multiple template variants
- **Performance Tracking**: Template-specific performance metrics
- **Conversion Optimization**: AB testing for conversion optimization

# **Data Flow**

## **User Request Processing**

1. **Frontend**: User submits text/audio/files message  
2. **API Gateway**: Fastify request validation and authentication  
3. **Rate Limiting**: Restrictive rate limiting (2 requests/user/24h)
4. **File Processing**: Audio files converted and stored, other files processed
5. **AI Service**: Message analyzed via appropriate AI tier (Ollama/OpenAI/Azure)
6. **BullMQ**: Background job processing for long-running AI tasks
7. **Database**: Interaction logged for history  
8. **Response**: AI response returned to frontend

## **Template Rendering Flow**

1. **Page Request**: User requests a page
2. **Template Selection**: TemplateBuilder selects appropriate template
3. **Section Loading**: DynamicSection loads sections with lazy loading
4. **AB Testing**: AB test variants applied if active
5. **Performance Monitoring**: Template render performance tracked
6. **SEO Optimization**: Dynamic SEO applied to template
7. **Response**: Fully rendered page returned to user

## **File Upload Flow**

1. **Frontend**: User selects files for upload  
2. **Validation**: File type and size validation (max 50MB total)
3. **Progress**: User sees progress bar while waiting for upload/response
4. **Storage**: Files saved to Cloudflare R2 (cost-optimized)
5. **Processing**: Files analyzed for content extraction  
6. **Database**: File metadata stored (files deleted after processing)
7. **Notification**: Upload confirmation sent to user

## **Payment Processing Flow**

1. **User Selection**: Choose payment method (Stripe/PayPal/Crypto/Comgate)
2. **Gateway Routing**: Route to appropriate payment processor
3. **Processing**: Handle payment through selected gateway
4. **Confirmation**: Store payment confirmation and update user status
5. **Service Activation**: Enable premium features or EU compliance AI tier

# **Security Architecture**

## **Authentication & Authorization**

* NextAuth.js-based token authentication with OAuth providers
* Role-based access control for premium features
* Session management with secure cookies stored in Redis

## **Rate Limiting Strategy**

* **Business Model Alignment**: Matches "request → response → single update" flow
* **Per User**: Maximum 2 AI requests per user per 24 hours
* **Per IP**: Maximum 5 requests per IP per 24 hours (multiple users)
* **File Upload**: Maximum 10 files per request, 50MB total size
* **Implementation**: Fastify rate-limit plugin with Redis storage

## **Input Validation**

* JSON schema validation for all API inputs with Fastify built-in validation
* File type and size restrictions enforced at multiple levels
* SQL injection and XSS prevention with Prisma ORM

## **Data Protection**

* Encrypted data transmission (HTTPS with Let's Encrypt)
* Secure file upload handling with type validation
* Database connection encryption
* **No Long-term File Storage**: User uploads deleted after processing

# **Performance Considerations**

## **Caching Strategy**

* **API Response Caching**: Redis for frequent API responses
* **AI Response Caching**: Cache expensive AI operations
* **CDN Integration**: Cloudflare for global content delivery
* **Database Query Caching**: Prisma query result caching
* **Template Caching**: Template component caching for performance

## **Database Optimization**

* Strategic indexing for frequent AI data queries
* JSONB indexes for AI-generated content searches
* Connection pooling for efficiency with Prisma
* Query optimization and monitoring

## **File Handling**

* Lazy loading for large files with Next.js Image optimization
* Image optimization (WebP/AVIF formats) via Cloudflare
* Compressed asset delivery through CDN
* CSS and JS minification with Vite
* Remove unused code and styles automatically

# **Scalability Design**

## **Horizontal Scaling**

* Stateless Fastify API design for easy replication
* Load balancer configuration support with Nginx
* Database read replicas for improved performance
* Redis cluster support for cache distribution

## **Vertical Scaling**

* Efficient memory usage patterns with Fastify
* CPU optimization for AI processing tasks
* Storage optimization strategies with Cloudflare R2

## **Monitoring & Alerting**

* **Sentry Integration**: Comprehensive error tracking and performance monitoring
* **Application Metrics**: API response times, error rates, AI processing times
* **Business Metrics**: Conversion rates, AI usage costs, user satisfaction
* **Infrastructure Monitoring**: Server resources, database performance

# 🛠 Technology Stack Implementation

## Frontend Technology (Next.js 14+ PWA)
- **Framework**: Next.js 14+ with App Router and TypeScript
- **Styling**: Tailwind CSS for utility-first styling and rapid development
- **UI Components**: Headless UI + Custom components
- **State Management**: React Context + useState (upgrade to Zustand if complexity grows)
- **Authentication**: NextAuth.js with OAuth providers (Google, Facebook, GitHub, Email)
- **PWA Features**: Service workers, offline support, push notifications
- **Internationalization**: 9 languages (EN, DE, FR, IT, ES, NL, CS, PL, RU) + Arabic
- **Forms**: React Hook Form with Zod validation
- **Data Fetching**: TanStack Query for server state management
- **Testing**: **Vitest** + React Testing Library + Playwright

## Backend Technology (Node.js/Fastify)
- **Runtime**: Node.js 18+ LTS with TypeScript
- **Framework**: **Fastify** with comprehensive plugins and TypeScript-first approach
- **API Design**: RESTful JSON APIs with automatic OpenAPI documentation
- **Process Management**: PM2 for production process management
- **Task Queue**: **BullMQ** with Redis for background jobs
- **Email Service**: Nodemailer (dev) + **Amazon SES (production)** (cost-optimized, 90% cheaper than alternatives)
- **File Storage**: Local filesystem (dev) + **Cloudflare R2** (production, 66% cheaper than AWS S3)
- **Security**: Fastify built-in security plugins, CORS, rate limiting, input validation

## Database Technology (PostgreSQL + Redis)
- **Primary Database**: PostgreSQL 15+ with Prisma ORM
- **Cache Layer**: Redis for sessions, caching, and BullMQ task queues
- **Connection Pooling**: Prisma connection pooling for efficiency
- **Backup Strategy**: Automated daily backups (user files deleted after processing)
- **Search**: PostgreSQL full-text search with GIN indexes
- **Monitoring**: Database performance monitoring with Sentry integration

## AI Integration (3-Tier Strategy)
- **Development**: **Ollama** for local, free AI testing (codellama, mistral, llama2)
- **Production Standard**: **OpenAI GPT-4** for complex tasks, Whisper for speech ($0.03/1K tokens)
- **Production EU Compliance**: **Azure OpenAI** with EU data residency ($0.06/1K tokens)
- **Fallback**: Multiple AI provider support for redundancy
- **Cost Optimization**: Intelligent routing based on task complexity and compliance requirements
- **Local Processing**: Option for local Whisper deployment
- **Response Format**: JSON APIs for cross-platform compatibility

## Payment Processing Stack
- **Primary Gateway**: **Stripe** (EU compliant, extensive features)
- **Alternative Gateway**: **PayPal** (wide acceptance, buyer protection)
- **Cryptocurrency**: **Coinbase Commerce** + **BTCPay Server** (self-hosted option) + crypto QR code payments
- **EU-Specific**: **Comgate** (Czech/EU focused payment gateway)
- **QR Code Payments**: Support for bank QR code payments

## Infrastructure & Monitoring
- **CDN**: **Cloudflare** (cheapest with excellent EU/UAE coverage, DDoS protection)
- **Monitoring**: **Sentry** with EU hosting for error tracking and performance monitoring
- **Analytics**: **Google Analytics 4** with GDPR compliance configuration
- **Containerization**: Docker + Docker Compose for consistent environments
- **Web Server**: Nginx with HTTP/2 and HTTP/3 support
- **SSL**: Let's Encrypt with automatic renewal
- **Rate Limiting**: Fastify rate-limit plugin with Redis storage

# **Development Principles**

## **Code Organization**

* Modular design with clear boundaries using Fastify plugins
* Dependency injection for testability with Fastify decorators
* Configuration-driven behavior with environment variables
* Environment-specific settings with robust .env management

## **Testing Strategy**

* **Unit Tests**: Vitest for fast JavaScript/TypeScript unit tests
* **Integration Tests**: Supertest with Fastify for API endpoint testing
* **End-to-End Tests**: Playwright for critical user workflows
* **Performance Testing**: Lighthouse CI for performance regression testing
* **Coverage Target**: 80% minimum code coverage for business logic

## **Documentation Standards**

* Clear documentation structure with cross-references
* Comprehensive API documentation with automatic OpenAPI generation
* Code comments for complex logic, especially AI integration
* Architecture decision records for major technology choices
* Deployment and maintenance guides
* Cross links between docs for easy navigation
* Changelog with task details and key decision points with reasoning
* Roadmap and task plans with regular updates
* Every document must contain description, reasoning, and plans for tracking tasks implementation

# **Future Considerations**

## **Planned Enhancements**

* Real-time WebSocket communication for live AI responses
* Advanced caching mechanisms with edge computing
* Microservices decomposition for high-load AI components
* Container orchestration (Kubernetes) for enterprise scale

## **Technology Evolution**

* GraphQL API evaluation for complex data fetching
* Serverless function integration for edge computing
* Edge computing optimization with Cloudflare Workers
* PostgreSQL vector extensions for advanced AI features

# **Deployment Architecture**

## **Development Environment**

* Local development with hot reloading (Vitest HMR, Next.js, Fastify watch mode)
* Docker containers for consistency across team
* Environment variable management with .env.development
* Development database seeding with sample data
* Detailed logging with Fastify built-in logger (Pino)
* Comprehensive testing with Vitest + Playwright
* **Cost**: $0 (local development with Ollama)

## **Production Environment**

* Live environment serving end users with high performance
* Nginx reverse proxy configuration with load balancing
* Docker containers with optimized images
* PM2 process management with cluster mode
* SSL certificate automation with Let's Encrypt
* Monitoring and alerting setup with Sentry
* Environment variables from .env.production
* **Estimated Monthly Cost**: $150-200 (including all services)

## **Cost-Optimized Infrastructure**

* **File Storage**: Cloudflare R2 (~$15/month vs AWS S3 $45/month)
* **Email Service**: Amazon SES (~$10/month vs Mailgun $80/month)
* **CDN**: Cloudflare (~$20/month vs AWS CloudFront $85/month)
* **Monitoring**: Sentry (~$25/month for team plan)
* **AI Services**: Intelligent routing for cost optimization

## **Microservices Docker Strategy**

### **Container Architecture (Possibility A: Microservices)**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Frontend       │    │  Backend API    │    │   Database      │
│  (Next.js 14)   │    │   (Fastify)     │    │ (PostgreSQL 15) │
│  Container      │    │   Container     │    │   Container     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Redis Cache    │    │  nginx Load     │    │  nginx Static   │
│  Container      │    │  Balancer       │    │  Assets         │
│                 │    │  Container      │    │  Container      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

**Decision**: **Microservices approach with separate containers for each service (frontend, Fastify backend, PostgreSQL, Redis, nginx) for better scalability and isolation**

### **Development Environment (Phase 1)**
- **Container Strategy**: Development containers with debugging tools and hot reload capabilities + Identical containers with environment-based configuration
- **Local Optimization**: Local servers for initial price optimization
- **Development Tools**: Hot reload, debugging ports, development databases
- **AI Development**: Ollama local integration for cost-free development

### **Production Environment (Future Phase)**
- **Container Strategy**: Development containers with debugging tools + Optimized production containers with minimal attack surface
- **Security**: Minimal containers, no debugging tools, optimized images
- **Performance**: Stripped containers for maximum efficiency

## **nginx Multi-Instance Strategy**

### **Progressive HTTP Protocol Enhancement**
```typescript
const NGINX_PROTOCOL_STRATEGY = {
  progressive_enhancement: {
    strategy: 'HTTP/2 → HTTP/3 with adaptive protocol selection',
    implementation: [
      '1. Start with normal HTTP/2 requests for fast loading',
      '2. Make parallel test requests to detect HTTP/3 capability',
      '3. If HTTP/3 supported: switch to Full HTTP/3 with QUIC protocol',
      '4. If HTTP/3 not supported: maintain client-supported protocol level',
      '5. If HTTP/2 not supported: maintain client-supported protocol level'
    ]
  },
  
  multiple_nginx_instances: {
    strategy: 'Multiple specialized nginx instances + additional load balancer',
    goal: 'Achieve documented 65k req/sec target with Fastify',
    architecture: [
      'Load Balancer nginx → Routes traffic to specialized instances',
      'Static Assets nginx → Optimized for file serving',
      'API Proxy nginx → Optimized for Fastify backend communication',
      'SSL Termination nginx → Handles certificate management'
    ],
    benefits: ['Better fault tolerance', 'Optimized performance per use case', 'Enhanced scalability']
  }
};
```

**Decision**: **Multiple specialized nginx instances for different traffic types + additional load balancer for advanced traffic management to achieve 65k req/sec target with better fault tolerance**

### **SSL Certificate Automation**
- **Strategy**: Let's Encrypt with automated renewal via certbot
- **Implementation**: nginx-level HTTPS redirect with HSTS headers
- **Management**: Automated certificate provisioning and renewal

## **AI-Powered Infrastructure Management**

### **AI agents for Infrastructure**
```typescript
const AI_INFRASTRUCTURE_AGENTS = {
  self_healing: {
    agent: 'Infrastructure Healing Agent',
    capabilities: ['Automatic issue detection', 'Self-repair mechanisms', 'Preventive maintenance'],
    models: ['Custom monitoring models', 'Predictive analytics', 'Decision trees']
  },
  
  auto_scaling: {
    agent: 'Workload Prediction Agent', 
    capabilities: ['AI workload prediction', 'Resource scaling', 'Cost optimization'],
    intelligence: 'Learn usage patterns for smart scaling decisions'
  },
  
  monitoring_prediction: {
    agent: 'Predictive Monitoring Agent',
    capabilities: ['Issue prediction', 'Performance forecasting', 'Preventive alerts'],
    advantage: 'Prevent issues before they occur'
  }
};
```

**Decision**: **Use the documented AI agents to manage infrastructure with self-healing capabilities, automated scaling based on AI workload prediction, and AI monitoring that predicts and prevents issues**

## **Cost-Optimized Multi-Region Architecture**

### **EU + UAE Multi-Region Strategy**
```typescript
const MULTI_REGION_STRATEGY = {
  regions: {
    eu_primary: {
      location: 'Prague/Frankfurt',
      services: ['Primary infrastructure', 'GDPR-compliant processing'],
      ai_tier: 'Azure OpenAI (EU compliance) + OpenAI standard'
    },
    
    uae_edge: {
      location: 'Dubai/Abu Dhabi', 
      services: ['Edge computing', 'Region-specific AI processing'],
      ai_optimization: 'Local AI processing for reduced latency'
    }
  },
  
  edge_computing: {
    strategy: 'Region-specific AI processing',
    benefits: ['Reduced latency', 'Cultural optimization', 'Local compliance'],
    implementation: 'Cloudflare Workers + regional AI models'
  }
};
```

**Decision**: **Multi-region deployment (EU + UAE) + Edge computing with region-specific AI processing for optimal performance**

## **Smart Cost Optimization**

### **Intelligent Resource Scheduling**
```typescript
const SMART_SCHEDULING = {
  european_hours: {
    peak: '09:00-18:00 CET',
    strategy: 'Full resource allocation during European business hours',
    scaling: 'AI-predicted scaling 30 minutes before peak'
  },
  
  off_peak: {
    hours: '19:00-08:00 CET + weekends',
    strategy: 'Reduced resource allocation, maintenance windows',
    optimization: 'Background AI processing, system updates'
  },
  
  cost_impact: {
    savings: 'Significantly reduce costs while maintaining peak performance',
    intelligence: 'AI agents learn patterns and optimize automatically'
  }
};
```

**Decision**: **Smart scheduling to significantly reduce costs while maintaining performance during peak hours, with AI agents managing optimization automatically**

## **Testing and CI/CD Innovation**

### **Ultra-Fast CI/CD with Vitest**
- **Strategy**: Leverage Vitest's 10x performance advantage for ultra-fast CI/CD pipelines
- **AI Testing**: Mock AI services for fast testing during development
- **Deployment**: Canary deployment with AI-powered performance monitoring

### **Dynamic Environment Provisioning**
- **Strategy**: Dynamic environment provisioning based on feature branches
- **Optimization**: Cost-effective resource allocation
- **AI Management**: AI agents handle environment lifecycle

## **Flexible GDPR Compliance**

### **User-Controlled Privacy Settings**
```typescript
const FLEXIBLE_GDPR = {
  user_choice: {
    gdpr_enabled: {
      description: 'Standard GDPR protection',
      data_processing: 'Minimal, anonymized',
      ai_capability: 'Basic analysis only'
    },
    
    gdpr_disabled: {
      description: 'Enhanced personalization mode', 
      data_processing: 'Detailed research and analysis',
      ai_capability: 'Deep company and user research for accurate design',
      user_benefit: 'More accurate and personalized results'
    }
  },
  
  implementation: {
    user_control: 'User can switch GDPR compliance on/off',
    transparency: 'Clear explanation of data usage differences',
    business_value: 'Better results with enhanced data processing'
  }
};
```

**Decision**: **Flexible architecture with compliance overlays - Users can disable GDPR to allow enhanced data research for more accurate results**

## **Performance-First Architecture**

### **Maximum Performance Priority (65k req/sec)**
- **Cutting-Edge Technology**: HTTP/3, latest containers, modern frameworks
- **Performance Monitoring**: Real-time performance tracking with AI optimization
- **Resource Allocation**: Performance-optimized over stability

### **Full Automation Strategy**
- **Single-Person Team**: Complete automation with AI agents
- **Self-Hosted AI**: Use own environment for monitoring and healing
- **Autonomous Operations**: AI agents handle routine operations

---

This **performance-first, AI-powered, cost-optimized architecture** provides cutting-edge capabilities while maintaining cost efficiency through intelligent automation and resource management.

# **Monitoring & Observability**

## **Logging Strategy**

* Structured logging with Fastify's built-in Pino logger
* Centralized log aggregation with Sentry
* Log rotation and retention policies
* Error tracking and alerting with real-time notifications
* Performance metric collection and analysis

## **Health Checks**

* Application health endpoints with Fastify health check plugin
* Database connectivity monitoring with Prisma
* External service availability checks (AI APIs, payment gateways)
* Resource usage monitoring and alerting

## **Backups**

* **Database**: Automated daily PostgreSQL backups
* **User Uploads**: No backups (files deleted after processing per business model)
* **Configuration**: Infrastructure as Code backups
* **Disaster Recovery**: Documented recovery procedures

**Security Checklist**

* SSL certificate installed and auto-renewal configured with Let's Encrypt
* Firewall configured to allow only necessary ports
* Strong passwords for database users with proper authentication
* Environment variables secured and encrypted
* Regular security updates scheduled and automated
* Log monitoring in place with Sentry alerts
* Backup and recovery procedures tested
* Rate limiting configured with business-aligned restrictions
* CORS properly configured for API endpoints

**Success metrics**

* Page load time < 2s (targeting <1.5s with optimizations)
* 100% mobile responsiveness with PWA features
* 99.9% uptime with redundancy and monitoring
* < 1% form submission error rate
* Positive user feedback on prototype quality
* **Cost Efficiency**: 60-70% reduction in infrastructure costs vs traditional stack

# **AI prototyping**

## **Get the terms of reference from user**

* Get as much information as possible regarding task via order form and through AI chat
* Create comprehensive documentation automatically
* Create realization plan with AI assistance
* Make coding with appropriate AI tier (Ollama/OpenAI/Azure)

## **Hosting solution**

* Organize our server hosting with cost-optimized infrastructure
* Sandbox implementation with containerized environments
* Deploy results in our subdomain. For example on [result1234.statex.cz](http://result1234.statex.cz)
* Automatic cleanup of prototype environments after specified time

## **Customer communication**

* Inform the customer about results via multiple channels
* Get notices and feedback through integrated communication system
* Update prototype based on single allowed modification per business model
* Track satisfaction and improve AI responses based on feedback

**Rate Limiting Implementation**

* **Business Flow Alignment**: Request → Response → Single Update cycle
* **Cost Control**: Prevent AI API abuse with restrictive limits
* **User Limits**: 2 requests per user per 24 hours maximum
* **IP Limits**: 5 requests per IP per 24 hours (multiple users)
* **File Limits**: 10 files maximum, 50MB total size per request
* **Implementation**: Fastify rate-limit plugin with Redis storage for distributed limiting

