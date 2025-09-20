# PROTOTYPE URL ACCESSIBILITY FIX PLAN

## **Phase 1: Immediate Fixes (Priority: HIGH)**

### **1.1 Create Prototypes Directory Structure**
- **File**: `statex-website/frontend/public/prototypes/`
- **Action**: Create the missing directory structure
- **Implementation**:
  ```bash
  mkdir -p statex-website/frontend/public/prototypes
  touch statex-website/frontend/public/prototypes/.gitkeep
  ```

### **1.2 Fix Prototype Page Error Handling**
- **File**: `statex-website/frontend/src/app/prototypes/[projectId]/page.tsx`
- **Action**: Add graceful error handling for missing prototypes
- **Implementation**:
  - Check if prototype file exists before reading
  - Display "Prototype not found" message instead of crashing
  - Add fallback to prototype service API call
  - Show loading state while checking

### **1.3 Update Prototype URLs to Use Working Service**
- **File**: `statex-website/frontend/src/components/forms/ProcessingFeedback.tsx`
- **File**: `statex-website/frontend/src/components/sections/FormSection.tsx`
- **Action**: Change prototype URLs to use the working prototype service
- **Implementation**:
  - Change from `http://project-proto_${projectId}.localhost:3000` 
  - To `http://localhost:8003/prototype/${projectId}`
  - Update all prototype-related URLs (view, plan, offer)

## **Phase 2: Prototype Generation System Fix (Priority: HIGH)**

### **2.1 Diagnose AI Orchestrator Integration**
- **File**: `statex-ai/services/ai-orchestrator/workflows/prototype_workflow.py`
- **Action**: Check if prototype generation is being triggered
- **Implementation**:
  - Verify prototype workflow is called from form submission
  - Check if prototype generation jobs are being queued
  - Ensure proper error handling and logging

### **2.2 Fix Prototype Service Integration**
- **File**: `statex-ai/services/prototype-generator/`
- **Action**: Ensure prototype service is properly integrated
- **Implementation**:
  - Check if prototype generator service is running
  - Verify API endpoints are working
  - Test prototype generation manually

### **2.3 Update Form Submission to Trigger Prototype Generation**
- **File**: `statex-website/frontend/src/components/sections/FormSection.tsx`
- **Action**: Ensure form submission triggers prototype generation
- **Implementation**:
  - Add prototype generation call after AI analysis
  - Pass prototype ID to processing feedback
  - Handle prototype generation errors

## **Phase 3: Subdomain Routing Implementation (Priority: MEDIUM)**

### **3.1 Implement Development Subdomain Routing**
- **File**: `statex-website/frontend/next.config.js`
- **Action**: Add subdomain routing for development
- **Implementation**:
  - Add middleware to handle subdomain requests
  - Route `project-proto_*.localhost` to prototype service
  - Add fallback to main site

### **3.2 Create Subdomain Handler**
- **File**: `statex-website/frontend/src/middleware.ts`
- **Action**: Handle subdomain routing in Next.js
- **Implementation**:
  - Detect subdomain pattern
  - Extract prototype ID
  - Proxy to prototype service or show prototype page

## **Phase 4: Error Handling and User Experience (Priority: MEDIUM)**

### **4.1 Add Prototype Status Checking**
- **File**: `statex-website/frontend/src/services/prototypeService.ts`
- **Action**: Create service to check prototype status
- **Implementation**:
  - Check if prototype exists
  - Get prototype generation status
  - Handle different states (generating, completed, failed)

### **4.2 Update Processing Feedback to Show Prototype Status**
- **File**: `statex-website/frontend/src/components/forms/ProcessingFeedback.tsx`
- **Action**: Show prototype generation progress
- **Implementation**:
  - Add prototype generation step
  - Show progress for prototype creation
  - Display prototype links when ready

### **4.3 Add Prototype Not Found Page**
- **File**: `statex-website/frontend/src/app/prototypes/[projectId]/not-found.tsx`
- **Action**: Create proper 404 page for missing prototypes
- **Implementation**:
  - Show "Prototype not found" message
  - Provide contact information
  - Add retry option

## **Phase 5: Testing and Validation (Priority: HIGH)**

### **5.1 Test Prototype Generation End-to-End**
- **Action**: Verify complete prototype generation workflow
- **Implementation**:
  - Submit form with test data
  - Verify AI analysis completes
  - Check prototype generation starts
  - Confirm prototype is accessible

### **5.2 Test All Prototype URL Patterns**
- **Action**: Verify all URL patterns work correctly
- **Implementation**:
  - Test subdomain URLs: `http://project-proto_*.localhost:3000`
  - Test fallback URLs: `http://localhost:3000/prototypes/*`
  - Test direct service URLs: `http://localhost:8003/prototype/*`

### **5.3 Test Error Scenarios**
- **Action**: Verify error handling works correctly
- **Implementation**:
  - Test with non-existent prototype IDs
  - Test with malformed prototype IDs
  - Test with prototype generation failures

## **IMPLEMENTATION CHECKLIST**

### **Phase 1: Immediate Fixes**
1. [ ] Create prototypes directory structure
2. [ ] Fix prototype page error handling
3. [ ] Update prototype URLs to use working service
4. [ ] Test prototype page with missing prototype
5. [ ] Verify prototype URLs work with service

### **Phase 2: Prototype Generation System Fix**
6. [ ] Diagnose AI orchestrator integration
7. [ ] Fix prototype service integration
8. [ ] Update form submission to trigger prototype generation
9. [ ] Test prototype generation workflow
10. [ ] Verify prototypes are created and stored

### **Phase 3: Subdomain Routing Implementation**
11. [ ] Implement development subdomain routing
12. [ ] Create subdomain handler middleware
13. [ ] Test subdomain URL patterns
14. [ ] Add fallback to main site
15. [ ] Verify subdomain routing works

### **Phase 4: Error Handling and User Experience**
16. [ ] Add prototype status checking service
17. [ ] Update processing feedback to show prototype status
18. [ ] Add prototype not found page
19. [ ] Test error scenarios
20. [ ] Verify user experience improvements

### **Phase 5: Testing and Validation**
21. [ ] Test prototype generation end-to-end
22. [ ] Test all prototype URL patterns
23. [ ] Test error scenarios
24. [ ] Verify complete workflow
25. [ ] Document working URL patterns

## **SUCCESS CRITERIA**

- ✅ Prototype URLs are accessible and working
- ✅ Prototype generation system creates prototypes
- ✅ All URL patterns work (subdomain, fallback, direct service)
- ✅ Error handling is graceful and user-friendly
- ✅ Complete end-to-end workflow functions
- ✅ Processing feedback shows prototype status
- ✅ Users can access generated prototypes

## **ESTIMATED TIMELINE**

- **Phase 1**: 2-3 hours (Immediate fixes)
- **Phase 2**: 4-6 hours (Prototype generation system)
- **Phase 3**: 3-4 hours (Subdomain routing)
- **Phase 4**: 2-3 hours (Error handling)
- **Phase 5**: 2-3 hours (Testing and validation)

**Total Estimated Time**: 13-19 hours
