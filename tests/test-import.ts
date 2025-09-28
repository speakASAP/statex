// Test file to verify ContentLoader import resolution
import { ContentLoader, ContentType } from '../statex-website/frontend/src/lib/content/ContentLoader';

// Test instantiation
const contentLoader = new ContentLoader();

// Test ContentType usage
const testType: ContentType = 'blog';

console.log('Import test successful');
console.log('ContentLoader class:', typeof ContentLoader);
console.log('Test content type:', testType);