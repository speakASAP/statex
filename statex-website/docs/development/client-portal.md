# Client Portal and User Management System

## 🎯 Overview

The Statex Client Portal provides authenticated users with a comprehensive dashboard to manage their projects, payments, communication, and account settings. Built on our **Fastify** backend with **NextAuth.js** authentication, **PostgreSQL + Prisma** database, and **Next.js 14+** frontend, supporting multiple OAuth providers and providing complete project lifecycle management.

## 🔗 Related Documentation

- [Technology Stack](technology.md) - Complete technology decisions and cost analysis
- [Architecture](architecture.md) - System architecture overview
- [Backend Documentation](backend.md) - Fastify API implementation details
- [Frontend Documentation](frontend.md) - Next.js 14+ UI components and flows
- [Authentication System](../business/terms-of-reference.md) - OAuth 2.0 and SSO requirements
- [EU Compliance](eu-compliance.md) - GDPR and privacy requirements
- [PWA Requirements](pwa-requirements.md) - Progressive Web App features
- [Notification System](notification-system.md) - User communication system
- [CRM System](crm-system.md) - Customer relationship management
- [Testing](testing.md) - Vitest testing framework
- [Monitoring System](monitoring-system.md) - Sentry error tracking
- [Development Plan](../../development-plan.md) - Complete project plan

## 🏗 **System Architecture**

### **Technology Stack Integration**
```typescript
// Client portal with our technology stack
const CLIENT_PORTAL_STACK = {
  backend: 'Fastify (65k req/sec) with TypeScript',
  database: 'PostgreSQL 15+ with Prisma ORM',
  authentication: 'NextAuth.js with OAuth 2.0 providers',
  frontend: 'Next.js 14+ with App Router and TypeScript',
  styling: 'Tailwind CSS with custom design system',
  state_management: 'React Context + Zustand for complex state',
  job_processing: 'BullMQ for background tasks',
  testing: 'Vitest with 10x performance improvement',
  monitoring: 'Sentry for error tracking and performance',
  deployment: 'Vercel for frontend, Railway for backend'
};
```

### **Authentication Architecture**
```typescript
const AUTHENTICATION_SYSTEM = {
  primary_auth: 'NextAuth.js v4+ with OAuth 2.0',
  session_management: 'JWT tokens with secure HTTP-only cookies',
  database_adapter: 'Prisma adapter for PostgreSQL',
  oauth_providers: ['Google', 'Microsoft', 'GitHub', 'LinkedIn', 'Facebook'],
  enterprise_sso: 'Azure AD B2B, Google Workspace SSO',
  mfa_support: '2FA with authenticator apps and SMS',
  security: 'CSRF protection, secure session handling'
};
```

## 🔐 **NextAuth.js Authentication System**

### **OAuth 2.0 Providers Configuration**
```typescript
// lib/auth.ts - NextAuth.js configuration with Fastify backend integration
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import MicrosoftProvider from 'next-auth/providers/azure-ad';
import GitHubProvider from 'next-auth/providers/github';
import LinkedInProvider from 'next-auth/providers/linkedin';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from './prisma';

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  
  providers: [
    // Google OAuth 2.0 (Consumer + Google Workspace)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile',
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    }),
    
    // Microsoft Azure AD OAuth 2.0 (Office 365 + Enterprise)
    MicrosoftProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID,
      authorization: {
        params: {
          scope: 'openid email profile User.Read'
        }
      }
    }),
    
    // GitHub OAuth 2.0 (Developer-focused)
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: {
          scope: 'user:email read:user'
        }
      }
    }),
    
    // LinkedIn OAuth 2.0 (Business professionals)
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'r_emailaddress r_liteprofile'
        }
      }
    }),
    
    // Email/Password (Traditional with Fastify backend validation)
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials');
        }

        try {
          // Validate against Fastify backend
          const response = await fetch(`${process.env.FASTIFY_API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            })
          });

          if (!response.ok) {
            throw new Error('Invalid credentials');
          }

          const user = await response.json();
          
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.avatar
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      }
    })
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      // Persist OAuth provider info and user data
      if (account && user) {
        token.provider = account.provider;
        token.userId = user.id;
        
        // Sync user data with Fastify backend
        await syncUserWithBackend(user, account);
      }
      return token;
    },
    
    async session({ session, token }) {
      // Send user data to client
      if (token && session.user) {
        session.user.id = token.userId as string;
        session.provider = token.provider as string;
      }
      return session;
    },
    
    async signIn({ user, account, profile }) {
      // Enterprise domain validation
      if (user.email) {
        const emailDomain = user.email.split('@')[1];
        const isEnterpriseEmail = await validateEnterpriseEmailDomain(emailDomain);
        
        if (isEnterpriseEmail) {
          // Create organization association for enterprise users
          await createEnterpriseUserAssociation(user, emailDomain);
        }
      }
      
      return true;
    }
  },

  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request'
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  debug: process.env.NODE_ENV === 'development'
};

export default NextAuth(authOptions);
```

## 🗄️ **PostgreSQL Database Schema with Prisma**

### **User Management Tables**
```sql
-- User and authentication tables
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Basic Information
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified TIMESTAMP,
    name VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url VARCHAR(500),
    phone VARCHAR(50),
    
    -- Account Type and Status
    account_type user_account_type_enum DEFAULT 'individual',
    user_role user_role_enum DEFAULT 'client',
    account_status account_status_enum DEFAULT 'active',
    subscription_tier subscription_tier_enum DEFAULT 'free',
    
    -- Profile Information
    company_name VARCHAR(255),
    job_title VARCHAR(100),
    industry VARCHAR(100),
    company_size company_size_enum,
    website VARCHAR(500),
    
    -- Address Information (GDPR compliant)
    address JSONB, -- {street, city, state, postal_code, country}
    timezone VARCHAR(50) DEFAULT 'Europe/Prague',
    language VARCHAR(10) DEFAULT 'en',
    
    -- Authentication Details
    password_hash VARCHAR(255), -- For email/password auth
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    
    -- Business Information
    vat_number VARCHAR(50),
    tax_id VARCHAR(50),
    billing_address JSONB,
    
    -- Preferences and Settings
    notification_preferences JSONB,
    ui_preferences JSONB,
    privacy_settings JSONB,
    
    -- Security and Compliance
    last_login_at TIMESTAMP,
    last_activity_at TIMESTAMP,
    password_changed_at TIMESTAMP,
    terms_accepted_at TIMESTAMP,
    privacy_policy_accepted_at TIMESTAMP,
    marketing_consent BOOLEAN DEFAULT FALSE,
    
    -- OAuth Provider Data
    oauth_providers JSONB, -- Array of connected providers
    
    -- System Fields
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP -- Soft delete for GDPR compliance
);

-- NextAuth.js required tables
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(255) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    provider_account_id VARCHAR(255) NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type VARCHAR(255),
    scope VARCHAR(255),
    id_token TEXT,
    session_state VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(provider, provider_account_id)
);

CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_token VARCHAR(255) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE verification_tokens (
    identifier VARCHAR(255) NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    
    PRIMARY KEY (identifier, token)
);

-- User organizations for enterprise features
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Organization Details
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    domain VARCHAR(255) UNIQUE,
    logo_url VARCHAR(500),
    website VARCHAR(500),
    
    -- Business Information
    industry VARCHAR(100),
    company_size company_size_enum,
    address JSONB,
    vat_number VARCHAR(50),
    
    -- Settings
    sso_enabled BOOLEAN DEFAULT FALSE,
    sso_provider VARCHAR(100),
    sso_config JSONB,
    
    -- Billing
    billing_email VARCHAR(255),
    billing_address JSONB,
    
    -- System Fields
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Relationships
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Member Role and Status
    role organization_role_enum DEFAULT 'member',
    status member_status_enum DEFAULT 'active',
    invited_by UUID REFERENCES users(id),
    
    -- Permissions
    permissions JSONB, -- Custom permissions per member
    
    -- System Fields
    joined_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(organization_id, user_id)
);

-- Enums for user management
CREATE TYPE user_account_type_enum AS ENUM ('individual', 'business', 'enterprise');
CREATE TYPE user_role_enum AS ENUM ('client', 'admin', 'developer', 'manager');
CREATE TYPE account_status_enum AS ENUM ('active', 'inactive', 'suspended', 'deleted');
CREATE TYPE subscription_tier_enum AS ENUM ('free', 'basic', 'pro', 'enterprise');
CREATE TYPE company_size_enum AS ENUM ('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+');
CREATE TYPE organization_role_enum AS ENUM ('owner', 'admin', 'manager', 'member');
CREATE TYPE member_status_enum AS ENUM ('active', 'inactive', 'pending');
```

## 🚀 **Fastify Backend Integration**

### **User Management API Routes**
```typescript
// routes/users/index.ts - Fastify user management routes
import { FastifyPluginAsync } from 'fastify';
import { userService } from '../../services/userService';
import { authPlugin } from '../../plugins/auth';

const userRoutes: FastifyPluginAsync = async (fastify) => {
  await fastify.register(authPlugin);

  // Get current user profile
  fastify.get('/me', {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                name: { type: 'string' },
                avatar: { type: 'string' },
                accountType: { type: 'string' },
                role: { type: 'string' },
                preferences: { type: 'object' }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    const userId = request.user.id;

    try {
      const user = await userService.getUserProfile(userId);
      return { success: true, user };
    } catch (error) {
      fastify.log.error('Failed to get user profile:', error);
      reply.status(500).send({
        success: false,
        error: 'Failed to retrieve user profile'
      });
    }
  });

  // Update user profile
  fastify.put('/me', {
    schema: {
      body: {
        type: 'object',
        properties: {
          name: { type: 'string', maxLength: 255 },
          firstName: { type: 'string', maxLength: 100 },
          lastName: { type: 'string', maxLength: 100 },
          phone: { type: 'string', maxLength: 50 },
          companyName: { type: 'string', maxLength: 255 },
          jobTitle: { type: 'string', maxLength: 100 },
          industry: { type: 'string', maxLength: 100 },
          website: { type: 'string', maxLength: 500 },
          timezone: { type: 'string', maxLength: 50 },
          language: { type: 'string', maxLength: 10 }
        }
      }
    }
  }, async (request, reply) => {
    const userId = request.user.id;
    const updateData = request.body;

    try {
      const updatedUser = await userService.updateUserProfile(userId, updateData);
      return { success: true, user: updatedUser };
    } catch (error) {
      fastify.log.error('Failed to update user profile:', error);
      reply.status(500).send({
        success: false,
        error: 'Failed to update user profile'
      });
    }
  });

  // Get user dashboard data
  fastify.get('/dashboard', {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            dashboard: {
              type: 'object',
              properties: {
                projects: { type: 'array' },
                recentActivity: { type: 'array' },
                notifications: { type: 'array' },
                upcomingTasks: { type: 'array' },
                analytics: { type: 'object' }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    const userId = request.user.id;

    try {
      const dashboardData = await userService.getDashboardData(userId);
      return { success: true, dashboard: dashboardData };
    } catch (error) {
      fastify.log.error('Failed to get dashboard data:', error);
      reply.status(500).send({
        success: false,
        error: 'Failed to retrieve dashboard data'
      });
    }
  });

  // User authentication with credentials
  fastify.post('/auth/login', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8 }
        }
      }
    }
  }, async (request, reply) => {
    const { email, password } = request.body;

    try {
      const result = await userService.authenticateUser(email, password);
      
      if (!result.success) {
        reply.status(401).send({
          success: false,
          error: 'Invalid credentials'
        });
        return;
      }

      return {
        success: true,
        user: result.user,
        token: result.token
      };
    } catch (error) {
      fastify.log.error('Authentication failed:', error);
      reply.status(500).send({
        success: false,
        error: 'Authentication failed'
      });
    }
  });

  // Create user account (registration)
  fastify.post('/auth/register', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password', 'name'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8 },
          name: { type: 'string', maxLength: 255 },
          companyName: { type: 'string', maxLength: 255 },
          accountType: { 
            type: 'string', 
            enum: ['individual', 'business', 'enterprise'] 
          }
        }
      }
    }
  }, async (request, reply) => {
    const userData = request.body;

    try {
      const result = await userService.createUser(userData);
      
      return {
        success: true,
        user: result.user,
        message: 'Account created successfully'
      };
    } catch (error) {
      fastify.log.error('User registration failed:', error);
      reply.status(400).send({
        success: false,
        error: error.message || 'Registration failed'
      });
    }
  });
};

export default userRoutes;
```

## 🎨 **Next.js 14+ Frontend Implementation**

### **User Dashboard Component**
```typescript
// app/dashboard/page.tsx - Next.js 14+ App Router dashboard
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { apiClient } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Bell, User, Settings, CreditCard, FolderOpen } from 'lucide-react';

interface DashboardData {
  projects: Project[];
  recentActivity: Activity[];
  notifications: Notification[];
  upcomingTasks: Task[];
  analytics: Analytics;
}

interface Project {
  id: string;
  name: string;
  status: string;
  progress: number;
  dueDate: string;
  type: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      loadDashboardData();
    }
  }, [session]);

  const loadDashboardData = async () => {
    try {
      const response = await apiClient.get('/api/users/dashboard');
      setDashboardData(response.data.dashboard);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">Please sign in to access your dashboard.</p>
          <Button onClick={() => window.location.href = '/auth/signin'}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell size={20} />
              </Button>
              
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={session.user?.image || ''} />
                  <AvatarFallback>
                    {session.user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-700">
                  {session.user?.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome back, {session.user?.name?.split(' ')[0]}!
          </h2>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your projects today.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData?.projects?.filter(p => p.status === 'active').length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <div className="h-4 w-4 text-green-600">✓</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData?.projects?.filter(p => p.status === 'completed').length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                +5 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notifications</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData?.notifications?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                3 unread messages
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Due This Week</CardTitle>
              <div className="h-4 w-4 text-orange-600">⏰</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData?.upcomingTasks?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                2 urgent tasks
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Projects */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData?.projects?.slice(0, 5).map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{project.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{project.type}</p>
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 mt-1">
                            {project.progress}% complete
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          project.status === 'active' ? 'bg-green-100 text-green-800' :
                          project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData?.recentActivity?.slice(0, 8).map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button className="h-20 flex flex-col items-center justify-center space-y-2">
                  <FolderOpen size={24} />
                  <span>New Project</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <CreditCard size={24} />
                  <span>View Billing</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <User size={24} />
                  <span>Edit Profile</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <Settings size={24} />
                  <span>Settings</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
```

## 🧪 **Vitest Testing Implementation**

### **Authentication and User Service Tests**
```typescript
// __tests__/services/userService.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { userService } from '../../src/services/userService';
import { prisma } from '../../src/lib/prisma';
import bcrypt from 'bcrypt';

vi.mock('../../src/lib/prisma', () => ({
  prisma: {
    users: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      findMany: vi.fn()
    }
  }
}));

vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn()
  }
}));

describe('User Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a new user account', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'John Doe',
      accountType: 'individual'
    };

    const hashedPassword = 'hashed_password';
    const mockUser = {
      id: 'user-id',
      email: userData.email,
      name: userData.name,
      passwordHash: hashedPassword
    };

    vi.mocked(bcrypt.hash).mockResolvedValueOnce(hashedPassword);
    vi.mocked(prisma.users.create).mockResolvedValueOnce(mockUser);

    const result = await userService.createUser(userData);

    expect(result.success).toBe(true);
    expect(result.user.email).toBe(userData.email);
    expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 12);
    expect(prisma.users.create).toHaveBeenCalledTimes(1);
  });

  it('should authenticate user with valid credentials', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const hashedPassword = 'hashed_password';

    const mockUser = {
      id: 'user-id',
      email,
      passwordHash: hashedPassword,
      name: 'John Doe'
    };

    vi.mocked(prisma.users.findUnique).mockResolvedValueOnce(mockUser);
    vi.mocked(bcrypt.compare).mockResolvedValueOnce(true);

    const result = await userService.authenticateUser(email, password);

    expect(result.success).toBe(true);
    expect(result.user.email).toBe(email);
    expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
  });

  it('should reject authentication with invalid credentials', async () => {
    const email = 'test@example.com';
    const password = 'wrongpassword';

    vi.mocked(prisma.users.findUnique).mockResolvedValueOnce(null);

    const result = await userService.authenticateUser(email, password);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid credentials');
  });

  it('should get user dashboard data', async () => {
    const userId = 'user-id';
    const mockDashboardData = {
      projects: [{ id: '1', name: 'Test Project', status: 'active' }],
      recentActivity: [{ description: 'Project created', timestamp: '2024-01-01' }],
      notifications: [],
      upcomingTasks: [],
      analytics: { totalProjects: 1, completedProjects: 0 }
    };

    vi.spyOn(userService, 'getDashboardData').mockResolvedValueOnce(mockDashboardData);

    const result = await userService.getDashboardData(userId);

    expect(result.projects).toHaveLength(1);
    expect(result.projects[0].name).toBe('Test Project');
    expect(result.analytics.totalProjects).toBe(1);
  });
});
```

---

This comprehensive client portal system leverages our **Fastify** backend for high-performance API processing, **NextAuth.js** for secure OAuth 2.0 authentication, **PostgreSQL + Prisma** for robust data management, and **Next.js 14+** for a modern user experience, all tested with **Vitest** for superior performance and monitored with **Sentry** for operational excellence. 