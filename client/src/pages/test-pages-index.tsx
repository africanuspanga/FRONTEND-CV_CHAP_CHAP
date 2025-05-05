import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Index page for all test pages
 * 
 * This page provides links to all test pages in the application for easy navigation.
 */
export default function TestPagesIndex() {
  const testPages = [
    {
      title: 'Proxy Test',
      description: 'Test the CV Screener API proxy integration',
      path: '/proxy-test',
      emoji: '🌐'
    },
    {
      title: 'USSD Payment Test',
      description: 'Test the complete USSD payment flow',
      path: '/ussd-payment-test',
      emoji: '💳'
    },
    {
      title: 'API Status Check',
      description: 'Check the status of API services',
      path: '/api-status-check',
      emoji: '🔍'
    },
    {
      title: 'API Endpoint Test',
      description: 'Test specific API endpoints',
      path: '/api-endpoint-test',
      emoji: '🧪'
    },
    {
      title: 'CV Screener Test',
      description: 'Test CV Screener API integration',
      path: '/cv-screener-test',
      emoji: '📝'
    },
    {
      title: 'Backend Test',
      description: 'Test backend functionality',
      path: '/backend-test',
      emoji: '⚙️'
    },
    {
      title: 'OpenAI Test',
      description: 'Test OpenAI API integration',
      path: '/openai-test',
      emoji: '🤖'
    }
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold">Test Pages Index</h1>
        <p className="text-gray-600 max-w-2xl">
          This page provides links to all test pages in the application. These pages are used for testing 
          various API integrations and functionality. They are not part of the main application flow
          and are primarily used by developers for testing purposes.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {testPages.map((page, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-xl">{page.emoji}</span>
                  {page.title}
                </CardTitle>
                <CardDescription>{page.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Link href={page.path}>
                  <a className="w-full inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                    Open Test Page
                  </a>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-8 border-t pt-4">
          <Link href="/">
            <a className="text-primary hover:underline">← Back to Home</a>
          </Link>
        </div>
      </div>
    </div>
  );
}
