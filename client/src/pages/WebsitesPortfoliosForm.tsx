import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCVForm } from '@/contexts/cv-form-context';
import { Helmet } from 'react-helmet';

const WebsitesPortfoliosForm = () => {
  const [, navigate] = useLocation();
  const { formData, updateFormField } = useCVForm();
  const templateId = formData.templateId;
  
  // Initialize with existing data or empty array with 3 empty strings
  const [websites, setWebsites] = useState<string[]>(
    formData.websites && formData.websites.length > 0 
      ? formData.websites 
      : ['', '', '']
  );

  const handleInputChange = (index: number, value: string) => {
    const updatedWebsites = [...websites];
    updatedWebsites[index] = value;
    setWebsites(updatedWebsites);
  };

  const handleSave = () => {
    // Filter out empty websites
    const filteredWebsites = websites.filter(site => site.trim() !== '');
    updateFormField('websites', filteredWebsites);
    
    // Navigate back to additional sections
    navigate(`/cv/${templateId}/additional-sections`);
  };

  return (
    <>
      <Helmet>
        <title>Websites & Portfolios - CV Chap Chap</title>
        <meta 
          name="description" 
          content="Add your websites, portfolios and professional links to showcase your online presence to potential employers." 
        />
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link href={`/cv/${templateId}/additional-sections`} className="flex items-center text-indigo-600 mb-6">
          <ChevronLeft className="w-4 h-4 mr-1" />
          <span>Go Back</span>
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">Websites, Portfolios, Profiles</h1>

        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5 text-amber-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" x2="12" y1="8" y2="12"></line>
                <line x1="12" x2="12.01" y1="16" y2="16"></line>
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">Pro Tip</h3>
              <div className="text-sm text-amber-700 mt-1">
                We recommend adding social networks like LinkedIn and GitHub to your header, to help employers get to know you better.
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 mb-8">
          {websites.map((website, index) => (
            <div key={index} className="space-y-2">
              <label htmlFor={`link-${index}`} className="block text-sm font-medium text-gray-700">
                LINK/URL {index + 1}
              </label>
              <Input
                id={`link-${index}`}
                type="url"
                placeholder={index === 0 ? "https://www.linkedin.com/in/yourprofile" : 
                             index === 1 ? "https://github.com/yourusername" : 
                             "https://example.com"}
                value={website}
                onChange={(e) => handleInputChange(index, e.target.value)}
                className="h-12"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Save
          </Button>
        </div>
      </div>
    </>
  );
};

export default WebsitesPortfoliosForm;