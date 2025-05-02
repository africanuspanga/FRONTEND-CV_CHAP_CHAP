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
 * Make a request to the OpenAI API via our server-side proxy
 */
async function makeOpenAIRequest(prompt: string, maxTokens: number = 500): Promise<string> {
  try {
    const response = await fetch('/api/openai/proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        maxTokens,
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
  industry?: string
): Promise<string[]> {
  const industryContext = industry ? ` in the ${industry} industry` : '';
  const prompt = `Generate 5 professional bullet points for a ${jobTitle} position at ${company}${industryContext}. 
  Focus on achievements and responsibilities. Make each point start with a strong action verb. 
  Format the response as a plain list with one bullet point per line, without numbering. 
  Each bullet point should be concise (15-20 words), impactful, and highlight transferable skills.`;

  const result = await makeOpenAIRequest(prompt, 600);
  
  // Split the result into individual bullet points
  return result
    .split('\n')
    .map(line => line.replace(/^[\s•\-*]+/, '').trim())
    .filter(line => line.length > 0);
}

/**
 * Get AI-generated skills recommendations
 */
export async function getSkillRecommendations(
  jobTitle: string,
  yearsOfExperience?: number,
  industry?: string
): Promise<string[]> {
  const experienceLevel = yearsOfExperience 
    ? yearsOfExperience < 2 
      ? 'entry-level'
      : yearsOfExperience < 5
      ? 'mid-level'
      : 'senior-level'
    : 'various experience levels';

  const industryContext = industry ? ` in the ${industry} industry` : '';
  const prompt = `Generate 10 relevant skills for a ${experienceLevel} ${jobTitle}${industryContext}.
  Include both technical and soft skills.
  Format the response as a plain list with one skill per line, without numbering.
  Each skill should be concise (1-3 words when possible).`;

  const result = await makeOpenAIRequest(prompt, 400);
  
  // Split the result into individual skills
  return result
    .split('\n')
    .map(line => line.replace(/^[\s•\-*]+/, '').trim())
    .filter(line => line.length > 0);
}

/**
 * Enhance a professional summary with AI
 */
export async function enhanceProfessionalSummary(
  currentSummary: string,
  jobTitle?: string,
  yearsOfExperience?: number,
): Promise<string> {
  const jobContext = jobTitle ? `for a ${jobTitle}` : 'for a professional';
  const experienceContext = yearsOfExperience 
    ? `with ${yearsOfExperience} years of experience` 
    : 'with relevant experience';

  const prompt = `Enhance the following professional summary ${jobContext} ${experienceContext}:

"${currentSummary}"

Make it more impactful, professional, and concise (100-150 words). Highlight strengths and career achievements.
Focus on value proposition. Use active voice and first-person perspective.
Avoid clichés and generic statements. Keep the tone professional but personable.`;

  return await makeOpenAIRequest(prompt, 300);
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
}: {
  jobTitle: string;
  company: string;
  description: string;
  startDate?: string;
  endDate?: string;
  yearsOfExperience?: number;
}): Promise<string> {
  const dateContext = startDate && endDate 
    ? `from ${startDate} to ${endDate}` 
    : startDate 
    ? `starting from ${startDate}` 
    : '';

  const experienceContext = yearsOfExperience 
    ? `with approximately ${yearsOfExperience} years of experience` 
    : '';

  const prompt = `Enhance the following job description for a ${jobTitle} position at ${company} ${dateContext} ${experienceContext}:

"${description}"

Rewrite it to be more professional, achievement-oriented, and impactful. Focus on quantifiable achievements and specific contributions.
Use strong action verbs and professional language. Maintain first-person perspective if present in the original text.
Keep the tone professional, concise, and highlight transferable skills. Format as a cohesive paragraph, not bullet points.`;

  return await makeOpenAIRequest(prompt, 400);
}
