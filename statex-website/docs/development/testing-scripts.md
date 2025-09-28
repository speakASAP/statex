# Testing Scripts for Components

## Overview

This document contains commands and scripts for efficient component testing according to four main parameters.

## Main Commands

### Run All Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with verbose output
npm run test:verbose
```

### Run Tests by Categories

```bash
# Test only STX Classes
npm test -- --grep "STX Classes"

# Test only Organism-Specific Functionality
npm test -- --grep "Organism-Specific Functionality"

# Test only Layout Variants
npm test -- --grep "Layout Variants"

# Test only Responsive Behavior
npm test -- --grep "Responsive Behavior"
```

### Run Tests by Component Types

```bash
# Test only Atoms
npm test -- src/components/atoms/

# Test only Molecules
npm test -- src/components/molecules/

# Test only Organisms
npm test -- src/components/organisms/

# Test only Templates
npm test -- src/components/templates/
```

### Run Enhanced Theme Tests

```bash
# Test only enhanced theme tests
npm test -- --grep "Enhanced Theme"

# Test theme integration across all components
npm test -- --grep "Theme Integration"

# Test theme transitions
npm test -- --grep "Theme Transitions"

# Test theme performance
npm test -- --grep "Theme Performance"

# Test specific theme (light, dark, eu, uae)
npm test -- --grep "light theme"
npm test -- --grep "dark theme"
npm test -- --grep "eu theme"
npm test -- --grep "uae theme"

# Test theme testing utility functions
npm test -- src/test/utils/theme-testing.ts

# Test components with enhanced theme support
npm test -- --grep "testCompleteThemeSupport"
```

### Run Tests for Specific Components

```bash
# Test specific component
npm test -- Button.test.tsx

# Test multiple components
npm test -- Button.test.tsx Input.test.tsx

# Test component with full path
npm test -- src/components/atoms/Button.test.tsx
```

## Quality Check Scripts

### Check Coverage Across Four Parameters

```bash
# Create script for coverage check
cat > scripts/check-test-coverage.js << 'EOF'
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const testDir = path.join(__dirname, '../src/components');
const categories = [
  'STX Classes',
  'Organism-Specific Functionality', 
  'Layout Variants',
  'Responsive Behavior'
];

function checkTestFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const missingCategories = [];
  
  categories.forEach(category => {
    if (!content.includes(`describe('${category}'`)) {
      missingCategories.push(category);
    }
  });
  
  return {
    file: path.basename(filePath),
    hasAllCategories: missingCategories.length === 0,
    missingCategories
  };
}

function scanTestFiles(dir) {
  const results = [];
  
  function scan(currentDir) {
    const files = fs.readdirSync(currentDir);
    
    files.forEach(file => {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        scan(filePath);
      } else if (file.endsWith('.test.tsx') || file.endsWith('.test.ts')) {
        results.push(checkTestFile(filePath));
      }
    });
  }
  
  scan(dir);
  return results;
}

const results = scanTestFiles(testDir);
const incompleteTests = results.filter(r => !r.hasAllCategories);

console.log('=== Testing Coverage Check Across Four Parameters ===\n');

if (incompleteTests.length === 0) {
  console.log('✅ All tests cover all four parameters!');
} else {
  console.log(`❌ Found ${incompleteTests.length} tests with incomplete coverage:\n`);
  
  incompleteTests.forEach(test => {
    console.log(`📁 ${test.file}`);
    console.log(`   Missing categories: ${test.missingCategories.join(', ')}\n`);
  });
}

console.log(`\n📊 Statistics:`);
console.log(`   Total tests: ${results.length}`);
console.log(`   Complete coverage: ${results.length - incompleteTests.length}`);
console.log(`   Incomplete coverage: ${incompleteTests.length}`);
EOF

# Make script executable
chmod +x scripts/check-test-coverage.js

# Run coverage check
node scripts/check-test-coverage.js
```

### Check Test Performance

```bash
# Create script for performance check
cat > scripts/check-test-performance.js << 'EOF'
#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('=== Test Performance Check ===\n');

try {
  const startTime = Date.now();
  execSync('npm test -- --run', { stdio: 'pipe' });
  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000;
  
  console.log(`⏱️  Execution time: ${duration.toFixed(2)} seconds`);
  
  if (duration < 30) {
    console.log('✅ Tests run fast enough');
  } else {
    console.log('⚠️  Tests run slowly, optimization recommended');
  }
  
} catch (error) {
  console.log('❌ Error running tests');
  console.log(error.message);
}
EOF

# Make script executable
chmod +x scripts/check-test-performance.js

# Run performance check
node scripts/check-test-performance.js
```

### Check Test Quality

```bash
# Create script for quality check
cat > scripts/check-test-quality.js << 'EOF'
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const testDir = path.join(__dirname, '../src/components');

function checkTestQuality(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  
  // Check use of userEvent instead of fireEvent
  const fireEventCount = (content.match(/fireEvent\./g) || []).length;
  const userEventCount = (content.match(/userEvent\./g) || []).length;
  
  if (fireEventCount > userEventCount) {
    issues.push('Consider using userEvent instead of fireEvent');
  }
  
  // Check use of waitFor for async operations
  const asyncOperations = content.match(/setTimeout|fetch|Promise/g) || [];
  const waitForUsage = (content.match(/waitFor/g) || []).length;
  
  if (asyncOperations.length > 0 && waitForUsage === 0) {
    issues.push('Async operations should be wrapped in waitFor');
  }
  
  // Check use of act()
  const stateUpdates = content.match(/setState|useState|useEffect/g) || [];
  const actUsage = (content.match(/act\(/g) || []).length;
  
  if (stateUpdates.length > 0 && actUsage === 0) {
    issues.push('State updates should be wrapped in act()');
  }
  
  // Check mocks
  const mockUsage = (content.match(/vi\.mock|vi\.fn/g) || []).length;
  const externalDeps = content.match(/fetch|localStorage|sessionStorage/g) || [];
  
  if (externalDeps.length > 0 && mockUsage === 0) {
    issues.push('External dependencies should be mocked');
  }
  
  return {
    file: path.basename(filePath),
    issues
  };
}

function scanTestFiles(dir) {
  const results = [];
  
  function scan(currentDir) {
    const files = fs.readdirSync(currentDir);
    
    files.forEach(file => {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        scan(filePath);
      } else if (file.endsWith('.test.tsx') || file.endsWith('.test.ts')) {
        results.push(checkTestQuality(filePath));
      }
    });
  }
  
  scan(dir);
  return results;
}

const results = scanTestFiles(testDir);
const testsWithIssues = results.filter(r => r.issues.length > 0);

console.log('=== Test Quality Check ===\n');

if (testsWithIssues.length === 0) {
  console.log('✅ All tests meet quality standards!');
} else {
  console.log(`⚠️  Found ${testsWithIssues.length} tests with quality issues:\n`);
  
  testsWithIssues.forEach(test => {
    console.log(`📁 ${test.file}`);
    test.issues.forEach(issue => {
      console.log(`   - ${issue}`);
    });
    console.log('');
  });
}

console.log(`\n📊 Statistics:`);
console.log(`   Total tests: ${results.length}`);
console.log(`   No issues: ${results.length - testsWithIssues.length}`);
console.log(`   With issues: ${testsWithIssues.length}`);
EOF

# Make script executable
chmod +x scripts/check-test-quality.js

# Run quality check
node scripts/check-test-quality.js
```

## CI/CD Scripts

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test Components

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test -- --run --coverage
    
    - name: Check test coverage
      run: node scripts/check-test-coverage.js
    
    - name: Check test quality
      run: node scripts/check-test-quality.js
    
    - name: Upload coverage reports
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
```

### Git Hooks

```bash
# .git/hooks/pre-commit
#!/bin/sh

echo "🔍 Checking tests before commit..."

# Run tests for changed files
git diff --cached --name-only | grep -E '\.(tsx|ts)$' | while read file; do
  if [ -f "$file" ]; then
    test_file=$(echo "$file" | sed 's/\.tsx$/.test.tsx/; s/\.ts$/.test.ts/')
    if [ -f "$test_file" ]; then
      echo "🧪 Running tests for $test_file"
      npm test -- "$test_file" --run
      if [ $? -ne 0 ]; then
        echo "❌ Tests for $test_file failed"
        exit 1
      fi
    else
      echo "⚠️  Test file not found for $file"
    fi
  fi
done

# Check coverage across four parameters
node scripts/check-test-coverage.js

echo "✅ All tests passed successfully!"
```

## Development Scripts

### Generate New Test File

```bash
# Create script for test generation
cat > scripts/generate-test.js << 'EOF'
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const componentName = process.argv[2];
if (!componentName) {
  console.log('Usage: node scripts/generate-test.js ComponentName');
  process.exit(1);
}

const testTemplate = `import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ${componentName} } from './${componentName}';

describe('${componentName}', () => {
  // 1. STX Classes
  describe('STX Classes', () => {
    it('renders with default STX classes', () => {
      render(<${componentName} />);
      expect(screen.getByRole('main')).toHaveClass('stx-${componentName.toLowerCase()}');
    });

    it('applies variant classes correctly', () => {
      render(<${componentName} variant="primary" />);
      expect(screen.getByRole('main')).toHaveClass('stx-${componentName.toLowerCase()}-primary');
    });

    it('applies size classes correctly', () => {
      render(<${componentName} size="lg" />);
      expect(screen.getByRole('main')).toHaveClass('stx-${componentName.toLowerCase()}-lg');
    });
  });

  // 2. Organism-Specific Functionality
  describe('Organism-Specific Functionality', () => {
    it('handles user interactions', () => {
      render(<${componentName} />);
      // TODO: Add specific functionality tests
    });

    it('validates input data', () => {
      render(<${componentName} />);
      // TODO: Add validation tests
    });

    it('handles async operations', async () => {
      render(<${componentName} />);
      // TODO: Add async operation tests
    });
  });

  // 3. Layout Variants
  describe('Layout Variants', () => {
    it('applies different variants correctly', () => {
      const { rerender } = render(<${componentName} variant="primary" />);
      expect(screen.getByRole('main')).toHaveClass('stx-${componentName.toLowerCase()}-primary');
      
      rerender(<${componentName} variant="secondary" />);
      expect(screen.getByRole('main')).toHaveClass('stx-${componentName.toLowerCase()}-secondary');
    });

    it('applies custom className', () => {
      render(<${componentName} className="custom-class" />);
      expect(screen.getByRole('main')).toHaveClass('custom-class');
    });
  });

  // 4. Responsive Behavior
  describe('Responsive Behavior', () => {
    it('maintains functionality on different screen sizes', () => {
      render(<${componentName} />);
      // TODO: Add responsive tests
    });

    it('handles responsive layout changes', () => {
      render(<${componentName} />);
      // TODO: Add layout change tests
    });
  });
});
`;

const testFilePath = path.join(__dirname, '../src/components', `${componentName}.test.tsx`);

if (fs.existsSync(testFilePath)) {
  console.log(`❌ Test file ${componentName}.test.tsx already exists`);
  process.exit(1);
}

fs.writeFileSync(testFilePath, testTemplate);
console.log(`✅ Created test file: ${testFilePath}`);
console.log('📝 Remember to add specific tests in TODO sections');
EOF

# Make script executable
chmod +x scripts/generate-test.js

# Usage
node scripts/generate-test.js MyComponent
```

### Update package.json

```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --run --coverage",
    "test:verbose": "vitest --run --reporter=verbose",
    "test:ui": "vitest --ui",
    "test:check-coverage": "node scripts/check-test-coverage.js",
    "test:check-quality": "node scripts/check-test-quality.js",
    "test:check-performance": "node scripts/check-test-performance.js",
    "test:generate": "node scripts/generate-test.js",
    "test:all-checks": "npm run test:check-coverage && npm run test:check-quality && npm run test:check-performance"
  }
}
```

## Monitoring and Reports

### Daily Test Report

```bash
# Create script for daily report
cat > scripts/daily-test-report.js << 'EOF'
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📊 Daily Test Report');
console.log('===================\n');

// Run tests with coverage
try {
  execSync('npm run test:coverage', { stdio: 'pipe' });
  console.log('✅ All tests passed successfully');
} catch (error) {
  console.log('❌ Some tests failed');
}

// Check coverage across four parameters
const coverageResults = require('./check-test-coverage.js');
console.log('\n📈 Coverage across four parameters:');
console.log(coverageResults);

// Check test quality
const qualityResults = require('./check-test-quality.js');
console.log('\n🔍 Test quality:');
console.log(qualityResults);

// Check performance
const performanceResults = require('./check-test-performance.js');
console.log('\n⏱️ Test performance:');
console.log(performanceResults);

console.log('\n📅 Report generated:', new Date().toLocaleString());
EOF

# Make script executable
chmod +x scripts/daily-test-report.js

# Run daily report
node scripts/daily-test-report.js
```

## Conclusion

These scripts provide:

1. **Automation** - automatic quality checks for tests
2. **Monitoring** - tracking coverage and performance
3. **Standardization** - consistent approach to testing
4. **Efficiency** - fast generation and verification of tests

Use these scripts to maintain high test quality and ensure compliance with the four main testing parameters. 