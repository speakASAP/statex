import React from 'react';
import { notFound } from 'next/navigation';
import { HeroSpacer } from '@/components/atoms';
import PageRenderer from '@/components/pages/PageRenderer';

// Function to check if a project exists
async function checkProjectExists(prototypeId: string): Promise<boolean> {
  try {
    // For now, we'll use a simple check - you can integrate with your actual project database
    // This could check against your DNS service, database, or AI service
    
    // Example: Check if it's a valid format (you can make this more sophisticated)
    if (!prototypeId || prototypeId.length < 3) {
      return false;
    }
    
    // For development, we'll consider some test projects as valid
    const validTestProjects = [
      'test',
      'test-1', 
      'project-test-1',
      'project-final-test',
      'project-no-redirect-1',
      'project-direct-1',
      'project-fixed-1'
    ];
    
    if (validTestProjects.includes(prototypeId)) {
      return true;
    }
    
    // For real projects, you would check against your database or API
    // Example: const response = await fetch(`/api/projects/${prototypeId}`);
    // return response.ok;
    
    // For now, return false for unknown projects
    return false;
  } catch (error) {
    console.error('Error checking project existence:', error);
    return false;
  }
}

interface CatchAllPageProps {
  params: {
    slug: string[];
  };
  searchParams: Record<string, string>;
}

export async function generateStaticParams() {
  try {
    // Import ContentLoader dynamically to avoid build-time issues
    const { ContentLoader } = await import('@/lib/content/contentLoader');
    const loader = new ContentLoader();
    const englishSlugs = await loader.getAllEnglishSlugs('pages');
    
    // Generate params for all languages
    const params: Array<{ slug: string[] }> = [];
    const languages = ['en', 'cs', 'de', 'fr'];
    
    for (const englishSlug of englishSlugs) {
      for (const language of languages) {
        const nativeSlug = loader.getNativeSlug(englishSlug, language);
        if (language === 'en') {
          params.push({ slug: [nativeSlug] });
        } else {
          params.push({ slug: [language, nativeSlug] });
        }
      }
    }

    return params;
  } catch (error) {
    console.warn('Failed to generate static params, using fallback:', error);
    // Return empty array as fallback - Next.js will handle dynamic routes
    return [];
  }
}

export async function generateMetadata({ params }: CatchAllPageProps) {
  const resolvedParams = await params;
  const slugPath = resolvedParams.slug.join('/');
  
  // Check if this is a subdomain request (when middleware is not working)
  const headers = await import('next/headers');
  const headersList = await headers.headers();
  const host = headersList.get('host') || '';
  
  // Check if this is a prototype subdomain
  const prototypeMatch = host.match(/^project-([a-zA-Z0-9_-]+)\.localhost(:\d+)?$/);
  
  if (prototypeMatch) {
    // For prototype subdomains, return basic metadata without using ContentLoader
    return {
      title: 'Prototype | Statex',
      description: 'AI-Powered Prototype Development',
    };
  }
  
  // Only import ContentLoader for CMS pages (non-prototype subdomains)
  try {
    const { ContentLoader } = await import('@/lib/content/contentLoader');
    const loader = new ContentLoader();
    
    // Determine language and native slug from URL
    let language = 'en';
    let nativeSlug = slugPath;
    
    if (resolvedParams.slug[0] && ['cs', 'de', 'fr'].includes(resolvedParams.slug[0])) {
      language = resolvedParams.slug[0];
      nativeSlug = resolvedParams.slug.slice(1).join('/');
    }
    
    const page = await loader.loadPage(nativeSlug, language);

    if (!page) {
      return {
        title: 'Page Not Found',
        description: 'The requested page could not be found.',
      };
    }

    const { markdown } = page;
    
    // Generate alternate language URLs
    const languages = ['en', 'cs', 'de', 'fr'];
    const alternates: Record<string, string> = {};
    
    for (const lang of languages) {
      const langNativeSlug = loader.getNativeSlug(markdown.metadata.slug, lang);
      if (lang === 'en') {
        alternates[lang] = `/${langNativeSlug}`;
      } else {
        alternates[lang] = `/${lang}/${langNativeSlug}`;
      }
    }
    
    return {
      title: markdown.frontmatter.title,
      description: markdown.frontmatter.seo.metaDescription,
      keywords: markdown.frontmatter.seo.keywords,
      openGraph: {
        title: markdown.frontmatter.title,
        description: markdown.frontmatter.seo.metaDescription,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: markdown.frontmatter.title,
        description: markdown.frontmatter.seo.metaDescription,
      },
      alternates: {
        canonical: language === 'en' ? `/${nativeSlug}` : `/${language}/${nativeSlug}`,
        languages: alternates,
      },
    };
  } catch (error) {
    console.warn('Failed to generate metadata, using fallback:', error);
    return {
      title: 'Statex',
      description: 'AI-Powered Prototype Development',
    };
  }
}

export default async function CatchAllPage({ params }: CatchAllPageProps) {
  const resolvedParams = await params;
  const slugPath = resolvedParams.slug.join('/');
  
  // Check if this is a subdomain request (when middleware is not working)
  const headers = await import('next/headers');
  const headersList = await headers.headers();
  const host = headersList.get('host') || '';
  
  console.log(`[CATCHALL] Processing request - Host: ${host}, Path: ${slugPath}`);
  
  // Skip static assets and Next.js internal files
  if (slugPath.startsWith('_next/') || slugPath.startsWith('__nextjs_')) {
    console.log(`[CATCHALL] Skipping static asset: ${slugPath}`);
    notFound();
  }
  
  // Check if this is a prototype subdomain
  const prototypeMatch = host.match(/^project-([a-zA-Z0-9_-]+)\.localhost(:\d+)?$/);
  
  if (prototypeMatch) {
    const prototypeId = prototypeMatch[1];
    console.log(`[CATCHALL] Found prototype subdomain: ${prototypeId}, path: ${slugPath}`);
    
    // Check if this is a valid project by checking if it exists in our system
    // For now, we'll show different content based on whether the project exists
    const isValidProject = await checkProjectExists(prototypeId);
    
    if (!isValidProject) {
      // Project doesn't exist - show empty page
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.291A7.962 7.962 0 0012 5c-2.34 0-4.29 1.009-5.824 2.709" />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold text-gray-600 mb-2">Project Not Found</h1>
              <p className="text-gray-500">This project doesn't exist yet or has been removed.</p>
            </div>
          </div>
        </div>
      );
    }
    
    // Serve content directly on the subdomain instead of redirecting
    if (slugPath === '') {
      // Main prototype page - show the actual prototype
      return (
        <div className="min-h-screen bg-gray-100">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Prototype: {prototypeId}</h1>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your AI-Generated Prototype</h2>
              <p className="text-gray-600 mb-6">
                This is where your actual prototype will be displayed. The AI system will generate 
                a functional website/application based on your requirements and deploy it here.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Prototype Status</h3>
                <p className="text-blue-700">Status: In Development</p>
                <p className="text-blue-700">Framework: Next.js 14</p>
                <p className="text-blue-700">Deployment: {host}</p>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (slugPath === 'plan') {
      // Plan page - show the development plan
      return (
        <div className="min-h-screen bg-gray-100">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Development Plan: {prototypeId}</h1>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">AI-Generated Development Plan</h2>
              <p className="text-gray-600 mb-6">
                This page will show the comprehensive development plan generated by our AI system 
                based on your requirements.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">Plan Status</h3>
                <p className="text-green-700">Status: Generated</p>
                <p className="text-green-700">Timeline: 4-6 weeks</p>
                <p className="text-green-700">Complexity: Medium-High</p>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (slugPath === 'offer') {
      // Offer page - show the service offer
      return (
        <div className="min-h-screen bg-gray-100">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Service Offer: {prototypeId}</h1>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Our Service Offer</h2>
              <p className="text-gray-600 mb-6">
                This page will show our detailed service offer based on your requirements and 
                the AI analysis of your project.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h3 className="font-semibold text-amber-800 mb-2">Offer Status</h3>
                <p className="text-amber-700">Status: Available</p>
                <p className="text-amber-700">Estimated Cost: €15,000-25,000</p>
                <p className="text-amber-700">Timeline: 4-6 weeks</p>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      // Other paths - show 404 or redirect to main prototype page
      return (
        <div className="min-h-screen bg-gray-100">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Page Not Found</h1>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <p className="text-gray-600 mb-6">
                The requested page "{slugPath}" was not found on this prototype subdomain.
              </p>
              <a href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                Back to Prototype
              </a>
            </div>
          </div>
        </div>
      );
    }
  }
  
  // Only process CMS content for non-prototype subdomains
  console.log(`[CATCHALL] Not a prototype subdomain - Host: ${host}`);
  
  try {
    // Import and instantiate classes only for CMS pages
    const { ContentLoader } = await import('@/lib/content/contentLoader');
    const { TemplateRenderer } = await import('@/lib/content/templateRenderer');
    
    const loader = new ContentLoader();
    const renderer = new TemplateRenderer();
    
    // Determine language and native slug from URL
    let language = 'en';
    let nativeSlug = slugPath;
    
    if (resolvedParams.slug[0] && ['cs', 'de', 'fr'].includes(resolvedParams.slug[0])) {
      language = resolvedParams.slug[0];
      nativeSlug = resolvedParams.slug.slice(1).join('/');
    }

    // Load the page content
    const page = await loader.loadPage(nativeSlug, language);

    if (!page) {
      notFound();
    }

    // Select template and render content
    const template = renderer.selectTemplate(page.markdown);
    const renderedContent = await renderer.renderContent(page, template);

    return (
      <>
        <HeroSpacer />
        <PageRenderer 
          content={renderedContent}
        />
      </>
    );
  } catch (error) {
    console.error('Failed to load CMS content:', error);
    notFound();
  }
} 