# GDPR-Compliant Analytics and Tracking Setup

## 🔗 Related Documentation
- [AI Agents Ecosystem](../development/ai-agents.md) - Behavioral Analysis and Predictive Analytics agents
- [AI Analytics Optimization](../development/ai-analytics-optimization.md) - AI-powered analytics intelligence

## Content Status: [APPROVED] - 2025-06-27 - Analytics Team

### Meta Information
- Target Keywords: GDPR analytics, European web tracking, privacy compliance
- Content Type: Technical analytics implementation
- Audience: Development team, marketing team, compliance officers

### Overview
**Purpose**: Implement comprehensive analytics while maintaining full GDPR compliance
**Scope**: All website tracking, user behavior analysis, and performance monitoring powered by **AI analytics agents**
**Focus**: European privacy standards and consent management with AI-driven insights

---

# Analytics Implementation Strategy

## GDPR Compliance Framework

### Privacy-First Approach
**Consent Management**: Granular consent for different tracking categories
**Data Minimization**: Collect only necessary data for business purposes
**Transparency**: Clear communication about data collection and use
**User Rights**: Easy access to data export, deletion, and modification

### European Regulatory Requirements
**GDPR Article 6**: Lawful basis for processing personal data
**GDPR Article 7**: Conditions for consent and withdrawal
**Cookie Law**: EU Cookie Directive compliance
**ePrivacy Regulation**: Electronic communications privacy

---

## Consent Management Platform (CMP)

### CMP Implementation
```html
<!-- GDPR-compliant consent banner -->
<div id="consent-banner" class="consent-banner" style="display: none;">
  <div class="consent-content">
    <h3>Privacy & Cookies</h3>
    <p>We use cookies and similar technologies to enhance your experience, analyze site usage, and support our marketing efforts. You can manage your preferences below.</p>
    
    <div class="consent-categories">
      <div class="consent-category">
        <label>
          <input type="checkbox" id="essential-cookies" checked disabled>
          <span class="checkmark"></span>
          <strong>Essential Cookies</strong> - Required for basic site functionality
        </label>
      </div>
      
      <div class="consent-category">
        <label>
          <input type="checkbox" id="analytics-cookies">
          <span class="checkmark"></span>
          <strong>Analytics Cookies</strong> - Help us understand site usage
        </label>
      </div>
      
      <div class="consent-category">
        <label>
          <input type="checkbox" id="marketing-cookies">
          <span class="checkmark"></span>
          <strong>Marketing Cookies</strong> - Personalize ads and content
        </label>
      </div>
    </div>
    
    <div class="consent-buttons">
      <button onclick="acceptAllCookies()" class="btn btn-primary">Accept All</button>
      <button onclick="acceptSelectedCookies()" class="btn btn-secondary">Accept Selected</button>
      <button onclick="rejectOptionalCookies()" class="btn btn-outline">Reject Optional</button>
    </div>
    
    <p class="consent-links">
      <a href="/legal/privacy-policy">Privacy Policy</a> | 
      <a href="/legal/cookie-policy">Cookie Policy</a> | 
      <a href="#" onclick="openConsentSettings()">Manage Preferences</a>
    </p>
  </div>
</div>

<script>
// Consent management functions
function acceptAllCookies() {
  setConsent({
    essential: true,
    analytics: true,
    marketing: true
  });
  hideConsentBanner();
  initializeAnalytics();
}

function acceptSelectedCookies() {
  const consent = {
    essential: true,
    analytics: document.getElementById('analytics-cookies').checked,
    marketing: document.getElementById('marketing-cookies').checked
  };
  setConsent(consent);
  hideConsentBanner();
  if (consent.analytics) initializeAnalytics();
}

function rejectOptionalCookies() {
  setConsent({
    essential: true,
    analytics: false,
    marketing: false
  });
  hideConsentBanner();
}

function setConsent(consent) {
  localStorage.setItem('cookieConsent', JSON.stringify(consent));
  localStorage.setItem('consentTimestamp', new Date().toISOString());
  
  // Update Google Consent Mode
  gtag('consent', 'update', {
    'analytics_storage': consent.analytics ? 'granted' : 'denied',
    'ad_storage': consent.marketing ? 'granted' : 'denied'
  });
}
</script>
```

---

## Google Analytics 4 GDPR Implementation

### GA4 Configuration with Consent Mode
```html
<!-- Google tag (gtag.js) with GDPR compliance -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  
  // Set default consent state
  gtag('consent', 'default', {
    'analytics_storage': 'denied',
    'ad_storage': 'denied',
    'wait_for_update': 500
  });
  
  gtag('js', new Date());
  
  // Configure GA4 with European settings
  gtag('config', 'GA_MEASUREMENT_ID', {
    'anonymize_ip': true,
    'allow_google_signals': false,
    'allow_ad_personalization_signals': false,
    'cookie_expires': 60 * 60 * 24 * 365 * 2, // 2 years
    'cookie_flags': 'SameSite=Secure',
    'custom_map': {
      'custom_parameter_1': 'european_region',
      'custom_parameter_2': 'user_type'
    }
  });
  
  // European-specific tracking setup
  gtag('config', 'GA_MEASUREMENT_ID', {
    'country': 'auto',
    'region': 'auto',
    'city': 'auto'
  });
</script>
```

### Enhanced E-commerce Tracking (GDPR-Compliant)
```javascript
// E-commerce tracking for prototype requests
function trackPrototypeRequest(projectType, estimatedValue) {
  if (hasAnalyticsConsent()) {
    gtag('event', 'prototype_request', {
      'event_category': 'engagement',
      'event_label': projectType,
      'value': estimatedValue,
      'currency': 'EUR',
      'custom_parameter_1': 'european_lead',
      'custom_parameter_2': getAnonymizedRegion()
    });
  }
}

// Service page engagement tracking
function trackServiceInterest(serviceName, engagementType) {
  if (hasAnalyticsConsent()) {
    gtag('event', 'service_interest', {
      'event_category': 'service_engagement',
      'event_label': serviceName,
      'engagement_type': engagementType,
      'custom_parameter_1': 'european_visitor'
    });
  }
}

// Download tracking for resources
function trackResourceDownload(resourceName, resourceType) {
  if (hasAnalyticsConsent()) {
    gtag('event', 'resource_download', {
      'event_category': 'resource_engagement',
      'event_label': resourceName,
      'resource_type': resourceType,
      'custom_parameter_1': 'european_region'
    });
  }
}
```

---

## European User Behavior Tracking

### Privacy-Preserving User Journey Analysis
```javascript
// Anonymous user journey tracking
class EuropeanUserTracker {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.pageViews = [];
    this.interactions = [];
  }
  
  generateSessionId() {
    // Generate anonymous session ID without personal data
    return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }
  
  trackPageView(page, title) {
    if (!hasAnalyticsConsent()) return;
    
    const pageView = {
      page: page,
      title: title,
      timestamp: Date.now(),
      referrer: document.referrer ? this.anonymizeReferrer(document.referrer) : '',
      userAgent: this.anonymizeUserAgent(navigator.userAgent)
    };
    
    this.pageViews.push(pageView);
    
    gtag('event', 'page_view', {
      'page_title': title,
      'page_location': page,
      'custom_parameter_1': 'european_visitor',
      'custom_parameter_2': this.detectUserRegion()
    });
  }
  
  trackInteraction(element, action, value = null) {
    if (!hasAnalyticsConsent()) return;
    
    const interaction = {
      element: element,
      action: action,
      value: value,
      timestamp: Date.now(),
      page: window.location.pathname
    };
    
    this.interactions.push(interaction);
    
    gtag('event', 'user_interaction', {
      'event_category': 'engagement',
      'event_label': element,
      'interaction_type': action,
      'value': value
    });
  }
  
  anonymizeReferrer(referrer) {
    // Remove query parameters and personal identifiers
    try {
      const url = new URL(referrer);
      return url.hostname;
    } catch {
      return 'direct';
    }
  }
  
  anonymizeUserAgent(userAgent) {
    // Extract only browser and OS information, remove specific versions
    const browser = this.detectBrowser(userAgent);
    const os = this.detectOS(userAgent);
    return `${browser}_${os}`;
  }
  
  detectUserRegion() {
    // Use browser language and timezone to estimate region without IP tracking
    const language = navigator.language || navigator.userLanguage;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    const europeanLanguages = ['cs', 'de', 'fr', 'it', 'es', 'pl', 'nl', 'sv', 'da', 'no', 'fi'];
    const isEuropeanLanguage = europeanLanguages.some(lang => language.startsWith(lang));
    const isEuropeanTimezone = timezone.startsWith('Europe/');
    
    if (isEuropeanLanguage && isEuropeanTimezone) {
      return 'european_user';
    } else if (isEuropeanTimezone) {
      return 'european_timezone';
    } else if (isEuropeanLanguage) {
      return 'european_language';
    }
    return 'international_user';
  }
}

// Initialize European-compliant tracking
const userTracker = new EuropeanUserTracker();
```

---

## Performance and Core Web Vitals Tracking

### European Performance Monitoring
```javascript
// GDPR-compliant performance tracking
function initializePerformanceTracking() {
  // Core Web Vitals with European focus
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(metric => sendPerformanceMetric('CLS', metric));
    getFID(metric => sendPerformanceMetric('FID', metric));
    getFCP(metric => sendPerformanceMetric('FCP', metric));
    getLCP(metric => sendPerformanceMetric('LCP', metric));
    getTTFB(metric => sendPerformanceMetric('TTFB', metric));
  });
  
  // European-specific performance metrics
  const europeanMetrics = {
    region: userTracker.detectUserRegion(),
    connectionType: navigator.connection?.effectiveType || 'unknown',
    deviceMemory: navigator.deviceMemory || 'unknown',
    hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
    pageLoadTime: performance.timing?.loadEventEnd - performance.timing?.navigationStart
  };
  
  // Send anonymized performance data
  if (hasAnalyticsConsent()) {
    gtag('event', 'european_performance', {
      'event_category': 'performance',
      'metric_region': europeanMetrics.region,
      'connection_type': europeanMetrics.connectionType,
      'load_time': europeanMetrics.pageLoadTime
    });
  }
}

function sendPerformanceMetric(metricName, metric) {
  if (!hasAnalyticsConsent()) return;
  
  gtag('event', metricName, {
    'event_category': 'Web Vitals',
    'event_label': metricName,
    'value': Math.round(metricName === 'CLS' ? metric.value * 1000 : metric.value),
    'custom_parameter_1': userTracker.detectUserRegion(),
    'custom_parameter_2': 'european_cwv'
  });
}
```

---

## Conversion and Lead Tracking

### GDPR-Compliant Lead Tracking
```javascript
// European lead tracking system
class EuropeanLeadTracker {
  constructor() {
    this.leadSources = [];
    this.touchpoints = [];
  }
  
  trackLeadSource() {
    if (!hasAnalyticsConsent()) return;
    
    const source = {
      referrer: this.getAnonymizedReferrer(),
      utm_source: this.getUTMParameter('utm_source'),
      utm_medium: this.getUTMParameter('utm_medium'),
      utm_campaign: this.getUTMParameter('utm_campaign'),
      landing_page: window.location.pathname,
      timestamp: Date.now(),
      region: userTracker.detectUserRegion()
    };
    
    this.leadSources.push(source);
    
    gtag('event', 'lead_source_tracking', {
      'event_category': 'lead_generation',
      'source_type': source.utm_source || 'organic',
      'landing_page': source.landing_page,
      'custom_parameter_1': source.region
    });
  }
  
  trackPrototypeSubmission(formData) {
    if (!hasAnalyticsConsent()) return;
    
    // Track only non-personal data
    const anonymizedData = {
      project_type: formData.projectType,
      estimated_timeline: formData.timeline,
      budget_range: formData.budgetRange,
      industry: formData.industry,
      company_size: formData.companySize,
      region: userTracker.detectUserRegion(),
      submission_time: Date.now()
    };
    
    gtag('event', 'prototype_submission', {
      'event_category': 'conversion',
      'event_label': 'free_prototype_request',
      'project_type': anonymizedData.project_type,
      'budget_range': anonymizedData.budget_range,
      'industry': anonymizedData.industry,
      'value': this.estimateLeadValue(anonymizedData),
      'currency': 'EUR'
    });
    
    // Enhanced e-commerce conversion
    gtag('event', 'generate_lead', {
      'event_category': 'conversion',
      'value': this.estimateLeadValue(anonymizedData),
      'currency': 'EUR',
      'items': [{
        'item_id': 'prototype_request',
        'item_name': 'Free Prototype Request',
        'item_category': anonymizedData.project_type,
        'item_variant': anonymizedData.industry,
        'quantity': 1,
        'price': this.estimateLeadValue(anonymizedData)
      }]
    });
  }
  
  estimateLeadValue(data) {
    // European market-based lead value estimation
    const baseValues = {
      'web-development': 5000,
      'ai-automation': 8000,
      'system-modernization': 12000,
      'e-commerce': 6000,
      'consulting': 3000,
      'custom-software': 10000
    };
    
    const budgetMultipliers = {
      'under-10k': 0.3,
      '10k-50k': 0.7,
      '50k-100k': 1.0,
      'over-100k': 1.5
    };
    
    const baseValue = baseValues[data.project_type] || 5000;
    const multiplier = budgetMultipliers[data.budget_range] || 0.5;
    
    return Math.round(baseValue * multiplier);
  }
  
  getUTMParameter(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param) || '';
  }
  
  getAnonymizedReferrer() {
    if (!document.referrer) return 'direct';
    
    try {
      const referrerUrl = new URL(document.referrer);
      return referrerUrl.hostname;
    } catch {
      return 'unknown';
    }
  }
}

// Initialize lead tracking
const leadTracker = new EuropeanLeadTracker();

// Track lead source on page load
document.addEventListener('DOMContentLoaded', () => {
  leadTracker.trackLeadSource();
});
```

---

## Data Export and User Rights

### GDPR Data Export Functionality
```javascript
// User data export for GDPR compliance
class GDPRDataManager {
  exportUserData(userIdentifier) {
    // Collect all stored user data
    const userData = {
      consent: this.getConsentData(),
      analytics: this.getAnalyticsData(userIdentifier),
      interactions: this.getUserInteractions(userIdentifier),
      preferences: this.getUserPreferences(userIdentifier),
      exported_at: new Date().toISOString(),
      retention_period: '2 years from last interaction'
    };
    
    return userData;
  }
  
  deleteUserData(userIdentifier) {
    // Remove all user data in compliance with GDPR Article 17
    this.clearConsentData();
    this.clearAnalyticsData(userIdentifier);
    this.clearUserInteractions(userIdentifier);
    this.clearUserPreferences(userIdentifier);
    
    // Send deletion request to third-party services
    this.requestGoogleAnalyticsDeletion(userIdentifier);
    
    return {
      deleted_at: new Date().toISOString(),
      status: 'completed'
    };
  }
  
  getConsentData() {
    return {
      consent_status: JSON.parse(localStorage.getItem('cookieConsent') || '{}'),
      consent_timestamp: localStorage.getItem('consentTimestamp'),
      last_updated: localStorage.getItem('consentLastUpdated')
    };
  }
  
  updateConsent(newConsent) {
    localStorage.setItem('cookieConsent', JSON.stringify(newConsent));
    localStorage.setItem('consentLastUpdated', new Date().toISOString());
    
    // Update Google Consent Mode
    gtag('consent', 'update', {
      'analytics_storage': newConsent.analytics ? 'granted' : 'denied',
      'ad_storage': newConsent.marketing ? 'granted' : 'denied'
    });
  }
}

// Initialize GDPR data manager
const gdprManager = new GDPRDataManager();
```

---

## Analytics Dashboard and Reporting

### European-Focused Analytics Configuration
```javascript
// Custom GA4 dashboard configuration for European business
const europeanAnalyticsConfig = {
  dimensions: [
    'european_region',
    'user_type',
    'service_interest',
    'industry_sector',
    'company_size',
    'project_type'
  ],
  metrics: [
    'prototype_requests',
    'service_inquiries',
    'blog_engagement',
    'lead_quality_score',
    'european_conversion_rate'
  ],
  audiences: [
    'european_business_decision_makers',
    'czech_republic_visitors',
    'german_market_prospects',
    'french_market_prospects',
    'returning_european_visitors'
  ],
  goals: [
    'prototype_request_submission',
    'contact_form_completion',
    'service_page_engagement',
    'blog_subscription',
    'resource_download'
  ]
};

// European business hour analysis
function analyzeEuropeanBusinessHours() {
  const europeanTimezones = [
    'Europe/Prague',
    'Europe/Berlin',
    'Europe/Paris',
    'Europe/London',
    'Europe/Rome',
    'Europe/Madrid',
    'Europe/Stockholm',
    'Europe/Amsterdam'
  ];
  
  const businessHours = {
    start: 9, // 9 AM
    end: 18   // 6 PM
  };
  
  return {
    timezones: europeanTimezones,
    business_hours: businessHours,
    optimal_content_times: ['10:00', '14:00', '16:00'],
    peak_engagement_days: ['Tuesday', 'Wednesday', 'Thursday']
  };
}
```

---

## Compliance Monitoring and Auditing

### GDPR Compliance Checker
```javascript
// Automated GDPR compliance monitoring
class GDPRComplianceMonitor {
  constructor() {
    this.complianceChecks = [];
    this.violations = [];
  }
  
  runComplianceAudit() {
    const audit = {
      timestamp: new Date().toISOString(),
      checks: {
        consent_banner: this.checkConsentBanner(),
        cookie_policy: this.checkCookiePolicy(),
        data_processing: this.checkDataProcessing(),
        user_rights: this.checkUserRights(),
        data_retention: this.checkDataRetention()
      }
    };
    
    this.complianceChecks.push(audit);
    return audit;
  }
  
  checkConsentBanner() {
    const banner = document.getElementById('consent-banner');
    const hasCategories = document.querySelectorAll('.consent-category').length >= 3;
    const hasRejectOption = document.querySelector('[onclick*="reject"]') !== null;
    
    return {
      present: banner !== null,
      categories: hasCategories,
      reject_option: hasRejectOption,
      compliant: banner !== null && hasCategories && hasRejectOption
    };
  }
  
  checkDataProcessing() {
    const consent = JSON.parse(localStorage.getItem('cookieConsent') || '{}');
    const hasValidConsent = Object.keys(consent).length > 0;
    const analyticsEnabled = consent.analytics === true;
    
    return {
      consent_stored: hasValidConsent,
      analytics_consent: analyticsEnabled,
      processing_lawful: hasValidConsent,
      compliant: hasValidConsent
    };
  }
  
  generateComplianceReport() {
    const latestAudit = this.complianceChecks[this.complianceChecks.length - 1];
    
    return {
      audit_date: latestAudit.timestamp,
      overall_compliance: this.calculateOverallCompliance(latestAudit),
      recommendations: this.generateRecommendations(latestAudit),
      next_audit_due: this.calculateNextAuditDate()
    };
  }
}

// Initialize compliance monitoring
const complianceMonitor = new GDPRComplianceMonitor();

// Run compliance check monthly
setInterval(() => {
  complianceMonitor.runComplianceAudit();
}, 30 * 24 * 60 * 60 * 1000); // 30 days
```

---

*This comprehensive analytics setup ensures full GDPR compliance while providing valuable insights for European business optimization and user experience enhancement.*

**Document Version**: 1.0
**Compliance Standard**: GDPR Articles 6, 7, 13, 14, 17, 20
**Implementation Priority**: Privacy first, analytics second
**Review Schedule**: Monthly compliance audits and quarterly privacy assessments

---
*Updated as part of Phase 9, Steps 74-76: GDPR-Compliant Analytics and Tracking Setup*
