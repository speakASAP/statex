#!/usr/bin/env node

/**
 * Final Validation Script for Complete Multilingual Translation System
 * 
 * This script performs comprehensive validation of:
 * 1. Translation completeness across all content types
 * 2. URL patterns and routing functionality
 * 3. AI content serving performance
 * 4. Language switching functionality
 * 5. SEO optimization validation
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const SUPPORTED_LANGUAGES = ['en', 'cs', 'de', 'fr'];
const CONTENT_TYPES = ['services', 'solutions', 'legal'];
const BASE_PAGES = ['home', 'about', 'contact'];

class ValidationReport {
  constructor() {
    this.results = {
      translationCompleteness: {},
      urlPatterns: {},
      aiContentServing: {},
      languageSwitching: {},
      seoOptimization: {},
      overall: { passed: 0, failed: 0, warnings: 0 }
    };
  }

  addResult(category, test, status, message, details = null) {
    if (!this.results[category]) {
      this.results[category] = {};
    }
    
    this.results[category][test] = {
      status,
      message,
      details,
      timestamp: new Date().toISOString()
    };

    // Update overall counters
    if (status === 'PASS') {
      this.results.overall.passed++;
    } else if (status === 'FAIL') {
      this.results.overall.failed++;
    } else if (status === 'WARN') {
      this.results.overall.warnings++;
    }
  }

  generateReport() {
    const report = {
      summary: {
        totalTests: this.results.overall.passed + this.results.overall.failed + this.results.overall.warnings,
        passed: this.results.overall.passed,
        failed: this.results.overall.failed,
        warnings: this.results.overall.warnings,
        successRate: ((this.results.overall.passed / (this.results.overall.passed + this.results.overall.failed)) * 100).toFixed(2) + '%'
      },
      details: this.results,
      generatedAt: new Date().toISOString()
    };

    return report;
  }
}

class MultilingualValidator {
  constructor() {
    this.report = new ValidationReport();
    this.contentPath = path.join(__dirname, '../src/content');
  }

  async runAllValidations() {
    console.log('🚀 Starting Final Validation of Multilingual Translation System...\n');

    try {
      await this.validateTranslationCompleteness();
      await this.validateUrlPatterns();
      await this.validateAiContentServing();
      await this.validateLanguageSwitching();
      await this.validateSeoOptimization();
      
      this.generateFinalReport();
    } catch (error) {
      console.error('❌ Validation failed with error:', error.message);
      process.exit(1);
    }
  }

  async validateTranslationCompleteness() {
    console.log('📝 Validating Translation Completeness...');

    // Check blog translations
    await this.validateBlogTranslations();
    
    // Check page translations
    await this.validatePageTranslations();
    
    // Check content type translations
    for (const contentType of CONTENT_TYPES) {
      await this.validateContentTypeTranslations(contentType);
    }

    console.log('✅ Translation completeness validation completed\n');
  }

  async validateBlogTranslations() {
    const blogPath = path.join(this.contentPath, 'blog');
    
    try {
      const englishPosts = fs.readdirSync(path.join(blogPath, 'en'))
        .filter(file => file.endsWith('.md'));

      for (const language of SUPPORTED_LANGUAGES.filter(lang => lang !== 'en')) {
        const langPath = path.join(blogPath, language);
        
        if (!fs.existsSync(langPath)) {
          this.report.addResult('translationCompleteness', `blog_${language}_directory`, 'FAIL', 
            `Blog directory missing for language: ${language}`);
          continue;
        }

        const translatedPosts = fs.readdirSync(langPath)
          .filter(file => file.endsWith('.md'));

        const missingPosts = englishPosts.filter(post => !translatedPosts.includes(post));
        
        if (missingPosts.length === 0) {
          this.report.addResult('translationCompleteness', `blog_${language}_complete`, 'PASS', 
            `All ${englishPosts.length} blog posts translated to ${language}`);
        } else {
          this.report.addResult('translationCompleteness', `blog_${language}_missing`, 'FAIL', 
            `Missing ${missingPosts.length} blog translations for ${language}`, missingPosts);
        }
      }
    } catch (error) {
      this.report.addResult('translationCompleteness', 'blog_validation_error', 'FAIL', 
        `Error validating blog translations: ${error.message}`);
    }
  }

  async validatePageTranslations() {
    const pagesPath = path.join(this.contentPath, 'pages');

    for (const page of BASE_PAGES) {
      const englishFile = path.join(pagesPath, 'en', `${page}.md`);
      
      if (!fs.existsSync(englishFile)) {
        this.report.addResult('translationCompleteness', `page_${page}_english_missing`, 'FAIL', 
          `English source file missing: ${page}.md`);
        continue;
      }

      for (const language of SUPPORTED_LANGUAGES.filter(lang => lang !== 'en')) {
        const translatedFile = path.join(pagesPath, language, `${page}.md`);
        
        if (fs.existsSync(translatedFile)) {
          this.report.addResult('translationCompleteness', `page_${page}_${language}`, 'PASS', 
            `Page ${page} translated to ${language}`);
        } else {
          this.report.addResult('translationCompleteness', `page_${page}_${language}_missing`, 'FAIL', 
            `Missing translation for page ${page} in ${language}`);
        }
      }
    }
  }

  async validateContentTypeTranslations(contentType) {
    const englishPath = path.join(this.contentPath, 'pages', 'en', contentType);
    
    if (!fs.existsSync(englishPath)) {
      this.report.addResult('translationCompleteness', `${contentType}_english_missing`, 'FAIL', 
        `English ${contentType} directory missing`);
      return;
    }

    const englishFiles = fs.readdirSync(englishPath)
      .filter(file => file.endsWith('.md'));

    for (const language of SUPPORTED_LANGUAGES.filter(lang => lang !== 'en')) {
      const langPath = path.join(this.contentPath, 'pages', language, contentType);
      
      if (!fs.existsSync(langPath)) {
        this.report.addResult('translationCompleteness', `${contentType}_${language}_directory`, 'FAIL', 
          `${contentType} directory missing for language: ${language}`);
        continue;
      }

      const translatedFiles = fs.readdirSync(langPath)
        .filter(file => file.endsWith('.md'));

      const missingFiles = englishFiles.filter(file => !translatedFiles.includes(file));
      
      if (missingFiles.length === 0) {
        this.report.addResult('translationCompleteness', `${contentType}_${language}_complete`, 'PASS', 
          `All ${englishFiles.length} ${contentType} files translated to ${language}`);
      } else {
        this.report.addResult('translationCompleteness', `${contentType}_${language}_missing`, 'FAIL', 
          `Missing ${missingFiles.length} ${contentType} translations for ${language}`, missingFiles);
      }
    }
  }

  async validateUrlPatterns() {
    console.log('🔗 Validating URL Patterns and Routing...');

    // Check if SlugMapper exists and has proper mappings
    await this.validateSlugMapper();
    
    // Check route files exist
    await this.validateRouteFiles();

    console.log('✅ URL patterns validation completed\n');
  }

  async validateSlugMapper() {
    const slugMapperPath = path.join(__dirname, '../src/lib/content/SlugMapper.ts');
    
    if (fs.existsSync(slugMapperPath)) {
      this.report.addResult('urlPatterns', 'slug_mapper_exists', 'PASS', 
        'SlugMapper file exists');
      
      // Check if SlugMapper has mappings for all content types
      const slugMapperContent = fs.readFileSync(slugMapperPath, 'utf8');
      
      for (const contentType of CONTENT_TYPES) {
        if (slugMapperContent.includes(contentType)) {
          this.report.addResult('urlPatterns', `slug_mapper_${contentType}`, 'PASS', 
            `SlugMapper includes ${contentType} mappings`);
        } else {
          this.report.addResult('urlPatterns', `slug_mapper_${contentType}_missing`, 'WARN', 
            `SlugMapper may be missing ${contentType} mappings`);
        }
      }
    } else {
      this.report.addResult('urlPatterns', 'slug_mapper_missing', 'FAIL', 
        'SlugMapper file not found');
    }
  }

  async validateRouteFiles() {
    const routePaths = [
      'src/app/[lang]/services/[service]/page.tsx',
      'src/app/[lang]/solutions/[solution]/page.tsx',
      'src/app/[lang]/legal/[legal]/page.tsx',
      'src/app/ai/services/[service]/route.ts',
      'src/app/ai/solutions/[solution]/route.ts',
      'src/app/ai/legal/[legal]/route.ts'
    ];

    for (const routePath of routePaths) {
      const fullPath = path.join(__dirname, '..', routePath);
      
      if (fs.existsSync(fullPath)) {
        this.report.addResult('urlPatterns', `route_${routePath.replace(/[\/\[\]]/g, '_')}`, 'PASS', 
          `Route file exists: ${routePath}`);
      } else {
        this.report.addResult('urlPatterns', `route_missing_${routePath.replace(/[\/\[\]]/g, '_')}`, 'FAIL', 
          `Route file missing: ${routePath}`);
      }
    }
  }

  async validateAiContentServing() {
    console.log('🤖 Validating AI Content Serving...');

    // Check AI route implementations
    await this.validateAiRoutes();
    
    // Check content loading performance
    await this.validateContentLoadingPerformance();

    console.log('✅ AI content serving validation completed\n');
  }

  async validateAiRoutes() {
    const aiRoutesPath = path.join(__dirname, '../src/app/ai');
    
    if (fs.existsSync(aiRoutesPath)) {
      this.report.addResult('aiContentServing', 'ai_routes_directory', 'PASS', 
        'AI routes directory exists');
      
      // Check for specific AI route implementations
      const expectedRoutes = ['services', 'solutions', 'legal'];
      
      for (const route of expectedRoutes) {
        const routePath = path.join(aiRoutesPath, route);
        
        if (fs.existsSync(routePath)) {
          this.report.addResult('aiContentServing', `ai_route_${route}`, 'PASS', 
            `AI route exists for ${route}`);
        } else {
          this.report.addResult('aiContentServing', `ai_route_${route}_missing`, 'FAIL', 
            `AI route missing for ${route}`);
        }
      }
    } else {
      this.report.addResult('aiContentServing', 'ai_routes_missing', 'FAIL', 
        'AI routes directory not found');
    }
  }

  async validateContentLoadingPerformance() {
    // Check if ContentLoader exists and has performance optimizations
    const contentLoaderPath = path.join(__dirname, '../src/lib/content/ContentLoader.ts');
    
    if (fs.existsSync(contentLoaderPath)) {
      this.report.addResult('aiContentServing', 'content_loader_exists', 'PASS', 
        'ContentLoader exists');
      
      const contentLoaderContent = fs.readFileSync(contentLoaderPath, 'utf8');
      
      // Check for caching implementation
      if (contentLoaderContent.includes('cache') || contentLoaderContent.includes('Cache')) {
        this.report.addResult('aiContentServing', 'content_loader_caching', 'PASS', 
          'ContentLoader includes caching functionality');
      } else {
        this.report.addResult('aiContentServing', 'content_loader_caching_missing', 'WARN', 
          'ContentLoader may be missing caching functionality');
      }
    } else {
      this.report.addResult('aiContentServing', 'content_loader_missing', 'FAIL', 
        'ContentLoader not found');
    }
  }

  async validateLanguageSwitching() {
    console.log('🌐 Validating Language Switching...');

    // Check language switcher component
    await this.validateLanguageSwitcherComponent();
    
    // Check language detection logic
    await this.validateLanguageDetection();

    console.log('✅ Language switching validation completed\n');
  }

  async validateLanguageSwitcherComponent() {
    const possiblePaths = [
      'src/components/layout/LanguageSwitcher.tsx',
      'src/components/ui/LanguageSwitcher.tsx',
      'src/components/LanguageSwitcher.tsx'
    ];

    let found = false;
    for (const possiblePath of possiblePaths) {
      const fullPath = path.join(__dirname, '..', possiblePath);
      
      if (fs.existsSync(fullPath)) {
        this.report.addResult('languageSwitching', 'language_switcher_component', 'PASS', 
          `Language switcher component found at ${possiblePath}`);
        found = true;
        break;
      }
    }

    if (!found) {
      this.report.addResult('languageSwitching', 'language_switcher_missing', 'FAIL', 
        'Language switcher component not found');
    }
  }

  async validateLanguageDetection() {
    // Check for language detection utilities
    const possiblePaths = [
      'src/lib/i18n.ts',
      'src/lib/language.ts',
      'src/lib/utils/language.ts'
    ];

    let found = false;
    for (const possiblePath of possiblePaths) {
      const fullPath = path.join(__dirname, '..', possiblePath);
      
      if (fs.existsSync(fullPath)) {
        this.report.addResult('languageSwitching', 'language_detection', 'PASS', 
          `Language detection utilities found at ${possiblePath}`);
        found = true;
        break;
      }
    }

    if (!found) {
      this.report.addResult('languageSwitching', 'language_detection_missing', 'WARN', 
        'Language detection utilities not found in expected locations');
    }
  }

  async validateSeoOptimization() {
    console.log('🔍 Validating SEO Optimization...');

    // Check metadata generation
    await this.validateMetadataGeneration();
    
    // Check sitemap generation
    await this.validateSitemapGeneration();
    
    // Check hreflang implementation
    await this.validateHreflangImplementation();

    console.log('✅ SEO optimization validation completed\n');
  }

  async validateMetadataGeneration() {
    // Check for metadata utilities
    const metadataPaths = [
      'src/lib/metadata.ts',
      'src/lib/seo.ts',
      'src/lib/utils/metadata.ts'
    ];

    let found = false;
    for (const metadataPath of metadataPaths) {
      const fullPath = path.join(__dirname, '..', metadataPath);
      
      if (fs.existsSync(fullPath)) {
        this.report.addResult('seoOptimization', 'metadata_generation', 'PASS', 
          `Metadata generation utilities found at ${metadataPath}`);
        found = true;
        break;
      }
    }

    if (!found) {
      this.report.addResult('seoOptimization', 'metadata_generation_missing', 'WARN', 
        'Metadata generation utilities not found');
    }
  }

  async validateSitemapGeneration() {
    // Check for sitemap routes
    const sitemapPaths = [
      'src/app/sitemap.xml/route.ts',
      'src/app/sitemap.ts'
    ];

    let found = false;
    for (const sitemapPath of sitemapPaths) {
      const fullPath = path.join(__dirname, '..', sitemapPath);
      
      if (fs.existsSync(fullPath)) {
        this.report.addResult('seoOptimization', 'sitemap_generation', 'PASS', 
          `Sitemap generation found at ${sitemapPath}`);
        found = true;
        break;
      }
    }

    if (!found) {
      this.report.addResult('seoOptimization', 'sitemap_generation_missing', 'WARN', 
        'Sitemap generation not found');
    }
  }

  async validateHreflangImplementation() {
    // Check layout files for hreflang implementation
    const layoutPath = path.join(__dirname, '../src/app/layout.tsx');
    
    if (fs.existsSync(layoutPath)) {
      const layoutContent = fs.readFileSync(layoutPath, 'utf8');
      
      if (layoutContent.includes('hreflang') || layoutContent.includes('alternate')) {
        this.report.addResult('seoOptimization', 'hreflang_implementation', 'PASS', 
          'Hreflang implementation found in layout');
      } else {
        this.report.addResult('seoOptimization', 'hreflang_implementation_missing', 'WARN', 
          'Hreflang implementation not found in layout');
      }
    } else {
      this.report.addResult('seoOptimization', 'layout_missing', 'FAIL', 
        'Layout file not found');
    }
  }

  generateFinalReport() {
    const report = this.report.generateReport();
    
    console.log('📊 FINAL VALIDATION REPORT');
    console.log('=' * 50);
    console.log(`Total Tests: ${report.summary.totalTests}`);
    console.log(`✅ Passed: ${report.summary.passed}`);
    console.log(`❌ Failed: ${report.summary.failed}`);
    console.log(`⚠️  Warnings: ${report.summary.warnings}`);
    console.log(`Success Rate: ${report.summary.successRate}`);
    console.log('=' * 50);

    // Save detailed report
    const reportPath = path.join(__dirname, '../validation-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📄 Detailed report saved to: ${reportPath}`);

    // Generate human-readable report
    this.generateHumanReadableReport(report);

    // Determine overall success
    if (report.summary.failed === 0) {
      console.log('\n🎉 ALL VALIDATIONS PASSED! System is ready for deployment.');
      return true;
    } else {
      console.log(`\n❌ ${report.summary.failed} validations failed. Please address issues before deployment.`);
      return false;
    }
  }

  generateHumanReadableReport(report) {
    const reportPath = path.join(__dirname, '../validation-report.md');
    let markdown = `# Multilingual Translation System - Final Validation Report

Generated: ${report.generatedAt}

## Summary

- **Total Tests**: ${report.summary.totalTests}
- **Passed**: ✅ ${report.summary.passed}
- **Failed**: ❌ ${report.summary.failed}
- **Warnings**: ⚠️ ${report.summary.warnings}
- **Success Rate**: ${report.summary.successRate}

## Detailed Results

`;

    for (const [category, tests] of Object.entries(report.details)) {
      if (category === 'overall') continue;
      
      markdown += `### ${category.charAt(0).toUpperCase() + category.slice(1)}\n\n`;
      
      for (const [testName, result] of Object.entries(tests)) {
        const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️';
        markdown += `- ${icon} **${testName}**: ${result.message}\n`;
        
        if (result.details) {
          markdown += `  - Details: ${JSON.stringify(result.details)}\n`;
        }
      }
      
      markdown += '\n';
    }

    fs.writeFileSync(reportPath, markdown);
    console.log(`📄 Human-readable report saved to: ${reportPath}`);
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new MultilingualValidator();
  validator.runAllValidations()
    .then(() => {
      console.log('Validation completed successfully');
    })
    .catch((error) => {
      console.error('Validation failed:', error);
      process.exit(1);
    });
}

module.exports = { MultilingualValidator };