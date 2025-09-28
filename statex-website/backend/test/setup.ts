import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { PrismaClient } from '@prisma/client';

// Test database setup
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL || 'postgresql://statex:statexpass@localhost:5432/statex_test',
    },
  },
});

// Setup before all tests
beforeAll(async () => {
  // Connect to test database
  await prisma.$connect();
  
  // Run migrations if needed
  // await prisma.$executeRaw`CREATE SCHEMA IF NOT EXISTS public`;
});

// Cleanup after all tests
afterAll(async () => {
  // Clean up database
  await prisma.contact.deleteMany();
  await prisma.prototype.deleteMany();
  await prisma.user.deleteMany();
  
  // Disconnect from database
  await prisma.$disconnect();
});

// Reset database state before each test
beforeEach(async () => {
  // Clean all tables
  await prisma.contact.deleteMany();
  await prisma.prototype.deleteMany();
  await prisma.user.deleteMany();
});

// Global test utilities
global.prisma = prisma;

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.REDIS_URL = 'redis://localhost:6379/1'; // Use different Redis DB for tests 