#!/usr/bin/env node

/**
 * Content Management CLI Tool
 * 
 * This tool provides command-line access to content management functions
 * for content managers and developers.
 * 
 * Usage:
 *   node scripts/content-management-cli.js [command] [options]
 * 
 * Commands:
 *   validate-all          - Run complete validation report
 *   validate-type <type>  - Validate specific content type
 *   missing-translations  - Generate missing translations report
 *   consistency-check     - Run consistency check
 *   generate-alerts       - Generate current alerts
 *   stats                 - Show content statistics
 */

const fs = require('fs').promises;
const path = require('path');

// Simple argument parser
function parseArgs() {
  const args = process.argv.slice(2);
  const command = args[0];
  const options = {};
  
  for (let i = 1; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].substring(2);
      const value = args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true;
      options[key] = value;
      if (value !== true) i++; // Skip next arg if it was used as value
    }
  }
  
  return { command, options };
}

// Color output helpers
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bold: '\x1b[1m'
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

function log(message, color = 'white') {
  console.log(colorize(message, color));
}

function error(message) {
  console.error(colorize(`❌ ${message}`, 'red'));
}

function success(message) {
  console.log(colorize(`✅ ${message}`, 'green'));
}

function warning(message) {
  console.log(colorize(`⚠️  ${message}`, 'yellow'));
}

function info(message) {
  console.log(colorize(`ℹ️  ${message}`, 'blue'));
}

// Mock implementations (in real scenario, these would import the actual classes)
// For now, we'll create simplified versions that work with the file system

async function validateAllContent() {
  log('🔍 Running complete content validation...', 'cyan');
  
  const contentDir = path.join(process.cwd(), 'src', 'content');
  const languages = ['en', 'cs', 'de', 'fr'];
  const contentTypes = ['blog', 'pages', 'services', 'solutions', 'legal'];
  
  let totalContent = 0;
  let validContent = 0;
  let issues = [];
  
  for (const contentType of contentTypes) {
    log(`\n📂 Checking ${contentType}...`);
    
    // Get English content (source of truth)
    let englishDir;
    if (contentType === 'blog') {
      englishDir = path.join(contentDir, 'blog', 'en');
    } else if (contentType === 'pages') {
      englishDir = path.join(contentDir, 'pages', 'en');
    } else {
      englishDir = path.join(contentDir, 'pages', 'en', contentType);
    }
    
    try {
      const englishFiles = await fs.readdir(englishDir);
      const markdownFiles = englishFiles.filter(f => f.endsWith('.md'));
      
      for (const file of markdownFiles) {
        const slug = file.replace('.md', '');
        totalContent++;
        
        let hasAllTranslations = true;
        const missingLanguages = [];
        
        // Check each language
        for (const lang of languages) {
          if (lang === 'en') continue;
          
          let translationPath;
          if (contentType === 'blog') {
            translationPath = path.join(contentDir, 'blog', lang, file);
          } else if (contentType === 'pages') {
            translationPath = path.join(contentDir, 'pages', lang, file);
          } else {
            translationPath = path.join(contentDir, 'pages', lang, contentType, file);
          }
          
          try {
            await fs.access(translationPath);
          } catch {
            hasAllTranslations = false;
            missingLanguages.push(lang);
          }
        }
        
        if (hasAllTranslations) {
          validContent++;
          log(`  ✅ ${slug}`, 'green');
        } else {
          issues.push({
            contentType,
            slug,
            missingLanguages
          });
          log(`  ❌ ${slug} - Missing: ${missingLanguages.join(', ')}`, 'red');
        }
      }
    } catch (err) {
      warning(`Could not read ${contentType} directory: ${englishDir}`);
    }
  }
  
  // Summary
  log('\n📊 VALIDATION SUMMARY', 'bold');
  log('═'.repeat(50), 'cyan');
  log(`Total Content: ${totalContent}`);
  log(`Valid Content: ${validContent}`, 'green');
  log(`Invalid Content: ${totalContent - validContent}`, 'red');
  log(`Completion Rate: ${Math.round((validContent / totalContent) * 100)}%`, 'cyan');
  
  if (issues.length > 0) {
    log('\n🚨 ISSUES FOUND:', 'red');
    issues.forEach(issue => {
      log(`  • ${issue.contentType}/${issue.slug}: Missing ${issue.missingLanguages.join(', ')}`);
    });
  } else {
    success('\n🎉 All content is fully translated!');
  }
  
  return { totalContent, validContent, issues };
}

async function validateContentType(contentType) {
  if (!['blog', 'pages', 'services', 'solutions', 'legal'].includes(contentType)) {
    error(`Invalid content type: ${contentType}`);
    return;
  }
  
  log(`🔍 Validating ${contentType} content...`, 'cyan');
  
  const contentDir = path.join(process.cwd(), 'src', 'content');
  const languages = ['en', 'cs', 'de', 'fr'];
  
  let englishDir;
  if (contentType === 'blog') {
    englishDir = path.join(contentDir, 'blog', 'en');
  } else if (contentType === 'pages') {
    englishDir = path.join(contentDir, 'pages', 'en');
  } else {
    englishDir = path.join(contentDir, 'pages', 'en', contentType);
  }
  
  try {
    const englishFiles = await fs.readdir(englishDir);
    const markdownFiles = englishFiles.filter(f => f.endsWith('.md'));
    
    log(`\n📁 Found ${markdownFiles.length} ${contentType} files in English`);
    
    for (const file of markdownFiles) {
      const slug = file.replace('.md', '');
      log(`\n📄 Checking: ${slug}`);
      
      for (const lang of languages) {
        if (lang === 'en') {
          log(`  ✅ ${lang.toUpperCase()}: Source file`, 'green');
          continue;
        }
        
        let translationPath;
        if (contentType === 'blog') {
          translationPath = path.join(contentDir, 'blog', lang, file);
        } else if (contentType === 'pages') {
          translationPath = path.join(contentDir, 'pages', lang, file);
        } else {
          translationPath = path.join(contentDir, 'pages', lang, contentType, file);
        }
        
        try {
          await fs.access(translationPath);
          log(`  ✅ ${lang.toUpperCase()}: Translation exists`, 'green');
        } catch {
          log(`  ❌ ${lang.toUpperCase()}: Translation missing`, 'red');
        }
      }
    }
  } catch (err) {
    error(`Could not read ${contentType} directory: ${englishDir}`);
  }
}

async function generateMissingTranslationsReport() {
  log('📋 Generating missing translations report...', 'cyan');
  
  const contentDir = path.join(process.cwd(), 'src', 'content');
  const languages = ['cs', 'de', 'fr']; // Exclude English as it's the source
  const contentTypes = ['blog', 'pages', 'services', 'solutions', 'legal'];
  
  const report = {};
  
  for (const contentType of contentTypes) {
    report[contentType] = [];
    
    let englishDir;
    if (contentType === 'blog') {
      englishDir = path.join(contentDir, 'blog', 'en');
    } else if (contentType === 'pages') {
      englishDir = path.join(contentDir, 'pages', 'en');
    } else {
      englishDir = path.join(contentDir, 'pages', 'en', contentType);
    }
    
    try {
      const englishFiles = await fs.readdir(englishDir);
      const markdownFiles = englishFiles.filter(f => f.endsWith('.md'));
      
      for (const file of markdownFiles) {
        const slug = file.replace('.md', '');
        const missingLanguages = [];
        
        for (const lang of languages) {
          let translationPath;
          if (contentType === 'blog') {
            translationPath = path.join(contentDir, 'blog', lang, file);
          } else if (contentType === 'pages') {
            translationPath = path.join(contentDir, 'pages', lang, file);
          } else {
            translationPath = path.join(contentDir, 'pages', lang, contentType, file);
          }
          
          try {
            await fs.access(translationPath);
          } catch {
            missingLanguages.push(lang);
          }
        }
        
        if (missingLanguages.length > 0) {
          report[contentType].push({
            slug,
            missingLanguages
          });
        }
      }
    } catch (err) {
      warning(`Could not read ${contentType} directory`);
    }
  }
  
  // Display report
  log('\n📊 MISSING TRANSLATIONS REPORT', 'bold');
  log('═'.repeat(50), 'cyan');
  
  let totalMissing = 0;
  
  for (const [contentType, missing] of Object.entries(report)) {
    if (missing.length > 0) {
      log(`\n📂 ${contentType.toUpperCase()}:`, 'yellow');
      missing.forEach(item => {
        log(`  • ${item.slug} - Missing: ${item.missingLanguages.join(', ')}`, 'red');
        totalMissing += item.missingLanguages.length;
      });
    } else {
      log(`\n📂 ${contentType.toUpperCase()}: All translations complete ✅`, 'green');
    }
  }
  
  log(`\n🔢 Total missing translations: ${totalMissing}`, totalMissing > 0 ? 'red' : 'green');
  
  return report;
}

async function showContentStats() {
  log('📊 Generating content statistics...', 'cyan');
  
  const contentDir = path.join(process.cwd(), 'src', 'content');
  const languages = ['en', 'cs', 'de', 'fr'];
  const contentTypes = ['blog', 'pages', 'services', 'solutions', 'legal'];
  
  const stats = {
    byContentType: {},
    byLanguage: {},
    total: 0
  };
  
  // Initialize counters
  languages.forEach(lang => stats.byLanguage[lang] = 0);
  contentTypes.forEach(type => stats.byContentType[type] = 0);
  
  for (const contentType of contentTypes) {
    for (const lang of languages) {
      let contentPath;
      if (contentType === 'blog') {
        contentPath = path.join(contentDir, 'blog', lang);
      } else if (contentType === 'pages') {
        contentPath = path.join(contentDir, 'pages', lang);
      } else {
        contentPath = path.join(contentDir, 'pages', lang, contentType);
      }
      
      try {
        const files = await fs.readdir(contentPath);
        const markdownFiles = files.filter(f => f.endsWith('.md'));
        const count = markdownFiles.length;
        
        stats.byContentType[contentType] += count;
        stats.byLanguage[lang] += count;
        stats.total += count;
      } catch (err) {
        // Directory doesn't exist, count as 0
      }
    }
  }
  
  // Display stats
  log('\n📊 CONTENT STATISTICS', 'bold');
  log('═'.repeat(50), 'cyan');
  
  log(`\n📈 Total Content: ${stats.total}`, 'white');
  
  log('\n📂 By Content Type:', 'yellow');
  Object.entries(stats.byContentType).forEach(([type, count]) => {
    log(`  ${type.padEnd(12)}: ${count}`, 'white');
  });
  
  log('\n🌍 By Language:', 'yellow');
  Object.entries(stats.byLanguage).forEach(([lang, count]) => {
    log(`  ${lang.toUpperCase().padEnd(12)}: ${count}`, 'white');
  });
  
  // Calculate completion rate
  const englishCount = stats.byLanguage.en;
  const expectedTotal = englishCount * languages.length;
  const completionRate = expectedTotal > 0 ? Math.round((stats.total / expectedTotal) * 100) : 0;
  
  log(`\n🎯 Translation Completion: ${completionRate}%`, completionRate >= 90 ? 'green' : 'red');
  
  return stats;
}

async function showHelp() {
  log('\n📚 Content Management CLI Tool', 'bold');
  log('═'.repeat(50), 'cyan');
  log('\nAvailable commands:', 'yellow');
  log('  validate-all              Run complete validation report');
  log('  validate-type <type>      Validate specific content type');
  log('  missing-translations      Generate missing translations report');
  log('  stats                     Show content statistics');
  log('  help                      Show this help message');
  
  log('\nContent types:', 'yellow');
  log('  blog, pages, services, solutions, legal');
  
  log('\nExamples:', 'yellow');
  log('  node scripts/content-management-cli.js validate-all');
  log('  node scripts/content-management-cli.js validate-type blog');
  log('  node scripts/content-management-cli.js missing-translations');
  log('  node scripts/content-management-cli.js stats');
  
  log('\n💡 Tip: Run this from the frontend directory', 'blue');
}

// Main execution
async function main() {
  const { command, options } = parseArgs();
  
  try {
    switch (command) {
      case 'validate-all':
        await validateAllContent();
        break;
        
      case 'validate-type':
        const contentType = process.argv[3];
        if (!contentType) {
          error('Content type required. Usage: validate-type <type>');
          process.exit(1);
        }
        await validateContentType(contentType);
        break;
        
      case 'missing-translations':
        await generateMissingTranslationsReport();
        break;
        
      case 'stats':
        await showContentStats();
        break;
        
      case 'help':
      case '--help':
      case '-h':
        await showHelp();
        break;
        
      default:
        if (!command) {
          await showHelp();
        } else {
          error(`Unknown command: ${command}`);
          log('Run "help" to see available commands');
          process.exit(1);
        }
    }
  } catch (err) {
    error(`Command failed: ${err.message}`);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}