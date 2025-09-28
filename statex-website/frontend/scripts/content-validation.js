/**
 * Content Validation System for Multilingual Solution Pages
 * 
 * This script validates all content files to ensure they meet quality standards,
 * SEO requirements, and consistency across all languages.
 * 
 * Features:
 * - Content quality validation
 * - SEO compliance checking
 * - Cross-language consistency verification
 * - Performance optimization validation
 * - Professional terminology verification
 */

const fs = require('fs');
const path = require('path');

class ContentValidator {
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
        
        this.validationResults = {
            totalFiles: 0,
            passedValidation: 0,
            failedValidation: 0,
            warnings: [],
            errors: [],
            qualityScores: {},
            consistencyIssues: []
        };
        
        this.qualityStandards = {
            minContentLength: 150,
            maxContentLength: 500,
            minHeadings: 5,
            minInternalLinks: 1,
            requiredSections: [
                'Why',
                'Our Approach',
                'Services',
                'Technology Stack'
            ]
        };
    }

    /**
     * Run complete content validation
     */
    async validateAllContent() {
        console.log('🔍 Starting comprehensive content validation...\n');
        
        for (const language of this.languages) {
            console.log(`📊 Validating ${language.toUpperCase()} content...`);
            
            for (const solution of this.solutions) {
                const filePath = this.getFilePath(language, solution);
                
                if (fs.existsSync(filePath)) {
                    const content = fs.readFileSync(filePath, 'utf8');
                    const validation = this.validateContent(content, language, solution);
                    
                    this.validationResults.totalFiles++;
                    
                    if (validation.isValid) {
                        this.validationResults.passedValidation++;
                        console.log(`  ✅ ${solution}: PASSED (${validation.qualityScore}/100)`);
                    } else {
                        this.validationResults.failedValidation++;
                        console.log(`  ❌ ${solution}: FAILED (${validation.qualityScore}/100)`);
                        this.validationResults.errors.push(...validation.errors);
                    }
                    
                    if (validation.warnings.length > 0) {
                        this.validationResults.warnings.push(...validation.warnings);
                    }
                    
                    this.validationResults.qualityScores[`${language}-${solution}`] = validation.qualityScore;
                }
            }
        }
        
        // Cross-language consistency check
        this.validateCrossLanguageConsistency();
        
        return this.validationResults;
    }

    /**
     * Validate individual content file
     */
    validateContent(content, language, solution) {
        const validation = {
            isValid: true,
            qualityScore: 0,
            errors: [],
            warnings: []
        };
        
        // Parse frontmatter
        const frontmatter = this.parseFrontmatter(content);
        
        // Validate frontmatter
        const frontmatterValidation = this.validateFrontmatter(frontmatter, language, solution);
        validation.errors.push(...frontmatterValidation.errors);
        validation.warnings.push(...frontmatterValidation.warnings);
        
        // Validate content structure
        const structureValidation = this.validateContentStructure(content);
        validation.errors.push(...structureValidation.errors);
        validation.warnings.push(...structureValidation.warnings);
        
        // Validate SEO elements
        const seoValidation = this.validateSEOElements(content, frontmatter, language);
        validation.errors.push(...seoValidation.errors);
        validation.warnings.push(...seoValidation.warnings);
        
        // Validate professional quality
        const qualityValidation = this.validateProfessionalQuality(content, language);
        validation.errors.push(...qualityValidation.errors);
        validation.warnings.push(...qualityValidation.warnings);
        
        // Calculate quality score
        validation.qualityScore = this.calculateQualityScore(content, frontmatter, language);
        
        // Determine if validation passed
        validation.isValid = validation.errors.length === 0 && validation.qualityScore >= 80;
        
        return validation;
    }

    /**
     * Validate frontmatter
     */
    validateFrontmatter(frontmatter, language, solution) {
        const validation = { errors: [], warnings: [] };
        
        // Required fields
        const requiredFields = ['title', 'description', 'author', 'publishDate', 'category', 'tags', 'language', 'template', 'seo'];
        
        requiredFields.forEach(field => {
            if (!frontmatter[field]) {
                validation.errors.push(`Missing required field: ${field}`);
            }
        });
        
        // Title validation
        if (frontmatter.title) {
            if (frontmatter.title.length < 10) {
                validation.errors.push('Title too short (minimum 10 characters)');
            } else if (frontmatter.title.length > 60) {
                validation.warnings.push('Title too long (recommended < 60 characters)');
            }
        }
        
        // Description validation
        if (frontmatter.description) {
            if (frontmatter.description.length < 50) {
                validation.errors.push('Description too short (minimum 50 characters)');
            } else if (frontmatter.description.length > 160) {
                validation.warnings.push('Description too long (recommended < 160 characters)');
            }
        }
        
        // Language validation
        if (frontmatter.language !== language) {
            validation.errors.push(`Language mismatch: expected ${language}, got ${frontmatter.language}`);
        }
        
        // SEO validation
        if (frontmatter.seo) {
            if (!frontmatter.seo.keywords || frontmatter.seo.keywords.length < 3) {
                validation.errors.push('SEO keywords missing or insufficient (minimum 3 keywords)');
            }
            
            if (!frontmatter.seo.metaDescription) {
                validation.errors.push('SEO meta description missing');
            }
        }
        
        return validation;
    }

    /**
     * Validate content structure
     */
    validateContentStructure(content) {
        const validation = { errors: [], warnings: [] };
        
        const lines = content.split('\n');
        const contentLength = lines.length;
        
        // Content length validation
        if (contentLength < this.qualityStandards.minContentLength) {
            validation.errors.push(`Content too short: ${contentLength} lines (minimum ${this.qualityStandards.minContentLength})`);
        } else if (contentLength > this.qualityStandards.maxContentLength) {
            validation.warnings.push(`Content very long: ${contentLength} lines (recommended < ${this.qualityStandards.maxContentLength})`);
        }
        
        // Headings validation
        const headings = content.match(/^#{1,6}\s+.+$/gm) || [];
        if (headings.length < this.qualityStandards.minHeadings) {
            validation.errors.push(`Insufficient headings: ${headings.length} (minimum ${this.qualityStandards.minHeadings})`);
        }
        
        // Required sections validation
        this.qualityStandards.requiredSections.forEach(section => {
            const sectionRegex = new RegExp(`^#{1,3}\\s+.*${section}.*$`, 'gm');
            if (!sectionRegex.test(content)) {
                validation.warnings.push(`Recommended section missing: ${section}`);
            }
        });
        
        // Internal links validation
        const internalLinks = content.match(/\[([^\]]+)\]\([^)]+\)/g) || [];
        if (internalLinks.length < this.qualityStandards.minInternalLinks) {
            validation.warnings.push(`Few internal links: ${internalLinks.length} (recommended ${this.qualityStandards.minInternalLinks}+)`);
        }
        
        return validation;
    }

    /**
     * Validate SEO elements
     */
    validateSEOElements(content, frontmatter, language) {
        const validation = { errors: [], warnings: [] };
        
        // Keyword density check
        if (frontmatter.seo && frontmatter.seo.keywords) {
            const keywords = frontmatter.seo.keywords;
            const contentLower = content.toLowerCase();
            
            keywords.forEach(keyword => {
                const keywordLower = keyword.toLowerCase();
                const matches = (contentLower.match(new RegExp(keywordLower, 'g')) || []).length;
                
                if (matches === 0) {
                    validation.errors.push(`Keyword not found in content: ${keyword}`);
                } else if (matches < 2) {
                    validation.warnings.push(`Low keyword frequency: ${keyword} (${matches} occurrences)`);
                }
            });
        }
        
        // Meta description quality
        if (frontmatter.seo && frontmatter.seo.metaDescription) {
            const desc = frontmatter.seo.metaDescription;
            
            if (!desc.includes('Statex')) {
                validation.warnings.push('Meta description should mention Statex');
            }
            
            if (!desc.includes('solutions') && !desc.includes('services')) {
                validation.warnings.push('Meta description should mention solutions or services');
            }
        }
        
        return validation;
    }

    /**
     * Validate professional quality
     */
    validateProfessionalQuality(content, language) {
        const validation = { errors: [], warnings: [] };
        
        // Professional terminology check
        const professionalTerms = this.getProfessionalTerms(language);
        const contentLower = content.toLowerCase();
        let foundTerms = 0;
        
        professionalTerms.forEach(term => {
            if (contentLower.includes(term.toLowerCase())) {
                foundTerms++;
            }
        });
        
        if (foundTerms < 3) {
            validation.warnings.push(`Limited professional terminology: ${foundTerms} terms found`);
        }
        
        // Language-specific content check
        if (!this.hasLanguageSpecificContent(content, language)) {
            validation.warnings.push('Content lacks language-specific elements');
        }
        
        // Technical depth check
        const technicalIndicators = ['technology', 'implementation', 'architecture', 'framework', 'platform', 'integration'];
        const technicalMatches = technicalIndicators.filter(term => contentLower.includes(term));
        
        if (technicalMatches.length < 2) {
            validation.warnings.push('Content may lack technical depth');
        }
        
        return validation;
    }

    /**
     * Calculate quality score
     */
    calculateQualityScore(content, frontmatter, language) {
        let score = 0;
        const maxScore = 100;
        
        // Content length (20 points)
        const contentLength = content.split('\n').length;
        if (contentLength >= 200) score += 20;
        else if (contentLength >= 150) score += 18;
        else if (contentLength >= 100) score += 15;
        else if (contentLength >= 50) score += 10;
        
        // Frontmatter completeness (20 points)
        const requiredFields = ['title', 'description', 'author', 'publishDate', 'category', 'tags', 'language', 'template', 'seo'];
        const completeFields = requiredFields.filter(field => frontmatter[field]);
        score += (completeFields.length / requiredFields.length) * 20;
        
        // SEO optimization (20 points)
        if (frontmatter.seo && frontmatter.seo.keywords && frontmatter.seo.keywords.length >= 3) score += 10;
        if (frontmatter.seo && frontmatter.seo.metaDescription) score += 10;
        
        // Content structure (20 points)
        const headings = content.match(/^#{1,6}\s+.+$/gm) || [];
        if (headings.length >= 5) score += 20;
        else if (headings.length >= 3) score += 15;
        else if (headings.length >= 1) score += 10;
        
        // Professional quality (20 points)
        const professionalTerms = this.getProfessionalTerms(language);
        const contentLower = content.toLowerCase();
        const foundTerms = professionalTerms.filter(term => contentLower.includes(term.toLowerCase())).length;
        score += Math.min((foundTerms / professionalTerms.length) * 20, 20);
        
        return Math.min(score, maxScore);
    }

    /**
     * Validate cross-language consistency
     */
    validateCrossLanguageConsistency() {
        console.log('\n🔗 Validating cross-language consistency...');
        
        for (const solution of this.solutions) {
            const languageContents = {};
            
            // Collect content from all languages
            for (const language of this.languages) {
                const filePath = this.getFilePath(language, solution);
                if (fs.existsSync(filePath)) {
                    const content = fs.readFileSync(filePath, 'utf8');
                    const frontmatter = this.parseFrontmatter(content);
                    languageContents[language] = {
                        content: content,
                        frontmatter: frontmatter,
                        sections: this.extractSections(content)
                    };
                }
            }
            
            // Compare structure across languages
            this.compareLanguageStructures(languageContents, solution);
        }
    }

    /**
     * Compare language structures
     */
    compareLanguageStructures(languageContents, solution) {
        const languages = Object.keys(languageContents);
        if (languages.length < 2) return;
        
        const referenceLanguage = languages[0];
        const referenceSections = languageContents[referenceLanguage].sections;
        
        for (let i = 1; i < languages.length; i++) {
            const language = languages[i];
            const sections = languageContents[language].sections;
            
            // Check for missing sections
            referenceSections.forEach(section => {
                if (!sections.includes(section)) {
                    this.validationResults.consistencyIssues.push(
                        `Missing section in ${language}: ${section} (${solution})`
                    );
                }
            });
            
            // Check for extra sections
            sections.forEach(section => {
                if (!referenceSections.includes(section)) {
                    this.validationResults.warnings.push(
                        `Extra section in ${language}: ${section} (${solution})`
                    );
                }
            });
        }
    }

    /**
     * Extract sections from content
     */
    extractSections(content) {
        const headings = content.match(/^#{1,3}\s+(.+)$/gm) || [];
        return headings.map(heading => heading.replace(/^#{1,3}\s+/, '').trim());
    }

    /**
     * Get professional terms for language
     */
    getProfessionalTerms(language) {
        const terms = {
            en: ['enterprise', 'solution', 'technology', 'implementation', 'optimization', 'integration', 'development', 'consulting', 'services', 'platform', 'architecture'],
            cs: ['podnikové', 'řešení', 'technologie', 'implementace', 'optimalizace', 'integrace', 'vývoj', 'konzultace', 'služby', 'platforma', 'architektura'],
            de: ['unternehmen', 'lösung', 'technologie', 'implementierung', 'optimierung', 'integration', 'entwicklung', 'beratung', 'dienstleistungen', 'plattform', 'architektur'],
            fr: ['entreprise', 'solution', 'technologie', 'implémentation', 'optimisation', 'intégration', 'développement', 'conseil', 'services', 'plateforme', 'architecture']
        };
        
        return terms[language] || terms.en;
    }

    /**
     * Check for language-specific content
     */
    hasLanguageSpecificContent(content, language) {
        const indicators = {
            cs: ['česká', 'české', 'český', 'praha', 'čr', 'české republice'],
            de: ['deutsche', 'deutschen', 'deutschland', 'berlin', 'münchen', 'bundesrepublik'],
            fr: ['française', 'français', 'france', 'paris', 'lyon', 'république française']
        };
        
        if (language === 'en') return true;
        
        const languageIndicators = indicators[language] || [];
        return languageIndicators.some(indicator => content.toLowerCase().includes(indicator));
    }

    /**
     * Parse frontmatter
     */
    parseFrontmatter(content) {
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (!frontmatterMatch) return {};
        
        const frontmatterText = frontmatterMatch[1];
        const lines = frontmatterText.split('\n');
        const result = {};
        let currentObject = null;
        let currentKey = null;
        
        lines.forEach(line => {
            const trimmedLine = line.trim();
            
            // Skip empty lines
            if (!trimmedLine) return;
            
            // Check if this is a nested object start
            if (trimmedLine.endsWith(':')) {
                const key = trimmedLine.slice(0, -1).trim();
                if (key === 'seo') {
                    currentObject = 'seo';
                    result.seo = {};
                } else {
                    currentObject = null;
                    currentKey = key;
                }
                return;
            }
            
            // Handle nested object properties
            if (currentObject === 'seo' && trimmedLine.includes(':')) {
                const colonIndex = trimmedLine.indexOf(':');
                const key = trimmedLine.substring(0, colonIndex).trim();
                let value = trimmedLine.substring(colonIndex + 1).trim();
                
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.substring(1, value.length - 1);
                }
                
                if (key === 'keywords') {
                    result.seo[key] = value.replace(/[\[\]]/g, '').split(',').map(tag => tag.trim());
                } else {
                    result.seo[key] = value;
                }
                return;
            }
            
            // Handle regular key-value pairs
            const colonIndex = trimmedLine.indexOf(':');
            if (colonIndex > 0) {
                const key = trimmedLine.substring(0, colonIndex).trim();
                let value = trimmedLine.substring(colonIndex + 1).trim();
                
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.substring(1, value.length - 1);
                }
                
                if (key === 'tags') {
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
     * Generate validation report
     */
    generateReport() {
        console.log('\n📊 Content Validation Report');
        console.log('===========================');
        console.log(`Total Files: ${this.validationResults.totalFiles}`);
        console.log(`Passed Validation: ${this.validationResults.passedValidation}`);
        console.log(`Failed Validation: ${this.validationResults.failedValidation}`);
        console.log(`Success Rate: ${Math.round((this.validationResults.passedValidation / this.validationResults.totalFiles) * 100)}%`);
        
        // Calculate average quality score
        const scores = Object.values(this.validationResults.qualityScores);
        const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        console.log(`Average Quality Score: ${averageScore}/100`);
        
        // Language-specific scores
        console.log('\n📈 Quality Scores by Language:');
        this.languages.forEach(lang => {
            const langScores = Object.keys(this.validationResults.qualityScores)
                .filter(key => key.startsWith(lang))
                .map(key => this.validationResults.qualityScores[key]);
            
            if (langScores.length > 0) {
                const avgScore = Math.round(langScores.reduce((a, b) => a + b, 0) / langScores.length);
                console.log(`  ${lang.toUpperCase()}: ${avgScore}/100`);
            }
        });
        
        // Display errors and warnings
        if (this.validationResults.errors.length > 0) {
            console.log('\n❌ Validation Errors:');
            this.validationResults.errors.slice(0, 10).forEach(error => {
                console.log(`  - ${error}`);
            });
            if (this.validationResults.errors.length > 10) {
                console.log(`  ... and ${this.validationResults.errors.length - 10} more errors`);
            }
        }
        
        if (this.validationResults.warnings.length > 0) {
            console.log('\n⚠️ Validation Warnings:');
            this.validationResults.warnings.slice(0, 10).forEach(warning => {
                console.log(`  - ${warning}`);
            });
            if (this.validationResults.warnings.length > 10) {
                console.log(`  ... and ${this.validationResults.warnings.length - 10} more warnings`);
            }
        }
        
        if (this.validationResults.consistencyIssues.length > 0) {
            console.log('\n🔗 Consistency Issues:');
            this.validationResults.consistencyIssues.slice(0, 5).forEach(issue => {
                console.log(`  - ${issue}`);
            });
        }
        
        // Overall assessment
        console.log('\n🏆 Overall Assessment:');
        if (this.validationResults.failedValidation === 0 && averageScore >= 90) {
            console.log('✅ EXCELLENT - All content meets high-quality standards');
        } else if (this.validationResults.failedValidation === 0 && averageScore >= 80) {
            console.log('🟡 GOOD - Content meets quality standards with minor improvements possible');
        } else {
            console.log('🔴 NEEDS IMPROVEMENT - Some content requires attention');
        }
        
        return {
            totalFiles: this.validationResults.totalFiles,
            passedValidation: this.validationResults.passedValidation,
            failedValidation: this.validationResults.failedValidation,
            averageScore,
            errors: this.validationResults.errors,
            warnings: this.validationResults.warnings,
            consistencyIssues: this.validationResults.consistencyIssues
        };
    }

    /**
     * Run complete validation
     */
    async run() {
        try {
            console.log('🚀 Starting Content Validation...\n');
            
            await this.validateAllContent();
            const report = this.generateReport();
            
            console.log('\n✅ Content validation complete!');
            return report;
            
        } catch (error) {
            console.error('❌ Error during content validation:', error);
            throw error;
        }
    }
}

// Export for use in other scripts
module.exports = ContentValidator;

// Run if called directly
if (require.main === module) {
    const validator = new ContentValidator();
    validator.run()
        .then(report => {
            console.log('\n🎉 Content validation complete!');
            process.exit(report.failedValidation === 0 ? 0 : 1);
        })
        .catch(error => {
            console.error('💥 Content validation failed:', error);
            process.exit(1);
        });
} 