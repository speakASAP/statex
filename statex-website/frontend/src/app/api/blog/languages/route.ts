import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const blogDir = path.join(process.cwd(), 'src/content/blog');
    const languages = await fs.readdir(blogDir);
    
    // Filter out non-directory items and return language codes
    const availableLanguages = [];
    for (const lang of languages) {
      const langPath = path.join(blogDir, lang);
      const stats = await fs.stat(langPath);
      if (stats.isDirectory()) {
        availableLanguages.push(lang);
      }
    }

    return NextResponse.json(availableLanguages);
  } catch (error) {
    console.error('Error loading available languages:', error);
    return NextResponse.json(['en'], { status: 500 });
  }
} 