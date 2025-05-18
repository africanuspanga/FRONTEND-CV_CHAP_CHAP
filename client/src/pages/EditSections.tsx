import React from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, UserCircle, Briefcase, GraduationCap, 
  LibraryBig, Globe, FileText, Users, PlusCircle } from 'lucide-react';
import { navigateWithScrollReset } from '@/lib/navigation-utils';
import { useCVForm } from '@/contexts/cv-form-context';

const EditSections = () => {
  const [, navigate] = useLocation();
  const { formData } = useCVForm();
  const templateId = formData.templateId || 'kilimanjaro';

  // Navigation functions
  const goToFinalPreview = () => navigateWithScrollReset(navigate, `/cv/${templateId}/final-preview`);
  const goToPersonalInfo = () => navigateWithScrollReset(navigate, `/cv/${templateId}/personal`);
  const goToWorkExperience = () => navigateWithScrollReset(navigate, `/cv/${templateId}/work-experience`);
  const goToEducation = () => navigateWithScrollReset(navigate, `/cv/${templateId}/education`);
  const goToSkills = () => navigateWithScrollReset(navigate, `/cv/${templateId}/skills`);
  const goToLanguages = () => navigateWithScrollReset(navigate, `/cv/${templateId}/languages`);
  const goToSummary = () => navigateWithScrollReset(navigate, `/cv/${templateId}/summary`);
  const goToReferences = () => navigateWithScrollReset(navigate, `/cv/${templateId}/references`);
  const goToAdditional = () => navigateWithScrollReset(navigate, `/cv/${templateId}/additional-sections`);

  // Counts to show status
  const workExperienceCount = (formData.workExperiences || []).length;
  const educationCount = (formData.education || []).length;
  const skillsCount = (formData.skills || []).length;
  const languagesCount = (formData.languages || []).length;
  const referencesCount = (formData.references || []).length;
  
  // Check if personal info is filled
  const hasPersonalInfo = formData.personalInfo && 
    formData.personalInfo.firstName && 
    formData.personalInfo.lastName;

  // Check if summary is filled
  const hasSummary = formData.personalInfo && 
    formData.personalInfo.summary && 
    typeof formData.personalInfo.summary === 'string' &&
    formData.personalInfo.summary.length > 0;

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Edit CV Sections</h1>
        <p className="text-muted-foreground">
          Select a section to edit. Your changes will be automatically saved.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Personal Details */}
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={goToPersonalInfo}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <UserCircle className="h-5 w-5 mr-2 text-primary" />
                Personal Details
              </CardTitle>
              {hasPersonalInfo && <div className="rounded-full bg-green-100 p-1"><ChevronRight className="h-4 w-4 text-green-600" /></div>}
            </div>
            <CardDescription>
              Your name, contact information, and location
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {hasPersonalInfo ? (
                <span className="text-sm text-green-600">
                  {`${formData.personalInfo.firstName} ${formData.personalInfo.lastName}`} • 
                  {formData.personalInfo.email && ` ${formData.personalInfo.email}`} • 
                  {formData.personalInfo.phone && ` ${formData.personalInfo.phone}`}
                </span>
              ) : (
                <span className="text-amber-600">Incomplete - add your personal information</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Work Experience */}
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={goToWorkExperience}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-primary" />
                Work Experience
              </CardTitle>
              {workExperienceCount > 0 && <div className="rounded-full bg-green-100 p-1"><ChevronRight className="h-4 w-4 text-green-600" /></div>}
            </div>
            <CardDescription>
              Your job history and professional achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {workExperienceCount > 0 ? (
                <span className="text-sm text-green-600">
                  {workExperienceCount} work experience {workExperienceCount === 1 ? 'entry' : 'entries'} added
                </span>
              ) : (
                <span className="text-amber-600">No work experience added yet</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Education */}
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={goToEducation}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <GraduationCap className="h-5 w-5 mr-2 text-primary" />
                Education
              </CardTitle>
              {educationCount > 0 && <div className="rounded-full bg-green-100 p-1"><ChevronRight className="h-4 w-4 text-green-600" /></div>}
            </div>
            <CardDescription>
              Your educational background and qualifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {educationCount > 0 ? (
                <span className="text-sm text-green-600">
                  {educationCount} education {educationCount === 1 ? 'entry' : 'entries'} added
                </span>
              ) : (
                <span className="text-amber-600">No education entries added yet</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={goToSkills}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <LibraryBig className="h-5 w-5 mr-2 text-primary" />
                Skills
              </CardTitle>
              {skillsCount > 0 && <div className="rounded-full bg-green-100 p-1"><ChevronRight className="h-4 w-4 text-green-600" /></div>}
            </div>
            <CardDescription>
              Technical and professional skills
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {skillsCount > 0 ? (
                <span className="text-sm text-green-600">
                  {skillsCount} skill{skillsCount === 1 ? '' : 's'} added
                </span>
              ) : (
                <span className="text-amber-600">No skills added yet</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Languages */}
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={goToLanguages}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2 text-primary" />
                Languages
              </CardTitle>
              {languagesCount > 0 && <div className="rounded-full bg-green-100 p-1"><ChevronRight className="h-4 w-4 text-green-600" /></div>}
            </div>
            <CardDescription>
              Languages you speak and proficiency levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {languagesCount > 0 ? (
                <span className="text-sm text-green-600">
                  {languagesCount} language{languagesCount === 1 ? '' : 's'} added
                </span>
              ) : (
                <span className="text-amber-600">No languages added yet</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Professional Summary */}
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={goToSummary}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                Professional Summary
              </CardTitle>
              {hasSummary && <div className="rounded-full bg-green-100 p-1"><ChevronRight className="h-4 w-4 text-green-600" /></div>}
            </div>
            <CardDescription>
              Overview of your career and key qualifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {hasSummary ? (
                <span className="text-sm text-green-600">
                  Summary added ({formData.personalInfo?.summary && typeof formData.personalInfo.summary === 'string' && formData.personalInfo.summary.length < 50 
                    ? formData.personalInfo.summary 
                    : formData.personalInfo?.summary && typeof formData.personalInfo.summary === 'string' 
                      ? formData.personalInfo.summary.substring(0, 50) + '...'
                      : 'Added'})
                </span>
              ) : (
                <span className="text-amber-600">No professional summary added yet</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* References */}
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={goToReferences}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary" />
                References
              </CardTitle>
              {referencesCount > 0 && <div className="rounded-full bg-green-100 p-1"><ChevronRight className="h-4 w-4 text-green-600" /></div>}
            </div>
            <CardDescription>
              Professional references who can vouch for you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {referencesCount > 0 ? (
                <span className="text-sm text-green-600">
                  {referencesCount} reference{referencesCount === 1 ? '' : 's'} added
                </span>
              ) : (
                <span className="text-amber-600">No references added yet</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Additional Sections */}
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={goToAdditional}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <PlusCircle className="h-5 w-5 mr-2 text-primary" />
                Additional Sections
              </CardTitle>
            </div>
            <CardDescription>
              Certifications, projects, hobbies, and more
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Add more sections to highlight your strengths
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex justify-between">
        <Button 
          variant="outline" 
          onClick={goToFinalPreview}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Preview
        </Button>
      </div>
    </div>
  );
};

export default EditSections;