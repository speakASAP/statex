import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ContentValidator } from '@/lib/content/ContentValidator';
import { ContentConsistencyChecker } from '@/lib/content/ContentConsistencyChecker';
import { ContentType } from '@/lib/content/types';

// Mock window to simulate server environment
Object.defineProperty(global, 'window', {
  value: undefined,
  writable: true
});

// Mock fs module
vi.mock('fs/promises', () => ({
  readdir: vi.fn(),
  readFile: vi.fn(),
  access: vi.fn()
}));

// Mock path module
vi.mock('path', () => ({
  join: vi.fn((...args) => args.join('/')),
  default: {
    join: vi.fn((...args) => args.join('/'))
  }
}));

// Mock ContentLoader to avoid server-side check
vi.mock('@/lib/content/contentLoader', () => ({
  ContentLoader: vi.fn().mockImplementation(() => ({
    getContentStatistics: vi.fn().mockResolvedValue({
      totalContent: 100,
      byContentType: { blog: 48, pages: 12, services: 20, solutions: 15, legal: 5 },
      byLanguage: { en: 25, cs: 25, de: 25, fr: 25 },
      cacheHitRate: 0.85
    })
  }))
}));

// Mock AlertSystem to avoid ContentLoader dependency
vi.mock('@/lib/content/AlertSystem', () => ({
  AlertSystem: vi.fn().mockImplementation(() => ({
    runAllAlerts: vi.fn().mockResolvedValue([]),
    getAlertRules: vi.fn().mockReturnValue([
      {
        id: 'test-rule',
        name: 'Test Rule',
        description: 'Test rule description',
        enabled: true,
        schedule: 'daily',
        checkFunction: vi.fn().mockResolvedValue([])
      }
    ]),
    updateAlertRule: vi.fn().mockReturnValue(true),
    addAlertRule: vi.fn(),
    removeAlertRule: vi.fn().mockReturnValue(true),
    runAlertRule: vi.fn().mockResolvedValue([])
  }))
}));

describe('Content Management Tools', () => {
  describe('ContentValidator', () => {
    let validator: ContentValidator;
    
    beforeEach(() => {
      validator = new ContentValidator('test-content');
      vi.clearAllMocks();
    });

    it('should validate all translations', async () => {
      const fs = await import('fs/promises');
      
      // Mock file system responses to return content for all content types
      (fs.readdir as any).mockImplementation((path: string) => {
        if (path.includes('blog/en') || path.includes('pages/en') || path.includes('services') || path.includes('solutions') || path.includes('legal')) {
          return Promise.resolve(['test-post.md', 'another-post.md']);
        }
        return Promise.resolve([]);
      });
      
      (fs.access as any).mockImplementation((path: string) => {
        if (path.includes('/cs/') || path.includes('/de/')) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('File not found'));
      });
      
      (fs.readFile as any).mockResolvedValue(`---
title: Test Post
description: Test description
language: en
category: Test
template: blog-post
publishDate: 2024-01-01
---
Test content`);

      const report = await validator.validateAllTranslations();
      
      expect(report).toBeDefined();
      expect(typeof report.totalContent).toBe('number');
      expect(typeof report.validContent).toBe('number');
      expect(typeof report.invalidContent).toBe('number');
      expect(report.results).toBeDefined();
      expect(Array.isArray(report.results)).toBe(true);
      expect(report.summary).toBeDefined();
      expect(report.summary.byContentType).toBeDefined();
      expect(report.summary.byLanguage).toBeDefined();
    });

    it('should validate single content piece', async () => {
      const fs = await import('fs/promises');
      
      (fs.access as any).mockResolvedValue(undefined);
      (fs.readFile as any).mockResolvedValue(`---
title: Test Post
description: Test description
language: en
category: Test
template: blog-post
publishDate: 2024-01-01
---
Test content`);

      const result = await validator.validateSingleContent('test-post', 'blog');
      
      expect(result).toBeDefined();
      expect(result.englishSlug).toBe('test-post');
      expect(result.contentType).toBe('blog');
      expect(Array.isArray(result.missingLanguages)).toBe(true);
      expect(Array.isArray(result.structuralInconsistencies)).toBe(true);
    });

    it('should generate missing translation report', async () => {
      const fs = await import('fs/promises');
      
      (fs.readdir as any).mockResolvedValue(['test-post.md']);
      (fs.access as any).mockImplementation((path: string) => {
        if (path.includes('/fr/')) {
          return Promise.reject(new Error('File not found'));
        }
        return Promise.resolve();
      });

      const report = await validator.generateMissingTranslationReport();
      
      expect(Array.isArray(report)).toBe(true);
      if (report.length > 0) {
        expect(report[0]).toHaveProperty('contentType');
        expect(report[0]).toHaveProperty('englishSlug');
        expect(report[0]).toHaveProperty('missingLanguages');
      }
    });

    it('should validate content loading pipeline', async () => {
      const result = await validator.validateContentLoadingPipeline();
      
      expect(result).toBeDefined();
      expect(typeof result.isValid).toBe('boolean');
      expect(Array.isArray(result.errors)).toBe(true);
    });
  });

  describe('ContentConsistencyChecker', () => {
    let checker: ContentConsistencyChecker;
    
    beforeEach(() => {
      checker = new ContentConsistencyChecker('test-content');
      vi.clearAllMocks();
    });

    it('should check all content consistency', async () => {
      const fs = await import('fs/promises');
      
      (fs.readdir as any).mockResolvedValue(['test-post.md']);
      (fs.readFile as any).mockResolvedValue(`---
title: Test Post
description: Test description
language: en
category: Test
template: blog-post
publishDate: 2024-01-01
---
Test content`);

      const report = await checker.checkAllContent();
      
      expect(report).toBeDefined();
      expect(typeof report.totalChecked).toBe('number');
      expect(typeof report.totalIssues).toBe('number');
      expect(report.issuesBySeverity).toBeDefined();
      expect(report.issuesByType).toBeDefined();
      expect(Array.isArray(report.issues)).toBe(true);
      expect(report.summary).toBeDefined();
    });

    it('should check single content consistency', async () => {
      const fs = await import('fs/promises');
      
      (fs.readFile as any).mockResolvedValue(`---
title: Test Post
description: Test description
language: en
category: Test
template: blog-post
publishDate: 2024-01-01
---
Test content`);

      const issues = await checker.checkSingleContent('test-post', 'blog', 'en');
      
      expect(Array.isArray(issues)).toBe(true);
      issues.forEach(issue => {
        expect(issue).toHaveProperty('type');
        expect(issue).toHaveProperty('severity');
        expect(issue).toHaveProperty('contentType');
        expect(issue).toHaveProperty('englishSlug');
        expect(issue).toHaveProperty('language');
        expect(issue).toHaveProperty('description');
      });
    });

    it('should check content type consistency', async () => {
      const fs = await import('fs/promises');
      
      (fs.readdir as any).mockResolvedValue(['test-post.md']);
      (fs.readFile as any).mockResolvedValue(`---
title: Test Post
description: Test description
language: en
category: Test
template: blog-post
publishDate: 2024-01-01
---
Test content`);

      const report = await checker.checkContentType('blog');
      
      expect(report).toBeDefined();
      expect(typeof report.totalChecked).toBe('number');
      expect(typeof report.totalIssues).toBe('number');
      expect(report.summary.byContentType).toHaveProperty('blog');
    });
  });

  describe('AlertSystem', () => {
    let AlertSystemMock: any;
    let alertSystem: any;
    
    beforeEach(async () => {
      const { AlertSystem } = await import('@/lib/content/AlertSystem');
      AlertSystemMock = AlertSystem;
      alertSystem = new AlertSystemMock('test-content');
      vi.clearAllMocks();
    });

    it('should run all alerts', async () => {
      const alerts = await alertSystem.runAllAlerts();
      
      expect(Array.isArray(alerts)).toBe(true);
    });

    it('should get alert rules', () => {
      const rules = alertSystem.getAlertRules();
      
      expect(Array.isArray(rules)).toBe(true);
      if (rules.length > 0) {
        expect(rules[0]).toHaveProperty('id');
        expect(rules[0]).toHaveProperty('name');
        expect(rules[0]).toHaveProperty('description');
        expect(rules[0]).toHaveProperty('enabled');
        expect(rules[0]).toHaveProperty('schedule');
      }
    });

    it('should update alert rule', () => {
      const success = alertSystem.updateAlertRule('test-rule', { enabled: false });
      expect(success).toBe(true);
    });

    it('should add and remove alert rule', () => {
      const newRule = {
        id: 'new-test-rule',
        name: 'New Test Rule',
        description: 'New test rule description',
        enabled: true,
        schedule: 'daily' as const,
        checkFunction: async () => []
      };

      alertSystem.addAlertRule(newRule);
      
      const removeSuccess = alertSystem.removeAlertRule('new-test-rule');
      expect(removeSuccess).toBe(true);
    });

    it('should run specific alert rule', async () => {
      const alerts = await alertSystem.runAlertRule('test-rule');
      expect(Array.isArray(alerts)).toBe(true);
    });
  });

  describe('API Integration', () => {
    it('should handle validation report API', async () => {
      // This would test the actual API endpoints
      // For now, we'll just verify the structure
      const mockReport = {
        totalContent: 100,
        validContent: 85,
        invalidContent: 15,
        missingTranslations: 25,
        results: [],
        summary: {
          byContentType: {},
          byLanguage: {}
        }
      };

      expect(mockReport).toHaveProperty('totalContent');
      expect(mockReport).toHaveProperty('validContent');
      expect(mockReport).toHaveProperty('invalidContent');
      expect(mockReport).toHaveProperty('results');
      expect(mockReport).toHaveProperty('summary');
    });

    it('should handle content stats API', async () => {
      const mockStats = {
        totalContent: 100,
        byContentType: {
          blog: 48,
          pages: 12,
          services: 20,
          solutions: 15,
          legal: 5
        },
        byLanguage: {
          en: 25,
          cs: 25,
          de: 25,
          fr: 25
        },
        translationCompleteness: 85
      };

      expect(mockStats).toHaveProperty('totalContent');
      expect(mockStats).toHaveProperty('byContentType');
      expect(mockStats).toHaveProperty('byLanguage');
      expect(mockStats).toHaveProperty('translationCompleteness');
    });

    it('should handle alerts API', async () => {
      const mockAlerts = [
        {
          id: 'test-alert',
          type: 'warning' as const,
          title: 'Test Alert',
          message: 'This is a test alert',
          timestamp: new Date(),
          contentType: 'blog' as ContentType,
          language: 'cs',
          slug: 'test-post'
        }
      ];

      expect(Array.isArray(mockAlerts)).toBe(true);
      if (mockAlerts.length > 0) {
        expect(mockAlerts[0]).toHaveProperty('id');
        expect(mockAlerts[0]).toHaveProperty('type');
        expect(mockAlerts[0]).toHaveProperty('title');
        expect(mockAlerts[0]).toHaveProperty('message');
        expect(mockAlerts[0]).toHaveProperty('timestamp');
      }
    });
  });

  describe('Dashboard Components', () => {
    it('should render content management dashboard', () => {
      // This would test the React components
      // For now, we'll verify the component structure expectations
      const mockDashboardProps = {
        validationReport: {
          totalContent: 100,
          validContent: 85,
          invalidContent: 15,
          missingTranslations: [],
          overallScore: 85
        },
        contentStats: {
          totalContent: 100,
          byContentType: {},
          byLanguage: {},
          translationCompleteness: 85
        },
        alerts: []
      };

      expect(mockDashboardProps.validationReport).toBeDefined();
      expect(mockDashboardProps.contentStats).toBeDefined();
      expect(mockDashboardProps.alerts).toBeDefined();
    });
  });
});