import React from 'react';
import { notFound } from 'next/navigation';
import { HeroSpacer } from '@/components/atoms';
import PageRenderer from '@/components/pages/PageRenderer';

// Function to check if a project exists
async function checkProjectExists(prototypeId: string): Promise<boolean> {
  try {
    // Check if it's a valid format
    if (!prototypeId || prototypeId.length < 3) {
      return false;
    }
    
    // Check if the prototype files exist in the filesystem
    const fs = await import('fs/promises');
    const path = await import('path');
    
    try {
      const prototypePath = path.join(process.cwd(), '..', '..', 'statex-ai', 'services', 'prototype-generator', 'prototypes', `project-${prototypeId}`);
      const indexPath = path.join(prototypePath, 'index.html');
      
      // Check if the index.html file exists
      await fs.access(indexPath);
      console.log(`[PROJECT-CHECK] Found prototype files for: ${prototypeId}`);
      return true;
    } catch (error) {
      console.log(`[PROJECT-CHECK] No prototype files found for: ${prototypeId}`);
      return false;
    }
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
  if (slugPath.startsWith('_next/') || slugPath.startsWith('__nextjs_') || slugPath.startsWith('.well-known')) {
    console.log(`[CATCHALL] Skipping static asset: ${slugPath}`);
    notFound();
  }
  
  // Check if this is a prototype subdomain
  const prototypeMatch = host.match(/^project-([a-zA-Z0-9_-]+)\.localhost(:\d+)?$/);
  
  if (prototypeMatch) {
    const prototypeId = prototypeMatch[1] || '';
    console.log(`[CATCHALL] Found prototype subdomain: ${prototypeId}, path: ${slugPath}`);
    
    // Check if this is a valid project by checking if it exists in our system
    const isValidProject = await checkProjectExists(prototypeId);
    
    if (!isValidProject) {
      // Project doesn't exist - show "Project Not Found" page
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
    
    // Serve content directly on the subdomain
    if (slugPath === '') {
      // Main prototype page - serve the actual generated HTML
      try {
        const fs = await import('fs/promises');
        const path = await import('path');
        
        const prototypePath = path.join(process.cwd(), '..', '..', 'statex-ai', 'services', 'prototype-generator', 'prototypes', `project-${prototypeId}`);
        const indexPath = path.join(prototypePath, 'index.html');
        
        // Read the generated HTML file
        const htmlContent = await fs.readFile(indexPath, 'utf-8');
        
        // Return the HTML content directly
        return (
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        );
      } catch (error) {
        console.error('Error serving prototype:', error);
        return (
          <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto px-4 py-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">Prototype: {prototypeId}</h1>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Error Loading Prototype</h2>
                <p className="text-gray-600 mb-6">
                  There was an error loading the prototype files. Please try again later.
                </p>
              </div>
            </div>
          </div>
        );
      }
    } else if (slugPath === 'plan') {
      // Plan page - serve directly on subdomain
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Development Plan</h1>
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-semibold text-gray-700 mb-4">Project: {prototypeId}</h2>
                  <p className="text-gray-600 mb-6">
                    This is your comprehensive development plan generated by our AI system based on your requirements.
                  </p>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-green-800 mb-3">Project Overview</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="font-medium text-green-700">Status:</span>
                        <span className="ml-2 text-green-600">In Development</span>
                      </div>
                      <div>
                        <span className="font-medium text-green-700">Timeline:</span>
                        <span className="ml-2 text-green-600">4-6 weeks</span>
                      </div>
                      <div>
                        <span className="font-medium text-green-700">Complexity:</span>
                        <span className="ml-2 text-green-600">Medium-High</span>
                      </div>
                      <div>
                        <span className="font-medium text-green-700">Team Size:</span>
                        <span className="ml-2 text-green-600">3-4 developers</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-3">Phase 1: Foundation (Week 1-2)</h3>
                      <ul className="list-disc list-inside text-gray-600 space-y-2">
                        <li>Project setup and environment configuration</li>
                        <li>Database design and implementation</li>
                        <li>Core architecture establishment</li>
                        <li>Basic authentication system</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-3">Phase 2: Core Features (Week 3-4)</h3>
                      <ul className="list-disc list-inside text-gray-600 space-y-2">
                        <li>Main functionality implementation</li>
                        <li>User interface development</li>
                        <li>API integration and testing</li>
                        <li>Security implementation</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-3">Phase 3: Polish & Launch (Week 5-6)</h3>
                      <ul className="list-disc list-inside text-gray-600 space-y-2">
                        <li>Performance optimization</li>
                        <li>Comprehensive testing</li>
                        <li>Documentation completion</li>
                        <li>Deployment and monitoring setup</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-800 mb-3">Next Steps</h3>
                    <p className="text-blue-700 mb-4">
                      Your development team will begin work immediately. You'll receive regular updates and can track progress through our project management system.
                    </p>
                    <div className="flex space-x-4">
                      <a href={`/prototype-results/${prototypeId}`} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        View Internal Details
                      </a>
                      <a href="/contact" className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                        Contact Team
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (slugPath === 'offer') {
      // Offer page - serve directly on subdomain
      return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Service Offer</h1>
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-semibold text-gray-700 mb-4">Project: {prototypeId}</h2>
                  <p className="text-gray-600 mb-6">
                    This is our detailed service offer based on your requirements and the AI analysis of your project.
                  </p>
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-amber-800 mb-3">Project Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="font-medium text-amber-700">Project Type:</span>
                        <span className="ml-2 text-amber-600">Custom Web Application</span>
                      </div>
                      <div>
                        <span className="font-medium text-amber-700">Estimated Duration:</span>
                        <span className="ml-2 text-amber-600">4-6 weeks</span>
                      </div>
                      <div>
                        <span className="font-medium text-amber-700">Team Size:</span>
                        <span className="ml-2 text-amber-600">3-4 developers</span>
                      </div>
                      <div>
                        <span className="font-medium text-amber-700">Technology Stack:</span>
                        <span className="ml-2 text-amber-600">Modern Web Technologies</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-3">What's Included</h3>
                      <ul className="list-disc list-inside text-gray-600 space-y-2">
                        <li>Complete web application development</li>
                        <li>Responsive design for all devices</li>
                        <li>Database design and implementation</li>
                        <li>User authentication and security</li>
                        <li>API development and integration</li>
                        <li>Testing and quality assurance</li>
                        <li>Deployment and hosting setup</li>
                        <li>Documentation and training</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-3">Pricing Structure</h3>
                      <div className="bg-gray-50 rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-lg font-medium text-gray-700">Base Development</span>
                          <span className="text-2xl font-bold text-gray-800">€15,000</span>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-lg font-medium text-gray-700">Additional Features</span>
                          <span className="text-lg text-gray-600">€2,000 - €5,000</span>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-lg font-medium text-gray-700">Maintenance (3 months)</span>
                          <span className="text-lg text-gray-600">€1,500</span>
                        </div>
                        <hr className="my-4" />
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-gray-800">Total Estimated Cost</span>
                          <span className="text-3xl font-bold text-blue-600">€18,500 - €21,500</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-3">Payment Terms</h3>
                      <ul className="list-disc list-inside text-gray-600 space-y-2">
                        <li>30% upfront payment to start development</li>
                        <li>40% milestone payment after Phase 1 completion</li>
                        <li>30% final payment upon project delivery</li>
                        <li>Maintenance fees billed monthly</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-800 mb-3">Ready to Get Started?</h3>
                    <p className="text-green-700 mb-4">
                      This offer is valid for 30 days. We can begin development immediately upon your approval.
                    </p>
                    <div className="flex space-x-4">
                      <a href="/contact" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                        Accept Offer
                      </a>
                      <a href={`/prototype-results/${prototypeId}`} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        View Technical Details
                      </a>
                      <a href="/contact" className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                        Discuss Changes
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      // Any other path - redirect to main prototype-results page
      const { redirect } = await import('next/navigation');
      redirect(`/prototype-results/${prototypeId}`);
    }
  }
  
  // For non-subdomain requests, continue with CMS logic
  try {
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
    
    const page = await loader.loadPage(nativeSlug, language);
    
    if (!page) {
      notFound();
    }
    
    // Select template and render content
    const template = renderer.selectTemplate(page.markdown);
    const renderedContent = await renderer.renderContent(page, template);
    
    return (
      <div>
        <HeroSpacer />
        <PageRenderer content={renderedContent} />
      </div>
    );
  } catch (error) {
    console.error('Error loading page:', error);
    notFound();
  }
}