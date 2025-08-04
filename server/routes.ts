import type { Express } from "express";
import { createServer, type Server } from "http";
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { openaiProxyHandler } from './openai-proxy';
import { registerTemplateAPI } from './template-api';
import { cvScreenerProxyHandler } from './cv-screener-proxy';
import { setupAuth } from './auth-proxy';
import * as fs from 'fs/promises';
import * as path from 'path';
import FormData from 'form-data';

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
const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/pdf',
      'text/html',
      'application/rtf',
      'text/plain'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only DOC, DOCX, PDF, HTML, RTF, and TXT files are allowed.'));
    }
  }
});

// In-memory storage for CV upload jobs
interface CVUploadJob {
  id: string;
  filename: string;
  status: 'uploading' | 'parsing' | 'completed' | 'failed';
  parsedData?: any;
  onboardingInsights?: any;
  error?: string;
  createdAt: Date;
}

const cvUploadJobs: Record<string, CVUploadJob> = {};

// Function to process uploaded CV using external API
async function processUploadedCV(jobId: string, file: Express.Multer.File) {
  const job = cvUploadJobs[jobId];
  if (!job) return;

  try {
    // Convert file buffer to base64
    const fileBase64 = file.buffer.toString('base64');
    
    // Call external CV parsing API
    const parseResponse = await fetch('https://d04ef60e-f3c3-48d8-b8be-9ad9e052ce72-00-2mxe1kvkj9bcx.picard.replit.dev/api/upload-cv-file', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file_content: fileBase64,
        file_name: file.originalname,
        file_type: file.mimetype
      })
    });

    if (!parseResponse.ok) {
      throw new Error(`CV parsing failed: ${parseResponse.statusText}`);
    }

    const parseResult = await parseResponse.json();
    
    if (parseResult.success && parseResult.cv_data) {
      // Generate onboarding insights using OpenAI
      const insights = await generateOnboardingInsights(parseResult.cv_data);
      
      job.parsedData = parseResult.cv_data;
      job.onboardingInsights = insights;
      job.status = 'completed';
      
      console.log(`CV parsing completed for job ${jobId}`);
    } else {
      throw new Error('Failed to parse CV: ' + (parseResult.error || 'Unknown error'));
    }
    
  } catch (error: any) {
    console.error(`CV parsing failed for job ${jobId}:`, error);
    job.error = error.message;
    job.status = 'failed';
  }
}

// Function to generate onboarding insights using OpenAI
async function generateOnboardingInsights(cvData: any) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const personalInfo = cvData.personalInfo || {};
    const workExperiences = cvData.workExperiences || [];
    const skills = cvData.skills || [];
    
    // Extract key information
    const currentJob = workExperiences.find((exp: any) => exp.current) || workExperiences[0];
    const currentJobTitle = currentJob?.jobTitle || personalInfo.professionalTitle || 'Professional';
    const currentCompany = currentJob?.company || 'your current organization';
    
    // Extract skills (handle both string array and object array)
    const keySkills = skills.slice(0, 3).map((skill: any) => 
      typeof skill === 'string' ? skill : skill.name || skill
    );
    
    // Generate insights using OpenAI
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a professional CV advisor. Generate personalized onboarding insights based on CV data. Respond with JSON format only.'
          },
          {
            role: 'user',
            content: `Analyze this CV data and provide insights: Job Title: ${currentJobTitle}, Company: ${currentCompany}, Skills: ${keySkills.join(', ')}. Return JSON with: currentJobTitle, currentCompany, keySkills (array), tailoredIndustrySuggestion, qualityFeedback (object with goodPoints and improvementPoints arrays)`
          }
        ],
        response_format: { type: "json_object" }
      })
    });

    if (!openaiResponse.ok) {
      throw new Error('OpenAI API call failed');
    }

    const openaiResult = await openaiResponse.json();
    const insights = JSON.parse(openaiResult.choices[0].message.content);
    
    // Ensure required structure
    return {
      currentJobTitle: insights.currentJobTitle || currentJobTitle,
      currentCompany: insights.currentCompany || currentCompany,
      keySkills: insights.keySkills || keySkills,
      tailoredIndustrySuggestion: insights.tailoredIndustrySuggestion || 'your field',
      qualityFeedback: {
        goodPoints: insights.qualityFeedback?.goodPoints || ['Professional formatting', 'Clear contact information'],
        improvementPoints: insights.qualityFeedback?.improvementPoints || ['Add more specific achievements', 'Include quantifiable results']
      }
    };
    
  } catch (error) {
    console.error('Failed to generate onboarding insights:', error);
    
    // Fallback insights
    return {
      currentJobTitle: cvData.personalInfo?.professionalTitle || 'Professional',
      currentCompany: 'your organization',
      keySkills: ['Communication', 'Problem-solving', 'Leadership'],
      tailoredIndustrySuggestion: 'your industry',
      qualityFeedback: {
        goodPoints: ['Professional formatting', 'Clear contact information'],
        improvementPoints: ['Add more specific achievements', 'Include quantifiable results']
      }
    };
  }
}

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
      
      // Clean and validate cv_data to prevent API errors
      const cleanedCVData = {
        ...cv_data,
        // Ensure all required fields exist and are properly formatted
        name: cv_data.name || `${cv_data.personalInfo?.firstName || ''} ${cv_data.personalInfo?.lastName || ''}`.trim() || 'Unknown',
        email: cv_data.email || cv_data.personalInfo?.email || 'example@email.com',
        personalInfo: {
          firstName: cv_data.personalInfo?.firstName || '',
          lastName: cv_data.personalInfo?.lastName || '',
          email: cv_data.personalInfo?.email || cv_data.email || 'example@email.com',
          phone: cv_data.personalInfo?.phone || '',
          professionalTitle: cv_data.personalInfo?.professionalTitle || 'Professional',
          address: cv_data.personalInfo?.address || '',
          summary: cv_data.personalInfo?.summary || '',
          ...cv_data.personalInfo
        },
        // Ensure arrays exist
        workExperiences: Array.isArray(cv_data.workExperiences) ? cv_data.workExperiences : [],
        workExp: Array.isArray(cv_data.workExp) ? cv_data.workExp : [],
        education: Array.isArray(cv_data.education) ? cv_data.education : [],
        skills: Array.isArray(cv_data.skills) ? cv_data.skills : [],
        languages: Array.isArray(cv_data.languages) ? cv_data.languages : [],
        references: Array.isArray(cv_data.references) ? cv_data.references : [],
        certifications: Array.isArray(cv_data.certifications) ? cv_data.certifications : [],
        projects: Array.isArray(cv_data.projects) ? cv_data.projects : [],
        websites: Array.isArray(cv_data.websites) ? cv_data.websites : [],
        accomplishments: Array.isArray(cv_data.accomplishments) ? cv_data.accomplishments : []
      };

      // Final validation
      if (!cleanedCVData.name || !cleanedCVData.email || !cleanedCVData.personalInfo) {
        return res.status(400).json({
          success: false,
          error: 'cv_data must include name, email, and personalInfo'
        });
      }
      
      console.log(`Generating PDF for template: ${template_id}`);
      console.log('Cleaned CV data keys:', Object.keys(cleanedCVData));
      
      // Use the production API endpoint
      const apiUrl = `https://cv-screener-africanuspanga.replit.app/api/generate-and-download`;
      
      // Make the request to the PDF API with cleaned data
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/pdf',
          'User-Agent': 'CV-Chap-Chap-App'
        },
        body: JSON.stringify({
          template_id,
          cv_data: cleanedCVData
        })
      });
      
      // Check if the response was successful
      if (!response.ok) {
        let errorText = '';
        try {
          // Try to get error details from response
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorJson = await response.json();
            errorText = errorJson.error || errorJson.message || response.statusText;
          } else {
            errorText = await response.text();
          }
        } catch (parseError) {
          // If we can't parse the error, use status text
          errorText = response.statusText || `HTTP ${response.status}`;
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

  // In-memory feedback storage (for testing phase)  
  const feedbackSubmissions: any[] = [];

  // Feedback submission endpoint for user testing
  app.post("/api/submit-feedback", upload.none(), async (req, res) => {
    console.log('Received feedback submission:', req.body);
    
    try {
      const { name, phone, review, templateId, cvName, submissionDate } = req.body;
      
      // Validate required fields
      if (!name || !phone || !review) {
        return res.status(400).json({
          success: false,
          error: 'Name, phone, and review are required'
        });
      }
      
      // Validate review length
      if (review.length < 10) {
        return res.status(400).json({
          success: false,
          error: 'Review must be at least 10 characters long'
        });
      }
      
      // Create feedback entry
      const feedbackEntry = {
        feedbackId: uuidv4(),
        name: name.trim(),
        phone: phone.trim(),
        review: review.trim(),
        templateId: templateId || 'unknown',
        cvName: cvName || 'Unknown User',
        submissionDate: submissionDate || new Date().toISOString()
      };
      
      // Store in memory (backup)
      feedbackSubmissions.push(feedbackEntry);
      
      // Send to Google Sheets via Apps Script
      const googleAppsScriptUrl = 'https://script.google.com/macros/s/AKfycbw1jI1tdqrLfG9XnHGBgXr946MyHzGjvBQwIAqv7nbOL7MsQZPiu3PJj3WVUi38XAG1/exec';
      
      try {
        const googleResponse = await fetch(googleAppsScriptUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(feedbackEntry)
        });
        
        const googleResult = await googleResponse.json();
        console.log('Google Sheets response:', googleResult);
        
        if (googleResult.success) {
          console.log(`✅ Feedback sent to Google Sheets successfully for ${name}`);
        } else {
          console.warn('⚠️ Google Sheets submission failed:', googleResult.error);
        }
      } catch (googleError: any) {
        console.error('❌ Error sending to Google Sheets:', googleError.message);
        // Continue with local storage even if Google Sheets fails
      }
      
      console.log(`Feedback submitted by ${name} for template ${templateId}:`);
      console.log(`Review: ${review}`);
      console.log(`Phone: ${phone}`);
      console.log(`Total feedback entries: ${feedbackSubmissions.length}`);
      
      // Return success response
      res.status(200).json({
        success: true,
        message: 'Feedback submitted successfully',
        feedbackId: feedbackEntry.feedbackId
      });
      
    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error while submitting feedback'
      });
    }
  });

  // Endpoint to retrieve all feedback (for admin/testing purposes)
  app.get("/api/feedback-submissions", (req, res) => {
    res.json({
      success: true,
      submissions: feedbackSubmissions,
      total: feedbackSubmissions.length
    });
  });

  // Admin authentication middleware
  const adminAuth = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token required' });
    }

    try {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
      
      if (decoded.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }
      
      req.user = decoded;
      next();
    } catch (error: any) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };

  // Admin login endpoint
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // For now, use hardcoded admin credentials
      if (username === 'admin@cvchapchap.com' && password === 'admin123') {
        // Create JWT token
        const token = jwt.sign(
          { 
            id: '231a9a83-fcd0-4f51-aacc-b1578f1d7128',
            username: 'admin',
            email: 'admin@cvchapchap.com',
            role: 'admin'
          },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '24h' }
        );
        
        res.json({
          token,
          user: {
            id: '231a9a83-fcd0-4f51-aacc-b1578f1d7128',
            username: 'admin',
            email: 'admin@cvchapchap.com',
            role: 'admin'
          }
        });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error: any) {
      console.error('Admin login error:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  });

  // Admin current user endpoint
  app.get("/api/admin/me", adminAuth, async (req, res) => {
    try {
      // Return the decoded user from the JWT token (set by adminAuth middleware)
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: 'User not found in token' });
      }
      
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      });
    } catch (error: any) {
      console.error('Admin current user error:', error);
      res.status(500).json({ message: 'Failed to get current user' });
    }
  });

  // Admin API endpoints
  app.get("/api/admin/stats", adminAuth, async (req, res) => {
    try {
      // Get real statistics from the system
      const { users } = await import('./auth-proxy');
      const totalUsers = users?.length || 0;
      const usersToday = users?.filter((u: any) => {
        const today = new Date();
        const userDate = new Date(u.created_at);
        return userDate.toDateString() === today.toDateString();
      }).length || 0;

      // CV statistics (from current session data)
      const totalCVs = cvRequests ? Object.keys(cvRequests).length : 0;
      const cvsToday = totalCVs; // All CVs are from today in current session

      // Payment statistics 
      const totalPayments = feedbackSubmissions.length; // Using feedback as proxy for completed CVs
      const paymentsToday = feedbackSubmissions.filter(f => {
        const today = new Date();
        const paymentDate = new Date(f.submissionDate);
        return paymentDate.toDateString() === today.toDateString();
      }).length;

      // Revenue calculation (15,000 TZS per CV)
      const revenuePerCV = 15000;
      const totalRevenue = totalPayments * revenuePerCV;
      const revenueToday = paymentsToday * revenuePerCV;

      // Template usage statistics
      const templateUsage = feedbackSubmissions.reduce((acc: any, submission: any) => {
        const templateId = submission.templateId;
        acc[templateId] = (acc[templateId] || 0) + 1;
        return acc;
      }, {});

      const topTemplates = Object.entries(templateUsage)
        .map(([id, usage]: [string, any]) => ({ id, usage, name: id }))
        .sort((a, b) => b.usage - a.usage)
        .slice(0, 5);

      // Recent payments (from feedback submissions)
      const recentPayments = feedbackSubmissions
        .slice(-5)
        .map((submission: any) => ({
          id: submission.feedbackId,
          amount: revenuePerCV,
          currency: 'TZS',
          status: 'completed',
          created_at: submission.submissionDate,
          user_name: submission.name
        }));

      const stats = {
        users: {
          total: totalUsers,
          new_today: usersToday
        },
        cvs: {
          total: totalCVs,
          created_today: cvsToday,
          completion_rate: totalCVs > 0 ? Math.round((totalPayments / totalCVs) * 100) : 0
        },
        payments: {
          total: totalPayments,
          success_rate: 100, // All feedback submissions represent successful completions
          today: paymentsToday
        },
        revenue: {
          total: totalRevenue,
          today: revenueToday,
          last_week: totalRevenue, // For now, same as total
          last_month: totalRevenue
        },
        top_templates: topTemplates,
        recent_payments: recentPayments,
        recent_users: (users || []).slice(-5).map((u: any) => ({
          id: u.id,
          username: u.username,
          created_at: u.created_at
        }))
      };



      res.json(stats);
    } catch (error: any) {
      console.error('Error fetching admin stats:', error);
      res.status(500).json({ 
        message: 'Error fetching admin statistics',
        error: error.message 
      });
    }
  });

  app.get("/api/admin/users", adminAuth, async (req, res) => {
    try {
      const { users } = await import('./auth-proxy');
      const page = parseInt(req.query.page as string) || 1;
      const perPage = parseInt(req.query.perPage as string) || 10;
      const search = req.query.search as string || '';

      let filteredUsers = users;
      
      if (search) {
        filteredUsers = users.filter((u: any) => 
          u.username.includes(search) || 
          u.email.includes(search) || 
          (u.full_name && u.full_name.includes(search))
        );
      }

      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

      res.json({
        users: paginatedUsers.map((u: any) => ({
          id: u.id,
          username: u.username,
          email: u.email,
          fullName: u.full_name,
          createdAt: u.created_at,
          role: u.role,
          isActive: true
        })),
        total: filteredUsers.length,
        page,
        perPage,
        totalPages: Math.ceil(filteredUsers.length / perPage)
      });
    } catch (error: any) {
      console.error('Error fetching users:', error);
      res.status(500).json({ 
        message: 'Error fetching users',
        error: error.message 
      });
    }
  });

  app.get("/api/admin/templates", adminAuth, (req, res) => {
    // Return static template data since templates are file-based
    const templates = [
      { id: 'brightDiamond', name: 'Bright Diamond', category: 'Professional', isActive: true },
      { id: 'kaziFasta', name: 'Kazi Fasta', category: 'Professional', isActive: true },
      { id: 'jijengeClassic', name: 'Jijenge Classic', category: 'Classic', isActive: true },
      { id: 'kilimanjaro', name: 'Kilimanjaro', category: 'Modern', isActive: true },
      { id: 'tanzanitePro', name: 'Tanzanite Pro', category: 'Professional', isActive: true },
      { id: 'modernSerif', name: 'Modern Serif', category: 'Modern', isActive: true }
    ];

    // Add usage stats from feedback submissions
    const templateStats = feedbackSubmissions.reduce((acc: any, submission: any) => {
      const templateId = submission.templateId;
      acc[templateId] = (acc[templateId] || 0) + 1;
      return acc;
    }, {});

    const templatesWithStats = templates.map(template => ({
      ...template,
      usageCount: templateStats[template.id] || 0,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: new Date().toISOString()
    }));

    res.json({
      templates: templatesWithStats,
      total: templates.length
    });
  });

  // Create HTTP server
  const httpServer = createServer(app);
  
  return httpServer;
}
