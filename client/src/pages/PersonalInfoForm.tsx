import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ChevronLeft, User, Mail, Phone, Briefcase, MapPin } from 'lucide-react';
import { useCVForm } from '@/contexts/cv-form-context';
import LiveCVPreview from '@/components/LiveCVPreview';
import MobilePreviewNote from '@/components/MobilePreviewNote';
import LocationInput from '@/components/LocationInput';
import JobTitleInput from '@/components/JobTitleInput';
import IconInput from '@/components/IconInput';
import '../styles/mobile-form.css';

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

  const [isMobile, setIsMobile] = useState(false);
  
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Enhanced Progress Bar */}
      <div className="mb-6">
        <div className="enhanced-progress-bar">
          <div className="progress-fill" style={{ width: '11%' }}></div>
        </div>
        <div className="progress-percentage">11%</div>
      </div>

      <div className={`bg-white rounded-lg border p-6 ${isMobile ? 'mobile-form-container' : ''}`}>
        {/* Back button */}
        <button
          onClick={() => navigate('/templates')}
          className="text-primary flex items-center mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Go Back
        </button>

        <h1 className="text-2xl font-bold text-center mb-2">Create Your CV</h1>
        <h2 className="text-xl font-semibold mb-4 text-center">Personal Information</h2>
        <p className="text-gray-600 mb-6 text-center form-description">Provide your personal and contact details for your CV.</p>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="form-field-group">
              <Label htmlFor="firstName">First Name</Label>
              <IconInput
                icon={User}
                id="firstName"
                value={formData.personalInfo.firstName || ''}
                onChange={(value) => updateFormField('personalInfo', {
                  ...formData.personalInfo,
                  firstName: value
                })}
                placeholder="Noela"
                required
                className="w-full"
              />
            </div>
            <div className="form-field-group">
              <Label htmlFor="lastName">Last Name</Label>
              <IconInput
                icon={User}
                id="lastName"
                value={formData.personalInfo.lastName || ''}
                onChange={(value) => updateFormField('personalInfo', {
                  ...formData.personalInfo,
                  lastName: value
                })}
                placeholder="Bwemero"
                required
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4">
            <div className="form-field-group">
              <Label htmlFor="email">Email</Label>
              <IconInput
                icon={Mail}
                id="email"
                type="email"
                inputMode="email"
                value={formData.personalInfo.email || ''}
                onChange={(value) => updateFormField('personalInfo', {
                  ...formData.personalInfo,
                  email: value
                })}
                placeholder="you@example.com"
                required
                className="w-full"
              />
            </div>
            <div className="form-field-group">
              <Label htmlFor="phone">Phone</Label>
              <IconInput
                icon={Phone}
                id="phone"
                type="tel"
                inputMode="tel"
                value={formData.personalInfo.phone || ''}
                onChange={(value) => updateFormField('personalInfo', {
                  ...formData.personalInfo,
                  phone: value
                })}
                placeholder="+255782345168"
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4">
            <div className="form-field-group">
              <Label htmlFor="address">Location</Label>
              <LocationInput
                value={formData.personalInfo.address || ''}
                onChange={(value) => updateFormField('personalInfo', {
                  ...formData.personalInfo,
                  address: value
                })}
                placeholder="Dar es Salaam, Tanzania"
                className="w-full"
              />
            </div>
            <div className="form-field-group">
              <Label htmlFor="professionalTitle">Professional Title</Label>
              <JobTitleInput
                value={formData.personalInfo.professionalTitle || ''}
                onChange={(value) => updateFormField('personalInfo', {
                  ...formData.personalInfo,
                  professionalTitle: value
                })}
                placeholder="Start typing your job title..."
                className="w-full"
              />
            </div>
          </div>

          {!isMobile && (
            <div className="flex justify-end mt-8">
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-white px-10 py-2 rounded-md">
                Next
              </Button>
            </div>
          )}
        </form>
        
        {/* Live CV Preview for desktop / Mobile note for mobile */}
        <LiveCVPreview cvData={formData} templateId={templateId} />
        <MobilePreviewNote />
      </div>
      
      {/* Sticky Next button for mobile */}
      {isMobile && (
        <div className="sticky-footer">
          <Button 
            onClick={handleSubmit}
            className="bg-primary hover:bg-primary/90 text-white w-full py-3 text-base font-medium rounded-xl"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default PersonalInfoForm;