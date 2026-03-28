import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/auth/context";
import { ReferralTracker } from "@/components/referral-tracker";
import { Suspense } from "react";
import Script from "next/script";

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.cvchapchap.com'),
  title: {
    default: 'CV Chap Chap | CV Builder for Tanzania & East Africa',
    template: '%s | CV Chap Chap',
  },
  description: 'AI-powered CV builder for Tanzania & East Africa. Professional CV templates, AI suggestions, and instant PDF download. Create your CV in minutes.',
  keywords: [
    'CV', 'cv maker', 'cv builder', 'cv template', 'cv format',
    'how to write a cv', 'cv Tanzania', 'cv East Africa', 'cv samples',
    'best cv format', 'cv builder free', 'cv creator', 'cv ats',
    'professional cv', 'cv bora', 'ajira', 'cv examples for job',
    'cv examples for students with no experience', 'resume builder',
    'cv application letter', 'cv curriculum vitae', 'intelligent cv',
    'cv app', 'cv africa', 'best cv template',
  ],
  authors: [{ name: 'CV Chap Chap', url: 'https://www.cvchapchap.com' }],
  creator: 'CV Chap Chap',
  publisher: 'CV Chap Chap',
  alternates: {
    canonical: 'https://www.cvchapchap.com',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.cvchapchap.com',
    siteName: 'CV Chap Chap',
    title: 'CV Chap Chap | CV Builder for Tanzania & East Africa',
    description: 'AI-powered CV builder for Tanzania & East Africa. Professional CV templates, AI suggestions, and instant PDF download. Create your CV in minutes.',
    images: [
      {
        url: '/images/cv-hero-image.png',
        width: 1200,
        height: 630,
        alt: 'CV Chap Chap - Professional CV Builder for Tanzania and East Africa',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CV Chap Chap - Create Professional CVs in Minutes',
    description: 'AI-powered CV builder with 35+ ATS-friendly templates. Made in Tanzania for East African job seekers.',
    images: ['/images/cv-hero-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        {/* Organization JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'CV Chap Chap',
              url: 'https://www.cvchapchap.com',
              logo: 'https://www.cvchapchap.com/images/cv-logo.png',
              description: 'AI-powered CV builder for Tanzania and East Africa. Create professional CVs in minutes.',
              foundingDate: '2024',
              founders: [{ '@type': 'Person', name: 'CV Chap Chap Team' }],
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Dar es Salaam',
                addressCountry: 'TZ',
              },
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+255682152148',
                contactType: 'customer service',
                email: 'info@cvchapchap.com',
                availableLanguage: ['English', 'Swahili'],
              },
              sameAs: [],
            }),
          }}
        />
        {/* WebSite JSON-LD for Sitelinks Search */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'CV Chap Chap',
              url: 'https://www.cvchapchap.com',
              description: 'AI-powered CV builder for Tanzania and East Africa',
              publisher: {
                '@type': 'Organization',
                name: 'CV Chap Chap',
              },
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://www.cvchapchap.com/blog?q={search_term_string}',
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        {/* SoftwareApplication JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'CV Chap Chap',
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'Web',
              url: 'https://www.cvchapchap.com',
              description: 'AI-powered CV builder with 35+ professional templates for Tanzania and East Africa. Create ATS-friendly CVs in 3 minutes.',
              offers: {
                '@type': 'Offer',
                price: '5000',
                priceCurrency: 'TZS',
                description: 'Professional CV PDF download',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.9',
                ratingCount: '5000',
                bestRating: '5',
              },
              featureList: [
                '35+ professional CV templates',
                'AI-powered content suggestions',
                'ATS-friendly formatting',
                'Mobile-first design',
                'Instant PDF download',
                'M-Pesa and mobile money payment',
              ],
            }),
          }}
        />
        {/* Ahrefs Analytics */}
        <script src="https://analytics.ahrefs.com/analytics.js" data-key="NCyaH4wEh72zvT4dJyi2FQ" async></script>
      {/* Meta Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '911248878174155');
fbq('track', 'PageView');`,
          }}
        />
        <noscript>
          <img height="1" width="1" style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=911248878174155&ev=PageView&noscript=1"
          />
        </noscript>
        {/* End Meta Pixel Code */}
      </head>
      {/* Google Analytics */}
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-YE0Z3NGWN7" strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-YE0Z3NGWN7');
        `}
      </Script>
      <body className={`${plusJakarta.variable} ${spaceGrotesk.variable} font-body`}>
        <AuthProvider>
          <Suspense fallback={null}>
            <ReferralTracker />
          </Suspense>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
