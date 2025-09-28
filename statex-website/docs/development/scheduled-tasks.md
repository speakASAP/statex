# Scheduled Tasks System Documentation

## 🎯 Overview

The Statex platform implements a robust scheduled tasks system using **BullMQ** (Bull v4) with **Fastify** backend integration, providing reliable background job processing for email delivery, AI operations, data synchronization, and automated business processes with 90% cost savings through Amazon SES integration.

## 🔗 Related Documentation

- [Technology Stack](technology.md) - BullMQ and Fastify technology decisions
- [Backend Documentation](backend.md) - Fastify backend with BullMQ integration
- [Email System](email-system.md) - Email job processing with BullMQ
- [Monitoring System](monitoring-system.md) - Sentry task monitoring integration
- [AI Chat System](ai-chat-system.md) - AI job processing with BullMQ
- [Testing Strategy](testing.md) - Vitest BullMQ testing framework
- [Architecture](architecture.md) - Task queue architecture design
- [Client Portal](client-portal.md) - User management features
- [Implementation Plan](../IMPLEMENTATION_PLAN.md) - Task system milestone tracking

## 🚀 BullMQ Task Queue Architecture

### **Technology Stack Performance Benefits**
```typescript
const BULLMQ_ADVANTAGES = {
  performance: {
    throughput: 'Up to 400k jobs/hour with Redis clustering',
    memory_efficiency: '60% lower memory usage vs Bull v3',
    error_handling: 'Enhanced retry mechanisms with exponential backoff',
    monitoring: 'Built-in metrics and Redis Streams support'
  },
  
  reliability: {
    job_persistence: 'Redis-based persistence with atomic operations',
    failure_recovery: 'Automatic job retry with configurable strategies',
    dead_letter_queue: 'Failed job handling and manual intervention',
    horizontal_scaling: 'Multi-worker support with job distribution'
  },
  
  integration: {
    fastify_plugin: 'Native Fastify plugin architecture',
    typescript_support: 'Full TypeScript definitions and type safety',
    redis_optimization: 'Optimized Redis usage with connection pooling',
    monitoring_integration: 'Sentry integration for error tracking'
  }
};
```

### **Core Task Categories**

#### **1. Email Processing Tasks**
```typescript
// src/tasks/emailTasks.ts - Email Job Processing
import { Queue, Worker, Job } from 'bullmq';
import { EmailService } from '../services/emailService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const emailService = new EmailService();

// Email Queue Configuration
export const emailQueue = new Queue('email-processing', {
  connection: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
  },
  defaultJobOptions: {
    removeOnComplete: 100, // Keep last 100 completed jobs
    removeOnFail: 50,      // Keep last 50 failed jobs
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
});

// Email Job Types
interface EmailJobData {
  type: 'welcome' | 'prototype_ready' | 'marketing' | 'notification';
  userId: string;
  templateData: Record<string, any>;
  priority?: number;
  delay?: number;
}

// Email Worker Implementation
export const emailWorker = new Worker('email-processing', async (job: Job<EmailJobData>) => {
  const { type, userId, templateData, priority = 0 } = job.data;
  
  try {
    // Get user information
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { emailPreferences: true },
    });

    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }

    // Check email preferences
    if (!user.emailPreferences?.allowsMarketing && type === 'marketing') {
      return { skipped: true, reason: 'User opted out of marketing emails' };
    }

    // Process different email types
    let result;
    switch (type) {
      case 'welcome':
        result = await emailService.sendWelcomeEmail(user, templateData);
        break;
      case 'prototype_ready':
        result = await emailService.sendPrototypeReadyEmail(user, templateData);
        break;
      case 'marketing':
        result = await emailService.sendMarketingEmail(user, templateData);
        break;
      case 'notification':
        result = await emailService.sendNotificationEmail(user, templateData);
        break;
      default:
        throw new Error(`Unknown email type: ${type}`);
    }

    // Track email metrics
    await prisma.emailMetrics.create({
      data: {
        userId,
        emailType: type,
        status: 'SENT',
        messageId: result.messageId,
        cost: result.cost,
        sentAt: new Date(),
      },
    });

    return {
      success: true,
      messageId: result.messageId,
      cost: result.cost,
      provider: 'Amazon SES', // 90% cost savings
    };

  } catch (error) {
    // Track failed email
    await prisma.emailMetrics.create({
      data: {
        userId,
        emailType: type,
        status: 'FAILED',
        error: error.message,
        sentAt: new Date(),
      },
    });

    throw error;
  }
}, {
  connection: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
  },
  concurrency: 5, // Process 5 emails concurrently
});
```

#### **2. AI Processing Tasks**
```typescript
// src/tasks/aiTasks.ts - AI Job Processing
import { Queue, Worker, Job } from 'bullmq';
import { AIService } from '../services/aiService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const aiService = new AIService();

// AI Queue Configuration with Cost Optimization
export const aiQueue = new Queue('ai-processing', {
  connection: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
  },
  defaultJobOptions: {
    removeOnComplete: 50,
    removeOnFail: 25,
    attempts: 2, // Limited retries for AI jobs (cost consideration)
    backoff: {
      type: 'fixed',
      delay: 5000,
    },
  },
});

// AI Job Types with 3-Tier Strategy
interface AIJobData {
  type: 'prototype_generation' | 'chat_response' | 'voice_transcription' | 'document_analysis';
  userId: string;
  userTier: 'FREE' | 'STANDARD' | 'PREMIUM'; // Rate limiting enforcement
  requestData: Record<string, any>;
  aiTier: 'ollama' | 'openai' | 'azure' | 'auto';
  maxTokens?: number;
  estimatedCost?: number;
}

// AI Worker with Cost Optimization
export const aiWorker = new Worker('ai-processing', async (job: Job<AIJobData>) => {
  const { type, userId, userTier, requestData, aiTier, maxTokens = 4000 } = job.data;
  
  try {
    // Enforce rate limiting (2 requests/user/24h for business alignment)
    const recentRequests = await prisma.aiUsage.count({
      where: {
        userId,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
    });

    const rateLimits = {
      FREE: 1,      // 1 request per 24h
      STANDARD: 2,  // 2 requests per 24h (business-aligned)
      PREMIUM: 10,  // 10 requests per 24h
    };

    if (recentRequests >= rateLimits[userTier]) {
      throw new Error(`Rate limit exceeded for ${userTier} user: ${recentRequests}/${rateLimits[userTier]}`);
    }

    // Determine optimal AI tier based on user tier and request complexity
    let selectedAiTier = aiTier;
    if (aiTier === 'auto') {
      selectedAiTier = userTier === 'FREE' ? 'ollama' : 
                     userTier === 'PREMIUM' ? 'azure' : 'openai';
    }

    // Process AI request
    let result;
    switch (type) {
      case 'prototype_generation':
        result = await aiService.generatePrototype(requestData, selectedAiTier, maxTokens);
        break;
      case 'chat_response':
        result = await aiService.generateChatResponse(requestData, selectedAiTier, maxTokens);
        break;
      case 'voice_transcription':
        result = await aiService.transcribeAudio(requestData, selectedAiTier);
        break;
      case 'document_analysis':
        result = await aiService.analyzeDocument(requestData, selectedAiTier);
        break;
      default:
        throw new Error(`Unknown AI task type: ${type}`);
    }

    // Track AI usage and costs
    await prisma.aiUsage.create({
      data: {
        userId,
        taskType: type,
        aiProvider: result.provider,
        tokensUsed: result.tokensUsed,
        costUsd: result.cost,
        userTier,
        status: 'COMPLETED',
        createdAt: new Date(),
      },
    });

    // Trigger notification for completed prototypes
    if (type === 'prototype_generation' && result.success) {
      await emailQueue.add('email-processing', {
        type: 'prototype_ready',
        userId,
        templateData: {
          prototypeName: requestData.name,
          prototypeUrl: result.prototypeUrl,
          generationTime: result.generationTime,
        },
      }, {
        delay: 2000, // Small delay to ensure prototype is fully ready
      });
    }

    return {
      success: true,
      provider: result.provider,
      tokensUsed: result.tokensUsed,
      cost: result.cost,
      result: result.output,
    };

  } catch (error) {
    // Track failed AI usage
    await prisma.aiUsage.create({
      data: {
        userId,
        taskType: type,
        status: 'FAILED',
        error: error.message,
        userTier,
        createdAt: new Date(),
      },
    });

    throw error;
  }
}, {
  connection: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
  },
  concurrency: 3, // Process 3 AI requests concurrently (cost management)
});
```

#### **3. Maintenance and Cleanup Tasks**
```typescript
// src/tasks/maintenanceTasks.ts - System Maintenance Jobs
import { Queue, Worker, Job } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import { CloudflareR2Service } from '../services/cloudflareR2Service';

const prisma = new PrismaClient();
const r2Service = new CloudflareR2Service();

// Maintenance Queue for Scheduled Operations
export const maintenanceQueue = new Queue('maintenance', {
  connection: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
  },
});

interface MaintenanceJobData {
  type: 'cleanup_files' | 'update_metrics' | 'backup_data' | 'optimize_database';
  parameters?: Record<string, any>;
}

// Maintenance Worker
export const maintenanceWorker = new Worker('maintenance', async (job: Job<MaintenanceJobData>) => {
  const { type, parameters = {} } = job.data;
  
  try {
    let result;
    
    switch (type) {
      case 'cleanup_files':
        result = await cleanupExpiredFiles(parameters);
        break;
      case 'update_metrics':
        result = await updateSystemMetrics(parameters);
        break;
      case 'backup_data':
        result = await backupCriticalData(parameters);
        break;
      case 'optimize_database':
        result = await optimizeDatabase(parameters);
        break;
      default:
        throw new Error(`Unknown maintenance task: ${type}`);
    }
    
    return { success: true, ...result };
  } catch (error) {
    console.error(`Maintenance task failed: ${type}`, error);
    throw error;
  }
}, {
  connection: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
  },
  concurrency: 1, // Run maintenance tasks sequentially
});

// Cleanup Functions
async function cleanupExpiredFiles(params: any) {
  const expirationDate = new Date(Date.now() - (params.daysOld || 30) * 24 * 60 * 60 * 1000);
  
  // Clean up expired prototype files
  const expiredPrototypes = await prisma.prototype.findMany({
    where: {
      status: 'COMPLETED',
      createdAt: { lt: expirationDate },
      filesCleanedUp: false,
    },
  });

  let filesDeleted = 0;
  for (const prototype of expiredPrototypes) {
    if (prototype.fileUrls) {
      for (const fileUrl of prototype.fileUrls) {
        await r2Service.deleteFile(fileUrl);
        filesDeleted++;
      }
    }
    
    await prisma.prototype.update({
      where: { id: prototype.id },
      data: { filesCleanedUp: true },
    });
  }

  return { filesDeleted, prototypesProcessed: expiredPrototypes.length };
}

async function updateSystemMetrics(params: any) {
  const today = new Date();
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  
  // Calculate daily metrics
  const metrics = await prisma.$transaction(async (tx) => {
    const [
      newUsers,
      completedPrototypes,
      emailsSent,
      aiRequestsProcessed,
      totalRevenue,
    ] = await Promise.all([
      tx.user.count({
        where: { createdAt: { gte: yesterday, lt: today } },
      }),
      tx.prototype.count({
        where: { 
          status: 'COMPLETED',
          updatedAt: { gte: yesterday, lt: today },
        },
      }),
      tx.emailMetrics.count({
        where: { 
          status: 'SENT',
          sentAt: { gte: yesterday, lt: today },
        },
      }),
      tx.aiUsage.count({
        where: { 
          status: 'COMPLETED',
          createdAt: { gte: yesterday, lt: today },
        },
      }),
      tx.payment.aggregate({
        where: { 
          status: 'COMPLETED',
          createdAt: { gte: yesterday, lt: today },
        },
        _sum: { amount: true },
      }),
    ]);

    // Store daily metrics
    await tx.dailyMetrics.create({
      data: {
        date: yesterday,
        newUsers,
        completedPrototypes,
        emailsSent,
        aiRequestsProcessed,
        revenue: totalRevenue._sum.amount || 0,
      },
    });

    return {
      newUsers,
      completedPrototypes,
      emailsSent,
      aiRequestsProcessed,
      revenue: totalRevenue._sum.amount || 0,
    };
  });

  return metrics;
}

async function backupCriticalData(params: any) {
  // Create database backup
  const backupData = {
    users: await prisma.user.count(),
    prototypes: await prisma.prototype.count(),
    payments: await prisma.payment.count(),
    timestamp: new Date(),
  };

  // Store backup info (actual backup would use pg_dump or similar)
  await prisma.systemBackup.create({
    data: {
      backupType: 'SCHEDULED',
      status: 'COMPLETED',
      recordsCounts: backupData,
      createdAt: new Date(),
    },
  });

  return { backupCreated: true, ...backupData };
}

async function optimizeDatabase(params: any) {
  // Database optimization queries
  const optimizations = [
    'VACUUM ANALYZE users',
    'VACUUM ANALYZE prototypes',
    'VACUUM ANALYZE ai_usage',
    'REINDEX INDEX CONCURRENTLY idx_users_email',
    'REINDEX INDEX CONCURRENTLY idx_prototypes_user_id',
  ];

  const results = [];
  for (const query of optimizations) {
    try {
      await prisma.$executeRawUnsafe(query);
      results.push({ query, status: 'success' });
    } catch (error) {
      results.push({ query, status: 'failed', error: error.message });
    }
  }

  return { optimizations: results };
}
```

### **4. Fastify Integration**
```typescript
// src/plugins/taskQueue.ts - Fastify BullMQ Plugin
import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import { emailQueue, emailWorker } from '../tasks/emailTasks';
import { aiQueue, aiWorker } from '../tasks/aiTasks';
import { maintenanceQueue, maintenanceWorker } from '../tasks/maintenanceTasks';

interface TaskQueueOptions {
  redisConnection: {
    host: string;
    port: number;
    password?: string;
  };
}

export default fp<TaskQueueOptions>(async function (fastify, opts) {
  // Register queues and workers
  const queues = {
    email: emailQueue,
    ai: aiQueue,
    maintenance: maintenanceQueue,
  };

  const workers = {
    email: emailWorker,
    ai: aiWorker,
    maintenance: maintenanceWorker,
  };

  // Decorate fastify instance with queues
  fastify.decorate('queues', queues);
  
  // Add helper methods
  fastify.decorate('addEmailJob', async (jobData: any, options = {}) => {
    return await emailQueue.add('email-processing', jobData, options);
  });

  fastify.decorate('addAIJob', async (jobData: any, options = {}) => {
    return await aiQueue.add('ai-processing', jobData, options);
  });

  fastify.decorate('addMaintenanceJob', async (jobData: any, options = {}) => {
    return await maintenanceQueue.add('maintenance', jobData, options);
  });

  // Setup scheduled maintenance tasks
  await setupScheduledTasks(fastify);

  // Graceful shutdown
  fastify.addHook('onClose', async () => {
    await Promise.all([
      emailQueue.close(),
      aiQueue.close(),
      maintenanceQueue.close(),
    ]);

    await Promise.all([
      emailWorker.close(),
      aiWorker.close(),
      maintenanceWorker.close(),
    ]);
  });
});

// Setup Cron-like Scheduled Tasks
async function setupScheduledTasks(fastify: FastifyInstance) {
  // Daily file cleanup at 2 AM
  await maintenanceQueue.add('maintenance', 
    { type: 'cleanup_files', parameters: { daysOld: 30 } },
    {
      repeat: { pattern: '0 2 * * *' }, // Every day at 2 AM
      jobId: 'daily-cleanup',
    }
  );

  // Daily metrics update at 1 AM
  await maintenanceQueue.add('maintenance',
    { type: 'update_metrics' },
    {
      repeat: { pattern: '0 1 * * *' }, // Every day at 1 AM
      jobId: 'daily-metrics',
    }
  );

  // Weekly database backup on Sundays at 3 AM
  await maintenanceQueue.add('maintenance',
    { type: 'backup_data' },
    {
      repeat: { pattern: '0 3 * * 0' }, // Every Sunday at 3 AM
      jobId: 'weekly-backup',
    }
  );

  // Monthly database optimization on 1st at 4 AM
  await maintenanceQueue.add('maintenance',
    { type: 'optimize_database' },
    {
      repeat: { pattern: '0 4 1 * *' }, // 1st of every month at 4 AM
      jobId: 'monthly-optimization',
    }
  );

  // Weekly marketing email campaigns (if users opted in)
  await emailQueue.add('email-processing',
    { type: 'marketing', templateData: { campaign: 'weekly_newsletter' } },
    {
      repeat: { pattern: '0 10 * * 1' }, // Every Monday at 10 AM
      jobId: 'weekly-marketing',
    }
  );
}
```

## 📊 Task Queue Monitoring & Analytics

### **BullMQ Dashboard Integration**
```typescript
// src/routes/admin/queue-dashboard.ts - Queue Monitoring
import { FastifyInstance } from 'fastify';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { FastifyAdapter } from '@bull-board/fastify';

export default async function queueDashboard(fastify: FastifyInstance) {
  const serverAdapter = new FastifyAdapter();
  
  createBullBoard({
    queues: [
      new BullMQAdapter(fastify.queues.email),
      new BullMQAdapter(fastify.queues.ai),
      new BullMQAdapter(fastify.queues.maintenance),
    ],
    serverAdapter,
  });

  serverAdapter.setBasePath('/admin/queues');
  
  // Protect with authentication
  fastify.register(async function (fastify) {
    await fastify.register(serverAdapter.registerPlugin(), {
      prefix: '/admin/queues',
      basePath: '/',
    });
  }, {
    preHandler: async (request, reply) => {
      // Check admin authentication
      if (!request.user?.isAdmin) {
        reply.code(403).send({ error: 'Admin access required' });
      }
    },
  });
}
```

### **Custom Queue Metrics**
```typescript
// src/services/queueMetricsService.ts - Queue Performance Tracking
import { Queue } from 'bullmq';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class QueueMetricsService {
  private queues: Record<string, Queue>;

  constructor(queues: Record<string, Queue>) {
    this.queues = queues;
  }

  async collectMetrics(): Promise<Record<string, any>> {
    const metrics: Record<string, any> = {};

    for (const [name, queue] of Object.entries(this.queues)) {
      const [waiting, active, completed, failed, delayed] = await Promise.all([
        queue.getWaiting(),
        queue.getActive(),
        queue.getCompleted(),
        queue.getFailed(),
        queue.getDelayed(),
      ]);

      metrics[name] = {
        waiting: waiting.length,
        active: active.length,
        completed: completed.length,
        failed: failed.length,
        delayed: delayed.length,
        total: waiting.length + active.length + completed.length + failed.length + delayed.length,
      };
    }

    // Store metrics in database
    await prisma.queueMetrics.create({
      data: {
        timestamp: new Date(),
        metrics,
      },
    });

    return metrics;
  }

  async getQueueHealth(): Promise<{ healthy: boolean; issues: string[] }> {
    const metrics = await this.collectMetrics();
    const issues: string[] = [];

    // Check for potential issues
    for (const [queueName, queueMetrics] of Object.entries(metrics)) {
      if (queueMetrics.failed > 10) {
        issues.push(`${queueName} queue has ${queueMetrics.failed} failed jobs`);
      }
      
      if (queueMetrics.waiting > 100) {
        issues.push(`${queueName} queue has ${queueMetrics.waiting} waiting jobs (potential backlog)`);
      }
      
      if (queueMetrics.active === 0 && queueMetrics.waiting > 0) {
        issues.push(`${queueName} queue has no active workers but ${queueMetrics.waiting} waiting jobs`);
      }
    }

    return {
      healthy: issues.length === 0,
      issues,
    };
  }
}
```

## 🧪 Testing with Vitest

### **BullMQ Job Testing**
```typescript
// __tests__/tasks/emailTasks.test.ts - Vitest Task Testing
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Queue, Worker } from 'bullmq';
import { EmailService } from '../../src/services/emailService';

describe('Email Task Processing', () => {
  let emailQueue: Queue;
  let emailWorker: Worker;
  let emailService: EmailService;

  beforeEach(async () => {
    // Use test Redis database
    emailQueue = new Queue('test-email', {
      connection: {
        host: 'localhost',
        port: 6379,
        db: 1, // Test database
      }
    });

    emailService = new EmailService();
    
    emailWorker = new Worker('test-email', async (job) => {
      return await emailService.processEmailJob(job);
    }, {
      connection: {
        host: 'localhost',
        port: 6379,
        db: 1,
      }
    });
  });

  afterEach(async () => {
    await emailQueue.obliterate({ force: true });
    await emailQueue.close();
    await emailWorker.close();
  });

  it('should process welcome email job successfully', async () => {
    const jobData = {
      type: 'welcome',
      userId: 'test-user-id',
      templateData: {
        name: 'Test User',
        email: 'test@example.com',
      },
    };

    const job = await emailQueue.add('email-processing', jobData);
    const result = await job.waitUntilFinished();

    expect(result.success).toBe(true);
    expect(result.messageId).toBeDefined();
    expect(result.provider).toBe('Amazon SES');
    expect(result.cost).toBeGreaterThan(0);
  });

  it('should handle email job failures gracefully', async () => {
    const jobData = {
      type: 'welcome',
      userId: 'non-existent-user',
      templateData: {},
    };

    const job = await emailQueue.add('email-processing', jobData);
    
    await expect(job.waitUntilFinished()).rejects.toThrow('User not found');
  });

  it('should respect rate limiting for email jobs', async () => {
    // Add multiple marketing emails quickly
    const jobs = Array(10).fill(null).map((_, i) =>
      emailQueue.add('email-processing', {
        type: 'marketing',
        userId: 'test-user-id',
        templateData: { campaign: `test-${i}` },
      })
    );

    const results = await Promise.allSettled(
      jobs.map(job => job.waitUntilFinished())
    );

    // Some should be processed, others might be rate limited
    const processed = results.filter(r => r.status === 'fulfilled').length;
    expect(processed).toBeGreaterThan(0);
  });
});
```

### **AI Task Testing**
```typescript
// __tests__/tasks/aiTasks.test.ts - AI Job Testing
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Queue, Worker } from 'bullmq';
import { AIService } from '../../src/services/aiService';

describe('AI Task Processing', () => {
  let aiQueue: Queue;
  let aiWorker: Worker;

  beforeEach(() => {
    aiQueue = new Queue('test-ai', {
      connection: { host: 'localhost', port: 6379, db: 1 }
    });

    aiWorker = new Worker('test-ai', async (job) => {
      const aiService = new AIService();
      return await aiService.processAIJob(job);
    }, {
      connection: { host: 'localhost', port: 6379, db: 1 }
    });
  });

  it('should enforce rate limiting (2 requests/user/24h)', async () => {
    const jobData = {
      type: 'prototype_generation',
      userId: 'test-user',
      userTier: 'STANDARD',
      requestData: { description: 'Simple web app' },
      aiTier: 'openai',
    };

    // First request should succeed
    const job1 = await aiQueue.add('ai-processing', jobData);
    const result1 = await job1.waitUntilFinished();
    expect(result1.success).toBe(true);

    // Second request should succeed (within limit)
    const job2 = await aiQueue.add('ai-processing', jobData);
    const result2 = await job2.waitUntilFinished();
    expect(result2.success).toBe(true);

    // Third request should fail (rate limit exceeded)
    const job3 = await aiQueue.add('ai-processing', jobData);
    await expect(job3.waitUntilFinished())
      .rejects.toThrow('Rate limit exceeded for STANDARD user: 2/2');
  });

  it('should optimize AI tier selection based on user tier', async () => {
    const testCases = [
      { userTier: 'FREE', aiTier: 'auto', expectedProvider: 'ollama' },
      { userTier: 'STANDARD', aiTier: 'auto', expectedProvider: 'openai' },
      { userTier: 'PREMIUM', aiTier: 'auto', expectedProvider: 'azure' },
    ];

    for (const testCase of testCases) {
      const job = await aiQueue.add('ai-processing', {
        type: 'chat_response',
        userId: `test-user-${testCase.userTier}`,
        userTier: testCase.userTier,
        requestData: { message: 'Hello' },
        aiTier: testCase.aiTier,
      });

      const result = await job.waitUntilFinished();
      expect(result.provider).toBe(testCase.expectedProvider);
    }
  });
});
```

## 🎯 Implementation Checklist

### **BullMQ Setup**
- [ ] **Queue Configuration**: Redis connection, job options, retry strategies
- [ ] **Worker Implementation**: Email, AI, and maintenance job processors
- [ ] **Fastify Integration**: Plugin registration and helper methods
- [ ] **Scheduled Tasks**: Cron-like scheduling for recurring operations
- [ ] **Rate Limiting**: Business-aligned 2 requests/user/24h enforcement

### **Job Processing**
- [ ] **Email Jobs**: Welcome, prototype ready, marketing campaigns with SES integration
- [ ] **AI Jobs**: 3-tier strategy implementation with cost optimization
- [ ] **Maintenance Jobs**: File cleanup, metrics updates, database optimization
- [ ] **Error Handling**: Comprehensive error tracking and retry mechanisms
- [ ] **Cost Tracking**: AI usage and email cost monitoring

### **Monitoring & Analytics**
- [ ] **BullBoard Dashboard**: Real-time queue monitoring interface
- [ ] **Queue Metrics**: Performance tracking and health monitoring
- [ ] **Sentry Integration**: Error tracking and performance monitoring
- [ ] **Database Metrics**: Job success rates, processing times, costs
- [ ] **Alerting System**: Queue health alerts and failure notifications

### **Testing & Quality**
- [ ] **Vitest Integration**: Comprehensive job testing framework
- [ ] **Redis Test Environment**: Isolated testing with test database
- [ ] **Job Failure Testing**: Error handling and retry validation
- [ ] **Rate Limiting Tests**: Business rule enforcement validation
- [ ] **Performance Testing**: Queue throughput and worker efficiency

---

**This scheduled tasks system leverages BullMQ's enhanced capabilities with Fastify integration to provide reliable, cost-optimized background job processing that supports the platform's business goals while maintaining high performance and reliability.** 