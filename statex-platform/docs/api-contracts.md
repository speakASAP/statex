# API Contracts and Event Schemas

## Overview

This document defines the API contracts and event schemas for all microservices in the Statex platform. It ensures consistent communication patterns and data structures across all services.

## API Design Principles

### RESTful Design
- **Resource-based URLs**: Use nouns for resources, verbs for actions
- **HTTP Methods**: Use appropriate HTTP methods (GET, POST, PUT, DELETE)
- **Status Codes**: Use standard HTTP status codes
- **Content Types**: Support JSON for all API responses

### Authentication & Authorization
- **JWT Tokens**: All API calls require valid JWT tokens
- **Role-based Access**: Different access levels for different user roles
- **API Keys**: Service-to-service authentication using API keys
- **Rate Limiting**: Implement rate limiting per user and service

### Error Handling
- **Consistent Error Format**: All errors follow the same structure
- **Error Codes**: Use standardized error codes
- **Error Messages**: Provide clear, actionable error messages
- **Error Logging**: Log all errors for debugging and monitoring

## Common Data Models

### Base Response Model
```python
class BaseResponse(BaseModel):
    success: bool
    message: Optional[str] = None
    data: Optional[Any] = None
    errors: Optional[List[ErrorDetail]] = None
    metadata: Optional[Dict[str, Any]] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
```

### Error Detail Model
```python
class ErrorDetail(BaseModel):
    code: str
    message: str
    field: Optional[str] = None
    context: Optional[Dict[str, Any]] = None
```

### Pagination Model
```python
class PaginationParams(BaseModel):
    page: int = Field(default=1, ge=1)
    size: int = Field(default=20, ge=1, le=100)
    sort: Optional[str] = None
    order: Optional[str] = Field(default="asc", regex="^(asc|desc)$")

class PaginatedResponse(BaseModel):
    data: List[Any]
    pagination: PaginationInfo

class PaginationInfo(BaseModel):
    page: int
    size: int
    total: int
    pages: int
    has_next: bool
    has_prev: bool
```

## User Portal API

### Authentication Endpoints

#### POST /api/auth/register
```python
class UserRegistrationRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    first_name: str = Field(min_length=1, max_length=50)
    last_name: str = Field(min_length=1, max_length=50)
    phone: Optional[str] = None
    terms_accepted: bool = True

class UserRegistrationResponse(BaseResponse):
    data: UserProfile
    access_token: str
    refresh_token: str
```

#### POST /api/auth/login
```python
class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str
    remember_me: bool = False

class UserLoginResponse(BaseResponse):
    data: UserProfile
    access_token: str
    refresh_token: str
    expires_in: int
```

#### POST /api/auth/refresh
```python
class TokenRefreshRequest(BaseModel):
    refresh_token: str

class TokenRefreshResponse(BaseResponse):
    access_token: str
    expires_in: int
```

### User Management Endpoints

#### GET /api/me
```python
class UserProfile(BaseModel):
    id: UUID
    email: str
    first_name: str
    last_name: str
    phone: Optional[str] = None
    avatar: Optional[str] = None
    preferences: UserPreferences
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime] = None
    is_verified: bool
```

#### PUT /api/me
```python
class UserUpdateRequest(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    avatar: Optional[str] = None
    preferences: Optional[UserPreferencesUpdate] = None

class UserPreferencesUpdate(BaseModel):
    email_notifications: Optional[bool] = None
    sms_notifications: Optional[bool] = None
    push_notifications: Optional[bool] = None
    language: Optional[str] = None
    timezone: Optional[str] = None
```

### Request Management Endpoints

#### GET /api/me/requests
```python
class UserRequestListResponse(PaginatedResponse):
    data: List[UserRequestSummary]

class UserRequestSummary(BaseModel):
    id: UUID
    title: str
    status: RequestStatus
    request_type: str
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None
```

#### GET /api/me/requests/{request_id}
```python
class UserRequestDetail(BaseModel):
    id: UUID
    title: str
    description: Optional[str] = None
    status: RequestStatus
    request_type: str
    files: List[FileMetadata]
    results: Optional[Dict[str, Any]] = None
    metadata: Dict[str, Any]
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None
```

## Submission Service API

### Submission Endpoints

#### POST /api/submissions
```python
class SubmissionRequest(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = None
    request_type: str
    metadata: Optional[Dict[str, Any]] = None
    files: List[FileUpload] = Field(max_items=10)

class FileUpload(BaseModel):
    filename: str
    content_type: str
    size: int = Field(gt=0, le=104857600)  # 100MB max
    data: bytes  # Base64 encoded file data

class SubmissionResponse(BaseResponse):
    data: SubmissionSummary

class SubmissionSummary(BaseModel):
    id: UUID
    title: str
    status: SubmissionStatus
    files: List[FileMetadata]
    created_at: datetime
```

#### GET /api/submissions/{submission_id}
```python
class SubmissionDetail(BaseModel):
    id: UUID
    title: str
    description: Optional[str] = None
    status: SubmissionStatus
    request_type: str
    files: List[FileMetadata]
    metadata: Dict[str, Any]
    created_at: datetime
    updated_at: datetime
    processed_at: Optional[datetime] = None
```

### File Management Endpoints

#### POST /api/files/upload
```python
class FileUploadRequest(BaseModel):
    filename: str
    content_type: str
    size: int
    data: bytes  # Base64 encoded

class FileUploadResponse(BaseResponse):
    data: FileMetadata

class FileMetadata(BaseModel):
    id: UUID
    filename: str
    original_filename: str
    content_type: str
    size: int
    s3_key: str
    s3_url: str
    checksum: str
    created_at: datetime
```

## AI Orchestrator API

### Job Management Endpoints

#### POST /api/jobs
```python
class JobRequest(BaseModel):
    submission_id: UUID
    workflow_type: str
    parameters: Dict[str, Any] = {}
    priority: int = Field(default=1, ge=1, le=10)
    timeout: Optional[int] = None  # seconds

class JobResponse(BaseResponse):
    data: JobSummary

class JobSummary(BaseModel):
    id: UUID
    submission_id: UUID
    workflow_type: str
    status: JobStatus
    priority: int
    created_at: datetime
    estimated_completion: Optional[datetime] = None
```

#### GET /api/jobs/{job_id}
```python
class JobDetail(BaseModel):
    id: UUID
    submission_id: UUID
    workflow_type: str
    status: JobStatus
    priority: int
    parameters: Dict[str, Any]
    results: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None
    progress: Optional[float] = None  # 0.0 to 1.0
    created_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    tasks: List[TaskSummary]
```

### Worker Management Endpoints

#### GET /api/workers
```python
class WorkerListResponse(BaseResponse):
    data: List[WorkerSummary]

class WorkerSummary(BaseModel):
    id: UUID
    name: str
    capabilities: List[str]
    status: WorkerStatus
    current_load: int
    max_load: int
    last_heartbeat: datetime
    performance_metrics: Dict[str, Any]
```

## Notification Service API

### Notification Endpoints

#### POST /api/notifications
```python
class NotificationRequest(BaseModel):
    user_id: UUID
    template_id: UUID
    channels: List[str]  # email, sms, push, social
    subject: Optional[str] = None
    content: Dict[str, Any]
    metadata: Optional[Dict[str, Any]] = None
    scheduled_at: Optional[datetime] = None

class NotificationResponse(BaseResponse):
    data: NotificationSummary

class NotificationSummary(BaseModel):
    id: UUID
    user_id: UUID
    status: NotificationStatus
    channels: List[str]
    created_at: datetime
    sent_at: Optional[datetime] = None
```

### Template Management Endpoints

#### GET /api/templates
```python
class TemplateListResponse(PaginatedResponse):
    data: List[TemplateSummary]

class TemplateSummary(BaseModel):
    id: UUID
    name: str
    type: str
    channel: str
    is_active: bool
    created_at: datetime
    updated_at: datetime
```

#### POST /api/templates
```python
class TemplateCreateRequest(BaseModel):
    name: str
    type: str
    channel: str
    subject_template: Optional[str] = None
    content_template: str
    variables: List[str] = []
    is_active: bool = True

class TemplateCreateResponse(BaseResponse):
    data: TemplateDetail

class TemplateDetail(BaseModel):
    id: UUID
    name: str
    type: str
    channel: str
    subject_template: Optional[str] = None
    content_template: str
    variables: List[str]
    is_active: bool
    created_at: datetime
    updated_at: datetime
    created_by: UUID
```

## Content Service API

### Content Management Endpoints

#### GET /api/content
```python
class ContentListResponse(PaginatedResponse):
    data: List[ContentSummary]

class ContentSummary(BaseModel):
    id: UUID
    title: str
    slug: str
    content_type: str
    status: ContentStatus
    author_id: UUID
    category: Optional[str] = None
    tags: List[str]
    created_at: datetime
    updated_at: datetime
    published_at: Optional[datetime] = None
```

#### POST /api/content
```python
class ContentCreateRequest(BaseModel):
    title: str
    slug: str
    content_type: str
    category: Optional[str] = None
    tags: List[str] = []
    markdown_content: str
    metadata: Optional[Dict[str, Any]] = None

class ContentCreateResponse(BaseResponse):
    data: ContentDetail

class ContentDetail(BaseModel):
    id: UUID
    title: str
    slug: str
    content_type: str
    status: ContentStatus
    author_id: UUID
    category: Optional[str] = None
    tags: List[str]
    markdown_content: str
    html_content: Optional[str] = None
    ai_optimized_content: Optional[str] = None
    metadata: Dict[str, Any]
    created_at: datetime
    updated_at: datetime
    published_at: Optional[datetime] = None
    version: int
```

### Content Delivery Endpoints

#### GET /api/content/{content_id}/html
```python
class ContentHTMLResponse(BaseResponse):
    data: ContentHTML

class ContentHTML(BaseModel):
    id: UUID
    title: str
    html_content: str
    css_urls: List[str]
    js_urls: List[str]
    metadata: Dict[str, Any]
```

#### GET /api/content/{content_id}/markdown
```python
class ContentMarkdownResponse(BaseResponse):
    data: ContentMarkdown

class ContentMarkdown(BaseModel):
    id: UUID
    title: str
    markdown_content: str
    metadata: Dict[str, Any]
```

## Event Schemas

### Base Event Model
```python
class BaseEvent(BaseModel):
    event: str
    event_id: UUID = Field(default_factory=uuid.uuid4)
    occurred_at: datetime = Field(default_factory=datetime.utcnow)
    trace_id: Optional[UUID] = None
    actor: Optional[Dict[str, Any]] = None
    data: Dict[str, Any]
    version: str = "1.0"
```

### User Events

#### user.registered
```python
class UserRegisteredEvent(BaseEvent):
    event: str = "user.registered"
    data: UserRegistrationData

class UserRegistrationData(BaseModel):
    user_id: UUID
    email: str
    first_name: str
    last_name: str
    registration_source: str  # web, mobile, api
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
```

#### user.updated
```python
class UserUpdatedEvent(BaseEvent):
    event: str = "user.updated"
    data: UserUpdateData

class UserUpdateData(BaseModel):
    user_id: UUID
    changes: Dict[str, Any]
    updated_by: UUID
    ip_address: Optional[str] = None
```

### Request Events

#### request.created
```python
class RequestCreatedEvent(BaseEvent):
    event: str = "request.created"
    data: RequestCreatedData

class RequestCreatedData(BaseModel):
    request_id: UUID
    user_id: UUID
    submission_id: UUID
    title: str
    request_type: str
    files: List[FileMetadata]
    metadata: Dict[str, Any]
    priority: int
```

#### request.processing
```python
class RequestProcessingEvent(BaseEvent):
    event: str = "request.processing"
    data: RequestProcessingData

class RequestProcessingData(BaseModel):
    request_id: UUID
    job_id: UUID
    workflow_type: str
    progress: float  # 0.0 to 1.0
    current_step: str
    estimated_completion: Optional[datetime] = None
```

#### request.completed
```python
class RequestCompletedEvent(BaseEvent):
    event: str = "request.completed"
    data: RequestCompletedData

class RequestCompletedData(BaseModel):
    request_id: UUID
    job_id: UUID
    results: Dict[str, Any]
    processing_time: float  # seconds
    worker_count: int
    artifacts: List[ArtifactMetadata]
```

### AI Events

#### job.created
```python
class JobCreatedEvent(BaseEvent):
    event: str = "job.created"
    data: JobCreatedData

class JobCreatedData(BaseModel):
    job_id: UUID
    submission_id: UUID
    workflow_type: str
    parameters: Dict[str, Any]
    priority: int
    estimated_duration: Optional[int] = None
```

#### job.completed
```python
class JobCompletedEvent(BaseEvent):
    event: str = "job.completed"
    data: JobCompletedData

class JobCompletedData(BaseModel):
    job_id: UUID
    submission_id: UUID
    workflow_type: str
    results: Dict[str, Any]
    processing_time: float
    worker_count: int
    success: bool
```

### Notification Events

#### notification.sent
```python
class NotificationSentEvent(BaseEvent):
    event: str = "notification.sent"
    data: NotificationSentData

class NotificationSentData(BaseModel):
    notification_id: UUID
    user_id: UUID
    channel: str
    template_id: UUID
    delivery_id: UUID
    sent_at: datetime
    provider: str
    provider_id: str
```

#### notification.delivered
```python
class NotificationDeliveredEvent(BaseEvent):
    event: str = "notification.delivered"
    data: NotificationDeliveredData

class NotificationDeliveredData(BaseModel):
    notification_id: UUID
    delivery_id: UUID
    user_id: UUID
    channel: str
    delivered_at: datetime
    provider: str
    provider_id: str
```

### Content Events

#### content.published
```python
class ContentPublishedEvent(BaseEvent):
    event: str = "content.published"
    data: ContentPublishedData

class ContentPublishedData(BaseModel):
    content_id: UUID
    title: str
    slug: str
    content_type: str
    author_id: UUID
    published_at: datetime
    url: str
```

#### content.updated
```python
class ContentUpdatedEvent(BaseEvent):
    event: str = "content.updated"
    data: ContentUpdatedData

class ContentUpdatedData(BaseModel):
    content_id: UUID
    title: str
    slug: str
    changes: Dict[str, Any]
    updated_by: UUID
    updated_at: datetime
    version: int
```

## Error Codes

### Common Error Codes
- **AUTHENTICATION_REQUIRED**: Authentication token required
- **INVALID_TOKEN**: Invalid or expired authentication token
- **INSUFFICIENT_PERMISSIONS**: User lacks required permissions
- **VALIDATION_ERROR**: Request validation failed
- **RESOURCE_NOT_FOUND**: Requested resource not found
- **RESOURCE_CONFLICT**: Resource conflict (e.g., duplicate email)
- **RATE_LIMIT_EXCEEDED**: Rate limit exceeded
- **SERVICE_UNAVAILABLE**: Service temporarily unavailable
- **INTERNAL_ERROR**: Internal server error

### Service-Specific Error Codes

#### User Portal
- **USER_NOT_FOUND**: User not found
- **EMAIL_ALREADY_EXISTS**: Email already registered
- **INVALID_CREDENTIALS**: Invalid login credentials
- **ACCOUNT_LOCKED**: Account locked due to failed attempts
- **EMAIL_NOT_VERIFIED**: Email address not verified

#### Submission Service
- **FILE_TOO_LARGE**: File exceeds size limit
- **INVALID_FILE_TYPE**: File type not allowed
- **UPLOAD_FAILED**: File upload failed
- **VIRUS_DETECTED**: Virus detected in uploaded file
- **STORAGE_UNAVAILABLE**: Storage service unavailable

#### AI Orchestrator
- **WORKFLOW_NOT_FOUND**: Workflow type not found
- **NO_WORKERS_AVAILABLE**: No workers available for task
- **JOB_TIMEOUT**: Job execution timeout
- **WORKFLOW_FAILED**: Workflow execution failed
- **INVALID_PARAMETERS**: Invalid workflow parameters

#### Notification Service
- **TEMPLATE_NOT_FOUND**: Notification template not found
- **CHANNEL_UNAVAILABLE**: Notification channel unavailable
- **DELIVERY_FAILED**: Notification delivery failed
- **RATE_LIMIT_EXCEEDED**: Notification rate limit exceeded
- **INVALID_RECIPIENT**: Invalid recipient address

## API Versioning

### Version Strategy
- **URL Versioning**: Use `/api/v1/` prefix for all endpoints
- **Backward Compatibility**: Maintain backward compatibility for at least 2 versions
- **Deprecation Notice**: Provide 6-month notice before removing deprecated endpoints
- **Version Headers**: Support `Accept-Version` header for version negotiation

### Version Lifecycle
1. **Development**: New features in development
2. **Beta**: Beta testing with limited users
3. **Stable**: Production-ready version
4. **Deprecated**: Version marked for removal
5. **Retired**: Version no longer supported

## Rate Limiting

### Rate Limit Headers
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
X-RateLimit-Retry-After: 60
```

### Rate Limit Tiers
- **Free Tier**: 100 requests/hour
- **Basic Tier**: 1000 requests/hour
- **Premium Tier**: 10000 requests/hour
- **Enterprise Tier**: 100000 requests/hour

## Webhooks

### Webhook Configuration
```python
class WebhookConfig(BaseModel):
    url: str
    events: List[str]
    secret: str
    retry_count: int = 3
    timeout: int = 30
    is_active: bool = True
```

### Webhook Payload
```python
class WebhookPayload(BaseModel):
    event: str
    event_id: UUID
    occurred_at: datetime
    data: Dict[str, Any]
    signature: str  # HMAC signature for verification
```

### Webhook Verification
```python
def verify_webhook_signature(payload: str, signature: str, secret: str) -> bool:
    """Verify webhook signature using HMAC-SHA256"""
    expected_signature = hmac.new(
        secret.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(signature, expected_signature)
```
