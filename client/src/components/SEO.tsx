import React, { useEffect } from 'react';
import { useLocation } from 'wouter';

interface MetaData {
  title: string;
  description: string;
  type?: string;
  ogImage?: string;
  noIndex?: boolean;
}

const pageMeta: Record<string, MetaData> = {
  // Home Page
  '/': {
    title: 'CV Chap Chap – Make a CV Fast and Get Hired even Faster',
    description: 'Create a professional CV in minutes with CV Chap Chap! The leading CV builder for job seekers across Tanzania, Kenya, and Uganda. Build modern, job-ready CVs instantly with our expert templates and guided process.'
  },
  // About Page
  '/about': {
    title: 'About CV Chap Chap – Your CV Builder for East Africa Jobs',
    description: 'Learn how CV Chap Chap is helping East African youth land jobs faster. Discover our mission, vision, and why we\'re the easiest way to create a CV online.'
  },
  // Login Page 
  '/auth': {
    title: 'Login to CV Chap Chap – Access Your CV Builder',
    description: 'Welcome back! Log in to CV Chap Chap to access your saved resumes, edit templates, and download your CV anytime – fast and easy for job seekers in Tanzania.'
  },
  // Registration Page (uses the same route but different UI state)
  '/signup': {
    title: 'Sign Up – Start Building Your CV with CV Chap Chap',
    description: 'Create your free account and start building your CV now. Fast sign-up for job seekers in Tanzania, Kenya, and Uganda – get hired faster with CV Chap Chap.'
  },
  // Templates Page
  '/templates': {
    title: 'CV Templates – Choose Modern Resume Designs | CV Chap Chap',
    description: 'Explore beautiful, job-ready CV templates for every profession. Tailored for East African job markets. Just fill in your info and download in seconds!'
  },
  // How to Write a CV Guide
  '/how-to-write-cv': {
    title: 'How to Write a CV in 2025 – Complete Guide with Examples | CV Chap Chap',
    description: 'Learn how to write a professional CV with our step-by-step guide. Includes CV examples, templates, and tips for Tanzania, Kenya, and Uganda job seekers.'
  },
  // Admin Dashboard (no-index)
  '/admin-dashboard': {
    title: 'Admin Dashboard | CV Chap Chap',
    description: 'Admin dashboard for CV Chap Chap platform management',
    noIndex: true
  }
};

// Fallback default meta values
const defaultMeta: MetaData = {
  title: 'CV Chap Chap – Professional CV Builder',
  description: 'Create a job-winning CV with CV Chap Chap - the easiest way to build a professional resume in East Africa',
  type: 'website'
};

const SEO: React.FC = () => {
  const [location] = useLocation();
  
  useEffect(() => {
    // Get metadata for current page, or use default if not found
    const currentMeta = pageMeta[location] || defaultMeta;
    
    // Update document title
    document.title = currentMeta.title;
    
    // Update meta description
    const descriptionTag = document.querySelector('meta[name="description"]');
    if (descriptionTag) {
      descriptionTag.setAttribute('content', currentMeta.description);
    }
    
    // Update Open Graph tags
    const ogTitleTag = document.querySelector('meta[property="og:title"]');
    const ogDescTag = document.querySelector('meta[property="og:description"]');
    const ogTypeTag = document.querySelector('meta[property="og:type"]');
    
    if (ogTitleTag) ogTitleTag.setAttribute('content', currentMeta.title);
    if (ogDescTag) ogDescTag.setAttribute('content', currentMeta.description);
    if (ogTypeTag && currentMeta.type) ogTypeTag.setAttribute('content', currentMeta.type);
    
    // Update Twitter tags
    const twitterTitleTag = document.querySelector('meta[name="twitter:title"]');
    const twitterDescTag = document.querySelector('meta[name="twitter:description"]');
    
    if (twitterTitleTag) twitterTitleTag.setAttribute('content', currentMeta.title);
    if (twitterDescTag) twitterDescTag.setAttribute('content', currentMeta.description);
    
    // Add robots meta tag if noIndex is true
    let robotsTag = document.querySelector('meta[name="robots"]');
    if (currentMeta.noIndex) {
      if (!robotsTag) {
        robotsTag = document.createElement('meta');
        robotsTag.setAttribute('name', 'robots');
        document.head.appendChild(robotsTag);
      }
      robotsTag.setAttribute('content', 'noindex,follow');
    } else if (robotsTag) {
      // Remove robots tag if it exists and page should be indexed
      robotsTag.remove();
    }
    
    // Add canonical URL
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', window.location.origin + location);
    
  }, [location]);
  
  return null; // This component doesn't render anything visible
};

export default SEO;
