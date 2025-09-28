# StateX Monitoring Service

## 🎯 **Overview**

The StateX Monitoring Service provides comprehensive monitoring, logging, and observability for the entire StateX microservices ecosystem. It includes specialized monitoring for AI agents, message queues, and system health with real-time dashboards and alerting.

## 🏗️ **Architecture**

### **Monitoring Stack**
```
┌─────────────────────────────────────────────────────────────────┐
│                    StateX Monitoring Stack                      │
├─────────────────────────────────────────────────────────────────┤
│  Visualization Layer                                            │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   Grafana       │  │   Custom        │  │   Alert         │  │
│  │   Dashboards    │  │   Dashboards    │  │   Management    │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│  Data Collection Layer                                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   Prometheus    │  │   Loki          │  │   Jaeger        │  │
│  │   (Metrics)     │  │   (Logs)        │  │   (Tracing)     │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│  Monitoring Service Layer                                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   StateX        │  │   Node          │  │   cAdvisor      │  │
│  │   Monitoring    │  │   Exporter      │  │   (Containers)  │  │
│  │   Service       │  │   (System)      │  │                 │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│  Target Services (StateX Microservices)                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   StateX        │  │   StateX AI     │  │   StateX        │  │
│  │   Platform      │  │   Services      │  │   Notification  │  │
│  │   Services      │  │   (7 AI Agents) │  │   Service       │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## 🚀 **Quick Start**

### **Prerequisites**
- Docker and Docker Compose
- Access to StateX microservices
- Ports 3000, 9090, 16686, 3100 available

### **Start Monitoring Stack**
```bash
cd /Users/sergiystashok/Documents/GitHub/statex/statex-monitoring
docker compose up -d
```

### **Access Monitoring Interfaces**
- **Grafana**: http://localhost:3002 (admin/statex123)
- **Prometheus**: http://localhost:9090
- **Jaeger**: http://localhost:16686
- **Loki**: http://localhost:3100
- **StateX Monitoring API**: http://localhost:8007

## 📊 **Monitoring Components**

### **1. Prometheus (Metrics Collection)**
**Port**: 9090
**Purpose**: Metrics collection and storage

**Features**:
- Collects metrics from all StateX services
- Stores time-series data
- Provides query interface
- Manages alerting rules

**Key Metrics**:
- AI agent performance and success rates
- Service health and response times
- System resource usage (CPU, memory, disk)
- Container metrics and resource utilization

### **2. Grafana (Visualization)**
**Port**: 3000
**Purpose**: Dashboards and visualization

**Features**:
- Real-time dashboards
- Custom AI agent monitoring
- System overview dashboards
- Alert management interface

**Dashboards**:
- **AI Agents Dashboard**: Performance metrics for all AI agents
- **System Overview**: CPU, memory, disk usage
- **Service Health**: Status of all microservices
- **Business Metrics**: User engagement and processing rates

### **3. Loki (Log Aggregation)**
**Port**: 3100
**Purpose**: Centralized log collection and analysis

**Features**:
- Collects logs from all services
- Efficient log storage and retrieval
- Log querying and analysis
- Integration with Grafana

### **4. Jaeger (Distributed Tracing)**
**Port**: 16686
**Purpose**: Request tracing across services

**Features**:
- Trace requests across microservices
- Performance bottleneck identification
- Service dependency mapping
- Error tracking and analysis

### **5. StateX Monitoring Service**
**Port**: 8007
**Purpose**: Custom monitoring for StateX services

**Features**:
- AI agent performance monitoring
- Message queue monitoring
- Custom business metrics
- Service health checks
- Alert management

## 🤖 **AI Agent Monitoring**

### **Monitored AI Agents**
| Agent | Port | Purpose | Key Metrics |
|-------|------|---------|-------------|
| **AI Orchestrator** | 8010 | Central coordination | Processing time, success rate |
| **Free AI Service** | 8016 | Ollama/Hugging Face | Model performance, response time |
| **NLP Service** | 8011 | Text analysis | Processing accuracy, speed |
| **ASR Service** | 8012 | Speech-to-text | Transcription accuracy, speed |
| **Document AI** | 8013 | File processing | OCR accuracy, processing time |
| **Prototype Generator** | 8014 | Website creation | Generation time, success rate |
| **Template Repository** | 8015 | Template management | Search performance, cache hit rate |

### **AI Agent Metrics**
- **Processing Time**: How long each agent takes to process requests
- **Success Rate**: Percentage of successful operations
- **Queue Size**: Number of pending requests
- **Model Performance**: Accuracy and confidence scores
- **Resource Usage**: CPU and memory consumption per agent

### **AI Agent Alerts**
- **Agent Down**: When an AI agent becomes unavailable
- **High Response Time**: When processing takes too long
- **Low Success Rate**: When accuracy drops below threshold
- **Queue Backlog**: When too many requests are pending
- **Processing Errors**: When error rates spike

## 📈 **Dashboards**

### **1. AI Agents Dashboard**
- Real-time status of all AI agents
- Processing time trends
- Success rate monitoring
- Queue size tracking
- Model performance metrics

### **2. System Overview Dashboard**
- Overall system health
- CPU, memory, and disk usage
- Service availability
- Container resource usage
- Network performance

### **3. Service Health Dashboard**
- Individual service status
- Response time monitoring
- Error rate tracking
- Dependency health
- Alert status

### **4. Business Metrics Dashboard**
- User submission rates
- AI processing volumes
- Notification delivery rates
- System utilization
- Performance trends

## 🚨 **Alerting**

### **Alert Levels**

#### **Critical Alerts**
- Service down or unavailable
- AI agent processing failures
- High error rates (>5%)
- Resource exhaustion
- Database connectivity issues

#### **Warning Alerts**
- High response times (>2s)
- Queue backlogs (>100 items)
- High resource usage (>80%)
- Certificate expiration warnings
- Performance degradation

#### **Info Alerts**
- Successful deployments
- Capacity planning notifications
- Maintenance windows
- Performance improvements

### **Alert Channels**
- **Email**: Critical alerts to admin@statex.cz
- **Webhook**: Integration with StateX notification service
- **Slack**: Team notifications (configurable)
- **PagerDuty**: On-call escalation (configurable)

## 🔧 **Configuration**

### **Environment Variables**
```bash
# Prometheus
PROMETHEUS_URL=http://prometheus:9090

# Grafana
GRAFANA_URL=http://grafana:3000

# Loki
LOKI_URL=http://loki:3100

# Jaeger
JAEGER_URL=http://jaeger:16686

# StateX Services
AI_SERVICES_URL=http://host.docker.internal:8010
NOTIFICATION_SERVICE_URL=http://host.docker.internal:8005
PLATFORM_URL=http://host.docker.internal:8000
```

### **Service Discovery**
The monitoring service automatically discovers and monitors:
- All StateX microservices
- AI agents and their performance
- System resources and containers
- External service dependencies

## 📊 **API Endpoints**

### **Monitoring Service API**
```bash
# Get overall system status
GET http://localhost:8007/api/status

# Get services status
GET http://localhost:8007/api/services

# Get AI agents status
GET http://localhost:8007/api/ai-agents

# Get system metrics
GET http://localhost:8007/api/system-metrics

# Get current alerts
GET http://localhost:8007/api/alerts

# Prometheus metrics
GET http://localhost:8007/metrics
```

## 🛠️ **Development**

### **Adding New Metrics**
1. Define metrics in the monitoring service
2. Update Prometheus configuration
3. Create Grafana dashboard panels
4. Set up alerting rules

### **Custom Dashboards**
1. Create dashboard JSON in `grafana/dashboards/`
2. Configure data sources
3. Set up panel queries
4. Deploy with Docker Compose

### **Alert Rules**
1. Define rules in `prometheus/rules/`
2. Configure alert routing in `alertmanager/`
3. Test alert conditions
4. Deploy configuration

## 🚀 **Deployment**

### **Development**
```bash
docker compose up -d
```

### **Production**
```bash
# Use production configuration
docker compose -f docker-compose.prod.yml up -d

# Or deploy to Kubernetes
kubectl apply -f k8s/
```

### **Scaling**
- Prometheus: Increase storage and memory
- Grafana: Scale horizontally with load balancer
- Loki: Use object storage backend
- Jaeger: Use external storage (Elasticsearch)

## 🔒 **Security**

### **Access Control**
- Grafana: User authentication and RBAC
- Prometheus: Basic authentication
- Jaeger: No authentication (internal network)
- Loki: Basic authentication

### **Network Security**
- All services on internal network
- No external exposure except Grafana
- TLS encryption for external access
- Firewall rules for port access

## 📚 **Documentation**

### **Service Documentation**
- [Prometheus Configuration](./prometheus/)
- [Grafana Dashboards](./grafana/)
- [Alert Rules](./prometheus/rules/)
- [Monitoring Service API](./monitoring-service/)

### **Integration Guides**
- [StateX Platform Integration](../statex-platform/README.md)
- [AI Services Integration](../statex-ai/README.md)
- [Notification Service Integration](../statex-notification-service/README.md)

## 🤝 **Contributing**

### **Adding New Monitoring**
1. Define metrics in monitoring service
2. Update Prometheus scrape config
3. Create Grafana dashboard
4. Add alerting rules
5. Test and deploy

### **Custom Dashboards**
1. Create dashboard JSON
2. Add to `grafana/dashboards/`
3. Configure data sources
4. Test visualization

## 🆘 **Troubleshooting**

### **Common Issues**
- **Services not discovered**: Check network connectivity
- **Metrics not appearing**: Verify Prometheus configuration
- **Dashboards empty**: Check data source configuration
- **Alerts not firing**: Verify alert rules and routing

### **Debug Commands**
```bash
# Check service status
docker compose ps

# View logs
docker compose logs -f prometheus
docker compose logs -f grafana

# Test metrics endpoint
curl http://localhost:8007/metrics

# Check Prometheus targets
curl http://localhost:9090/api/v1/targets
```

## 📄 **License**

This project is part of the StateX platform. See the main repository for license information.

---

**StateX Monitoring Service** - Comprehensive observability for AI-powered business automation 🚀
