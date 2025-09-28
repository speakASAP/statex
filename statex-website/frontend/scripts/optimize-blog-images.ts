#!/usr/bin/env tsx

import path from 'path';
import fs from 'fs/promises';
import { ImageOptimizer } from '../src/lib/image/ImageOptimizer';

async function optimizeBlogImages() {
  console.log('🚀 Starting blog image optimization...');

  const inputDir = path.join(process.cwd(), 'public/blog');
  const outputDir = path.join(process.cwd(), 'public/blog/optimized');
  const placeholderDir = path.join(process.cwd(), 'public/blog/placeholders');

  try {
    // Create output directories
    await fs.mkdir(outputDir, { recursive: true });
    await fs.mkdir(placeholderDir, { recursive: true });

    // Get all PNG images
    const files = await fs.readdir(inputDir);
    const imageFiles = files.filter(file => file.endsWith('.png'));
    
    console.log(`📁 Found ${imageFiles.length} images to optimize`);

    if (imageFiles.length === 0) {
      console.log('❌ No PNG images found in blog directory');
      return;
    }

    // Initialize optimizer
    const optimizer = new ImageOptimizer({
      quality: 80,
      formats: ['webp', 'png'],
      sizes: [
        { width: 400, suffix: '400w' },
        { width: 800, suffix: '800w' },
        { width: 1200, suffix: '1200w' },
        { width: 1600, suffix: '1600w' }
      ],
      placeholder: {
        width: 20,
        height: 20,
        quality: 30
      }
    });

    // Process each image
    const inputPaths = imageFiles.map(file => path.join(inputDir, file));
    const results = await optimizer.optimizeImages(inputPaths, outputDir);

    console.log(`✅ Successfully optimized ${results.length} images`);

    // Generate summary
    let totalOriginalSize = 0;
    let totalOptimizedSize = 0;

    for (const result of results) {
      const originalSize = result.metadata.size;
      const optimizedSize = await getFileSize(result.optimizedPath);
      const webpSize = await getFileSize(result.webpPath);
      
      totalOriginalSize += originalSize;
      totalOptimizedSize += Math.min(optimizedSize, webpSize);

      console.log(`📊 ${path.basename(result.originalPath)}:`);
      console.log(`   Original: ${formatBytes(originalSize)}`);
      console.log(`   Optimized: ${formatBytes(optimizedSize)}`);
      console.log(`   WebP: ${formatBytes(webpSize)}`);
      console.log(`   Savings: ${formatBytes(originalSize - Math.min(optimizedSize, webpSize))} (${Math.round((1 - Math.min(optimizedSize, webpSize) / originalSize) * 100)}%)`);
      console.log('');
    }

    console.log(`📈 Total optimization summary:`);
    console.log(`   Original size: ${formatBytes(totalOriginalSize)}`);
    console.log(`   Optimized size: ${formatBytes(totalOptimizedSize)}`);
    console.log(`   Total savings: ${formatBytes(totalOriginalSize - totalOptimizedSize)} (${Math.round((1 - totalOptimizedSize / totalOriginalSize) * 100)}%)`);

    // Generate image mapping configuration
    await generateImageMapping(results);

    console.log('🎉 Blog image optimization completed successfully!');

  } catch (error) {
    console.error('❌ Error optimizing blog images:', error);
    process.exit(1);
  }
}

async function getFileSize(filePath: string): Promise<number> {
  try {
    const stats = await fs.stat(filePath);
    return stats.size;
  } catch {
    return 0;
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function generateImageMapping(results: any[]) {
  const mappingPath = path.join(process.cwd(), 'src/config/image-mapping.json');
  const mapping: any = {};

  // Generate mapping for blog posts
  const blogPosts = [
    '01-european-digital-transformation-2024',
    '02-gdpr-compliant-analytics',
    '03-european-seo-localization',
    '04-technical-seo-implementation',
    '05-european-market-insights',
    '06-content-strategy-european-it',
    '07-cross-border-data-flows',
    '08-ai-implementation-smes',
    '09-european-cloud-migration',
    '10-digital-government-initiatives',
    '11-api-integration-strategies',
    '12-european-tech-talent-market'
  ];

  blogPosts.forEach((postSlug, index) => {
    const imageIndex = (index % results.length) + 1;
    const imageId = `generated-image${imageIndex}`;
    
    mapping[postSlug] = {
      heroImage: imageId,
      contentImages: [imageId],
      relatedImages: []
    };
  });

  // Ensure config directory exists
  const configDir = path.dirname(mappingPath);
  await fs.mkdir(configDir, { recursive: true });

  // Write mapping file
  await fs.writeFile(mappingPath, JSON.stringify(mapping, null, 2));
  console.log(`📝 Generated image mapping configuration: ${mappingPath}`);
}

// Run the script
if (require.main === module) {
  optimizeBlogImages().catch(console.error);
} 