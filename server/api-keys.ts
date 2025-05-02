/**
 * API Keys Server Module
 * Provides access to API keys from environment variables
 */

import { Request, Response } from 'express';

/**
 * Handler for checking API key status
 * Returns the availability status of various API keys without exposing the actual keys
 */
export function apiKeysHandler(req: Request, res: Response) {
  // Check if OpenAI API key exists in environment variables
  const hasOpenAIKey = !!process.env.OPENAI_API_KEY;

  // Return status of API keys
  res.json({
    openai: hasOpenAIKey,
  });
}
