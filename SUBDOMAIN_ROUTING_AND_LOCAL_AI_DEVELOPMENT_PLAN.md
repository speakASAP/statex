# StateX Subdomain Routing & Local AI Development Plan

## 🎯 **OBJECTIVE**

Fix subdomain routing issues and implement local AI development setup to enable faster development, easier debugging, and resolve Docker container conflicts.

## 📊 **CURRENT PROGRESS STATUS**

### **✅ COMPLETED TASKS**

1. **Phase 1.1**: Removed duplicate prototype system (`prototypes/[projectId]/page.tsx`)
2. **Phase 1.2**: Fixed middleware location (moved to correct directory)
3. **Phase 1.3**: Resolved Docker container conflicts
4. **Phase 2.1**: Implemented subdomain detection logic in `CatchAllPage`
5. **Phase 2.2**: Created redirect logic for prototype subdomains
6. **Phase 2.3**: Added subdomain detection to `generateMetadata` function

### **⚠️ IN PROGRESS TASKS**

1. **Phase 2.4**: Fix React error preventing redirect execution
   - **Issue**: `ContentLoader` and `TemplateRenderer` classes causing React error
   - **Status**: Subdomain detection working, redirect logic working, but React error blocks final execution
   - **Next**: Restructure component to avoid class instantiation for subdomains

### **❌ PENDING TASKS**

1. **Phase 2.5**: Test subdomain routing functionality
2. **Phase 3**: Implement local AI development setup
3. **Phase 4**: Update development workflow
4. **Phase 5**: Testing and validation

### **🚨 BLOCKING ISSUES**

- **Critical**: React error preventing subdomain redirects from executing
- **Impact**: Phase 2 cannot be completed until this is resolved
- **Priority**: **HIGH** - Must be fixed before proceeding to Phase 3

## 🔍 **CURRENT PROBLEMS IDENTIFIED**

### **1. Subdomain Routing Issues**

- **Problem**: Prototype subdomains (`project-{id}.localhost:3000/plan`) go to CMS system instead of prototype system
- **Root Cause**: Middleware not executing properly due to Docker container conflicts
- **Impact**: Users see "Page not found" instead of prototype pages

### **2. Docker Container Conflicts**

- **Problem**: Container naming conflicts prevent proper restarts
- **Error**: `Container name "/statex-website-frontend-1" is already in use`
- **Impact**: Development environment becomes unstable

### **3. Slow AI Development Cycle**

- **Problem**: Every AI service change requires Docker rebuild (4+ minutes)
- **Impact**: Extremely slow development iteration
- **Resource Heavy**: Multiple containers consume significant resources

### **4. Duplicate Prototype Systems**

- **Problem**: Two different prototype systems exist:
  - `prototype-results/[prototypeId]/page.tsx` (comprehensive, newer)
  - `prototypes/[projectId]/page.tsx` (simpler, older)
- **Impact**: Confusion and maintenance overhead

## 🏗️ **CURRENT ARCHITECTURE ANALYSIS**

### **Content Management System (CMS)**

- **Pages**: Created from markdown files in `/src/content/pages/`
- **Blog Posts**: Created from markdown files in `/src/content/blog/`
- **Multi-language**: Support for `en/`, `cs/`, `de/`, `fr/`
- **ContentLoader**: Processes markdown files and converts to HTML
- **Catch-all Route**: `[...slug]/page.tsx` handles all dynamic pages

### **Prototype Systems**

- **System A**: `prototype-results/[prototypeId]/page.tsx`
  - **Purpose**: Shows detailed AI analysis results and workflow data
  - **Data Source**: API calls to `/api/results/prototype/{prototypeId}`
  - **Status**: ✅ **KEEP** (comprehensive, newer)

- **System B**: `prototypes/[projectId]/page.tsx`
  - **Purpose**: Displays actual prototype HTML content
  - **Data Source**: Local HTML files or prototype service API
  - **Status**: ❌ **REMOVE** (simpler, older, duplicate)

### **AI Services Architecture**

Each AI service is a **FastAPI application** that can run locally:

| Service | Purpose | Port | Technology |
|---------|---------|------|------------|
| **AI Orchestrator** | Central coordination | 8010 | FastAPI + Python |
| **NLP Service** | Text analysis | 8011 | FastAPI + OpenAI/Anthropic |
| **ASR Service** | Speech-to-text | 8012 | FastAPI + Whisper |
| **Document AI** | File processing | 8013 | FastAPI + Tesseract |
| **Prototype Generator** | Website generation | 8014 | FastAPI + Next.js Templates |
| **Free AI Service** | Local AI models | 8016 | FastAPI + Ollama/HuggingFace |

## 📋 **IMPLEMENTATION PLAN**

### **Phase 1: Clean Up Current Issues** ⚡ **IMMEDIATE**

#### **1.1 Remove Duplicate Prototype System**

- **Action**: Delete `statex-website/frontend/src/app/prototypes/[projectId]/page.tsx`
- **Action**: Delete `statex-website/frontend/src/app/prototypes/[projectId]/plan/page.tsx`
- **Action**: Delete `statex-website/frontend/src/app/prototypes/[projectId]/offer/page.tsx`
- **Reason**: Eliminate duplicate system, keep only comprehensive `prototype-results` system

#### **1.2 Fix Middleware Location**

- **Action**: Delete `statex-website/frontend/middleware.ts` (wrong location)
- **Action**: Keep `statex-website/middleware.ts` (correct location)
- **Action**: Update middleware to route to `prototype-results` instead of `prototypes`
- **Reason**: Next.js middleware must be in project root, not frontend subdirectory

#### **1.3 Resolve Docker Container Conflicts**

- **Action**: Stop all running containers
- **Action**: Remove conflicting containers
- **Action**: Clean up orphaned containers
- **Command**: `docker system prune -f && docker container prune -f`

### **Phase 2: Fix Subdomain Routing** 🔧 **CRITICAL**

#### **2.1 Update Middleware for Correct Routing**

```typescript
// statex-website/middleware.ts
export function middleware(request: NextRequest) {
  const { hostname, pathname } = request.nextUrl;
  
  // Check if this is a prototype subdomain
  const prototypeMatch = hostname.match(/^project-([a-zA-Z0-9_-]+)\.localhost$/);
  
  if (prototypeMatch) {
    const prototypeId = prototypeMatch[1];
    
    // Route to prototype-results system instead of prototypes
    let targetPath;
    if (pathname === '/' || pathname === '') {
      targetPath = `/prototype-results/${prototypeId}`;
    } else if (pathname === '/plan') {
      targetPath = `/prototype-results/${prototypeId}/plan`;
    } else if (pathname === '/offer') {
      targetPath = `/prototype-results/${prototypeId}/offer`;
    } else {
      targetPath = `/prototype-results/${prototypeId}${pathname}`;
    }
    
    const url = request.nextUrl.clone();
    url.pathname = targetPath;
    url.hostname = 'localhost';
    
    return NextResponse.rewrite(url);
  }
  
  return NextResponse.next();
}
```

#### **2.2 Create Subdomain Route Handlers**

- **Action**: Create `statex-website/frontend/src/app/prototype-results/[prototypeId]/plan/page.tsx`
- **Action**: Create `statex-website/frontend/src/app/prototype-results/[prototypeId]/offer/page.tsx`
- **Purpose**: Handle `/plan` and `/offer` sub-paths for prototype subdomains

#### **2.3 Test Subdomain Routing**

- **Test**: `http://project-{id}.localhost:3000/` → Should show prototype results
- **Test**: `http://project-{id}.localhost:3000/plan` → Should show plan page
- **Test**: `http://project-{id}.localhost:3000/offer` → Should show offer page

### **Phase 3: Implement Local AI Development Setup** 🚀 **MAJOR IMPROVEMENT**

#### **3.1 Create Local Development Scripts**

**File**: `statex-ai/scripts/dev-start.sh`

```bash
#!/bin/bash
# StateX AI Local Development Startup Script

echo "🚀 Starting StateX AI Services Locally..."

# Set environment variables
export DATABASE_URL="postgresql://statex:statex_password@localhost:5432/statex"
export REDIS_URL="redis://localhost:6379"
export RABBITMQ_URL="amqp://statex:statex_password@localhost:5672"

# Start AI Orchestrator
echo "Starting AI Orchestrator on port 8010..."
cd services/ai-orchestrator
python -m uvicorn app.main:app --reload --port 8010 &
ORCHESTRATOR_PID=$!

# Start NLP Service
echo "Starting NLP Service on port 8011..."
cd ../nlp-service
python -m uvicorn app.main:app --reload --port 8011 &
NLP_PID=$!

# Start ASR Service
echo "Starting ASR Service on port 8012..."
cd ../asr-service
python -m uvicorn app.main:app --reload --port 8012 &
ASR_PID=$!

# Start Document AI
echo "Starting Document AI on port 8013..."
cd ../document-ai
python -m uvicorn app.main:app --reload --port 8013 &
DOCUMENT_PID=$!

# Start Prototype Generator
echo "Starting Prototype Generator on port 8014..."
cd ../prototype-generator
python -m uvicorn app.main:app --reload --port 8014 &
PROTOTYPE_PID=$!

# Start Free AI Service
echo "Starting Free AI Service on port 8016..."
cd ../free-ai-service
python -m uvicorn app.main:app --reload --port 8016 &
FREE_AI_PID=$!

echo "✅ All AI services started locally!"
echo "📊 Service Status:"
echo "  - AI Orchestrator: http://localhost:8010"
echo "  - NLP Service: http://localhost:8011"
echo "  - ASR Service: http://localhost:8012"
echo "  - Document AI: http://localhost:8013"
echo "  - Prototype Generator: http://localhost:8014"
echo "  - Free AI Service: http://localhost:8016"

# Keep script running and handle cleanup
trap "echo '🛑 Stopping all services...'; kill $ORCHESTRATOR_PID $NLP_PID $ASR_PID $DOCUMENT_PID $PROTOTYPE_PID $FREE_AI_PID; exit" INT
wait
```

**File**: `statex-ai/scripts/dev-stop.sh`

```bash
#!/bin/bash
# StateX AI Local Development Stop Script

echo "🛑 Stopping all StateX AI services..."

# Kill all uvicorn processes
pkill -f "uvicorn.*statex-ai"

echo "✅ All AI services stopped!"
```

#### **3.2 Create Python Virtual Environment Setup**

**File**: `statex-ai/scripts/setup-dev-env.sh`

```bash
#!/bin/bash
# StateX AI Development Environment Setup

echo "🔧 Setting up StateX AI development environment..."

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install common dependencies
pip install --upgrade pip
pip install fastapi uvicorn[standard] pydantic httpx redis

# Install service-specific dependencies
echo "Installing AI Orchestrator dependencies..."
cd services/ai-orchestrator && pip install -r requirements.txt && cd ../..

echo "Installing NLP Service dependencies..."
cd services/nlp-service && pip install -r requirements.txt && cd ../..

echo "Installing ASR Service dependencies..."
cd services/asr-service && pip install -r requirements.txt && cd ../..

echo "Installing Document AI dependencies..."
cd services/document-ai && pip install -r requirements.txt && cd ../..

echo "Installing Prototype Generator dependencies..."
cd services/prototype-generator && pip install -r requirements.txt && cd ../..

echo "Installing Free AI Service dependencies..."
cd services/free-ai-service && pip install -r requirements.txt && cd ../..

echo "✅ Development environment setup complete!"
echo "To activate: source venv/bin/activate"
echo "To start services: ./scripts/dev-start.sh"
```

#### **3.3 Create Development Management Script**

**File**: `statex-ai/dev-manage.sh`

```bash
#!/bin/bash
# StateX AI Development Management Script

case "$1" in
  "start")
    echo "🚀 Starting all AI services locally..."
    ./scripts/dev-start.sh
    ;;
  "stop")
    echo "🛑 Stopping all AI services..."
    ./scripts/dev-stop.sh
    ;;
  "restart")
    echo "🔄 Restarting all AI services..."
    ./scripts/dev-stop.sh
    sleep 2
    ./scripts/dev-start.sh
    ;;
  "setup")
    echo "🔧 Setting up development environment..."
    ./scripts/setup-dev-env.sh
    ;;
  "status")
    echo "📊 AI Services Status:"
    echo "  - AI Orchestrator: $(curl -s http://localhost:8010/health > /dev/null && echo '✅ Running' || echo '❌ Stopped')"
    echo "  - NLP Service: $(curl -s http://localhost:8011/health > /dev/null && echo '✅ Running' || echo '❌ Stopped')"
    echo "  - ASR Service: $(curl -s http://localhost:8012/health > /dev/null && echo '✅ Running' || echo '❌ Stopped')"
    echo "  - Document AI: $(curl -s http://localhost:8013/health > /dev/null && echo '✅ Running' || echo '❌ Stopped')"
    echo "  - Prototype Generator: $(curl -s http://localhost:8014/health > /dev/null && echo '✅ Running' || echo '❌ Stopped')"
    echo "  - Free AI Service: $(curl -s http://localhost:8016/health > /dev/null && echo '✅ Running' || echo '❌ Stopped')"
    ;;
  *)
    echo "Usage: $0 {start|stop|restart|setup|status}"
    echo ""
    echo "Commands:"
    echo "  start   - Start all AI services locally"
    echo "  stop    - Stop all AI services"
    echo "  restart - Restart all AI services"
    echo "  setup   - Set up development environment"
    echo "  status  - Check status of all services"
    ;;
esac
```

### **Phase 4: Update Development Workflow** 📝 **PROCESS IMPROVEMENT**

#### **4.1 New Development Workflow**

```bash
# 1. Start infrastructure services (PostgreSQL, Redis, RabbitMQ)
cd statex-infrastructure
docker compose -f docker-compose.dev.yml up -d

# 2. Start AI services locally (much faster!)
cd statex-ai
./dev-manage.sh setup  # First time only
./dev-manage.sh start

# 3. Start Next.js frontend locally
cd statex-website/frontend
npm run dev

# 4. Check status
cd statex-ai
./dev-manage.sh status
```

#### **4.2 Benefits of Local AI Development**

- **⚡ Instant Hot Reload**: No Docker rebuilds needed (4+ minutes → 0 seconds)
- **🐛 Easy Debugging**: Direct Python debugging with breakpoints
- **📊 Better Performance**: No container overhead
- **🚀 Faster Development**: Changes apply immediately
- **💾 Resource Efficient**: Lower memory and CPU usage
- **🔧 Better IDE Support**: Full IntelliSense and debugging support

### **Phase 5: Testing and Validation** ✅ **QUALITY ASSURANCE**

#### **5.1 Subdomain Routing Tests**

- **Test 1**: `http://project-{id}.localhost:3000/` → Prototype results page
- **Test 2**: `http://project-{id}.localhost:3000/plan` → Plan page
- **Test 3**: `http://project-{id}.localhost:3000/offer` → Offer page
- **Test 4**: Regular pages still work via CMS system

#### **5.2 AI Services Integration Tests**

- **Test 1**: Form submission triggers AI workflow
- **Test 2**: AI agents process data correctly
- **Test 3**: Prototype generation works
- **Test 4**: Results display properly in frontend

#### **5.3 Performance Tests**

- **Test 1**: Local AI services start in < 30 seconds
- **Test 2**: Code changes apply instantly
- **Test 3**: Memory usage is reasonable
- **Test 4**: No container conflicts

## 🎯 **SUCCESS CRITERIA**

### **Phase 1 Success**

- ✅ Duplicate prototype system removed
- ✅ Middleware in correct location
- ✅ Docker container conflicts resolved

### **Phase 2 Success**

- ✅ Subdomain detection working perfectly
- ✅ Redirect logic implemented and working
- ⚠️ React error preventing final redirect execution
- ❌ `project-{id}.localhost:3000/plan` shows plan page
- ❌ `project-{id}.localhost:3000/offer` shows offer page
- ✅ Regular CMS pages still work

### **Phase 3 Success**

- ✅ AI services run locally without Docker
- ✅ Hot reload works for all AI services
- ✅ Development scripts work correctly
- ✅ All services start in < 30 seconds

### **Phase 4 Success**

- ✅ New development workflow documented
- ✅ Team can use local AI development
- ✅ Faster development iteration achieved

### **Phase 5 Success**

- ✅ All tests pass
- ✅ No regressions in existing functionality
- ✅ Performance improvements achieved

## 📊 **EXPECTED BENEFITS**

### **Development Speed**

- **Before**: 4+ minutes per AI service change
- **After**: 0 seconds (instant hot reload)
- **Improvement**: 100x faster development

### **Resource Usage**

- **Before**: 6+ Docker containers running
- **After**: 0 AI service containers (only infrastructure)
- **Improvement**: 50%+ reduction in resource usage

### **Debugging Experience**

- **Before**: Complex Docker debugging
- **After**: Direct Python debugging with breakpoints
- **Improvement**: Much easier debugging

### **Development Workflow**

- **Before**: Complex Docker management
- **After**: Simple `./dev-manage.sh start` command
- **Improvement**: Streamlined workflow

## 🚨 **RISKS AND MITIGATION**

### **Risk 1: Environment Differences**

- **Risk**: Local development differs from production
- **Mitigation**: Use same Python versions and dependencies
- **Mitigation**: Regular testing against Docker environment

### **Risk 2: Service Dependencies**

- **Risk**: AI services depend on infrastructure services
- **Mitigation**: Keep infrastructure services in Docker
- **Mitigation**: Clear documentation of dependencies

### **Risk 3: Team Adoption**

- **Risk**: Team prefers Docker development
- **Mitigation**: Provide both options (Docker + Local)
- **Mitigation**: Clear documentation and training

## 📅 **IMPLEMENTATION TIMELINE**

### **Week 1: Phase 1 & 2** (Critical Issues) - **IN PROGRESS**

- ✅ **Day 1-2**: Clean up duplicate systems and middleware - **COMPLETED**
- ⚠️ **Day 3-4**: Fix subdomain routing - **IN PROGRESS** (React error blocking)
- **Day 5**: Testing and validation

### **Week 2: Phase 3** (Local AI Development) - **PENDING**

- **Day 1-2**: Create development scripts
- **Day 3-4**: Set up local environment
- **Day 5**: Testing and documentation

### **Week 3: Phase 4 & 5** (Process and Validation) - **PENDING**

- **Day 1-2**: Update development workflow
- **Day 3-4**: Comprehensive testing
- **Day 5**: Documentation and team training

## 🚨 **CURRENT BLOCKING ISSUE**

### **React Error: Server Component Class Instantiation**

- **Error**: `"Only plain objects, and a few built-ins, can be passed to Client Components from Server Components. Classes or null prototypes are not supported."`
- **Root Cause**: `ContentLoader` and `TemplateRenderer` classes being instantiated in Server Components
- **Impact**: Prevents subdomain redirects from executing properly
- **Status**: **CRITICAL** - Blocking Phase 2 completion

### **Immediate Next Steps**

1. **Fix React Error**: Restructure `CatchAllPage` to avoid class instantiation for subdomains
2. **Test Redirects**: Verify subdomain redirects work after React error fix
3. **Complete Phase 2**: Ensure all subdomain routes work correctly
4. **Proceed to Phase 3**: Begin local AI development setup

## 🔧 **TECHNICAL ANALYSIS: REACT ERROR**

### **Error Details**

```text
Error: Only plain objects, and a few built-ins, can be passed to Client Components from Server Components. Classes or null prototypes are not supported.
```

### **Root Cause Analysis**

1. **Server Component Issue**: `CatchAllPage` is a Server Component that instantiates `ContentLoader` and `TemplateRenderer` classes
2. **Class Instantiation**: These classes are being passed to Client Components (likely through the `PageRenderer` component)
3. **Next.js Limitation**: Server Components cannot pass class instances to Client Components
4. **Subdomain Impact**: Even though subdomain detection works, the component still tries to instantiate these classes

### **Current Code Structure**

```typescript
// In CatchAllPage (Server Component)
const loader = new ContentLoader();        // ❌ Class instantiation
const renderer = new TemplateRenderer();   // ❌ Class instantiation

// These are passed to PageRenderer (Client Component)
<PageRenderer content={renderedContent} />
```

### **Solution Strategy**

1. **Conditional Instantiation**: Only instantiate classes when NOT dealing with subdomains
2. **Early Return**: Return redirect response before any class instantiation
3. **Component Restructuring**: Separate subdomain logic from CMS logic

### **Proposed Fix**

```typescript
export default async function CatchAllPage({ params }: CatchAllPageProps) {
  const resolvedParams = await params;
  const slugPath = resolvedParams.slug.join('/');
  
  // Check for subdomain FIRST - before any class instantiation
  const headers = await import('next/headers');
  const headersList = await headers.headers();
  const host = headersList.get('host') || '';
  
  const prototypeMatch = host.match(/^project-([a-zA-Z0-9_-]+)\.localhost(:\d+)?$/);
  
  if (prototypeMatch) {
    // Handle subdomain redirects WITHOUT instantiating any classes
    const prototypeId = prototypeMatch[1];
    const { redirect } = await import('next/navigation');
    
    if (slugPath === '') {
      redirect(`/prototype-results/${prototypeId}`);
    } else if (slugPath === 'plan') {
      redirect(`/prototype-results/${prototypeId}/plan`);
    } else if (slugPath === 'offer') {
      redirect(`/prototype-results/${prototypeId}/offer`);
    } else {
      redirect(`/prototype-results/${prototypeId}/${slugPath}`);
    }
  }
  
  // Only instantiate classes for CMS pages (non-subdomains)
  const loader = new ContentLoader();
  const renderer = new TemplateRenderer();
  // ... rest of CMS logic
}
```

### **Expected Outcome**

- ✅ Subdomain requests redirect immediately without class instantiation
- ✅ CMS pages continue to work normally
- ✅ No React errors
- ✅ Phase 2 completion

## 🔧 **MAINTENANCE AND MONITORING**

### **Regular Tasks**

- **Daily**: Check service status with `./dev-manage.sh status`
- **Weekly**: Update dependencies and test compatibility
- **Monthly**: Review performance and optimize

### **Monitoring**

- **Service Health**: Built-in health checks for all services
- **Performance**: Monitor startup times and resource usage
- **Error Tracking**: Log and track any issues

## 📚 **DOCUMENTATION UPDATES**

### **Files to Update**

1. **README.md**: Update development setup instructions
2. **DEVELOPMENT.md**: Add local AI development guide
3. **TROUBLESHOOTING.md**: Add common issues and solutions
4. **API.md**: Update API documentation if needed

### **New Documentation**

1. **LOCAL_AI_DEVELOPMENT.md**: Complete guide for local development
2. **SUBDOMAIN_ROUTING.md**: Technical details of subdomain routing
3. **DEVELOPMENT_SCRIPTS.md**: Documentation for all development scripts

---

## 🎉 **CONCLUSION**

This comprehensive plan addresses all current issues and provides a path to much faster, more efficient development. The local AI development setup will transform the development experience while maintaining all existing functionality.

**Key Benefits:**

- ⚡ **100x faster development** (4+ minutes → 0 seconds)
- 🐛 **Much easier debugging** (direct Python debugging)
- 💾 **50%+ resource reduction** (fewer containers)
- 🚀 **Streamlined workflow** (simple commands)

**Next Steps:**

1. **Approve this plan**
2. **Begin Phase 1 implementation** (clean up issues)
3. **Proceed with Phase 2** (fix subdomain routing)
4. **Implement Phase 3** (local AI development)

This plan will significantly improve the development experience while maintaining the robust, scalable architecture of the StateX platform.
