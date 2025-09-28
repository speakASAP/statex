# StateX AI Platform

The AI layer for the StateX platform, providing intelligent analysis, content generation, and prototype creation services.

## 🎯 **Overview**

The StateX AI Platform is a comprehensive microservices architecture that processes user submissions (text, voice, files) and generates intelligent business solutions, prototypes, and documents through AI agents.

## 🏗️ **Architecture**

### **Core AI Services**

| Service | Purpose | Technology | Port |
|---------|---------|------------|------|
| **AI Orchestrator** | Central coordination and workflow management | FastAPI + Python | 8010 |
| **NLP Service** | Text analysis, business plan generation, content creation | FastAPI + OpenAI/Anthropic | 8011 |
| **ASR Service** | Speech-to-text conversion and voice processing | FastAPI + Whisper | 8012 |
| **Document AI** | File analysis, OCR, document processing | FastAPI + Tesseract/Unstructured | 8013 |
| **Prototype Generator** | Website and application prototype creation | FastAPI + Next.js Templates | 8014 |
| **Template Repository** | Template management and optimization | FastAPI + Git | 8015 |

### **Supporting Services**

| Service | Purpose | Technology | Port |
|---------|---------|------------|------|
| **Admin Panel** | Human-in-the-middle interface for review and editing | Next.js + React | 8020 |
| **AI Models** | Shared AI models and utilities | Python + ML Libraries | - |
| **Common Utils** | Shared utilities and types | TypeScript/Python | - |

## 🚀 **Quick Start**

### **Prerequisites**

- Docker and Docker Compose
- Python 3.11+
- Node.js 23.11.0+
- Git

### ⚡ **Optimized Development Setup (2-3 minutes)**

StateX AI now uses **volume mounts for instant startup and hot reload**:

1. **Quick start with optimized development environment**

   ```bash
   cd statex-platform
   ./dev-manage.sh start
   
   # Or start only AI services
   ./dev-manage.sh dev ai-orchestrator
   ./dev-manage.sh dev nlp-service
   ./dev-manage.sh dev asr-service
   # ... etc
   
   # Access your services:
   # - AI Orchestrator: http://localhost:8010
   # - NLP Service: http://localhost:8011
   # - ASR Service: http://localhost:8012
   # - Document AI: http://localhost:8013
   # - Prototype Generator: http://localhost:8014
   # - Template Repository: http://localhost:8015
   # - Free AI Service: http://localhost:8016
   # - AI Workers: http://localhost:8017
   ```

2. **Local development setup for individual services**

   ```bash
   # For any AI service
   cd services/ai-orchestrator
   ../../setup-dev.sh  # Sets up Python environment
   source venv/bin/activate
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8010
   ```

### **Legacy Development Setup (Docker)**

1. **Clone the repository**

   ```bash
   git clone git@github.com:speakASAP/statex-ai.git
   cd statex-ai
   ```

2. **Start all services**

   ```bash
   docker compose up -d
   ```

3. **Access services**
   - AI Orchestrator: <http://localhost:8010>
   - Admin Panel: <http://localhost:8020>
   - API Documentation: <http://localhost:8010/docs>

## 📋 **Service Details**

### **1. AI Orchestrator Service**

**Purpose**: Central coordination hub for all AI operations

**Features**:

- Receives user submissions from StateX platform
- Routes requests to appropriate AI services
- Combines results from multiple AI agents
- Manages human-in-the-middle workflow
- Handles error recovery and retries
- Provides unified API for frontend

**API Endpoints**:

- `POST /api/process-submission` - Process user submission
- `GET /api/status/{submission_id}` - Check processing status
- `GET /api/results/{submission_id}` - Get final results

### **2. NLP Service**

**Purpose**: Natural language processing and content generation

**Features**:

- Business plan generation
- Idea extraction and categorization
- Requirement analysis and structuring
- Content optimization and enhancement
- Multi-language support
- Sentiment analysis

**AI Models**:

- OpenAI GPT-4 for content generation
- Custom fine-tuned models for business analysis
- Embedding models for similarity matching

### **3. ASR Service**

**Purpose**: Speech-to-text conversion and voice processing

**Features**:

- Real-time voice transcription
- Audio file processing
- Multiple language support
- Voice quality assessment
- Speaker identification
- Noise reduction

**AI Models**:

- OpenAI Whisper for speech recognition
- Custom models for business terminology
- Voice activity detection

### **4. Document AI Service**

**Purpose**: Document analysis and processing

**Features**:

- PDF text extraction and analysis
- Image OCR and text recognition
- Document structure analysis
- Content summarization
- File format conversion
- Metadata extraction

**AI Models**:

- Tesseract OCR for text extraction
- Unstructured for document parsing
- Custom models for business documents

### **5. Prototype Generator Service**

**Purpose**: Website and application prototype creation

**Features**:

- Next.js template generation
- CMS setup and configuration
- Code generation and customization
- Deployment automation
- Template matching and selection
- Real-time preview

**Templates**:

- Business landing pages
- E-commerce sites
- SaaS applications
- Portfolio websites
- Blog platforms

### **6. Template Repository Service**

**Purpose**: Template management and optimization

**Features**:

- Template storage and versioning
- Search and matching algorithms
- Template optimization and updates
- Usage analytics and metrics
- Template marketplace
- Quality assessment

## 🔄 **Workflow**

### **User Submission Processing**

1. **User submits** text, voice, or files via StateX platform
2. **AI Orchestrator** receives submission and creates workflow
3. **ASR Service** processes voice messages to text
4. **Document AI** analyzes uploaded files
5. **NLP Service** processes all text content
6. **Template Repository** finds matching templates
7. **Prototype Generator** creates website/prototype
8. **Results** sent to Admin Panel for human review
9. **Approved results** delivered to user

### **Human-in-the-Middle Process**

1. **Admin receives** notification of new submission
2. **Review interface** shows all generated content
3. **Edit capabilities** for text, code, and templates
4. **Approval workflow** with comments and feedback
5. **Final delivery** to user with customizations

## 🛠️ **Development**

### **Service Structure**

```text
services/
├── ai-orchestrator/
│   ├── app/
│   │   ├── main.py
│   │   ├── models/
│   │   ├── services/
│   │   └── utils/
│   ├── Dockerfile
│   └── requirements.txt
├── nlp-service/
│   ├── app/
│   ├── models/
│   ├── Dockerfile
│   └── requirements.txt
└── ...
```

### **Shared Resources**

```text
shared/
├── ai-models/
│   ├── business-analysis/
│   ├── content-generation/
│   └── template-matching/
├── common-utils/
│   ├── types/
│   ├── validators/
│   └── helpers/
└── types/
    ├── submission.ts
    ├── ai-response.ts
    └── workflow.ts
```

## 📊 **Monitoring & Analytics**

### **Metrics**

- Processing time per service
- AI model accuracy and performance
- Template usage and effectiveness
- User satisfaction scores
- Error rates and recovery

### **Logging**

- Centralized logging with ELK stack
- Service-specific log levels
- Performance monitoring
- Error tracking and alerting

## 🚀 **Deployment**

### **Development**

```bash
docker compose up -d
```

### **Production**

```bash
docker compose -f docker-compose.prod.yml up -d
```

### **Kubernetes**

```bash
kubectl apply -f k8s/
```

## 🔧 **Configuration**

### **Environment Variables**

```bash
# AI Models
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/statex_ai

# Redis
REDIS_URL=redis://localhost:6379

# Services
AI_ORCHESTRATOR_URL=http://localhost:8010
NLP_SERVICE_URL=http://localhost:8011
ASR_SERVICE_URL=http://localhost:8012
```

## 📚 **Documentation**

- [API Documentation](./docs/api/)
- [Service Architecture](./docs/architecture/)
- [Deployment Guide](./docs/deployment/)
- [Development Guide](./docs/development/)
- [AI Models Guide](./docs/ai-models/)

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 **Support**

For support and questions:

- Create an issue in this repository
- Contact the StateX team
- Check the documentation

---

**StateX AI Platform** - Intelligent business solutions powered by AI agents 🚀
