# Social Media Aggregation System

## 🎯 Overview

The Statex Social Media Aggregation system collects, analyzes, and responds to social media interactions across all platforms (LinkedIn, Facebook, Twitter, Instagram, Telegram, WhatsApp) using **AI-powered sentiment analysis** and automated response generation. Built with **Fastify** backend, **PostgreSQL + Prisma** database, and **BullMQ** job processing for high-performance social media management.

## 🔗 Related Documentation

- [Technology Stack](technology.md) - Complete technology decisions and cost analysis
- [Architecture](architecture.md) - System architecture overview
- [Backend Documentation](backend.md) - Fastify implementation details
- [Social Media Integration](social-media-integration.md) - Platform integrations
- [AI Chat System](ai-chat-system.md) - AI response generation
- [CRM System](crm-system.md) - Lead tracking and management
- [Notification System](notification-system.md) - Multi-channel notifications
- [Testing](testing.md) - Vitest testing strategies
- [Business Terms](../business/terms-of-reference.md) - Business requirements

## 🏗 Microservice Architecture

### Aggregation System Components
```typescript
const AGGREGATION_SYSTEM = {
  data_collection: {
    api_polling: 'Regular polling of social media APIs',
    webhook_processing: 'Real-time webhook event processing',
    stream_processing: 'Real-time social media streams',
    batch_ingestion: 'Bulk data import and processing'
  },
  
  interaction_processing: {
    sentiment_analysis: 'AI-powered sentiment classification',
    intent_recognition: 'Identify user intent and needs',
    priority_scoring: 'Score interactions by importance',
    duplicate_detection: 'Identify and merge duplicate interactions'
  },
  
  response_automation: {
    ai_response_generation: 'Generate contextual responses',
    approval_workflow: 'Human review for sensitive responses',
    automated_posting: 'Direct response posting to platforms',
    escalation_routing: 'Route complex issues to human agents'
  }
};
```

## 🏗 **Fastify Backend Implementation**

### **Social Media Aggregation API Routes**
```typescript
// routes/social/aggregation.ts - Fastify routes for social media aggregation
import { FastifyPluginAsync } from 'fastify';
import { Type, Static } from '@sinclair/typebox';
import { socialAggregationService } from '@/services/socialAggregationService';
import { authenticateUser } from '@/middleware/auth';

// Request/Response schemas
const GetInteractionsSchema = Type.Object({
  platform: Type.Optional(Type.String()),
  sentiment: Type.Optional(Type.String()),
  limit: Type.Optional(Type.Number({ minimum: 1, maximum: 100 })),
  offset: Type.Optional(Type.Number({ minimum: 0 }))
});

const socialAggregationRoutes: FastifyPluginAsync = async (fastify) => {
  // Get social media interactions with filtering
  fastify.get('/interactions', {
    schema: {
      querystring: GetInteractionsSchema,
      response: {
        200: Type.Object({
          interactions: Type.Array(Type.Object({
            id: Type.String(),
            platform: Type.String(),
            content: Type.String(),
            sentiment: Type.Number(),
            priority: Type.Number(),
            createdAt: Type.String()
          })),
          total: Type.Number(),
          hasMore: Type.Boolean()
        })
      }
    },
    preHandler: authenticateUser,
    handler: async (request, reply) => {
      const query = request.query as Static<typeof GetInteractionsSchema>;
      
      try {
        const result = await socialAggregationService.getInteractions({
          platform: query.platform,
          sentiment: query.sentiment,
          limit: query.limit || 20,
          offset: query.offset || 0
        });
        
        return reply.code(200).send(result);
      } catch (error) {
        fastify.log.error('Failed to fetch interactions:', error);
        return reply.code(500).send({
          error: 'FETCH_INTERACTIONS_FAILED',
          message: 'Failed to fetch social media interactions'
        });
      }
    }
  });

  // Generate AI response for interaction
  fastify.post('/interactions/:id/generate-response', {
    schema: {
      params: Type.Object({
        id: Type.String()
      }),
      response: {
        200: Type.Object({
          response: Type.String(),
          confidence: Type.Number(),
          requiresApproval: Type.Boolean()
        })
      }
    },
    preHandler: authenticateUser,
    handler: async (request, reply) => {
      const { id } = request.params as { id: string };
      
      try {
        const response = await socialAggregationService.generateAIResponse(id);
        return reply.code(200).send(response);
      } catch (error) {
        fastify.log.error('Failed to generate response:', error);
        return reply.code(500).send({
          error: 'RESPONSE_GENERATION_FAILED',
          message: 'Failed to generate AI response'
        });
      }
    }
  });

  // Approve and post response
  fastify.post('/interactions/:id/approve-response', {
    schema: {
      params: Type.Object({
        id: Type.String()
      }),
      body: Type.Object({
        approved: Type.Boolean(),
        modifiedResponse: Type.Optional(Type.String())
      })
    },
    preHandler: authenticateUser,
    handler: async (request, reply) => {
      const { id } = request.params as { id: string };
      const { approved, modifiedResponse } = request.body as {
        approved: boolean;
        modifiedResponse?: string;
      };
      
      try {
        await socialAggregationService.approveResponse(id, approved, modifiedResponse);
        return reply.code(200).send({ success: true });
      } catch (error) {
        fastify.log.error('Failed to approve response:', error);
        return reply.code(500).send({
          error: 'APPROVAL_FAILED',
          message: 'Failed to approve response'
        });
      }
    }
  });
};

export default socialAggregationRoutes;
```

## 🗄 **PostgreSQL + Prisma Database Schema**

### **Prisma Schema Models**
```prisma
// prisma/schema.prisma - Social media aggregation models
model SocialInteraction {
  id                    String   @id @default(cuid())
  
  // Source Information
  platform              SocialPlatform
  externalId            String   @unique
  interactionType       InteractionType
  
  // Content Details
  authorHandle          String?
  authorName            String?
  content               String
  mediaUrls             Json?
  
  // Context
  postId                String?
  parentInteractionId   String?
  parentInteraction     SocialInteraction? @relation("InteractionThread", fields: [parentInteractionId], references: [id])
  childInteractions     SocialInteraction[] @relation("InteractionThread")
  threadContext         Json?
  
  // AI Analysis
  sentimentScore        Float?   // -1.0 to 1.0
  intentClassification  String?
  priorityScore         Int?     // 1-100
  requiresResponse      Boolean  @default(false)
  
  // Response Management
  responseGenerated     Boolean  @default(false)
  responseApproved      Boolean  @default(false)
  responsePosted        Boolean  @default(false)
  aiResponseText        String?
  
  // CRM Integration
  contactId             String?
  contact               CRMContact? @relation(fields: [contactId], references: [id])
  leadPotential         Int?     // 1-100
  
  // Metadata
  createdAt             DateTime @default(now())
  processedAt           DateTime?
  updatedAt             DateTime @updatedAt
  
  @@map("social_interactions")
}

model SocialPlatformConfig {
  id                    String   @id @default(cuid())
  platform              SocialPlatform
  
  // API Configuration
  apiKey                String?
  apiSecret             String?
  accessToken           String?
  refreshToken          String?
  
  // Webhook Configuration
  webhookUrl            String?
  webhookSecret         String?
  
  // Settings
  autoResponse          Boolean  @default(false)
  responseDelay         Int      @default(0) // minutes
  maxResponsesPerHour   Int      @default(10)
  
  // Status
  isActive              Boolean  @default(true)
  lastSync              DateTime?
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  
  @@map("social_platform_configs")
}

enum SocialPlatform {
  LINKEDIN
  FACEBOOK
  TWITTER
  INSTAGRAM
  TELEGRAM
  WHATSAPP
  DISCORD
}

enum InteractionType {
  MENTION
  COMMENT
  DIRECT_MESSAGE
  SHARE
  LIKE
  REACTION
  REVIEW
}
```

## ⚙️ **BullMQ Job Processing**

### **Social Media Job Queue**
```typescript
// services/socialAggregationService.ts - BullMQ job processing
import { Queue, Worker, Job } from 'bullmq';
import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';
import { aiService } from '@/services/aiService';
import { notificationService } from '@/services/notificationService';

// Job types
interface ProcessInteractionJob {
  interactionId: string;
  platform: string;
  priority: number;
}

interface GenerateResponseJob {
  interactionId: string;
  forceRegenerate?: boolean;
}

export class SocialAggregationService {
  private processQueue: Queue<ProcessInteractionJob>;
  private responseQueue: Queue<GenerateResponseJob>;
  private processWorker: Worker<ProcessInteractionJob>;
  private responseWorker: Worker<GenerateResponseJob>;

  constructor() {
    // Initialize job queues
    this.processQueue = new Queue('social:process', {
      connection: redis,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000
        },
        removeOnComplete: 100,
        removeOnFail: 50
      }
    });

    this.responseQueue = new Queue('social:response', {
      connection: redis,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000
        }
      }
    });

    // Initialize workers
    this.initializeWorkers();
  }

  private initializeWorkers() {
    // Process incoming interactions
    this.processWorker = new Worker<ProcessInteractionJob>(
      'social:process',
      async (job: Job<ProcessInteractionJob>) => {
        const { interactionId, platform, priority } = job.data;
        
        try {
          await this.processInteraction(interactionId, platform, priority);
          job.updateProgress(100);
        } catch (error) {
          console.error(`Failed to process interaction ${interactionId}:`, error);
          throw error;
        }
      },
      {
        connection: redis,
        concurrency: 5,
        limiter: {
          max: 100,
          duration: 60000 // 100 jobs per minute
        }
      }
    );

    // Generate AI responses
    this.responseWorker = new Worker<GenerateResponseJob>(
      'social:response',
      async (job: Job<GenerateResponseJob>) => {
        const { interactionId, forceRegenerate } = job.data;
        
        try {
          await this.processAIResponse(interactionId, forceRegenerate);
          job.updateProgress(100);
        } catch (error) {
          console.error(`Failed to generate response for ${interactionId}:`, error);
          throw error;
        }
      },
      {
        connection: redis,
        concurrency: 3,
        limiter: {
          max: 50,
          duration: 60000 // 50 AI responses per minute
        }
      }
    );
  }

  // Queue interaction for processing
  async queueInteractionProcessing(interactionId: string, platform: string, priority: number = 50) {
    await this.processQueue.add('process-interaction', {
      interactionId,
      platform,
      priority
    }, {
      priority: priority,
      delay: priority > 80 ? 0 : 30000 // High priority processed immediately
    });
  }

  // Queue AI response generation
  async queueResponseGeneration(interactionId: string, forceRegenerate: boolean = false) {
    await this.responseQueue.add('generate-response', {
      interactionId,
      forceRegenerate
    });
  }

  // Process individual interaction
  private async processInteraction(interactionId: string, platform: string, priority: number) {
    const interaction = await prisma.socialInteraction.findUnique({
      where: { id: interactionId },
      include: {
        contact: true,
        parentInteraction: true
      }
    });

    if (!interaction) {
      throw new Error(`Interaction ${interactionId} not found`);
    }

    // Perform sentiment analysis
    const sentimentScore = await aiService.analyzeSentiment(interaction.content);
    
    // Classify intent
    const intentClassification = await aiService.classifyIntent(interaction.content, platform);
    
    // Calculate priority score
    const calculatedPriority = this.calculatePriorityScore(
      sentimentScore,
      intentClassification,
      interaction.authorHandle
    );

    // Update interaction with analysis
    await prisma.socialInteraction.update({
      where: { id: interactionId },
      data: {
        sentimentScore,
        intentClassification,
        priorityScore: calculatedPriority,
        requiresResponse: this.shouldGenerateResponse(sentimentScore, intentClassification),
        processedAt: new Date()
      }
    });

    // Queue response generation if needed
    if (this.shouldGenerateResponse(sentimentScore, intentClassification)) {
      await this.queueResponseGeneration(interactionId);
    }

    // Send notification for high-priority interactions
    if (calculatedPriority > 80) {
      await notificationService.sendHighPriorityAlert({
        type: 'HIGH_PRIORITY_SOCIAL_INTERACTION',
        interactionId,
        platform,
        priority: calculatedPriority,
        content: interaction.content.substring(0, 200)
      });
    }
  }

  // Generate AI response
  private async processAIResponse(interactionId: string, forceRegenerate: boolean = false) {
    const interaction = await prisma.socialInteraction.findUnique({
      where: { id: interactionId },
      include: {
        parentInteraction: true,
        contact: true
      }
    });

    if (!interaction) {
      throw new Error(`Interaction ${interactionId} not found`);
    }

    // Skip if response already generated and not forcing regeneration
    if (interaction.responseGenerated && !forceRegenerate) {
      return;
    }

    // Generate contextual AI response
    const aiResponse = await aiService.generateSocialResponse({
      content: interaction.content,
      platform: interaction.platform,
      context: interaction.threadContext,
      sentiment: interaction.sentimentScore,
      intent: interaction.intentClassification,
      authorProfile: {
        handle: interaction.authorHandle,
        name: interaction.authorName
      },
      conversationHistory: interaction.parentInteraction ? [interaction.parentInteraction] : []
    });

    // Update interaction with generated response
    await prisma.socialInteraction.update({
      where: { id: interactionId },
      data: {
        aiResponseText: aiResponse.text,
        responseGenerated: true,
        responseApproved: aiResponse.confidence > 0.8 ? true : false // Auto-approve high-confidence responses
      }
    });

    // If auto-approved, queue for posting
    if (aiResponse.confidence > 0.8) {
      await this.queueResponsePosting(interactionId);
    }
  }

  // Calculate priority score based on multiple factors
  private calculatePriorityScore(sentiment: number, intent: string, authorHandle?: string): number {
    let score = 50; // Base priority

    // Sentiment impact
    if (sentiment < -0.5) score += 30; // Negative sentiment gets higher priority
    else if (sentiment > 0.7) score += 10; // Very positive sentiment

    // Intent impact
    const highPriorityIntents = ['complaint', 'support_request', 'purchase_inquiry', 'refund_request'];
    if (highPriorityIntents.includes(intent.toLowerCase())) {
      score += 25;
    }

    // Verified/influential author
    if (authorHandle && this.isInfluentialAccount(authorHandle)) {
      score += 15;
    }

    return Math.min(100, Math.max(1, score));
  }

  // Determine if response should be generated
  private shouldGenerateResponse(sentiment: number, intent: string): boolean {
    // Always respond to negative sentiment or support requests
    if (sentiment < -0.3) return true;
    if (['complaint', 'support_request', 'purchase_inquiry'].includes(intent.toLowerCase())) return true;
    
    // Respond to positive mentions
    if (sentiment > 0.5 && intent === 'mention') return true;
    
    return false;
  }

  // Check if account is influential (simplified)
  private isInfluentialAccount(handle: string): boolean {
    // This would typically check against a database of influential accounts
    const influentialDomains = ['@techcrunch', '@forbes', '@wired'];
    return influentialDomains.some(domain => handle.toLowerCase().includes(domain));
  }

  // Queue response for posting
  private async queueResponsePosting(interactionId: string) {
    // Implementation would queue the response for posting to the respective platform
    console.log(`Queueing response posting for interaction ${interactionId}`);
  }
}

export const socialAggregationService = new SocialAggregationService();
```

## 🤖 AI-Powered Response System

### Intelligent Response Generation
```typescript
const AI_RESPONSE_SYSTEM = {
  context_analysis: {
    conversation_history: 'Analyze full conversation thread',
    user_profile: 'Consider user\'s previous interactions',
    platform_context: 'Adapt response for specific platform',
    brand_voice: 'Maintain consistent brand personality'
  },
  
  response_strategies: {
    helpful_support: 'Provide useful information and solutions',
    lead_qualification: 'Identify and qualify potential leads',
    community_building: 'Foster positive community engagement',
    crisis_management: 'Handle negative feedback professionally'
  },
  
  quality_assurance: {
    tone_analysis: 'Ensure appropriate tone for context',
    factual_accuracy: 'Verify information before responding',
    compliance_check: 'Ensure responses meet platform guidelines',
    brand_alignment: 'Maintain brand voice and values'
  }
};
```

## 📊 Analytics and Insights

### Social Media Intelligence
```typescript
const SOCIAL_ANALYTICS = {
  engagement_metrics: {
    response_time: 'Average time to respond to interactions',
    engagement_rate: 'Percentage of interactions receiving responses',
    sentiment_trends: 'Track sentiment changes over time',
    platform_performance: 'Compare performance across platforms'
  },
  
  lead_generation: {
    lead_identification: 'Identify potential leads from interactions',
    conversion_tracking: 'Track social leads through sales funnel',
    roi_analysis: 'Calculate return on social media investment',
    opportunity_scoring: 'Score interactions for sales potential'
  },
  
  brand_monitoring: {
    mention_tracking: 'Track brand mentions across platforms',
    competitor_analysis: 'Monitor competitor social activity',
    trend_identification: 'Identify emerging trends and topics',
    influence_measurement: 'Track brand influence and reach'
  }
};
```

---

This microservice provides comprehensive social media aggregation and intelligent response automation to maintain active engagement across all platforms. 

### Database Schema
```sql
CREATE TABLE social_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Source Information
    platform social_platform_enum NOT NULL,
    external_id VARCHAR(255) UNIQUE NOT NULL,
    interaction_type interaction_type_enum NOT NULL,
    
    -- Content Details
    author_handle VARCHAR(255),
    author_name VARCHAR(255),
    content TEXT NOT NULL,
    media_urls JSONB,
    
    -- Context
    post_id VARCHAR(255),
    parent_interaction_id UUID REFERENCES social_interactions(id),
    thread_context JSONB,
    
    -- AI Analysis
    sentiment_score DECIMAL(3,2), -- -1.0 to 1.0
    intent_classification VARCHAR(100),
    priority_score INTEGER, -- 1-100
    requires_response BOOLEAN DEFAULT FALSE,
    
    -- Response Management
    response_generated BOOLEAN DEFAULT FALSE,
    response_approved BOOLEAN DEFAULT FALSE,
    response_posted BOOLEAN DEFAULT FALSE,
    ai_response_text TEXT,
    
    -- CRM Integration
    contact_id UUID REFERENCES crm_contacts(id),
    lead_potential INTEGER, -- 1-100
    
    created_at TIMESTAMP DEFAULT NOW(),
    processed_at TIMESTAMP
);

CREATE TYPE interaction_type_enum AS ENUM ('MENTION', 'COMMENT', 'DIRECT_MESSAGE', 'SHARE', 'LIKE', 'REACTION');
```

## 🧪 **Vitest Testing**

### **Social Media Aggregation Tests**
```typescript
// __tests__/services/socialAggregationService.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { socialAggregationService } from '@/services/socialAggregationService';
import { prisma } from '@/lib/prisma';

// Mock dependencies
vi.mock('@/lib/prisma');
vi.mock('@/services/aiService');

describe('Social Media Aggregation Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('processInteraction', () => {
    it('should process social media interaction with sentiment analysis', async () => {
      const mockInteraction = {
        id: 'test-id',
        content: 'Great service!',
        platform: 'TWITTER',
        authorHandle: '@testuser'
      };

      vi.mocked(prisma.socialInteraction.findUnique).mockResolvedValue(mockInteraction as any);
      vi.mocked(prisma.socialInteraction.update).mockResolvedValue(mockInteraction as any);

      await socialAggregationService.queueInteractionProcessing('test-id', 'TWITTER', 75);

      // Verify interaction was queued for processing
      expect(prisma.socialInteraction.findUnique).toHaveBeenCalledWith({
        where: { id: 'test-id' },
        include: {
          contact: true,
          parentInteraction: true
        }
      });
    });

    it('should calculate priority score correctly', async () => {
      const service = socialAggregationService as any;
      
      // Test negative sentiment priority boost
      const negativeScore = service.calculatePriorityScore(-0.8, 'complaint', '@user');
      expect(negativeScore).toBeGreaterThan(70);

      // Test support request priority boost
      const supportScore = service.calculatePriorityScore(0.2, 'support_request', '@user');
      expect(supportScore).toBeGreaterThan(70);
    });

    it('should determine response generation correctly', async () => {
      const service = socialAggregationService as any;
      
      // Should respond to negative sentiment
      expect(service.shouldGenerateResponse(-0.5, 'mention')).toBe(true);
      
      // Should respond to support requests
      expect(service.shouldGenerateResponse(0.1, 'support_request')).toBe(true);
      
      // Should respond to positive mentions
      expect(service.shouldGenerateResponse(0.8, 'mention')).toBe(true);
      
      // Should not respond to neutral content
      expect(service.shouldGenerateResponse(0.1, 'like')).toBe(false);
    });
  });

  describe('AI Response Generation', () => {
    it('should generate contextual AI responses', async () => {
      const mockInteraction = {
        id: 'test-id',
        content: 'I need help with my order',
        platform: 'LINKEDIN',
        sentimentScore: -0.3,
        intentClassification: 'support_request',
        responseGenerated: false
      };

      vi.mocked(prisma.socialInteraction.findUnique).mockResolvedValue(mockInteraction as any);
      vi.mocked(prisma.socialInteraction.update).mockResolvedValue({} as any);

      await socialAggregationService.queueResponseGeneration('test-id');

      expect(prisma.socialInteraction.update).toHaveBeenCalledWith({
        where: { id: 'test-id' },
        data: expect.objectContaining({
          responseGenerated: true,
          aiResponseText: expect.any(String)
        })
      });
    });
  });
});
``` 