import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { ChevronLeft, Plus, Undo2, RotateCw } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useCVForm } from '@/contexts/cv-form-context';
import { Helmet } from 'react-helmet';
import { Accomplishment } from '@shared/schema';

const AccomplishmentsForm = () => {
  const [, navigate] = useLocation();
  const { formData, updateFormField } = useCVForm();
  const templateId = formData.templateId;
  
  // Initialize with existing data or empty array (max 2 accomplishments)
  const [accomplishments, setAccomplishments] = useState<Accomplishment[]>(
    formData.accomplishments && formData.accomplishments.length > 0
      ? formData.accomplishments.slice(0, 2)
      : [{ title: '', description: '', id: crypto.randomUUID() }]
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);

  // Common accomplishments examples based on job roles
  const accomplishmentExamples: Record<string, string[]> = {
    'software engineer': [
      "Mentored 5 new employees to bring them up to speed on projects, resulting in quicker overall completion milestones.",
      "Provided extensive documentation on apps to clients outlining all aspects of the implemented updates and changes, resulting in a 30% reduction in client support calls."
    ],
    'project manager': [
      "Led cross-functional team of 12 to deliver $1.2M project under budget and 2 weeks ahead of schedule.",
      "Implemented new project tracking system that increased team productivity by 25% and improved client satisfaction ratings."
    ],
    'marketing specialist': [
      "Designed and executed social media campaign that generated 4,500 new leads within first month, exceeding target by 50%.",
      "Increased website conversion rate from 2.3% to 4.7% through targeted content strategy and design improvements."
    ],
    'sales manager': [
      "Exceeded annual sales targets by 32% through implementation of new customer relationship management processes.",
      "Trained and developed a team of 8 sales representatives, achieving 95% retention rate and 28% average performance improvement."
    ],
    'teacher': [
      "Developed new curriculum that improved standardized test scores by an average of 18% across all student groups.",
      "Implemented innovative teaching methods resulting in 94% of students demonstrating measurable improvement in core subject areas."
    ],
    'healthcare professional': [
      "Reduced patient wait times by 35% through implementation of streamlined intake procedures.",
      "Improved patient satisfaction scores from 85% to 97% through enhanced communication protocols and follow-up procedures."
    ]
  };

  const handleSearch = () => {
    const query = searchQuery.toLowerCase();
    // Find matching examples or use a default set
    let results: string[] = [];
    
    for (const [role, examples] of Object.entries(accomplishmentExamples)) {
      if (role.includes(query)) {
        results = [...results, ...examples];
      }
    }
    
    // If no matches found, provide some general examples
    if (results.length === 0) {
      results = accomplishmentExamples['software engineer']; // Default to software engineer
    }
    
    setSearchResults(results);
  };

  const handleInputChange = (index: number, value: string) => {
    const updatedAccomplishments = [...accomplishments];
    updatedAccomplishments[index] = { 
      ...updatedAccomplishments[index],
      description: value 
    };
    setAccomplishments(updatedAccomplishments);
  };

  const handleAddAccomplishment = () => {
    if (accomplishments.length < 2) {
      setAccomplishments([...accomplishments, { 
        title: '', 
        description: '', 
        id: crypto.randomUUID() 
      }]);
    }
  };

  const handleRemoveAccomplishment = (index: number) => {
    const updatedAccomplishments = [...accomplishments];
    updatedAccomplishments.splice(index, 1);
    setAccomplishments(updatedAccomplishments);
  };

  const handleAddExample = (example: string) => {
    if (accomplishments.length < 2) {
      setAccomplishments([...accomplishments, { 
        title: 'Professional Achievement', 
        description: example,
        id: crypto.randomUUID() 
      }]);
    } else {
      // Replace the first empty one or the last one
      const emptyIndex = accomplishments.findIndex(a => a.description.trim() === '');
      if (emptyIndex >= 0) {
        const updated = [...accomplishments];
        updated[emptyIndex] = { 
          ...updated[emptyIndex],
          title: 'Professional Achievement',
          description: example
        };
        setAccomplishments(updated);
      } else {
        const updated = [...accomplishments];
        updated[accomplishments.length - 1] = { 
          ...updated[accomplishments.length - 1],
          title: 'Professional Achievement',
          description: example
        };
        setAccomplishments(updated);
      }
    }
  };

  const handleSave = () => {
    // Filter out empty accomplishments
    const filteredAccomplishments = accomplishments.filter(a => a.description.trim() !== '');
    updateFormField('accomplishments', filteredAccomplishments);
    
    // Navigate back to additional sections
    navigate(`/cv/${templateId}/additional-sections`);
  };

  return (
    <>
      <Helmet>
        <title>Accomplishments - CV Chap Chap</title>
        <meta 
          name="description" 
          content="Add your key accomplishments to showcase your achievements and make your CV stand out to potential employers." 
        />
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link href={`/cv/${templateId}/additional-sections`} className="flex items-center text-indigo-600 mb-6">
          <ChevronLeft className="w-4 h-4 mr-1" />
          <span>Go Back</span>
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">Tell us about your accomplishments</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            <div>
              <h3 className="uppercase text-sm font-medium text-gray-500 mb-2">
                SEARCH BY JOB TITLE FOR PRE-WRITTEN EXAMPLES
              </h3>
              <div className="flex mb-4">
                <Input
                  type="text"
                  placeholder="Software Engineer"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-r-none"
                />
                <Button 
                  type="button"
                  variant="secondary"
                  className="rounded-l-none bg-blue-100 hover:bg-blue-200 text-blue-700"
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </div>

              {searchResults.length > 0 && (
                <div className="border rounded-md">
                  <div className="p-3 bg-gray-50 border-b">
                    <h4 className="text-sm font-medium text-gray-700">
                      Showing results for {searchQuery || 'common accomplishments'}
                    </h4>
                  </div>
                  
                  <div className="divide-y">
                    {searchResults.map((example, idx) => (
                      <div key={idx} className="p-4 hover:bg-gray-50">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 rounded-full bg-blue-500 text-white hover:bg-blue-600"
                              onClick={() => handleAddExample(example)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="ml-3 text-sm text-gray-700">{example}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="uppercase text-sm font-medium text-gray-500 mb-2">
              WRITE ABOUT YOUR ACCOMPLISHMENTS HERE
            </h3>
            
            <div className="space-y-4">
              {accomplishments.map((accomplishment, index) => (
                <div key={index} className="rounded-md border p-4">
                  <Textarea
                    value={accomplishment.text}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    placeholder="Write about your accomplishment here..."
                    className="min-h-[100px] mb-2"
                  />
                  
                  <div className="flex justify-between">
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" className="text-gray-500">
                        <span className="font-bold">B</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-500 italic">
                        <span>I</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-500 underline">
                        <span>U</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-500">
                        <span className="flex items-center">
                          •••
                        </span>
                      </Button>
                    </div>
                    
                    <div className="flex space-x-1">
                      {accomplishments.length > 1 && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleRemoveAccomplishment(index)}
                        >
                          <span className="sr-only">Remove</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="text-gray-500">
                        <Undo2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-500">
                        <RotateCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {accomplishments.length < 2 && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-dashed border-2 py-4"
                  onClick={handleAddAccomplishment}
                >
                  + Add Another Accomplishment
                </Button>
              )}
            </div>
          </div>
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

export default AccomplishmentsForm;