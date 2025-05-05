import type { Request, Response } from 'express';
import fetch from 'node-fetch';
import FormData from 'form-data';

/**
 * Server-side proxy for the CV Screener API
 * This avoids CORS issues by making requests from the server
 */

const CV_SCREENER_API = 'https://cv-screener-africanuspanga.replit.app';

// Track rate limited endpoints to apply exponential backoff
const rateLimitedEndpoints = new Map<string, {
  lastAttempt: number;
  backoffMs: number;
  failures: number;
}>();

// Maximum backoff time (5 minutes)
const MAX_BACKOFF_MS = 5 * 60 * 1000;

// Initial backoff time (3 seconds)
const INITIAL_BACKOFF_MS = 3000;

/**
 * Checks if an endpoint is currently rate limited and should wait
 * before making a new request.
 * 
 * @param path The API path being accessed
 * @returns True if should proceed, false if should wait
 */
function checkRateLimit(path: string): boolean {
  const rateLimit = rateLimitedEndpoints.get(path);
  
  // If we have no rate limit info for this endpoint, allow the request
  if (!rateLimit) {
    return true;
  }
  
  const now = Date.now();
  const timeSinceLastAttempt = now - rateLimit.lastAttempt;
  
  // If we've waited long enough since the last rate limit, allow the request
  if (timeSinceLastAttempt >= rateLimit.backoffMs) {
    return true;
  }
  
  // Still in backoff period, don't allow the request
  return false;
}

/**
 * Updates the rate limit tracking for an endpoint based on response success or failure
 * 
 * @param path The API path being accessed
 * @param status The HTTP status code received
 */
function updateRateLimit(path: string, status: number): void {
  const now = Date.now();
  const isRateLimited = status === 429;
  const isServerError = status >= 500 && status < 600;
  
  // Get existing rate limit info or create new entry
  const rateLimit = rateLimitedEndpoints.get(path) || {
    lastAttempt: now,
    backoffMs: INITIAL_BACKOFF_MS,
    failures: 0
  };
  
  // Update the last attempt time
  rateLimit.lastAttempt = now;
  
  // If we got a rate limit or server error, increase the backoff and failure count
  if (isRateLimited || isServerError) {
    rateLimit.failures += 1;
    rateLimit.backoffMs = Math.min(rateLimit.backoffMs * 1.5, MAX_BACKOFF_MS);
    console.log(`[CV Screener Proxy] Rate limiting ${path} with backoff ${rateLimit.backoffMs}ms (failures: ${rateLimit.failures})`);
  } else {
    // Success - gradually reduce backoff if we've had failures before
    if (rateLimit.failures > 0) {
      rateLimit.failures = Math.max(0, rateLimit.failures - 1);
      rateLimit.backoffMs = Math.max(INITIAL_BACKOFF_MS, rateLimit.backoffMs * 0.8);
      console.log(`[CV Screener Proxy] Reducing backoff for ${path} to ${rateLimit.backoffMs}ms (failures: ${rateLimit.failures})`);
    }
  }
  
  // Update the rate limit tracking
  rateLimitedEndpoints.set(path, rateLimit);
}

export async function cvScreenerProxyHandler(req: Request, res: Response) {
  try {
    // Extract path from request URL
    const path = req.params.path;
    if (!path) {
      return res.status(400).json({ error: 'API path is required' });
    }

    // Check if this endpoint is currently rate limited
    if (!checkRateLimit(path)) {
      const rateLimit = rateLimitedEndpoints.get(path);
      const retryAfter = Math.ceil(rateLimit!.backoffMs / 1000); // Convert to seconds
      
      console.log(`[CV Screener Proxy] Rate limited request to ${path}, retry after ${retryAfter}s`);
      
      return res.status(429).json({
        error: 'Too many requests to the backend API',
        retry_after: retryAfter,
        message: `This endpoint is being rate limited. Please retry after ${retryAfter} seconds.`
      });
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
    
    // Update rate limit tracking based on response status
    updateRateLimit(path, response.status);

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
