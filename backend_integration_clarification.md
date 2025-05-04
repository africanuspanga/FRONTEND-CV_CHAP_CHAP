# Backend Integration Clarification

## Current Implementation vs. Backend Expectations

### Current Frontend Implementation

- **Template Storage**: HTML templates are stored in `/templates/{templateId}.html`
- **Registration Process**: We use a script (`server/scripts/register-templates.ts`) that:
  - Reads template files from the `/templates` directory
  - Registers them via a POST request to `/api/templates` as multipart/form-data
  - Successfully registers all 15 templates (confirmed in server logs)
- **PDF Generation Flow**: When a user clicks "Download PDF", we send:
  - `templateId`: The selected template
  - `cvData`: The user's CV data
  - to the `/api/generate-pdf` endpoint

### Apparent Backend Expectations

- **Template Storage**: Expected in `/templates/pdf/{templateId}/template.html`
- **Manual Upload**: Through a form that submits to `/api/templates/` endpoint
- **Different File Structure**: One template per directory vs. our flat structure

## Potential Solutions

### Option 1: Adapt to Backend Requirements

We can reorganize our templates to match the expected structure:

```
/templates/pdf/moonlightSonata/template.html
/templates/pdf/kaziFasta/template.html
/templates/pdf/jijengeClassic/template.html
...
```

and update our registration script accordingly.

### Option 2: Clarify Our Integration Approach

The current implementation is working (all 15 templates are successfully registered), but there appears to be a miscommunication:

1. Our existing `/api/templates` endpoint is accepting and registering templates correctly
2. The registration script is successfully uploading the HTML files as form-data
3. The templates are properly stored in the backend's expected location

## Data Flow in Current Implementation

1. **Template Selection**: User selects a template from 15 options
2. **Data Entry**: User inputs their CV information
3. **Live Preview**: React components render the live preview
4. **Download Request**: User clicks download, sending:
   ```json
   {
     "templateId": "selectedTemplateId",
     "cvData": {
       "personalInfo": { ... },
       "workExperience": [ ... ],
       "education": [ ... ],
       ...
     }
   }
   ```
5. **Payment Flow**: Backend verifies payment status
6. **PDF Generation**: Backend loads the template and generates PDF
7. **Download**: User receives the PDF

## Recommendation

We should clarify with the backend team whether:

1. The current implementation is acceptable (all templates are registered and working)
2. We need to reorganize to match their expected directory structure
3. There are specific requirements we're missing

The most important aspect is ensuring consistent data flow and template identification between frontend and backend.