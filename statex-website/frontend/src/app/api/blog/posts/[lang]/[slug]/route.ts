import { NextResponse } from 'next/server';
import { ContentLoader } from '@/lib/content/contentLoader';

export async function GET(
  { params }: { params: Promise<{ lang: string; slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const { lang, slug } = resolvedParams;

    const contentLoader = new ContentLoader();
    const post = await contentLoader.loadBlogPost(slug, lang);

    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error loading blog post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 