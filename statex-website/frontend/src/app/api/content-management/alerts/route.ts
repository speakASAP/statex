import { NextRequest, NextResponse } from 'next/server';
import { ContentValidator } from '@/lib/content/ContentValidator';
import { ContentLoader } from '@/lib/content/contentLoader';
import { ContentType } from '@/lib/content/types';
import path from 'path';

interface AlertItem {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  contentType?: ContentType;
  language?: string;
  slug?: string;
}

export async function GET(request: NextRequest) {
  try {
    const contentDir = path.join(process.cwd(), 'src/content');
    const validator = new ContentValidator(contentDir);
    const contentLoader = new ContentLoader(contentDir);
    
    const alerts: AlertItem[] = [];
    
    // Generate alerts based on validation results
    const validationReport = await validator.validateAllTranslations();
    
    // Critical alerts for missing translations
    let criticalMissingCount = 0;
    for (const result of validationReport.results || []) {
      if (!result.isValid && result.missingLanguages.length > 0) {
        criticalMissingCount++;
        
        // Create alert for content with missing translations in multiple languages
        if (result.missingLanguages.length >= 2) {
          alerts.push({
            id: `missing-${result.contentType}-${result.englishSlug}`,
            type: 'error',
            title: 'Critical Translation Gap',
            message: `${result.englishSlug} is missing translations in ${result.missingLanguages.length} languages: ${result.missingLanguages.join(', ')}`,
            timestamp: new Date(),
            contentType: result.contentType,
            slug: result.englishSlug
          });
        }
        
        // Create warning for single missing translation
        if (result.missingLanguages.length === 1) {
          alerts.push({
            id: `warning-${result.contentType}-${result.englishSlug}-${result.missingLanguages[0]}`,
            type: 'warning',
            title: 'Missing Translation',
            message: `${result.englishSlug} needs translation to ${result.missingLanguages[0].toUpperCase()}`,
            timestamp: new Date(),
            contentType: result.contentType,
            language: result.missingLanguages[0],
            slug: result.englishSlug
          });
        }
      }
      
      // Alerts for structural inconsistencies
      if (result.structuralInconsistencies.length > 0) {
        alerts.push({
          id: `structure-${result.contentType}-${result.englishSlug}`,
          type: 'warning',
          title: 'Structural Inconsistency',
          message: `${result.englishSlug} has structural issues: ${result.structuralInconsistencies.join(', ')}`,
          timestamp: new Date(),
          contentType: result.contentType,
          slug: result.englishSlug
        });
      }
    }
    
    // Summary alert if there are many missing translations
    if (criticalMissingCount > 10) {
      alerts.unshift({
        id: 'summary-critical',
        type: 'error',
        title: 'High Number of Missing Translations',
        message: `${criticalMissingCount} pieces of content have missing translations. Immediate attention required.`,
        timestamp: new Date()
      });
    }
    
    // Content loading pipeline validation
    try {
      const pipelineValidation = await validator.validateContentLoadingPipeline();
      if (!pipelineValidation.isValid) {
        alerts.push({
          id: 'pipeline-error',
          type: 'error',
          title: 'Content Loading Pipeline Issues',
          message: `Pipeline validation failed: ${pipelineValidation.errors.join(', ')}`,
          timestamp: new Date()
        });
      }
    } catch (error) {
      alerts.push({
        id: 'pipeline-check-error',
        type: 'warning',
        title: 'Pipeline Check Failed',
        message: 'Unable to validate content loading pipeline. Manual check recommended.',
        timestamp: new Date()
      });
    }
    
    // Performance alerts (simulated - in real implementation, these would come from monitoring)
    const contentStats = await contentLoader.getContentStatistics();
    if (contentStats.totalContent > 200) {
      alerts.push({
        id: 'performance-warning',
        type: 'info',
        title: 'Large Content Volume',
        message: `${contentStats.totalContent} pieces of content detected. Consider implementing content pagination for better performance.`,
        timestamp: new Date()
      });
    }
    
    // Sort alerts by severity and timestamp
    const sortedAlerts = alerts.sort((a, b) => {
      const severityOrder = { error: 3, warning: 2, info: 1 };
      const severityDiff = severityOrder[b.type] - severityOrder[a.type];
      if (severityDiff !== 0) return severityDiff;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
    
    return NextResponse.json(sortedAlerts);
  } catch (error) {
    console.error('Error generating alerts:', error);
    return NextResponse.json(
      { error: 'Failed to generate alerts' },
      { status: 500 }
    );
  }
}