# Backend Architecture Documentation

## 🎯 Overview

This document outlines the backend architecture for the Statex platform built with **Fastify**, TypeScript, and PostgreSQL, focusing on high performance (2-3x faster than Express), cost-effective AI integration with **16 specialized AI agents**, comprehensive payment processing, and EU compliance.

## 🔗 Related Documentation

- [AI Agents Ecosystem](ai-agents.md) - Backend AI agents orchestration and integration
- [AI Implementation Master Plan](ai-implementation-master-plan.md) - Overall AI strategy
- [Technology Stack](technology.md) - Complete technology decisions and cost analysis
- [Frontend Documentation](frontend.md) - Frontend integration details
- [Architecture](architecture.md) - System architecture overview
- [AI Chat System](ai-chat-system.md) - 3-tier AI integration strategy
- [Crypto Payments](crypto-payments.md) - Cryptocurrency payment implementation
- [Email System](email-system.md) - Amazon SES integration
- [Monitoring System](monitoring-system.md) - Sentry error tracking
- [Testing](testing.md) - Backend testing with Vitest
- [Development Plan](../../development-plan.md) - Complete project plan

## 🏗 Architecture Overview

### Tech Stack
- **Runtime**: Node.js 18+ LTS
- **Framework**: **Fastify** (instead of Express) with TypeScript-first approach
- **Language**: TypeScript
- **Database**: PostgreSQL 15+
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **Task Queue**: **BullMQ** (instead of Bull) for background jobs
- **File Storage**: Local (dev) + **Cloudflare R2** (production)
- **Email Service**: **Amazon SES** (90% cheaper than alternatives)
- **Process Management**: PM2
- **Web platform technology**: Progressive Web Apps (PWA)
- **Monitoring**: **Sentry** for error tracking and performance

### **Why Fastify over Express**

| Metric | Express.js | Fastify | Improvement |
|--------|-----------|---------|-------------|
| **Requests/sec** | 25,000 | 65,000 | **+160%** |
| **Memory Usage** | 100MB | 70MB | **-30%** |
| **JSON Performance** | Baseline | +15-20% | **+15-20%** |
| **TypeScript Support** | Manual setup | Built-in | **Native** |
| **Schema Validation** | External libs | Built-in | **Integrated** |
| **API Documentation** | Manual | Auto-generated | **Automatic** |

### Project Structure
```
src/
├── app.ts                   # Fastify application setup
├── server.ts                # Server startup
├── routes/                  # Fastify route handlers
│   ├── auth/                # Authentication endpoints
│   │   ├── login.ts         # POST /auth/login
│   │   ├── logout.ts        # POST /auth/logout
│   │   └── refresh.ts       # POST /auth/refresh
│   ├── ai/                  # AI processing endpoints
│   │   ├── chat.ts          # POST /api/ai/chat
│   │   ├── prototype.ts     # POST /api/ai/prototype
│   │   └── voice.ts         # POST /api/ai/voice
│   ├── payments/            # Payment processing
│   │   ├── stripe.ts        # Stripe integration
│   │   ├── paypal.ts        # PayPal integration
│   │   ├── crypto.ts        # Crypto payments
│   │   └── comgate.ts       # Comgate EU payments
│   ├── files/               # File upload/management
│   │   ├── upload.ts        # POST /api/files/upload
│   │   └── download.ts      # GET /api/files/:id
│   └── contact/             # Contact form handling
│       └── submit.ts        # POST /api/contact
├── plugins/                 # Fastify plugins
│   ├── auth.ts              # Authentication plugin
│   ├── cors.ts              # CORS configuration
│   ├── rate-limit.ts        # Rate limiting plugin
│   ├── sentry.ts            # Sentry error tracking
│   └── swagger.ts           # OpenAPI documentation
├── services/                # Business logic services
│   ├── aiService.ts         # 3-tier AI integration
│   ├── paymentService.ts    # Payment processing logic
│   ├── emailService.ts      # Amazon SES integration
│   ├── fileService.ts       # Cloudflare R2 integration
│   └── prototypeService.ts  # Prototype generation
├── schemas/                 # JSON schemas for validation
│   ├── auth.ts              # Authentication schemas
│   ├── ai.ts                # AI request/response schemas
│   ├── payment.ts           # Payment schemas
│   └── common.ts            # Common schemas
├── utils/                   # Utility functions
│   ├── logger.ts            # Fastify Pino logger
│   ├── validation.ts        # Custom validation functions
│   ├── crypto.ts            # Encryption utilities
│   └── constants.ts         # Application constants
├── types/                   # TypeScript type definitions
├── queues/                  # BullMQ job definitions
│   ├── ai-processing.ts     # AI job processing
│   ├── email-sending.ts     # Email job processing
│   └── file-processing.ts   # File processing jobs
└── tests/                   # Vitest test files
    ├── unit/                # Unit tests
    ├── integration/         # Integration tests
    └── fixtures/            # Test data
```

## ⚡ Fastify Implementation

### Application Setup
```typescript
// src/app.ts
import Fastify, { FastifyInstance } from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
      transport: process.env.NODE_ENV === 'development' ? {
        target: 'pino-pretty'
      } : undefined
    }
  }).withTypeProvider<TypeBoxTypeProvider>();

  // Register plugins
  await app.register(import('./plugins/cors'));
  await app.register(import('./plugins/rate-limit'));
  await app.register(import('./plugins/auth'));
  await app.register(import('./plugins/sentry'));
  await app.register(import('./plugins/swagger'));

  // Register routes
  await app.register(import('./routes/auth/index'), { prefix: '/auth' });
  await app.register(import('./routes/ai/index'), { prefix: '/api/ai' });
  await app.register(import('./routes/payments/index'), { prefix: '/api/payments' });
  await app.register(import('./routes/files/index'), { prefix: '/api/files' });
  await app.register(import('./routes/contact/index'), { prefix: '/api/contact' });

  return app;
}
```

### JSON Schema Validation
```typescript
// src/schemas/ai.ts
import { Type, Static } from '@sinclair/typebox';

export const AIPromptSchema = Type.Object({
  message: Type.String({ minLength: 1, maxLength: 10000 }),
  model: Type.Optional(Type.Union([
    Type.Literal('ollama'),
    Type.Literal('openai'),
    Type.Literal('azure')
  ])),
  temperature: Type.Optional(Type.Number({ minimum: 0, maximum: 2 })),
  max_tokens: Type.Optional(Type.Integer({ minimum: 1, maximum: 4000 }))
});

export const AIResponseSchema = Type.Object({
  success: Type.Boolean(),
  response: Type.String(),
  model_used: Type.String(),
  tokens_used: Type.Integer(),
  processing_time_ms: Type.Integer(),
  cost_usd: Type.Number()
});

export type AIPromptRequest = Static<typeof AIPromptSchema>;
export type AIPromptResponse = Static<typeof AIResponseSchema>;
```

### Rate Limiting Plugin
```typescript
// src/plugins/rate-limit.ts
import fp from 'fastify-plugin';
import rateLimit from '@fastify/rate-limit';

export default fp(async function (fastify) {
  await fastify.register(rateLimit, {
    max: (request) => {
      // Business model alignment: restrictive rate limiting
      if (request.url.startsWith('/api/ai/')) {
        return 2; // Max 2 AI requests per user per day
      }
      if (request.url.startsWith('/api/files/upload')) {
        return 10; // Max 10 file uploads per day
      }
      return 100; // Default limit for other endpoints
    },
    timeWindow: '24 hours',
    cache: 10000, // Cache size
    allowList: ['127.0.0.1'], // Whitelist for development
    redis: fastify.redis, // Use Redis for distributed rate limiting
    skipOnError: true,
    keyGenerator: (request) => {
      // Use user ID if authenticated, otherwise IP
      return request.user?.id || request.ip;
    },
    errorResponseBuilder: (request, context) => {
      return {
        code: 429,
        error: 'Too Many Requests',
        message: `Rate limit exceeded. Try again in ${Math.round(context.ttl / 1000)} seconds.`,
        retryAfter: context.ttl
      };
    }
  });
});
```

## 🤖 3-Tier AI Integration

### AI Service Implementation
```typescript
// src/services/aiService.ts
import OpenAI from 'openai';
import { OpenAIApi, Configuration } from 'azure-openai';
import { Ollama } from 'ollama';

export class AIService {
  private openai: OpenAI;
  private azureOpenAI: OpenAIApi;
  private ollama: Ollama;

  constructor() {
    // Development: Ollama
    this.ollama = new Ollama({ host: process.env.OLLAMA_HOST || 'http://localhost:11434' });
    
    // Production Standard: OpenAI
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Production EU Compliance: Azure OpenAI
    this.azureOpenAI = new OpenAIApi(
      new Configuration({
        apiKey: process.env.AZURE_OPENAI_API_KEY,
        basePath: process.env.AZURE_OPENAI_ENDPOINT,
        apiVersion: '2023-12-01-preview'
      })
    );
  }

  async generateResponse(prompt: string, tier: 'ollama' | 'openai' | 'azure' = 'openai'): Promise<{
    response: string;
    tokens_used: number;
    cost_usd: number;
    model_used: string;
    processing_time_ms: number;
  }> {
    const startTime = Date.now();

    try {
      switch (tier) {
        case 'ollama':
          return await this.generateWithOllama(prompt, startTime);
        case 'openai':
          return await this.generateWithOpenAI(prompt, startTime);
        case 'azure':
          return await this.generateWithAzure(prompt, startTime);
        default:
          throw new Error(`Unknown AI tier: ${tier}`);
      }
    } catch (error) {
      throw new Error(`AI generation failed: ${error.message}`);
    }
  }

  private async generateWithOllama(prompt: string, startTime: number) {
    const response = await this.ollama.generate({
      model: 'codellama',
      prompt,
      stream: false
    });

    return {
      response: response.response,
      tokens_used: response.eval_count || 0,
      cost_usd: 0, // Free for local usage
      model_used: 'ollama:codellama',
      processing_time_ms: Date.now() - startTime
    };
  }

  private async generateWithOpenAI(prompt: string, startTime: number) {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
      temperature: 0.7
    });

    const tokens = response.usage?.total_tokens || 0;
    const cost = tokens * 0.00003; // $0.03 per 1K tokens

    return {
      response: response.choices[0]?.message?.content || '',
      tokens_used: tokens,
      cost_usd: cost,
      model_used: 'openai:gpt-4',
      processing_time_ms: Date.now() - startTime
    };
  }

  private async generateWithAzure(prompt: string, startTime: number) {
    const response = await this.azureOpenAI.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
      temperature: 0.7
    });

    const tokens = response.data.usage?.total_tokens || 0;
    const cost = tokens * 0.00006; // $0.06 per 1K tokens (2x OpenAI for EU compliance)

    return {
      response: response.data.choices[0]?.message?.content || '',
      tokens_used: tokens,
      cost_usd: cost,
      model_used: 'azure:gpt-4',
      processing_time_ms: Date.now() - startTime
    };
  }
}
```

## 💳 Payment Processing Stack

### Payment Service Implementation
```typescript
// src/services/paymentService.ts
import Stripe from 'stripe';
import PayPal from '@paypal/checkout-server-sdk';
import { CoinbaseCommerce } from 'coinbase-commerce-node';

export class PaymentService {
  private stripe: Stripe;
  private paypal: PayPal.core.PayPalHttpClient;
  private coinbase: any;

  constructor() {
    // Stripe (Primary)
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16',
      typescript: true
    });

    // PayPal (Alternative)
    const environment = process.env.NODE_ENV === 'production' 
      ? new PayPal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID!, process.env.PAYPAL_CLIENT_SECRET!)
      : new PayPal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID!, process.env.PAYPAL_CLIENT_SECRET!);
    this.paypal = new PayPal.core.PayPalHttpClient(environment);

    // Coinbase Commerce (Crypto)
    CoinbaseCommerce.init(process.env.COINBASE_COMMERCE_API_KEY!);
    this.coinbase = CoinbaseCommerce.resources;
  }

  async createStripePayment(amount: number, currency: string = 'eur') {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency,
      payment_method_types: ['card', 'sepa_debit', 'ideal', 'bancontact'],
      metadata: {
        service: 'statex-prototype',
        tier: 'standard'
      }
    });

    return {
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id
    };
  }

  async createPayPalPayment(amount: number, currency: string = 'EUR') {
    const request = new PayPal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currency,
          value: amount.toString()
        },
        description: 'Statex AI Prototype Service'
      }],
      application_context: {
        brand_name: 'Statex',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
        return_url: `${process.env.FRONTEND_URL}/payment/success`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`
      }
    });

    const order = await this.paypal.execute(request);
    return {
      order_id: order.result.id,
      approval_url: order.result.links.find(link => link.rel === 'approve')?.href
    };
  }

  async createCryptoPayment(amount: number, currency: string = 'USD') {
    const charge = await this.coinbase.Charge.create({
      name: 'Statex AI Prototype Service',
      description: 'AI-powered prototype generation',
      pricing_type: 'fixed_price',
      local_price: {
        amount: amount.toString(),
        currency: currency
      },
      metadata: {
        service: 'statex-prototype'
      }
    });

    return {
      charge_id: charge.id,
      hosted_url: charge.hosted_url,
      payment_addresses: charge.addresses
    };
  }

  async createComgatePayment(amount: number, currency: string = 'CZK') {
    // Comgate implementation for Czech/EU payments
    const paymentData = {
      merchant: process.env.COMGATE_MERCHANT_ID,
      price: amount * 100, // Convert to halers for CZK
      curr: currency,
      label: 'Statex AI Prototype',
      method: 'ALL',
      email: '', // Will be filled from user data
      country: 'CZ',
      lang: 'cs'
    };

    // Implementation would include Comgate API integration
    return {
      payment_url: `https://payments.comgate.cz/v1.0/create`,
      transaction_id: `comgate_${Date.now()}`
    };
  }
}
```

## 📧 Email Service (Amazon SES)

### Email Service Implementation
```typescript
// src/services/emailService.ts
import { SES } from '@aws-sdk/client-ses';
import { BullMQ } from 'bullmq';

export class EmailService {
  private ses: SES;
  private emailQueue: BullMQ.Queue;

  constructor() {
    // Amazon SES (90% cheaper than alternatives)
    this.ses = new SES({
      region: process.env.AWS_REGION || 'eu-west-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
      }
    });

    // BullMQ for email queue processing
    this.emailQueue = new BullMQ.Queue('email', {
      connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '6379')
      }
    });
  }

  async sendEmail(to: string, subject: string, htmlBody: string, textBody?: string) {
    // Add to queue for background processing
    await this.emailQueue.add('send-email', {
      to,
      subject,
      htmlBody,
      textBody: textBody || this.htmlToText(htmlBody),
      timestamp: new Date().toISOString()
    });
  }

  async processEmailJob(job: any) {
    const { to, subject, htmlBody, textBody } = job.data;

    try {
      const result = await this.ses.sendEmail({
        Source: process.env.FROM_EMAIL!,
        Destination: {
          ToAddresses: [to]
        },
        Message: {
          Subject: {
            Data: subject,
            Charset: 'UTF-8'
          },
          Body: {
            Html: {
              Data: htmlBody,
              Charset: 'UTF-8'
            },
            Text: {
              Data: textBody,
              Charset: 'UTF-8'
            }
          }
        }
      });

      return {
        success: true,
        messageId: result.MessageId,
        cost: 0.0001 // ~$0.10 per 1000 emails
      };
    } catch (error) {
      throw new Error(`Email sending failed: ${error.message}`);
    }
  }

  private htmlToText(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }
}
```

## 📁 File Storage (Cloudflare R2)

### File Service Implementation
```typescript
// src/services/fileService.ts
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

export class FileService {
  private r2Client: S3Client;
  private bucketName: string;

  constructor() {
    // Cloudflare R2 (66% cheaper than AWS S3, free egress)
    this.r2Client = new S3Client({
      region: 'auto',
      endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!
      }
    });
    this.bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME!;
  }

  async uploadFile(buffer: Buffer, originalName: string, mimeType: string): Promise<{
    fileId: string;
    url: string;
    size: number;
  }> {
    const fileId = `${uuidv4()}-${originalName}`;
    
    const uploadCommand = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileId,
      Body: buffer,
      ContentType: mimeType,
      Metadata: {
        originalName,
        uploadedAt: new Date().toISOString()
      }
    });

    await this.r2Client.send(uploadCommand);

    const url = `https://${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${fileId}`;

    // Schedule file deletion after 24 hours (business requirement)
    setTimeout(async () => {
      await this.deleteFile(fileId);
    }, 24 * 60 * 60 * 1000);

    return {
      fileId,
      url,
      size: buffer.length
    };
  }

  async getFile(fileId: string): Promise<Buffer> {
    const getCommand = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileId
    });

    const response = await this.r2Client.send(getCommand);
    const chunks: Uint8Array[] = [];
    
    for await (const chunk of response.Body as any) {
      chunks.push(chunk);
    }

    return Buffer.concat(chunks);
  }

  async deleteFile(fileId: string): Promise<void> {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: fileId
    });

    await this.r2Client.send(deleteCommand);
  }

  async generatePresignedUrl(fileId: string, expiresIn: number = 3600): Promise<string> {
    const getCommand = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileId
    });

    return await getSignedUrl(this.r2Client, getCommand, { expiresIn });
  }
}
```

## 🔄 BullMQ Task Queue Implementation

### Queue Setup
```typescript
// src/queues/ai-processing.ts
import { Worker, Queue } from 'bullmq';
import { AIService } from '../services/aiService';
import { EmailService } from '../services/emailService';

const aiQueue = new Queue('ai-processing', {
  connection: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379')
  }
});

const aiWorker = new Worker('ai-processing', async (job) => {
  const { prompt, userId, tier, email } = job.data;
  const aiService = new AIService();
  const emailService = new EmailService();

  try {
    // Process AI request
    const result = await aiService.generateResponse(prompt, tier);
    
    // Store result in database
    await prisma.aiResponse.create({
      data: {
        userId,
        prompt,
        response: result.response,
        tokensUsed: result.tokens_used,
        costUsd: result.cost_usd,
        modelUsed: result.model_used,
        processingTimeMs: result.processing_time_ms
      }
    });

    // Send notification email
    await emailService.sendEmail(
      email,
      'Your AI Prototype is Ready!',
      `<h1>Your prototype has been generated successfully!</h1>
       <p>Processing time: ${result.processing_time_ms}ms</p>
       <p>Model used: ${result.model_used}</p>
       <p>Cost: $${result.cost_usd.toFixed(4)}</p>`
    );

    return { success: true, result };
  } catch (error) {
    // Handle failures and notify user
    await emailService.sendEmail(
      email,
      'AI Prototype Generation Failed',
      `<h1>Sorry, there was an error generating your prototype.</h1>
       <p>Error: ${error.message}</p>
       <p>Please try again or contact support.</p>`
    );
    
    throw error;
  }
}, {
  connection: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379')
  },
  concurrency: parseInt(process.env.AI_WORKER_CONCURRENCY || '2')
});

export { aiQueue, aiWorker };
```

## 🗄 Database Design (Prisma + PostgreSQL)

### Enhanced Database Schema
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id          String   @id @default(cuid())
  email       String   @unique
  name        String?
  phone       String?
  language    String   @default("en")
  tier        UserTier @default(STANDARD)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  sessions    Session[]
  prototypes  Prototype[]
  contacts    Contact[]
  payments    Payment[]
  aiResponses AIResponse[]
  
  @@map("users")
}

model AIResponse {
  id               String   @id @default(cuid())
  userId           String
  prompt           String
  response         String
  tier             AITier
  tokensUsed       Int
  costUsd          Decimal  @db.Decimal(10, 6)
  modelUsed        String
  processingTimeMs Int
  createdAt        DateTime @default(now())
  
  // Relations
  user             User     @relation(fields: [userId], references: [id])
  
  @@map("ai_responses")
}

model Payment {
  id              String        @id @default(cuid())
  userId          String
  amount          Decimal       @db.Decimal(10, 2)
  currency        String        @default("EUR")
  gateway         PaymentGateway
  gatewayId       String        // External payment ID
  status          PaymentStatus @default(PENDING)
  tier            ServiceTier?  // Unlocked service tier
  metadata        Json?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  
  // Relations
  user            User          @relation(fields: [userId], references: [id])
  
  @@map("payments")
}

model RateLimit {
  id          String   @id @default(cuid())
  identifier  String   // User ID or IP address
  endpoint    String   // API endpoint
  requests    Int      @default(1)
  windowStart DateTime @default(now())
  
  @@unique([identifier, endpoint])
  @@map("rate_limits")
}

// Enums
enum UserTier {
  STANDARD
  EU_COMPLIANCE
  PREMIUM
}

enum AITier {
  OLLAMA
  OPENAI
  AZURE
}

enum PaymentGateway {
  STRIPE
  PAYPAL
  CRYPTO_COINBASE
  CRYPTO_BTCPAY
  COMGATE
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}

enum ServiceTier {
  STANDARD
  EU_COMPLIANCE
  PREMIUM
}
```

## 📊 Monitoring & Error Tracking (Sentry)

### Sentry Integration
```typescript
// src/plugins/sentry.ts
import fp from 'fastify-plugin';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';

export default fp(async function (fastify) {
  // Initialize Sentry
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Express({ fastify }),
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

  // Add Sentry error handler
  fastify.setErrorHandler(async (error, request, reply) => {
    // Log to Sentry
    Sentry.captureException(error, {
      tags: {
        endpoint: request.url,
        method: request.method,
        userId: request.user?.id
      },
      extra: {
        body: request.body,
        query: request.query,
        params: request.params
      }
    });

    // Send appropriate error response
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

  // Performance monitoring
  fastify.addHook('onRequest', async (request) => {
    request.startTime = Date.now();
  });

  fastify.addHook('onResponse', async (request, reply) => {
    const duration = Date.now() - request.startTime;
    
    // Track performance metrics
    Sentry.addBreadcrumb({
      message: `${request.method} ${request.url}`,
      category: 'http',
      data: {
        statusCode: reply.statusCode,
        duration,
        userId: request.user?.id
      }
    });

    // Alert on slow requests
    if (duration > 5000) {
      Sentry.captureMessage(`Slow request: ${request.method} ${request.url}`, 'warning');
    }
  });
});
```

## 🧪 Testing Implementation (Vitest)

### API Testing Example
```typescript
// tests/integration/ai-endpoints.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { buildApp } from '../../src/app';
import { FastifyInstance } from 'fastify';

describe('AI Endpoints', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should generate AI response with OpenAI', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/ai/chat',
      headers: {
        'authorization': 'Bearer test-token'
      },
      payload: {
        message: 'Create a simple React component',
        model: 'openai'
      }
    });

    expect(response.statusCode).toBe(200);
    const data = JSON.parse(response.payload);
    expect(data.success).toBe(true);
    expect(data.response).toBeDefined();
    expect(data.model_used).toBe('openai:gpt-4');
    expect(data.tokens_used).toBeGreaterThan(0);
    expect(data.cost_usd).toBeGreaterThan(0);
  });

  it('should respect rate limiting', async () => {
    // Make multiple requests to trigger rate limit
    const requests = Array(5).fill(null).map(() =>
      app.inject({
        method: 'POST',
        url: '/api/ai/chat',
        headers: { 'authorization': 'Bearer test-token' },
        payload: { message: 'test', model: 'openai' }
      })
    );

    const responses = await Promise.all(requests);
    const rateLimitedResponses = responses.filter(r => r.statusCode === 429);
    expect(rateLimitedResponses.length).toBeGreaterThan(0);
  });
});
```

## 💰 Cost Analysis Summary

### Infrastructure Cost Comparison (Monthly)

| Service | Traditional Stack | Our Stack | Savings |
|---------|------------------|-----------|---------|
| **File Storage** | AWS S3 ($45) | Cloudflare R2 ($15) | **$30 (66%)** |
| **Email Service** | Mailgun ($80) | Amazon SES ($10) | **$70 (87%)** |
| **CDN** | AWS CloudFront ($85) | Cloudflare ($20) | **$65 (76%)** |
| **Monitoring** | DataDog ($100) | Sentry ($25) | **$75 (75%)** |
| **AI Services** | OpenAI only ($200) | 3-tier ($150) | **$50 (25%)** |
| **Total** | **$510** | **$220** | **$290 (57%)** |

### Performance Improvements

| Metric | Express Stack | Fastify Stack | Improvement |
|--------|--------------|---------------|-------------|
| **API Throughput** | 25k req/sec | 65k req/sec | **+160%** |
| **Memory Usage** | 100MB | 70MB | **-30%** |
| **Test Speed** | Jest (slow) | Vitest (fast) | **+500%** |
| **Build Time** | 60s | 20s | **-66%** |

This backend architecture prioritizes **high performance, cost optimization, and comprehensive functionality** while maintaining **EU compliance options** and **scalability** for the Statex platform. 