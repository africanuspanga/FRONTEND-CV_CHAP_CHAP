import React, { useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft } from 'lucide-react';
import { useCVForm } from '@/contexts/cv-form-context';
import LiveCVPreview from '@/components/LiveCVPreview';

const PersonalInfoForm = () => {
  const [, navigate] = useLocation();
  const params = useParams<{ templateId: string }>();
  const { formData, updateFormField, goToNextStep } = useCVForm();
  
  // Get the template ID from the URL
  const templateId = params.templateId;
  
  // When the component loads, ensure the template is set
  useEffect(() => {
    if (templateId && formData.templateId !== templateId) {
      updateFormField('templateId', templateId);
    }
  }, [templateId, formData.templateId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/cv/${templateId}/work`); // Go to next step (work experience)
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="absolute left-0 top-0 h-full bg-blue-500 rounded-full" style={{ width: '11%' }}></div>
        </div>
        <div className="text-right text-sm text-gray-500 mt-1">11%</div>
      </div>

      <div className="bg-white rounded-lg border p-8">
        {/* Back button */}
        <button
          onClick={() => navigate('/templates')}
          className="text-blue-600 flex items-center mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Go Back
        </button>

        <h1 className="text-2xl font-bold text-center mb-2">Create Your CV</h1>
        <h2 className="text-xl font-semibold mb-6 text-center">Personal Information</h2>
        <p className="text-gray-600 mb-8 text-center">Provide your personal and contact details for your CV.</p>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.personalInfo.firstName || ''}
                onChange={(e) => updateFormField('personalInfo', {
                  ...formData.personalInfo,
                  firstName: e.target.value
                })}
                placeholder="John"
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.personalInfo.lastName || ''}
                onChange={(e) => updateFormField('personalInfo', {
                  ...formData.personalInfo,
                  lastName: e.target.value
                })}
                placeholder="Kimaro"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.personalInfo.email || ''}
                onChange={(e) => updateFormField('personalInfo', {
                  ...formData.personalInfo,
                  email: e.target.value
                })}
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.personalInfo.phone || ''}
                onChange={(e) => updateFormField('personalInfo', {
                  ...formData.personalInfo,
                  phone: e.target.value
                })}
                placeholder="+255782345168"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <Label htmlFor="address">Location</Label>
              <Input
                id="address"
                value={formData.personalInfo.address || ''}
                onChange={(e) => updateFormField('personalInfo', {
                  ...formData.personalInfo,
                  address: e.target.value
                })}
                placeholder="Dar es Salaam, Tanzania"
              />
            </div>
            <div>
              <Label htmlFor="professionalTitle">Professional Title</Label>
              <Input
                id="professionalTitle"
                value={formData.personalInfo.professionalTitle || ''}
                onChange={(e) => updateFormField('personalInfo', {
                  ...formData.personalInfo,
                  professionalTitle: e.target.value
                })}
                placeholder="Software Engineer"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-2 rounded-md">
              Next
            </Button>
          </div>
        </form>
        
        {/* Live CV Preview */}
        <LiveCVPreview cvData={formData} templateId={templateId} />
      </div>
    </div>
  );
};

export default PersonalInfoForm;