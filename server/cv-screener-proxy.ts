import type { Request, Response } from 'express';
import fetch, { Response as FetchResponse, RequestInit, HeadersInit } from 'node-fetch';
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
  // Extract path from request URL
  const path = req.params.path;
  if (!path) {
    return res.status(400).json({ error: 'API path is required' });
  }

  try {
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
    const options: RequestInit = {
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
            formData.append(key, value as string);
          });
        }
        
        options.body = formData as any;
        // FormData sets its own headers
        options.headers = { 
          ...options.headers,
          ...formData.getHeaders() 
        };
      } 
      // Handle regular JSON requests
      else if (req.headers['content-type']?.includes('application/json')) {
        console.log('[CV Screener Proxy] JSON Request Body:', JSON.stringify(req.body, null, 2));
        options.body = JSON.stringify(req.body);
      }
      // Handle URL encoded forms
      else if (req.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(req.body)) {
          params.append(key, value as string);
        }
        options.body = params as any;
      }
      // For other content types, pass the raw body
      else if (req.body) {
        options.body = req.body;
      }
    }

    // Make the proxied request 
    let fetchResponse: FetchResponse;
    try {
      // Log exactly what we're sending to the backend
      console.log(`[CV Screener Proxy] Sending to ${targetUrl}:`);
      console.log(`[CV Screener Proxy] Request method: ${options.method}`);
      console.log(`[CV Screener Proxy] Request headers:`, options.headers);
      
      if (options.body && typeof options.body === 'string') {
        // For all JSON bodies, log the truncated body
        console.log(`[CV Screener Proxy] Request body: ${options.body.substring(0, 500)}...`);
        
        // Try to parse it to see if it's valid JSON
        try {
          const parsedBody = JSON.parse(options.body);
          
          // For CV data requests
          if ('cv_data' in parsedBody) {
            console.log('[CV Screener Proxy] Body has cv_data field:', true);
            
            // Log name/email at both levels
            if (parsedBody.name) console.log('[CV Screener Proxy] Body has name:', parsedBody.name);
            if (parsedBody.email) console.log('[CV Screener Proxy] Body has email:', parsedBody.email);
            
            // Check inside cv_data too
            console.log('[CV Screener Proxy] Body has name in cv_data:', parsedBody.cv_data?.name ? 'yes' : 'no');
            console.log('[CV Screener Proxy] Body has email in cv_data:', parsedBody.cv_data?.email ? 'yes' : 'no');
          }
          
          // For all paths containing "payment" or related terms, log more details
          if (path.includes('payment') || path.includes('pay') || path.includes('ussd')) {
            console.log('[CV Screener Proxy] PAYMENT REQUEST DETAILS:');
            console.log(JSON.stringify(parsedBody, null, 2));
            
            // Check critical payment fields
            if ('payment_message' in parsedBody) {
              console.log('[CV Screener Proxy] Payment message:', parsedBody.payment_message?.substring(0, 100));
            }
            if ('transaction_id' in parsedBody) {
              console.log('[CV Screener Proxy] Transaction ID:', parsedBody.transaction_id);
            }
            if ('reference_number' in parsedBody) {
              console.log('[CV Screener Proxy] Reference number:', parsedBody.reference_number);
            }
            if ('ussd_code' in parsedBody) {
              console.log('[CV Screener Proxy] USSD code:', parsedBody.ussd_code);
            }
          }
        } catch (e) {
          console.log('[CV Screener Proxy] Failed to parse body as JSON:', e);
        }
      }
      
      fetchResponse = await fetch(targetUrl, options);
      
      // Log response status and headers
      console.log(`[CV Screener Proxy] Response status: ${fetchResponse.status}`);
      // Log a few important headers
      console.log(`[CV Screener Proxy] Response content-type:`, fetchResponse.headers.get('content-type'));
      console.log(`[CV Screener Proxy] Response content-length:`, fetchResponse.headers.get('content-length'));
      
      // Update rate limit tracking based on response status
      updateRateLimit(path, fetchResponse.status);
    } catch (fetchError) {
      console.error(`[CV Screener Proxy] Network error fetching ${targetUrl}:`, fetchError);
      // Update rate limit for failed requests
      updateRateLimit(path, 500);
      throw new Error(`Network error connecting to CV Screener API: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}`);
    }

    // Forward status code to client response
    res.status(fetchResponse.status);
      
    // Get content type for body parsing
    const contentType = fetchResponse.headers.get('content-type') || '';

    // Set CORS headers to allow our frontend to access the response
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Accept');

    // Forward critical headers
    const headersToForward = ['content-type', 'content-disposition'];
    for (const header of headersToForward) {
      const value = fetchResponse.headers.get(header);
      if (value) {
        res.setHeader(header, value);
      }
    }

    try {
      // Process response body based on content type
      if (contentType.includes('application/json')) {
        try {
          // Parse and send JSON response
          const jsonData = await fetchResponse.json();
          console.log('[CV Screener Proxy] JSON response:', jsonData);
          
          // Log more details for payment endpoints
          if (path.includes('payment') || path.includes('pay') || path.includes('ussd')) {
            console.log('[CV Screener Proxy] PAYMENT RESPONSE DETAILS:');
            console.log(JSON.stringify(jsonData, null, 2));
            
            // If it looks like an empty object, log this specifically
            if (Object.keys(jsonData).length === 0) {
              console.log('[CV Screener Proxy] ⚠️ WARNING: Empty JSON response object for payment endpoint!');
            }
          }
          
          // If it's an error response, log more details
          if (fetchResponse.status >= 400) {
            console.log(`[CV Screener Proxy] ${fetchResponse.status} Error response details:`, jsonData);
            
            // For payment errors, check if we have any helpful details
            if (path.includes('payment')) {
              if ('error' in jsonData) {
                console.log('[CV Screener Proxy] Payment error message:', jsonData.error);
              }
              if ('details' in jsonData) {
                console.log('[CV Screener Proxy] Payment error details:', jsonData.details);
              }
            }
          }
          
          return res.json(jsonData);
        } catch (jsonParseError) {
          console.error('[CV Screener Proxy] Error parsing JSON response:', jsonParseError);
          
          // Try to get the raw text to see what was returned
          try {
            // We can't use fetchResponse.text() again since the body was already consumed
            // So we'll return an error with the information we have
            return res.status(500).json({
              error: 'Invalid JSON returned from CV Screener API',
              details: jsonParseError instanceof Error ? jsonParseError.message : 'Unknown JSON parse error',
              status_code: fetchResponse.status
            });
          } catch (textError) {
            console.error('[CV Screener Proxy] Could not get response text after JSON parse error:', textError);
            throw jsonParseError; // Re-throw to trigger the outer catch block
          }
        }
      } 
      else if (contentType.includes('application/pdf')) {
        // For PDFs, get the array buffer and send as binary
        const arrayBuffer = await fetchResponse.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        return res.send(buffer);
      } 
      else if (contentType.includes('text/')) {
        // For text responses
        const text = await fetchResponse.text();
        return res.send(text);
      }
      else {
        // For other types, get as buffer and send
        const arrayBuffer = await fetchResponse.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        return res.send(buffer);
      }
    } catch (bodyError) {
      console.error('[CV Screener Proxy] Error processing response body:', bodyError);
      
      // If we get here, we've already set the status code to match the upstream response
      // But we need to send a replacement body since we couldn't process the original
      return res.json({
        error: 'Error processing response from CV Screener API',
        details: bodyError instanceof Error ? bodyError.message : 'Unknown error',
        status_code: fetchResponse.status,
        content_type: contentType
      });
    }
  } 
  catch (error) {
    // Log detailed error information for debugging
    console.error('[CV Screener Proxy] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[CV Screener Proxy] Error details for path ${path}:`, errorMessage);
    
    // Send a more detailed error response
    res.status(500).json({ 
      error: 'Failed to proxy request to CV Screener API',
      path,
      details: errorMessage,
      retry_suggestion: 'Please try again in a few moments or contact support if the issue persists.'
    });
    
    // Still update rate limiting to avoid overwhelming the server
    try {
      updateRateLimit(path, 500);
    } catch (rateLimitError) {
      console.warn('[CV Screener Proxy] Failed to update rate limit after error:', rateLimitError);
    }
  }
}
