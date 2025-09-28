/**
 * SEO Enhancement Script for Multilingual Content System
 * 
 * This script provides comprehensive SEO optimization for the Statex multilingual
 * solution content across Czech, German, French, and English markets.
 * 
 * Features:
 * - Meta tag optimization
 * - Keyword density analysis
 * - Internal linking optimization
 * - Performance monitoring
 * - SEO score calculation
 */

const fs = require('fs');
const path = require('path');

class SEOEnhancement {
    constructor() {
        this.contentDir = path.join(__dirname, '../src/content/pages');
        this.languages = ['en', 'cs', 'de', 'fr'];
        this.solutions = [
            'ai-integration',
            'business-automation', 
            'digital-transformation',
            'cloud-migration',
            'data-analytics',
            'enterprise-solutions',
            'legacy-modernization',
            'api-development',
            'performance-optimization',
            'blockchain-solutions'
        ];
        
        this.seoMetrics = {
            totalPages: 0,
            averageContentLength: 0,
            seoScores: {},
            keywordCoverage: {},
            metaDescriptionQuality: {},
            internalLinking: {}
        };
    }

    /**
     * Analyze SEO performance across all content
     */
    async analyzeSEO() {
        console.log('🔍 Starting comprehensive SEO analysis...');
        
        let totalContentLength = 0;
        let totalPages = 0;

        for (const language of this.languages) {
            console.log(`\n📊 Analyzing ${language.toUpperCase()} content...`);
            
            for (const solution of this.solutions) {
                const filePath = this.getFilePath(language, solution);
                
                if (fs.existsSync(filePath)) {
                    const content = fs.readFileSync(filePath, 'utf8');
                    const analysis = this.analyzeContent(content, language, solution);
                    
                    totalContentLength += analysis.contentLength;
                    totalPages++;
                    
                    this.seoMetrics.seoScores[`${language}-${solution}`] = analysis.seoScore;
                    this.seoMetrics.keywordCoverage[`${language}-${solution}`] = analysis.keywordCoverage;
                    this.seoMetrics.metaDescriptionQuality[`${language}-${solution}`] = analysis.metaDescriptionQuality;
                    this.seoMetrics.internalLinking[`${language}-${solution}`] = analysis.internalLinking;
                    
                    console.log(`  ✅ ${solution}: ${analysis.seoScore} (${analysis.contentLength} lines)`);
                }
            }
        }

        this.seoMetrics.totalPages = totalPages;
        this.seoMetrics.averageContentLength = Math.round(totalContentLength / totalPages);

        return this.seoMetrics;
    }

    /**
     * Analyze individual content file
     */
    analyzeContent(content, language, solution) {
        const lines = content.split('\n');
        const contentLength = lines.length;
        
        // Extract frontmatter
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        const frontmatter = frontmatterMatch ? this.parseFrontmatter(frontmatterMatch[1]) : {};
        
        // Analyze content quality
        const seoScore = this.calculateSEOScore(content, frontmatter, language);
        const keywordCoverage = this.analyzeKeywordCoverage(content, language);
        const metaDescriptionQuality = this.analyzeMetaDescription(frontmatter);
        const internalLinking = this.analyzeInternalLinking(content);
        
        return {
            contentLength,
            seoScore,
            keywordCoverage,
            metaDescriptionQuality,
            internalLinking,
            frontmatter
        };
    }

    /**
     * Calculate SEO score for content
     */
    calculateSEOScore(content, frontmatter, language) {
        let score = 0;
        const maxScore = 100;
        
        // Meta tags (20 points)
        if (frontmatter.title && frontmatter.title.length > 10 && frontmatter.title.length < 60) score += 10;
        if (frontmatter.description && frontmatter.description.length > 50 && frontmatter.description.length < 160) score += 10;
        
        // Keywords (15 points)
        if (frontmatter.seo && frontmatter.seo.keywords && frontmatter.seo.keywords.length >= 3) score += 15;
        
        // Content length (20 points)
        const contentLength = content.split('\n').length;
        if (contentLength >= 200) score += 20;
        else if (contentLength >= 150) score += 18;
        else if (contentLength >= 100) score += 15;
        else if (contentLength >= 50) score += 10;
        
        // Headings structure (15 points)
        const headings = content.match(/^#{1,6}\s+.+$/gm) || [];
        if (headings.length >= 5) score += 15;
        else if (headings.length >= 3) score += 12;
        else if (headings.length >= 1) score += 8;
        
        // Internal links (10 points)
        const internalLinks = content.match(/\[([^\]]+)\]\([^)]+\)/g) || [];
        if (internalLinks.length >= 3) score += 10;
        else if (internalLinks.length >= 1) score += 7;
        else score += 3; // Give some points even without internal links
        
        // Language-specific content (10 points)
        if (this.hasLanguageSpecificContent(content, language)) score += 10;
        
        // Professional terminology (10 points)
        if (this.hasProfessionalTerminology(content, language)) score += 10;
        
        return Math.min(score, maxScore);
    }

    /**
     * Analyze keyword coverage
     */
    analyzeKeywordCoverage(content, language) {
        const keywords = this.getTargetKeywords(language);
        const contentLower = content.toLowerCase();
        let coverage = 0;
        
        keywords.forEach(keyword => {
            if (contentLower.includes(keyword.toLowerCase())) {
                coverage++;
            }
        });
        
        return Math.round((coverage / keywords.length) * 100);
    }

    /**
     * Analyze meta description quality
     */
    analyzeMetaDescription(frontmatter) {
        if (!frontmatter.description) return 0;
        
        const desc = frontmatter.description;
        let score = 0;
        
        if (desc.length >= 50 && desc.length <= 160) score += 50;
        if (desc.includes('Statex')) score += 25;
        if (desc.includes('solutions') || desc.includes('services')) score += 25;
        
        return score;
    }

    /**
     * Analyze internal linking
     */
    analyzeInternalLinking(content) {
        const links = content.match(/\[([^\]]+)\]\([^)]+\)/g) || [];
        return links.length;
    }

    /**
     * Get target keywords for language
     */
    getTargetKeywords(language) {
        const keywordMap = {
            en: ['ai integration', 'business automation', 'digital transformation', 'cloud migration', 'data analytics', 'enterprise solutions', 'legacy modernization', 'api development', 'performance optimization', 'blockchain solutions'],
            cs: ['ai integrace', 'podniková automatizace', 'digitální transformace', 'migrace do cloudu', 'analýza dat', 'podniková řešení', 'modernizace legacy', 'vývoj api', 'optimalizace výkonu', 'blockchain řešení'],
            de: ['ki integration', 'geschäftsautomatisierung', 'digitale transformation', 'cloud migration', 'datenanalyse', 'unternehmenslösungen', 'legacy modernisierung', 'api entwicklung', 'leistungsoptimierung', 'blockchain lösungen'],
            fr: ['intégration ia', 'automatisation entreprise', 'transformation digitale', 'migration cloud', 'analyse données', 'solutions entreprise', 'modernisation legacy', 'développement api', 'optimisation performances', 'solutions blockchain']
        };
        
        return keywordMap[language] || keywordMap.en;
    }

    /**
     * Check for language-specific content
     */
    hasLanguageSpecificContent(content, language) {
        const languageIndicators = {
            cs: ['česká', 'české', 'český', 'praha', 'čr'],
            de: ['deutsche', 'deutschen', 'deutschland', 'berlin', 'münchen'],
            fr: ['française', 'français', 'france', 'paris', 'lyon']
        };
        
        if (language === 'en') return true;
        
        const indicators = languageIndicators[language] || [];
        return indicators.some(indicator => content.toLowerCase().includes(indicator));
    }

    /**
     * Check for professional terminology
     */
    hasProfessionalTerminology(content, language) {
        const professionalTerms = {
            en: ['enterprise', 'solution', 'technology', 'implementation', 'optimization', 'integration', 'development', 'consulting', 'services'],
            cs: ['podnikové', 'řešení', 'technologie', 'implementace', 'optimalizace', 'integrace', 'vývoj', 'konzultace', 'služby'],
            de: ['unternehmen', 'lösung', 'technologie', 'implementierung', 'optimierung', 'integration', 'entwicklung', 'beratung', 'dienstleistungen'],
            fr: ['entreprise', 'solution', 'technologie', 'implémentation', 'optimisation', 'intégration', 'développement', 'conseil', 'services']
        };
        
        const terms = professionalTerms[language] || professionalTerms.en;
        const contentLower = content.toLowerCase();
        
        return terms.some(term => contentLower.includes(term));
    }

    /**
     * Parse frontmatter
     */
    parseFrontmatter(frontmatterText) {
        const lines = frontmatterText.split('\n');
        const result = {};
        
        lines.forEach(line => {
            const colonIndex = line.indexOf(':');
            if (colonIndex > 0) {
                const key = line.substring(0, colonIndex).trim();
                let value = line.substring(colonIndex + 1).trim();
                
                // Remove quotes if present
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.substring(1, value.length - 1);
                }
                
                if (key === 'tags' || key === 'keywords') {
                    result[key] = value.replace(/[\[\]]/g, '').split(',').map(tag => tag.trim());
                } else {
                    result[key] = value;
                }
            }
        });
        
        return result;
    }

    /**
     * Get file path for solution
     */
    getFilePath(language, solution) {
        const solutionMap = {
            'ai-integration': {
                cs: 'ai-integrace',
                de: 'ki-integration', 
                fr: 'integration-ia',
                en: 'ai-integration'
            },
            'business-automation': {
                cs: 'podnikova-automatizace',
                de: 'geschaeftsautomatisierung',
                fr: 'automatisation-entreprise',
                en: 'business-automation'
            },
            'digital-transformation': {
                cs: 'digitalni-transformace',
                de: 'digitale-transformation',
                fr: 'transformation-digitale',
                en: 'digital-transformation'
            },
            'cloud-migration': {
                cs: 'migrace-do-cloudu',
                de: 'cloud-migration',
                fr: 'migration-cloud',
                en: 'cloud-migration'
            },
            'data-analytics': {
                cs: 'analyza-dat',
                de: 'datenanalyse',
                fr: 'analyse-donnees',
                en: 'data-analytics'
            },
            'enterprise-solutions': {
                cs: 'podnikova-reseni',
                de: 'unternehmensloesungen',
                fr: 'solutions-entreprise',
                en: 'enterprise-solutions'
            },
            'legacy-modernization': {
                cs: 'modernizace-legacy-systemu',
                de: 'legacy-modernisierung',
                fr: 'modernisation-legacy',
                en: 'legacy-modernization'
            },
            'api-development': {
                cs: 'vyvoj-api',
                de: 'api-entwicklung',
                fr: 'developpement-api',
                en: 'api-development'
            },
            'performance-optimization': {
                cs: 'optimalizace-vykonu',
                de: 'leistungsoptimierung',
                fr: 'optimisation-performances',
                en: 'performance-optimization'
            },
            'blockchain-solutions': {
                cs: 'blockchain-reseni',
                de: 'blockchain-loesungen',
                fr: 'solutions-blockchain',
                en: 'blockchain-solutions'
            }
        };
        
        const fileName = solutionMap[solution]?.[language] || solution;
        return path.join(this.contentDir, language, 'solutions', `${fileName}.md`);
    }

    /**
     * Generate SEO report
     */
    generateReport() {
        console.log('\n📈 SEO Enhancement Report');
        console.log('========================');
        console.log(`Total Pages Analyzed: ${this.seoMetrics.totalPages}`);
        console.log(`Average Content Length: ${this.seoMetrics.averageContentLength} lines`);
        
        // Calculate average SEO scores by language
        const languageScores = {};
        this.languages.forEach(lang => {
            const scores = Object.keys(this.seoMetrics.seoScores)
                .filter(key => key.startsWith(lang))
                .map(key => this.seoMetrics.seoScores[key]);
            
            if (scores.length > 0) {
                languageScores[lang] = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
            }
        });
        
        console.log('\n📊 Average SEO Scores by Language:');
        Object.entries(languageScores).forEach(([lang, score]) => {
            console.log(`  ${lang.toUpperCase()}: ${score}/100`);
        });
        
        // Overall system score
        const overallScore = Math.round(
            Object.values(this.seoMetrics.seoScores).reduce((a, b) => a + b, 0) / 
            Object.keys(this.seoMetrics.seoScores).length
        );
        
        console.log(`\n🏆 Overall System SEO Score: ${overallScore}/100`);
        
        if (overallScore >= 90) {
            console.log('✅ Excellent SEO performance!');
        } else if (overallScore >= 80) {
            console.log('🟡 Good SEO performance - minor improvements possible');
        } else {
            console.log('🔴 SEO performance needs improvement');
        }
        
        return {
            overallScore,
            languageScores,
            metrics: this.seoMetrics
        };
    }

    /**
     * Run complete SEO analysis
     */
    async run() {
        try {
            console.log('🚀 Starting SEO Enhancement Analysis...\n');
            
            await this.analyzeSEO();
            const report = this.generateReport();
            
            console.log('\n✅ SEO analysis complete!');
            return report;
            
        } catch (error) {
            console.error('❌ Error during SEO analysis:', error);
            throw error;
        }
    }
}

// Export for use in other scripts
module.exports = SEOEnhancement;

// Run if called directly
if (require.main === module) {
    const seoEnhancement = new SEOEnhancement();
    seoEnhancement.run()
        .then(report => {
            console.log('\n🎉 SEO Enhancement complete!');
            process.exit(0);
        })
        .catch(error => {
            console.error('💥 SEO Enhancement failed:', error);
            process.exit(1);
        });
} 