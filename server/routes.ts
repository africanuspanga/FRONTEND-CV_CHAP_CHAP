import type { Express } from "express";
import { createServer, type Server } from "http";
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import crypto from 'crypto';
import { openaiProxyHandler } from './openai-proxy';
import { registerTemplateAPI } from './template-api';
import { cvScreenerProxyHandler } from './cv-screener-proxy';

// In-memory storage for CV requests
interface CVRequest {
  id: string;
  templateId: string;
  cvData: any;
  status: 'pending_payment' | 'verifying_payment' | 'generating_pdf' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
  error?: string;
}

const cvRequests: Record<string, CVRequest> = {};

// Configure multer for form-data parsing
const upload = multer();

export function registerRoutes(app: Express): Server {
  // Register template API
  registerTemplateAPI(app);

  // API key status endpoint
  app.get("/api/keys/status", (req, res) => {
    res.status(200).json({
      openai: !!process.env.OPENAI_API_KEY
    });
  });

  // Health check endpoint
  app.get("/api/cv-pdf/health", (req, res) => {
    res.status(200).json({
      status: "ok",
      message: "CV Chap Chap API is online",
      version: "1.0.0",
      timestamp: new Date().toISOString()
    });
  });
  // API route for initiating USSD payment
  app.post("/api/cv-pdf/anonymous/initiate-ussd", async (req, res) => {
    try {
      const { template_id, cv_data } = req.body;
      
      if (!template_id || !cv_data) {
        return res.status(400).json({ 
          success: false, 
          error: 'Missing required parameters: template_id or cv_data' 
        });
      }
      
      // Generate unique request ID
      const requestId = uuidv4();
      
      // Store CV request
      cvRequests[requestId] = {
        id: requestId,
        templateId: template_id,
        cvData: cv_data,
        status: 'pending_payment',
        createdAt: new Date()
      };
      
      // Return success response
      res.status(200).json({
        success: true,
        request_id: requestId
      });
    } catch (error: any) {
      console.error('Error initiating payment:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error'
      });
    }
  });

  // API route for verifying payment
  app.post("/api/cv-pdf/:requestId/verify", upload.none(), async (req, res) => {
    try {
      const { requestId } = req.params;
      const { payment_message } = req.body;
      
      // Check if request exists
      const request = cvRequests[requestId];
      if (!request) {
        return res.status(404).json({
          success: false,
          error: 'Request not found'
        });
      }
      
      // Check if payment message is provided
      if (!payment_message) {
        return res.status(400).json({
          success: false,
          error: 'Payment message is required'
        });
      }
      
      // Verify payment message (simplified for mock server)
      if (!payment_message.includes('DRIFTMARK TECHNOLOGI') || 
          !payment_message.includes('61115073') ||
          !payment_message.includes('Selcom Pay')) {
        return res.status(400).json({
          success: false,
          error: 'Invalid payment message'
        });
      }
      
      // Update request status
      request.status = 'verifying_payment';
      
      // Simulate processing (in a real implementation, this would be a background job)
      setTimeout(() => {
        // Update to generating PDF after verification
        if (request && request.status === 'verifying_payment') {
          request.status = 'generating_pdf';
          
          // Simulate PDF generation
          setTimeout(() => {
            if (request) {
              request.status = 'completed';
              request.completedAt = new Date();
            }
          }, 5000); // 5 seconds to generate PDF
        }
      }, 3000); // 3 seconds to verify payment
      
      // Return success response
      res.status(200).json({
        success: true
      });
    } catch (error: any) {
      console.error('Error verifying payment:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error'
      });
    }
  });

  // API route for checking payment status
  app.get("/api/cv-pdf/:requestId/status", (req, res) => {
    try {
      const { requestId } = req.params;
      
      // Check if request exists
      const request = cvRequests[requestId];
      if (!request) {
        return res.status(404).json({
          success: false,
          error: 'Request not found'
        });
      }
      
      // Return status
      res.status(200).json({
        status: request.status,
        request_id: request.id,
        created_at: request.createdAt.toISOString(),
        completed_at: request.completedAt?.toISOString(),
        error: request.error
      });
    } catch (error: any) {
      console.error('Error checking status:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error'
      });
    }
  });

  // OpenAI proxy endpoint
  app.post("/api/openai/proxy", openaiProxyHandler);
  
  // CV Screener API Proxy routes
  app.all("/cv-screener-proxy/*", upload.any(), (req, res) => {
    // Extract the path part after /cv-screener-proxy/
    const path = req.path.replace(/^\/cv-screener-proxy\//i, '');
    req.params.path = path;
    cvScreenerProxyHandler(req, res);
  });
  
  // CORS preflight for the proxy
  app.options("/cv-screener-proxy/*", (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, X-Prefer-JSON-Response');
    res.status(200).send();
  });

  // API route for previewing CV PDF - proxies to CV Screener API
  app.post("/api/preview-cv-pdf", async (req, res) => {
    try {
      // Extract data from request body
      const { template_id, cv_data } = req.body;
      
      if (!template_id) {
        return res.status(400).json({
          success: false,
          error: 'Missing required parameter: template_id'
        });
      }
      
      // Forward the request to the CV Screener service via our proxy
      // This avoids CORS issues and uses the proper authentication
      console.log(`Forwarding preview request for template: ${template_id}`);
      
      // Set up the proxy request parameters
      req.params.path = `preview-template/${template_id}`;
      
      // Forward the request to the CV Screener proxy
      await cvScreenerProxyHandler(req, res);
      
      // The proxy handles the response, so we don't need to do anything else here
    } catch (error: any) {
      console.error('Error forwarding PDF preview request:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error'
      });
    }
  });

  // API route for downloading PDF
  app.get("/api/cv-pdf/:requestId/download", (req, res) => {
    try {
      const { requestId } = req.params;
      
      // Check if request exists
      const request = cvRequests[requestId];
      if (!request) {
        return res.status(404).json({
          success: false,
          error: 'Request not found'
        });
      }
      
      // Check if PDF is ready for download
      if (request.status !== 'completed') {
        return res.status(400).json({
          success: false,
          error: `PDF is not ready for download. Current status: ${request.status}`
        });
      }
      
      // Generate a sample PDF (just a text file with PDF extension for the mock)
      const samplePDF = Buffer.from('This is a sample PDF file generated by the mock server.');
      
      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="cv_${requestId}.pdf"`);
      res.setHeader('Content-Length', samplePDF.length);
      
      // Send the sample PDF
      res.status(200).send(samplePDF);
    } catch (error: any) {
      console.error('Error downloading PDF:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error'
      });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  
  return httpServer;
}
