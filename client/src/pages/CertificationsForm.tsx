import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCVForm } from '@/contexts/cv-form-context';
import { Helmet } from 'react-helmet';
import { Certification } from '@shared/schema';

const CertificationsForm = () => {
  const [, navigate] = useLocation();
  const { formData, updateFormField } = useCVForm();
  // Get templateId from formData, fallback to a default if not available
  // This helps when accessing the page directly with an invalid URL like /cv//certifications
  const templateId = formData.templateId || 'kilimanjaro';
  
  // Initialize with existing data or empty certification
  const [certifications, setCertifications] = useState<Certification[]>(
    formData.certifications && formData.certifications.length > 0 
      ? formData.certifications 
      : [{ name: '', issuer: '', date: '', url: '', id: crypto.randomUUID() }]
  );

  // State management for certifications only

  const handleInputChange = (index: number, field: keyof Certification, value: string) => {
    const updatedCertifications = [...certifications];
    updatedCertifications[index] = {
      ...updatedCertifications[index],
      [field]: value
    };
    setCertifications(updatedCertifications);
  };

  const handleAddCertification = () => {
    setCertifications([
      ...certifications,
      { name: '', issuer: '', date: '', url: '', id: crypto.randomUUID() }
    ]);
  };

  const handleRemoveCertification = (index: number) => {
    const updatedCertifications = [...certifications];
    updatedCertifications.splice(index, 1);
    setCertifications(updatedCertifications);
  };

  const handleSave = () => {
    // Filter out empty certifications
    const filteredCertifications = certifications.filter(cert => cert.name.trim() !== '');
    updateFormField('certifications', filteredCertifications);
    
    // Navigate back to appropriate page based on whether we have a templateId
    if (templateId && templateId !== 'kilimanjaro') {
      navigate(`/cv/${templateId}/additional-sections`);
    } else {
      // If we don't have a valid templateId, go to template selection
      navigate('/templates');
    }
  };

  return (
    <>
      <Helmet>
        <title>Certifications - CV Chap Chap</title>
        <meta 
          name="description" 
          content="Add your certifications and licenses to showcase your professional qualifications to potential employers." 
        />
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 py-12">
        {templateId && templateId !== 'kilimanjaro' ? (
          <Link href={`/cv/${templateId}/additional-sections`} className="flex items-center text-indigo-600 mb-6">
            <ChevronLeft className="w-4 h-4 mr-1" />
            <span>Go Back to Additional Sections</span>
          </Link>
        ) : (
          <Link href="/templates" className="flex items-center text-indigo-600 mb-6">
            <ChevronLeft className="w-4 h-4 mr-1" />
            <span>Go Back to Templates</span>
          </Link>
        )}

        <h1 className="text-3xl font-bold text-gray-900 mb-6">What certifications do you have?</h1>

        <div className="max-w-xl mx-auto mb-8">
          <h3 className="uppercase text-sm font-medium text-gray-500 mb-4 text-center">
            ADD YOUR CERTIFICATIONS HERE
          </h3>

          {certifications.map((certification, index) => (
            <div key={index} className="bg-white rounded-md border p-6 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor={`cert-name-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Certification Name
                  </label>
                  <Input
                    id={`cert-name-${index}`}
                    value={certification.name}
                    onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                    placeholder="AWS Certified Solutions Architect"
                  />
                </div>
                <div>
                  <label htmlFor={`cert-issuer-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Issuing Organization
                  </label>
                  <Input
                    id={`cert-issuer-${index}`}
                    value={certification.issuer}
                    onChange={(e) => handleInputChange(index, 'issuer', e.target.value)}
                    placeholder="Amazon Web Services"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor={`cert-date-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Date Received
                </label>
                <Input
                  id={`cert-date-${index}`}
                  type="text"
                  value={certification.date}
                  onChange={(e) => handleInputChange(index, 'date', e.target.value)}
                  placeholder="June 2023"
                  className="max-w-[200px]"
                />
              </div>
              
              <div>
                <label htmlFor={`cert-url-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Certification URL (Optional)
                </label>
                <Input
                  id={`cert-url-${index}`}
                  type="url"
                  value={certification.url || ''}
                  onChange={(e) => handleInputChange(index, 'url', e.target.value)}
                  placeholder="https://www.credential.net/..."
                />
              </div>
              
              {certifications.length > 1 && (
                <div className="mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => handleRemoveCertification(index)}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            className="w-full border-dashed border-2 py-6"
            onClick={handleAddCertification}
          >
            + Add Another Certification
          </Button>
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

export default CertificationsForm;