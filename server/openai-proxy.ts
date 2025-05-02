/**
 * OpenAI Proxy Service
 * Securely handles OpenAI API requests from the client without exposing API keys
 */

import { Request, Response } from 'express';

// Use the OpenAI API key from environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export interface OpenAIProxyRequest {
  prompt: string;
  maxTokens?: number;
}

/**
 * Handler for proxying OpenAI API requests
 * Uses the server's API key instead of requiring the client to have one
 */
export async function openaiProxyHandler(req: Request, res: Response) {
  // Check if OpenAI API key exists
  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OpenAI API key not configured on server' });
  }

  try {
    // Get prompt and optional parameters from request body
    const { prompt, maxTokens = 500 } = req.body as OpenAIProxyRequest;

    // Validate prompt
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid prompt' });
    }

    // Make API call to OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: 'system',
            content: 'You are a professional CV writing assistant. Provide clear, concise, and professional content.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: maxTokens,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      return res.status(response.status).json({
        error: errorData.error?.message || 'Failed to get response from OpenAI'
      });
    }

    const data = await response.json();
    return res.json({
      content: data.choices[0].message.content.trim()
    });
  } catch (error) {
    console.error('OpenAI proxy error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
}
