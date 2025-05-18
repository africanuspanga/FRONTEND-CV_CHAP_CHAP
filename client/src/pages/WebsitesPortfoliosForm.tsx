import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { ChevronLeft, Trash2, Plus } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCVForm } from '@/contexts/cv-form-context';
import { Helmet } from 'react-helmet';

// Define interface for structured link data
interface WebsiteLink {
  id: string;
  name: string;
  url: string;
}

const WebsitesPortfoliosForm = () => {
  const [, navigate] = useLocation();
  const { formData, updateFormField } = useCVForm();
  const templateId = formData.templateId;
  
  // Initialize with existing data or create new structured link objects
  const [websites, setWebsites] = useState<WebsiteLink[]>(() => {
    // If we have existing website links as objects, use them
    if (Array.isArray(formData.websites) && formData.websites.length > 0) {
      // Check if first item is an object with url property
      if (typeof formData.websites[0] === 'object' && formData.websites[0] !== null && 'url' in formData.websites[0]) {
        return formData.websites as WebsiteLink[];
      }
      
      // Handle legacy string array format
      if (typeof formData.websites[0] === 'string') {
        return formData.websites
          .filter((url: any) => url && typeof url === 'string' && url.trim() !== '')
          .map((url: string, index: number) => ({
            id: `link-${Date.now()}-${index}`,
            name: index === 0 ? 'LinkedIn' : index === 1 ? 'GitHub' : 'Portfolio',
            url: url
          }));
      }
    }
    
    // Default empty links
    return [
      { id: `link-${Date.now()}-1`, name: 'LinkedIn', url: '' },
      { id: `link-${Date.now()}-2`, name: 'GitHub', url: '' },
      { id: `link-${Date.now()}-3`, name: 'Portfolio', url: '' }
    ];
  });

  const handleUrlChange = (index: number, value: string) => {
    const updatedWebsites = [...websites];
    updatedWebsites[index].url = value;
    setWebsites(updatedWebsites);
  };
  
  const handleNameChange = (index: number, value: string) => {
    const updatedWebsites = [...websites];
    updatedWebsites[index].name = value;
    setWebsites(updatedWebsites);
  };
  
  const addNewLink = () => {
    setWebsites([
      ...websites,
      { id: `link-${Date.now()}-${websites.length}`, name: 'Custom Link', url: '' }
    ]);
  };
  
  const removeLink = (index: number) => {
    const updatedWebsites = [...websites];
    updatedWebsites.splice(index, 1);
    setWebsites(updatedWebsites);
  };

  const handleSave = () => {
    // Filter out empty website URLs
    const filteredWebsites = websites.filter(site => site.url.trim() !== '');
    
    // Update the websites field with properly structured JSON objects
    // Each website object has id, name, and url properties
    updateFormField('websites', filteredWebsites);
    
    // Set main personal website in personalInfo object
    if (filteredWebsites.length > 0) {
      // Update personalInfo.website field if it exists
      const personalInfo = { ...formData.personalInfo };
      personalInfo.website = filteredWebsites[0].url;
      updateFormField('personalInfo', personalInfo);
    }
    
    // Also save as localStorage backup to ensure data persistence
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('cv-websites-data', JSON.stringify(filteredWebsites));
      } catch (err) {
        console.log('Failed to save websites to localStorage');
      }
    }
    
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
            <div key={website.id} className="p-4 border rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Link {index + 1}</h3>
                {websites.length > 1 && (
                  <button 
                    onClick={() => removeLink(index)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Remove link"
                    type="button"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor={`link-name-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Link Name
                  </label>
                  <Input
                    id={`link-name-${index}`}
                    placeholder="e.g., LinkedIn, GitHub, Portfolio"
                    value={website.name}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                    className="h-12"
                  />
                </div>
                
                <div>
                  <label htmlFor={`link-url-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                    URL
                  </label>
                  <Input
                    id={`link-url-${index}`}
                    type="url" 
                    placeholder={
                      website.name.toLowerCase().includes('linkedin') 
                        ? "https://www.linkedin.com/in/yourprofile" 
                        : website.name.toLowerCase().includes('github')
                        ? "https://github.com/yourusername"
                        : "https://example.com"
                    }
                    value={website.url}
                    onChange={(e) => handleUrlChange(index, e.target.value)}
                    className="h-12"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <Button 
          onClick={addNewLink}
          variant="outline"
          className="mb-6 w-full flex items-center justify-center"
          type="button"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Another Link
        </Button>

        <div className="flex justify-end">
          <Button 
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Save Links
          </Button>
        </div>
      </div>
    </>
  );
};

export default WebsitesPortfoliosForm;