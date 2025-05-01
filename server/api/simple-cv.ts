import type { Request, Response } from 'express';
import { storage } from '../storage';
import { cvDataSchema } from '@shared/schema';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

/**
 * Create new CV
 */
export async function createCV(req: Request, res: Response) {
  try {
    // Parse CV data from request
    console.log('Request body:', JSON.stringify(req.body));
    const cvData = req.body.cvData ? JSON.parse(req.body.cvData) : null;
    console.log('Parsed CV data:', cvData);
    const data = cvDataSchema.parse(cvData);
    console.log('Validated data:', data);
    const templateId = z.string().parse(req.body.templateId);
    
    // Generate a UUID for the CV
    const cvId = uuidv4();
    
    // Create CV without user association for testing
    const cv = await storage.createCV({
      userId: undefined, // Using undefined instead of null to match the type
      templateId,
      cvData: JSON.stringify(data),
    });

    res.status(201).json(cv);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Invalid CV data', 
        errors: error.errors 
      });
    }
    console.error('Error creating CV:', error);
    res.status(500).json({ message: 'Failed to create CV' });
  }
}

/**
 * Get CV by ID
 */
export async function getCV(req: Request, res: Response) {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: 'CV ID is required' });
    }

    const cv = await storage.getCV(id);
    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }
    
    res.json(cv);
  } catch (error) {
    console.error('Error fetching CV:', error);
    res.status(500).json({ message: 'Failed to fetch CV' });
  }
}

/**
 * Get all CVs
 */
export async function getAllCVs(req: Request, res: Response) {
  try {
    const cvs = await storage.getAllCVs();
    res.json(cvs);
  } catch (error) {
    console.error('Error fetching CVs:', error);
    res.status(500).json({ message: 'Failed to fetch CVs' });
  }
}

/**
 * Get CV preview data
 */
export async function getCVPreview(req: Request, res: Response) {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: 'CV ID is required' });
    }

    // Get CV data
    const cv = await storage.getCV(id);
    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }
    
    // Get template data
    if (!cv.templateId) {
      return res.status(400).json({ message: 'CV has no template associated with it' });
    }
    
    const template = await storage.getTemplate(cv.templateId);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    // Return preview data
    res.json({
      cv,
      template
    });
  } catch (error) {
    console.error('Error generating CV preview:', error);
    res.status(500).json({ message: 'Failed to generate CV preview' });
  }
}
