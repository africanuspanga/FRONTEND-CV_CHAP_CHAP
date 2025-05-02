import OpenAI from 'openai';

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '', // Use environment variable
  dangerouslyAllowBrowser: true, // Enable client-side usage
});

// Simple in-memory cache for responses
type CacheEntry = {
  timestamp: number;
  response: string;
};

const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
const cache: Record<string, CacheEntry> = {};

// Rate limiting variables
let lastAPICallTimestamp = 0;
const MIN_API_CALL_INTERVAL = 1000; // 1 second between calls

// Error types
export enum AIServiceErrorType {
  RATE_LIMIT = 'RATE_LIMIT',
  API_ERROR = 'API_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export class AIServiceError extends Error {
  type: AIServiceErrorType;

  constructor(message: string, type: AIServiceErrorType) {
    super(message);
    this.type = type;
    this.name = 'AIServiceError';
  }
}

// Function to create the system prompt for professional summaries
function getSummarySystemPrompt(tone: 'professional' | 'confident' | 'friendly' = 'professional') {
  const toneInstructions = {
    professional: "Use formal language and focus on achievements and expertise.",
    confident: "Use strong, assertive language that highlights expertise and value.",
    friendly: "Use warm, approachable language while maintaining professionalism."
  };

  return `
    You are an expert CV writer specializing in creating impactful professional summaries.
    
    TASK: Transform the provided information into a polished professional summary for a CV.
    
    REQUIREMENTS:
    - Length: 250-400 characters (approximately 3-4 sentences)
    - ${toneInstructions[tone]}
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
    
    EXAMPLE:
    "Results-driven Software Engineer with 8+ years specializing in full-stack development. Expert in React.js, Node.js, and cloud infrastructure with a track record of delivering robust applications that improved client satisfaction by 35%. Passionate about clean code and mentoring junior developers to build scalable solutions."
    
    Respond with ONLY the enhanced professional summary, no explanations or other text.
  `;
}

// Function to create the system prompt for job descriptions
function getJobDescriptionSystemPrompt(tone: 'professional' | 'confident' | 'friendly' = 'professional') {
  const toneInstructions = {
    professional: "Use formal, industry-standard language.",
    confident: "Use achievement-oriented language with strong action verbs.",
    friendly: "Balance professionalism with approachable language."
  };

  return `
    You are an expert CV writer specializing in enhancing job descriptions.
    
    TASK: Transform the provided job information into powerful, achievement-oriented bullet points.
    
    REQUIREMENTS:
    - Create exactly 3 bullet points
    - ${toneInstructions[tone]}
    - Start each bullet with a strong action verb (Developed, Managed, Implemented, etc.)
    - Focus on achievements and results, not just responsibilities
    - Include metrics and quantifiable results when possible (percentages, amounts, time frames)
    - Keep each bullet point to 100-120 characters
    - Focus on the most impressive or relevant responsibilities and achievements
    - Avoid industry jargon unless it's standard for the field
    
    FORMAT:
    - Provide exactly 3 bullet points
    - Start each with a strong action verb in past tense for previous jobs, present tense for current positions
    - No introductory text or explanations
    - No periods at the end of bullet points
    
    EXAMPLES:
    • Increased customer satisfaction by 27% through implementation of streamlined service protocols and staff training
    • Managed team of 12 developers across 3 time zones, delivering 15 product features ahead of schedule
    • Reduced operational costs by $150K annually by optimizing supply chain processes and negotiating vendor contracts
    
    Respond with ONLY the 3 enhanced bullet points, no explanations or other text.
  `;
}

// Function to create the system prompt for skills suggestions
function getSkillsSystemPrompt(tone: 'professional' | 'confident' | 'friendly' = 'professional') {
  const toneInstructions = {
    professional: "Focus on industry-standard and technically accurate skills.",
    confident: "Emphasize mastery and expertise in key areas.",
    friendly: "Balance technical skills with transferable skills that show teamwork."
  };

  return `
    You are an expert CV writer specializing in identifying and articulating professional skills.
    
    TASK: Transform the provided information into a concise, relevant list of professional skills.
    
    REQUIREMENTS:
    - Extract 4-5 most relevant skills based on the provided information
    - ${toneInstructions[tone]}
    - Prioritize specific technical and industry-specific skills over general ones
    - Be precise with skill names (e.g., "Adobe Photoshop" instead of just "Design Software")
    - Ensure skills align with the person's industry and experience level
    - Include a mix of technical (hard) skills and soft skills if appropriate
    - For technical fields, include specific tools, languages, or methodologies
    
    FORMAT:
    - Provide a simple comma-separated list of skills
    - No bullet points, no formatting
    - No explanations or descriptions for each skill
    - No title or header
    
    EXAMPLE:
    "Python, JavaScript, Docker, AWS, Database Design"
    "Project Management, Agile Methodologies, Stakeholder Communication, Risk Assessment, Microsoft Project"
    
    Respond with ONLY the list of skills, no explanations or other text.
  `;
}

// Check rate limit before making API calls
function checkRateLimit() {
  const now = Date.now();
  if (now - lastAPICallTimestamp < MIN_API_CALL_INTERVAL) {
    throw new AIServiceError(
      'Too many requests. Please try again in a moment.',
      AIServiceErrorType.RATE_LIMIT
    );
  }
  lastAPICallTimestamp = now;
}

// Get cached response or null if not found/expired
function getCachedResponse(cacheKey: string): string | null {
  const entry = cache[cacheKey];
  if (!entry) return null;
  
  // Check if cache entry has expired
  if (Date.now() - entry.timestamp > CACHE_EXPIRY) {
    delete cache[cacheKey];
    return null;
  }
  
  return entry.response;
}

// Store response in cache
function cacheResponse(cacheKey: string, response: string) {
  cache[cacheKey] = {
    timestamp: Date.now(),
    response,
  };
}

// Generate a cache key based on inputs
function generateCacheKey(type: string, inputs: Record<string, any>): string {
  return `${type}:${JSON.stringify(inputs)}`;
}

// Generate professional summary
export async function generateProfessionalSummary(
  personalInfo: any,
  workExperiences: any[],
  skills: any[],
  tone: 'professional' | 'confident' | 'friendly' = 'professional'
): Promise<string> {
  try {
    // Create a cache key
    const cacheKey = generateCacheKey('summary', {
      personalInfo,
      workExperiences: workExperiences.map(w => ({ title: w.jobTitle, company: w.company })),
      skillsCount: skills.length,
      tone
    });
    
    // Check cache first
    const cachedResponse = getCachedResponse(cacheKey);
    if (cachedResponse) return cachedResponse;
    
    // Check rate limit
    checkRateLimit();
    
    // Prepare context for the AI
    const professional = personalInfo.professionalTitle || '';
    const workHistory = workExperiences.map((job: any) => 
      `${job.jobTitle} at ${job.company}${job.startDate ? ` (${job.startDate} - ${job.current ? 'Present' : job.endDate || ''})` : ''}`
    ).join(', ');
    const skillsText = skills.map((skill: any) => skill.name).join(', ');
    
    const userPrompt = `Professional title: ${professional}\n\nWork experience: ${workHistory}\n\nSkills: ${skillsText}\n\nCreate a professional summary for my CV that highlights my expertise and achievements.`;
    
    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: getSummarySystemPrompt(tone) },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 250,
    });
    
    const summary = response.choices[0].message.content?.trim() || '';
    
    // Cache the response
    cacheResponse(cacheKey, summary);
    
    return summary;
  } catch (error: any) {
    console.error('Error generating professional summary:', error);
    
    if (error instanceof AIServiceError) {
      throw error;
    }
    
    if (error.name === 'RateLimitError') {
      throw new AIServiceError(
        'OpenAI rate limit exceeded. Please try again later.',
        AIServiceErrorType.RATE_LIMIT
      );
    }
    
    if (error.name === 'APIError') {
      throw new AIServiceError(
        'OpenAI API error. Please try again later.',
        AIServiceErrorType.API_ERROR
      );
    }
    
    if (error.name === 'AuthenticationError') {
      throw new AIServiceError(
        'Authentication failed. Please check your API key.',
        AIServiceErrorType.API_ERROR
      );
    }
    
    throw new AIServiceError(
      'An error occurred while generating the summary.',
      AIServiceErrorType.UNKNOWN_ERROR
    );
  }
}

// Generate job description bullet points
export async function generateJobDescription(
  jobTitle: string,
  company: string,
  isCurrent: boolean,
  industry?: string,
  tone: 'professional' | 'confident' | 'friendly' = 'professional'
): Promise<string[]> {
  try {
    // Create a cache key
    const cacheKey = generateCacheKey('jobDescription', {
      jobTitle,
      company,
      isCurrent,
      industry,
      tone
    });
    
    // Check cache first
    const cachedResponse = getCachedResponse(cacheKey);
    if (cachedResponse) return cachedResponse.split('\n');
    
    // Check rate limit
    checkRateLimit();
    
    // Prepare the prompt
    const userPrompt = `Job title: ${jobTitle}\nCompany: ${company}\nCurrent job: ${isCurrent ? 'Yes' : 'No'}\nIndustry: ${industry || 'Not specified'}\n\nCreate achievement-oriented bullet points for this job position.`;
    
    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: getJobDescriptionSystemPrompt(tone) },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 150,
    });
    
    const content = response.choices[0].message.content?.trim() || '';
    
    // Process the response - split by bullet points or new lines
    const bulletPoints = content
      .split(/\n|•|\*|\-/)
      .map(point => point.trim())
      .filter(point => point.length > 0);
      
    // Ensure we have exactly 3 bullet points
    const processedPoints = bulletPoints.slice(0, 3);
    while (processedPoints.length < 3) {
      processedPoints.push(`Contributed to ${company}'s success through strategic initiatives and collaborative efforts`);
    }
    
    // Cache the response
    cacheResponse(cacheKey, processedPoints.join('\n'));
    
    return processedPoints;
  } catch (error: any) {
    console.error('Error generating job description:', error);
    
    if (error instanceof AIServiceError) {
      throw error;
    }
    
    if (error.name === 'RateLimitError') {
      throw new AIServiceError(
        'OpenAI rate limit exceeded. Please try again later.',
        AIServiceErrorType.RATE_LIMIT
      );
    }
    
    if (error.name === 'APIError') {
      throw new AIServiceError(
        'OpenAI API error. Please try again later.',
        AIServiceErrorType.API_ERROR
      );
    }
    
    throw new AIServiceError(
      'An error occurred while generating the job description.',
      AIServiceErrorType.UNKNOWN_ERROR
    );
  }
}

// Generate skill suggestions
export async function generateSkillSuggestions(
  jobTitle: string,
  workExperiences: any[],
  tone: 'professional' | 'confident' | 'friendly' = 'professional'
): Promise<string[]> {
  try {
    // Create a cache key
    const cacheKey = generateCacheKey('skills', {
      jobTitle,
      workExperiences: workExperiences.map(w => ({ title: w.jobTitle, company: w.company })),
      tone
    });
    
    // Check cache first
    const cachedResponse = getCachedResponse(cacheKey);
    if (cachedResponse) return cachedResponse.split(',').map(skill => skill.trim());
    
    // Check rate limit
    checkRateLimit();
    
    // Prepare the prompt
    const workHistory = workExperiences.map((job: any) => 
      `${job.jobTitle} at ${job.company}`
    ).join(', ');
    
    const userPrompt = `Current/desired job title: ${jobTitle}\n\nWork experience: ${workHistory}\n\nSuggest relevant professional skills for my CV.`;
    
    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: getSkillsSystemPrompt(tone) },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 100,
    });
    
    const content = response.choices[0].message.content?.trim() || '';
    
    // Process the response - split by commas
    const skills = content.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
    
    // Cache the response
    cacheResponse(cacheKey, skills.join(', '));
    
    return skills;
  } catch (error: any) {
    console.error('Error generating skill suggestions:', error);
    
    if (error instanceof AIServiceError) {
      throw error;
    }
    
    if (error.name === 'RateLimitError') {
      throw new AIServiceError(
        'OpenAI rate limit exceeded. Please try again later.',
        AIServiceErrorType.RATE_LIMIT
      );
    }
    
    if (error.name === 'APIError') {
      throw new AIServiceError(
        'OpenAI API error. Please try again later.',
        AIServiceErrorType.API_ERROR
      );
    }
    
    throw new AIServiceError(
      'An error occurred while generating skill suggestions.',
      AIServiceErrorType.UNKNOWN_ERROR
    );
  }
}

// Rate AI-generated content (feedback mechanism)
export function rateAIContent(contentType: string, contentId: string, rating: 'positive' | 'negative') {
  // This would typically send the rating to a backend for analysis
  // For now, we'll just log it and could implement proper tracking later
  console.log(`User rated ${contentType} (ID: ${contentId}) as ${rating}`);
  
  // Future enhancement: send to backend or analytics service
  // Could also be used to improve AI suggestions over time
  return true;
}
