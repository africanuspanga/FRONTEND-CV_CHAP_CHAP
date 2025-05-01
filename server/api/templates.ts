import type { Request, Response } from 'express';
import { storage } from '../storage';
import { insertTemplateSchema } from '@shared/schema';
import { z } from 'zod';

/**
 * Get all templates
 */
export async function getAllTemplates(req: Request, res: Response) {
  try {
    const templates = await storage.getAllTemplates();
    res.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ message: 'Failed to fetch templates' });
  }
}

/**
 * Get template by ID
 */
export async function getTemplateById(req: Request, res: Response) {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: 'Template ID is required' });
    }

    const template = await storage.getTemplate(id);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    res.json(template);
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({ message: 'Failed to fetch template' });
  }
}

/**
 * Create new template (admin only)
 */
export async function createTemplate(req: Request, res: Response) {
  try {
    // Admin check
    if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized: Admin access required' });
    }

    const templateData = insertTemplateSchema.parse(req.body);
    
    const template = await storage.createTemplate({
      name: templateData.name,
      description: templateData.description,
      html_content: templateData.html_content,
      css_content: templateData.css_content,
      preview_image: templateData.preview_image,
      is_default: templateData.is_default ?? false
    });

    res.status(201).json(template);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Invalid template data', 
        errors: error.errors 
      });
    }
    console.error('Error creating template:', error);
    res.status(500).json({ message: 'Failed to create template' });
  }
}

/**
 * Update template by ID (admin only)
 */
export async function updateTemplate(req: Request, res: Response) {
  try {
    // Admin check
    if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized: Admin access required' });
    }

    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: 'Template ID is required' });
    }

    const updateData = insertTemplateSchema.partial().parse(req.body);
    
    const updatedTemplate = await storage.updateTemplate(id, updateData);

    if (!updatedTemplate) {
      return res.status(404).json({ message: 'Template not found' });
    }

    res.json(updatedTemplate);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Invalid template data', 
        errors: error.errors 
      });
    }
    console.error('Error updating template:', error);
    res.status(500).json({ message: 'Failed to update template' });
  }
}

/**
 * Delete template by ID (admin only)
 */
export async function deleteTemplate(req: Request, res: Response) {
  try {
    // Admin check
    if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized: Admin access required' });
    }

    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: 'Template ID is required' });
    }

    const result = await storage.deleteTemplate(id);
    if (!result) {
      return res.status(404).json({ message: 'Template not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({ message: 'Failed to delete template' });
  }
}
