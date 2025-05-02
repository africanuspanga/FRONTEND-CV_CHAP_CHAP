/**
 * API Keys Server Module
 * Provides access to API keys from environment variables
 */
import { Request, Response } from 'express';

// Get environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Route handler for client-side API key access
export function apiKeysHandler(req: Request, res: Response) {
  // Only provide public keys that are safe to expose to the client
  // Do not include private keys that should be kept server-side only
  const publicKeys = {
    openai: OPENAI_API_KEY ? true : false, // Only indicate if key exists, not the key itself
  };
  
  res.json(publicKeys);
}
