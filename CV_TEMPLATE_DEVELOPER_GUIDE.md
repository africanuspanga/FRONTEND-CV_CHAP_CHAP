# CV Template Developer Guide: HTML/CSS Templates with Live Data Injection

**For:** Frontend/Template Developers  
**Project:** CV Chap Chap - Professional CV Creation Platform  
**Target Market:** Tanzania & East Africa  

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Complete Data Structure](#complete-data-structure)
3. [Template Architecture](#template-architecture)
4. [Live Data Injection System](#live-data-injection-system)
5. [HTML Structure Guidelines](#html-structure-guidelines)
6. [CSS Best Practices](#css-best-practices)
7. [Responsive Design Requirements](#responsive-design-requirements)
8. [Template Examples](#template-examples)
9. [Testing & Validation](#testing--validation)
10. [Deployment Process](#deployment-process)

---

## 1. Project Overview

### Business Context
CV Chap Chap is a mobile-first CV creation platform targeting Tanzanian professionals. **90% of users access via mobile devices**, making responsive design critical.

### Key Requirements
- **Mobile-first design** (320px minimum width)
- **A4 print compatibility** (210mm × 297mm)
- **Live preview** with real-time data injection
- **Professional aesthetics** suitable for East African job market
- **Fast rendering** (under 2 seconds load time)
- **Swahili/English language support**

---

## 2. Complete Data Structure

### 2.1 Personal Information
The `personalInfo` object contains:

```typescript
interface PersonalInfo {
  // Required fields
  firstName: string;           // e.g., "John"
  lastName: string;            // e.g., "Doe"
  email: string;               // e.g., "john.doe@email.com"
  
  // Optional contact fields
  phone?: string;              // e.g., "+255 123 456 789"
  address?: string;            // e.g., "123 Uhuru Street"
  city?: string;               // e.g., "Dar es Salaam"
  region?: string;             // e.g., "Dar es Salaam"
  country?: string;            // e.g., "Tanzania"
  postalCode?: string;         // e.g., "12345"
  location?: string;           // Combined location e.g., "Dar es Salaam, Tanzania"
  
  // Professional fields
  professionalTitle?: string;  // e.g., "Software Engineer"
  jobTitle?: string;          // Alias for professionalTitle
  summary?: string;           // Professional summary paragraph
  
  // Social profiles
  linkedin?: string;          // e.g., "https://linkedin.com/in/johndoe"
  website?: string;           // e.g., "https://johndoe.com"
  profilePicture?: string;    // Base64 data URI or URL
}
```

### 2.2 Work Experience
Array of work experiences (`workExperiences`):

```typescript
interface WorkExperience {
  id: string;                 // Unique identifier
  jobTitle: string;           // e.g., "Senior Developer"
  company: string;            // e.g., "Vodacom Tanzania"
  location?: string;          // e.g., "Dar es Salaam"
  startDate: string;          // e.g., "Jan 2020"
  endDate?: string;           // e.g., "Present" or "Dec 2023"
  current?: boolean;          // true if currently employed
  description?: string;       // Job description paragraph
  achievements?: string[];    // Array of bullet points
}
```

### 2.3 Education
Array of educational qualifications (`education`):

```typescript
interface Education {
  id: string;                 // Unique identifier
  institution: string;        // e.g., "University of Dar es Salaam"
  degree: string;             // e.g., "Bachelor of Science"
  field?: string;             // e.g., "Computer Science"
  location?: string;          // e.g., "Dar es Salaam"
  startDate: string;          // e.g., "2015"
  endDate?: string;           // e.g., "2019"
  current?: boolean;          // true if currently studying
  description?: string;       // Additional details
  graduationMonth?: string;   // e.g., "June"
  graduationYear?: string;    // e.g., "2019"
  gpa?: string;               // e.g., "3.8/4.0"
  honors?: string;            // e.g., "Magna Cum Laude"
}
```

### 2.4 Skills
Array of skills (`skills`):

```typescript
interface Skill {
  id: string;                 // Unique identifier
  name: string;               // e.g., "JavaScript"
  level?: number;             // 1-5 scale (1=Beginner, 5=Expert)
}
```

### 2.5 Languages
Array of languages (`languages`):

```typescript
interface Language {
  id: string;                 // Unique identifier
  name: string;               // e.g., "English"
  proficiency: "beginner" | "intermediate" | "advanced" | "fluent" | "native";
}
```

### 2.6 References
Array of references (`references`):

```typescript
interface Reference {
  id: string;                 // Unique identifier
  name: string;               // e.g., "Jane Smith"
  company?: string;           // e.g., "Vodacom Tanzania"
  position?: string;          // e.g., "Senior Manager"
  email?: string;             // e.g., "jane.smith@vodacom.co.tz"
  phone?: string;             // e.g., "+255 987 654 321"
}
```

### 2.7 Additional Sections

#### Projects (`projects`):
```typescript
interface Project {
  id: string;
  name: string;               // e.g., "E-commerce Platform"
  description?: string;       // Project description
  url?: string;               // e.g., "https://github.com/user/project"
  startDate?: string;         // e.g., "Jan 2023"
  endDate?: string;           // e.g., "Mar 2023"
}
```

#### Certifications (`certifications`):
```typescript
interface Certification {
  id: string;
  name: string;               // e.g., "AWS Certified Developer"
  issuer: string;             // e.g., "Amazon Web Services"
  date: string;               // e.g., "March 2023"
  url?: string;               // Certificate URL
}
```

#### Websites/Portfolios (`websites`):
```typescript
interface Website {
  id: string;
  name: string;               // e.g., "Portfolio"
  url: string;                // e.g., "https://myportfolio.com"
}
```

#### Accomplishments (`accomplishments`):
```typescript
interface Accomplishment {
  id: string;
  title: string;              // e.g., "Employee of the Year"
  description: string;        // Detailed description
}
```

#### Hobbies (`hobbies`):
```typescript
interface Hobby {
  id: string;
  name: string;               // e.g., "Photography" (max 30 chars)
}
```

### 2.8 Complete Data Object
Your template will receive this complete data structure:

```typescript
interface CVData {
  // Template identifier
  templateId: string;
  
  // Core sections
  personalInfo: PersonalInfo;
  workExperiences: WorkExperience[];
  workExp: WorkExperience[];          // Backward compatibility
  education: Education[];
  skills: Skill[];
  languages: Language[];
  references: Reference[];
  
  // Optional sections
  certifications?: Certification[];
  projects?: Project[];
  websites?: Website[];
  accomplishments?: Accomplishment[];
  hobbies?: Hobby[];
  
  // Additional fields for template compatibility
  name?: string;                      // Computed: firstName + lastName
  summary?: string;                   // Copied from personalInfo.summary
  workExperience?: WorkExperience[];  // Alias for workExperiences
}
```

---

## 3. Template Architecture

### 3.1 File Structure
Each template consists of a single HTML file with embedded CSS:

```
templates/
├── yourTemplateName.html           // Main template file
├── pdf/
│   └── yourTemplateName/
│       ├── style.css               // PDF-specific styles
│       └── template.html           // PDF-optimized version
└── README.md                       // Template documentation
```

### 3.2 HTML Template Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{personalInfo.firstName}} {{personalInfo.lastName}} - CV</title>
  <style>
    /* Your CSS here - see CSS guidelines below */
  </style>
</head>
<body>
  <div class="cv-container">
    <!-- Template content with data injection -->
  </div>
</body>
</html>
```

---

## 4. Live Data Injection System

### 4.1 Data Binding Syntax
Use double curly braces `{{}}` for data injection:

```html
<!-- Basic field injection -->
<h1>{{personalInfo.firstName}} {{personalInfo.lastName}}</h1>
<p>{{personalInfo.email}}</p>

<!-- Conditional rendering -->
{{#if personalInfo.phone}}
  <p>Phone: {{personalInfo.phone}}</p>
{{/if}}

<!-- Array iteration -->
{{#each workExperiences}}
  <div class="work-item">
    <h3>{{jobTitle}}</h3>
    <p>{{company}}</p>
    {{#if location}}<p>{{location}}</p>{{/if}}
    <p>{{startDate}} - {{#if current}}Present{{else}}{{endDate}}{{/if}}</p>
    
    {{#if achievements}}
      <ul>
        {{#each achievements}}
          <li>{{this}}</li>
        {{/each}}
      </ul>
    {{/if}}
  </div>
{{/each}}
```

### 4.2 Conditional Sections
Only display sections when data exists:

```html
<!-- Skills section -->
{{#if skills.length}}
  <section class="skills-section">
    <h2>Skills</h2>
    <div class="skills-grid">
      {{#each skills}}
        <div class="skill-item">
          <span class="skill-name">{{name}}</span>
          {{#if level}}
            <div class="skill-level level-{{level}}"></div>
          {{/if}}
        </div>
      {{/each}}
    </div>
  </section>
{{/if}}

<!-- Languages section -->
{{#if languages.length}}
  <section class="languages-section">
    <h2>Languages</h2>
    {{#each languages}}
      <div class="language-item">
        <span>{{name}} - {{proficiency}}</span>
      </div>
    {{/each}}
  </section>
{{/if}}
```

### 4.3 Fallback Values
Provide fallbacks for optional fields:

```html
<!-- Use professionalTitle or jobTitle with fallback -->
<h2>{{#if personalInfo.professionalTitle}}{{personalInfo.professionalTitle}}{{else if personalInfo.jobTitle}}{{personalInfo.jobTitle}}{{else}}Professional{{/if}}</h2>

<!-- Location with fallback -->
<p>{{#if personalInfo.location}}{{personalInfo.location}}{{else if personalInfo.city}}{{personalInfo.city}}{{#if personalInfo.region}}, {{personalInfo.region}}{{/if}}{{/if}}</p>
```

---

## 5. HTML Structure Guidelines

### 5.1 Semantic HTML
Use proper semantic elements:

```html
<div class="cv-container">
  <header class="cv-header">
    <h1>{{personalInfo.firstName}} {{personalInfo.lastName}}</h1>
    <h2>{{personalInfo.professionalTitle}}</h2>
  </header>
  
  <main class="cv-content">
    <section class="contact-info">
      <!-- Contact details -->
    </section>
    
    <section class="summary">
      <!-- Professional summary -->
    </section>
    
    <section class="experience">
      <!-- Work experience -->
    </section>
    
    <section class="education">
      <!-- Education -->
    </section>
    
    <!-- Other sections as needed -->
  </main>
</div>
```

### 5.2 Accessibility
Ensure accessibility compliance:

```html
<!-- Proper heading hierarchy -->
<h1>Main Name</h1>
<h2>Section Titles</h2>
<h3>Subsection Titles</h3>

<!-- Alt text for images -->
{{#if personalInfo.profilePicture}}
  <img src="{{personalInfo.profilePicture}}" 
       alt="{{personalInfo.firstName}} {{personalInfo.lastName}} profile photo"
       class="profile-image">
{{/if}}

<!-- Proper link attributes -->
{{#if personalInfo.email}}
  <a href="mailto:{{personalInfo.email}}" aria-label="Email {{personalInfo.firstName}}">
    {{personalInfo.email}}
  </a>
{{/if}}
```

---

## 6. CSS Best Practices

### 6.1 Mobile-First Approach
Start with mobile styles, then add desktop enhancements:

```css
/* Mobile styles (320px+) */
.cv-container {
  max-width: 100%;
  margin: 0 auto;
  background-color: #ffffff;
  padding: 15px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 12px;
  line-height: 1.4;
  color: #333;
}

/* Tablet styles (768px+) */
@media (min-width: 768px) {
  .cv-container {
    max-width: 700px;
    padding: 30px;
    font-size: 13px;
    line-height: 1.5;
  }
}

/* Desktop styles (1024px+) */
@media (min-width: 1024px) {
  .cv-container {
    max-width: 850px;
    padding: 40px;
    font-size: 14px;
    line-height: 1.6;
  }
}

/* Print styles (A4 format) */
@media print {
  .cv-container {
    max-width: none;
    margin: 0;
    padding: 20px;
    font-size: 11px;
    line-height: 1.3;
    color: #000;
  }
}
```

### 6.2 Typography Scale
Use consistent typography:

```css
/* Typography hierarchy */
h1 {
  font-size: 1.8em;
  font-weight: 700;
  margin-bottom: 0.5em;
  color: #2c3e50;
}

h2 {
  font-size: 1.3em;
  font-weight: 600;
  margin: 1.2em 0 0.6em 0;
  color: #34495e;
  border-bottom: 2px solid #3498db;
  padding-bottom: 0.3em;
}

h3 {
  font-size: 1.1em;
  font-weight: 600;
  margin: 1em 0 0.4em 0;
  color: #2c3e50;
}

p {
  margin-bottom: 0.8em;
}

/* Contact information */
.contact-info {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 1.5em;
  font-size: 0.9em;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 5px;
}
```

### 6.3 Layout Patterns

#### Two-Column Layout:
```css
.cv-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 768px) {
  .cv-content {
    grid-template-columns: 1fr 2fr;
    gap: 30px;
  }
  
  .sidebar {
    grid-column: 1;
  }
  
  .main-content {
    grid-column: 2;
  }
}
```

#### Experience Items:
```css
.experience-item {
  margin-bottom: 1.5em;
  padding-bottom: 1em;
  border-bottom: 1px solid #eee;
}

.experience-item:last-child {
  border-bottom: none;
}

.job-header {
  display: flex;
  flex-direction: column;
  gap: 0.3em;
  margin-bottom: 0.8em;
}

@media (min-width: 768px) {
  .job-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
}

.job-title {
  font-weight: 600;
  color: #2c3e50;
}

.company-name {
  color: #7f8c8d;
  font-style: italic;
}

.job-period {
  color: #95a5a6;
  font-size: 0.9em;
}
```

### 6.4 Color Schemes
Use professional color palettes:

```css
/* Professional Blue Theme */
:root {
  --primary-color: #2c3e50;      /* Dark blue-gray */
  --secondary-color: #3498db;     /* Bright blue */
  --accent-color: #e74c3c;       /* Red accent */
  --text-color: #2c3e50;         /* Dark text */
  --text-muted: #7f8c8d;         /* Muted text */
  --border-color: #bdc3c7;       /* Light borders */
  --background-color: #ffffff;    /* White background */
  --section-bg: #f8f9fa;         /* Light section background */
}

/* Green Professional Theme */
:root {
  --primary-color: #27ae60;      /* Professional green */
  --secondary-color: #2ecc71;     /* Bright green */
  --accent-color: #f39c12;       /* Orange accent */
  --text-color: #2c3e50;
  --text-muted: #7f8c8d;
  --border-color: #bdc3c7;
  --background-color: #ffffff;
  --section-bg: #f8f9fa;
}
```

---

## 7. Responsive Design Requirements

### 7.1 Breakpoints
Support these device sizes:

```css
/* Mobile portrait: 320px - 479px */
@media (max-width: 479px) {
  .cv-container {
    padding: 10px;
    font-size: 11px;
  }
}

/* Mobile landscape: 480px - 767px */
@media (min-width: 480px) and (max-width: 767px) {
  .cv-container {
    padding: 15px;
    font-size: 12px;
  }
}

/* Tablet: 768px - 1023px */
@media (min-width: 768px) and (max-width: 1023px) {
  .cv-container {
    padding: 25px;
    font-size: 13px;
  }
}

/* Desktop: 1024px+ */
@media (min-width: 1024px) {
  .cv-container {
    padding: 40px;
    font-size: 14px;
  }
}
```

### 7.2 Mobile Optimizations

```css
/* Touch-friendly spacing */
.mobile-friendly {
  padding: 15px;
  margin-bottom: 15px;
}

/* Readable font sizes */
@media (max-width: 767px) {
  h1 { font-size: 1.5em; }
  h2 { font-size: 1.2em; }
  h3 { font-size: 1.1em; }
  p { font-size: 12px; }
}

/* Stack elements vertically on mobile */
@media (max-width: 767px) {
  .desktop-flex {
    display: block;
  }
  
  .desktop-flex > * {
    margin-bottom: 10px;
  }
  
  .desktop-flex > *:last-child {
    margin-bottom: 0;
  }
}
```

---

## 8. Template Examples

### 8.1 Basic Professional Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{personalInfo.firstName}} {{personalInfo.lastName}} - CV</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f5f5f5;
      color: #333;
      line-height: 1.6;
    }
    
    .cv-container {
      max-width: 850px;
      margin: 20px auto;
      background-color: #ffffff;
      box-shadow: 0 0 20px rgba(0,0,0,0.1);
      padding: 40px;
    }
    
    @media (max-width: 768px) {
      .cv-container {
        margin: 0;
        padding: 20px;
        box-shadow: none;
      }
    }
    
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 3px solid #3498db;
    }
    
    .name {
      font-size: 2.5em;
      font-weight: 700;
      color: #2c3e50;
      margin-bottom: 10px;
    }
    
    .title {
      font-size: 1.3em;
      color: #7f8c8d;
      margin-bottom: 15px;
    }
    
    .contact-info {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 20px;
      font-size: 0.9em;
    }
    
    @media (max-width: 768px) {
      .name { font-size: 2em; }
      .title { font-size: 1.1em; }
      .contact-info {
        flex-direction: column;
        text-align: center;
        gap: 10px;
      }
    }
    
    .section {
      margin-bottom: 30px;
    }
    
    .section-title {
      font-size: 1.4em;
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 2px solid #3498db;
    }
    
    .experience-item {
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #eee;
    }
    
    .experience-item:last-child {
      border-bottom: none;
    }
    
    .job-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;
    }
    
    @media (max-width: 768px) {
      .job-header {
        flex-direction: column;
        gap: 5px;
      }
    }
    
    .job-title {
      font-weight: 600;
      color: #2c3e50;
      font-size: 1.1em;
    }
    
    .company {
      color: #7f8c8d;
      font-style: italic;
    }
    
    .period {
      color: #95a5a6;
      font-size: 0.9em;
    }
    
    .achievements {
      margin-top: 10px;
    }
    
    .achievements ul {
      padding-left: 20px;
    }
    
    .achievements li {
      margin-bottom: 5px;
    }
    
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 10px;
    }
    
    @media (max-width: 768px) {
      .skills-grid {
        grid-template-columns: 1fr;
      }
    }
    
    .skill-item {
      padding: 8px 12px;
      background-color: #f8f9fa;
      border-radius: 4px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="cv-container">
    <!-- Header -->
    <header class="header">
      <h1 class="name">{{personalInfo.firstName}} {{personalInfo.lastName}}</h1>
      {{#if personalInfo.professionalTitle}}
        <h2 class="title">{{personalInfo.professionalTitle}}</h2>
      {{/if}}
      
      <div class="contact-info">
        {{#if personalInfo.email}}
          <span>📧 {{personalInfo.email}}</span>
        {{/if}}
        {{#if personalInfo.phone}}
          <span>📱 {{personalInfo.phone}}</span>
        {{/if}}
        {{#if personalInfo.location}}
          <span>📍 {{personalInfo.location}}</span>
        {{/if}}
        {{#if personalInfo.linkedin}}
          <span>💼 LinkedIn</span>
        {{/if}}
      </div>
    </header>
    
    <!-- Professional Summary -->
    {{#if personalInfo.summary}}
      <section class="section">
        <h2 class="section-title">Professional Summary</h2>
        <p>{{personalInfo.summary}}</p>
      </section>
    {{/if}}
    
    <!-- Work Experience -->
    {{#if workExperiences.length}}
      <section class="section">
        <h2 class="section-title">Work Experience</h2>
        {{#each workExperiences}}
          <div class="experience-item">
            <div class="job-header">
              <div>
                <div class="job-title">{{jobTitle}}</div>
                <div class="company">{{company}}</div>
                {{#if location}}<div class="location">{{location}}</div>{{/if}}
              </div>
              <div class="period">{{startDate}} - {{#if current}}Present{{else}}{{endDate}}{{/if}}</div>
            </div>
            {{#if description}}
              <p>{{description}}</p>
            {{/if}}
            {{#if achievements}}
              <div class="achievements">
                <ul>
                  {{#each achievements}}
                    <li>{{this}}</li>
                  {{/each}}
                </ul>
              </div>
            {{/if}}
          </div>
        {{/each}}
      </section>
    {{/if}}
    
    <!-- Education -->
    {{#if education.length}}
      <section class="section">
        <h2 class="section-title">Education</h2>
        {{#each education}}
          <div class="experience-item">
            <div class="job-header">
              <div>
                <div class="job-title">{{degree}}{{#if field}} in {{field}}{{/if}}</div>
                <div class="company">{{institution}}</div>
                {{#if location}}<div class="location">{{location}}</div>{{/if}}
              </div>
              <div class="period">{{startDate}}{{#if endDate}} - {{endDate}}{{/if}}</div>
            </div>
            {{#if description}}
              <p>{{description}}</p>
            {{/if}}
          </div>
        {{/each}}
      </section>
    {{/if}}
    
    <!-- Skills -->
    {{#if skills.length}}
      <section class="section">
        <h2 class="section-title">Skills</h2>
        <div class="skills-grid">
          {{#each skills}}
            <div class="skill-item">{{name}}</div>
          {{/each}}
        </div>
      </section>
    {{/if}}
    
    <!-- Languages -->
    {{#if languages.length}}
      <section class="section">
        <h2 class="section-title">Languages</h2>
        {{#each languages}}
          <div style="margin-bottom: 10px;">
            <strong>{{name}}</strong> - {{proficiency}}
          </div>
        {{/each}}
      </section>
    {{/if}}
    
    <!-- References -->
    {{#if references.length}}
      <section class="section">
        <h2 class="section-title">References</h2>
        {{#each references}}
          <div style="margin-bottom: 15px;">
            <strong>{{name}}</strong>
            {{#if position}}{{#if company}} - {{position}} at {{company}}{{else}} - {{position}}{{/if}}{{/if}}
            {{#if email}}<br>📧 {{email}}{{/if}}
            {{#if phone}}<br>📱 {{phone}}{{/if}}
          </div>
        {{/each}}
      </section>
    {{/if}}
  </div>
</body>
</html>
```

---

## 9. Testing & Validation

### 9.1 Template Testing Checklist

#### Responsive Testing:
- [ ] Mobile portrait (320px)
- [ ] Mobile landscape (480px)
- [ ] Tablet (768px)
- [ ] Desktop (1024px+)
- [ ] Print preview (A4)

#### Data Testing:
- [ ] Empty fields handled gracefully
- [ ] Long text doesn't break layout
- [ ] Special characters display correctly
- [ ] Swahili text renders properly
- [ ] Arrays with 0, 1, and multiple items
- [ ] All optional sections work when missing

#### Browser Testing:
- [ ] Chrome (mobile & desktop)
- [ ] Safari (mobile & desktop)
- [ ] Firefox
- [ ] Edge

### 9.2 Sample Test Data
Use this comprehensive test data:

```json
{
  "templateId": "testTemplate",
  "personalInfo": {
    "firstName": "Amara",
    "lastName": "Mwalimu",
    "email": "amara.mwalimu@email.com",
    "phone": "+255 784 123 456",
    "location": "Dar es Salaam, Tanzania",
    "professionalTitle": "Senior Software Engineer",
    "summary": "Passionate software engineer with 5+ years of experience developing scalable web applications for East African markets. Expertise in React, Node.js, and cloud technologies. Proven track record of leading development teams and delivering innovative solutions that drive business growth."
  },
  "workExperiences": [
    {
      "id": "1",
      "jobTitle": "Senior Software Engineer",
      "company": "Vodacom Tanzania",
      "location": "Dar es Salaam",
      "startDate": "Jan 2022",
      "current": true,
      "achievements": [
        "Led development of mobile money platform serving 2M+ users",
        "Reduced application load time by 40% through performance optimization",
        "Mentored 3 junior developers and established code review processes"
      ]
    },
    {
      "id": "2",
      "jobTitle": "Full Stack Developer",
      "company": "CRDB Bank",
      "location": "Dar es Salaam",
      "startDate": "Jun 2020",
      "endDate": "Dec 2021",
      "achievements": [
        "Built customer onboarding system processing 500+ applications daily",
        "Integrated with multiple payment gateways and APIs"
      ]
    }
  ],
  "education": [
    {
      "id": "1",
      "institution": "University of Dar es Salaam",
      "degree": "Bachelor of Science",
      "field": "Computer Science",
      "location": "Dar es Salaam",
      "startDate": "2016",
      "endDate": "2020",
      "honors": "First Class Honours"
    }
  ],
  "skills": [
    {"id": "1", "name": "JavaScript", "level": 5},
    {"id": "2", "name": "React", "level": 5},
    {"id": "3", "name": "Node.js", "level": 4},
    {"id": "4", "name": "Python", "level": 4},
    {"id": "5", "name": "AWS", "level": 3},
    {"id": "6", "name": "Docker", "level": 3}
  ],
  "languages": [
    {"id": "1", "name": "English", "proficiency": "fluent"},
    {"id": "2", "name": "Swahili", "proficiency": "native"},
    {"id": "3", "name": "French", "proficiency": "intermediate"}
  ],
  "references": [
    {
      "id": "1",
      "name": "Dr. Sarah Mbwana",
      "position": "CTO",
      "company": "Vodacom Tanzania",
      "email": "sarah.mbwana@vodacom.co.tz",
      "phone": "+255 789 456 123"
    }
  ],
  "certifications": [
    {
      "id": "1",
      "name": "AWS Certified Solutions Architect",
      "issuer": "Amazon Web Services",
      "date": "March 2023"
    }
  ],
  "projects": [
    {
      "id": "1",
      "name": "E-Commerce Platform for SMEs",
      "description": "Built a comprehensive e-commerce solution for small and medium enterprises in Tanzania",
      "url": "https://github.com/amara/ecommerce-tz"
    }
  ]
}
```

---

## 10. Deployment Process

### 10.1 Template Registration
Add your template to the system:

1. **Save template file**: `templates/yourTemplateName.html`
2. **Add to template registry**: Update the template list in the application
3. **Create preview image**: Generate a 400x300px preview image
4. **Test integration**: Verify template works with live data

### 10.2 Quality Assurance
Before deployment, ensure:

- [ ] **Mobile responsiveness** on all device sizes
- [ ] **Print compatibility** (A4 format)
- [ ] **Data validation** handles all edge cases
- [ ] **Performance** loads in under 2 seconds
- [ ] **Accessibility** meets WCAG guidelines
- [ ] **Cross-browser** compatibility
- [ ] **Language support** for English and Swahili text

### 10.3 Template Metadata
Provide this information for each template:

```json
{
  "id": "yourTemplateName",
  "name": "Professional Blue",
  "description": "Clean, professional template perfect for corporate roles",
  "category": "professional",
  "tags": ["corporate", "clean", "blue", "traditional"],
  "difficulty": "beginner",
  "mobileOptimized": true,
  "printOptimized": true,
  "estimatedBuildTime": "4-6 hours"
}
```

---

## Key Success Factors

1. **Mobile-First Design**: 90% of users are on mobile
2. **Fast Loading**: Templates must render quickly
3. **Professional Appearance**: Suitable for East African job market
4. **Data Flexibility**: Handle missing or empty fields gracefully
5. **Print Quality**: Must look good on A4 paper
6. **Cultural Sensitivity**: Appropriate for Tanzanian context

---

## Support & Resources

- **Template Examples**: Review existing templates in `/templates/` folder
- **Data Structure**: See complete schema in `/shared/schema.ts`
- **Testing Data**: Use sample data provided above
- **Design Guidelines**: Follow mobile-first responsive principles
- **Performance**: Optimize for fast rendering on low-end devices

Remember: Your templates directly impact job seekers' success in landing interviews. Focus on professional, clean designs that highlight qualifications effectively while maintaining excellent mobile usability.