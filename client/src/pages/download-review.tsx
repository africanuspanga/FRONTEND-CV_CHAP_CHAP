import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, Star, MessageSquare, User, Phone } from 'lucide-react';
import { useCVForm } from '@/contexts/cv-form-context';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

const DownloadReviewPage: React.FC = () => {
  const [, navigate] = useLocation();
  const { formData } = useCVForm();
  const { toast } = useToast();
  
  // Form state
  const [reviewData, setReviewData] = useState({
    name: '',
    phone: '',
    review: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setReviewData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!reviewData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!reviewData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^(\+255|0)?[67]\d{8}$/.test(reviewData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid Tanzanian phone number';
    }
    
    if (!reviewData.review.trim()) {
      newErrors.review = 'Review is required';
    } else if (reviewData.review.trim().length < 10) {
      newErrors.review = 'Review must be at least 10 characters long';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission and CV download
  const handleSubmitAndDownload = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      // Submit feedback data
      const feedbackPayload = {
        name: reviewData.name.trim(),
        phone: reviewData.phone.trim(),
        review: reviewData.review.trim(),
        templateId: formData.templateId,
        cvName: `${formData.personalInfo?.firstName} ${formData.personalInfo?.lastName}`.trim(),
        submissionDate: new Date().toISOString()
      };

      const feedbackResponse = await fetch('/api/submit-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackPayload)
      });

      if (!feedbackResponse.ok) {
        throw new Error('Failed to submit feedback');
      }

      // Now generate and download the CV
      const templateId = sessionStorage.getItem('cv_template_id') || formData.templateId;
      
      if (!templateId) {
        throw new Error('Template ID not found. Please go back and try again.');
      }

      // Prepare CV data with cleaning logic
      let professionalTitle = formData.personalInfo?.professionalTitle?.trim() || '';
      
      if (!professionalTitle) {
        professionalTitle = formData.personalInfo?.jobTitle?.trim() || '';
        
        if (!professionalTitle && formData.workExperiences && formData.workExperiences.length > 0) {
          professionalTitle = formData.workExperiences[0].jobTitle?.trim() || '';
        }
        
        if (!professionalTitle && formData.workExperiences && formData.workExperiences.length > 0) {
          const company = formData.workExperiences[0].company?.trim();
          if (company) {
            professionalTitle = `Professional at ${company}`;
          }
        }
        
        if (!professionalTitle) {
          professionalTitle = "Professional";
        }
      }
      
      const cleanedPersonalInfo = {
        ...formData.personalInfo,
        firstName: formData.personalInfo?.firstName?.trim() || '',
        lastName: formData.personalInfo?.lastName?.trim() || '',
        professionalTitle: professionalTitle,
        jobTitle: professionalTitle,
        location: formData.personalInfo?.location?.trim() || formData.personalInfo?.address?.trim() || ''
      };

      const cleanedWorkExperiences = (formData.workExperiences || []).map(exp => ({
        ...exp,
        jobTitle: exp.jobTitle?.trim() || '',
        company: exp.company?.trim() || '',
        location: exp.location?.trim() || ''
      }));

      const cleanedEducation = (formData.education || []).map(edu => ({
        ...edu,
        field: edu.field?.trim() || '',
        location: edu.location?.trim() || '',
        institution: edu.institution?.trim() || '',
        degree: edu.degree?.trim() || ''
      }));

      const cvData = {
        template_id: templateId,
        cv_data: {
          name: `${cleanedPersonalInfo.firstName} ${cleanedPersonalInfo.lastName}`.trim(),
          email: cleanedPersonalInfo.email || '',
          personalInfo: cleanedPersonalInfo,
          workExperiences: cleanedWorkExperiences,
          education: cleanedEducation,
          skills: formData.skills || [],
          languages: formData.languages || [],
          ...(formData.certifications?.length ? { certifications: formData.certifications } : {}),
          ...(formData.projects?.length ? { projects: formData.projects } : {}),
          ...(formData.references?.length ? { references: formData.references } : {})
        }
      };

      // Generate and download PDF
      const response = await fetch('/api/generate-and-download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/pdf',
          'User-Agent': 'CV-Chap-Chap-App'
        },
        body: JSON.stringify(cvData)
      });

      if (!response.ok) {
        let errorMessage = '';
        try {
          const errorJson = await response.json();
          errorMessage = errorJson.error || response.statusText;
        } catch {
          errorMessage = await response.text();
        }
        throw new Error(`Server returned ${response.status}: ${errorMessage}`);
      }

      // Download the PDF
      const pdfBlob = await response.blob();
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      
      const firstName = formData.personalInfo?.firstName?.trim() || 'CV';
      const lastName = formData.personalInfo?.lastName?.trim() || 'ChapChap';
      link.download = `${firstName}_${lastName}-CV.pdf`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Thank you for your feedback!",
        description: "Your CV has been downloaded successfully.",
      });

      // Navigate back to templates after successful download
      setTimeout(() => {
        navigate('/templates');
      }, 2000);

    } catch (error) {
      console.error('Submission/download error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "There was a problem processing your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    navigate('/cv/' + formData.templateId + '/final-preview');
  };

  return (
    <div className="container mx-auto py-3 sm:py-5 px-2 sm:px-4 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleGoBack}
          className="rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Download Your CV</h1>
          <p className="text-sm text-gray-600 mt-1">Help us improve by sharing your experience</p>
        </div>
      </div>

      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Download className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-xl font-bold text-gray-900">
            Almost Ready!
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Share your feedback to help us improve CV Chap Chap and download your professional CV
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base font-medium flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Your Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={reviewData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`h-12 text-base ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-base font-medium flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+255 700 000 000"
              value={reviewData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`h-12 text-base ${errors.phone ? 'border-red-500' : ''}`}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone}</p>
            )}
          </div>

          {/* Review Field */}
          <div className="space-y-2">
            <Label htmlFor="review" className="text-base font-medium flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              Your Experience
            </Label>
            <Textarea
              id="review"
              placeholder="Tell us about your experience using CV Chap Chap. What did you like? What can we improve? (minimum 10 characters)"
              value={reviewData.review}
              onChange={(e) => handleInputChange('review', e.target.value)}
              className={`min-h-[120px] text-base resize-none ${errors.review ? 'border-red-500' : ''}`}
            />
            <div className="flex justify-between items-center">
              {errors.review && (
                <p className="text-red-500 text-sm">{errors.review}</p>
              )}
              <p className="text-sm text-gray-500 ml-auto">
                {reviewData.review.length}/10 characters minimum
              </p>
            </div>
          </div>

          {/* Rating Stars (Visual Only) */}
          <div className="text-center py-4">
            <p className="text-sm text-gray-600 mb-3">How would you rate your experience?</p>
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="h-8 w-8 text-yellow-400 fill-yellow-400 cursor-pointer hover:scale-110 transition-transform"
                />
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            onClick={handleSubmitAndDownload}
            disabled={isSubmitting}
            className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? (
              <>
                <div className="h-5 w-5 border-2 border-white/50 border-t-white rounded-full animate-spin mr-3"></div>
                Processing...
              </>
            ) : (
              <>
                <Download className="h-5 w-5 mr-2" />
                Submit Feedback & Download CV
              </>
            )}
          </Button>

          <Alert className="bg-blue-50 border-blue-200">
            <MessageSquare className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Your feedback helps us improve CV Chap Chap for all users. Thank you for testing our platform!
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default DownloadReviewPage;