# Multi-Agent Contact Form Workflow - Deployment Guide

This comprehensive deployment guide covers the complete setup and configuration procedures for the multi-agent AI orchestration workflow system.

## Table of Contents

1. [System Overview](#system-overview)
2. [Prerequisites](#prerequisites)
3. [Environment Setup](#environment-setup)
4. [Service Configuration](#service-configuration)
5. [Database Setup](#database-setup)
6. [AI Services Configuration](#ai-services-configuration)
7. [Monitoring Setup](#monitoring-setup)
8. [Security Configuration](#security-configuration)
9. [Deployment Procedures](#deployment-procedures)
10. [Post-Deployment Verification](#post-deployment-verification)
11. [Troubleshooting](#troubleshooting)

## System Overview

The multi-agent contact form workflow system consists of the following components:

### Core Services
- **Website Frontend** (Port 3000): Next.js application with contact form
- **Submission Service** (Port 8002): Handles form submissions and file uploads
- **AI Orchestrator** (Port 8010): Coordinates multi-agent workflows
- **NLP Service** (Port 8011): Business requirement analysis
- **ASR Service** (Port 8012): Speech-to-text processing
- **Document AI** (Port 8013): Document analysis and OCR
- **Free AI Service** (Port 8016): Local AI model management
- **AI Workers** (Port 8017): Distributed AI processing
- **Notification Service** (Port 8005): Telegram and multi-channel notifications

### Infrastructure Services
- **PostgreSQL** (Port 5432): Primary database
- **Redis** (Port 6379): Caching and session storage
- **RabbitMQ** (Port 5672): Message queuing
- **MinIO** (Port 9000): Object storage for files

### Monitoring Services
- **Prometheus** (Port 9090): Metrics collection
- **Grafana** (Port 3002): Monitoring dashboards
- **Loki** (Port 3100): Log aggregation

## Prerequisites

### System Requirements

#### Minimum Requirements
- **CPU**: 4 cores
- **RAM**: 8GB
- **Storage**: 50GB SSD
- **Network**: 100 Mbps

#### Recommended Requirements
- **CPU**: 8 cores
- **RAM**: 16GB
- **Storage**: 100GB SSD
- **Network**: 1 Gbps

### Software Dependencies

#### Required Software
- Docker 24.0+
- Docker Compose 2.20+
- Git 2.30+
- Node.js 18+ (for development)
- Python 3.9+ (for AI services)

#### Optional Software
- Ollama (for local AI models)
- NVIDIA Docker (for GPU acceleration)

### Network Requirements
- Outbound HTTPS (443) for AI service APIs
- Inbound HTTP/HTTPS (80/443) for web access
- Internal service communication (various ports)