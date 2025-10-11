# Environment Variables Consolidation Plan

## Overview

Consolidate ~150 duplicate environment variables across the StateX codebase to reduce complexity and potential configuration errors. A detailed proposal has been created in `ENV_VARIABLES_CONSOLIDATION_PROPOSAL.md` for user review.

## Pre-Execution Requirements

**CRITICAL:** User MUST review and approve `ENV_VARIABLES_CONSOLIDATION_PROPOSAL.md` before any changes are made.

The proposal contains:

- Complete list of 150+ variables to consolidate/remove
- Detailed mapping of which variables to keep vs remove
- Analysis of NEXT_PUBLIC_ variables (frontend vs backend usage)
- Risk assessment and rollback plan
- List of 80+ files that will be modified

## Implementation Strategy

Execute changes in 7 sequential phases with testing after each phase to minimize risk.

**IMPORTANT:** For each phase, create a separate tracking file (phase1.md, phase2.md, etc.) that lists ALL removed variables for verification.

## Phase 1: DEFAULT_ Prefix Removal (~40 variables)

**Goal:** Remove all DEFAULT_ prefixed variables that duplicate non-prefixed variables.

**Changes:**
Remove these variable patterns:

- `DEFAULT_APP_NAME` → keep `APP_NAME`
- `DEFAULT_PACKAGE_VERSION` → keep `PACKAGE_VERSION`
- `DEFAULT_FRONTEND_PORT` → keep `FRONTEND_PORT`
- `DEFAULT_CORS_*` → keep `CORS_*`
- `DEFAULT_DB_*` → keep `DB_*`
- `DEFAULT_NOTIFICATION_SERVICE_*` → keep `NOTIFICATION_SERVICE_*`
- And 30+ more (see proposal for complete list)

**Files to update (~35 files):**

1. `.env` and `.env.example`
2. All docker-compose files
3. Test files (statex-platform/tests/, statex-ai/tests/, statex-notification-service/tests/)
4. Configuration scripts
5. Documentation files
6. **grep whole project codebase and update in all files with no exception**

**Tracking:** Create `phase1.md` with complete list of removed DEFAULT_ variables

**Testing:** Run full test suite to ensure no references to DEFAULT_ variables remain.

## Phase 2: Service Ports Consolidation (18 services, ~36 variables)

**Goal:** Replace EXTERNAL_PORT/INTERNAL_PORT/PORT variants with single PORT variable per service.

**Changes:**

- Keep: `SERVICE_NAME_PORT` (e.g., `SUBMISSION_SERVICE_PORT=8002`)
- Remove: `SERVICE_NAME_EXTERNAL_PORT`, `SERVICE_NAME_INTERNAL_PORT`

**Files to update (~45 files):**

1. `.env` and `.env.example`
2. All docker-compose files (41 files across all services)
3. `scripts/start-dev-all.sh`
4. `scripts/start-dev-essential.sh`
5. Service-specific configuration files
6. Documentation
7. **grep whole project codebase and update in all files with no exception**

**Services affected:**

- Platform Management (8000)
- API Gateway (8001)
- Submission Service (8002)
- Notification Service (8005)
- User Portal (8006)
- Monitoring Service (8007)
- Logging Service (8008)
- Content Service (8009)
- AI Orchestrator (8010)
- NLP Service (8011)
- ASR Service (8012)
- Document AI (8013)
- Prototype Generator (8014)
- Template Repository (8015)
- Free AI Service (8016)
- AI Workers (8017)
- Dashboard (8020)
- DNS Service (8053)

**Tracking:** Create `phase2.md` with complete list of removed port variables

**Testing:** Start each service individually and verify port binding.

## Phase 3: NEXT_PUBLIC_ Variables Cleanup (~4 variables)

**Goal:** Remove redundant NEXT_PUBLIC_ variables while keeping those needed by frontend.

**Keep both (frontend needs these):**

- `NEXT_PUBLIC_API_URL` and `API_URL`
- `NEXT_PUBLIC_NOTIFICATION_SERVICE_URL` and `NOTIFICATION_SERVICE_URL`
- `NEXT_PUBLIC_NOTIFICATION_SERVICE_API_KEY` and `NOTIFICATION_SERVICE_API_KEY`
- `NEXT_PUBLIC_USER_PORTAL_URL` and `USER_PORTAL_URL`
- `NEXT_PUBLIC_AI_SERVICE_URL` and `AI_SERVICE_URL`
- `NEXT_PUBLIC_BASE_URL` and `BASE_URL`

**Remove (consolidate):**

- `NEXT_PUBLIC_CONTENT_SERVICE_URL` → keep backend `CONTENT_SERVICE_URL` only
- `NEXT_PUBLIC_STORAGE_URL` → keep `NEXT_PUBLIC_CDN_URL` only
- `NEXTAUTH_URL` → keep `NEXT_PUBLIC_SITE_URL` only
- `NEXT_PUBLIC_ADMIN_API_URL` → merge with `AI_ORCHESTRATOR_URL`

**Files to update:**

1. `.env` and `.env.example`
2. `statex-website/frontend/src/config/env.ts`
3. `statex-website/frontend/next.config.js`
4. Frontend component files that reference these variables
5. **grep whole project codebase and update in all files with no exception**

**Tracking:** Create `phase3.md` with complete list of removed NEXT_PUBLIC_ variables

**Testing:** Build frontend and verify all environment variables resolve correctly.

## Phase 4: Service URL Consolidation (~6 variables)

**Goal:** Remove duplicate URL variables pointing to same services.

**Changes:**

- Remove `PLATFORM_URL` → keep `PLATFORM_MANAGEMENT_URL`
- Remove `WEBSITE_SERVICES_URL` → keep `USER_PORTAL_URL`
- Remove `AI_SERVICES_BASE_URL` → keep `AI_ORCHESTRATOR_URL`

**Files to update (~25 files):**

1. `.env` and `.env.example`
2. Service configuration files
3. Docker compose files
4. Scripts that reference these URLs
5. **grep whole project codebase and update in all files with no exception**

**Tracking:** Create `phase4.md` with complete list of removed URL variables

**Testing:** Verify all service-to-service communication works.

## Phase 5: Database/Connection Variables (~3 variables)

**Goal:** Consolidate database and message broker connection strings.

**Changes:**

- Remove `POSTGRES_URL` → keep `DATABASE_URL`
- Remove `BROKER_URL` → keep `RABBITMQ_URL`

**Files to update:**

1. `.env` and `.env.example`
2. Database connection files in all services
3. `statex-website/services/submission-service/database.py`
4. `statex-website/services/submission-service/main.py`
5. Other service database configuration files
6. **grep whole project codebase and update in all files with no exception**

**Tracking:** Create `phase5.md` with complete list of removed database/connection variables

**Testing:**

- Verify PostgreSQL connections work
- Verify RabbitMQ connections work
- Test submission service database operations

## Phase 6: Email Variables (~3 variables)

**Goal:** Consolidate email address variables.

**Changes:**

- Remove `FROM_EMAIL`, `SENDER_EMAIL`, `SMTP_USERNAME` → keep `CONTACT_EMAIL`
- Remove `LETSENCRYPT_EMAIL`, `SSL_EMAIL` → keep `ADMIN_EMAIL`

**Files to update:**

1. `.env` and `.env.example`
2. Email service configurations
3. SSL/certificate configuration files
4. `statex-infrastructure/nginx/` configuration
5. **grep whole project codebase and update in all files with no exception**

**Tracking:** Create `phase6.md` with complete list of removed email variables

**Testing:**

- Test email sending functionality
- Verify SSL certificate generation uses correct email

## Phase 7: Numeric/String Variables (~20 variables)

**Goal:** Remove remaining duplicate numeric and string configuration values.

**Changes:**

- Port consolidation: Remove redundant port variables where services use same port
- Timeout consolidation: Merge similar timeout values
- Path consolidation: Merge identical path variables
- Domain consolidation: Merge host/domain variables

**Files to update:**

1. `.env` and `.env.example`
2. Service configuration files
3. Documentation files
4. **grep whole project codebase and update in all files with no exception**

**Tracking:** Create `phase7.md` with complete list of removed numeric/string variables

**Testing:** Run integration tests for all affected services.

## Validation & Documentation

**After all phases:**

1. **Create consolidated `REMOVED_VARIABLES_SUMMARY.md` with all removed variables from all phases**
2. Run full system test (start all services)
3. Verify all features work:
   - Form submission
   - AI processing
   - Notifications
   - Database operations
   - Email sending
   - SSL/HTTPS
4. Update documentation:
   - `docs/ENVIRONMENT_VARIABLES_REFERENCE.md`
   - Service-specific READMEs
   - Configuration guides
5. Commit changes with detailed commit message
6. Create PR for review

## Rollback Plan

**If issues occur:**

1. Git revert to last working commit
2. Restore `.env` from backup
3. Restart affected services
4. Document issue for analysis

## Risk Mitigation

**High-risk changes:**

- Docker compose port mappings (test each service)
- Database connection strings (backup database first)
- Frontend environment variables (test build process)

**Safety measures:**

- Make changes incrementally (one phase at a time)
- Test after each phase
- Git commit after each successful phase
- Keep backups of all `.env` files

## File Impact Summary

**Total files to modify:** ~80+ files

**Breakdown:**

- Configuration files: 3
- Docker compose files: 41
- Script files: 7
- Frontend files: 3
- Service config files: 10+
- Documentation files: 15+
- Test files: 5+

## Success Criteria

- [ ] All services start successfully
- [ ] No references to removed variables in codebase
- [ ] Frontend builds and runs correctly
- [ ] Database connections work
- [ ] Email sending works
- [ ] All tests pass
- [ ] Documentation updated
- [ ] ~150 variables reduced to ~250 (37% reduction)
- [ ] All removed variables documented in phase tracking files

---

**IMPORTANT:** Do not proceed with implementation until user approves `ENV_VARIABLES_CONSOLIDATION_PROPOSAL.md`.

### To-dos

- [ ] User reviews and approves ENV_VARIABLES_CONSOLIDATION_PROPOSAL.md
- [ ] Create backup of .env files before starting changes
- [ ] Phase 1: Remove DEFAULT_ prefixed variables (40 variables)
- [ ] Create phase1.md with list of all removed DEFAULT_ variables
- [ ] Run test suite to verify no DEFAULT_ references remain
- [ ] Phase 2: Consolidate service port variables (18 services, 36 variables)
- [ ] Create phase2.md with list of all removed port variables
- [ ] Test all services start with new port variables
- [ ] Phase 3: Cleanup NEXT_PUBLIC_ variable duplicates (4 variables)
- [ ] Create phase3.md with list of all removed NEXT_PUBLIC_ variables
- [ ] Build and test frontend with updated environment variables
- [ ] Phase 4: Consolidate service URL variables (6 variables)
- [ ] Create phase4.md with list of all removed URL variables
- [ ] Verify service-to-service communication works
- [ ] Phase 5: Consolidate database/connection variables (3 variables)
- [ ] Create phase5.md with list of all removed database/connection variables
- [ ] Test database and RabbitMQ connections
- [ ] Phase 6: Consolidate email variables (3 variables)
- [ ] Create phase6.md with list of all removed email variables
- [ ] Test email sending and SSL certificate generation
- [ ] Phase 7: Consolidate remaining numeric/string variables (20 variables)
- [ ] Create phase7.md with list of all removed numeric/string variables
- [ ] Run integration tests for all affected services
- [ ] Create consolidated REMOVED_VARIABLES_SUMMARY.md
- [ ] Run full system test with all services
- [ ] Update all documentation to reflect new variable names
- [ ] Commit all changes and create PR for review
