#!/usr/bin/env node

/**
 * AI Routes Coverage Validation
 * 
 * Validates that every translated page has a corresponding AI version:
 * - Human: /cs/services/digital-transformation
 * - AI: /ai/services/digital-transformation?lang=cs
 * - Human: /de/blog/gdpr-compliant-analytics  
 * - AI: /ai/blog/gdpr-compliant-analytics?lang=de
 */

const fs = require('fs');
const path = require('path');

const LANGUAGES = ['en', 'cs', 'de', 'fr'];
const CONTENT_TYPES = ['services', 'solutions', 'legal'];
const BASE_PAGES = ['home', 'about', 'contact'];

class AIRouteValidator {
  constructor() {
    this.results = {
      missing: [],
      existing: [],
      coverage: {}
    };
  }

  async validateAIRoutes() {
    console.log('🤖 Validating AI Route Coverage...\n');

    // Check AI routes for content types
    await this.validateContentTypeAIRoutes();
    
    // Check AI routes for blog posts
    await this.validateBlogAIRoutes();
    
    // Check AI routes for base pages
    await this.validateBasePageAIRoutes();
    
    this.generateCoverageReport();
  }

  async validateContentTypeAIRoutes() {
    console.log('📋 Checking Content Type AI Routes...');

    const routeMapping = {
      'services': 'service',
      'solutions': 'solution', 
      'legal': 'legal'
    };

    for (const contentType of CONTENT_TYPES) {
      const routeParam = routeMapping[contentType];
      const aiRoutePath = path.join(process.cwd(), 'src/app/ai', contentType, `[${routeParam}]`, 'route.ts');
      
      if (fs.existsSync(aiRoutePath)) {
        this.results.existing.push(`AI route exists: /ai/${contentType}/[${routeParam}]`);
        console.log(`  ✅ /ai/${contentType}/[${routeParam}] - EXISTS`);
      } else {
        this.results.missing.push(`AI route missing: /ai/${contentType}/[${routeParam}]`);
        console.log(`  ❌ /ai/${contentType}/[${routeParam}] - MISSING`);
      }
    }
  }

  async validateBlogAIRoutes() {
    console.log('\n📝 Checking Blog AI Routes...');

    // Check for blog AI route
    const blogAIRoutePath = path.join(process.cwd(), 'src/app/ai/blog/[id]/route.ts');
    const blogAIPagePath = path.join(process.cwd(), 'src/app/ai/blog/[id]/page.tsx');
    
    if (fs.existsSync(blogAIRoutePath)) {
      this.results.existing.push('AI route exists: /ai/blog/[id]');
      console.log('  ✅ /ai/blog/[id]/route.ts - EXISTS');
    } else if (fs.existsSync(blogAIPagePath)) {
      this.results.existing.push('AI page exists: /ai/blog/[id]');
      console.log('  ✅ /ai/blog/[id]/page.tsx - EXISTS (as page)');
    } else {
      this.results.missing.push('AI route missing: /ai/blog/[id]');
      console.log('  ❌ /ai/blog/[id] - MISSING');
    }
  }

  async validateBasePageAIRoutes() {
    console.log('\n📄 Checking Base Page AI Routes...');

    // Check for general AI route that can handle base pages
    const generalAIRoutePaths = [
      path.join(process.cwd(), 'src/app/ai/[...slug]/page.tsx'),
      path.join(process.cwd(), 'src/app/ai/[lang]/[slug]/page.tsx'),
      path.join(process.cwd(), 'src/app/ai/pages/[page]/route.ts')
    ];

    let hasGeneralRoute = false;
    for (const routePath of generalAIRoutePaths) {
      if (fs.existsSync(routePath)) {
        this.results.existing.push(`General AI route exists: ${routePath.replace(process.cwd() + '/src/app', '')}`);
        console.log(`  ✅ ${routePath.replace(process.cwd() + '/src/app', '')} - EXISTS`);
        hasGeneralRoute = true;
        break;
      }
    }

    if (!hasGeneralRoute) {
      this.results.missing.push('General AI route missing for base pages');
      console.log('  ❌ No general AI route found for base pages');
    }
  }

  generateCoverageReport() {
    console.log('\n📊 AI ROUTE COVERAGE REPORT');
    console.log('=' * 50);

    const totalRoutes = this.results.existing.length + this.results.missing.length;
    const coverage = totalRoutes > 0 ? ((this.results.existing.length / totalRoutes) * 100).toFixed(1) : 0;

    console.log(`Total AI Routes: ${totalRoutes}`);
    console.log(`✅ Existing: ${this.results.existing.length}`);
    console.log(`❌ Missing: ${this.results.missing.length}`);
    console.log(`Coverage: ${coverage}%`);
    console.log('=' * 50);

    if (this.results.missing.length > 0) {
      console.log('\n❌ Missing AI Routes:');
      this.results.missing.forEach(missing => {
        console.log(`  • ${missing}`);
      });
    }

    if (this.results.existing.length > 0) {
      console.log('\n✅ Existing AI Routes:');
      this.results.existing.forEach(existing => {
        console.log(`  • ${existing}`);
      });
    }

    // Generate recommendations
    this.generateRecommendations();

    return parseFloat(coverage);
  }

  generateRecommendations() {
    console.log('\n💡 RECOMMENDATIONS:');

    if (this.results.missing.length === 0) {
      console.log('🎉 Perfect! All AI routes are properly configured.');
      console.log('✅ Every translated page has a corresponding AI version.');
    } else {
      console.log('🔧 Create the following missing AI routes:');
      
      if (this.results.missing.some(m => m.includes('blog'))) {
        console.log('\n📝 Blog AI Route:');
        console.log('  Create: src/app/ai/blog/[id]/route.ts');
        console.log('  Purpose: Serve AI-optimized blog content');
        console.log('  URL Pattern: /ai/blog/post-slug?lang=cs');
      }

      if (this.results.missing.some(m => m.includes('base pages'))) {
        console.log('\n📄 Base Pages AI Route:');
        console.log('  Create: src/app/ai/pages/[page]/route.ts');
        console.log('  Purpose: Serve AI-optimized base pages (home, about, contact)');
        console.log('  URL Pattern: /ai/pages/home?lang=de');
      }

      console.log('\n🎯 Expected URL Mappings:');
      console.log('  Human: /cs/services/digital-transformation');
      console.log('  AI:    /ai/services/digital-transformation?lang=cs');
      console.log('');
      console.log('  Human: /de/blog/gdpr-compliant-analytics');
      console.log('  AI:    /ai/blog/gdpr-compliant-analytics?lang=de');
      console.log('');
      console.log('  Human: /fr/about');
      console.log('  AI:    /ai/pages/about?lang=fr');
    }
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new AIRouteValidator();
  validator.validateAIRoutes()
    .then(() => {
      console.log('\nAI route validation completed');
    })
    .catch((error) => {
      console.error('AI route validation failed:', error);
      process.exit(1);
    });
}

module.exports = { AIRouteValidator };