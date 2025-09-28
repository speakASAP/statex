# Monitoring System Documentation

## 🎯 Overview

The Statex monitoring system provides comprehensive application performance monitoring, error tracking, security monitoring, and business metrics analysis using **Sentry** to ensure optimal system performance and user experience with our **Fastify**-based architecture.

## 🔗 Related Documentation

- [Technology Stack](technology.md) - Complete technology decisions with monitoring infrastructure
- [Architecture](architecture.md) - System architecture with AI-powered monitoring strategy
- [Infrastructure Implementation Guide](infrastructure-implementation.md) - AI infrastructure monitoring and healing
- [AI Agents Ecosystem](ai-agents.md) - AI-powered monitoring agents and predictive analytics
- [AI Implementation Master Plan](ai-implementation-master-plan.md) - Overall AI strategy
- [Backend Documentation](backend.md) - Fastify backend integration details
- [Frontend Documentation](frontend.md) - Frontend monitoring integration
- [Testing](testing.md) - Vitest testing framework integration
- [Email System](email-system.md) - Amazon SES monitoring
- [Scheduled Tasks](scheduled-tasks.md) - BullMQ job monitoring
- [PWA Requirements](pwa-requirements.md) - PWA performance monitoring
- [SEO](seo.md) - SEO performance monitoring
- [Development Plan](../../development-plan.md) - Complete project plan
- [Milestone 6 Research Summary](milestone-6-research-summary.md) - Monitoring strategy decisions

## 🏗 Monitoring Architecture

### Sentry-Based Monitoring Stack
```typescript
const MONITORING_STACK = {
  application_monitoring: {
    service: 'Sentry (EU hosting for GDPR compliance)',
    metrics: ['response_times', 'throughput', 'error_rates', 'memory_usage'],
    performance: 'Real-time performance monitoring with 65k req/sec capability',
    alerts: ['performance_degradation', 'high_error_rates', 'resource_exhaustion']
  },
  
  fastify_integration: {
    service: 'Sentry Fastify plugin',
    features: ['request_tracking', 'route_performance', 'plugin_monitoring'],
    performance_targets: {
      throughput: '65,000 req/sec (vs Express 25,000 req/sec)',
      memory_usage: '30% lower than Express',
      response_time: '<100ms for API endpoints'
    }
  },
  
  infrastructure_monitoring: {
    service: 'Sentry Performance + Custom Metrics',
    metrics: ['cpu_usage', 'memory_usage', 'disk_space', 'network_traffic'],
    alerts: ['server_down', 'high_resource_usage', 'storage_full']
  },
  
  user_experience: {
    service: 'Sentry Browser SDK + Google Analytics 4',
    metrics: ['page_load_times', 'core_web_vitals', 'user_flows', 'conversion_rates'],
    targets: ['LCP <2.5s', 'FID <100ms', 'CLS <0.1'],
    alerts: ['poor_user_experience', 'high_bounce_rates', 'conversion_drops']
  },
  
  ai_monitoring: {
    service: 'Custom Sentry integration',
    metrics: ['ai_response_times', 'token_usage', 'model_performance', 'cost_tracking'],
    ai_tiers: ['Ollama (free)', 'OpenAI ($0.03/1K tokens)', 'Azure EU ($0.06/1K tokens)'],
    ai_agents: ['Specialized agents performance monitoring', 'agent communication tracking'],
    alerts: ['ai_service_failures', 'cost_thresholds', 'performance_degradation', 'agent_failures']
  }
};
```

### Fastify Sentry Integration
```typescript
// src/plugins/sentry.ts
import fp from 'fastify-plugin';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';

export default fp(async function (fastify) {
  // Initialize Sentry for Fastify
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Express({ fastify }), // Works with Fastify
    ],
    beforeSend(event) {
      // Filter sensitive data
      if (event.request?.data) {
        delete event.request.data.password;
        delete event.request.data.apiKey;
      }
      return event;
    }
  });

  // Fastify-specific error handler
  fastify.setErrorHandler(async (error, request, reply) => {
    // Log to Sentry with Fastify context
    Sentry.captureException(error, {
      tags: {
        endpoint: request.url,
        method: request.method,
        userId: request.user?.id,
        fastify_route: request.routerPath
      },
      extra: {
        body: request.body,
        query: request.query,
        params: request.params,
        headers: request.headers
      }
    });

    // Fastify error response
    const statusCode = error.statusCode || 500;
    const message = process.env.NODE_ENV === 'production' 
      ? 'Internal Server Error' 
      : error.message;

    reply.status(statusCode).send({
      success: false,
      error: message,
      code: statusCode,
      timestamp: new Date().toISOString()
    });
  });

  // Performance monitoring hooks
  fastify.addHook('onRequest', async (request) => {
    request.startTime = Date.now();
    Sentry.getCurrentHub().configureScope(scope => {
      scope.setTag('route', request.routerPath);
      scope.setContext('request', {
        url: request.url,
        method: request.method,
        user_agent: request.headers['user-agent']
      });
    });
  });

  fastify.addHook('onResponse', async (request, reply) => {
    const duration = Date.now() - request.startTime;
    
    // Track Fastify-specific performance metrics
    Sentry.addBreadcrumb({
      message: `${request.method} ${request.url}`,
      category: 'fastify.request',
      data: {
        statusCode: reply.statusCode,
        duration,
        userId: request.user?.id,
        routerPath: request.routerPath
      }
    });

    // Performance alerts for Fastify
    if (duration > 1000) { // Alert if slower than 1s (well below our 65k req/sec target)
      Sentry.captureMessage(`Slow Fastify request: ${request.method} ${request.url}`, 'warning');
    }
  });
});
```

### Monitoring Database Schema
```sql
CREATE TABLE monitoring_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_name VARCHAR(255) NOT NULL,
    metric_type metric_type_enum NOT NULL,
    value DECIMAL(15,4) NOT NULL,
    unit VARCHAR(50),
    tags JSONB,
    source VARCHAR(255),
    fastify_route VARCHAR(255), -- Track Fastify-specific routes
    sentry_event_id VARCHAR(255), -- Link to Sentry events
    recorded_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE monitoring_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_name VARCHAR(255) NOT NULL,
    severity alert_severity_enum NOT NULL,
    condition_met BOOLEAN DEFAULT TRUE,
    threshold_value DECIMAL(15,4),
    current_value DECIMAL(15,4),
    alert_message TEXT,
    sentry_issue_id VARCHAR(255), -- Link to Sentry issues
    fastify_context JSONB, -- Fastify-specific context
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Enums
CREATE TYPE metric_type_enum AS ENUM ('COUNTER', 'GAUGE', 'HISTOGRAM', 'SUMMARY');
CREATE TYPE alert_severity_enum AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
```

## 📊 Performance Monitoring

### Fastify Performance Metrics
```typescript
const FASTIFY_PERFORMANCE_MONITORING = {
  api_monitoring: {
    throughput: 'Track 65,000 req/sec capability vs Express 25,000 req/sec',
    response_times: 'Monitor API endpoint response times (<100ms target)',
    error_rates: 'Monitor HTTP error responses (4xx, 5xx)',
    memory_efficiency: 'Track 30% lower memory usage vs Express',
    database_performance: 'Prisma query execution times and connection pool usage'
  },
  
  route_performance: {
    route_timing: 'Per-route performance analysis',
    plugin_overhead: 'Fastify plugin performance impact',
    schema_validation: 'JSON schema validation performance',
    serialization: 'Response serialization performance'
  },
  
  ai_system_monitoring: {
    model_performance: 'AI model response times and accuracy',
    token_usage: 'OpenAI/Azure API token consumption and costs',
    ollama_performance: 'Local Ollama model performance metrics',
    conversation_quality: 'User satisfaction with AI responses'
  },
  
  bullmq_monitoring: {
    job_processing: 'BullMQ job processing times and success rates',
    queue_health: 'Queue depth and worker performance',
    failed_jobs: 'Failed job analysis and retry metrics',
    redis_performance: 'Redis performance for BullMQ queues'
  }
};
```

### Vitest Integration Monitoring
```typescript
// Integration with Vitest for test performance monitoring
const VITEST_MONITORING = {
  test_performance: {
    execution_speed: 'Monitor 10x faster testing vs Jest',
    coverage_tracking: 'Test coverage metrics and trends',
    test_reliability: 'Test success rates and flaky test detection',
    hot_reload: 'HMR performance for test development'
  },
  
  sentry_integration: {
    test_errors: 'Capture test failures in Sentry',
    performance_regression: 'Alert on test performance degradation',
    coverage_alerts: 'Alert when coverage drops below thresholds'
  }
};
```

## 🚨 Alerting System

### Sentry-Based Alert Configuration
```typescript
const SENTRY_ALERTING_SYSTEM = {
  critical_alerts: {
    system_down: 'Immediate notification for Fastify server outages',
    high_error_rate: '>5% error rate for 5 minutes (below 65k req/sec capacity)',
    slow_response: '>1 second average response time (well below target)',
    ai_service_failure: 'OpenAI/Azure API failures or timeout',
    security_breach: 'Any security incident detection'
  },
  
  performance_alerts: {
    fastify_performance: 'Throughput below 50k req/sec (threshold alert)',
    memory_usage: 'Memory usage above expected Fastify efficiency',
    database_slow: 'Prisma queries >500ms execution time',
    bullmq_backlog: 'BullMQ queue depth above thresholds'
  },
  
  business_alerts: {
    low_conversion: 'Prototype request conversion rate drops',
    payment_failures: 'Stripe/PayPal/Crypto payment processing issues',
    ai_cost_spike: 'OpenAI/Azure costs above budget thresholds',
    user_complaints: 'Negative feedback or support tickets'
  },
  
  notification_channels: {
    email: 'Detailed alert information via Amazon SES',
    slack: 'Real-time notifications to team channels',
    sms: 'Critical alerts for immediate attention',
    webhooks: 'Integration with external systems and PagerDuty'
  }
};
```

## 📈 Business Intelligence

### Technology Stack Performance KPIs
```typescript
const BUSINESS_METRICS = {
  technology_performance: {
    fastify_efficiency: 'Request handling performance vs Express baseline',
    vitest_productivity: 'Development speed improvement with 10x faster testing',
    cost_optimization: 'Track 57% infrastructure cost savings',
    ai_cost_efficiency: '3-tier AI strategy cost optimization metrics'
  },
  
  website_performance: {
    traffic: 'Daily active users, page views, session duration',
    conversion: 'Prototype request conversion rates, signup rates',
    engagement: 'Content engagement, time on site',
    seo: 'Search rankings, organic traffic growth',
    core_web_vitals: 'LCP <2.5s, FID <100ms, CLS <0.1'
  },
  
  ai_prototype_system: {
    generation_success: 'Successful prototype generation rate',
    processing_efficiency: 'Ollama vs OpenAI vs Azure performance comparison',
    user_satisfaction: 'Prototype approval and feedback scores',
    cost_per_prototype: 'AI costs per prototype generation'
  },
  
  infrastructure_efficiency: {
    cloudflare_r2: 'File storage cost savings (66% vs AWS S3)',
    amazon_ses: 'Email delivery cost efficiency (90% savings)',
    sentry_monitoring: 'Error resolution time and system reliability',
    bullmq_performance: 'Background job processing efficiency'
  }
};
```

### Sentry Dashboard Configuration
```typescript
const SENTRY_DASHBOARDS = {
  fastify_performance: {
    widgets: [
      'Request throughput (target: 65k req/sec)',
      'Average response time (<100ms)',
      'Error rate by endpoint',
      'Memory usage efficiency',
      'Route performance breakdown'
    ]
  },
  
  ai_system_health: {
    widgets: [
      'AI service availability (Ollama/OpenAI/Azure)',
      'Token usage and costs',
      'Prototype generation success rate',
      'AI response quality metrics'
    ]
  },
  
  business_metrics: {
    widgets: [
      'User conversion funnel',
      'Prototype request volume',
      'Revenue attribution',
      'Customer satisfaction scores'
    ]
  }
};
```

## 🔧 Implementation Checklist

### Sentry Setup for Fastify
- [x] **Sentry Account**: EU hosting for GDPR compliance
- [ ] **Fastify Plugin**: Install and configure Sentry Fastify integration
- [ ] **Error Tracking**: Comprehensive error capture and context
- [ ] **Performance Monitoring**: Request tracing and performance metrics
- [ ] **Alert Rules**: Configure alerts for critical thresholds
- [ ] **Dashboard Setup**: Create monitoring dashboards for different teams

### Technology Stack Monitoring
- [ ] **Fastify Metrics**: Monitor 65k req/sec performance capability
- [ ] **Vitest Integration**: Track 10x testing performance improvement
- [ ] **BullMQ Monitoring**: Background job processing health
- [ ] **AI Cost Tracking**: Monitor 3-tier AI strategy costs
- [ ] **Infrastructure Monitoring**: Track 57% cost savings achievement

---

This comprehensive monitoring system leverages **Sentry** for cost-effective, EU-compliant monitoring that integrates seamlessly with our **Fastify**-based architecture, providing superior performance tracking and business intelligence. 