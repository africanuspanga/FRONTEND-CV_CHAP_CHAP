/**
 * OpenAI Service for CV Chap Chap
 * This module provides utility functions for interacting with the OpenAI API
 */

// Get OpenAI API key from environment variable
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

/**
 * Check if an OpenAI API key exists on the server
 * This function should be replaced with the useAIStatus hook in React components
 * Only use this directly in non-React contexts
 */
export function hasOpenAIApiKey(): boolean {
  return !!getOpenAIApiKey();
}

/**
 * Get the OpenAI API key
 * Note: This will always return the environment variable, not the actual key
 */
export function getOpenAIApiKey(): string | null {
  // In production, we should rely on the server having the API key
  // The client code should never have direct access to the actual key
  if (OPENAI_API_KEY) {
    return OPENAI_API_KEY;
  }
  return null;
}

// For compatibility with existing code, but these are no longer needed
export function setOpenAIApiKey(apiKey: string): void {}
export function clearOpenAIApiKey(): void {}

/**
 * Types for the prompting options
 */
export type PromptType = 'default' | 'summary' | 'skills' | 'jobDescription';
export type ToneType = 'professional' | 'confident' | 'friendly';

/**
 * Options for making OpenAI requests
 */
interface OpenAIRequestOptions {
  prompt: string;
  maxTokens?: number;
  type?: PromptType;
  tone?: ToneType;
}

/**
 * Make a request to the OpenAI API via our server-side proxy
 */
async function makeOpenAIRequest(
  options: OpenAIRequestOptions | string,
  maxTokens: number = 500
): Promise<string> {
  // Allow simple string prompt for backward compatibility
  const requestOptions: OpenAIRequestOptions = typeof options === 'string' 
    ? { prompt: options, maxTokens } 
    : options;
  
  try {
    const response = await fetch('/api/openai/proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: requestOptions.prompt,
        maxTokens: requestOptions.maxTokens || maxTokens,
        type: requestOptions.type || 'default',
        tone: requestOptions.tone || 'professional',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get response from OpenAI');
    }

    const data = await response.json();
    return data.content.trim();
  } catch (error) {
    console.error('Error in OpenAI request:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred while making OpenAI request');
  }
}

/**
 * Get AI-generated work experience bullet points
 */
export async function getWorkExperienceRecommendations(
  jobTitle: string,
  company: string,
  industry?: string,
  tone: ToneType = 'professional'
): Promise<string[]> {
  const industryContext = industry ? ` in the ${industry} industry` : '';
  const prompt = `Job Title: ${jobTitle}
Company: ${company}${industryContext}

Please provide professional bullet points for this position that highlight achievements and responsibilities.`;

  const result = await makeOpenAIRequest({
    prompt,
    maxTokens: 600,
    type: 'jobDescription',
    tone
  });
  
  // Process into individual bullet points and ensure we get exactly 3
  let bulletPoints = result
    .split('\n')
    .map(line => line.replace(/^[\s•\-*]+/, '').trim())
    .filter(line => line.length > 0);
  
  // Make sure we have exactly 3 bullet points
  if (bulletPoints.length > 3) {
    bulletPoints = bulletPoints.slice(0, 3);
  } else if (bulletPoints.length < 3) {
    // If we somehow got fewer than 3 bullet points, pad the array
    while (bulletPoints.length < 3) {
      bulletPoints.push(`Additional ${jobTitle} responsibilities at ${company}`);
    }
  }
  
  return bulletPoints;
}

/**
 * Get AI-generated skills recommendations
 */
export async function getSkillRecommendations(
  jobTitle: string,
  yearsOfExperience?: number,
  industry?: string,
  tone: ToneType = 'professional'
): Promise<string[]> {
  const experienceLevel = yearsOfExperience 
    ? yearsOfExperience < 2 
      ? 'entry-level'
      : yearsOfExperience < 5
      ? 'mid-level'
      : 'senior-level'
    : 'various experience levels';

  const industryContext = industry ? ` in the ${industry} industry` : '';
  const prompt = `Job Title: ${jobTitle}
Experience Level: ${experienceLevel}${industryContext}

Please provide a list of professional skills relevant for this position.`;

  const result = await makeOpenAIRequest({
    prompt,
    maxTokens: 400,
    type: 'skills',
    tone
  });
  
  // Process the result based on the format (handles both comma-separated and line-separated formats)
  if (result.includes(',')) {
    // Process comma-separated list
    return result
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);
  } else {
    // Fallback for line-separated list
    return result
      .split('\n')
      .map(line => line.replace(/^[\s•\-*]+/, '').trim())
      .filter(line => line.length > 0);
  }
}

/**
 * Enhance a professional summary with AI
 */
export async function enhanceProfessionalSummary(
  currentSummary: string,
  jobTitle?: string,
  yearsOfExperience?: number,
  tone: ToneType = 'professional'
): Promise<string> {
  const jobContext = jobTitle ? `for a ${jobTitle}` : 'for a professional';
  const experienceContext = yearsOfExperience 
    ? `with ${yearsOfExperience} years of experience` 
    : 'with relevant experience';

  const prompt = `Professional Summary: ${currentSummary}
Job Title: ${jobTitle || 'Not specified'}
Experience: ${yearsOfExperience ? `${yearsOfExperience} years` : 'Not specified'}

Please provide an enhanced professional summary for this person.`;

  return await makeOpenAIRequest({
    prompt,
    maxTokens: 300,
    type: 'summary',
    tone
  });
}

/**
 * Enhance a work experience description with AI
 */
export async function enhanceWorkExperience({
  jobTitle,
  company,
  description,
  startDate,
  endDate,
  yearsOfExperience,
  tone = 'professional'
}: {
  jobTitle: string;
  company: string;
  description: string;
  startDate?: string;
  endDate?: string;
  yearsOfExperience?: number;
  tone?: ToneType;
}): Promise<string> {
  const dateContext = startDate && endDate 
    ? `from ${startDate} to ${endDate}` 
    : startDate 
    ? `starting from ${startDate}` 
    : '';

  const experienceContext = yearsOfExperience 
    ? `with approximately ${yearsOfExperience} years of experience` 
    : '';

  const prompt = `Job Title: ${jobTitle}
Company: ${company}
Time Period: ${dateContext || 'Not specified'}
Experience Level: ${yearsOfExperience ? `${yearsOfExperience} years` : 'Not specified'}
Current Description: ${description}

Please provide an enhanced professional description for this work experience.`;

  return await makeOpenAIRequest({
    prompt, 
    maxTokens: 400,
    type: 'jobDescription',
    tone
  });
}
