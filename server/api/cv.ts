import type { Request, Response } from 'express';
import { storage } from '../storage';
import { insertCVSchema, cvDataSchema } from '@shared/schema';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

/**
 * Get CV by ID
 */
export async function getCVById(req: Request, res: Response) {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: 'CV ID is required' });
    }

    // If user is authenticated, check ownership
    if (req.isAuthenticated() && req.user) {
      const cv = await storage.getCV(id);
      
      if (!cv) {
        return res.status(404).json({ message: 'CV not found' });
      }
      
      // If CV has a userId, check if it belongs to the current user
      if (cv.userId && cv.userId !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized: This CV belongs to another user' });
      }
      
      return res.json(cv);
    } else {
      // For anonymous users, only allow access to CVs without a userId
      const cv = await storage.getCV(id);
      
      if (!cv) {
        return res.status(404).json({ message: 'CV not found' });
      }
      
      if (cv.userId) {
        return res.status(403).json({ message: 'Unauthorized: Please log in to access this CV' });
      }
      
      return res.json(cv);
    }
  } catch (error) {
    console.error('Error fetching CV:', error);
    res.status(500).json({ message: 'Failed to fetch CV' });
  }
}

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
    
    // TODO: Implement proper authentication
    // For now, all CVs will be created without a user association for testing
    const userId = null; // req.isAuthenticated() && req.user ? req.user.id : null;
    
    const cv = await storage.createCV({
      userId,
      templateId,
      cvData: JSON.stringify(data),
      // Note: Other fields like status and payment_status would need to be added to the schema
      // if they're required
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
 * Update CV by ID
 */
export async function updateCV(req: Request, res: Response) {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: 'CV ID is required' });
    }

    // If user is authenticated, check ownership
    if (req.isAuthenticated() && req.user) {
      const existingCV = await storage.getCV(id);
      
      if (!existingCV) {
        return res.status(404).json({ message: 'CV not found' });
      }
      
      // If CV has a userId, check if it belongs to the current user
      if (existingCV.userId && existingCV.userId !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized: This CV belongs to another user' });
      }
    } else {
      // For anonymous users, only allow updates to CVs without a userId
      const existingCV = await storage.getCV(id);
      
      if (!existingCV) {
        return res.status(404).json({ message: 'CV not found' });
      }
      
      if (existingCV.userId) {
        return res.status(403).json({ message: 'Unauthorized: Please log in to update this CV' });
      }
    }

    // Parse CV data from request
    const cvData = req.body.cvData ? JSON.parse(req.body.cvData) : null;
    const data = cvDataSchema.parse(cvData);
    const templateId = z.string().parse(req.body.templateId);
    
    const updatedCV = await storage.updateCV(id, {
      templateId,
      cvData: JSON.stringify(data)
      // Other fields like status would need to be added to the schema if required
    });

    if (!updatedCV) {
      return res.status(404).json({ message: 'CV not found' });
    }

    res.json(updatedCV);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Invalid CV data', 
        errors: error.errors 
      });
    }
    console.error('Error updating CV:', error);
    res.status(500).json({ message: 'Failed to update CV' });
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
    
    // Check access permission
    if (req.isAuthenticated() && req.user) {
      // If CV has a userId, check if it belongs to the current user
      if (cv.userId && cv.userId !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized: This CV belongs to another user' });
      }
    } else {
      // For anonymous users, only allow access to CVs without a userId
      if (cv.userId) {
        return res.status(403).json({ message: 'Unauthorized: Please log in to access this CV' });
      }
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

/**
 * Get HTML preview for CV
 */
export async function getHTMLPreview(req: Request, res: Response) {
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
    
    // Check access permission
    if (req.isAuthenticated() && req.user) {
      // If CV has a userId, check if it belongs to the current user
      if (cv.userId && cv.userId !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized: This CV belongs to another user' });
      }
    } else {
      // For anonymous users, only allow access to CVs without a userId
      if (cv.userId) {
        return res.status(403).json({ message: 'Unauthorized: Please log in to access this CV' });
      }
    }

    // Get template data
    if (!cv.templateId) {
      return res.status(400).json({ message: 'CV has no template associated with it' });
    }
    
    const template = await storage.getTemplate(cv.templateId);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    // Generate HTML by injecting CV data into template
    let htmlContent = template.htmlContent;
    
    // This is a simplified version - in production you would use a proper template engine
    // Parse the JSON-stored CV data
    const parsedData = JSON.parse(cv.cvData);
    
    // Return HTML content with CSS
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${parsedData.personalInfo?.firstName || ''} ${parsedData.personalInfo?.lastName || ''} - CV</title>
        <style>${template.cssContent}</style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Error generating HTML preview:', error);
    res.status(500).json({ message: 'Failed to generate HTML preview' });
  }
}

/**
 * Check payment status for CV
 */
export async function checkPaymentStatus(req: Request, res: Response) {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: 'CV ID is required' });
    }

    // Ensure user has permission to access this CV
    if (req.isAuthenticated()) {
      const cv = await storage.getCV(id);
      if (!cv) {
        return res.status(404).json({ message: 'CV not found' });
      }
      
      // Check if this CV belongs to the user
      if (cv.userId && cv.userId !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      
      // Check payment status
      const paymentStatus = await storage.checkPaymentStatus(id, req.user.id);
      return res.json(paymentStatus);
    } else {
      // For anonymous users
      const cv = await storage.getCV(id);
      if (!cv) {
        return res.status(404).json({ message: 'CV not found' });
      }
      
      if (cv.userId) {
        return res.status(403).json({ message: 'Unauthorized: Please log in to check payment status' });
      }
      
      // Anonymous users should make a payment
      const paymentStatus = {
        status: 'unpaid',
        hasPayment: false,
        paymentUrl: `/api/payments/create?cvId=${id}` // Frontend should handle this URL
      };
      
      return res.json(paymentStatus);
    }
  } catch (error) {
    console.error('Error checking payment status:', error);
    res.status(500).json({ message: 'Failed to check payment status' });
  }
}

/**
 * Generate PDF for CV
 */
export async function generatePDF(req: Request, res: Response) {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: 'CV ID is required' });
    }

    // Ensure user has permission to access this CV
    if (req.isAuthenticated()) {
      const cv = await storage.getCV(id);
      if (!cv) {
        return res.status(404).json({ message: 'CV not found' });
      }
      
      // Check if this CV belongs to the user
      if (cv.userId && cv.userId !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      
      // Check payment status
      const paymentStatus = await storage.checkPaymentStatus(id, req.user.id);
      if (!paymentStatus.hasPayment) {
        return res.status(402).json({ 
          message: 'Payment required', 
          paymentUrl: paymentStatus.paymentUrl 
        });
      }
      
      // Mock PDF generation (would use html2pdf or similar in production)
      // This would be an async process in production
      const taskId = uuidv4();
      
      // Return a task ID for the client to poll
      return res.json({ 
        taskId,
        message: 'PDF generation started',
        statusUrl: `/api/cv/${id}/document-status/${taskId}`
      });
    } else {
      // For anonymous users
      const cv = await storage.getCV(id);
      if (!cv) {
        return res.status(404).json({ message: 'CV not found' });
      }
      
      if (cv.userId) {
        return res.status(403).json({ message: 'Unauthorized: Please log in to generate PDF' });
      }
      
      // Anonymous users need to make a payment
      return res.status(402).json({ 
        message: 'Payment required', 
        paymentUrl: `/api/payments/create?cvId=${id}` 
      });
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ message: 'Failed to generate PDF' });
  }
}

/**
 * Check document generation status
 */
export async function checkDocumentStatus(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const taskId = req.params.taskId;
    
    if (!id || !taskId) {
      return res.status(400).json({ message: 'CV ID and task ID are required' });
    }

    // In a real app, this would check a task queue
    // For now, just simulate a completed task
    
    // Ensure user has permission to access this CV
    if (req.isAuthenticated()) {
      const cv = await storage.getCV(id);
      if (!cv) {
        return res.status(404).json({ message: 'CV not found' });
      }
      
      // Check if this CV belongs to the user
      if (cv.userId && cv.userId !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      
      // Simulate a completed PDF generation
      // In production, this would check a task queue system
      return res.json({
        status: 'completed',
        downloadUrl: `/api/download/${id}/${taskId}` // Frontend should handle this URL
      });
    } else {
      // For anonymous users
      const cv = await storage.getCV(id);
      if (!cv) {
        return res.status(404).json({ message: 'CV not found' });
      }
      
      if (cv.userId) {
        return res.status(403).json({ message: 'Unauthorized: Please log in to check document status' });
      }
      
      // Simulate a completed PDF generation
      return res.json({
        status: 'completed',
        downloadUrl: `/api/download/${id}/${taskId}` // Frontend should handle this URL
      });
    }
  } catch (error) {
    console.error('Error checking document status:', error);
    res.status(500).json({ message: 'Failed to check document status' });
  }
}
