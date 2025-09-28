/**
 * Master Deployment Script for Multilingual Content System
 * 
 * This script orchestrates the complete deployment process including:
 * - Content validation
 * - SEO optimization
 * - Performance optimization
 * - Quality assurance
 * - Production readiness checks
 * 
 * Features:
 * - Automated deployment pipeline
 * - Comprehensive quality checks
 * - Performance optimization
 * - SEO validation
 * - Production readiness verification
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Import optimization modules
const ContentValidator = require('./content-validation');
const SEOEnhancement = require('./seo-enhancement');
const PerformanceOptimizer = require('./performance-optimization');

class MasterDeployment {
    constructor() {
        this.deploymentResults = {
            startTime: new Date(),
            endTime: null,
            duration: 0,
            stages: [],
            overallScore: 0,
            status: 'pending',
            errors: [],
            warnings: [],
            recommendations: []
        };
        
        this.deploymentStages = [
            {
                name: 'Content Validation',
                description: 'Validate all multilingual content quality and consistency',
                weight: 25,
                critical: true
            },
            {
                name: 'SEO Optimization',
                description: 'Optimize SEO performance across all languages',
                weight: 25,
                critical: true
            },
            {
                name: 'Performance Optimization',
                description: 'Optimize performance and Core Web Vitals',
                weight: 20,
                critical: false
            },
            {
                name: 'Build Verification',
                description: 'Verify production build and assets',
                weight: 15,
                critical: true
            },
            {
                name: 'Quality Assurance',
                description: 'Final quality checks and readiness verification',
                weight: 15,
                critical: false
            }
        ];
    }

    /**
     * Run complete deployment process
     */
    async runDeployment() {
        console.log('🚀 Starting Master Deployment Process...\n');
        console.log('📋 Deployment Stages:');
        this.deploymentStages.forEach((stage, index) => {
            console.log(`  ${index + 1}. ${stage.name} (${stage.weight}%)`);
        });
        console.log('');
        
        try {
            // Run each deployment stage
            for (let i = 0; i < this.deploymentStages.length; i++) {
                const stage = this.deploymentStages[i];
                console.log(`\n🔄 Stage ${i + 1}/${this.deploymentStages.length}: ${stage.name}`);
                console.log('='.repeat(50));
                
                const stageResult = await this.runStage(stage, i);
                this.deploymentResults.stages.push(stageResult);
                
                // Check if critical stage failed
                if (stage.critical && !stageResult.success) {
                    console.log(`\n❌ Critical stage failed: ${stage.name}`);
                    this.deploymentResults.status = 'failed';
                    break;
                }
                
                console.log(`✅ Stage completed: ${stage.name} (Score: ${stageResult.score}/100)`);
            }
            
            // Calculate overall results
            this.calculateOverallResults();
            
            // Generate final report
            this.generateDeploymentReport();
            
            return this.deploymentResults;
            
        } catch (error) {
            console.error('💥 Deployment failed:', error);
            this.deploymentResults.status = 'failed';
            this.deploymentResults.errors.push(error.message);
            throw error;
        }
    }

    /**
     * Run individual deployment stage
     */
    async runStage(stage, stageIndex) {
        const stageResult = {
            name: stage.name,
            description: stage.description,
            startTime: new Date(),
            endTime: null,
            duration: 0,
            score: 0,
            success: false,
            errors: [],
            warnings: [],
            output: ''
        };
        
        try {
            switch (stageIndex) {
                case 0:
                    await this.runContentValidation(stageResult);
                    break;
                case 1:
                    await this.runSEOOptimization(stageResult);
                    break;
                case 2:
                    await this.runPerformanceOptimization(stageResult);
                    break;
                case 3:
                    await this.runBuildVerification(stageResult);
                    break;
                case 4:
                    await this.runQualityAssurance(stageResult);
                    break;
                default:
                    throw new Error(`Unknown stage: ${stage.name}`);
            }
            
            stageResult.success = stageResult.score >= 60;
            
        } catch (error) {
            stageResult.errors.push(error.message);
            stageResult.success = false;
            stageResult.score = 0;
        }
        
        stageResult.endTime = new Date();
        stageResult.duration = stageResult.endTime - stageResult.startTime;
        
        return stageResult;
    }

    /**
     * Run content validation stage
     */
    async runContentValidation(stageResult) {
        console.log('🔍 Running content validation...');
        
        const validator = new ContentValidator();
        const validationReport = await validator.run();
        
        stageResult.score = validationReport.averageScore || 0;
        stageResult.output = `Validated ${validationReport.totalFiles} files with ${validationReport.passedValidation} passing`;
        
        if (validationReport.errors.length > 0) {
            stageResult.errors.push(...validationReport.errors.slice(0, 5));
        }
        
        if (validationReport.warnings.length > 0) {
            stageResult.warnings.push(...validationReport.warnings.slice(0, 5));
        }
        
        // Add recommendations
        if (validationReport.failedValidation > 0) {
            this.deploymentResults.recommendations.push(
                `Content validation: ${validationReport.failedValidation} files need attention`
            );
        }
    }

    /**
     * Run SEO optimization stage
     */
    async runSEOOptimization(stageResult) {
        console.log('🔍 Running SEO optimization...');
        
        const seoEnhancement = new SEOEnhancement();
        const seoReport = await seoEnhancement.run();
        
        stageResult.score = seoReport.overallScore || 0;
        stageResult.output = `SEO analysis completed with overall score: ${seoReport.overallScore}/100`;
        
        // Add language-specific scores to output
        Object.entries(seoReport.languageScores).forEach(([lang, score]) => {
            stageResult.output += `\n  ${lang.toUpperCase()}: ${score}/100`;
        });
        
        // Add recommendations
        if (seoReport.overallScore < 90) {
            this.deploymentResults.recommendations.push(
                `SEO optimization: Overall score ${seoReport.overallScore}/100 needs improvement`
            );
        }
    }

    /**
     * Run performance optimization stage
     */
    async runPerformanceOptimization(stageResult) {
        console.log('⚡ Running performance optimization...');
        
        const optimizer = new PerformanceOptimizer();
        const performanceReport = await optimizer.run();
        
        stageResult.score = performanceReport.performanceScore || 0;
        stageResult.output = `Performance analysis completed with score: ${performanceReport.performanceScore}/100`;
        
        // Add Core Web Vitals to output
        Object.entries(performanceReport.metrics.coreWebVitals).forEach(([metric, data]) => {
            const status = data.status === 'good' ? '✅' : data.status === 'needs-improvement' ? '⚠️' : '❌';
            stageResult.output += `\n  ${status} ${metric}: ${data.current}`;
        });
        
        // Add recommendations
        if (performanceReport.recommendations.length > 0) {
            stageResult.warnings.push(...performanceReport.recommendations.slice(0, 3));
            this.deploymentResults.recommendations.push(
                `Performance: ${performanceReport.recommendations.length} optimization opportunities identified`
            );
        }
    }

    /**
     * Run build verification stage
     */
    async runBuildVerification(stageResult) {
        console.log('🔨 Running build verification...');
        
        try {
            // Check if we're in the frontend directory
            const currentDir = process.cwd();
            const frontendDir = path.join(currentDir, 'frontend');
            
            if (fs.existsSync(frontendDir)) {
                process.chdir(frontendDir);
            }
            
            // Install dependencies
            console.log('  Installing dependencies...');
            execSync('npm install', { stdio: 'pipe' });
            
            // Run build
            console.log('  Building application...');
            execSync('npm run build', { stdio: 'pipe' });
            
            // Check build output
            const buildDir = path.join(process.cwd(), '.next');
            if (fs.existsSync(buildDir)) {
                const buildStats = fs.statSync(buildDir);
                stageResult.output = `Build completed successfully (${(buildStats.size / 1024 / 1024).toFixed(1)}MB)`;
                stageResult.score = 100;
            } else {
                throw new Error('Build directory not found');
            }
            
            // Return to original directory
            process.chdir(currentDir);
            
        } catch (error) {
            throw new Error(`Build verification failed: ${error.message}`);
        }
    }

    /**
     * Run quality assurance stage
     */
    async runQualityAssurance(stageResult) {
        console.log('✅ Running quality assurance...');
        
        let qaScore = 0;
        const qaChecks = [];
        
        // Check content completeness
        const contentCompleteness = this.checkContentCompleteness();
        qaChecks.push({
            name: 'Content Completeness',
            status: contentCompleteness.complete ? 'pass' : 'fail',
            details: contentCompleteness.details
        });
        
        // Check file structure
        const fileStructure = this.checkFileStructure();
        qaChecks.push({
            name: 'File Structure',
            status: fileStructure.valid ? 'pass' : 'fail',
            details: fileStructure.details
        });
        
        // Check configuration
        const configuration = this.checkConfiguration();
        qaChecks.push({
            name: 'Configuration',
            status: configuration.valid ? 'pass' : 'fail',
            details: configuration.details
        });
        
        // Calculate QA score
        const passedChecks = qaChecks.filter(check => check.status === 'pass').length;
        qaScore = Math.round((passedChecks / qaChecks.length) * 100);
        
        stageResult.score = qaScore;
        stageResult.output = `QA checks: ${passedChecks}/${qaChecks.length} passed`;
        
        // Add failed checks to errors
        qaChecks.filter(check => check.status === 'fail').forEach(check => {
            stageResult.errors.push(`${check.name}: ${check.details}`);
        });
        
        // Add recommendations
        if (qaScore < 100) {
            this.deploymentResults.recommendations.push(
                `Quality assurance: ${qaChecks.length - passedChecks} checks need attention`
            );
        }
    }

    /**
     * Check content completeness
     */
    checkContentCompleteness() {
        const contentDir = path.join(__dirname, '../src/content/pages');
        const languages = ['en', 'cs', 'de', 'fr'];
        const solutions = [
            'ai-integration', 'business-automation', 'digital-transformation',
            'cloud-migration', 'data-analytics', 'enterprise-solutions',
            'legacy-modernization', 'api-development', 'performance-optimization',
            'blockchain-solutions'
        ];
        
        let totalFiles = 0;
        let expectedFiles = languages.length * solutions.length;
        
        for (const language of languages) {
            for (const solution of solutions) {
                const filePath = path.join(contentDir, language, 'solutions', `${solution}.md`);
                if (fs.existsSync(filePath)) {
                    totalFiles++;
                }
            }
        }
        
        return {
            complete: totalFiles === expectedFiles,
            details: `${totalFiles}/${expectedFiles} files present`
        };
    }

    /**
     * Check file structure
     */
    checkFileStructure() {
        const requiredDirs = [
            '../src/content/pages',
            '../src/content/pages/en/solutions',
            '../src/content/pages/cs/solutions',
            '../src/content/pages/de/solutions',
            '../src/content/pages/fr/solutions',
            '../public',
            '../scripts'
        ];
        
        const missingDirs = requiredDirs.filter(dir => !fs.existsSync(path.join(__dirname, dir)));
        
        return {
            valid: missingDirs.length === 0,
            details: missingDirs.length === 0 ? 'All required directories present' : `Missing: ${missingDirs.join(', ')}`
        };
    }

    /**
     * Check configuration
     */
    checkConfiguration() {
        const requiredFiles = [
            '../package.json',
            '../next.config.js',
            '../tsconfig.json'
        ];
        
        const missingFiles = requiredFiles.filter(file => !fs.existsSync(path.join(__dirname, file)));
        
        return {
            valid: missingFiles.length === 0,
            details: missingFiles.length === 0 ? 'All required config files present' : `Missing: ${missingFiles.join(', ')}`
        };
    }

    /**
     * Calculate overall deployment results
     */
    calculateOverallResults() {
        this.deploymentResults.endTime = new Date();
        this.deploymentResults.duration = this.deploymentResults.endTime - this.deploymentResults.startTime;
        
        // Calculate weighted score
        let totalScore = 0;
        let totalWeight = 0;
        
        this.deploymentResults.stages.forEach((stage, index) => {
            const stageConfig = this.deploymentStages[index];
            totalScore += stage.score * (stageConfig.weight / 100);
            totalWeight += stageConfig.weight / 100;
        });
        
        this.deploymentResults.overallScore = Math.round(totalScore / totalWeight);
        
        // Determine final status
        if (this.deploymentResults.status !== 'failed') {
            if (this.deploymentResults.overallScore >= 90) {
                this.deploymentResults.status = 'excellent';
            } else if (this.deploymentResults.overallScore >= 80) {
                this.deploymentResults.status = 'good';
            } else if (this.deploymentResults.overallScore >= 70) {
                this.deploymentResults.status = 'acceptable';
            } else {
                this.deploymentResults.status = 'needs-improvement';
            }
        }
        
        // Collect all errors and warnings
        this.deploymentResults.stages.forEach(stage => {
            this.deploymentResults.errors.push(...stage.errors);
            this.deploymentResults.warnings.push(...stage.warnings);
        });
    }

    /**
     * Generate deployment report
     */
    generateDeploymentReport() {
        console.log('\n📊 Master Deployment Report');
        console.log('==========================');
        console.log(`Deployment Status: ${this.deploymentResults.status.toUpperCase()}`);
        console.log(`Overall Score: ${this.deploymentResults.overallScore}/100`);
        console.log(`Duration: ${Math.round(this.deploymentResults.duration / 1000)}s`);
        
        // Stage results
        console.log('\n📋 Stage Results:');
        this.deploymentResults.stages.forEach((stage, index) => {
            const status = stage.success ? '✅' : '❌';
            const stageConfig = this.deploymentStages[index];
            console.log(`  ${status} ${stage.name} (${stageConfig.weight}%): ${stage.score}/100`);
            if (stage.output) {
                console.log(`    ${stage.output}`);
            }
        });
        
        // Errors and warnings
        if (this.deploymentResults.errors.length > 0) {
            console.log('\n❌ Errors:');
            this.deploymentResults.errors.slice(0, 5).forEach(error => {
                console.log(`  - ${error}`);
            });
            if (this.deploymentResults.errors.length > 5) {
                console.log(`  ... and ${this.deploymentResults.errors.length - 5} more errors`);
            }
        }
        
        if (this.deploymentResults.warnings.length > 0) {
            console.log('\n⚠️ Warnings:');
            this.deploymentResults.warnings.slice(0, 5).forEach(warning => {
                console.log(`  - ${warning}`);
            });
            if (this.deploymentResults.warnings.length > 5) {
                console.log(`  ... and ${this.deploymentResults.warnings.length - 5} more warnings`);
            }
        }
        
        // Recommendations
        if (this.deploymentResults.recommendations.length > 0) {
            console.log('\n💡 Recommendations:');
            this.deploymentResults.recommendations.forEach(rec => {
                console.log(`  - ${rec}`);
            });
        }
        
        // Final assessment
        console.log('\n🏆 Final Assessment:');
        switch (this.deploymentResults.status) {
            case 'excellent':
                console.log('✅ EXCELLENT - System is ready for production deployment');
                break;
            case 'good':
                console.log('🟡 GOOD - System is ready for production with minor considerations');
                break;
            case 'acceptable':
                console.log('🟡 ACCEPTABLE - System can be deployed but improvements recommended');
                break;
            case 'needs-improvement':
                console.log('🔴 NEEDS IMPROVEMENT - Address issues before production deployment');
                break;
            case 'failed':
                console.log('❌ FAILED - Critical issues must be resolved before deployment');
                break;
        }
        
        // Production readiness
        const isProductionReady = this.deploymentResults.status === 'excellent' || 
                                 this.deploymentResults.status === 'good';
        
        console.log(`\n🚀 Production Ready: ${isProductionReady ? 'YES' : 'NO'}`);
        
        if (isProductionReady) {
            console.log('\n🎉 Deployment successful! The multilingual content system is ready for production.');
        } else {
            console.log('\n⚠️ Please address the issues above before proceeding to production.');
        }
    }

    /**
     * Run complete deployment
     */
    async run() {
        try {
            console.log('🚀 Starting Master Deployment Process...\n');
            
            const results = await this.runDeployment();
            
            console.log('\n✅ Master deployment process complete!');
            return results;
            
        } catch (error) {
            console.error('💥 Master deployment failed:', error);
            throw error;
        }
    }
}

// Export for use in other scripts
module.exports = MasterDeployment;

// Run if called directly
if (require.main === module) {
    const deployment = new MasterDeployment();
    deployment.run()
        .then(results => {
            console.log('\n🎉 Master deployment complete!');
            process.exit(results.status === 'failed' ? 1 : 0);
        })
        .catch(error => {
            console.error('💥 Master deployment failed:', error);
            process.exit(1);
        });
} 