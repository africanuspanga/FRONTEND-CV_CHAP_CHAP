# CV Chap Chap Frontend-Only Implementation Guide

This document explains how to use the new frontend-only implementation of CV Chap Chap, which eliminates backend dependencies for improved performance, reduced costs, and better mobile user experience.

## Overview

The CV creation flow now operates entirely within the frontend with no backend calls required for:

- Template selection and rendering
- Form data management
- AI content enhancements
- PDF generation

This architecture is optimized for the target audience in Tanzania and East Africa, where 90% of users access the platform via mobile devices, often with unreliable internet connections.

## Key Components

### Template System

```tsx
// Import templates directly from the frontend registry
import { getTemplateByID, getAllTemplates } from '@/lib';
import { ClientSideTemplateRenderer } from '@/components/ClientSideTemplateRenderer';

// Later in your component:
<ClientSideTemplateRenderer templateId="jijengeClassic" cvData={formData} />
```

### Form Data Management

```tsx
// Use the CV form context to manage all form data
import { useCVForm } from '@/contexts/cv-form-context';

// In your component:
const { formData, updateFormField } = useCVForm();

// Update form data directly
updateFormField('personalInfo', {
  ...formData.personalInfo,
  firstName: 'John',
  lastName: 'Doe'
});
```

### AI Enhancements (Client-side)

```tsx
// Import the AI components
import { 
  AIKeyInput, 
  WorkExperienceAIRecommendations,
  SkillsAIRecommendations,
  SummaryAIEnhancement 
} from '@/lib/ai-enhancers';

// Allow users to set their OpenAI API key
<AIKeyInput onApiKeySet={(hasKey) => console.log('API key set:', hasKey)} />

// Use the recommendations components
<WorkExperienceAIRecommendations
  jobTitle="Software Engineer"
  company="Tech Co"
  onAddRecommendations={(recommendations) => {
    // Use the recommendations
  }}
  onSkip={() => {
    // Continue without AI recommendations
  }}
/>
```

### PDF Export (Client-side)

```tsx
// Import the PDF export button
import PDFExportButton from '@/components/PDFExportButton';

// Use the button in your UI
<PDFExportButton>Download Your CV</PDFExportButton>

// Or use the hook directly
import { useCVExport } from '@/hooks/use-cv-export';

const { exportToPDF, isExporting } = useCVExport();

// Later in your code:
const handleExport = () => {
  exportToPDF(cvData, templateId);
};
```

### Mobile Action Panel

```tsx
// Import the mobile action panel
import MobileActionPanel from '@/components/MobileActionPanel';

// Use it in your preview screen
<MobileActionPanel 
  onEdit={() => {
    // Navigate back to edit form
  }} 
/>
```

## Data Flow

1. Templates are loaded directly from the frontend registry
2. Form data is stored in localStorage as the user progresses
3. AI enhancements are performed directly in the browser using the user's OpenAI API key
4. PDF generation uses html2pdf.js to render templates to PDF entirely client-side

## Mobile-First Design

The CV Chap Chap platform is designed with a mobile-first approach, prioritizing performance and usability on mobile devices. The action panel at the bottom of the screen on mobile provides easy access to the most important actions (Edit and Download).

## Sample Integration

```tsx
// Example implementation in the final preview page
import { useCVForm } from '@/contexts/cv-form-context';
import ClientSideTemplateRenderer from '@/components/ClientSideTemplateRenderer';
import PDFExportButton from '@/components/PDFExportButton';
import MobileActionPanel from '@/components/MobileActionPanel';

const FinalPreview = () => {
  const { formData, setCurrentStep } = useCVForm();
  
  const handleEdit = () => {
    setCurrentStep(1); // Go back to personal info step
  };
  
  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Preview Your CV</h1>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/3">
          <ClientSideTemplateRenderer 
            templateId={formData.templateId} 
            cvData={formData} 
            height={800}
          />
        </div>
        
        <div className="lg:w-1/3 flex flex-col gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Ready to download?</h2>
            <p className="mb-4 text-gray-600">
              Your CV is ready to be downloaded as a PDF. You can also go back and make changes if needed.
            </p>
            <div className="flex flex-col gap-3">
              <PDFExportButton className="w-full">Download CV as PDF</PDFExportButton>
              <button 
                className="w-full py-2 px-4 border rounded-md"
                onClick={handleEdit}
              >
                Edit Content
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile action panel (only visible on small screens) */}
      <MobileActionPanel onEdit={handleEdit} />
    </div>
  );
};

export default FinalPreview;
```

## Best Practices

1. Always provide fallback options when AI features are unavailable
2. Store form progress in localStorage to prevent data loss
3. Prioritize performance on low-end mobile devices
4. Implement responsive design with mobile-first approach
5. Keep the UI simple and focused on the most important actions
