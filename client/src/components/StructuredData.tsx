import React from 'react';
import { useLocation } from 'wouter';

interface StructuredDataProps {
  type: 'website' | 'organization' | 'webApplication';
}

const StructuredData: React.FC<StructuredDataProps> = ({ type }) => {
  const [location] = useLocation();
  const websiteUrl = typeof window !== 'undefined' ? window.location.origin : '';
  
  let structuredData = {};
  
  switch (type) {
    case 'website':
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'url': websiteUrl,
        'name': 'CV Chap Chap',
        'description': 'Professional CV builder for East Africa',
        'potentialAction': {
          '@type': 'SearchAction',
          'target': `${websiteUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      };
      break;
      
    case 'organization':
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'url': websiteUrl,
        'name': 'CV Chap Chap',
        'logo': `${websiteUrl}/favicon/android-chrome-192x192.png`,
        'areaServed': ['Tanzania', 'Kenya', 'Uganda', 'East Africa'],
        'description': 'CV Chap Chap helps job seekers across Tanzania, Kenya, and Uganda build and download professional CVs instantly.',
        'sameAs': [
          // Social media links would go here
        ],
      };
      break;
      
    case 'webApplication':
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': 'CV Chap Chap',
        'applicationCategory': 'BusinessApplication',
        'operatingSystem': 'All',
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'TZS'
        },
        'description': 'Create a professional CV in minutes with CV Chap Chap. Our platform helps job seekers build modern, job-ready CVs designed for the East African job market.'
      };
      break;
      
    default:
      structuredData = {};
  }
  
  return (
    <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

export default StructuredData;
