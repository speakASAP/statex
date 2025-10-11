# Environment Variables Consolidation Proposal

**Date:** October 11, 2025  
**Status:** AWAITING APPROVAL  
**Impact:** ~150+ variables to be consolidated/removed

---

## Executive Summary

This document proposes consolidation of duplicate environment variables across the StateX codebase. Based on analysis of `.env` file and codebase usage patterns, we identified significant redundancy that can be eliminated while maintaining functionality.

**Key Decisions:**

- Keep `SERVICE_NAME_PORT` (remove EXTERNAL/INTERNAL variants)
- Remove all `DEFAULT_` prefixed variables
- Analyze and selectively keep `NEXT_PUBLIC_` variables based on frontend usage
- Keep all boolean feature flags (they're semantically different)

---

## 1. SERVICE PORTS CONSOLIDATION

### Current State

Each service has 2-3 port variables with identical values:

- `SERVICE_EXTERNAL_PORT`
- `SERVICE_INTERNAL_PORT`  
- `SERVICE_PORT`

### Proposed Change

**Keep:** `SERVICE_NAME_PORT` (shortest, most common pattern)  
**Remove:** `SERVICE_NAME_EXTERNAL_PORT`, `SERVICE_NAME_INTERNAL_PORT`

### Detailed Changes

| Service | KEEP Variable | REMOVE Variables | Value |
|---------|---------------|------------------|-------|
| Platform Management | `PLATFORM_MANAGEMENT_PORT` | `PLATFORM_MANAGEMENT_EXTERNAL_PORT`, `PLATFORM_MANAGEMENT_INTERNAL_PORT` | 8000 |
| API Gateway | `API_GATEWAY_PORT` | `API_GATEWAY_EXTERNAL_PORT`, `API_GATEWAY_INTERNAL_PORT` | 8001 |
| Submission Service | `SUBMISSION_SERVICE_PORT` | `SUBMISSION_SERVICE_EXTERNAL_PORT`, `SUBMISSION_SERVICE_INTERNAL_PORT` | 8002 |
| Notification Service | `NOTIFICATION_SERVICE_PORT` | `NOTIFICATION_SERVICE_EXTERNAL_PORT`, `NOTIFICATION_SERVICE_INTERNAL_PORT` | 8005 |
| User Portal | `USER_PORTAL_PORT` | `USER_PORTAL_EXTERNAL_PORT`, `USER_PORTAL_INTERNAL_PORT` | 8006 |
| Monitoring Service | `MONITORING_SERVICE_PORT` | `MONITORING_SERVICE_EXTERNAL_PORT`, `MONITORING_SERVICE_INTERNAL_PORT` | 8007 |
| Logging Service | `LOGGING_SERVICE_PORT` | `LOGGING_SERVICE_EXTERNAL_PORT`, `LOGGING_SERVICE_INTERNAL_PORT` | 8008 |
| Content Service | `CONTENT_SERVICE_PORT` | `CONTENT_SERVICE_EXTERNAL_PORT`, `CONTENT_SERVICE_INTERNAL_PORT` | 8009 |
| AI Orchestrator | `AI_ORCHESTRATOR_PORT` | `AI_ORCHESTRATOR_EXTERNAL_PORT`, `AI_ORCHESTRATOR_INTERNAL_PORT` | 8010 |
| NLP Service | `NLP_SERVICE_PORT` | `NLP_SERVICE_EXTERNAL_PORT`, `NLP_SERVICE_INTERNAL_PORT` | 8011 |
| ASR Service | `ASR_SERVICE_PORT` | `ASR_SERVICE_EXTERNAL_PORT`, `ASR_SERVICE_INTERNAL_PORT` | 8012 |
| Document AI | `DOCUMENT_AI_PORT` | `DOCUMENT_AI_EXTERNAL_PORT`, `DOCUMENT_AI_INTERNAL_PORT` | 8013 |
| Prototype Generator | `PROTOTYPE_GENERATOR_PORT` | `PROTOTYPE_GENERATOR_EXTERNAL_PORT`, `PROTOTYPE_GENERATOR_INTERNAL_PORT` | 8014 |
| Template Repository | `TEMPLATE_REPOSITORY_PORT` | `TEMPLATE_REPOSITORY_EXTERNAL_PORT`, `TEMPLATE_REPOSITORY_INTERNAL_PORT` | 8015 |
| Free AI Service | `FREE_AI_SERVICE_PORT` | `FREE_AI_SERVICE_EXTERNAL_PORT`, `FREE_AI_SERVICE_INTERNAL_PORT` | 8016 |
| AI Workers | `AI_WORKERS_PORT` | `AI_WORKERS_EXTERNAL_PORT`, `AI_WORKERS_INTERNAL_PORT` | 8017 |
| Dashboard | `DASHBOARD_PORT` | `DASHBOARD_EXTERNAL_PORT`, `DASHBOARD_INTERNAL_PORT` | 8020 |
| DNS Service | `DNS_SERVICE_PORT` | `DNS_SERVICE_EXTERNAL_PORT`, `DNS_SERVICE_INTERNAL_PORT` | 8053 |

**Files to Update:**

- `.env`
- `.env.example`
- `scripts/start-dev-all.sh`
- `scripts/start-dev-essential.sh`
- All `docker-compose*.yml` files (41 files)
- Service README files
- Documentation files

---

## 2. DEFAULT_ PREFIX VARIABLES REMOVAL

### Current State

Many variables have both `DEFAULT_` and non-prefixed versions with identical values.

### Proposed Change

**Remove ALL `DEFAULT_` prefixed variables**

### Detailed Changes

| KEEP Variable | REMOVE Variable | Value |
|---------------|-----------------|-------|
| `APP_NAME` | `DEFAULT_APP_NAME` | Statex |
| `PACKAGE_VERSION` | `DEFAULT_PACKAGE_VERSION` | 1.0.0 |
| `FRONTEND_PORT` | `DEFAULT_FRONTEND_PORT` | 3000 |
| `PORT` | `DEFAULT_PORT` | 3000 |
| `BACKEND_PORT` | `DEFAULT_BACKEND_PORT` | 4000 |
| `BUILD_DATE` | `DEFAULT_BUILD_DATE` | 20250902-143000 |
| `COOKIE_SECRET` | `DEFAULT_COOKIE_SECRET` | dev-cookie-secret-key |
| `CORS_CREDENTIALS` | `DEFAULT_CORS_CREDENTIALS` | true |
| `CORS_MAX_AGE` | `DEFAULT_CORS_MAX_AGE` | 86400 |
| `CORS_METHODS` | `DEFAULT_CORS_METHODS` | GET,HEAD,PUT,PATCH,POST,DELETE |
| `CORS_ORIGIN` | `DEFAULT_CORS_ORIGIN` | <http://localhost:3000> |
| `DB_NAME` | `DEFAULT_DB_NAME` | statex_production |
| `DB_PASSWORD` | `DEFAULT_DB_PASSWORD` | statexpass |
| `DB_USER` | `DEFAULT_DB_USER` | statex |
| `JWT_SECRET` | `DEFAULT_JWT_SECRET` | dev-jwt-secret-key |
| `LETSENCRYPT_EMAIL` | `DEFAULT_LETSENCRYPT_EMAIL` | admin@localhost |
| `LOG_FILE` | `DEFAULT_LOG_FILE` | logs/app.log |
| `LOG_FORMAT` | `DEFAULT_LOG_FORMAT` | combined |
| `LOG_LEVEL` | `DEFAULT_LOG_LEVEL` | info |
| `MAX_FILES` | `DEFAULT_MAX_FILES` | 10 |
| `MAX_FILE_SIZE` | `DEFAULT_MAX_FILE_SIZE` | 50MB |
| `NGINX_HTTPS_PORT` | `DEFAULT_NGINX_HTTPS_PORT` | 443 |
| `NGINX_HTTP_PORT` | `DEFAULT_NGINX_HTTP_PORT` | 80 |
| `NODE_ENV` | `DEFAULT_NODE_ENV` | production |
| `NOTIFICATION_SERVICE_API_KEY` | `DEFAULT_NOTIFICATION_SERVICE_API_KEY` | dev-notification-api-key |
| `NOTIFICATION_SERVICE_ENABLED` | `DEFAULT_NOTIFICATION_SERVICE_ENABLED` | true |
| `NOTIFICATION_SERVICE_HEALTH_ENDPOINT` | `DEFAULT_NOTIFICATION_SERVICE_HEALTH_ENDPOINT` | /api/health |
| `NOTIFICATION_SERVICE_NOTIFY_ENDPOINT` | `DEFAULT_NOTIFICATION_SERVICE_NOTIFY_ENDPOINT` | /api/notifications |
| `NOTIFICATION_SERVICE_RETRIES` | `DEFAULT_NOTIFICATION_SERVICE_RETRIES` | 3 |
| `NOTIFICATION_SERVICE_TIMEOUT` | `DEFAULT_NOTIFICATION_SERVICE_TIMEOUT` | 10000 |
| `NOTIFICATION_SERVICE_URL` | `DEFAULT_NOTIFICATION_SERVICE_URL` | <http://localhost:3000> |
| `NOTIFICATION_SERVICE_VERSION_ENDPOINT` | `DEFAULT_NOTIFICATION_SERVICE_VERSION_ENDPOINT` | /api/version |
| `RATE_LIMIT_MAX` | `DEFAULT_RATE_LIMIT_MAX` | 100 |
| `RATE_LIMIT_WINDOW_MS` | `DEFAULT_RATE_LIMIT_WINDOW_MS` | 900000 |
| `REDIS_PASSWORD` | `DEFAULT_REDIS_PASSWORD` | (empty) |
| `SESSION_COOKIE_MAX_AGE` | `DEFAULT_SESSION_COOKIE_MAX_AGE` | 2592000000 |
| `SESSION_SECRET` | `DEFAULT_SESSION_SECRET` | dev-session-secret-key |
| `USER_UID` | `DEFAULT_USER_UID` | 1001 |
| `ALLOW_SELF_SIGNED` | `DEFAULT_ALLOW_SELF_SIGNED` | false |

**Total DEFAULT_ Variables to Remove:** ~40

**Files to Update:**

- `.env`
- `.env.example`
- All `docker-compose*.yml` files
- Test files
- Documentation files

---

## 3. NEXT_PUBLIC_ VARIABLES ANALYSIS

### Current State

Some `NEXT_PUBLIC_` variables duplicate backend variables.

### Analysis & Decisions

#### 3.1 KEEP BOTH (Frontend needs these at runtime)

| Backend Variable | Frontend Variable | Value | Reason |
|------------------|-------------------|-------|--------|
| `API_URL` | `NEXT_PUBLIC_API_URL` | <http://localhost:8002/api> | Frontend makes direct API calls |
| `NOTIFICATION_SERVICE_URL` | `NEXT_PUBLIC_NOTIFICATION_SERVICE_URL` | <http://localhost:8005> | Frontend sends notifications |
| `NOTIFICATION_SERVICE_API_KEY` | `NEXT_PUBLIC_NOTIFICATION_SERVICE_API_KEY` | dev-notification-api-key | Frontend needs API key |
| `USER_PORTAL_URL` | `NEXT_PUBLIC_USER_PORTAL_URL` | <http://localhost:8006> | Frontend redirects to portal |
| `AI_SERVICE_URL` | `NEXT_PUBLIC_AI_SERVICE_URL` | <http://localhost:8010> | Frontend polls AI status |
| `BASE_URL` | `NEXT_PUBLIC_BASE_URL` | <http://localhost:3000> | Frontend needs own URL |

**Action:** KEEP BOTH (mark as intentionally duplicated for clarity)

#### 3.2 REMOVE DUPLICATES (Consolidate)

| KEEP Variable | REMOVE Variable | Value | Reason |
|---------------|-----------------|-------|--------|
| `NEXT_PUBLIC_ADMIN_API_URL` | None (already unique) | <http://localhost:8010> | Only used in frontend |
| `CONTENT_SERVICE_URL` | `NEXT_PUBLIC_CONTENT_SERVICE_URL` | <http://localhost:8009> | Backend-only, remove frontend duplicate |
| `NEXT_PUBLIC_CDN_URL` | `NEXT_PUBLIC_STORAGE_URL` | <https://cdn.statex.cz> | Same endpoint, different name |
| `NEXT_PUBLIC_SITE_URL` | `NEXTAUTH_URL` | <https://statex.cz> | NextAuth can read NEXT_PUBLIC_ |

#### 3.3 OTHER NEXT_PUBLIC_ VARIABLES (Keep, no duplicates)

These have no backend counterparts:

- `NEXT_PUBLIC_APP_NAME` (keep)
- `NEXT_PUBLIC_APP_VERSION` (keep)
- `NEXT_PUBLIC_BUILD_ENV` (keep)
- `NEXT_PUBLIC_DEBUG_MODE` (keep)
- `NEXT_PUBLIC_DEV_MODE` (keep)
- `NEXT_PUBLIC_ENABLE_ANALYTICS` (keep)
- `NEXT_PUBLIC_ENABLE_ERROR_TRACKING` (keep)
- `NEXT_PUBLIC_ENABLE_MULTILINGUAL` (keep)
- `NEXT_PUBLIC_ENV` (keep)
- `NEXT_PUBLIC_ENV_FILE` (keep)
- `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` (keep)

**Files to Update:**

- `.env`
- `.env.example`
- `statex-website/frontend/src/config/env.ts`
- `statex-website/frontend/next.config.js`

---

## 4. SERVICE URL CONSOLIDATION

### Current State

Multiple URL variables pointing to same service.

### Detailed Changes

| KEEP Variable | REMOVE Variables | Value |
|---------------|------------------|-------|
| `PLATFORM_MANAGEMENT_URL` | `PLATFORM_URL` | <http://localhost:8000> |
| `NOTIFICATION_SERVICE_URL` | None (already consolidated with NEXT_PUBLIC_) | <http://localhost:8005> |
| `USER_PORTAL_URL` | `WEBSITE_SERVICES_URL` | <http://localhost:8006> |
| `CONTENT_SERVICE_URL` | None (remove NEXT_PUBLIC_ duplicate above) | <http://localhost:8009> |
| `AI_ORCHESTRATOR_URL` | `AI_SERVICES_BASE_URL`, `NEXT_PUBLIC_ADMIN_API_URL` | <http://localhost:8010> |
| `NEXT_PUBLIC_CDN_URL` | `NEXT_PUBLIC_STORAGE_URL` | <https://cdn.statex.cz> |
| `NEXT_PUBLIC_SITE_URL` | `NEXTAUTH_URL` | <https://statex.cz> |

**Files to Update:**

- `.env`
- `.env.example`
- Service configuration files

---

## 5. DATABASE/CONNECTION VARIABLES

### Detailed Changes

| KEEP Variable | REMOVE Variables | Value |
|---------------|------------------|-------|
| `DATABASE_URL` | `POSTGRES_URL` | postgresql+psycopg://statex:statex_password@localhost:5432/statex_submissions |
| `RABBITMQ_URL` | `BROKER_URL` | amqp://statex:statex_password@localhost:5672 |
| `DB_USER` | `DEFAULT_DB_USER` | statex |
| `DB_PASSWORD` | `DEFAULT_DB_PASSWORD` | statexpass |

**Files to Update:**

- `.env`
- `.env.example`
- Database connection files in all services

---

## 6. EMAIL VARIABLES

### Detailed Changes

| KEEP Variable | REMOVE Variables | Value |
|---------------|------------------|-------|
| `CONTACT_EMAIL` | `FROM_EMAIL`, `SENDER_EMAIL`, `SMTP_USERNAME` | <contact@statex.cz> |
| `ADMIN_EMAIL` | `LETSENCRYPT_EMAIL`, `SSL_EMAIL` | <admin@statex.cz> |

**Files to Update:**

- `.env`
- `.env.example`
- Email service configurations
- SSL configuration files

---

## 7. NUMERIC CONFIGURATION VALUES

### Detailed Changes

| KEEP Variable | REMOVE Variables | Value |
|---------------|------------------|-------|
| `FRONTEND_PORT` | `PORT`, `FRONTEND_EXTERNAL_PORT`, `GRAFANA_PORT`, `DEV_SERVER_PORT` (except where semantically different) | 3000 |
| `REQUEST_TIMEOUT` | `WORKER_TIMEOUT`, `JWT_ACCESS_TOKEN_EXPIRE_MINUTES` (if same meaning) | 30 |
| `NOTIFICATION_SERVICE_RETRIES` | `BROKER_RETRY_ATTEMPTS` | 3 |
| `RATE_LIMIT_MAX` | None (DEFAULT_ already removed) | 100 |
| `MAX_FILES` | `DATABASE_MAX_OVERFLOW` (different semantics, keep both) | 10 |
| `REDIS_POOL_SIZE` | None (DATABASE_POOL_SIZE different) | 5 |
| `JWT_REFRESH_TOKEN_EXPIRE_DAYS` | `JWT_COOKIE_EXPIRES_IN` | 7 |
| `NGINX_HTTP_PORT` | None (DEFAULT_ already removed) | 80 |
| `NGINX_HTTPS_PORT` | None (DEFAULT_ already removed) | 443 |
| `PROMETHEUS_PORT` | `METRICS_PORT` | 9090 |
| `CORS_MAX_AGE` | None (DEFAULT_ already removed) | 86400 |
| `RATE_LIMIT_WINDOW_MS` | None (DEFAULT_ already removed) | 900000 |
| `SESSION_COOKIE_MAX_AGE` | None (DEFAULT_ already removed) | 2592000000 |
| `NOTIFICATION_SERVICE_TIMEOUT` | None (DEFAULT_ already removed) | 10000 |

**Note:** Keep semantically different variables even if values match (e.g., `DATABASE_POOL_SIZE` vs `REDIS_POOL_SIZE`).

---

## 8. STRING CONFIGURATION VALUES

### Detailed Changes

| KEEP Variable | REMOVE Variables | Value |
|---------------|------------------|-------|
| `APP_NAME` | None (DEFAULT_ already removed) | Statex |
| `PACKAGE_VERSION` | `NEXT_PUBLIC_APP_VERSION` (if truly same version) | 1.0.0 |
| `PRODUCTION_DOMAIN` | `DEFAULT_HOST`, `LETSENCRYPT_HOST` | statex.cz |
| `DEVELOPMENT_DOMAIN` | `DEFAULT_VIRTUAL_HOST`, `DEFAULT_DEFAULT_HOST` | localhost |
| `LOG_FILE` | None (DEFAULT_ already removed) | logs/app.log |
| `TAILWIND_MODE` | `POSTCSS_MODE` (if always same) | build |
| `COMPOSE_PROJECT_NAME` | `S3_BUCKET_PREFIX` | statex-dev |
| `CORS_METHODS` | None (DEFAULT_ already removed) | GET,HEAD,PUT,PATCH,POST,DELETE |
| `DEV_SERVER_HOST` | `HOST` | 0.0.0.0 |

---

## 9. BOOLEAN FEATURE FLAGS

### Decision: KEEP ALL

**Reason:** While 40+ variables have value `true`, they control different features:

- `ENABLE_AI_SERVICES`
- `ENABLE_ANALYTICS`
- `ENABLE_ANTHROPIC`
- `ENABLE_CACHING`
- etc.

These are semantically different and should remain separate for granular control.

**Exception:** Remove duplicates like:

- Keep `ALLOW_SELF_SIGNED`, remove `DEFAULT_ALLOW_SELF_SIGNED`
- Keep `NOTIFICATION_SERVICE_ENABLED`, remove `DEFAULT_NOTIFICATION_SERVICE_ENABLED`

---

## 10. IMPLEMENTATION PLAN

### Phase 1: Preparation

1. Create backup of all `.env`
2. Create list of all files to update (completed above)
3. Review and approve this proposal

### Phase 2: Port Variables (18 services)

1. Update `.env` and `.env.example`
2. Update all docker-compose files (41 files)
3. Update startup scripts (2 files)
4. Update service-specific files
5. Test each service starts correctly

### Phase 3: DEFAULT_ Prefix Removal (~40 variables)

1. Update `.env` and `.env.example`
2. Update all docker-compose files
3. Update test files
4. Update documentation
5. Run full test suite

### Phase 4: NEXT_PUBLIC_ Variables (selective)

1. Update `.env` and `.env.example`
2. Update `frontend/src/config/env.ts`
3. Update `frontend/next.config.js`
4. Test frontend functionality

### Phase 5: URL/Database/Email Variables

1. Update `.env` and `.env.example`
2. Update service configuration files
3. Test database connections
4. Test email sending
5. Test SSL/certificates

### Phase 6: Numeric/String Variables

1. Update `.env` and `.env.example`
2. Update configuration files
3. Run integration tests

### Phase 7: Final Validation

1. Full system test
2. Check all services start
3. Check all features work
4. Update documentation
5. Commit changes

---

## 11. RISK ASSESSMENT

### High Risk Areas

- Port variables in Docker Compose files (41 files)
- Database connection strings (multiple services)
- Frontend environment variables (build-time vs runtime)

### Mitigation

- Make changes incrementally (one category at a time)
- Test after each category
- Keep backups of all modified files
- Use search/replace with careful verification

### Rollback Plan

- Git commit after each successful phase
- Keep backup `.env` files
- Document all changes in commit messages

---

## 12. SUMMARY OF CHANGES

### Total Variables Before: ~400

### Total Variables After: ~250

### Reduction: ~150 variables (37%)

### Breakdown

- **Service Ports:** Remove 36 variables (2 per service × 18 services)
- **DEFAULT_ Prefix:** Remove 40 variables
- **NEXT_PUBLIC_ Duplicates:** Remove 4 variables
- **Service URLs:** Remove 6 variables
- **Database/Connection:** Remove 3 variables
- **Email:** Remove 3 variables
- **Numeric/String:** Remove ~20 variables
- **Other duplicates:** Remove ~38 variables

---

## 13. FILES TO UPDATE

### Configuration Files (Priority 1)

- `.env` (main configuration)
- `.env.example` (template)
- `.env.backup` (if exists)

### Docker Compose Files (Priority 2)

- `statex-infrastructure/docker-compose.dev.yml`
- `statex-infrastructure/docker-compose.essential.yml`
- `statex-infrastructure/docker-compose.production.yml`
- `statex-infrastructure/docker-compose.yml`
- `statex-website/docker-compose.dev.yml`
- `statex-website/docker-compose.development.yml`
- `statex-website/docker-compose.production.yml`
- `statex-website/docker-compose.yml`
- `statex-platform/docker-compose.dev.yml`
- `statex-platform/docker-compose.yml`
- `statex-monitoring/docker-compose.dev.yml`
- `statex-monitoring/docker-compose.yml`
- `statex-notification-service/docker-compose.dev.yml`
- `statex-notification-service/docker-compose.yml`
- `statex-notification-service/docker-compose.email.yml`
- `statex-notification-service/docker-compose.email-complete.yml`
- `statex-notification-service/docker-compose.simple-email.yml`
- `statex-dns-service/docker-compose.yml`
- `statex-ai/docker-compose.dev.yml`
- `statex-ai/docker-compose.yml`
- And 20+ more service-specific docker-compose files

### Script Files (Priority 3)

- `scripts/start-dev-all.sh`
- `scripts/start-dev-essential.sh`
- `statex-platform/scripts/dev-manage.sh`
- `statex-platform/scripts/health-check.sh`
- `statex-website/scripts/setup_env.sh`
- `statex-website/scripts/setup_production.sh`
- `statex-infrastructure/nginx/start-nginx.sh`

### Frontend Files (Priority 4)

- `statex-website/frontend/src/config/env.ts`
- `statex-website/frontend/next.config.js`
- `statex-website/frontend/src/components/sections/FormSection.tsx` (hardcoded URL at line 347)

### Service Configuration Files (Priority 5)

- `statex-platform/services-registry.conf`
- All service-specific config files
- Database configuration files
- Email service configuration files

### Documentation Files (Priority 6)

- `docs/ENVIRONMENT_VARIABLES_REFERENCE.md`
- `docs/COMPREHENSIVE_HARDCODED_VALUES_MIGRATION.md`
- `docs/CORE_PLATFORM_SERVICES_ENV_MIGRATION.md`
- `docs/WEBSITE_INFRASTRUCTURE_SERVICES_ENV_MIGRATION.md`
- `docs/NOTIFICATION_DNS_SERVICES_ENV_MIGRATION.md`
- `docs/DYNAMIC_SUBDOMAIN_SETUP.md`
- `statex-website/docs/development/docker-production-guide.md`
- `statex-website/docs/development/CONFIGURATION_GUIDE.md`
- `statex-website/docs/IMPLEMENTATION_PLAN.md`
- And 10+ more documentation files

### Kubernetes Files (Priority 7)

- `k8s/base/secret.yaml`
- `k8s/base/statex-ai-deployment.yaml`
- Other k8s configuration files

### Test Files (Priority 8)

- All test files that reference environment variables
- Integration test files
- Workflow test files

### All remaining Files (Priority 9)

- Find removed variables across the entire codebase and replace them.
- Save all removed variables to separate file.

---

## 14. APPROVAL CHECKLIST

Before proceeding, please verify:

- [ ] Port consolidation strategy is correct (`SERVICE_NAME_PORT` only)
- [ ] All `DEFAULT_` variables can be safely removed
- [ ] `NEXT_PUBLIC_` analysis is correct (frontend needs identified correctly)
- [ ] No critical variables are being removed
- [ ] Implementation phases are reasonable
- [ ] Risk mitigation plan is acceptable
- [ ] Have backup/rollback plan

---

## 15. NEXT STEPS

After approval:

1. Create git branch: `refactor/consolidate-env-variables`
2. Execute Phase 1: Preparation
3. Execute Phase 2-7 sequentially with testing
4. Create PR for review
5. Merge after final validation

---

**Prepared by:** AI Assistant  
**Review Status:** PENDING USER APPROVAL  
**Estimated Effort:** 3-4 hours (with careful testing)  
**Risk Level:** MEDIUM (many files, but changes are straightforward)
