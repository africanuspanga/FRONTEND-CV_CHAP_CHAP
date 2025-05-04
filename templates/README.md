# CV Chap Chap Template System

## Directory Structure

The template system follows this structure:

```
templates/
├── pdf/
│   ├── moonlightSonata/
│   │   └── template.html
│   ├── kaziFasta/
│   │   └── template.html
│   ├── jijengeClassic/
│   │   └── template.html
│   ...
```

All templates are located in the `/templates/pdf/{templateId}/template.html` format as required by the backend system.

## Template Registration

Templates are registered through the API using the script at `server/scripts/register-templates.ts`. This script:

1. Reads each template from `/templates/pdf/{templateId}/template.html`
2. Uploads it to the `/api/templates` endpoint as multipart/form-data
3. Includes metadata: `id`, `name`, `description`, and the HTML file

To register or update templates, run:

```bash
npx tsx server/scripts/register-templates.ts
```

## Template IDs

All 15 templates have unique IDs that are used consistently between frontend and backend:

| Template ID       | Display Name       | Description                                                               |
|-------------------|--------------------|---------------------------------------------------------------------------|
| moonlightSonata   | Moonlight Sonata   | An elegant, professional template with a sophisticated design              |
| kaziFasta         | Kazi Fasta         | A modern, professional template with a two-column layout                   |
| jijengeClassic    | Jijenge Classic    | A classic, professional CV template with a traditional layout              |
| kilimanjaro       | Kilimanjaro        | A clean, professional template with a modern design                        |
| brightDiamond     | Bright Diamond     | A bright and modern template with a sleek design                           |
| mjenziWaTaifa     | Mjenzi wa Taifa    | A sophisticated template with warm tones and a well-structured layout      |
| safariOriginal    | Safari Original    | A bold, colorful template with a vibrant header                           |
| streetHustler     | Street Hustler     | A high-energy design with vibrant colors and street-style typography      |
| bigBoss           | Big Boss           | A powerful, executive-style template that conveys authority               |
| mkaliModern       | Mkali Modern       | A sleek, modern design with minimal accents and focus on readability      |
| tanzanitePro      | Tanzanite Pro      | A contemporary template with professional styling                          |
| mwalimuOne        | Mwalimu One        | A teacher-oriented template ideal for education professionals             |
| serengetiFlow     | Serengeti Flow     | An elegant, flowing design with sophisticated typography                   |
| smartBongo        | Smart Bongo        | A smart, clean template with modern styling suitable for tech             |
| madiniMob         | Madini Mob         | A robust template with strong visual hierarchy                            |

## Template Format

Each HTML template:

1. Has embedded CSS in the `<head>` section for consistent styling
2. Uses double curly braces `{{ variable }}` for data placeholders
3. Uses Jinja2/Nunjucks syntax for conditionals `{% if condition %}...{% endif %}`
4. Uses the same data structure across all templates

## Data Structure

When passing data to templates, use this structure:

```json
{
  "personalInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+255 123 456 789",
    "jobTitle": "Software Engineer",
    "location": "Dar es Salaam, Tanzania",
    "linkedin": "https://linkedin.com/in/johndoe",
    "website": "https://johndoe.com"
  },
  "summary": "Experienced software engineer with expertise in web development...",
  "workExperience": [
    {
      "jobTitle": "Senior Developer",
      "company": "Tech Solutions Ltd",
      "location": "Dar es Salaam",
      "startDate": "Jan 2020",
      "endDate": "Present",
      "achievements": [
        "Led development of enterprise software solutions",
        "Increased team productivity by 25%"
      ]
    }
  ],
  "education": [
    {
      "degree": "BSc in Computer Science",
      "fieldOfStudy": "Computer Science",
      "institution": "University of Dar es Salaam",
      "location": "Dar es Salaam",
      "startDate": "2015",
      "endDate": "2019"
    }
  ],
  "skills": [
    { "name": "JavaScript" },
    { "name": "React" },
    { "name": "Node.js" }
  ],
  "languages": [
    { "name": "English", "level": "Fluent" },
    { "name": "Swahili", "level": "Native" }
  ],
  "references": [
    {
      "name": "Jane Smith",
      "position": "CTO",
      "company": "Tech Solutions Ltd",
      "email": "jane@example.com",
      "phone": "+255 987 654 321"
    }
  ],
  "hobbies": ["Reading", "Photography", "Hiking"]
}
```

## PDF Generation Flow

1. User selects a template and enters CV data on the frontend
2. User previews CV using our React components
3. When user requests download, frontend sends:
   ```json
   {
     "templateId": "selectedTemplateId",
     "cvData": { ... user data ... }
   }
   ```
4. Backend verifies payment status
5. Backend loads the HTML template for the requested `templateId`
6. Backend populates template with user data
7. Backend converts populated HTML to PDF
8. User downloads the PDF

## Testing Templates

To test a template's rendering, use the `/api/templates/{id}/test` endpoint with a POST request.