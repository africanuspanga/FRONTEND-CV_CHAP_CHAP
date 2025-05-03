import React, { useState } from 'react';
import { useCVForm } from '@/contexts/cv-form-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  CheckCircle, 
  Download, 
  Edit, 
  ExternalLink, 
  FileText, 
  Share2, 
  User, 
  Briefcase, 
  GraduationCap, 
  Wrench, 
  FileText as SummaryIcon,
  Globe, 
  Phone
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getTemplateWithMetadata } from '@/lib/templates-registry';
import { Badge } from '@/components/ui/badge';
import { generateAndDownloadPDF } from '@/lib/screenshot-pdf-generator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClientSideTemplateRenderer from '@/components/ClientSideTemplateRenderer';

// Section completion helper
type SectionStatus = 'complete' | 'partial' | 'empty';

const PreviewStep: React.FC = () => {
  const { formData } = useCVForm();
  const { toast } = useToast();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('preview');
  
  // Get template info
  const template = getTemplateWithMetadata(formData.templateId);
  
  // Handle PDF download
  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPDF(true);
      await generateAndDownloadPDF(formData.templateId, formData);
      toast({
        title: "PDF Generated Successfully",
        description: "Your CV has been downloaded as a PDF file."
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "PDF Generation Failed",
        description: "There was an error generating your PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Check section completion status
  const getSectionStatus = (section: string): SectionStatus => {
    switch(section) {
      case 'personalInfo':
        if (!formData.personalInfo || !formData.personalInfo.firstName) return 'empty';
        if (formData.personalInfo.firstName && formData.personalInfo.lastName && 
            formData.personalInfo.email && formData.personalInfo.phone) return 'complete';
        return 'partial';
        
      case 'workExperience':
        if (!formData.workExperiences || formData.workExperiences.length === 0) return 'empty';
        const allWorkComplete = formData.workExperiences.every((exp: any) => 
          exp.jobTitle && exp.company && exp.startDate);
        return allWorkComplete ? 'complete' : 'partial';
        
      case 'education':
        if (!formData.education || formData.education.length === 0) return 'empty';
        const allEducationComplete = formData.education.every(edu => 
          edu.institution && edu.degree && edu.startDate);
        return allEducationComplete ? 'complete' : 'partial';
        
      case 'skills':
        if (!formData.skills || formData.skills.length === 0) return 'empty';
        return formData.skills.length >= 3 ? 'complete' : 'partial';
        
      case 'summary':
        if (!formData.personalInfo?.summary) return 'empty';
        return formData.personalInfo.summary.length >= 50 ? 'complete' : 'partial';
        
      case 'languages':
        if (!formData.languages || formData.languages.length === 0) return 'empty';
        return 'complete';
        
      case 'references':
        if (!formData.references || formData.references.length === 0) return 'empty';
        const allReferencesComplete = formData.references.every(ref => 
          ref.name && (ref.email || ref.phone));
        return allReferencesComplete ? 'complete' : 'partial';
        
      default:
        return 'empty';
    }
  };

  // Get status icon
  const getStatusIcon = (status: SectionStatus) => {
    switch(status) {
      case 'complete': 
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'partial': 
        return <div className="h-5 w-5 rounded-full bg-amber-400" />;
      case 'empty': 
        return <div className="h-5 w-5 rounded-full bg-gray-300" />;
    }
  };

  // Get section icon
  const getSectionIcon = (section: string) => {
    switch(section) {
      case 'personalInfo': return <User className="h-5 w-5 text-primary" />;
      case 'workExperience': return <Briefcase className="h-5 w-5 text-primary" />;
      case 'education': return <GraduationCap className="h-5 w-5 text-primary" />;
      case 'skills': return <Wrench className="h-5 w-5 text-primary" />;
      case 'summary': return <SummaryIcon className="h-5 w-5 text-primary" />;
      case 'languages': return <Globe className="h-5 w-5 text-primary" />;
      case 'references': return <Phone className="h-5 w-5 text-primary" />;
      default: return <FileText className="h-5 w-5 text-primary" />;
    }
  };

  // Calculate overall completion percentage
  const calculateCompletion = (): number => {
    const sections = ['personalInfo', 'workExperience', 'education', 'skills', 'summary'];
    const statuses = sections.map(s => getSectionStatus(s));
    
    const complete = statuses.filter(s => s === 'complete').length;
    const partial = statuses.filter(s => s === 'partial').length;
    
    // Count complete as 1, partial as 0.5
    return Math.round(((complete + (partial * 0.5)) / sections.length) * 100);
  };

  // Get template name
  const templateName = template?.name || 'Unknown Template';

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <Tabs defaultValue="preview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="completion">Completion</TabsTrigger>
        </TabsList>
        
        {/* Preview Tab */}
        <TabsContent value="preview" className="pt-4">
          <div className="space-y-6">
            {/* Template Info */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-lg">Template: {templateName}</h3>
                <p className="text-sm text-muted-foreground">
                  Your CV is ready for export or further editing
                </p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href="/templates" target="_blank" rel="noopener noreferrer">
                  Change Template
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
            
            {/* Download Button */}
            <Button 
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="w-full py-6 text-lg"
            >
              <Download className="mr-2 h-5 w-5" />
              {isGeneratingPDF ? "Generating PDF..." : "Download as PDF"}
            </Button>
            
            {/* CV Preview Card (only shown on mobile in this tab) */}
            <div className="block md:hidden">
              <div className="bg-gray-50 border rounded-md p-4">
                <h3 className="font-medium mb-3">Preview</h3>
                <div className="bg-white border rounded overflow-hidden" style={{ height: '300px' }}>
                  <ClientSideTemplateRenderer
                    templateId={formData.templateId}
                    cvData={formData}
                    height={300}
                  />
                </div>
                <p className="text-xs text-center text-muted-foreground mt-3">
                  Scroll to see full preview. Download for best quality.
                </p>
              </div>
            </div>
            
            {/* Sharing Options (placeholder) */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <Share2 className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Share Options</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" disabled>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Share Link
                    <Badge variant="outline" className="ml-2 bg-gray-100">
                      Coming Soon
                    </Badge>
                  </Button>
                  <Button variant="outline" disabled>
                    <FileText className="mr-2 h-4 w-4" />
                    Create Web Profile
                    <Badge variant="outline" className="ml-2 bg-gray-100">
                      Coming Soon
                    </Badge>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Completion Tab */}
        <TabsContent value="completion" className="pt-4">
          <div className="space-y-6">
            {/* Overall Completion */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">CV Completion</h3>
                <span className="text-lg font-bold text-primary">{calculateCompletion()}%</span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ width: `${calculateCompletion()}%` }} 
                />
              </div>
              
              <p className="text-sm text-muted-foreground mt-3">
                {calculateCompletion() === 100 
                  ? "Your CV is complete! You can now download it as a PDF."
                  : "Complete the remaining sections to improve your CV."}
              </p>
            </div>
            
            {/* Section Status */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-4">Section Status</h3>
                <div className="space-y-4">
                  {[
                    { id: 'personalInfo', name: 'Personal Information', step: 1 },
                    { id: 'workExperience', name: 'Work Experience', step: 2 },
                    { id: 'education', name: 'Education', step: 3 },
                    { id: 'skills', name: 'Skills', step: 4 },
                    { id: 'summary', name: 'Professional Summary', step: 5 },
                    { id: 'languages', name: 'Languages (Optional)', step: 6 },
                    { id: 'references', name: 'References (Optional)', step: 7 },
                  ].map(section => {
                    const status = getSectionStatus(section.id);
                    return (
                      <div 
                        key={section.id}
                        className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center gap-3">
                          {getSectionIcon(section.id)}
                          <div>
                            <div className="font-medium">{section.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {status === 'complete' && 'Complete'}
                              {status === 'partial' && 'Partially complete'}
                              {status === 'empty' && (
                                section.id === 'languages' || section.id === 'references' 
                                  ? 'Optional' 
                                  : 'Not started'
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(status)}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.location.href = `/create/${section.step}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            
            {/* Download Button */}
            <Button 
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF || calculateCompletion() < 80}
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              {isGeneratingPDF 
                ? "Generating PDF..." 
                : calculateCompletion() < 80 
                  ? "Complete more sections to download" 
                  : "Download as PDF"
              }
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PreviewStep;