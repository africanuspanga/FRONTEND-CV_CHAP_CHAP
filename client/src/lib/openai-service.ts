/**
 * OpenAI Service for CV Chap Chap
 * This module provides utility functions for interacting with the OpenAI API
 */

// Storage key for the OpenAI API key in localStorage
const OPENAI_API_KEY_STORAGE_KEY = 'cv-chap-chap-openai-api-key';

/**
 * Check if an OpenAI API key exists in localStorage
 */
export function hasOpenAIApiKey(): boolean {
  return !!getOpenAIApiKey();
}

/**
 * Get the OpenAI API key from localStorage
 */
export function getOpenAIApiKey(): string | null {
  return localStorage.getItem(OPENAI_API_KEY_STORAGE_KEY);
}

/**
 * Set the OpenAI API key in localStorage
 */
export function setOpenAIApiKey(apiKey: string): void {
  localStorage.setItem(OPENAI_API_KEY_STORAGE_KEY, apiKey);
}

/**
 * Clear the OpenAI API key from localStorage
 */
export function clearOpenAIApiKey(): void {
  localStorage.removeItem(OPENAI_API_KEY_STORAGE_KEY);
}

/**
 * Make a request to the OpenAI API
 */
async function makeOpenAIRequest(prompt: string, maxTokens: number = 500): Promise<string> {
  const apiKey = getOpenAIApiKey();
  if (!apiKey) {
    throw new Error('No OpenAI API key found');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
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
      throw new Error(errorData.error?.message || 'Failed to get response from OpenAI');
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
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
  jobTitle: string,
  yearsOfExperience?: number,
): Promise<string> {
  const experienceContext = yearsOfExperience 
    ? `with ${yearsOfExperience} years of experience` 
    : 'with relevant experience';

  const prompt = `Enhance the following professional summary for a ${jobTitle} ${experienceContext}:

"${currentSummary}"

Make it more impactful, professional, and concise (100-150 words). Highlight strengths and career achievements.
Focus on value proposition. Use active voice and first-person perspective.
Avoid clichés and generic statements. Keep the tone professional but personable.`;

  return await makeOpenAIRequest(prompt, 300);
}
