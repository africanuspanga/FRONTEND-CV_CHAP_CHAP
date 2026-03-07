import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug, getRelatedPosts } from '@/lib/blog';
import { FileText, ArrowLeft, ArrowRight, Clock, Calendar, User } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    keywords: post.tags,
    authors: [{ name: post.author.name }],
    alternates: {
      canonical: `https://www.cvchapchap.com/blog/${post.slug}`,
    },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: `https://www.cvchapchap.com/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.publishDate,
      modifiedTime: post.updatedDate,
      authors: [post.author.name],
      tags: post.tags,
      siteName: 'CV Chap Chap',
      images: post.featuredImage
        ? [{ url: post.featuredImage, alt: post.featuredImageAlt }]
        : [{ url: '/images/cv-hero-image.png', alt: 'CV Chap Chap Blog' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle,
      description: post.metaDescription,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const relatedPosts = getRelatedPosts(slug, 3);

  // BlogPosting JSON-LD
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription,
    image: post.featuredImage || 'https://www.cvchapchap.com/images/cv-hero-image.png',
    url: `https://www.cvchapchap.com/blog/${post.slug}`,
    datePublished: post.publishDate,
    dateModified: post.updatedDate,
    author: {
      '@type': 'Person',
      name: post.author.name,
      jobTitle: post.author.role,
    },
    publisher: {
      '@type': 'Organization',
      name: 'CV Chap Chap',
      url: 'https://www.cvchapchap.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.cvchapchap.com/images/cv-logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.cvchapchap.com/blog/${post.slug}`,
    },
    wordCount: post.content.split(/\s+/).length,
    keywords: post.tags.join(', '),
  };

  // FAQPage JSON-LD
  const faqJsonLd = post.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  } : null;

  // BreadcrumbList JSON-LD
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.cvchapchap.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://www.cvchapchap.com/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://www.cvchapchap.com/blog/${post.slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white font-body">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cv-blue-600 flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-gray-900">
                CV <span className="text-cv-blue-600">Chap Chap</span>
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/blog"
                className="hidden sm:inline text-gray-600 hover:text-cv-blue-600 font-medium transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/template"
                className="px-4 py-2 bg-cv-blue-600 text-white font-semibold rounded-lg text-sm hover:bg-cv-blue-700 transition-colors"
              >
                Create CV
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Breadcrumbs */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        <nav className="flex items-center gap-2 text-sm text-gray-400">
          <Link href="/" className="hover:text-cv-blue-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href="/blog"
            className="hover:text-cv-blue-600 transition-colors"
          >
            Blog
          </Link>
          <span>/</span>
          <span className="text-gray-600 truncate">{post.title}</span>
        </nav>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Article Header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-cv-blue-100 text-cv-blue-700 rounded-full text-sm font-medium">
              {post.category}
            </span>
            <span className="text-gray-400 text-sm flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.readTime} min read
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-[2.5rem] font-bold text-gray-900 leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-gray-600 text-lg mb-6">{post.excerpt}</p>
          <div className="flex flex-wrap items-center gap-4 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-cv-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-cv-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {post.author.name}
                </p>
                <p className="text-xs text-gray-500">{post.author.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(post.publishDate).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              {post.updatedDate !== post.publishDate && (
                <span>
                  Updated:{' '}
                  {new Date(post.updatedDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Featured Image Placeholder */}
        <div className="aspect-video bg-gradient-to-br from-cv-blue-50 to-gray-50 rounded-xl flex items-center justify-center mb-8 border border-gray-200">
          <div className="text-center">
            <FileText className="w-16 h-16 text-cv-blue-200 mx-auto mb-3" />
            <p className="text-cv-blue-300 text-sm">Featured Image</p>
          </div>
        </div>

        {/* Article Content */}
        <div
          className="prose prose-lg max-w-none
            prose-headings:font-display prose-headings:text-gray-900
            prose-h2:text-2xl prose-h2:sm:text-3xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
            prose-li:text-gray-700
            prose-a:text-cv-blue-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-l-cv-blue-500 prose-blockquote:bg-gray-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-gray-700
            prose-strong:text-gray-900
            prose-table:border-collapse
            prose-th:bg-gray-100 prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-semibold prose-th:text-gray-900 prose-th:border prose-th:border-gray-200
            prose-td:px-4 prose-td:py-2 prose-td:border prose-td:border-gray-200
          "
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Image Placeholder Notice */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .blog-image-placeholder {
                width: 100%;
                aspect-ratio: 16/9;
                background: linear-gradient(135deg, #eff6ff 0%, #f9fafb 100%);
                border: 2px dashed #bfdbfe;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 2rem 0;
                position: relative;
              }
              .blog-image-placeholder::after {
                content: attr(data-alt);
                color: #93c5fd;
                font-size: 0.875rem;
                text-align: center;
                padding: 1rem;
              }
            `,
          }}
        />

        {/* FAQ Section */}
        {post.faqs.length > 0 && (
          <section className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {post.faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl p-6 border border-gray-200"
                >
                  <h3 className="font-display font-semibold text-lg text-gray-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tags */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* CTA Box */}
        <div className="mt-10 bg-cv-blue-600 rounded-2xl p-6 sm:p-8 text-white text-center">
          <h3 className="font-display text-xl sm:text-2xl font-bold mb-3">
            Ready to Create Your Professional CV?
          </h3>
          <p className="text-cv-blue-100 mb-6 max-w-lg mx-auto">
            Put these tips into practice. Build a stunning, ATS-friendly CV in
            under 3 minutes with CV Chap Chap.
          </p>
          <Link
            href="/template"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-cv-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Create Your CV Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-gray-50 py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-8">
              Related Articles
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group block"
                >
                  <article className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-cv-blue-200 hover:shadow-md transition-all h-full flex flex-col">
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                      <FileText className="w-10 h-10 text-gray-300" />
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <span className="text-xs text-cv-blue-600 font-medium mb-2">
                        {related.category}
                      </span>
                      <h3 className="font-display font-bold text-gray-900 mb-2 group-hover:text-cv-blue-600 transition-colors line-clamp-2">
                        {related.title}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-2 flex-1">
                        {related.excerpt}
                      </p>
                      <span className="text-cv-blue-600 font-medium text-sm mt-3 flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read More <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back to Blog */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-cv-blue-600 font-medium hover:gap-3 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Articles
        </Link>
      </div>

      {/* Footer */}
      <footer className="bg-cv-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="sm:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-cv-blue-600 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <span className="font-display font-bold text-xl">
                  CV Chap Chap
                </span>
              </div>
              <p className="text-gray-400 max-w-md">
                AI-powered CV builder for Tanzania and East Africa. Create
                professional CVs in minutes.
              </p>
            </div>
            <div>
              <h4 className="font-display font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/template"
                    className="hover:text-white transition-colors"
                  >
                    Create CV
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="hover:text-white transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/affiliate"
                    className="hover:text-white transition-colors"
                  >
                    Affiliate Program
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} CV Chap Chap. All rights
            reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
