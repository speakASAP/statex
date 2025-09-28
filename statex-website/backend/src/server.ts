import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import multipart from '@fastify/multipart';
import { PrismaClient } from '@prisma/client';
import { Redis } from 'ioredis';
import path from 'path';

// Load environment variables from parent directory (global .env files)
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Import form routes
import { registerFormRoutes } from './routes/forms';

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

const buildServer = async (): Promise<FastifyInstance> => {
  const server = Fastify({
    logger: {
      level: process.env.NODE_ENV === 'production' ? 'warn' : 'info',
    },
  });

  // Register CORS plugin - allow all origins for debugging
  await server.register(cors, {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // Register rate limiting
  server.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
    redis: redis,
  });

  // Register multipart for file uploads
  server.register(multipart, {
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB
    },
  });

  // Health check endpoint
  server.get('/health', async (request, reply) => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // API routes
  server.register(async function (server) {
    server.get('/api/test', async (request, reply) => {
      return { message: 'Fastify backend is running!' };
    });
  });

  // Register form routes
  server.register(registerFormRoutes);

  return server;
};

const start = async (): Promise<void> => {
  const server = await buildServer();
  
  try {
    const port = parseInt(process.env.PORT || '4000');
    const host = process.env.HOST || '0.0.0.0';
    
    await server.listen({ port, host });
    
    server.log.info(`Server listening on http://${host}:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

if (require.main === module) {
  start();
}

export { buildServer }; 