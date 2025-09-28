# CRM System Documentation

## 🎯 Overview

The Statex CRM (Customer Relationship Management) system is a comprehensive platform for managing all customer interactions, tracking leads, monitoring project pipelines, and automating customer communication workflows. Built with **Fastify** backend, **Next.js 14+** frontend, **PostgreSQL + Prisma** database, and **BullMQ** job processing for automated workflows. The system is powered by **AI agents** including **Sales Intelligence Agent** for lead qualification and **Customer Success Agent** for retention optimization.

## 🔗 Related Documentation

- [AI Agents Ecosystem](ai-agents.md) - Sales Intelligence and Customer Success agents
- [AI Implementation Master Plan](ai-implementation-master-plan.md) - Overall AI strategy
- [Technology Stack](technology.md) - Complete technology decisions and cost analysis
- [Architecture](architecture.md) - System architecture overview
- [Backend Documentation](backend.md) - Fastify implementation details
- [Frontend Documentation](frontend.md) - Next.js 14+ implementation details
- [Client Portal](client-portal.md) - User management and authentication
- [Notification System](notification-system.md) - Multi-channel communication delivery
- [AI Chat Implementation](ai-chat-system.md) - AI conversation handling
- [Email Systems](email-system.md) - Amazon SES integration and email processing
- [Social Media Integration](social-media-integration.md) - Social platform connectivity
- [Testing](testing.md) - Vitest testing strategies
- [Business Requirements](../business/terms-of-reference.md) - Business goals and CRM targets

## 🏗 CRM Architecture

### Core CRM Components
```typescript
const CRM_COMPONENTS = {
  contact_management: {
    leads: 'Prospect tracking and qualification',
    customers: 'Active customer relationship management',
    companies: 'Organization and company profiles',
    contacts: 'Individual contact information and history'
  },
  
  sales_pipeline: {
    opportunities: 'Sales opportunity tracking',
    stages: 'Pipeline stage management',
    forecasting: 'Revenue forecasting and predictions',
    conversions: 'Lead-to-customer conversion tracking'
  },
  
  communication_hub: {
    email_integration: 'Email conversation tracking',
    social_media: 'Social platform interaction monitoring',
    chat_history: 'AI chat conversation archives',
    call_logs: 'Phone conversation records'
  },
  
  automation_engine: {
    workflow_automation: 'Automated follow-up sequences',
    ai_insights: 'AI-powered customer analysis',
    scoring: 'Lead scoring and prioritization',
    notifications: 'Automated alert system'
  },
  
  analytics_reporting: {
    performance_metrics: 'Sales and marketing KPIs',
    customer_analytics: 'Customer behavior analysis',
    roi_tracking: 'Marketing campaign ROI',
    custom_reports: 'Customizable reporting dashboard'
  }
};
```

### CRM Database Schema
```sql
-- CRM Core Tables
CREATE TABLE crm_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Basic Information
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    company_name VARCHAR(255),
    job_title VARCHAR(100),
    
    -- Contact Details
    linkedin_url VARCHAR(500),
    website VARCHAR(500),
    address JSONB,
    timezone VARCHAR(50),
    language VARCHAR(10) DEFAULT 'en',
    
    -- CRM Classification
    contact_type contact_type_enum DEFAULT 'LEAD',
    lead_source VARCHAR(100),
    lead_score INTEGER DEFAULT 0,
    customer_status customer_status_enum DEFAULT 'PROSPECT',
    
    -- Engagement Tracking
    first_contact_date TIMESTAMP,
    last_contact_date TIMESTAMP,
    total_interactions INTEGER DEFAULT 0,
    email_opens INTEGER DEFAULT 0,
    email_clicks INTEGER DEFAULT 0,
    
    -- Financial Information
    estimated_value DECIMAL(10,2),
    lifetime_value DECIMAL(10,2) DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0,
    
    -- AI Analysis
    ai_summary TEXT,
    ai_score INTEGER, -- AI-calculated prospect score
    ai_recommendations JSONB,
    
    -- System Fields
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    assigned_to UUID REFERENCES users(id)
);

CREATE TABLE crm_companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Company Information
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255),
    industry VARCHAR(100),
    company_size company_size_enum,
    annual_revenue DECIMAL(15,2),
    
    -- Contact Details
    website VARCHAR(500),
    linkedin_url VARCHAR(500),
    address JSONB,
    phone VARCHAR(50),
    
    -- Business Information
    description TEXT,
    technologies_used JSONB,
    pain_points JSONB,
    business_model VARCHAR(100),
    
    -- CRM Data
    customer_status customer_status_enum DEFAULT 'PROSPECT',
    lead_score INTEGER DEFAULT 0,
    total_contacts INTEGER DEFAULT 0,
    total_value DECIMAL(15,2) DEFAULT 0,
    
    -- AI Analysis
    ai_research_data JSONB,
    ai_company_score INTEGER,
    market_analysis JSONB,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE crm_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Opportunity Details
    title VARCHAR(255) NOT NULL,
    description TEXT,
    value DECIMAL(10,2) NOT NULL,
    probability INTEGER DEFAULT 0, -- 0-100%
    expected_close_date DATE,
    
    -- Relationships
    contact_id UUID REFERENCES crm_contacts(id),
    company_id UUID REFERENCES crm_companies(id),
    project_id UUID REFERENCES projects(id),
    
    -- Pipeline Management
    stage opportunity_stage_enum DEFAULT 'INITIAL_CONTACT',
    source VARCHAR(100),
    category VARCHAR(100),
    priority priority_enum DEFAULT 'MEDIUM',
    
    -- Tracking
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    closed_at TIMESTAMP,
    assigned_to UUID REFERENCES users(id)
);

CREATE TABLE crm_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Interaction Details
    type interaction_type_enum NOT NULL,
    channel communication_channel_enum NOT NULL,
    subject VARCHAR(255),
    content TEXT,
    direction interaction_direction_enum NOT NULL,
    
    -- Relationships
    contact_id UUID REFERENCES crm_contacts(id),
    company_id UUID REFERENCES crm_companies(id),
    opportunity_id UUID REFERENCES crm_opportunities(id),
    
    -- Metadata
    external_id VARCHAR(255), -- Email ID, Social post ID, etc.
    platform_data JSONB,
    ai_analysis JSONB,
    sentiment_score DECIMAL(3,2), -- -1.0 to 1.0
    
    -- System Fields
    interaction_date TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    processed_by_ai BOOLEAN DEFAULT FALSE
);

CREATE TABLE contact_communication_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Contact Relationship
    contact_id UUID REFERENCES crm_contacts(id) UNIQUE,
    
    -- Channel Priority Settings (User-Defined Order)
    channel_priorities JSONB NOT NULL, -- Example: [{"channel": "email", "priority": 1}, {"channel": "telegram", "priority": 2}, {"channel": "whatsapp", "priority": 3}, {"channel": "linkedin", "priority": 4}]
    
    -- Contact Method Details
    email_address VARCHAR(255),
    phone_number VARCHAR(50),
    whatsapp_number VARCHAR(50),
    telegram_username VARCHAR(100),
    linkedin_profile VARCHAR(255),
    
    -- Availability Preferences
    preferred_contact_hours JSONB, -- {"start": "09:00", "end": "18:00", "timezone": "Europe/Prague"}
    quiet_hours JSONB, -- {"start": "22:00", "end": "08:00"}
    weekend_contact BOOLEAN DEFAULT FALSE,
    
    -- Communication Preferences
    marketing_consent BOOLEAN DEFAULT FALSE,
    sales_contact_consent BOOLEAN DEFAULT TRUE,
    urgent_notifications BOOLEAN DEFAULT TRUE,
    
    -- Preference Learning
    response_patterns JSONB, -- Track which channels get best response rates
    last_successful_channel VARCHAR(50),
    channel_effectiveness_scores JSONB,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Enums
CREATE TYPE contact_type_enum AS ENUM ('LEAD', 'PROSPECT', 'CUSTOMER', 'PARTNER', 'VENDOR');
CREATE TYPE customer_status_enum AS ENUM ('PROSPECT', 'QUALIFIED', 'CUSTOMER', 'CHURNED', 'BLACKLISTED');
CREATE TYPE company_size_enum AS ENUM ('STARTUP', 'SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE');
CREATE TYPE opportunity_stage_enum AS ENUM ('INITIAL_CONTACT', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST');
CREATE TYPE interaction_type_enum AS ENUM ('EMAIL', 'CALL', 'MEETING', 'CHAT', 'SOCIAL_MEDIA', 'FORM_SUBMISSION', 'WEBSITE_VISIT');
CREATE TYPE communication_channel_enum AS ENUM ('EMAIL', 'PHONE', 'WHATSAPP', 'TELEGRAM', 'LINKEDIN', 'FACEBOOK', 'TWITTER', 'CHAT', 'FORM');
CREATE TYPE interaction_direction_enum AS ENUM ('INBOUND', 'OUTBOUND');
```

## 📊 CRM Features and Functionality

### Lead Management System
```typescript
const LEAD_MANAGEMENT = {
  lead_capture: {
    website_forms: 'Automatic lead capture from contact forms',
    social_media: 'Social media interaction tracking',
    email_campaigns: 'Email marketing lead generation',
    referrals: 'Referral tracking and management',
    paid_advertising: 'Ad campaign lead attribution'
  },
  
  lead_qualification: {
    scoring_algorithm: 'AI-powered lead scoring (0-100)',
    qualification_criteria: 'BANT (Budget, Authority, Need, Timeline)',
    demographic_scoring: 'Company size, industry, location',
    behavioral_scoring: 'Website visits, email engagement, content downloads',
    ai_qualification: 'AI analysis of communication content'
  },
  
  lead_nurturing: {
    email_sequences: 'Automated drip campaigns',
    content_delivery: 'Personalized content recommendations',
    follow_up_automation: 'Scheduled follow-up reminders',
    scoring_triggers: 'Actions based on score changes'
  }
};
```

### Customer Journey Tracking
```typescript
const CUSTOMER_JOURNEY = {
  awareness_stage: {
    tracking: ['website_visits', 'blog_reads', 'social_media_engagement'],
    content: 'Educational content and thought leadership',
    metrics: 'Page views, time on site, content engagement'
  },
  
  consideration_stage: {
    tracking: ['demo_requests', 'pricing_page_visits', 'case_study_downloads'],
    content: 'Product demos, case studies, comparison guides',
    metrics: 'Demo requests, content downloads, email engagement'
  },
  
  decision_stage: {
    tracking: ['proposal_requests', 'pricing_discussions', 'technical_calls'],
    content: 'Proposals, custom demos, implementation plans',
    metrics: 'Proposal responses, negotiation progress, close rate'
  },
  
  customer_stage: {
    tracking: ['project_progress', 'support_tickets', 'upsell_opportunities'],
    content: 'Project updates, success stories, expansion opportunities',
    metrics: 'Project completion, satisfaction scores, expansion revenue'
  }
};
```

## 🤖 AI-Powered CRM Features

### AI Customer Analysis
```typescript
const AI_CRM_FEATURES = {
  contact_enrichment: {
    company_research: 'Automatic company information gathering',
    social_profiling: 'LinkedIn and social media data collection',
    technology_stack: 'Identify technologies used by prospect',
    news_monitoring: 'Track company news and events',
    financial_analysis: 'Company financial health assessment'
  },
  
  sentiment_analysis: {
    email_sentiment: 'Analyze email tone and sentiment',
    social_sentiment: 'Monitor social media sentiment',
    conversation_analysis: 'Chat and call sentiment tracking',
    trend_identification: 'Identify sentiment trends over time'
  },
  
  predictive_analytics: {
    close_probability: 'Predict likelihood of deal closure',
    churn_prediction: 'Identify customers at risk of churning',
    upsell_opportunities: 'Identify expansion opportunities',
    optimal_contact_time: 'Predict best times to contact prospects'
  },
  
  automated_insights: {
    opportunity_alerts: 'Alert sales team of hot opportunities',
    engagement_recommendations: 'Suggest next best actions',
    content_recommendations: 'Recommend relevant content for contacts',
    meeting_preparation: 'Generate meeting briefs and talking points'
  }
};
```

### AI Research Integration
```typescript
const AI_RESEARCH_SYSTEM = {
  prospect_research: {
    company_analysis: {
      business_model: 'Analyze company business model and revenue streams',
      market_position: 'Assess competitive position and market share',
      growth_stage: 'Identify company growth stage and funding status',
      technology_needs: 'Identify potential technology pain points'
    },
    
    decision_maker_profiling: {
      role_analysis: 'Understand decision maker role and influence',
      communication_style: 'Adapt communication to individual preferences',
      interests_hobbies: 'Personal interest research for relationship building',
      professional_background: 'Career history and expertise analysis'
    },
    
    timing_analysis: {
      budget_cycles: 'Identify company budget and planning cycles',
      project_timelines: 'Research ongoing projects and initiatives',
      market_events: 'Track industry events affecting timing',
      competitive_activities: 'Monitor competitor actions affecting urgency'
    }
  },
  
  research_sources: {
    public_data: ['company_websites', 'linkedin_profiles', 'press_releases', 'financial_reports'],
    social_media: ['linkedin_posts', 'twitter_activity', 'company_updates'],
    news_sources: ['industry_publications', 'business_news', 'company_announcements'],
    technical_sources: ['technology_stack_analysis', 'job_postings', 'github_activity']
  }
};
```

## 📈 Sales Pipeline Management

### Pipeline Stages and Automation
```typescript
const SALES_PIPELINE = {
  pipeline_stages: {
    initial_contact: {
      criteria: 'First meaningful interaction with prospect',
      activities: ['initial_outreach', 'response_tracking', 'basic_qualification'],
      automation: 'Auto-advance on response, schedule follow-up',
      duration: '1-3 days'
    },
    
    qualified_lead: {
      criteria: 'BANT qualified and showing genuine interest',
      activities: ['needs_assessment', 'solution_presentation', 'demo_scheduling'],
      automation: 'Demo booking automation, proposal templates',
      duration: '3-7 days'
    },
    
    proposal_submitted: {
      criteria: 'Formal proposal or quote sent',
      activities: ['proposal_follow_up', 'objection_handling', 'negotiation'],
      automation: 'Follow-up sequences, proposal tracking',
      duration: '7-14 days'
    },
    
    negotiation: {
      criteria: 'Active discussion of terms and pricing',
      activities: ['contract_review', 'final_adjustments', 'approval_processes'],
      automation: 'Contract generation, approval workflows',
      duration: '3-10 days'
    },
    
    closed_won: {
      criteria: 'Contract signed and project initiated',
      activities: ['onboarding', 'project_kickoff', 'success_metrics_setup'],
      automation: 'Onboarding sequences, project creation',
      duration: 'Ongoing'
    }
  },
  
  automation_rules: {
    stage_advancement: 'Automatic progression based on activities',
    stale_deal_alerts: 'Notify when deals stagnate',
    probability_updates: 'AI-driven probability adjustments',
    activity_reminders: 'Scheduled task and follow-up reminders'
  }
};
```

## 📞 Communication Integration

### Omnichannel Communication Tracking
```typescript
const COMMUNICATION_INTEGRATION = {
  email_integration: {
    tracking: 'Email open, click, and response tracking',
    templates: 'Personalized email template library',
    sequences: 'Automated email nurturing sequences',
    ai_composition: 'AI-assisted email writing and optimization'
  },
  
  social_media_integration: {
    linkedin: 'LinkedIn message and connection tracking',
    facebook: 'Facebook message and comment monitoring',
    twitter: 'Twitter mention and DM tracking',
    instagram: 'Instagram comment and DM monitoring'
  },
  
  messaging_platforms: {
    whatsapp: 'WhatsApp Business API integration',
    telegram: 'Telegram bot interaction tracking',
    viber: 'Viber Business message monitoring',
    messenger: 'Facebook Messenger integration'
  },
  
  unified_inbox: {
    message_aggregation: 'All communications in single interface',
    response_management: 'Unified response and follow-up system',
    ai_prioritization: 'AI-powered message prioritization',
    auto_routing: 'Automatic routing to appropriate team members'
  }
};
```

## 📊 Analytics and Reporting

### CRM Analytics Dashboard
```typescript
const CRM_ANALYTICS = {
  sales_metrics: {
    pipeline_velocity: 'Average time through sales stages',
    conversion_rates: 'Stage-to-stage conversion percentages',
    deal_size_trends: 'Average deal size by time period',
    win_loss_analysis: 'Reasons for won/lost opportunities'
  },
  
  marketing_metrics: {
    lead_generation: 'Leads by source and campaign',
    cost_per_lead: 'Marketing cost efficiency metrics',
    lead_quality: 'Lead score distribution and conversion',
    campaign_roi: 'Return on investment by campaign'
  },
  
  customer_metrics: {
    lifetime_value: 'Customer lifetime value calculations',
    churn_analysis: 'Customer retention and churn rates',
    satisfaction_scores: 'Customer satisfaction tracking',
    expansion_revenue: 'Upsell and cross-sell performance'
  },
  
  team_performance: {
    individual_metrics: 'Sales rep performance tracking',
    activity_levels: 'Communication and activity volumes',
    quota_attainment: 'Sales target achievement',
    coaching_insights: 'Performance improvement recommendations'
  }
};
```

## 🔄 CRM Workflow Automation

### Automated Workflows
```typescript
const CRM_WORKFLOWS = {
  lead_workflows: {
    new_lead_assignment: {
      trigger: 'New lead creation',
      actions: ['assign_to_rep', 'send_welcome_email', 'schedule_follow_up'],
      conditions: 'Based on lead source, geography, or industry'
    },
    
    lead_scoring_updates: {
      trigger: 'Score threshold reached',
      actions: ['notify_sales_rep', 'advance_stage', 'schedule_call'],
      conditions: 'Score increases above qualification threshold'
    }
  },
  
  opportunity_workflows: {
    stale_opportunity_alerts: {
      trigger: 'No activity for specified time',
      actions: ['send_reminder', 'suggest_activities', 'escalate_if_needed'],
      conditions: 'Based on opportunity stage and value'
    },
    
    proposal_follow_up: {
      trigger: 'Proposal sent',
      actions: ['schedule_follow_up_sequence', 'track_engagement', 'reminder_notifications'],
      conditions: 'Automated sequence with intelligent timing'
    }
  },
  
  customer_workflows: {
    onboarding_sequence: {
      trigger: 'Deal closed won',
      actions: ['create_project', 'assign_team', 'send_welcome_package'],
      conditions: 'Based on project type and customer tier'
    },
    
    retention_workflows: {
      trigger: 'Churn risk indicators',
      actions: ['alert_account_manager', 'schedule_check_in', 'offer_support'],
      conditions: 'AI-identified churn risk factors'
    }
  }
};
```

## 🔌 API and Integration Architecture

### CRM API Endpoints
```typescript
const CRM_API_ENDPOINTS = {
  contacts: {
    'GET /api/crm/contacts': 'List contacts with filtering and pagination',
    'POST /api/crm/contacts': 'Create new contact',
    'GET /api/crm/contacts/:id': 'Get contact details',
    'PUT /api/crm/contacts/:id': 'Update contact information',
    'DELETE /api/crm/contacts/:id': 'Archive/delete contact',
    'POST /api/crm/contacts/:id/enrich': 'Trigger AI enrichment',
    'GET /api/crm/contacts/:id/interactions': 'Get contact interaction history'
  },
  
  opportunities: {
    'GET /api/crm/opportunities': 'List opportunities with pipeline view',
    'POST /api/crm/opportunities': 'Create new opportunity',
    'PUT /api/crm/opportunities/:id/stage': 'Update opportunity stage',
    'GET /api/crm/opportunities/:id/forecast': 'Get AI forecast data',
    'POST /api/crm/opportunities/:id/activities': 'Log opportunity activity'
  },
  
  interactions: {
    'POST /api/crm/interactions': 'Record new interaction',
    'GET /api/crm/interactions': 'Get interaction history',
    'PUT /api/crm/interactions/:id/ai-analyze': 'Trigger AI analysis',
    'GET /api/crm/analytics/interactions': 'Interaction analytics'
  },
  
  automation: {
    'GET /api/crm/workflows': 'List active workflows',
    'POST /api/crm/workflows/trigger': 'Manually trigger workflow',
    'GET /api/crm/tasks': 'Get automated tasks and reminders',
    'PUT /api/crm/tasks/:id': 'Update task status'
  }
};
```

## 🎯 CRM Success Metrics

### Key Performance Indicators
```typescript
const CRM_SUCCESS_METRICS = {
  sales_effectiveness: {
    pipeline_conversion: 'Overall lead-to-customer conversion rate',
    sales_cycle_length: 'Average time from lead to close',
    deal_size_growth: 'Increasing average deal values',
    forecast_accuracy: 'Accuracy of sales forecasting'
  },
  
  customer_satisfaction: {
    net_promoter_score: 'Customer advocacy measurement',
    customer_retention: 'Percentage of customers retained',
    expansion_revenue: 'Additional revenue from existing customers',
    support_resolution: 'Speed and quality of issue resolution'
  },
  
  operational_efficiency: {
    data_quality: 'Completeness and accuracy of CRM data',
    user_adoption: 'Team usage and engagement with CRM',
    automation_effectiveness: 'Time saved through automation',
    roi_measurement: 'Return on CRM investment'
  }
};
```

---

This comprehensive CRM system serves as the central hub for all customer relationships, integrating seamlessly with all communication channels and providing AI-powered insights to optimize sales and marketing effectiveness for Statex. 