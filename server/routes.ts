import type { Express } from "express";
import { createServer, type Server } from "http";
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import crypto from 'crypto';
import { openaiProxyHandler } from './openai-proxy';
import { registerTemplateAPI } from './template-api';
import { cvScreenerProxyHandler } from './cv-screener-proxy';
import { setupAuth } from './auth-proxy';
import * as fs from 'fs/promises';
import * as path from 'path';

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

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  await setupAuth(app);
  
  // Register template API
  registerTemplateAPI(app);

  // Direct sitemap and robots handling with raw response writing  
  
  // Serve sitemap.xml with the correct content type
  app.get("/sitemap.xml", (req, res) => {
    // Write raw XML response with proper headers
    res.writeHead(200, {
      'Content-Type': 'application/xml; charset=UTF-8',
      'X-Robots-Tag': 'noindex, follow',
      'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate'
    });
    
    // Create XML content directly instead of reading from file
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://cvchapchap.com/</loc>
    <lastmod>2025-05-12</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://cvchapchap.com/cv/select-template</loc>
    <lastmod>2025-05-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://cvchapchap.com/cv/personal-info</loc>
    <lastmod>2025-05-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://cvchapchap.com/cv/work-experience</loc>
    <lastmod>2025-05-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://cvchapchap.com/cv/education</loc>
    <lastmod>2025-05-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://cvchapchap.com/cv/skills</loc>
    <lastmod>2025-05-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://cvchapchap.com/faq</loc>
    <lastmod>2025-05-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://cvchapchap.com/about</loc>
    <lastmod>2025-05-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`;
    
    // Send the XML content directly
    res.end(xml);
    
    console.log('Served sitemap.xml with direct XML content-type');
  });
  
  // Serve robots.txt with the correct content type
  app.get("/robots.txt", (req, res) => {
    // Write raw text response with proper headers
    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=UTF-8',
      'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate'
    });
    
    // Create content directly
    const robotsTxt = `# Allow all crawlers to access all content
User-agent: *
Allow: /

# Point to the sitemap
Sitemap: https://cvchapchap.com/sitemap.xml`;
    
    // Send the text content directly
    res.end(robotsTxt);
    
    console.log('Served robots.txt with direct text/plain content-type');
  });
  
  // Prevent other URLs from being interpreted as sitemaps
  app.use((req, res, next) => {
    const userAgent = req.get('User-Agent') || '';
    
    // Search bot detection
    if (userAgent.includes('Google') || 
        userAgent.includes('bot') || 
        userAgent.includes('crawl') || 
        userAgent.includes('Spider') ||
        userAgent.includes('spider')) {
      
      console.log(`Bot detected: ${userAgent} - Path: ${req.path}`);
      
      // Handle any potential sitemap validation attempt
      if (req.path.includes('sitemap') && req.path !== '/sitemap.xml') {
        console.log(`Blocking incorrect sitemap path: ${req.path}`);
        return res.status(404).send('Not found');
      }
    }
    
    next();
  });

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

  // Create a dedicated route to forward requests to the CV Screener API
  app.use('/cv-screener-proxy/:path', async (req, res) => {
    try {
      const basePath = req.params.path || '';
      
      // Set up URL and query parameters
      const apiUrl = `https://cv-screener-africanuspanga.replit.app/${basePath}`;
      let fullUrl = apiUrl;
      
      // Add query parameters if any
      if (Object.keys(req.query).length > 0) {
        const queryString = new URLSearchParams(req.query as Record<string, string>).toString();
        fullUrl = `${apiUrl}?${queryString}`;
      }
      
      console.log(`[CV Screener Proxy] Forwarding request to: ${fullUrl}`);
      console.log(`[CV Screener Proxy] Method: ${req.method}`);
      
      // Create appropriate fetch options
      const fetchOptions: any = {
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': req.headers.accept || '*/*',
          'User-Agent': 'CV-Chap-Chap-App'
        }
      };
      
      // Add body for non-GET requests
      if (req.method !== 'GET' && req.body) {
        fetchOptions.body = JSON.stringify(req.body);
        console.log(`[CV Screener Proxy] Request body:`, JSON.stringify(req.body).substring(0, 200) + '...');
      }
      
      // Make the request to the CV Screener API
      const response = await fetch(fullUrl, fetchOptions);
      
      // Set headers from the response
      const contentType = response.headers.get('content-type');
      if (contentType) {
        res.setHeader('Content-Type', contentType);
      }
      
      // Send the response data
      const data = await response.arrayBuffer();
      res.status(response.status).send(Buffer.from(data));
      
    } catch (error: any) {
      console.error('[CV Screener Proxy] Error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error while proxying to CV Screener API'
      });
    }
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
      
      // Forward the request to the CV Screener service directly
      // This avoids CORS issues and uses the proper authentication
      console.log(`Forwarding preview request for template: ${template_id}`);
      
      const apiUrl = `https://cv-screener-africanuspanga.replit.app/preview-template/${template_id}`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'CV-Chap-Chap-App'
        },
        body: JSON.stringify({ cv_data })
      });
      
      // Check if the response was successful
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`CV Screener API error (${response.status}): ${errorText}`);
        return res.status(response.status).json({
          success: false,
          error: `CV Screener API error: ${response.statusText}`
        });
      }
      
      // Forward the response to the client
      const contentType = response.headers.get('content-type');
      if (contentType) {
        res.setHeader('Content-Type', contentType);
      }
      
      const data = await response.arrayBuffer();
      res.status(response.status).send(Buffer.from(data));
      
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
  
  // New simplified endpoint for generating and downloading PDFs directly
  app.post("/api/generate-and-download", async (req, res) => {
    try {
      // Extract data from request body
      const { template_id, cv_data } = req.body;
      
      if (!template_id) {
        return res.status(400).json({
          success: false,
          error: 'Missing required parameter: template_id'
        });
      }
      
      // Validate cv_data exists
      if (!cv_data) {
        return res.status(400).json({
          success: false,
          error: 'Missing required parameter: cv_data object'
        });
      }
      
      // Make sure cv_data has the minimum required fields
      if (!cv_data.name || !cv_data.email || !cv_data.personalInfo) {
        return res.status(400).json({
          success: false,
          error: 'cv_data must include name, email, and personalInfo'
        });
      }
      
      console.log(`Generating PDF for template: ${template_id}`);
      
      // Use the new simplified API endpoint
      const apiUrl = `https://d04ef60e-f3c3-48d8-b8be-9ad9e052ce72-00-2mxe1kvkj9bcx.picard.replit.dev/api/generate-and-download`;
      
      // Make the request to the PDF API
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/pdf',
          'User-Agent': 'CV-Chap-Chap-App'
        },
        body: JSON.stringify({
          template_id,
          cv_data
        })
      });
      
      // Check if the response was successful
      if (!response.ok) {
        let errorText = '';
        try {
          // Try to parse as JSON first
          const errorJson = await response.json();
          errorText = errorJson.error || response.statusText;
        } catch {
          // If not JSON, get as text
          errorText = await response.text();
        }
        
        console.error(`PDF generation API error (${response.status}): ${errorText}`);
        return res.status(response.status).json({
          success: false,
          error: `PDF generation failed: ${errorText}`
        });
      }
      
      // Get content type from response
      const contentType = response.headers.get('content-type');
      if (contentType) {
        res.setHeader('Content-Type', contentType);
      } else {
        res.setHeader('Content-Type', 'application/pdf');
      }
      
      // Add download headers
      const filename = `cv_${template_id}_${Date.now()}.pdf`;
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      
      // Get the response as an array buffer and send it
      const data = await response.arrayBuffer();
      res.status(200).send(Buffer.from(data));
      
    } catch (error: any) {
      console.error('Error generating PDF:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error during PDF generation'
      });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  
  return httpServer;
}
