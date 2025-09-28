import { NextResponse } from 'next/server';
import { ContentLoader } from '@/lib/content/contentLoader';

export async function GET(
  { params }: { params: Promise<{ lang: string }> }
) {
  try {
    const resolvedParams = await params;
    const { lang } = resolvedParams;

    const contentLoader = new ContentLoader();
    const posts = await contentLoader.loadBlogPosts(lang);

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 