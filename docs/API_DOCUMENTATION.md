# Multi-Agent Workflow - API Documentation

This document provides comprehensive API documentation for all services in the multi-agent contact form workflow system.

## Table of Contents

1. [API Overview](#api-overview)
2. [Authentication](#authentication)
3. [Website Frontend API](#website-frontend-api)
4. [Submission Service API](#submission-service-api)
5. [AI Orchestrator API](#ai-orchestrator-api)
6. [NLP Service API](#nlp-service-api)
7. [ASR Service API](#asr-service-api)
8. [Document AI Service API](#document-ai-service-api)
9. [Free AI Service API](#free-ai-service-api)
10. [Notification Service API](#notification-service-api)
11. [Error Handling](#error-handling)
12. [Rate Limiting](#rate-limiting)
13. [Monitoring Endpoints](#monitoring-endpoints)

## API Overview

### Base URLs
- **Website Frontend**: `http://localhost:3000`
- **Submission Service**: `http://localhost:8002`
- **AI Orchestrator**: `http://localhost:8010`
- **NLP Service**: `http://localhost:8011`
- **ASR Service**: `http://localhost:8012`
- **Document AI**: `http://localhost:8013`
- **Free AI Service**: `http://localhost:8016`
- **Notification Service**: `http://localhost:8005`

### Common Headers
```http
Content-Type: application/json
Accept: application/json
User-Agent: StateX-Client/1.0
```

### Response Format
All APIs return responses in the following format:
```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully",
  "timestamp": "2023-12-01T10:00:00Z",
  "request_id": "uuid-string"
}
```

## Authentication

### API Key Authentication
Some endpoints require API key authentication:
```http
Authorization: Bearer your-api-key
```

### JWT Authentication
For user-specific operations:
```http
Authorization: Bearer jwt-token
```