import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts, getAllCategories } from '@/lib/blog';
import { FileText, ArrowRight, Clock, Calendar } from 'lucide-react';

export const metadata: Metadata = {
  title: 'CV Writing Blog | Tips, Guides & Career Advice',
  description:
    'Expert CV writing tips, career advice, and job search guides for East Africa. Learn to write a professional CV, pass ATS, and land your dream job.',
  alternates: {
    canonical: 'https://www.cvchapchap.com/blog',
  },
  openGraph: {
    title: 'CV Writing Blog | CV Chap Chap',
    description:
      'Expert CV writing tips, career advice, and job search guides for Tanzania and East Africa.',
    url: 'https://www.cvchapchap.com/blog',
    type: 'website',
  },
};

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = getAllCategories();
  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'CV Chap Chap Blog',
    description:
      'Expert CV writing tips, career advice, and job search guides for Tanzania and East Africa.',
    url: 'https://www.cvchapchap.com/blog',
    publisher: {
      '@type': 'Organization',
      name: 'CV Chap Chap',
      url: 'https://www.cvchapchap.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.cvchapchap.com/images/cv-logo.png',
      },
    },
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.metaDescription,
      url: `https://www.cvchapchap.com/blog/${post.slug}`,
      datePublished: post.publishDate,
      dateModified: post.updatedDate,
      author: {
        '@type': 'Person',
        name: post.author.name,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-white font-body">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
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
                className="hidden sm:inline text-cv-blue-600 font-medium"
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

      {/* Hero */}
      <section className="bg-gradient-to-b from-cv-blue-50 to-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            CV Writing Blog
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Expert tips, guides, and career advice to help you create a
            professional CV and land your dream job in Tanzania and East Africa.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex gap-3 overflow-x-auto pb-2">
            <span className="px-4 py-2 bg-cv-blue-600 text-white rounded-full text-sm font-medium whitespace-nowrap">
              All Posts
            </span>
            {categories.map((category) => (
              <span
                key={category}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium whitespace-nowrap hover:bg-gray-200 transition-colors"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <Link href={`/blog/${featuredPost.slug}`} className="block group">
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 hover:border-cv-blue-200 transition-colors">
              {/* Featured image */}
              <div className="relative aspect-video md:aspect-auto md:h-full min-h-[200px] md:min-h-[300px] overflow-hidden">
                {featuredPost.featuredImage ? (
                  <Image
                    src={featuredPost.featuredImage}
                    alt={featuredPost.featuredImageAlt || featuredPost.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-cv-blue-100 to-cv-blue-50 flex items-center justify-center">
                    <FileText className="w-16 h-16 text-cv-blue-300" />
                  </div>
                )}
              </div>
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-cv-blue-100 text-cv-blue-700 rounded-full text-xs font-medium">
                    {featuredPost.category}
                  </span>
                  <span className="text-gray-400 text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {featuredPost.readTime} min read
                  </span>
                </div>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-gray-900 mb-3 group-hover:text-cv-blue-600 transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(featuredPost.publishDate).toLocaleDateString(
                      'en-US',
                      { month: 'long', day: 'numeric', year: 'numeric' }
                    )}
                  </span>
                  <span className="text-cv-blue-600 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read More <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {remainingPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block"
            >
              <article className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-cv-blue-200 hover:shadow-md transition-all h-full flex flex-col">
                {/* Card image */}
                <div className="relative aspect-video overflow-hidden">
                  {post.featuredImage ? (
                    <Image
                      src={post.featuredImage}
                      alt={post.featuredImageAlt || post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                      <FileText className="w-10 h-10 text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="p-5 sm:p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                    <span className="text-gray-400 text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime} min
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-gray-900 mb-2 group-hover:text-cv-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <span className="text-gray-400 text-xs">
                      {new Date(post.publishDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="text-cv-blue-600 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-cv-blue-600 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to Create Your Professional CV?
          </h2>
          <p className="text-cv-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Put these tips into action. Create a stunning, ATS-friendly CV in
            under 3 minutes with CV Chap Chap.
          </p>
          <Link
            href="/template"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-cv-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-lg"
          >
            Create Your CV Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

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
