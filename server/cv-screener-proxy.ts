import type { Request, Response } from 'express';
import fetch from 'node-fetch';
import FormData from 'form-data';

/**
 * Server-side proxy for the CV Screener API
 * This avoids CORS issues by making requests from the server
 */

const CV_SCREENER_API = 'https://cv-screener-africanuspanga.replit.app';

export async function cvScreenerProxyHandler(req: Request, res: Response) {
  try {
    // Extract path from request URL
    const path = req.params.path;
    if (!path) {
      return res.status(400).json({ error: 'API path is required' });
    }

    // Construct target URL
    const targetUrl = `${CV_SCREENER_API}/${path}`;
    console.log(`[CV Screener Proxy] Proxying request to: ${targetUrl}`);

    // Prepare headers - forward necessary headers and add our own
    const headers: Record<string, string> = {
      'User-Agent': 'CV-Chap-Chap-Proxy',
    };

    // Forward content type if present (important for JSON and multipart)
    if (req.headers['content-type']) {
      headers['Content-Type'] = req.headers['content-type'] as string;
    }

    // Forward accept header if present
    if (req.headers['accept']) {
      headers['Accept'] = req.headers['accept'] as string;
    }

    // Add custom headers if specified in the request
    if (req.headers['x-prefer-json-response']) {
      headers['X-Prefer-JSON-Response'] = req.headers['x-prefer-json-response'] as string;
    }

    // Options for fetch request
    const options: any = {
      method: req.method,
      headers,
      redirect: 'follow',
    };

    // Add body for non-GET requests
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      // Handle multipart form data requests
      if (req.headers['content-type']?.includes('multipart/form-data')) {
        const formData = new FormData();
        // @ts-ignore: req.files exists if using multer
        if (req.files && req.files.length > 0) {
          // @ts-ignore
          req.files.forEach((file: any) => {
            formData.append(file.fieldname, file.buffer, { 
              filename: file.originalname,
              contentType: file.mimetype
            });
          });
        }
        
        // Add other form fields
        if (req.body) {
          Object.entries(req.body).forEach(([key, value]) => {
            formData.append(key, value);
          });
        }
        
        options.body = formData;
        // FormData sets its own headers, so we'll use those
        options.headers = { 
          ...options.headers,
          ...formData.getHeaders() 
        };
      } 
      // Handle regular JSON requests
      else if (req.headers['content-type']?.includes('application/json')) {
        options.body = JSON.stringify(req.body);
      }
      // Handle URL encoded forms
      else if (req.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(req.body)) {
          params.append(key, value as string);
        }
        options.body = params;
      }
      // For other content types, pass the raw body
      else if (req.body) {
        options.body = req.body;
      }
    }

    // Make the proxied request
    const response = await fetch(targetUrl, options);
    
    // Log response status
    console.log(`[CV Screener Proxy] Response status: ${response.status}`);

    // Get all headers from response
    const responseHeaders = response.headers.raw();
    
    // Forward only safe headers to avoid security issues
    const allowedHeaders = [
      'content-type',
      'content-length',
      'content-disposition',
      'cache-control',
      'expires',
      'pragma',
      'x-powered-by'
    ];
    
    // Set status and headers
    res.status(response.status);
    for (const header of allowedHeaders) {
      if (responseHeaders[header]) {
        res.setHeader(header, responseHeaders[header][0]);
      }
    }

    // Set CORS headers to allow our frontend to access the response
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Accept');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Handle response body based on content type
    const contentType = response.headers.get('content-type') || '';
    
    // If the response is JSON, return it as JSON
    if (contentType.includes('application/json')) {
      const data = await response.json();
      res.json(data);
    }
    // If the response is a PDF, return it as a buffer
    else if (contentType.includes('application/pdf')) {
      const buffer = await response.buffer();
      res.send(buffer);
    }
    // For other types, return the response as text
    else {
      const text = await response.text();
      res.send(text);
    }
  } catch (error) {
    console.error('[CV Screener Proxy] Error:', error);
    res.status(500).json({ 
      error: 'Failed to proxy request to CV Screener API',
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}
