import React from 'react';
import { ClassComposer } from '@/lib/classComposition';
import { Container, Section } from '@/components/atoms';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  image?: string;
}

interface BlogSectionProps {
  title?: string;
  subtitle?: string;
  posts?: BlogPost[];
  variant?: 'preview' | 'grid' | 'list';
  showViewAll?: boolean;
  className?: string;
}

export function BlogSection({ 
  title = "Latest Insights",
  subtitle = "Stay updated with the latest trends and insights in digital transformation",
  posts = [],
  variant = 'preview',
  showViewAll = true,
  className = "" 
}: BlogSectionProps) {
  const composer = new ClassComposer('blog-section', className);

  const defaultPosts: BlogPost[] = [
    {
      id: '1',
      title: "The Future of AI in European Business",
      excerpt: "Discover how artificial intelligence is transforming European businesses and what you need to know to stay competitive.",
      date: "2024-01-15",
      author: "AI Team",
      category: "Artificial Intelligence",
      readTime: "5 min read",
      image: "/images/blog/ai-future.jpg"
    },
    {
      id: '2',
      title: "Digital Transformation Success Stories",
      excerpt: "Learn from real European companies that have successfully transformed their operations with modern technology.",
      date: "2024-01-10",
      author: "Digital Team",
      category: "Digital Transformation",
      readTime: "7 min read",
      image: "/images/blog/digital-success.jpg"
    },
    {
      id: '3',
      title: "GDPR Compliance in 2024",
      excerpt: "Essential updates and best practices for maintaining GDPR compliance in the evolving European regulatory landscape.",
      date: "2024-01-05",
      author: "Legal Team",
      category: "Compliance",
      readTime: "6 min read",
      image: "/images/blog/gdpr-2024.jpg"
    }
  ];

  const displayPosts = posts.length > 0 ? posts : defaultPosts;

  const renderPost = (post: BlogPost) => (
    <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {post.image && (
        <div className="aspect-video bg-gray-200">
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-medium text-blue-600">{post.category}</span>
          <span className="text-gray-400">•</span>
          <span className="text-sm text-gray-500">{post.readTime}</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            <span>{post.author}</span>
            <span className="mx-2">•</span>
            <span>{new Date(post.date).toLocaleDateString()}</span>
          </div>
          <a 
            href={`/blog/${post.id}`}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Read More →
          </a>
        </div>
      </div>
    </article>
  );

  return (
    <Section className={composer.getClasses()}>
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </div>
        
        <div className={`grid gap-8 ${
          variant === 'preview' ? 'md:grid-cols-3' : 
          variant === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 
          'md:grid-cols-1'
        }`}>
          {displayPosts.map(renderPost)}
        </div>
        
        {showViewAll && (
          <div className="text-center mt-12">
            <a 
              href="/blog"
              className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
            >
              View All Posts
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        )}
      </Container>
    </Section>
  );
}
