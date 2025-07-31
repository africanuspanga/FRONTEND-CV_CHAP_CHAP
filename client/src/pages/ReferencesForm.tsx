import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { ChevronLeft, XCircle } from 'lucide-react';
import { useCVForm } from '@/contexts/cv-form-context';
import LiveCVPreview from '@/components/LiveCVPreview';
import { Input } from '@/components/ui/input';
import { Reference } from '@shared/schema';
import { useMediaQuery } from '@/hooks/use-media-query';
import '../styles/mobile-form.css';
import '../styles/android-optimizations.css';

const ReferencesForm = () => {
  const [, navigate] = useLocation();
  const params = useParams<{ templateId: string }>();
  const { formData, updateFormField } = useCVForm();
  const templateId = params.templateId;
  const isMobile = useMediaQuery('(max-width: 768px)');

  // State for reference information
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [references, setReferences] = useState<Reference[]>(
    formData.references?.length ? formData.references as Reference[] : []
  );

  // Update formData when references change
  useEffect(() => {
    if (JSON.stringify(formData.references) !== JSON.stringify(references)) {
      updateFormField('references', references);
    }
  }, [references, formData.references, updateFormField]);

  // Navigate to previous step
  const handlePrevious = () => {
    navigate(`/cv/${templateId}/summary-editor`);
  };

  // Navigate to next step
  const handleNext = () => {
    // For mobile users, skip the final-preview page and go directly to additional sections
    navigate(`/cv/${templateId}/additional-sections`);
  };

  // Add a reference
  const handleAddReference = () => {
    if (!name) return;

    const newReference: Reference = {
      id: Date.now().toString(),
      name,
      position: relationship, // We'll use position field to store relationship
      company: '', // Setting an empty string as we're not using company
      email,
      phone
    };

    setReferences([...references, newReference]);
    
    // Reset form
    setName('');
    setRelationship('');
    setEmail('');
    setPhone('');
  };

  // Remove a reference
  const handleRemoveReference = (id: string) => {
    setReferences(references.filter(ref => ref.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10">
      {/* Progress Bar */}
      <div className="mb-6 md:mb-8">
        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="absolute left-0 top-0 h-full bg-blue-500 rounded-full" 
            style={{ width: '78%' }}
          ></div>
        </div>
        <div className="text-right text-sm text-gray-500 mt-1">78%</div>
      </div>

      <div className={`bg-white rounded-lg border ${isMobile ? 'p-5' : 'p-8'}`}>
        <h1 className="text-2xl font-bold mb-2 md:mb-3 text-indigo-950">References</h1>
        <p className={`text-gray-600 ${isMobile ? 'mb-6' : 'mb-8'} text-sm md:text-base`}>
          Add professional references who can vouch for your skills and experience.
        </p>

        {/* References list */}
        {references.length > 0 && (
          <div className={`${isMobile ? 'mb-6' : 'mb-8'} space-y-3 md:space-y-4`}>
            {references.map(ref => (
              <div 
                key={ref.id} 
                className="border rounded-lg p-3 md:p-4 flex justify-between items-center bg-blue-50/50"
              >
                <div>
                  <div className="font-medium text-blue-800">{ref.name}</div>
                  <div className="text-xs md:text-sm text-gray-600">{ref.position}</div>
                  <div className="text-xs md:text-sm text-gray-600">{ref.email}{ref.phone ? ` | ${ref.phone}` : ''}</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveReference(ref.id || '')}
                  className="text-gray-400 hover:text-red-500"
                >
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Add reference form */}
        <div className={`border rounded-lg ${isMobile ? 'p-4' : 'p-6'} ${isMobile ? 'mb-6' : 'mb-8'} bg-white shadow-sm`}>
          <h2 className={`font-semibold ${isMobile ? 'mb-3' : 'mb-4'} text-blue-800`}>Add Reference</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4">
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="h-9 md:h-10 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Relationship</label>
              <Input
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                placeholder="e.g. Manager, Colleague"
                className="h-9 md:h-10 text-sm"
              />
              <div className="text-xs text-gray-500 mt-1">How you know this person</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4">
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="h-9 md:h-10 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Phone</label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+255 7XX XXX XXX"
                className="h-9 md:h-10 text-sm"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleAddReference}
              className="bg-blue-600 hover:bg-blue-700 text-white h-9 md:h-10 text-sm"
              disabled={!name}
            >
              Add Reference
            </Button>
          </div>
        </div>

        <div className={`flex justify-between ${isMobile ? 'mt-6' : 'mt-8'} ${isMobile ? 'sticky bottom-4' : ''}`}>
          <Button
            variant="outline"
            onClick={handlePrevious}
            className="flex items-center h-10 text-sm shadow-sm"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700 text-white h-10 text-sm font-medium shadow-sm"
          >
            Next
          </Button>
        </div>

        {/* Live CV Preview */}
        <LiveCVPreview cvData={formData} templateId={templateId} />
      </div>
    </div>
  );
};

export default ReferencesForm;