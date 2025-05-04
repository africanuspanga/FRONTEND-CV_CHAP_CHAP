import { Express, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Define interfaces for templates
interface Template {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory storage for templates (replace with database in production)
const templates: Record<string, Template> = {};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const templatesDir = path.join(process.cwd(), 'templates');
    
    // Create templates directory if it doesn't exist
    if (!fs.existsSync(templatesDir)) {
      fs.mkdirSync(templatesDir, { recursive: true });
    }
    
    cb(null, templatesDir);
  },
  filename: (req, file, cb) => {
    const templateId = req.body.id || uuidv4();
    cb(null, `${templateId}.html`);
  }
});

const upload = multer({ storage });

export function registerTemplateAPI(app: Express) {
  const templatesDir = path.join(process.cwd(), 'templates');
  
  // Create templates directory if it doesn't exist
  if (!fs.existsSync(templatesDir)) {
    fs.mkdirSync(templatesDir, { recursive: true });
  }

  // GET /api/templates - List all templates
  app.get('/api/templates', (req: Request, res: Response) => {
    try {
      const templateList = Object.values(templates);
      res.status(200).json(templateList);
    } catch (error) {
      console.error('Error listing templates:', error);
      res.status(500).json({ error: 'Failed to list templates' });
    }
  });

  // POST /api/templates - Create a new template
  app.post('/api/templates', upload.single('html_file'), (req: Request, res: Response) => {
    try {
      const { id, name, description } = req.body;
      
      if (!id || !name || !req.file) {
        return res.status(400).json({ error: 'Missing required fields: id, name, html_file' });
      }
      
      // Check if template already exists
      if (templates[id]) {
        return res.status(409).json({ error: `Template with ID '${id}' already exists` });
      }
      
      // Create new template
      const now = new Date();
      const template: Template = {
        id,
        name,
        description,
        createdAt: now,
        updatedAt: now
      };
      
      templates[id] = template;
      
      res.status(201).json(template);
    } catch (error) {
      console.error('Error creating template:', error);
      res.status(500).json({ error: 'Failed to create template' });
    }
  });

  // GET /api/templates/:id - Get template details
  app.get('/api/templates/:id', (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      // Check if template exists
      if (!templates[id]) {
        return res.status(404).json({ error: `Template with ID '${id}' not found` });
      }
      
      res.status(200).json(templates[id]);
    } catch (error) {
      console.error('Error getting template:', error);
      res.status(500).json({ error: 'Failed to get template' });
    }
  });

  // PUT /api/templates/:id - Update template
  app.put('/api/templates/:id', upload.single('html_file'), (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      
      // Check if template exists
      if (!templates[id]) {
        return res.status(404).json({ error: `Template with ID '${id}' not found` });
      }
      
      // Update template
      const template = templates[id];
      if (name) template.name = name;
      if (description !== undefined) template.description = description;
      template.updatedAt = new Date();
      
      res.status(200).json(template);
    } catch (error) {
      console.error('Error updating template:', error);
      res.status(500).json({ error: 'Failed to update template' });
    }
  });

  // GET /api/templates/:id/html - Get template HTML
  app.get('/api/templates/:id/html', (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      // Check if template exists
      if (!templates[id]) {
        return res.status(404).json({ error: `Template with ID '${id}' not found` });
      }
      
      const templateFilePath = path.join(templatesDir, `${id}.html`);
      
      // Check if template file exists
      if (!fs.existsSync(templateFilePath)) {
        return res.status(404).json({ error: `HTML file for template '${id}' not found` });
      }
      
      const html = fs.readFileSync(templateFilePath, 'utf-8');
      res.status(200).send(html);
    } catch (error) {
      console.error('Error getting template HTML:', error);
      res.status(500).json({ error: 'Failed to get template HTML' });
    }
  });

  // PUT /api/templates/:id/html - Update template HTML
  app.put('/api/templates/:id/html', upload.single('html_file'), (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      // Check if template exists
      if (!templates[id]) {
        return res.status(404).json({ error: `Template with ID '${id}' not found` });
      }
      
      if (!req.file) {
        return res.status(400).json({ error: 'Missing required HTML file' });
      }
      
      // Update template
      templates[id].updatedAt = new Date();
      
      res.status(200).json({ success: true, message: 'Template HTML updated successfully' });
    } catch (error) {
      console.error('Error updating template HTML:', error);
      res.status(500).json({ error: 'Failed to update template HTML' });
    }
  });

  // POST /api/templates/:id/test - Test template
  app.post('/api/templates/:id/test', (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      // Check if template exists
      if (!templates[id]) {
        return res.status(404).json({ error: `Template with ID '${id}' not found` });
      }
      
      // Sample data for testing
      const sampleData = {
        name: 'John Smith',
        title: 'Software Engineer',
        email: 'john.smith@example.com',
        phone: '+1 234 567 8910',
        location: 'Dar es Salaam, Tanzania',
        summary: 'Experienced software engineer with expertise in web development.',
        experience: [
          {
            position: 'Senior Developer',
            company: 'Tech Solutions Ltd',
            duration: '2020 - Present',
            description: 'Leading the development of enterprise software solutions.'
          }
        ],
        education: [
          {
            degree: 'BSc in Computer Science',
            school: 'University of Dar es Salaam',
            duration: '2015 - 2019',
            description: 'Graduated with honors.'
          }
        ],
        skills: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
        languages: ['English', 'Swahili']
      };
      
      // In a real implementation, we would render the template with the sample data
      // and generate a PDF. For this mock implementation, we'll just return success.
      res.status(200).json({
        success: true,
        message: 'Template test successful',
        template_id: id
      });
    } catch (error) {
      console.error('Error testing template:', error);
      res.status(500).json({ error: 'Failed to test template' });
    }
  });

  return app;
}
