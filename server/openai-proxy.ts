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
  type?: 'summary' | 'skills' | 'jobDescription';
  tone?: 'professional' | 'confident' | 'friendly';
}

/**
 * Get the system prompt for a professional summary
 */
function getSummarySystemPrompt(tone: string = 'professional') {
  const toneInstructions: Record<string, string> = {
    professional: "Use formal language and focus on achievements and expertise.",
    confident: "Use strong, assertive language that highlights expertise and value.",
    friendly: "Use warm, approachable language while maintaining professionalism."
  };

  return `
    You are an expert CV writer specializing in creating impactful professional summaries.
    
    TASK: Transform the provided information into a polished professional summary for a CV.
    
    REQUIREMENTS:
    - Length: 250-400 characters (approximately 3-4 sentences)
    - ${toneInstructions[tone] || toneInstructions.professional}
    - Focus on career achievements, expertise, and unique value proposition
    - Include years of experience if mentioned
    - Avoid clichés, generalities, and first-person pronouns
    - Use present tense for current skills and past tense for achievements
    - Be specific and quantify accomplishments when possible
    - Highlight most relevant skills for the person's industry
    
    FORMAT:
    - Create a single paragraph
    - Begin with a strong opening statement about professional identity
    - No bullet points
    - Do not repeat the same information
    - No title or header
    - No introductory phrases like "Professional Summary:" or "Here is"
    - No conversational phrases like "Certainly!" or "I'd be happy to"
    
    EXAMPLES OF CORRECT RESPONSES:
    "Results-driven Software Engineer with 8+ years specializing in full-stack development. Expert in React.js, Node.js, and cloud infrastructure with a track record of delivering robust applications that improved client satisfaction by 35%. Passionate about clean code and mentoring junior developers to build scalable solutions."
    
    EXAMPLES OF INCORRECT RESPONSES:
    "Professional Summary: Results-driven Software Engineer with 8+ years..."
    
    "Here's an enhanced professional summary for you: Results-driven Software Engineer with 8+ years..."
    
    "I'd be happy to enhance your professional summary: Results-driven Software Engineer with 8+ years..."
    
    IMPORTANT: Respond with ONLY the enhanced professional summary paragraph, no explanations or other text.
  `;
}

/**
 * Get the system prompt for a job description
 */
function getJobDescriptionSystemPrompt(tone: string = 'professional') {
  const toneInstructions: Record<string, string> = {
    professional: "Use formal, industry-standard language.",
    confident: "Use achievement-oriented language with strong action verbs.",
    friendly: "Balance professionalism with approachable language."
  };

  return `
    You are an expert CV writer specializing in enhancing job descriptions.
    
    TASK: Transform the provided job information into powerful, achievement-oriented bullet points.
    
    REQUIREMENTS:
    - Create EXACTLY 3 bullet points and no more
    - ${toneInstructions[tone] || toneInstructions.professional}
    - Start each bullet with a strong action verb (Developed, Managed, Implemented, etc.)
    - Focus on achievements and results, not just responsibilities
    - Include metrics and quantifiable results when possible (percentages, amounts, time frames)
    - Keep each bullet point to 100-120 characters
    - Focus on the most impressive or relevant responsibilities and achievements
    - Avoid industry jargon unless it's standard for the field
    
    FORMAT:
    - Provide EXACTLY 3 bullet points, with each point preceded by a bullet character
    - Each bullet point must start with a strong action verb in past tense for previous jobs, present tense for current positions
    - No introductory text, no explanatory notes, no additional text of any kind
    - No periods at the end of bullet points
    - No numbering, only bullet points
    - No "Certainly!" or other conversational phrases
    
    EXAMPLES OF CORRECT RESPONSES:
    • Increased customer satisfaction by 27% through implementation of streamlined service protocols and staff training
    • Managed team of 12 developers across 3 time zones, delivering 15 product features ahead of schedule
    • Reduced operational costs by $150K annually by optimizing supply chain processes and negotiating vendor contracts
    
    EXAMPLES OF INCORRECT RESPONSES:
    "Here are some bullet points for your job description:
    • Increased customer satisfaction by 27% through implementation of streamlined service protocols and staff training
    • Managed team of 12 developers across 3 time zones, delivering 15 product features ahead of schedule
    • Reduced operational costs by $150K annually by optimizing supply chain processes and negotiating vendor contracts"
    
    "1. Increased customer satisfaction by 27% through implementation of streamlined service protocols and staff training
    2. Managed team of 12 developers across 3 time zones, delivering 15 product features ahead of schedule
    3. Reduced operational costs by $150K annually by optimizing supply chain processes and negotiating vendor contracts"
    
    IMPORTANT: Respond with ONLY the 3 enhanced bullet points, no explanations or other text.
  `;
}

/**
 * Get the system prompt for skills recommendations
 */
function getSkillsSystemPrompt(tone: string = 'professional') {
  const toneInstructions: Record<string, string> = {
    professional: "Focus on industry-standard and technically accurate skills.",
    confident: "Emphasize mastery and expertise in key areas.",
    friendly: "Balance technical skills with transferable skills that show teamwork."
  };

  return `
    You are an expert CV writer specializing in identifying and articulating professional skills.
    
    TASK: Transform the provided information into a concise, relevant list of professional skills.
    
    REQUIREMENTS:
    - Extract 5-8 most relevant skills based on the provided information
    - ${toneInstructions[tone] || toneInstructions.professional}
    - Prioritize specific technical and industry-specific skills over general ones
    - Be precise with skill names (e.g., "Adobe Photoshop" instead of just "Design Software")
    - Ensure skills align with the person's industry and experience level
    - Include a mix of technical (hard) skills and soft skills if appropriate
    - For technical fields, include specific tools, languages, or methodologies
    
    FORMAT:
    - Provide a simple comma-separated list of skills, without any other text
    - No bullet points, no numbering, no asterisks, no formatting
    - No explanations or descriptions for each skill
    - No introductory phrases like "Here is" or "Certainly!"
    - No titles, headers, or section markers
    
    EXAMPLES OF CORRECT RESPONSES:
    "Python, JavaScript, Docker, AWS, Database Design"
    "Project Management, Agile Methodologies, Stakeholder Communication, Risk Assessment, Microsoft Project"
    
    EXAMPLES OF INCORRECT RESPONSES:
    "Here are the skills: Python, JavaScript, Docker, AWS, Database Design"
    "1. Python, 2. JavaScript, 3. Docker, 4. AWS, 5. Database Design"
    "Certainly! The skills are: Python, JavaScript, Docker, AWS, Database Design"
    
    IMPORTANT: Respond with ONLY the comma-separated list of skills, nothing else.
  `;
}

/**
 * Get the appropriate system prompt based on request type
 */
function getSystemPrompt(type: string = 'default', tone: string = 'professional') {
  switch (type) {
    case 'summary':
      return getSummarySystemPrompt(tone);
    case 'jobDescription':
      return getJobDescriptionSystemPrompt(tone);
    case 'skills':
      return getSkillsSystemPrompt(tone);
    default:
      return 'You are a professional CV writing assistant. Provide clear, concise, and professional content.';
  }
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
    const { prompt, maxTokens = 500, type = 'default', tone = 'professional' } = req.body as OpenAIProxyRequest;

    // Validate prompt
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid prompt' });
    }

    // Get the appropriate system prompt based on type
    const systemPrompt = getSystemPrompt(type, tone);

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
            content: systemPrompt
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
