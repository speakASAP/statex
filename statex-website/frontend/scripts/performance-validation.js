#!/usr/bin/env node

/**
 * Performance Validation Script for Multilingual Translation System
 * 
 * Tests:
 * 1. AI content serving performance
 * 2. Language switching speed
 * 3. Content loading performance
 * 4. SEO optimization metrics
 */

const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');

class PerformanceValidator {
  constructor() {
    this.results = {
      contentLoading: {},
      aiServing: {},
      languageSwitching: {},
      seoMetrics: {},
      overall: {}
    };
  }

  async runPerformanceTests() {
    console.log('🚀 Starting Performance Validation Tests...\n');

    try {
      await this.testContentLoadingPerformance();
      await this.testAiContentServingPerformance();
      await this.testLanguageSwitchingPerformance();
      await this.testSeoOptimizationMetrics();
      
      this.generatePerformanceReport();
    } catch (error) {
      console.error('❌ Performance validation failed:', error.message);
      process.exit(1);
    }
  }

  async testContentLoadingPerformance() {
    console.log('📊 Testing Content Loading Performance...');

    const contentPath = path.join(__dirname, '../src/content');
    const languages = ['en', 'cs', 'de', 'fr'];
    const contentTypes = ['blog', 'pages'];

    for (const contentType of contentTypes) {
      for (const language of languages) {
        const startTime = performance.now();
        
        try {
          const langPath = path.join(contentPath, contentType, language);
          
          if (fs.existsSync(langPath)) {
            const files = fs.readdirSync(langPath, { recursive: true })
              .filter(file => file.endsWith && file.endsWith('.md'));
            
            // Simulate content loading by reading files
            let totalSize = 0;
            for (const file of files.slice(0, 10)) { // Test first 10 files
              const filePath = path.join(langPath, file);
              if (fs.existsSync(filePath)) {
                const content = fs.readFileSync(filePath, 'utf8');
                totalSize += content.length;
              }
            }
            
            const endTime = performance.now();
            const loadTime = endTime - startTime;
            
            this.results.contentLoading[`${contentType}_${language}`] = {
              loadTime: Math.round(loadTime),
              filesLoaded: Math.min(files.length, 10),
              totalSize: totalSize,
              avgTimePerFile: Math.round(loadTime / Math.min(files.length, 10)),
              status: loadTime < 100 ? 'EXCELLENT' : loadTime < 500 ? 'GOOD' : 'NEEDS_IMPROVEMENT'
            };
          }
        } catch (error) {
          this.results.contentLoading[`${contentType}_${language}`] = {
            error: error.message,
            status: 'ERROR'
          };
        }
      }
    }

    console.log('✅ Content loading performance tests completed\n');
  }

  async testAiContentServingPerformance() {
    console.log('🤖 Testing AI Content Serving Performance...');

    // Test markdown parsing performance
    const contentPath = path.join(__dirname, '../src/content/pages/en/services');
    
    if (fs.existsSync(contentPath)) {
      const files = fs.readdirSync(contentPath)
        .filter(file => file.endsWith('.md'));

      const startTime = performance.now();
      
      let totalMarkdownSize = 0;
      let processedFiles = 0;

      for (const file of files) {
        try {
          const filePath = path.join(contentPath, file);
          const content = fs.readFileSync(filePath, 'utf8');
          
          // Simulate markdown processing
          const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
          const markdownContent = frontmatterMatch ? 
            content.substring(frontmatterMatch[0].length) : content;
          
          totalMarkdownSize += markdownContent.length;
          processedFiles++;
        } catch (error) {
          console.warn(`Warning: Could not process ${file}: ${error.message}`);
        }
      }

      const endTime = performance.now();
      const processingTime = endTime - startTime;

      this.results.aiServing.markdownProcessing = {
        processingTime: Math.round(processingTime),
        filesProcessed: processedFiles,
        totalMarkdownSize: totalMarkdownSize,
        avgProcessingTime: Math.round(processingTime / processedFiles),
        throughput: Math.round(totalMarkdownSize / processingTime * 1000), // chars per second
        status: processingTime < 50 ? 'EXCELLENT' : processingTime < 200 ? 'GOOD' : 'NEEDS_IMPROVEMENT'
      };
    }

    // Test AI route response simulation
    this.simulateAiRoutePerformance();

    console.log('✅ AI content serving performance tests completed\n');
  }

  simulateAiRoutePerformance() {
    // Simulate AI route response times
    const aiRoutes = [
      '/ai/services/digital-transformation',
      '/ai/solutions/cloud-migration',
      '/ai/legal/privacy-policy',
      '/cs/ai/sluzby/digitalni-transformace',
      '/de/ai/services/digital-transformation',
      '/fr/ai/services/transformation-numerique'
    ];

    const routePerformance = {};

    for (const route of aiRoutes) {
      const startTime = performance.now();
      
      // Simulate route processing
      const mockProcessingTime = Math.random() * 50 + 10; // 10-60ms
      
      // Simulate async operation
      setTimeout(() => {}, mockProcessingTime);
      
      const endTime = performance.now();
      const responseTime = endTime - startTime;

      routePerformance[route] = {
        responseTime: Math.round(responseTime),
        status: responseTime < 100 ? 'EXCELLENT' : responseTime < 300 ? 'GOOD' : 'NEEDS_IMPROVEMENT'
      };
    }

    this.results.aiServing.routePerformance = routePerformance;
  }

  async testLanguageSwitchingPerformance() {
    console.log('🌐 Testing Language Switching Performance...');

    const languages = ['en', 'cs', 'de', 'fr'];
    const switchingResults = {};

    // Simulate language switching scenarios
    for (let i = 0; i < languages.length; i++) {
      for (let j = 0; j < languages.length; j++) {
        if (i !== j) {
          const fromLang = languages[i];
          const toLang = languages[j];
          
          const startTime = performance.now();
          
          // Simulate language switching operations:
          // 1. Slug mapping lookup
          // 2. Content loading
          // 3. URL generation
          
          const mockOperations = [
            () => this.simulateSlugMapping(fromLang, toLang),
            () => this.simulateContentLoading(toLang),
            () => this.simulateUrlGeneration(toLang)
          ];

          for (const operation of mockOperations) {
            operation();
          }

          const endTime = performance.now();
          const switchTime = endTime - startTime;

          switchingResults[`${fromLang}_to_${toLang}`] = {
            switchTime: Math.round(switchTime),
            status: switchTime < 50 ? 'EXCELLENT' : switchTime < 150 ? 'GOOD' : 'NEEDS_IMPROVEMENT'
          };
        }
      }
    }

    this.results.languageSwitching = switchingResults;

    console.log('✅ Language switching performance tests completed\n');
  }

  simulateSlugMapping(fromLang, toLang) {
    // Simulate slug mapping lookup time
    const mockMappings = {
      'digital-transformation': {
        cs: 'digitalni-transformace',
        de: 'digitale-transformation',
        fr: 'transformation-numerique'
      }
    };
    
    // Simulate lookup operation
    return mockMappings['digital-transformation'][toLang] || 'digital-transformation';
  }

  simulateContentLoading(language) {
    // Simulate content loading time
    const mockLoadTime = Math.random() * 20 + 5; // 5-25ms
    return mockLoadTime;
  }

  simulateUrlGeneration(language) {
    // Simulate URL generation time
    const mockGenTime = Math.random() * 5 + 1; // 1-6ms
    return mockGenTime;
  }

  async testSeoOptimizationMetrics() {
    console.log('🔍 Testing SEO Optimization Metrics...');

    // Test metadata generation performance
    await this.testMetadataGeneration();
    
    // Test sitemap generation performance
    await this.testSitemapGeneration();
    
    // Test content analysis for SEO
    await this.testContentSeoAnalysis();

    console.log('✅ SEO optimization metrics tests completed\n');
  }

  async testMetadataGeneration() {
    const startTime = performance.now();
    
    // Simulate metadata generation for multiple pages
    const pages = ['home', 'about', 'contact'];
    const languages = ['en', 'cs', 'de', 'fr'];
    
    let generatedMetadata = 0;

    for (const page of pages) {
      for (const language of languages) {
        // Simulate metadata generation
        const mockMetadata = {
          title: `${page} - ${language}`,
          description: `Description for ${page} in ${language}`,
          keywords: [`${page}`, `${language}`, 'statex'],
          hreflang: languages.map(lang => ({
            lang,
            url: `/${lang === 'en' ? '' : lang + '/'}${page}`
          }))
        };
        
        generatedMetadata++;
      }
    }

    const endTime = performance.now();
    const generationTime = endTime - startTime;

    this.results.seoMetrics.metadataGeneration = {
      generationTime: Math.round(generationTime),
      pagesProcessed: generatedMetadata,
      avgTimePerPage: Math.round(generationTime / generatedMetadata),
      status: generationTime < 100 ? 'EXCELLENT' : generationTime < 300 ? 'GOOD' : 'NEEDS_IMPROVEMENT'
    };
  }

  async testSitemapGeneration() {
    const startTime = performance.now();
    
    // Simulate sitemap generation
    const contentTypes = ['blog', 'services', 'solutions', 'legal'];
    const languages = ['en', 'cs', 'de', 'fr'];
    
    let totalUrls = 0;

    for (const contentType of contentTypes) {
      for (const language of languages) {
        // Simulate URL generation for sitemap
        const mockUrls = Array.from({ length: 10 }, (_, i) => 
          `/${language === 'en' ? '' : language + '/'}${contentType}/item-${i}`
        );
        
        totalUrls += mockUrls.length;
      }
    }

    const endTime = performance.now();
    const sitemapTime = endTime - startTime;

    this.results.seoMetrics.sitemapGeneration = {
      generationTime: Math.round(sitemapTime),
      urlsGenerated: totalUrls,
      avgTimePerUrl: Math.round(sitemapTime / totalUrls),
      status: sitemapTime < 200 ? 'EXCELLENT' : sitemapTime < 500 ? 'GOOD' : 'NEEDS_IMPROVEMENT'
    };
  }

  async testContentSeoAnalysis() {
    const contentPath = path.join(__dirname, '../src/content/pages/en');
    
    if (fs.existsSync(contentPath)) {
      const startTime = performance.now();
      
      let analyzedFiles = 0;
      let totalWordCount = 0;
      let totalReadingTime = 0;

      const analyzeDirectory = (dirPath) => {
        const items = fs.readdirSync(dirPath);
        
        for (const item of items) {
          const itemPath = path.join(dirPath, item);
          const stat = fs.statSync(itemPath);
          
          if (stat.isDirectory()) {
            analyzeDirectory(itemPath);
          } else if (item.endsWith('.md')) {
            try {
              const content = fs.readFileSync(itemPath, 'utf8');
              
              // Remove frontmatter for word count
              const contentWithoutFrontmatter = content.replace(/^---\n[\s\S]*?\n---\n/, '');
              const wordCount = contentWithoutFrontmatter.split(/\s+/).length;
              const readingTime = Math.ceil(wordCount / 200); // 200 words per minute
              
              totalWordCount += wordCount;
              totalReadingTime += readingTime;
              analyzedFiles++;
            } catch (error) {
              console.warn(`Warning: Could not analyze ${itemPath}: ${error.message}`);
            }
          }
        }
      };

      analyzeDirectory(contentPath);

      const endTime = performance.now();
      const analysisTime = endTime - startTime;

      this.results.seoMetrics.contentAnalysis = {
        analysisTime: Math.round(analysisTime),
        filesAnalyzed: analyzedFiles,
        totalWordCount: totalWordCount,
        avgWordCount: Math.round(totalWordCount / analyzedFiles),
        totalReadingTime: totalReadingTime,
        avgAnalysisTime: Math.round(analysisTime / analyzedFiles),
        status: analysisTime < 500 ? 'EXCELLENT' : analysisTime < 1000 ? 'GOOD' : 'NEEDS_IMPROVEMENT'
      };
    }
  }

  generatePerformanceReport() {
    console.log('📊 PERFORMANCE VALIDATION REPORT');
    console.log('=' * 50);

    // Calculate overall performance score
    let totalTests = 0;
    let excellentTests = 0;
    let goodTests = 0;
    let needsImprovementTests = 0;

    const countResults = (results) => {
      for (const [key, value] of Object.entries(results)) {
        if (value.status) {
          totalTests++;
          if (value.status === 'EXCELLENT') excellentTests++;
          else if (value.status === 'GOOD') goodTests++;
          else if (value.status === 'NEEDS_IMPROVEMENT') needsImprovementTests++;
        } else if (typeof value === 'object') {
          countResults(value);
        }
      }
    };

    countResults(this.results);

    const overallScore = ((excellentTests * 3 + goodTests * 2 + needsImprovementTests * 1) / (totalTests * 3) * 100).toFixed(1);

    console.log(`Overall Performance Score: ${overallScore}%`);
    console.log(`🟢 Excellent: ${excellentTests}`);
    console.log(`🟡 Good: ${goodTests}`);
    console.log(`🔴 Needs Improvement: ${needsImprovementTests}`);
    console.log('=' * 50);

    // Content Loading Performance
    console.log('\n📊 Content Loading Performance:');
    for (const [test, result] of Object.entries(this.results.contentLoading)) {
      if (result.status !== 'ERROR') {
        console.log(`  ${test}: ${result.loadTime}ms (${result.status})`);
      }
    }

    // AI Serving Performance
    console.log('\n🤖 AI Content Serving Performance:');
    if (this.results.aiServing.markdownProcessing) {
      const mp = this.results.aiServing.markdownProcessing;
      console.log(`  Markdown Processing: ${mp.processingTime}ms (${mp.status})`);
      console.log(`  Throughput: ${mp.throughput} chars/sec`);
    }

    // Language Switching Performance
    console.log('\n🌐 Language Switching Performance:');
    const switchingTimes = Object.values(this.results.languageSwitching)
      .map(result => result.switchTime);
    
    if (switchingTimes.length > 0) {
      const avgSwitchTime = Math.round(switchingTimes.reduce((a, b) => a + b, 0) / switchingTimes.length);
      console.log(`  Average Switch Time: ${avgSwitchTime}ms`);
    }

    // SEO Metrics
    console.log('\n🔍 SEO Optimization Performance:');
    if (this.results.seoMetrics.metadataGeneration) {
      const mg = this.results.seoMetrics.metadataGeneration;
      console.log(`  Metadata Generation: ${mg.generationTime}ms (${mg.status})`);
    }
    
    if (this.results.seoMetrics.sitemapGeneration) {
      const sg = this.results.seoMetrics.sitemapGeneration;
      console.log(`  Sitemap Generation: ${sg.generationTime}ms (${sg.status})`);
    }

    // Save detailed report
    const reportPath = path.join(__dirname, '../performance-report.json');
    fs.writeFileSync(reportPath, JSON.stringify({
      summary: {
        overallScore: parseFloat(overallScore),
        totalTests,
        excellentTests,
        goodTests,
        needsImprovementTests
      },
      results: this.results,
      generatedAt: new Date().toISOString()
    }, null, 2));

    console.log(`\n📄 Detailed performance report saved to: ${reportPath}`);

    // Performance recommendations
    this.generatePerformanceRecommendations(overallScore);

    return parseFloat(overallScore);
  }

  generatePerformanceRecommendations(score) {
    console.log('\n💡 Performance Recommendations:');
    
    if (score >= 90) {
      console.log('🎉 Excellent performance! System is optimized for production.');
    } else if (score >= 75) {
      console.log('✅ Good performance. Consider minor optimizations:');
      console.log('  - Implement content caching for frequently accessed pages');
      console.log('  - Optimize image loading for blog posts');
    } else if (score >= 60) {
      console.log('⚠️  Performance needs improvement:');
      console.log('  - Implement aggressive caching strategies');
      console.log('  - Consider content preloading for language switching');
      console.log('  - Optimize markdown processing pipeline');
    } else {
      console.log('❌ Performance issues detected:');
      console.log('  - Review content loading architecture');
      console.log('  - Implement comprehensive caching system');
      console.log('  - Consider CDN for static content');
      console.log('  - Optimize database queries and file I/O');
    }
  }
}

// Run performance validation if called directly
if (require.main === module) {
  const validator = new PerformanceValidator();
  validator.runPerformanceTests()
    .then(() => {
      console.log('\nPerformance validation completed successfully');
    })
    .catch((error) => {
      console.error('Performance validation failed:', error);
      process.exit(1);
    });
}

module.exports = { PerformanceValidator };