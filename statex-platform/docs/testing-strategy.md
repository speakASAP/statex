# Testing Strategy

## Overview

The Statex platform uses Vitest as the primary testing framework for all services, providing fast, reliable, and comprehensive testing across the entire microservices architecture.

## Testing Philosophy

### Test Pyramid
- **Unit Tests (70%)**: Fast, isolated tests for individual functions and components
- **Integration Tests (20%)**: Tests for service interactions and API endpoints
- **End-to-End Tests (10%)**: Full workflow tests across multiple services

### Testing Principles
- **Test-Driven Development (TDD)**: Write tests before implementation
- **Behavior-Driven Development (BDD)**: Focus on user behavior and business requirements
- **Continuous Testing**: Tests run on every commit and deployment
- **Fast Feedback**: Unit tests complete in under 5 seconds
- **Reliable**: Tests are deterministic and don't flake
- **Maintainable**: Tests are easy to read, write, and modify

## Vitest Configuration

### Global Vitest Configuration
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    },
    testTimeout: 10000,
    hookTimeout: 10000,
    teardownTimeout: 10000
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@tests': resolve(__dirname, './tests')
    }
  }
})
```

### Test Setup
```typescript
// tests/setup.ts
import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest'
import { setupTestDatabase } from './helpers/database'
import { setupTestBroker } from './helpers/broker'
import { setupTestStorage } from './helpers/storage'

beforeAll(async () => {
  await setupTestDatabase()
  await setupTestBroker()
  await setupTestStorage()
})

afterAll(async () => {
  await cleanupTestDatabase()
  await cleanupTestBroker()
  await cleanupTestStorage()
})

beforeEach(async () => {
  // Reset test data before each test
  await resetTestData()
})

afterEach(async () => {
  // Cleanup after each test
  await cleanupTestData()
})
```

## Testing Categories

### 1. Unit Tests

#### Service Logic Testing
```typescript
// tests/unit/services/submission-service.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { SubmissionService } from '@/services/submission-service'
import { FileStorageService } from '@/services/file-storage'
import { EventPublisher } from '@/services/event-publisher'

describe('SubmissionService', () => {
  let submissionService: SubmissionService
  let mockFileStorage: FileStorageService
  let mockEventPublisher: EventPublisher

  beforeEach(() => {
    mockFileStorage = {
      storeFiles: vi.fn(),
      getFileUrl: vi.fn()
    } as any

    mockEventPublisher = {
      publish: vi.fn()
    } as any

    submissionService = new SubmissionService(mockFileStorage, mockEventPublisher)
  })

  describe('createSubmission', () => {
    it('should create submission and store files', async () => {
      const submissionData = {
        userId: 'user-123',
        requestType: 'text_analysis',
        text: 'Test submission',
        files: [
          { filename: 'test.txt', content: Buffer.from('test content') }
        ]
      }

      const result = await submissionService.createSubmission(submissionData)

      expect(result).toMatchObject({
        id: expect.any(String),
        userId: 'user-123',
        status: 'pending'
      })

      expect(mockFileStorage.storeFiles).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            filename: 'test.txt'
          })
        ])
      )

      expect(mockEventPublisher.publish).toHaveBeenCalledWith(
        'submission.created',
        expect.objectContaining({
          submissionId: result.id
        })
      )
    })

    it('should handle file upload errors gracefully', async () => {
      mockFileStorage.storeFiles.mockRejectedValue(new Error('Storage error'))

      const submissionData = {
        userId: 'user-123',
        requestType: 'text_analysis',
        text: 'Test submission',
        files: []
      }

      await expect(submissionService.createSubmission(submissionData))
        .rejects.toThrow('Storage error')
    })
  })

  describe('getUserSubmissions', () => {
    it('should return user submissions with pagination', async () => {
      const userId = 'user-123'
      const page = 1
      const limit = 10

      const result = await submissionService.getUserSubmissions(userId, page, limit)

      expect(result).toMatchObject({
        submissions: expect.any(Array),
        pagination: {
          page: 1,
          limit: 10,
          total: expect.any(Number),
          pages: expect.any(Number)
        }
      })
    })
  })
})
```

#### Data Model Testing
```typescript
// tests/unit/models/submission.test.ts
import { describe, it, expect } from 'vitest'
import { Submission, SubmissionStatus } from '@/models/submission'
import { ValidationError } from '@/errors/validation-error'

describe('Submission Model', () => {
  describe('validation', () => {
    it('should create valid submission', () => {
      const submission = new Submission({
        id: 'sub-123',
        userId: 'user-123',
        requestType: 'text_analysis',
        status: SubmissionStatus.PENDING,
        createdAt: new Date()
      })

      expect(submission.id).toBe('sub-123')
      expect(submission.userId).toBe('user-123')
      expect(submission.requestType).toBe('text_analysis')
      expect(submission.status).toBe(SubmissionStatus.PENDING)
    })

    it('should throw validation error for invalid data', () => {
      expect(() => {
        new Submission({
          id: '',
          userId: 'user-123',
          requestType: 'invalid_type',
          status: 'invalid_status' as any,
          createdAt: new Date()
        })
      }).toThrow(ValidationError)
    })
  })

  describe('status transitions', () => {
    it('should allow valid status transitions', () => {
      const submission = new Submission({
        id: 'sub-123',
        userId: 'user-123',
        requestType: 'text_analysis',
        status: SubmissionStatus.PENDING,
        createdAt: new Date()
      })

      submission.updateStatus(SubmissionStatus.PROCESSING)
      expect(submission.status).toBe(SubmissionStatus.PROCESSING)

      submission.updateStatus(SubmissionStatus.COMPLETED)
      expect(submission.status).toBe(SubmissionStatus.COMPLETED)
    })

    it('should reject invalid status transitions', () => {
      const submission = new Submission({
        id: 'sub-123',
        userId: 'user-123',
        requestType: 'text_analysis',
        status: SubmissionStatus.COMPLETED,
        createdAt: new Date()
      })

      expect(() => {
        submission.updateStatus(SubmissionStatus.PENDING)
      }).toThrow('Invalid status transition')
    })
  })
})
```

### 2. Integration Tests

#### API Endpoint Testing
```typescript
// tests/integration/api/submission-api.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { FastAPI } from 'fastapi'
import { TestClient } from 'fastapi/testclient'
import { app } from '@/main'
import { setupTestDatabase, cleanupTestDatabase } from '@tests/helpers/database'

describe('Submission API', () => {
  let client: TestClient<FastAPI>

  beforeAll(async () => {
    await setupTestDatabase()
    client = new TestClient(app)
  })

  afterAll(async () => {
    await cleanupTestDatabase()
  })

  describe('POST /api/submissions', () => {
    it('should create submission successfully', async () => {
      const submissionData = {
        requestType: 'text_analysis',
        text: 'Test submission text',
        files: []
      }

      const response = await client.post('/api/submissions', {
        json: submissionData,
        headers: {
          'Authorization': 'Bearer test-token'
        }
      })

      expect(response.status).toBe(201)
      expect(response.json()).toMatchObject({
        id: expect.any(String),
        status: 'pending',
        requestType: 'text_analysis'
      })
    })

    it('should return 401 for unauthenticated requests', async () => {
      const response = await client.post('/api/submissions', {
        json: { requestType: 'text_analysis' }
      })

      expect(response.status).toBe(401)
    })

    it('should return 400 for invalid data', async () => {
      const response = await client.post('/api/submissions', {
        json: { requestType: 'invalid_type' },
        headers: {
          'Authorization': 'Bearer test-token'
        }
      })

      expect(response.status).toBe(400)
    })
  })

  describe('GET /api/submissions', () => {
    it('should return user submissions with pagination', async () => {
      const response = await client.get('/api/submissions?page=1&limit=10', {
        headers: {
          'Authorization': 'Bearer test-token'
        }
      })

      expect(response.status).toBe(200)
      expect(response.json()).toMatchObject({
        submissions: expect.any(Array),
        pagination: {
          page: 1,
          limit: 10,
          total: expect.any(Number),
          pages: expect.any(Number)
        }
      })
    })
  })
})
```

#### Service Integration Testing
```typescript
// tests/integration/services/ai-orchestrator.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { AIOrchestrator } from '@/services/ai-orchestrator'
import { SubmissionService } from '@/services/submission-service'
import { NotificationService } from '@/services/notification-service'
import { setupTestBroker, cleanupTestBroker } from '@tests/helpers/broker'

describe('AI Orchestrator Integration', () => {
  let orchestrator: AIOrchestrator
  let submissionService: SubmissionService
  let notificationService: NotificationService

  beforeAll(async () => {
    await setupTestBroker()
    orchestrator = new AIOrchestrator()
    submissionService = new SubmissionService()
    notificationService = new NotificationService()
  })

  afterAll(async () => {
    await cleanupTestBroker()
  })

  describe('AI Processing Workflow', () => {
    it('should process submission through complete AI pipeline', async () => {
      // Create test submission
      const submission = await submissionService.createSubmission({
        userId: 'user-123',
        requestType: 'text_analysis',
        text: 'Test text for analysis',
        files: []
      })

      // Start AI processing
      const job = await orchestrator.createJob({
        submissionId: submission.id,
        workflowType: 'text_analysis'
      })

      expect(job.status).toBe('pending')

      // Simulate AI processing
      await orchestrator.processJob(job.id)

      // Verify job completion
      const completedJob = await orchestrator.getJob(job.id)
      expect(completedJob.status).toBe('completed')

      // Verify notification was sent
      const notifications = await notificationService.getNotifications({
        userId: 'user-123',
        submissionId: submission.id
      })
      expect(notifications).toHaveLength(1)
      expect(notifications[0].type).toBe('email')
    })
  })
})
```

### 3. End-to-End Tests

#### Complete Workflow Testing
```typescript
// tests/e2e/submission-workflow.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { TestClient } from 'fastapi/testclient'
import { app } from '@/main'
import { setupTestEnvironment, cleanupTestEnvironment } from '@tests/helpers/environment'

describe('Submission Workflow E2E', () => {
  let client: TestClient<FastAPI>

  beforeAll(async () => {
    await setupTestEnvironment()
    client = new TestClient(app)
  })

  afterAll(async () => {
    await cleanupTestEnvironment()
  })

  it('should complete full submission workflow', async () => {
    // 1. User submits form
    const submissionResponse = await client.post('/api/submissions', {
      json: {
        requestType: 'text_analysis',
        text: 'I need help with my business strategy',
        files: []
      },
      headers: {
        'Authorization': 'Bearer test-token'
      }
    })

    expect(submissionResponse.status).toBe(201)
    const submission = submissionResponse.json()

    // 2. AI processing starts
    await new Promise(resolve => setTimeout(resolve, 1000)) // Wait for async processing

    // 3. Check submission status
    const statusResponse = await client.get(`/api/submissions/${submission.id}`, {
      headers: {
        'Authorization': 'Bearer test-token'
      }
    })

    expect(statusResponse.status).toBe(200)
    expect(statusResponse.json().status).toBe('processing')

    // 4. Wait for completion
    let attempts = 0
    let completed = false
    while (attempts < 10 && !completed) {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const statusCheck = await client.get(`/api/submissions/${submission.id}`, {
        headers: {
          'Authorization': 'Bearer test-token'
        }
      })

      const status = statusCheck.json().status
      if (status === 'completed') {
        completed = true
      }
      attempts++
    }

    expect(completed).toBe(true)

    // 5. Verify results
    const finalResponse = await client.get(`/api/submissions/${submission.id}`, {
      headers: {
        'Authorization': 'Bearer test-token'
      }
    })

    const finalSubmission = finalResponse.json()
    expect(finalSubmission.status).toBe('completed')
    expect(finalSubmission.results).toBeDefined()
    expect(finalSubmission.results.analysis).toBeDefined()
  })
})
```

## Test Utilities and Helpers

### Database Testing Helpers
```typescript
// tests/helpers/database.ts
import { Pool } from 'pg'
import { config } from '@/config'

let testPool: Pool

export async function setupTestDatabase(): Promise<void> {
  testPool = new Pool({
    connectionString: config.TEST_DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  })

  // Create test schema
  await testPool.query(`
    CREATE SCHEMA IF NOT EXISTS test_schema;
    SET search_path TO test_schema;
  `)

  // Run migrations
  await runMigrations(testPool)
}

export async function cleanupTestDatabase(): Promise<void> {
  if (testPool) {
    await testPool.query('DROP SCHEMA IF EXISTS test_schema CASCADE')
    await testPool.end()
  }
}

export async function resetTestData(): Promise<void> {
  if (testPool) {
    await testPool.query('TRUNCATE TABLE submissions, users, notifications CASCADE')
  }
}

export function getTestPool(): Pool {
  return testPool
}
```

### Message Broker Testing Helpers
```typescript
// tests/helpers/broker.ts
import { Connection, Channel } from 'amqplib'
import { connect } from 'amqplib'

let testConnection: Connection
let testChannel: Channel

export async function setupTestBroker(): Promise<void> {
  testConnection = await connect(process.env.TEST_RABBITMQ_URL || 'amqp://localhost:5672')
  testChannel = await testConnection.createChannel()
  
  // Create test exchanges and queues
  await testChannel.assertExchange('test_events', 'topic', { durable: true })
  await testChannel.assertQueue('test_submissions', { durable: true })
  await testChannel.bindQueue('test_submissions', 'test_events', 'submission.*')
}

export async function cleanupTestBroker(): Promise<void> {
  if (testChannel) {
    await testChannel.close()
  }
  if (testConnection) {
    await testConnection.close()
  }
}

export function getTestChannel(): Channel {
  return testChannel
}
```

### Mock Services
```typescript
// tests/mocks/services.ts
import { vi } from 'vitest'

export const mockFileStorageService = {
  storeFiles: vi.fn(),
  getFileUrl: vi.fn(),
  deleteFiles: vi.fn(),
  listFiles: vi.fn()
}

export const mockEventPublisher = {
  publish: vi.fn(),
  subscribe: vi.fn(),
  unsubscribe: vi.fn()
}

export const mockNotificationService = {
  sendEmail: vi.fn(),
  sendSMS: vi.fn(),
  sendWhatsApp: vi.fn(),
  sendTelegram: vi.fn()
}

export const mockAIService = {
  analyzeText: vi.fn(),
  processAudio: vi.fn(),
  analyzeImage: vi.fn(),
  generateResponse: vi.fn()
}
```

## Test Scripts

### Package.json Scripts
```json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest run --reporter=verbose tests/unit",
    "test:integration": "vitest run --reporter=verbose tests/integration",
    "test:e2e": "vitest run --reporter=verbose tests/e2e",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "test:ci": "vitest run --coverage --reporter=junit --outputFile=test-results.xml"
  }
}
```

### GitHub Actions Test Workflow
```yaml
# .github/workflows/test.yml
name: Tests
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20]
        service: [user-portal, submission-service, ai-orchestrator, ai-workers, notification-service, content-service, logging-service]

    steps:
      - uses: actions/checkout@v4
      
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: |
          cd services/${{ matrix.service }}
          npm ci
      
      - name: Run unit tests
        run: |
          cd services/${{ matrix.service }}
          npm run test:unit
      
      - name: Run integration tests
        run: |
          cd services/${{ matrix.service }}
          npm run test:integration
      
      - name: Generate coverage report
        run: |
          cd services/${{ matrix.service }}
          npm run test:coverage
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./services/${{ matrix.service }}/coverage/lcov.info
          flags: ${{ matrix.service }}
          name: ${{ matrix.service }}-coverage
```

## Performance Testing

### Load Testing with Vitest
```typescript
// tests/performance/load-test.test.ts
import { describe, it, expect } from 'vitest'
import { TestClient } from 'fastapi/testclient'
import { app } from '@/main'

describe('Load Testing', () => {
  let client: TestClient<FastAPI>

  beforeAll(() => {
    client = new TestClient(app)
  })

  it('should handle concurrent submissions', async () => {
    const concurrentRequests = 100
    const promises = Array.from({ length: concurrentRequests }, (_, i) =>
      client.post('/api/submissions', {
        json: {
          requestType: 'text_analysis',
          text: `Test submission ${i}`,
          files: []
        },
        headers: {
          'Authorization': 'Bearer test-token'
        }
      })
    )

    const results = await Promise.allSettled(promises)
    const successful = results.filter(result => 
      result.status === 'fulfilled' && result.value.status === 201
    )

    expect(successful).toHaveLength(concurrentRequests)
  })

  it('should maintain response time under load', async () => {
    const startTime = Date.now()
    
    const response = await client.get('/api/submissions', {
      headers: {
        'Authorization': 'Bearer test-token'
      }
    })

    const responseTime = Date.now() - startTime
    expect(responseTime).toBeLessThan(1000) // Should respond within 1 second
    expect(response.status).toBe(200)
  })
})
```

## Test Data Management

### Test Fixtures
```typescript
// tests/fixtures/submissions.ts
export const testSubmissions = {
  valid: {
    requestType: 'text_analysis',
    text: 'I need help with my business strategy',
    files: []
  },
  withFiles: {
    requestType: 'document_analysis',
    text: 'Please analyze this document',
    files: [
      {
        filename: 'document.pdf',
        content: Buffer.from('test pdf content'),
        contentType: 'application/pdf'
      }
    ]
  },
  invalid: {
    requestType: 'invalid_type',
    text: '',
    files: []
  }
}

export const testUsers = {
  valid: {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User'
  },
  admin: {
    id: 'admin-123',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin'
  }
}
```

This comprehensive testing strategy ensures that all components of the Statex platform are thoroughly tested, maintainable, and reliable.
