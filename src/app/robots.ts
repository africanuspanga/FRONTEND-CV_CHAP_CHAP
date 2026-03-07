import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/admin-login', '/dashboard/'],
      },
      {
        userAgent: 'GPTBot',
        allow: ['/blog/', '/'],
      },
      {
        userAgent: 'Google-Extended',
        allow: ['/blog/', '/'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: ['/blog/', '/'],
      },
      {
        userAgent: 'anthropic-ai',
        allow: ['/blog/', '/'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: ['/blog/', '/'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: ['/blog/', '/'],
      },
    ],
    sitemap: 'https://www.cvchapchap.com/sitemap.xml',
  };
}
