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
    You are an expert CV writer specializing in creating impactful, HIGHLY PERSONALIZED professional summaries based on provided work experiences, education history, and skills.
    
    TASK: Transform the provided information into a polished, PERSONALIZED professional summary for a CV.
    
    REQUIREMENTS:
    - Length: 250-400 characters (approximately 3-4 sentences)
    - ${toneInstructions[tone] || toneInstructions.professional}
    - Focus on SPECIFIC career achievements, expertise, and unique value proposition from the person's actual work history and education
    - Use SPECIFIC DETAILS from their work experiences, skills, and education
    - Include years of experience if mentioned
    - Avoid clichés, generalities, and first-person pronouns
    - Use present tense for current skills and past tense for achievements
    - Be specific and quantify accomplishments when possible
    - DIRECTLY REFERENCE the actual companies, job titles, skills and education provided in the prompt
    - NEVER use generic descriptions - each summary must reflect the person's unique background
    - MUST INCLUDE AT LEAST ONE SPECIFIC COMPANY NAME from their work experience
    - MUST INCLUDE AT LEAST ONE SPECIFIC ACHIEVEMENT OR SKILL from their background
    
    FORMAT:
    - Create a single paragraph
    - Begin with a strong opening statement about professional identity that references their actual background
    - No bullet points
    - Do not repeat the same information
    - No title or header
    - No introductory phrases like "Professional Summary:" or "Here is"
    - No conversational phrases like "Certainly!" or "I'd be happy to"
    
    EXAMPLES OF CORRECT RESPONSES (note the specific references to actual companies and skills):
    "React.js Developer with 3 years of experience at TechCorp and InnoSystems. Delivered 5+ web applications using React, Redux, and Node.js, reducing page load times by 40%. Skilled in agile methodologies with a computer science degree from University of Technology, specializing in modern JavaScript tooling and responsive design."
    
    "Marketing Manager with 2 years at Parimatch Tanzania, driving digital campaigns that boosted online engagement by 40%. Proven expertise in cross-platform advertising, increasing lead generation by 25% and revenue by 15%. Skilled in SEO implementation, which improved website ranking and organic traffic by 35% in a single quarter."
    
    EXAMPLES OF INCORRECT RESPONSES (generic, not personalized):
    "Dedicated software engineer with several years of experience developing scalable web applications. Proven track record of delivering high-quality code on time and mentoring junior developers. Passionate about creating intuitive user experiences and optimizing application performance."
    
    "Marketing professional with experience in digital strategies and campaign management. Adept at leveraging analytical skills to optimize processes and contribute to team efficiency. Eager to bring fresh perspective and commitment to excellence in forward-thinking organizations."
    
    IMPORTANT: The summary MUST be highly specific to the individual based on the information provided. Generic summaries are unacceptable.
    Respond with ONLY the enhanced professional summary paragraph, no explanations or other text.
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
    - Extract EXACTLY 5 most relevant skills based on the provided information (no more, no less)
    - ${toneInstructions[tone] || toneInstructions.professional}
    - Prioritize specific technical and industry-specific skills over general ones
    - Be precise with skill names (e.g., "Adobe Photoshop" instead of just "Design Software")
    - Ensure skills align with the person's industry and experience level
    - Include a mix of technical (hard) skills and soft skills if appropriate
    - For technical fields, include specific tools, languages, or methodologies
    - Each skill should be 1-3 words maximum
    
    FORMAT:
    - Provide a simple comma-separated list of EXACTLY 5 skills, without any other text
    - The list should contain EXACTLY 5 skills and not one more or less
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
    "Python, JavaScript, Docker, AWS, Database Design, Git, CI/CD" (too many skills)
    "Python, JavaScript, Docker, AWS" (too few skills)
    
    IMPORTANT: Respond with EXACTLY 5 skills in a comma-separated list, nothing else.
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
