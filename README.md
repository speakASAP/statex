# StateX - AI-Powered Business Automation Platform

## 🎯 **Overview**

StateX is a comprehensive **AI-powered business automation platform** that provides rapid prototype generation, intelligent analysis, and comprehensive business solutions for the EU and UAE markets. Built on a modern microservices architecture, StateX transforms business ideas into digital solutions through AI agents and automated workflows.

## 🏗️ **Architecture Overview**

StateX follows a **distributed microservices architecture** with clear separation of concerns, enabling scalability, maintainability, and independent deployment of services.

```text
┌─────────────────────────────────────────────────────────────────┐
│                        StateX Ecosystem                         │
├─────────────────────────────────────────────────────────────────┤
│  Frontend Layer                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   Website       │  │   Admin Panel   │  │   Mobile App    │  │
│  │   (Next.js)     │  │   (React)       │  │   (React Native)│  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│  API Gateway & Infrastructure                                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   Nginx         │  │   SSL/TLS       │  │   Load Balancer │  │
│  │   Reverse Proxy │  │   Certificates  │  │   (HAProxy)     │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│  Platform Services (Orchestration Layer)                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   StateX        │  │   Monitoring    │  │   Infrastructure│  │
│  │   Platform      │  │   Service       │  │   Management    │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│  Business Services (Core Functionality)                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   AI Services   │  │   Notification  │  │   Website       │  │
│  │   (statex-ai)   │  │   Service       │  │   (statex-      │  │
│  │                 │  │                 │  │    website)     │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│  Infrastructure Services (Data & Communication)                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   PostgreSQL    │  │   Redis         │  │   RabbitMQ      │  │
│  │   (Database)    │  │   (Cache)       │  │   (Message      │  │
│  │                 │  │                 │  │    Queue)       │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## 📁 **Microservices Architecture**

### **1. StateX Platform** (`statex-platform`)

**Purpose**: Central orchestration and management hub
**Repository**: `git@github.com:speakASAP/statex-platform.git`
**Ports**: 8000 (Platform Management), 8001 (API Gateway)

**Responsibilities**:

- Central orchestration and coordination of all microservices
- API Gateway for unified service access
- Integration with external services
- Management of AI services and notification service

**Key Services**:

- **Platform Management** (8000): Central orchestration and coordination
- **API Gateway** (8001): Unified API access point for all services

**Technology Stack**:

- FastAPI (Python)
- PostgreSQL (Database)
- Redis (Cache)
- RabbitMQ (Message Queue)
- Docker & Docker Compose

---

### **2. StateX AI** (`statex-ai`)

**Purpose**: AI processing and intelligent analysis
**Repository**: `git@github.com:speakASAP/statex-ai.git`
**Ports**: 8010-8017
**Management**: Orchestrated by statex-platform

**Responsibilities**:

- AI workflow orchestration
- Natural language processing
- Speech-to-text conversion
- Document analysis and OCR
- Prototype generation
- Template management
- AI worker management

**AI Services**:

- **AI Orchestrator** (8010): Central coordination
- **NLP Service** (8011): Text analysis and generation
- **ASR Service** (8012): Speech-to-text conversion
- **Document AI** (8013): File processing and OCR
- **Prototype Generator** (8014): Website/app creation
- **Template Repository** (8015): Template management
- **Free AI Service** (8016): Ollama, Hugging Face models
- **AI Workers** (8017): AI processing agents

**Technology Stack**:

- FastAPI (Python)
- OpenAI GPT-4, Anthropic Claude
- Ollama (Local LLM)
- Hugging Face API
- Tesseract OCR, Unstructured
- Next.js (Admin Panel)

---

### **3. StateX Notification Service** (`statex-notification-service`)

**Purpose**: Multi-channel communication hub
**Repository**: `git@github.com:speakASAP/statex-notification-service.git`
**Port**: 8005
**Management**: Orchestrated by statex-platform

**Responsibilities**:

- Email notifications (SMTP)
- WhatsApp Business API integration
- Telegram Bot API integration
- Notification templates and formatting
- Delivery tracking and analytics

**Supported Channels**:

- 📧 **Email**: StateX mailserver (<contact@statex.cz>)
- 📱 **WhatsApp**: WhatsApp Business API
- ✈️ **Telegram**: Telegram Bot API

**Technology Stack**:

- FastAPI (Python)
- SMTP (Email)
- WhatsApp Business API
- Telegram Bot API
- Docker & Docker Compose

---

### **4. StateX Website** (`statex-website`)

**Purpose**: Frontend website and core business services
**Repository**: `git@github.com:speakASAP/statex-website.git`
**Ports**: 3000 (Frontend), 8002 (Submission Service), 8006 (User Portal), 8009 (Content Service)
**Management**: Self-managed with orchestration support from statex-platform

**Responsibilities**:

- Main website (statex.cz)
- Contact forms and user interaction
- Content management and blog
- User portal and authentication
- Form submission processing
- SEO optimization
- Static site generation

**Components**:

- **Frontend** (3000): Next.js with TypeScript
- **Submission Service** (8002): Form submission and file handling
- **User Portal** (8006): User management and authentication
- **Content Service** (8009): Content management and blog
- **Content**: Blog posts, pages, documentation
- **Design System**: Component library

**Technology Stack**:

- Next.js (React/TypeScript)
- Node.js/Fastify (Backend)
- Prisma (Database ORM)
- Tailwind CSS (Styling)

---

### **5. StateX Infrastructure** (`statex-infrastructure`)

**Purpose**: Infrastructure and SSL management
**Repository**: `git@github.com:speakASAP/statex-infrastructure.git`
**Ports**: 80 (HTTP), 443 (HTTPS)

**Responsibilities**:

- Nginx reverse proxy and load balancing
- SSL certificate management (Let's Encrypt)
- Domain routing and virtual hosts
- Static content serving
- Security headers and policies

**Features**:

- **Development**: Self-signed certificates
- **Production**: Let's Encrypt certificates
- **Automatic Renewal**: Certificate auto-renewal
- **Rate Limit Protection**: Persistent certificate storage

**Technology Stack**:

- Nginx (Reverse Proxy)
- Let's Encrypt (SSL Certificates)
- Docker & Docker Compose
- ACME Protocol (Certificate Management)

---

### **6. StateX Monitoring** (`statex-monitoring`)

**Purpose**: Comprehensive monitoring and observability
**Repository**: `git@github.com:speakASAP/statex-monitoring.git`
**Ports**: 3002 (Grafana), 3100 (Loki), 3102 (Loki Direct), 8081 (cAdvisor), 9090 (Prometheus), 9093 (AlertManager), 9100 (Node Exporter), 9115 (Blackbox Exporter), 16686 (Jaeger), 8007 (Monitoring Service), 8008 (Logging Service)
**Management**: Orchestrated by statex-platform

**Responsibilities**:

- System and application metrics collection
- Log aggregation and analysis
- Distributed tracing
- Alerting and notification
- Performance monitoring
- AI agent monitoring
- Centralized logging

**Monitoring Stack**:

- **Prometheus** (9090): Metrics collection and storage
- **Grafana** (3002): Visualization and dashboards
- **Loki** (3100): Log aggregation
- **Jaeger** (16686): Distributed tracing
- **AlertManager** (9093): Alert routing
- **Monitoring Service** (8007): Custom monitoring for AI agents
- **Logging Service** (8008): Centralized logging and audit trails

**Technology Stack**:

- Prometheus (Metrics)
- Grafana (Visualization)
- Loki (Logs)
- Jaeger (Tracing)
- Docker & Kubernetes

## 🔄 **Data Flow Architecture**

### **User Submission Workflow**

```text
1. User visits statex.cz (Website)
2. Fills contact form with text, voice, files
3. Form submission → StateX Platform (API Gateway)
4. Platform routes to AI Services (statex-ai)
5. AI agents process submission:
   - ASR Service: Voice → Text
   - Document AI: File analysis
   - NLP Service: Text analysis
   - Free AI Service: Business analysis
6. AI Orchestrator combines results
7. Notification Service sends updates via Telegram/Email/WhatsApp
8. Admin Panel for human review (optional)
9. Final results delivered to user
```

### **AI Processing Pipeline**

```text
User Input → AI Orchestrator → Parallel AI Processing:
├── Free AI Service (Ollama/Hugging Face)
├── NLP Service (OpenAI/Anthropic)
├── ASR Service (Whisper)
├── Document AI (OCR/Unstructured)
└── Template Repository (Matching)

→ Results Aggregation → Notification Service → User
```

## 🚀 **Quick Start**

### **Prerequisites**

- Docker and Docker Compose
- Node.js 23.11.0 (for frontend development)
- Python 3.11 (for backend development)
- Git
- Domain name (for production)
- API keys (OpenAI, WhatsApp, Telegram)

### **⚡ Optimized Development Setup (2-3 minutes)**

StateX now uses a **hybrid Docker + Local development approach** for maximum speed:

```bash
# Clone all repositories
git clone git@github.com:speakASAP/statex-platform.git
git clone git@github.com:speakASAP/statex-ai.git
git clone git@github.com:speakASAP/statex-notification-service.git
git clone git@github.com:speakASAP/statex-website.git
git clone git@github.com:speakASAP/statex-infrastructure.git
git clone git@github.com:speakASAP/statex-monitoring.git

# Quick start with optimized development environment
cd statex-platform
cp ../env.development.template .env.development
# Edit .env.development with your API keys

# Start all services (infrastructure in Docker + apps with volume mounts)
./dev-manage.sh start

# Access your services:
# - Website: http://localhost:3000
# - API Gateway: http://localhost:8001
# - AI Orchestrator: http://localhost:8010
# - Grafana: http://localhost:3002
```

### **🔧 Development Management**

**New optimized development workflow:**

- **Start all services**: `./dev-manage.sh start` (2-3 minutes vs 1+ hour)
- **Start individual service**: `./dev-manage.sh dev [service-name]`
- **Stop all services**: `./dev-manage.sh stop`
- **Check status**: `./dev-manage.sh status`
- **View logs**: `./dev-manage.sh logs [service]`
- **Health check**: `./dev-manage.sh health`

**Legacy production management:**

- **Start all services**: `./manage.sh start` (for production-like testing)
- **Stop all services**: `./manage.sh stop`
- **Check status**: `./manage.sh status`
- **View logs**: `./manage.sh logs`
- **Health check**: `./manage.sh health`

### **🚀 Development Optimization Benefits**

The new hybrid development approach provides significant improvements:

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| **Startup Time** | 60+ minutes | 2-3 minutes | **20x faster** |
| **Code Changes** | 20+ minutes | Instant | **∞ faster** |
| **Resource Usage** | ~4GB RAM | ~1GB RAM | **75% reduction** |
| **File System** | Docker overlay | Native | **5-10x faster** |

**Architecture:**

- **Infrastructure Services**: Docker (Postgres, Redis, RabbitMQ, MinIO, Nginx)
- **Application Services**: Volume mounts with hot reload (Frontend, AI, Backend)
- **Best of Both Worlds**: Containerization benefits + development speed

### **Production Deployment**

```bash
# Deploy infrastructure
cd statex-infrastructure
make prod

# Deploy all services
cd statex-platform
make deploy-prod
```

## 📊 **Monitoring & Observability**

### **Key Metrics**

- **System Performance**: CPU, memory, disk usage
- **Application Metrics**: Request rates, response times, error rates
- **Business Metrics**: User submissions, AI processing time, notification delivery
- **AI Agent Performance**: Processing time, success rates, model accuracy

### **Dashboards**

- **Platform Overview**: System health and performance
- **AI Services**: AI agent performance and accuracy
- **Business Metrics**: User engagement and conversion
- **Infrastructure**: Resource usage and capacity

### **Alerting**

- **Critical**: Service down, high error rates
- **Warning**: High response times, resource usage
- **Info**: Deployments, capacity planning

## 🔒 **Security**

### **Authentication & Authorization**

- JWT tokens for API authentication
- OAuth 2.0 for third-party integration
- Role-based access control (RBAC)
- Multi-factor authentication (MFA)

### **Data Protection**

- Encryption at rest and in transit
- GDPR compliance for EU users
- PII handling and anonymization
- Comprehensive audit logging

### **Network Security**

- TLS/SSL for all communications
- mTLS for service-to-service communication
- Network segmentation
- DDoS protection

## 🌍 **Deployment Environments**

### **Development**

- Local Docker Compose
- Self-signed SSL certificates
- Mock external services
- Debug logging enabled

### **Staging**

- Kubernetes cluster
- Let's Encrypt certificates
- Production-like configuration
- Performance testing

### **Production**

- Multi-region Kubernetes
- High availability setup
- Production SSL certificates
- Monitoring and alerting

## 📈 **Scaling Strategy**

### **Horizontal Scaling**

- Microservices can scale independently
- Load balancing across multiple instances
- Database read replicas
- CDN for static content

### **Vertical Scaling**

- Resource optimization per service
- Memory and CPU tuning
- Database query optimization
- Caching strategies

## 🤝 **Contributing**

### **Development Workflow**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests and documentation
5. Submit a pull request

### **Code Standards**

- Python: PEP 8, type hints, docstrings
- TypeScript: ESLint, Prettier
- Docker: Multi-stage builds, security scanning
- Documentation: Markdown, API documentation

## 📚 **Documentation**

### **Service Documentation**

- [StateX Architecture diagram](./ARCHITECTURE_DIAGRAM.md)
- [StateX Platform](./statex-platform/README.md)
- [StateX AI](./statex-ai/README.md)
- [StateX Notification Service](./statex-notification-service/README.md)
- [StateX Website](./statex-website/README.md)
- [StateX Infrastructure](./statex-infrastructure/README.md)
- [StateX Monitoring](./statex-monitoring/README.md)

### **Architecture Documentation**

- [Complete Architecture Diagram](./ARCHITECTURE_DIAGRAM.md) - Visual representation of all services and their relationships

### **AI & Workflow Documentation**

- [AI Providers Configuration](./docs/development/ai-providers.md) - Complete guide to AI providers, model selection, and configuration
- [Multi-Agent Workflow System](./docs/development/multi-agent-workflow.md) - Detailed documentation of the multi-agent workflow system
- [Workflow Order and Dependencies](./docs/development/workflow-order.md) - Workflow execution order and dependency management
- [Contact Types and User Identification](./docs/development/contact-types.md) - Support for email, LinkedIn, WhatsApp, and Telegram contacts
- [OpenRouter Setup Guide](./docs/OPENROUTER_SETUP_GUIDE.md) - Step-by-step OpenRouter integration guide
- [Quick Reference Guide](./docs/development/quick-reference.md) - Quick access to common tasks and configurations

### **API Documentation**

- **API Gateway**: <http://localhost:8001> (unified access to all services)
- **Platform Management**: <http://localhost:8000/docs>
- **AI Orchestrator**: <http://localhost:8010/docs>
- **Notification Service**: <http://localhost:8005/docs>
- **Submission Service**: <http://localhost:8002/docs> (managed by statex-website)
- **User Portal**: <http://localhost:8006/docs> (managed by statex-website)
- **Content Service**: <http://localhost:8009/docs> (managed by statex-website)
- **Monitoring Service**: <http://localhost:8007/docs>
- **Logging Service**: <http://localhost:8008/docs>

### **Service Access URLs**

- **Website**: <http://localhost:${FRONTEND_PORT:-3000}>
- **API Gateway**: <http://localhost:8001>
- **Grafana**: <http://localhost:3002> (admin/statex123)
- **Prometheus**: <http://localhost:9090>
- **Jaeger**: <http://localhost:16686>
- **Loki**: <http://localhost:3100>
- **cAdvisor**: <http://localhost:8081>

## 🆘 **Support**

### **Getting Help**

- **Documentation**: [docs.statex.cz](https://docs.statex.cz)
- **Issues**: GitHub Issues in respective repositories
- **Email**: <support@statex.cz>
- **Slack**: #statex-support

### **Emergency Support**

- **Critical Issues**: PagerDuty alerts
- **Service Outages**: Status page at status.statex.cz
- **Security Issues**: <security@statex.cz>

## 🗺️ **Roadmap**

### **Stage 1**

- [ ] Complete AI agent performance optimization
- [ ] Advanced monitoring and alerting
- [ ] Multi-language support
- [ ] Mobile application

### **Stage 2**

- [ ] Multi-region deployment
- [ ] Advanced analytics and reporting
- [ ] AI model fine-tuning
- [ ] Enterprise features

### **Stage 3**

- [ ] Marketplace for AI agents
- [ ] Advanced workflow automation
- [ ] Integration with external platforms
- [ ] White-label solutions

---

**StateX** - Transforming business ideas into digital solutions through AI-powered automation 🚀
