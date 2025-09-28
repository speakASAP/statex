#!/usr/bin/env node

/**
 * Final Deployment Validation Script
 * 
 * Comprehensive validation before production deployment including:
 * 1. System validation
 * 2. Performance testing
 * 3. Build verification
 * 4. User acceptance testing simulation
 * 5. Final deployment readiness check
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class FinalDeploymentValidator {
  constructor() {
    this.results = {
      systemValidation: null,
      performanceValidation: null,
      buildValidation: null,
      userAcceptanceTests: null,
      deploymentReadiness: null,
      overall: {
        passed: false,
        score: 0,
        issues: [],
        recommendations: []
      }
    };
  }

  async runFinalValidation() {
    console.log('🚀 Starting Final Deployment Validation...\n');
    console.log('This comprehensive validation will test all aspects of the multilingual system.\n');

    try {
      // Step 1: System Validation
      await this.runSystemValidation();
      
      // Step 2: Performance Validation
      await this.runPerformanceValidation();
      
      // Step 3: Build Validation
      await this.runBuildValidation();
      
      // Step 4: User Acceptance Testing
      await this.runUserAcceptanceTests();
      
      // Step 5: Final Deployment Readiness
      await this.runDeploymentReadinessCheck();
      
      // Generate final report
      this.generateFinalReport();
      
    } catch (error) {
      console.error('❌ Final validation failed:', error.message);
      process.exit(1);
    }
  }

  async runSystemValidation() {
    console.log('📋 Step 1: Running System Validation...');
    
    try {
      // Run the multilingual system tests
      console.log('  Running multilingual system tests...');
      execSync('npm test -- --run src/test/multilingual-system.test.ts', { 
        stdio: 'pipe',
        cwd: process.cwd()
      });
      
      console.log('  ✅ Multilingual system tests passed');
      
      // Run the validation script
      console.log('  Running comprehensive validation...');
      const { MultilingualValidator } = require('./final-validation.js');
      const validator = new MultilingualValidator();
      await validator.runAllValidations();
      
      // Read validation results
      const validationReport = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), 'validation-report.json'), 'utf8')
      );
      
      this.results.systemValidation = {
        passed: validationReport.summary.failed === 0,
        score: parseFloat(validationReport.summary.successRate),
        details: validationReport
      };
      
      if (this.results.systemValidation.passed) {
        console.log('  ✅ System validation passed');
      } else {
        console.log(`  ⚠️  System validation issues detected (${validationReport.summary.failed} failures)`);
        this.results.overall.issues.push(`System validation: ${validationReport.summary.failed} failures`);
      }
      
    } catch (error) {
      console.log('  ❌ System validation failed');
      this.results.systemValidation = {
        passed: false,
        score: 0,
        error: error.message
      };
      this.results.overall.issues.push('System validation failed');
    }
    
    console.log('');
  }

  async runPerformanceValidation() {
    console.log('⚡ Step 2: Running Performance Validation...');
    
    try {
      const { PerformanceValidator } = require('./performance-validation.js');
      const validator = new PerformanceValidator();
      await validator.runPerformanceTests();
      
      // Read performance results
      const performanceReport = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), 'performance-report.json'), 'utf8')
      );
      
      this.results.performanceValidation = {
        passed: performanceReport.summary.overallScore >= 80,
        score: performanceReport.summary.overallScore,
        details: performanceReport
      };
      
      if (this.results.performanceValidation.passed) {
        console.log(`  ✅ Performance validation passed (${performanceReport.summary.overallScore}%)`);
      } else {
        console.log(`  ⚠️  Performance issues detected (${performanceReport.summary.overallScore}%)`);
        this.results.overall.issues.push(`Performance score: ${performanceReport.summary.overallScore}%`);
      }
      
    } catch (error) {
      console.log('  ❌ Performance validation failed');
      this.results.performanceValidation = {
        passed: false,
        score: 0,
        error: error.message
      };
      this.results.overall.issues.push('Performance validation failed');
    }
    
    console.log('');
  }

  async runBuildValidation() {
    console.log('🔨 Step 3: Running Build Validation...');
    
    try {
      console.log('  Testing production build...');
      
      // Clean previous build
      const buildDir = path.join(process.cwd(), '.next');
      if (fs.existsSync(buildDir)) {
        fs.rmSync(buildDir, { recursive: true, force: true });
      }
      
      // Run production build
      const startTime = Date.now();
      execSync('npm run build', { 
        stdio: 'pipe',
        timeout: 300000 // 5 minutes
      });
      const buildTime = Date.now() - startTime;
      
      // Check build output
      const buildExists = fs.existsSync(buildDir);
      
      this.results.buildValidation = {
        passed: buildExists,
        buildTime: Math.round(buildTime / 1000),
        details: {
          buildDirectory: buildExists,
          buildTimeSeconds: Math.round(buildTime / 1000)
        }
      };
      
      if (this.results.buildValidation.passed) {
        console.log(`  ✅ Production build successful (${Math.round(buildTime / 1000)}s)`);
      } else {
        console.log('  ❌ Production build failed');
        this.results.overall.issues.push('Production build failed');
      }
      
    } catch (error) {
      console.log('  ❌ Build validation failed');
      this.results.buildValidation = {
        passed: false,
        error: error.message
      };
      this.results.overall.issues.push('Build validation failed');
    }
    
    console.log('');
  }

  async runUserAcceptanceTests() {
    console.log('👥 Step 4: Running User Acceptance Tests...');
    
    try {
      const uatResults = {
        contentAccessibility: this.testContentAccessibility(),
        languageSwitching: this.testLanguageSwitchingUX(),
        aiContentServing: this.testAiContentServingUX(),
        seoOptimization: this.testSeoOptimizationUX(),
        performanceUX: this.testPerformanceUX()
      };
      
      const passedTests = Object.values(uatResults).filter(result => result.passed).length;
      const totalTests = Object.keys(uatResults).length;
      
      this.results.userAcceptanceTests = {
        passed: passedTests === totalTests,
        score: (passedTests / totalTests) * 100,
        details: uatResults
      };
      
      if (this.results.userAcceptanceTests.passed) {
        console.log(`  ✅ User acceptance tests passed (${passedTests}/${totalTests})`);
      } else {
        console.log(`  ⚠️  User acceptance issues detected (${passedTests}/${totalTests})`);
        this.results.overall.issues.push(`UAT: ${totalTests - passedTests} tests failed`);
      }
      
    } catch (error) {
      console.log('  ❌ User acceptance testing failed');
      this.results.userAcceptanceTests = {
        passed: false,
        error: error.message
      };
      this.results.overall.issues.push('User acceptance testing failed');
    }
    
    console.log('');
  }

  testContentAccessibility() {
    console.log('    Testing content accessibility...');
    
    // Check if all required content exists
    const contentTypes = ['blog', 'services', 'solutions', 'legal'];
    const languages = ['en', 'cs', 'de', 'fr'];
    
    let accessibleContent = 0;
    let totalContent = 0;
    
    for (const contentType of contentTypes) {
      for (const language of languages) {
        const contentPath = path.join(process.cwd(), 'src/content', contentType === 'blog' ? 'blog' : 'pages', language, contentType === 'blog' ? '' : contentType);
        
        if (fs.existsSync(contentPath)) {
          const files = fs.readdirSync(contentPath, { recursive: true })
            .filter(file => file.endsWith && file.endsWith('.md'));
          accessibleContent += files.length;
        }
        totalContent += 10; // Expected average content per type/language
      }
    }
    
    const accessibilityScore = (accessibleContent / totalContent) * 100;
    
    return {
      passed: accessibilityScore >= 70,
      score: accessibilityScore,
      message: `Content accessibility: ${Math.round(accessibilityScore)}%`
    };
  }

  testLanguageSwitchingUX() {
    console.log('    Testing language switching UX...');
    
    // Check if language switcher component exists
    const languageSwitcherExists = fs.existsSync(
      path.join(process.cwd(), 'src/components/layout/LanguageSwitcher.tsx')
    );
    
    // Check if language detection utilities exist
    const languageUtilsExist = fs.existsSync(
      path.join(process.cwd(), 'src/lib/utils/language.ts')
    );
    
    const passed = languageSwitcherExists && languageUtilsExist;
    
    return {
      passed,
      score: passed ? 100 : 50,
      message: `Language switching components: ${passed ? 'Complete' : 'Incomplete'}`
    };
  }

  testAiContentServingUX() {
    console.log('    Testing AI content serving UX...');
    
    // Check if AI routes exist
    const aiRoutes = [
      'src/app/ai/services/[service]/route.ts',
      'src/app/ai/solutions/[solution]/route.ts',
      'src/app/ai/legal/[legal]/route.ts'
    ];
    
    const existingRoutes = aiRoutes.filter(route => 
      fs.existsSync(path.join(process.cwd(), route))
    );
    
    const passed = existingRoutes.length === aiRoutes.length;
    
    return {
      passed,
      score: (existingRoutes.length / aiRoutes.length) * 100,
      message: `AI content routes: ${existingRoutes.length}/${aiRoutes.length} available`
    };
  }

  testSeoOptimizationUX() {
    console.log('    Testing SEO optimization UX...');
    
    // Check if metadata utilities exist
    const metadataUtilsExist = fs.existsSync(
      path.join(process.cwd(), 'src/lib/utils/metadata.ts')
    );
    
    // Check if sitemap exists
    const sitemapExists = fs.existsSync(
      path.join(process.cwd(), 'src/app/sitemap.xml/route.ts')
    );
    
    const components = [metadataUtilsExist, sitemapExists];
    const score = (components.filter(Boolean).length / components.length) * 100;
    
    return {
      passed: score >= 80,
      score,
      message: `SEO components: ${Math.round(score)}% complete`
    };
  }

  testPerformanceUX() {
    console.log('    Testing performance UX...');
    
    // Check if ContentLoader has caching
    const contentLoaderPath = path.join(process.cwd(), 'src/lib/content/ContentLoader.ts');
    
    if (fs.existsSync(contentLoaderPath)) {
      const content = fs.readFileSync(contentLoaderPath, 'utf8');
      const hasCaching = content.includes('cache') || content.includes('Cache');
      
      return {
        passed: hasCaching,
        score: hasCaching ? 100 : 60,
        message: `Performance optimizations: ${hasCaching ? 'Implemented' : 'Basic'}`
      };
    }
    
    return {
      passed: false,
      score: 0,
      message: 'Performance optimizations: Not found'
    };
  }

  async runDeploymentReadinessCheck() {
    console.log('🚀 Step 5: Running Deployment Readiness Check...');
    
    try {
      const { DeploymentReadinessChecker } = require('./deployment-readiness.js');
      const checker = new DeploymentReadinessChecker();
      const isReady = await checker.runDeploymentChecks();
      
      // Read deployment readiness results
      const deploymentReport = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), 'deployment-readiness-report.json'), 'utf8')
      );
      
      this.results.deploymentReadiness = {
        passed: isReady,
        score: deploymentReport.summary.successRate,
        details: deploymentReport
      };
      
      if (this.results.deploymentReadiness.passed) {
        console.log('  ✅ Deployment readiness check passed');
      } else {
        console.log('  ⚠️  Deployment readiness issues detected');
        this.results.overall.issues.push('Deployment readiness check failed');
      }
      
    } catch (error) {
      console.log('  ❌ Deployment readiness check failed');
      this.results.deploymentReadiness = {
        passed: false,
        error: error.message
      };
      this.results.overall.issues.push('Deployment readiness check failed');
    }
    
    console.log('');
  }

  generateFinalReport() {
    console.log('📊 FINAL DEPLOYMENT VALIDATION REPORT');
    console.log('=' * 60);
    
    // Calculate overall score
    const scores = [
      this.results.systemValidation?.score || 0,
      this.results.performanceValidation?.score || 0,
      this.results.buildValidation?.passed ? 100 : 0,
      this.results.userAcceptanceTests?.score || 0,
      this.results.deploymentReadiness?.score || 0
    ];
    
    const overallScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const allTestsPassed = Object.values(this.results).every(result => 
      result && (result.passed !== false)
    );
    
    this.results.overall.passed = allTestsPassed && overallScore >= 80;
    this.results.overall.score = overallScore;
    
    // Display results
    console.log(`Overall Score: ${Math.round(overallScore)}%`);
    console.log(`System Validation: ${this.results.systemValidation?.passed ? '✅' : '❌'} (${Math.round(this.results.systemValidation?.score || 0)}%)`);
    console.log(`Performance: ${this.results.performanceValidation?.passed ? '✅' : '❌'} (${Math.round(this.results.performanceValidation?.score || 0)}%)`);
    console.log(`Build Validation: ${this.results.buildValidation?.passed ? '✅' : '❌'}`);
    console.log(`User Acceptance: ${this.results.userAcceptanceTests?.passed ? '✅' : '❌'} (${Math.round(this.results.userAcceptanceTests?.score || 0)}%)`);
    console.log(`Deployment Ready: ${this.results.deploymentReadiness?.passed ? '✅' : '❌'} (${Math.round(this.results.deploymentReadiness?.score || 0)}%)`);
    
    console.log('=' * 60);
    
    // Final decision
    if (this.results.overall.passed) {
      console.log('🎉 SYSTEM IS READY FOR PRODUCTION DEPLOYMENT!');
      console.log('All validation checks passed. You can proceed with confidence.');
      
      this.generateDeploymentInstructions();
    } else {
      console.log('⚠️  DEPLOYMENT NOT RECOMMENDED');
      console.log('Please address the following issues before deployment:');
      
      this.results.overall.issues.forEach(issue => {
        console.log(`  • ${issue}`);
      });
      
      this.generateRecommendations();
    }
    
    // Save comprehensive report
    const reportPath = path.join(process.cwd(), 'final-deployment-validation-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    console.log(`\n📄 Comprehensive report saved to: ${reportPath}`);
    
    return this.results.overall.passed;
  }

  generateDeploymentInstructions() {
    console.log('\n📋 DEPLOYMENT INSTRUCTIONS:');
    console.log('1. Ensure environment variables are set for production');
    console.log('2. Run final build: npm run build');
    console.log('3. Deploy using: npm run deploy or your preferred method');
    console.log('4. Monitor system performance after deployment');
    console.log('5. Test language switching in production environment');
    console.log('6. Verify AI content serving endpoints');
  }

  generateRecommendations() {
    console.log('\n💡 RECOMMENDATIONS:');
    
    if (!this.results.systemValidation?.passed) {
      console.log('• Fix system validation issues - check missing translations');
    }
    
    if (!this.results.performanceValidation?.passed) {
      console.log('• Optimize performance - implement caching and compression');
    }
    
    if (!this.results.buildValidation?.passed) {
      console.log('• Fix build issues - resolve conflicting routes and configuration');
    }
    
    if (!this.results.userAcceptanceTests?.passed) {
      console.log('• Complete missing UX components - language switcher, metadata utils');
    }
    
    if (!this.results.deploymentReadiness?.passed) {
      console.log('• Address deployment readiness - environment setup, security headers');
    }
  }
}

// Run final validation if called directly
if (require.main === module) {
  const validator = new FinalDeploymentValidator();
  validator.runFinalValidation()
    .then(() => {
      console.log('Final deployment validation completed');
    })
    .catch((error) => {
      console.error('Final deployment validation failed:', error);
      process.exit(1);
    });
}

module.exports = { FinalDeploymentValidator };