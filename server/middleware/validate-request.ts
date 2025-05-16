/**
 * Request validation middleware
 * Provides protection against malformed requests and potential injection attacks
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Sanitize string values to prevent XSS attacks
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .replace(/eval\(/gi, '');
}

/**
 * Deep sanitize an object to prevent XSS attacks
 */
export function sanitizeObject(obj: any): any {
  if (!obj) return obj;
  
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  if (typeof obj === 'object' && obj !== null) {
    const sanitized: Record<string, any> = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }
  
  return obj;
}

/**
 * Middleware to sanitize request body
 */
export function sanitizeRequest(req: Request, res: Response, next: NextFunction) {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  next();
}

/**
 * Middleware to validate PDF generation request
 */
export function validatePdfRequest(req: Request, res: Response, next: NextFunction) {
  try {
    // Check if the request has a template_id
    if (!req.body.template_id || typeof req.body.template_id !== 'string') {
      return res.status(400).json({
        error: 'Invalid template ID',
        message: 'Template ID must be a string',
      });
    }
    
    // Check if the request has cv_data
    if (!req.body.cv_data || typeof req.body.cv_data !== 'object') {
      return res.status(400).json({
        error: 'Invalid CV data',
        message: 'CV data must be an object',
      });
    }
    
    // Validate personal info
    const personalInfo = req.body.cv_data.personalInfo;
    if (!personalInfo || typeof personalInfo !== 'object') {
      return res.status(400).json({
        error: 'Invalid personal info',
        message: 'Personal info must be an object',
      });
    }
    
    // Check required fields
    if (!personalInfo.firstName || !personalInfo.lastName) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'First name and last name are required',
      });
    }
    
    next();
  } catch (error) {
    console.error('Error validating PDF request:', error);
    return res.status(400).json({
      error: 'Bad request',
      message: error instanceof Error ? error.message : 'Unknown validation error',
    });
  }
}

/**
 * Middleware to implement basic rate limiting
 * Simple in-memory solution (would use Redis in production)
 */
const ipRequests: Record<string, { count: number, resetTime: number }> = {};
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 20; // 20 requests per minute

export function rateLimit(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  
  // Initialize if new IP or reset if window has passed
  if (!ipRequests[ip] || now > ipRequests[ip].resetTime) {
    ipRequests[ip] = {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    };
    return next();
  }
  
  // Increment request count
  ipRequests[ip].count++;
  
  // Check if limit exceeded
  if (ipRequests[ip].count > RATE_LIMIT_MAX_REQUESTS) {
    return res.status(429).json({
      error: 'Too many requests',
      message: 'Rate limit exceeded. Try again later.',
    });
  }
  
  next();
}