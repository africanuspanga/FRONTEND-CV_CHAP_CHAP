import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { ChevronLeft, XCircle } from 'lucide-react';
import { useCVForm } from '@/contexts/cv-form-context';
import LiveCVPreview from '@/components/LiveCVPreview';
import { Input } from '@/components/ui/input';
import { Reference } from '@shared/schema';

const ReferencesForm = () => {
  const [, navigate] = useLocation();
  const params = useParams<{ templateId: string }>();
  const { formData, updateFormField } = useCVForm();
  const templateId = params.templateId;

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
    navigate(`/cv/${templateId}/additional-sections`);
  };

  // Add a reference
  const handleAddReference = () => {
    if (!name || !relationship) return;

    const newReference: Reference = {
      id: Date.now().toString(),
      name,
      relationship,
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
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="absolute left-0 top-0 h-full bg-blue-500 rounded-full" 
            style={{ width: '78%' }}
          ></div>
        </div>
        <div className="text-right text-sm text-gray-500 mt-1">78%</div>
      </div>

      <div className="bg-white rounded-lg border p-8">
        <h1 className="text-2xl font-bold mb-3 text-indigo-950">References</h1>
        <p className="text-gray-600 mb-8">
          Add professional references who can vouch for your skills and experience.
        </p>

        {/* References list */}
        {references.length > 0 && (
          <div className="mb-8 space-y-4">
            {references.map(ref => (
              <div 
                key={ref.id} 
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <div className="font-medium">{ref.name}</div>
                  <div className="text-sm text-gray-500">{ref.relationship}</div>
                  <div className="text-sm text-gray-500">{ref.email} | {ref.phone}</div>
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
        <div className="border rounded-lg p-6 mb-8">
          <h2 className="font-semibold mb-4">Add Reference</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
              <Input
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                placeholder="e.g. Former Manager"
              />
              <div className="text-xs text-gray-500 mt-1">Suggested: Former Manager, Colleague, etc.</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleAddReference}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!name || !relationship}
            >
              Add Reference
            </Button>
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            className="flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            className="bg-teal-600 hover:bg-teal-700 text-white"
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