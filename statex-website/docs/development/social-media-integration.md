# Social Media Integration Documentation

## 🎯 Overview

The Statex social media integration system automates content distribution, manages multi-platform engagement, and provides unified analytics across LinkedIn, Facebook, Twitter, Instagram, Telegram, WhatsApp, and other platforms using our **Fastify** backend with **BullMQ** task processing and **PostgreSQL** database.

## 🔗 Related Documentation

- [Technology Stack](technology.md) - Complete technology decisions and cost analysis
- [Architecture](architecture.md) - System architecture overview
- [Backend Documentation](backend.md) - Fastify backend implementation
- [Frontend Documentation](frontend.md) - Next.js 14+ frontend integration
- [Blog System](blog-system.md) - Content creation and management
- [CRM System](crm-system.md) - Customer interaction tracking
- [Notification System](notification-system.md) - Communication delivery
- [Scheduled Tasks](scheduled-tasks.md) - BullMQ job processing
- [Testing](testing.md) - Vitest testing framework
- [Monitoring System](monitoring-system.md) - Sentry error tracking
- [Development Plan](../../development-plan.md) - Complete project plan

## 🏗 System Architecture

### **Fastify Backend Integration**
```typescript
// Social media service with Fastify integration
const SOCIAL_MEDIA_SERVICE = {
  backend_framework: 'Fastify (65k req/sec vs Express 25k req/sec)',
  database: 'PostgreSQL 15+ with Prisma ORM',
  task_queue: 'BullMQ for background job processing',
  testing: 'Vitest testing framework',
  monitoring: 'Sentry error tracking',
  authentication: 'NextAuth.js with OAuth providers'
};
```

### Multi-Platform Integration
```typescript
const SOCIAL_PLATFORMS = {
  linkedin: {
    api: 'LinkedIn API v2',
    features: ['posts', 'articles', 'company_updates', 'messaging'],
    content_types: ['text', 'images', 'videos', 'documents'],
    automation: ['scheduled_posts', 'connection_requests', 'message_responses'],
    oauth_integration: 'NextAuth.js LinkedIn provider'
  },
  facebook: {
    api: 'Facebook Graph API',
    features: ['page_posts', 'stories', 'events', 'messenger'],
    content_types: ['text', 'images', 'videos', 'links'],
    automation: ['post_scheduling', 'comment_responses', 'message_handling'],
    oauth_integration: 'NextAuth.js Facebook provider'
  },
  twitter: {
    api: 'Twitter API v2',
    features: ['tweets', 'threads', 'spaces', 'dm'],
    content_types: ['text', 'images', 'videos', 'polls'],
    automation: ['tweet_scheduling', 'mention_responses', 'dm_automation'],
    oauth_integration: 'NextAuth.js Twitter provider'
  },
  instagram: {
    api: 'Instagram Basic Display API',
    features: ['posts', 'stories', 'reels', 'igtv'],
    content_types: ['images', 'videos', 'carousels'],
    automation: ['post_scheduling', 'comment_responses', 'hashtag_optimization'],
    oauth_integration: 'NextAuth.js Instagram provider'
  }
};
```

### **PostgreSQL Database Schema with Prisma**
```sql
-- Social Media Integration Tables
CREATE TABLE social_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform social_platform_enum NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    account_id VARCHAR(255) NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    oauth_data JSONB, -- NextAuth.js account data
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE social_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES social_accounts(id),
    platform social_platform_enum NOT NULL,
    external_id VARCHAR(255),
    content TEXT NOT NULL,
    media_urls JSONB,
    hashtags JSONB,
    scheduled_at TIMESTAMP,
    published_at TIMESTAMP,
    status post_status_enum DEFAULT 'DRAFT',
    engagement_metrics JSONB,
    bullmq_job_id VARCHAR(255), -- BullMQ job tracking
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE social_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES social_posts(id),
    platform social_platform_enum NOT NULL,
    interaction_type interaction_type_enum NOT NULL,
    user_handle VARCHAR(255),
    content TEXT,
    external_id VARCHAR(255),
    responded_at TIMESTAMP,
    ai_response TEXT,
    ai_tier ai_tier_enum DEFAULT 'openai', -- 3-tier AI strategy
    processed_by_ai BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Enums aligned with our technology stack
CREATE TYPE social_platform_enum AS ENUM ('LINKEDIN', 'FACEBOOK', 'TWITTER', 'INSTAGRAM', 'TELEGRAM', 'WHATSAPP');
CREATE TYPE post_status_enum AS ENUM ('DRAFT', 'SCHEDULED', 'PUBLISHED', 'FAILED', 'ARCHIVED');
CREATE TYPE interaction_type_enum AS ENUM ('COMMENT', 'LIKE', 'SHARE', 'MENTION', 'MESSAGE', 'REACTION');
CREATE TYPE ai_tier_enum AS ENUM ('ollama', 'openai', 'azure');
```

## 🤖 **Fastify API Implementation**

### Social Media Routes
```typescript
// routes/social/index.ts - Fastify route implementation
import { FastifyPluginAsync } from 'fastify';
import { socialMediaService } from '../../services/socialMediaService';
import { authPlugin } from '../../plugins/auth';

const socialMediaRoutes: FastifyPluginAsync = async (fastify) => {
  await fastify.register(authPlugin);

  // Schedule social media post
  fastify.post('/posts/schedule', {
    schema: {
      body: {
        type: 'object',
        required: ['content', 'platforms', 'scheduledAt'],
        properties: {
          content: { type: 'string', maxLength: 3000 },
          platforms: { type: 'array', items: { type: 'string' } },
          scheduledAt: { type: 'string', format: 'date-time' },
          media: { type: 'array', items: { type: 'string' } }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            jobIds: { type: 'array', items: { type: 'string' } },
            scheduledPosts: { type: 'array' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { content, platforms, scheduledAt, media } = request.body;
    const userId = request.user.id;

    try {
      const result = await socialMediaService.schedulePost({
        content,
        platforms,
        scheduledAt,
        media,
        userId
      });

      return {
        success: true,
        jobIds: result.jobIds,
        scheduledPosts: result.posts
      };
    } catch (error) {
      fastify.log.error('Social media post scheduling failed:', error);
      reply.status(500).send({
        success: false,
        error: 'Failed to schedule social media post'
      });
    }
  });

  // Get social media analytics
  fastify.get('/analytics', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          platform: { type: 'string' },
          startDate: { type: 'string', format: 'date' },
          endDate: { type: 'string', format: 'date' }
        }
      }
    }
  }, async (request, reply) => {
    const { platform, startDate, endDate } = request.query;
    const userId = request.user.id;

    const analytics = await socialMediaService.getAnalytics({
      userId,
      platform,
      startDate,
      endDate
    });

    return { success: true, data: analytics };
  });
};

export default socialMediaRoutes;
```

### **BullMQ Job Processing**
```typescript
// queues/social-media-jobs.ts - BullMQ integration
import { Queue, Worker } from 'bullmq';
import { socialMediaService } from '../services/socialMediaService';

const socialMediaQueue = new Queue('social-media', {
  connection: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379')
  }
});

const socialMediaWorker = new Worker('social-media', async (job) => {
  const { type, data } = job.data;

  switch (type) {
    case 'publish-post':
      return await socialMediaService.publishPost(data);
    
    case 'process-interactions':
      return await socialMediaService.processInteractions(data);
    
    case 'sync-metrics':
      return await socialMediaService.syncEngagementMetrics(data);
    
    case 'auto-respond':
      return await socialMediaService.generateAutoResponse(data);
    
    default:
      throw new Error(`Unknown job type: ${type}`);
  }
}, {
  connection: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379')
  },
  concurrency: parseInt(process.env.SOCIAL_WORKER_CONCURRENCY || '3')
});

export { socialMediaQueue, socialMediaWorker };
```

## 🔄 **Next.js 14+ Frontend Integration**

### Social Media Dashboard Component
```typescript
// components/social/SocialMediaDashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/Button';

interface SocialPost {
  id: string;
  content: string;
  platforms: string[];
  scheduledAt: string;
  status: string;
  engagementMetrics: any;
}

export function SocialMediaDashboard() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      loadSocialPosts();
    }
  }, [session]);

  const loadSocialPosts = async () => {
    try {
      const response = await apiClient.get('/api/social/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Failed to load social posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const schedulePost = async (postData: any) => {
    try {
      await apiClient.post('/api/social/posts/schedule', postData);
      await loadSocialPosts(); // Refresh the list
    } catch (error) {
      console.error('Failed to schedule post:', error);
    }
  };

  if (loading) {
    return <div className="animate-pulse">Loading social media dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Social Media Management</h2>
        <Button onClick={() => schedulePost}>Schedule New Post</Button>
      </div>

      <div className="grid gap-4">
        {posts.map((post) => (
          <div key={post.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-2">
                  Platforms: {post.platforms.join(', ')}
                </p>
                <p className="mb-2">{post.content}</p>
                <p className="text-sm text-gray-500">
                  Scheduled: {new Date(post.scheduledAt).toLocaleString()}
                </p>
              </div>
              <span className={`px-2 py-1 rounded text-sm ${
                post.status === 'published' ? 'bg-green-100 text-green-800' :
                post.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {post.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 🧪 **Vitest Testing Implementation**

### Social Media Service Tests
```typescript
// __tests__/services/socialMediaService.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { socialMediaService } from '../../src/services/socialMediaService';
import { prisma } from '../../src/lib/prisma';

vi.mock('../../src/lib/prisma', () => ({
  prisma: {
    socialPosts: {
      create: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn()
    },
    socialAccounts: {
      findMany: vi.fn()
    }
  }
}));

describe('Social Media Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should schedule a social media post', async () => {
    const mockPost = {
      id: 'test-id',
      content: 'Test post content',
      platforms: ['linkedin', 'twitter'],
      scheduledAt: new Date().toISOString()
    };

    vi.mocked(prisma.socialPosts.create).mockResolvedValueOnce(mockPost);

    const result = await socialMediaService.schedulePost({
      content: 'Test post content',
      platforms: ['linkedin', 'twitter'],
      scheduledAt: new Date().toISOString(),
      userId: 'user-id'
    });

    expect(result).toBeDefined();
    expect(prisma.socialPosts.create).toHaveBeenCalledTimes(1);
  });

  it('should process social media interactions', async () => {
    const mockInteractions = [
      { id: '1', type: 'comment', content: 'Great post!' },
      { id: '2', type: 'like', content: null }
    ];

    const result = await socialMediaService.processInteractions({
      postId: 'post-id',
      interactions: mockInteractions
    });

    expect(result.processed).toBe(2);
  });
});
```

## 📊 **Enhanced Analytics and Monitoring**

### **Sentry Integration**
```typescript
// Sentry monitoring for social media operations
import * as Sentry from '@sentry/node';

const SOCIAL_MEDIA_MONITORING = {
  post_publishing: {
    success_rate: 'Track successful vs failed post publications',
    platform_performance: 'Monitor performance by platform',
    engagement_tracking: 'Real-time engagement metrics'
  },
  
  ai_responses: {
    response_quality: 'Monitor AI response quality and sentiment',
    processing_time: 'Track AI response generation time',
    cost_tracking: '3-tier AI cost optimization monitoring'
  },
  
  error_tracking: {
    api_failures: 'Platform API failures and rate limiting',
    authentication_issues: 'OAuth token expiration and refresh',
    job_processing: 'BullMQ job failures and retries'
  }
};
```

---

This enhanced social media integration system leverages our **Fastify** backend for high-performance API processing, **BullMQ** for reliable job processing, **PostgreSQL + Prisma** for robust data management, and **Next.js 14+** for a modern frontend experience, all tested with **Vitest** for superior performance. 