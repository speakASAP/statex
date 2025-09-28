# Content Management Tools

This document describes the comprehensive content management tools implemented for the multilingual translation system.

## Overview

The content management tools provide content managers with powerful capabilities to monitor, validate, and maintain the multilingual content across the entire Statex website. These tools ensure translation completeness, content consistency, and system reliability.

## Features

### 1. Translation Status Dashboard

A comprehensive web-based dashboard that provides real-time insights into the translation status of all content.

**Access:** `/dashboard/content-management`

**Features:**
- **Overview Tab:** High-level statistics and completion metrics
- **Validation Results:** Detailed validation results with filtering
- **Missing Translations:** Organized view of missing translations by content type
- **Alerts:** Real-time alerts for translation issues and system problems

### 2. Automated Translation Validation Reports

Automated system that continuously validates translation completeness and consistency.

**API Endpoints:**
- `GET /api/content-management/validation-report` - Get current validation report
- `POST /api/content-management/validation-report` - Generate new validation report

**Validation Checks:**
- Missing translations across all supported languages
- Structural consistency between source and translations
- Frontmatter completeness and accuracy
- Content type and template consistency

### 3. Missing Translation Detection

Intelligent system that identifies and reports missing translations across all content types.

**API Endpoint:**
- `GET /api/content-management/missing-translations`

**Detection Capabilities:**
- Identifies missing translations by content type
- Provides expected file paths for missing translations
- Groups missing translations by priority and content type
- Generates actionable reports for translation teams

### 4. Content Consistency Checking

Advanced consistency checker that ensures structural and metadata consistency across languages.

**API Endpoint:**
- `GET /api/content-management/consistency-check`
- `POST /api/content-management/consistency-check` - Check specific content

**Consistency Checks:**
- Frontmatter field completeness
- Language field accuracy
- Slug mapping consistency
- Metadata structure validation
- Cross-language structural comparison

### 5. Automated Alert System

Intelligent alert system that proactively identifies and reports translation issues.

**API Endpoint:**
- `GET /api/content-management/alert-system`
- `POST /api/content-management/alert-system`

**Alert Categories:**
- **Critical:** Missing translations in multiple languages
- **Warning:** Single missing translations, structural issues
- **Info:** Performance recommendations, system status

**Alert Rules:**
- Critical Missing Translations
- Structural Inconsistencies
- Content Loading Errors
- Translation Completeness Threshold
- Outdated Translations
- Performance Degradation

## Command Line Interface

A powerful CLI tool for content managers and developers to run validation and management tasks from the command line.

**Location:** `frontend/scripts/content-management-cli.js`

### Usage

```bash
# Run from the frontend directory
cd frontend

# Show help
node scripts/content-management-cli.js help

# Validate all content
node scripts/content-management-cli.js validate-all

# Validate specific content type
node scripts/content-management-cli.js validate-type blog
node scripts/content-management-cli.js validate-type services

# Generate missing translations report
node scripts/content-management-cli.js missing-translations

# Show content statistics
node scripts/content-management-cli.js stats
```

### CLI Commands

| Command | Description |
|---------|-------------|
| `validate-all` | Run complete validation report for all content |
| `validate-type <type>` | Validate specific content type (blog, pages, services, solutions, legal) |
| `missing-translations` | Generate comprehensive missing translations report |
| `stats` | Display content statistics by type and language |
| `help` | Show available commands and usage examples |

## Implementation Details

### Core Classes

#### ContentValidator
- **Purpose:** Validates translation completeness and consistency
- **Location:** `frontend/src/lib/content/ContentValidator.ts`
- **Key Methods:**
  - `validateAllTranslations()` - Complete validation across all content
  - `validateContentType()` - Validate specific content type
  - `validateSingleContent()` - Validate individual content piece
  - `generateMissingTranslationReport()` - Generate missing translation report

#### ContentConsistencyChecker
- **Purpose:** Checks structural and metadata consistency
- **Location:** `frontend/src/lib/content/ContentConsistencyChecker.ts`
- **Key Methods:**
  - `checkAllContent()` - Comprehensive consistency check
  - `checkContentType()` - Check specific content type
  - `checkSingleContent()` - Check individual content piece

#### AlertSystem
- **Purpose:** Automated alert generation and management
- **Location:** `frontend/src/lib/content/AlertSystem.ts`
- **Key Methods:**
  - `runAllAlerts()` - Execute all alert rules
  - `runAlertRule()` - Execute specific alert rule
  - `updateAlertRule()` - Modify alert rule configuration

### Dashboard Components

#### ContentManagementDashboard
- **Purpose:** Main dashboard interface
- **Location:** `frontend/src/components/dashboard/ContentManagementDashboard.tsx`
- **Features:**
  - Tabbed interface for different views
  - Real-time data loading and refresh
  - Interactive filtering and sorting
  - Alert management and dismissal

## Configuration

### Supported Languages
- English (en) - Source language
- Czech (cs)
- German (de)
- French (fr)

### Content Types
- Blog posts (`blog`)
- Pages (`pages`)
- Services (`services`)
- Solutions (`solutions`)
- Legal documents (`legal`)

### Alert Thresholds
- **Critical:** Missing translations in 3+ languages
- **Warning:** Missing translations in 1-2 languages
- **Performance:** Content volume > 500 pieces
- **Completeness:** Translation rate < 90%

## Monitoring and Maintenance

### Daily Tasks
1. Review dashboard alerts
2. Check translation completion rates
3. Validate new content additions
4. Monitor system performance

### Weekly Tasks
1. Generate comprehensive validation reports
2. Review consistency check results
3. Update alert rule configurations
4. Analyze content statistics trends

### Monthly Tasks
1. Review and update validation rules
2. Optimize performance thresholds
3. Update documentation
4. Train content team on new features

## Troubleshooting

### Common Issues

#### Dashboard Not Loading
- Check API endpoint availability
- Verify content directory permissions
- Review browser console for errors

#### Validation Errors
- Ensure content directory structure is correct
- Verify file permissions
- Check frontmatter syntax in markdown files

#### Missing Translations Not Detected
- Verify SlugMapper configuration
- Check file naming conventions
- Ensure proper directory structure

#### Performance Issues
- Review content volume and caching
- Check for large file sizes
- Monitor memory usage during validation

### Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| `ENOENT` | File not found | Check file paths and permissions |
| `VALIDATION_FAILED` | Content validation failed | Review content structure and frontmatter |
| `CONSISTENCY_ERROR` | Consistency check failed | Verify cross-language content structure |
| `ALERT_RULE_ERROR` | Alert rule execution failed | Check alert rule configuration |

## API Reference

### Validation Report API

```typescript
GET /api/content-management/validation-report
Response: ValidationReport

POST /api/content-management/validation-report
Response: { success: boolean, report: ValidationReport, timestamp: string }
```

### Content Statistics API

```typescript
GET /api/content-management/content-stats
Response: ContentStats
```

### Missing Translations API

```typescript
GET /api/content-management/missing-translations
Response: MissingTranslationReport[]
```

### Consistency Check API

```typescript
GET /api/content-management/consistency-check?contentType=<type>
Response: ConsistencyReport

POST /api/content-management/consistency-check
Body: { contentType: string, englishSlug: string, language: string }
Response: SingleContentConsistencyResult
```

### Alert System API

```typescript
GET /api/content-management/alert-system?action=<action>&ruleId=<id>
Response: Alert[] | AlertRule[]

POST /api/content-management/alert-system
Body: { action: string, ruleId?: string, ruleUpdates?: object, newRule?: AlertRule }
Response: { success: boolean, message: string }
```

## Testing

### Running Tests

```bash
# Run all content management tests
npm test content-management

# Run specific test file
npm test content-management.test.ts

# Run with coverage
npm test -- --coverage
```

### Test Coverage

The test suite covers:
- Content validation functionality
- Consistency checking algorithms
- Alert system rules and execution
- API endpoint responses
- Dashboard component behavior

## Security Considerations

### Access Control
- Dashboard requires authentication
- API endpoints validate user permissions
- File system access is restricted to content directories

### Data Protection
- No sensitive data is stored in validation reports
- User inputs are sanitized
- File paths are validated to prevent directory traversal

### Performance Security
- Rate limiting on API endpoints
- Memory usage monitoring
- Timeout protection for long-running operations

## Future Enhancements

### Planned Features
1. **Automated Translation Suggestions** - AI-powered translation recommendations
2. **Content Workflow Management** - Editorial workflow integration
3. **Performance Analytics** - Advanced performance monitoring
4. **Custom Alert Rules** - User-defined alert configurations
5. **Integration APIs** - Third-party translation service integration

### Roadmap
- **Q1 2024:** Enhanced dashboard features
- **Q2 2024:** Automated translation workflows
- **Q3 2024:** Advanced analytics and reporting
- **Q4 2024:** AI-powered content optimization

## Support

For technical support or questions about the content management tools:

1. Check this documentation first
2. Review the troubleshooting section
3. Check the test files for usage examples
4. Contact the development team

## Contributing

When contributing to the content management tools:

1. Follow the existing code structure
2. Add comprehensive tests for new features
3. Update documentation for any changes
4. Ensure backward compatibility
5. Test with real content data

## License

These content management tools are part of the Statex website project and are subject to the project's license terms.