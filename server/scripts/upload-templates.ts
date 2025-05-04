/**
 * Script to upload all CV templates to the backend API
 * Run with: npx tsx server/scripts/upload-templates.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure templates directory exists
const templatesDir = path.join(process.cwd(), 'templates');
if (!fs.existsSync(templatesDir)) {
  fs.mkdirSync(templatesDir, { recursive: true });
}

// Template definitions
const templates = [
  {
    id: 'kilimanjaro',
    name: 'Kilimanjaro Professional',
    description: 'A clean, professional template with a modern design suitable for corporate environments.',
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>{{ name }} - CV</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 0;
      color: #333;
      background-color: #fff;
    }
    .cv-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 2px solid #0077b6;
      padding-bottom: 20px;
    }
    h1 {
      color: #0077b6;
      margin: 0;
      font-size: 36px;
    }
    .title {
      font-size: 18px;
      color: #555;
      margin-top: 5px;
    }
    .contact-info {
      margin-top: 15px;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 15px;
    }
    .contact-item {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .section {
      margin-bottom: 25px;
    }
    .section-title {
      color: #0077b6;
      border-bottom: 1px solid #ddd;
      padding-bottom: 8px;
      margin-bottom: 15px;
    }
    .experience-item, .education-item {
      margin-bottom: 20px;
    }
    .item-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
    }
    .item-title {
      font-weight: bold;
      color: #333;
      margin: 0;
    }
    .item-date {
      color: #666;
    }
    .item-subtitle {
      color: #555;
      margin: 0;
      font-style: italic;
    }
    .skills-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .skill-item {
      background-color: #f0f7fc;
      padding: 5px 10px;
      border-radius: 3px;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="cv-container">
    <div class="header">
      <h1>{{ name }}</h1>
      <p class="title">{{ title }}</p>
      <div class="contact-info">
        <div class="contact-item">Email: {{ email }}</div>
        {% if phone %}
        <div class="contact-item">Phone: {{ phone }}</div>
        {% endif %}
        {% if location %}
        <div class="contact-item">Location: {{ location }}</div>
        {% endif %}
      </div>
    </div>
    
    {% if summary %}
    <div class="section">
      <h2 class="section-title">Professional Summary</h2>
      <p>{{ summary }}</p>
    </div>
    {% endif %}
    
    {% if experience and experience|length > 0 %}
    <div class="section">
      <h2 class="section-title">Experience</h2>
      {% for exp in experience %}
      <div class="experience-item">
        <div class="item-header">
          <h3 class="item-title">{{ exp.position }}</h3>
          <span class="item-date">{{ exp.duration }}</span>
        </div>
        <p class="item-subtitle">{{ exp.company }}</p>
        <p>{{ exp.description }}</p>
      </div>
      {% endfor %}
    </div>
    {% endif %}
    
    {% if education and education|length > 0 %}
    <div class="section">
      <h2 class="section-title">Education</h2>
      {% for edu in education %}
      <div class="education-item">
        <div class="item-header">
          <h3 class="item-title">{{ edu.degree }}</h3>
          <span class="item-date">{{ edu.duration }}</span>
        </div>
        <p class="item-subtitle">{{ edu.school }}</p>
        {% if edu.description %}
        <p>{{ edu.description }}</p>
        {% endif %}
      </div>
      {% endfor %}
    </div>
    {% endif %}
    
    {% if skills and skills|length > 0 %}
    <div class="section">
      <h2 class="section-title">Skills</h2>
      <div class="skills-list">
        {% for skill in skills %}
        <div class="skill-item">{{ skill }}</div>
        {% endfor %}
      </div>
    </div>
    {% endif %}
    
    {% if languages and languages|length > 0 %}
    <div class="section">
      <h2 class="section-title">Languages</h2>
      <div class="skills-list">
        {% for language in languages %}
        <div class="skill-item">{{ language }}</div>
        {% endfor %}
      </div>
    </div>
    {% endif %}
  </div>
</body>
</html>`
  },
  {
    id: 'serengeti-elegant',
    name: 'Serengeti Elegant',
    description: 'An elegant, minimalist design with sophisticated typography perfect for creative professionals.',
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>{{ name }} - CV</title>
  <style>
    body {
      font-family: 'Georgia', serif;
      margin: 0;
      padding: 0;
      color: #222;
      background-color: #fafafa;
      line-height: 1.6;
    }
    .cv-container {
      max-width: 800px;
      margin: 40px auto;
      padding: 50px;
      box-shadow: 0 0 20px rgba(0,0,0,0.05);
      background-color: #fff;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      border-bottom: 1px solid #e0e0e0;
      padding-bottom: 30px;
    }
    h1 {
      color: #222;
      margin: 0;
      font-size: 38px;
      font-weight: normal;
      letter-spacing: 1px;
    }
    .title {
      font-size: 20px;
      color: #666;
      margin-top: 10px;
      font-style: italic;
    }
    .contact-info {
      margin-top: 20px;
      font-size: 16px;
      color: #555;
    }
    .contact-item {
      margin: 5px 0;
    }
    .section {
      margin-bottom: 35px;
    }
    .section-title {
      color: #333;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
      margin-bottom: 20px;
      font-weight: normal;
      letter-spacing: 0.5px;
    }
    .experience-item, .education-item {
      margin-bottom: 25px;
    }
    .item-header {
      margin-bottom: 8px;
    }
    .item-title {
      font-weight: bold;
      color: #333;
      margin: 0;
      margin-bottom: 5px;
      font-size: 18px;
    }
    .item-date {
      color: #777;
      font-style: italic;
      font-size: 15px;
      display: block;
      margin-bottom: 8px;
    }
    .item-subtitle {
      color: #444;
      margin: 0;
      font-size: 16px;
    }
    .item-description {
      color: #555;
      margin-top: 10px;
      text-align: justify;
    }
    .skills-container {
      display: flex;
      flex-wrap: wrap;
      gap: 5px 15px;
    }
    .skill-item {
      position: relative;
      padding-left: 15px;
    }
    .skill-item:before {
      content: "•";
      position: absolute;
      left: 0;
      color: #888;
    }
  </style>
</head>
<body>
  <div class="cv-container">
    <div class="header">
      <h1>{{ name }}</h1>
      <p class="title">{{ title }}</p>
      <div class="contact-info">
        <div class="contact-item">{{ email }}</div>
        {% if phone %}
        <div class="contact-item">{{ phone }}</div>
        {% endif %}
        {% if location %}
        <div class="contact-item">{{ location }}</div>
        {% endif %}
      </div>
    </div>
    
    {% if summary %}
    <div class="section">
      <h2 class="section-title">Profile</h2>
      <p class="item-description">{{ summary }}</p>
    </div>
    {% endif %}
    
    {% if experience and experience|length > 0 %}
    <div class="section">
      <h2 class="section-title">Professional Experience</h2>
      {% for exp in experience %}
      <div class="experience-item">
        <div class="item-header">
          <h3 class="item-title">{{ exp.position }}</h3>
          <p class="item-subtitle">{{ exp.company }}</p>
          <span class="item-date">{{ exp.duration }}</span>
        </div>
        <p class="item-description">{{ exp.description }}</p>
      </div>
      {% endfor %}
    </div>
    {% endif %}
    
    {% if education and education|length > 0 %}
    <div class="section">
      <h2 class="section-title">Education</h2>
      {% for edu in education %}
      <div class="education-item">
        <div class="item-header">
          <h3 class="item-title">{{ edu.degree }}</h3>
          <p class="item-subtitle">{{ edu.school }}</p>
          <span class="item-date">{{ edu.duration }}</span>
        </div>
        {% if edu.description %}
        <p class="item-description">{{ edu.description }}</p>
        {% endif %}
      </div>
      {% endfor %}
    </div>
    {% endif %}
    
    {% if skills and skills|length > 0 %}
    <div class="section">
      <h2 class="section-title">Skills</h2>
      <div class="skills-container">
        {% for skill in skills %}
        <div class="skill-item">{{ skill }}</div>
        {% endfor %}
      </div>
    </div>
    {% endif %}
    
    {% if languages and languages|length > 0 %}
    <div class="section">
      <h2 class="section-title">Languages</h2>
      <div class="skills-container">
        {% for language in languages %}
        <div class="skill-item">{{ language }}</div>
        {% endfor %}
      </div>
    </div>
    {% endif %}
  </div>
</body>
</html>`
  },
  {
    id: 'safari-original',
    name: 'Safari Original',
    description: 'A bold, colorful template with a vibrant header that suits creative roles and industries.',
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>{{ name }} - CV</title>
  <style>
    body {
      font-family: 'Open Sans', sans-serif;
      margin: 0;
      padding: 0;
      color: #333;
      background-color: #f5f5f5;
    }
    .cv-container {
      max-width: 800px;
      margin: 0 auto;
      background-color: #fff;
      box-shadow: 0 0 15px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #ff7e5f, #feb47b);
      color: #fff;
      padding: 40px;
      text-align: center;
    }
    h1 {
      margin: 0;
      font-size: 36px;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
    }
    .title {
      font-size: 18px;
      margin-top: 10px;
      font-weight: 300;
    }
    .contact-info {
      margin-top: 20px;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 20px;
    }
    .contact-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .main-content {
      padding: 40px;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      color: #ff7e5f;
      position: relative;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    .section-title:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 50px;
      height: 3px;
      background-color: #ff7e5f;
    }
    .experience-item, .education-item {
      margin-bottom: 25px;
      position: relative;
      padding-left: 20px;
    }
    .experience-item:before, .education-item:before {
      content: '';
      position: absolute;
      top: 5px;
      left: 0;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #feb47b;
    }
    .item-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
    }
    .item-title {
      font-weight: bold;
      color: #444;
      margin: 0;
    }
    .item-date {
      color: #777;
    }
    .item-subtitle {
      color: #666;
      margin: 5px 0;
    }
    .skills-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .skill-item {
      background-color: #f8f2ee;
      color: #ff7e5f;
      padding: 7px 15px;
      border-radius: 20px;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="cv-container">
    <div class="header">
      <h1>{{ name }}</h1>
      <p class="title">{{ title }}</p>
      <div class="contact-info">
        <div class="contact-item">{{ email }}</div>
        {% if phone %}
        <div class="contact-item">{{ phone }}</div>
        {% endif %}
        {% if location %}
        <div class="contact-item">{{ location }}</div>
        {% endif %}
      </div>
    </div>
    
    <div class="main-content">
      {% if summary %}
      <div class="section">
        <h2 class="section-title">About Me</h2>
        <p>{{ summary }}</p>
      </div>
      {% endif %}
      
      {% if experience and experience|length > 0 %}
      <div class="section">
        <h2 class="section-title">Experience</h2>
        {% for exp in experience %}
        <div class="experience-item">
          <div class="item-header">
            <h3 class="item-title">{{ exp.position }}</h3>
            <span class="item-date">{{ exp.duration }}</span>
          </div>
          <p class="item-subtitle">{{ exp.company }}</p>
          <p>{{ exp.description }}</p>
        </div>
        {% endfor %}
      </div>
      {% endif %}
      
      {% if education and education|length > 0 %}
      <div class="section">
        <h2 class="section-title">Education</h2>
        {% for edu in education %}
        <div class="education-item">
          <div class="item-header">
            <h3 class="item-title">{{ edu.degree }}</h3>
            <span class="item-date">{{ edu.duration }}</span>
          </div>
          <p class="item-subtitle">{{ edu.school }}</p>
          {% if edu.description %}
          <p>{{ edu.description }}</p>
          {% endif %}
        </div>
        {% endfor %}
      </div>
      {% endif %}
      
      {% if skills and skills|length > 0 %}
      <div class="section">
        <h2 class="section-title">Skills</h2>
        <div class="skills-list">
          {% for skill in skills %}
          <div class="skill-item">{{ skill }}</div>
          {% endfor %}
        </div>
      </div>
      {% endif %}
      
      {% if languages and languages|length > 0 %}
      <div class="section">
        <h2 class="section-title">Languages</h2>
        <div class="skills-list">
          {% for language in languages %}
          <div class="skill-item">{{ language }}</div>
          {% endfor %}
        </div>
      </div>
      {% endif %}
    </div>
  </div>
</body>
</html>`
  },
  {
    id: 'modern-zanzibar',
    name: 'Modern Zanzibar',
    description: 'A contemporary two-column layout with a calming blue color scheme ideal for technical professionals.',
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>{{ name }} - CV</title>
  <style>
    body {
      font-family: 'Roboto', sans-serif;
      margin: 0;
      padding: 0;
      color: #333;
      background-color: #f6f9fc;
    }
    .cv-container {
      max-width: 900px;
      margin: 0 auto;
      display: flex;
      box-shadow: 0 0 20px rgba(0,0,0,0.1);
      background-color: #fff;
    }
    .sidebar {
      width: 30%;
      background-color: #1e88e5;
      color: white;
      padding: 40px 20px;
    }
    .main-content {
      width: 70%;
      padding: 40px;
    }
    .profile {
      text-align: center;
      margin-bottom: 30px;
    }
    .profile-img {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      margin: 0 auto 15px;
      background-color: #90caf9;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48px;
      font-weight: bold;
    }
    h1 {
      font-size: 28px;
      margin: 10px 0 5px;
    }
    .title {
      font-size: 16px;
      font-weight: 300;
      margin-bottom: 20px;
    }
    .contact-info {
      margin-top: 30px;
    }
    .contact-item {
      display: flex;
      margin-bottom: 15px;
      align-items: center;
      gap: 10px;
    }
    .contact-icon {
      width: 20px;
      height: 20px;
      background-color: white;
      color: #1e88e5;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      font-size: 12px;
    }
    .skills-section, .languages-section {
      margin-top: 30px;
    }
    .sidebar-title {
      font-size: 20px;
      margin-bottom: 15px;
      position: relative;
      padding-bottom: 10px;
    }
    .sidebar-title:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 40px;
      height: 2px;
      background-color: white;
    }
    .skill-item, .language-item {
      margin-bottom: 12px;
    }
    .skill-name, .language-name {
      margin-bottom: 5px;
    }
    .skill-bar, .language-bar {
      height: 6px;
      background-color: rgba(255,255,255,0.2);
      border-radius: 3px;
      overflow: hidden;
    }
    .skill-level, .language-level {
      height: 100%;
      background-color: white;
    }
    .main-section {
      margin-bottom: 30px;
    }
    .section-title {
      color: #1e88e5;
      font-size: 24px;
      margin-bottom: 20px;
      position: relative;
      padding-bottom: 10px;
    }
    .section-title:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 50px;
      height: 2px;
      background-color: #1e88e5;
    }
    .experience-item, .education-item {
      margin-bottom: 25px;
    }
    .item-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .item-title {
      font-weight: bold;
      color: #444;
      margin: 0;
      font-size: 18px;
    }
    .item-date {
      color: #777;
    }
    .item-subtitle {
      color: #666;
      margin: 5px 0 10px;
    }
  </style>
</head>
<body>
  <div class="cv-container">
    <div class="sidebar">
      <div class="profile">
        <div class="profile-img">{{ name|slice:"0:1" }}</div>
        <h1>{{ name }}</h1>
        <p class="title">{{ title }}</p>
      </div>
      
      <div class="contact-info">
        <div class="contact-item">
          <div class="contact-icon">@</div>
          <div>{{ email }}</div>
        </div>
        {% if phone %}
        <div class="contact-item">
          <div class="contact-icon">T</div>
          <div>{{ phone }}</div>
        </div>
        {% endif %}
        {% if location %}
        <div class="contact-item">
          <div class="contact-icon">L</div>
          <div>{{ location }}</div>
        </div>
        {% endif %}
      </div>
      
      {% if skills and skills|length > 0 %}
      <div class="skills-section">
        <h2 class="sidebar-title">Skills</h2>
        {% for skill in skills %}
        <div class="skill-item">
          <div class="skill-name">{{ skill }}</div>
          <div class="skill-bar">
            <div class="skill-level" style="width: 85%"></div>
          </div>
        </div>
        {% endfor %}
      </div>
      {% endif %}
      
      {% if languages and languages|length > 0 %}
      <div class="languages-section">
        <h2 class="sidebar-title">Languages</h2>
        {% for language in languages %}
        <div class="language-item">
          <div class="language-name">{{ language }}</div>
          <div class="language-bar">
            <div class="language-level" style="width: 80%"></div>
          </div>
        </div>
        {% endfor %}
      </div>
      {% endif %}
    </div>
    
    <div class="main-content">
      {% if summary %}
      <div class="main-section">
        <h2 class="section-title">Profile</h2>
        <p>{{ summary }}</p>
      </div>
      {% endif %}
      
      {% if experience and experience|length > 0 %}
      <div class="main-section">
        <h2 class="section-title">Work Experience</h2>
        {% for exp in experience %}
        <div class="experience-item">
          <div class="item-header">
            <h3 class="item-title">{{ exp.position }}</h3>
            <span class="item-date">{{ exp.duration }}</span>
          </div>
          <p class="item-subtitle">{{ exp.company }}</p>
          <p>{{ exp.description }}</p>
        </div>
        {% endfor %}
      </div>
      {% endif %}
      
      {% if education and education|length > 0 %}
      <div class="main-section">
        <h2 class="section-title">Education</h2>
        {% for edu in education %}
        <div class="education-item">
          <div class="item-header">
            <h3 class="item-title">{{ edu.degree }}</h3>
            <span class="item-date">{{ edu.duration }}</span>
          </div>
          <p class="item-subtitle">{{ edu.school }}</p>
          {% if edu.description %}
          <p>{{ edu.description }}</p>
          {% endif %}
        </div>
        {% endfor %}
      </div>
      {% endif %}
    </div>
  </div>
</body>
</html>`
  },
  {
    id: 'mkali-modern',
    name: 'Mkali Modern',
    description: 'A sleek, modern design with minimal accents and focus on readability.',
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>{{ name }} - CV</title>
  <style>
    body {
      font-family: 'Inter', sans-serif;
      margin: 0;
      padding: 0;
      color: #222;
      background-color: #fcfcfc;
      line-height: 1.5;
    }
    .cv-container {
      max-width: 800px;
      margin: 40px auto;
      padding: 40px;
      background-color: white;
      box-shadow: 0 5px 25px rgba(0,0,0,0.05);
      border-radius: 5px;
    }
    .header {
      margin-bottom: 40px;
    }
    h1 {
      margin: 0;
      font-size: 36px;
      font-weight: 700;
      color: #111;
    }
    .title {
      font-size: 20px;
      color: #444;
      margin-top: 5px;
      font-weight: 500;
    }
    .contact-info {
      margin-top: 20px;
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      font-size: 14px;
    }
    .section {
      margin-bottom: 35px;
      border-left: 3px solid #f0f0f0;
      padding-left: 25px;
    }
    .section-title {
      font-size: 22px;
      color: #222;
      margin-top: 0;
      margin-bottom: 20px;
      font-weight: 600;
    }
    .experience-item, .education-item {
      margin-bottom: 25px;
      position: relative;
    }
    .experience-item:before, .education-item:before {
      content: '';
      position: absolute;
      width: 12px;
      height: 12px;
      background-color: #f0f0f0;
      border-radius: 50%;
      top: 5px;
      left: -31px;
    }
    .item-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      align-items: flex-start;
    }
    .item-title {
      font-weight: 600;
      color: #222;
      margin: 0;
      font-size: 18px;
    }
    .item-date {
      color: #666;
      font-size: 14px;
    }
    .item-subtitle {
      font-size: 16px;
      color: #444;
      margin: 0 0 10px;
    }
    .skills-section {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
    }
    .skill-item {
      background-color: #f9f9f9;
      padding: 10px 15px;
      border-radius: 4px;
      font-size: 14px;
      color: #333;
    }
    .languages-section {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
    }
    .language-item {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .language-name {
      font-weight: 500;
    }
    .language-level {
      color: #666;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="cv-container">
    <div class="header">
      <h1>{{ name }}</h1>
      <p class="title">{{ title }}</p>
      <div class="contact-info">
        <div>{{ email }}</div>
        {% if phone %}
        <div>{{ phone }}</div>
        {% endif %}
        {% if location %}
        <div>{{ location }}</div>
        {% endif %}
      </div>
    </div>
    
    {% if summary %}
    <div class="section">
      <h2 class="section-title">Summary</h2>
      <p>{{ summary }}</p>
    </div>
    {% endif %}
    
    {% if experience and experience|length > 0 %}
    <div class="section">
      <h2 class="section-title">Experience</h2>
      {% for exp in experience %}
      <div class="experience-item">
        <div class="item-header">
          <h3 class="item-title">{{ exp.position }}</h3>
          <span class="item-date">{{ exp.duration }}</span>
        </div>
        <p class="item-subtitle">{{ exp.company }}</p>
        <p>{{ exp.description }}</p>
      </div>
      {% endfor %}
    </div>
    {% endif %}
    
    {% if education and education|length > 0 %}
    <div class="section">
      <h2 class="section-title">Education</h2>
      {% for edu in education %}
      <div class="education-item">
        <div class="item-header">
          <h3 class="item-title">{{ edu.degree }}</h3>
          <span class="item-date">{{ edu.duration }}</span>
        </div>
        <p class="item-subtitle">{{ edu.school }}</p>
        {% if edu.description %}
        <p>{{ edu.description }}</p>
        {% endif %}
      </div>
      {% endfor %}
    </div>
    {% endif %}
    
    {% if skills and skills|length > 0 %}
    <div class="section">
      <h2 class="section-title">Skills</h2>
      <div class="skills-section">
        {% for skill in skills %}
        <div class="skill-item">{{ skill }}</div>
        {% endfor %}
      </div>
    </div>
    {% endif %}
    
    {% if languages and languages|length > 0 %}
    <div class="section">
      <h2 class="section-title">Languages</h2>
      <div class="languages-section">
        {% for language in languages %}
        <div class="language-item">
          <span class="language-name">{{ language }}</span>
        </div>
        {% endfor %}
      </div>
    </div>
    {% endif %}
  </div>
</body>
</html>`
  },
  {
    id: 'street-hustler',
    name: 'Street Hustler',
    description: 'A high-energy design with vibrant colors and street-style typography for creative fields.',
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>{{ name }} - CV</title>
  <style>
    body {
      font-family: 'Poppins', sans-serif;
      margin: 0;
      padding: 0;
      color: #333;
      background-color: #f3f4f6;
      line-height: 1.5;
    }
    .cv-container {
      max-width: 850px;
      margin: 30px auto;
      position: relative;
    }
    .header {
      background: linear-gradient(45deg, #6c63ff, #ff6584);
      padding: 40px;
      border-radius: 10px 10px 0 0;
      color: white;
      position: relative;
      overflow: hidden;
    }
    .header:before {
      content: '';
      position: absolute;
      top: -50px;
      right: -50px;
      width: 150px;
      height: 150px;
      background: rgba(255,255,255,0.1);
      border-radius: 50%;
    }
    .header:after {
      content: '';
      position: absolute;
      bottom: -70px;
      left: -70px;
      width: 200px;
      height: 200px;
      background: rgba(255,255,255,0.1);
      border-radius: 50%;
    }
    h1 {
      margin: 0;
      font-size: 42px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      position: relative;
      z-index: 1;
    }
    .title {
      font-size: 18px;
      font-weight: 400;
      margin-top: 8px;
      position: relative;
      z-index: 1;
    }
    .contact-info {
      margin-top: 25px;
      display: flex;
      flex-wrap: wrap;
      gap: 15px 30px;
      position: relative;
      z-index: 1;
    }
    .contact-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .main-content {
      background-color: white;
      padding: 40px;
      border-radius: 0 0 10px 10px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.05);
    }
    .section {
      margin-bottom: 35px;
    }
    .section-title {
      color: #6c63ff;
      font-size: 24px;
      margin-top: 0;
      margin-bottom: 20px;
      text-transform: uppercase;
      letter-spacing: 1px;
      display: flex;
      align-items: center;
    }
    .section-title:after {
      content: '';
      flex-grow: 1;
      height: 1px;
      background-color: #e5e7eb;
      margin-left: 15px;
    }
    .experience-item, .education-item {
      margin-bottom: 25px;
      position: relative;
      padding-left: 20px;
      border-left: 2px solid #e5e7eb;
    }
    .experience-item:before, .education-item:before {
      content: '';
      position: absolute;
      width: 14px;
      height: 14px;
      background-color: #6c63ff;
      border-radius: 50%;
      top: 5px;
      left: -8px;
    }
    .item-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .item-title {
      font-weight: 600;
      color: #222;
      margin: 0;
      font-size: 18px;
    }
    .item-date {
      color: #6c63ff;
      font-weight: 500;
      font-size: 14px;
    }
    .item-subtitle {
      font-size: 16px;
      color: #444;
      margin: 0 0 10px;
    }
    .skills-container {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .skill-item {
      background-color: #f9f9fb;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      color: #6c63ff;
      font-weight: 500;
      border: 1px solid #e5e7eb;
    }
    .languages-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 15px;
    }
    .language-item {
      background-color: #f9f9fb;
      padding: 15px;
      border-radius: 8px;
      text-align: center;
    }
    .language-name {
      font-weight: 600;
      color: #444;
    }
  </style>
</head>
<body>
  <div class="cv-container">
    <div class="header">
      <h1>{{ name }}</h1>
      <p class="title">{{ title }}</p>
      <div class="contact-info">
        <div class="contact-item">{{ email }}</div>
        {% if phone %}
        <div class="contact-item">{{ phone }}</div>
        {% endif %}
        {% if location %}
        <div class="contact-item">{{ location }}</div>
        {% endif %}
      </div>
    </div>
    
    <div class="main-content">
      {% if summary %}
      <div class="section">
        <h2 class="section-title">About Me</h2>
        <p>{{ summary }}</p>
      </div>
      {% endif %}
      
      {% if experience and experience|length > 0 %}
      <div class="section">
        <h2 class="section-title">Experience</h2>
        {% for exp in experience %}
        <div class="experience-item">
          <div class="item-header">
            <h3 class="item-title">{{ exp.position }}</h3>
            <span class="item-date">{{ exp.duration }}</span>
          </div>
          <p class="item-subtitle">{{ exp.company }}</p>
          <p>{{ exp.description }}</p>
        </div>
        {% endfor %}
      </div>
      {% endif %}
      
      {% if education and education|length > 0 %}
      <div class="section">
        <h2 class="section-title">Education</h2>
        {% for edu in education %}
        <div class="education-item">
          <div class="item-header">
            <h3 class="item-title">{{ edu.degree }}</h3>
            <span class="item-date">{{ edu.duration }}</span>
          </div>
          <p class="item-subtitle">{{ edu.school }}</p>
          {% if edu.description %}
          <p>{{ edu.description }}</p>
          {% endif %}
        </div>
        {% endfor %}
      </div>
      {% endif %}
      
      {% if skills and skills|length > 0 %}
      <div class="section">
        <h2 class="section-title">Skills</h2>
        <div class="skills-container">
          {% for skill in skills %}
          <div class="skill-item">{{ skill }}</div>
          {% endfor %}
        </div>
      </div>
      {% endif %}
      
      {% if languages and languages|length > 0 %}
      <div class="section">
        <h2 class="section-title">Languages</h2>
        <div class="languages-container">
          {% for language in languages %}
          <div class="language-item">
            <div class="language-name">{{ language }}</div>
          </div>
          {% endfor %}
        </div>
      </div>
      {% endif %}
    </div>
  </div>
</body>
</html>`
  },
  {
    id: 'big-boss',
    name: 'Big Boss',
    description: 'A powerful, executive-style template that conveys authority and experience.',
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>{{ name }} - CV</title>
  <style>
    body {
      font-family: 'Times New Roman', serif;
      margin: 0;
      padding: 0;
      color: #333;
      background-color: #f9f9f9;
      line-height: 1.6;
    }
    .cv-container {
      max-width: 850px;
      margin: 30px auto;
      background-color: white;
      box-shadow: 0 0 20px rgba(0,0,0,0.1);
      border: 1px solid #e0e0e0;
    }
    .header {
      padding: 40px;
      border-bottom: 5px solid #333;
      text-align: center;
    }
    h1 {
      margin: 0;
      font-size: 34px;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .title {
      font-size: 18px;
      margin-top: 10px;
      font-style: italic;
    }
    .contact-info {
      margin-top: 20px;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 30px;
    }
    .main-content {
      padding: 40px;
    }
    .section {
      margin-bottom: 35px;
    }
    .section-title {
      font-size: 22px;
      border-bottom: 2px solid #333;
      padding-bottom: 10px;
      margin-bottom: 20px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .experience-item, .education-item {
      margin-bottom: 25px;
    }
    .item-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .item-title {
      font-weight: bold;
      margin: 0;
      font-size: 18px;
    }
    .item-date {
      font-style: italic;
    }
    .item-subtitle {
      margin: 5px 0 10px;
      font-weight: bold;
    }
    .item-description {
      text-align: justify;
    }
    .skills-section {
      column-count: 2;
      column-gap: 30px;
    }
    .skill-item {
      margin-bottom: 10px;
      break-inside: avoid;
    }
    .languages-section {
      column-count: 2;
      column-gap: 30px;
    }
    .language-item {
      margin-bottom: 10px;
      break-inside: avoid;
    }
  </style>
</head>
<body>
  <div class="cv-container">
    <div class="header">
      <h1>{{ name }}</h1>
      <p class="title">{{ title }}</p>
      <div class="contact-info">
        <div>{{ email }}</div>
        {% if phone %}
        <div>{{ phone }}</div>
        {% endif %}
        {% if location %}
        <div>{{ location }}</div>
        {% endif %}
      </div>
    </div>
    
    <div class="main-content">
      {% if summary %}
      <div class="section">
        <h2 class="section-title">Executive Summary</h2>
        <p class="item-description">{{ summary }}</p>
      </div>
      {% endif %}
      
      {% if experience and experience|length > 0 %}
      <div class="section">
        <h2 class="section-title">Professional Experience</h2>
        {% for exp in experience %}
        <div class="experience-item">
          <div class="item-header">
            <h3 class="item-title">{{ exp.position }}</h3>
            <span class="item-date">{{ exp.duration }}</span>
          </div>
          <p class="item-subtitle">{{ exp.company }}</p>
          <p class="item-description">{{ exp.description }}</p>
        </div>
        {% endfor %}
      </div>
      {% endif %}
      
      {% if education and education|length > 0 %}
      <div class="section">
        <h2 class="section-title">Education</h2>
        {% for edu in education %}
        <div class="education-item">
          <div class="item-header">
            <h3 class="item-title">{{ edu.degree }}</h3>
            <span class="item-date">{{ edu.duration }}</span>
          </div>
          <p class="item-subtitle">{{ edu.school }}</p>
          {% if edu.description %}
          <p class="item-description">{{ edu.description }}</p>
          {% endif %}
        </div>
        {% endfor %}
      </div>
      {% endif %}
      
      {% if skills and skills|length > 0 %}
      <div class="section">
        <h2 class="section-title">Core Competencies</h2>
        <div class="skills-section">
          {% for skill in skills %}
          <div class="skill-item">• {{ skill }}</div>
          {% endfor %}
        </div>
      </div>
      {% endif %}
      
      {% if languages and languages|length > 0 %}
      <div class="section">
        <h2 class="section-title">Languages</h2>
        <div class="languages-section">
          {% for language in languages %}
          <div class="language-item">• {{ language }}</div>
          {% endfor %}
        </div>
      </div>
      {% endif %}
    </div>
  </div>
</body>
</html>`
  }
];

// Function to create templates
async function createTemplates() {
  console.log('Starting template creation process...');
  
  try {
    // Create each template file
    for (const template of templates) {
      const templatePath = path.join(templatesDir, `${template.id}.html`);
      fs.writeFileSync(templatePath, template.html, 'utf8');
      console.log(`Created template file: ${template.id}.html`);
    }
    
    console.log('Template creation complete. Template files are ready to be served by the API.');
    console.log(`Templates are available in: ${templatesDir}`);
  } catch (error) {
    console.error('Error creating templates:', error);
  }
}

// Execute the template creation function
createTemplates().catch(console.error);
