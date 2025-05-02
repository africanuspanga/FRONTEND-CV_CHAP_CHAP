import OpenAI from 'openai';
import { toast } from '@/hooks/use-toast';

// Store API key in memory during the session
let openAIApiKey: string | null = null;

/**
 * Set the OpenAI API key
 */
export const setOpenAIApiKey = (apiKey: string) => {
  openAIApiKey = apiKey;
  // Store in session storage to preserve during page refreshes
  // but not permanently
  sessionStorage.setItem('openai_api_key', apiKey);
};

/**
 * Get the OpenAI API key
 */
export const getOpenAIApiKey = (): string | null => {
  // Try to get from memory first
  if (openAIApiKey) return openAIApiKey;
  
  // Then try session storage
  const storedKey = sessionStorage.getItem('openai_api_key');
  if (storedKey) {
    openAIApiKey = storedKey;
    return storedKey;
  }
  
  return null;
};

/**
 * Clear the stored API key
 */
export const clearOpenAIApiKey = () => {
  openAIApiKey = null;
  sessionStorage.removeItem('openai_api_key');
};

/**
 * Check if OpenAI API key is available
 */
export const hasOpenAIApiKey = (): boolean => {
  return !!getOpenAIApiKey();
};

/**
 * Initialize the OpenAI client
 */
const getOpenAIClient = () => {
  const apiKey = getOpenAIApiKey();
  if (!apiKey) {
    throw new Error('OpenAI API key not set');
  }
  
  return new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
};

/**
 * Generate work experience bullet points based on job title and company
 */
export const generateWorkExperienceBullets = async (
  jobTitle: string,
  company: string,
  additionalContext?: string
): Promise<string[]> => {
  try {
    if (!hasOpenAIApiKey()) {
      return [
        `Led cross-functional teams in ${company} to deliver innovative solutions on time and within budget`,
        `Implemented process improvements resulting in 25% efficiency gain at ${company}`,
        `Developed and maintained strong client relationships, contributing to 30% year-over-year business growth`,
        `Collaborated with internal teams to streamline operations and enhance service delivery`,
      ];
    }
    
    const openai = getOpenAIClient();
    
    const prompt = `Generate 4-5 professional and impressive bullet points for a resume/CV for someone who worked as a ${jobTitle} at ${company}.${additionalContext ? ` Additional context: ${additionalContext}` : ''}`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{
        role: "system",
        content: "You are a professional CV writer that specializes in creating powerful, impactful bullet points for work experience sections. Generate 4-5 accomplishment-focused bullet points that emphasize achievements, skills, and impact. Use action verbs and quantify results when possible. Format as a JSON array of strings without numbers or bullets."
      }, {
        role: "user",
        content: prompt
      }],
      response_format: { type: "json_object" }
    });
    
    const result = JSON.parse(response.choices[0].message.content);
    return result.bullets || [];
    
  } catch (error) {
    console.error('Error generating work experience bullets:', error);
    toast({
      title: 'AI Enhancement Failed',
      description: error instanceof Error ? error.message : 'Unknown error occurred',
      variant: 'destructive',
    });
    
    // Return fallback suggestions that don't look AI-generated
    return [
      `Led key initiatives at ${company} to improve operational efficiency`,
      `Collaborated with cross-functional teams to deliver high-quality results`,
      `Developed innovative solutions to address complex business challenges`,
      `Maintained strong relationships with stakeholders and team members`,
    ];
  }
};

/**
 * Generate skills recommendations based on job title and experience
 */
export const generateSkillsRecommendations = async (
  jobTitle: string,
  workExperience: string
): Promise<string[]> => {
  try {
    if (!hasOpenAIApiKey()) {
      return [
        'Project Management',
        'Team Leadership',
        'Strategic Planning',
        'Communication',
        'Problem Solving',
        'Data Analysis',
        'Microsoft Office Suite',
        'CRM Software',
      ];
    }
    
    const openai = getOpenAIClient();
    
    const prompt = `Generate a list of 8-10 relevant skills for someone who worked as a ${jobTitle} with the following work experience: ${workExperience}`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{
        role: "system",
        content: "You are a professional CV writer specializing in identifying relevant skills based on job titles and work experience. Generate a list of 8-10 skills that would be valuable to include in a CV. Focus on both hard skills and soft skills. Format as a JSON array of strings."
      }, {
        role: "user",
        content: prompt
      }],
      response_format: { type: "json_object" }
    });
    
    const result = JSON.parse(response.choices[0].message.content);
    return result.skills || [];
    
  } catch (error) {
    console.error('Error generating skills recommendations:', error);
    toast({
      title: 'AI Enhancement Failed',
      description: error instanceof Error ? error.message : 'Unknown error occurred',
      variant: 'destructive',
    });
    
    // Return fallback suggestions
    return [
      'Project Management',
      'Team Leadership',
      'Communication',
      'Problem Solving',
      'Strategic Planning',
      'Data Analysis',
      'Microsoft Office Suite',
      'Customer Relationship Management',
    ];
  }
};

/**
 * Enhance a professional summary with AI
 */
export const enhanceProfessionalSummary = async (
  currentSummary: string,
  jobTitle?: string,
  experience?: string
): Promise<string> => {
  try {
    if (!hasOpenAIApiKey()) {
      return currentSummary.length > 0
        ? `${currentSummary} with a proven track record of achieving results through innovative thinking and leadership. Skilled in developing strategic initiatives that drive organizational growth while fostering a collaborative team environment.`
        : 'Accomplished professional with extensive experience in delivering high-impact results through strategic planning and exemplary leadership. Adept at identifying opportunities for improvement and implementing solutions that drive business growth while maintaining operational excellence.';
    }
    
    const openai = getOpenAIClient();
    
    let prompt = 'Enhance the following professional summary to make it more impactful, professional, and engaging:';
    
    if (currentSummary.trim().length > 0) {
      prompt += `\n\nCurrent summary: ${currentSummary}`;
    } else {
      prompt += '\n\nThe current summary is empty. Please generate a professional summary';
    }
    
    if (jobTitle) {
      prompt += `\n\nJob title: ${jobTitle}`;
    }
    
    if (experience) {
      prompt += `\n\nWork experience: ${experience}`;
    }
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{
        role: "system",
        content: "You are a professional CV writer specializing in creating powerful, concise, and impactful professional summaries. Enhance or create a summary that is compelling, highlights value, and avoids clichés. Keep the length to 3-5 sentences maximum. Return just the summary text without any additional commentary or formatting."
      }, {
        role: "user",
        content: prompt
      }]
    });
    
    return response.choices[0].message.content.trim();
    
  } catch (error) {
    console.error('Error enhancing professional summary:', error);
    toast({
      title: 'AI Enhancement Failed',
      description: error instanceof Error ? error.message : 'Unknown error occurred',
      variant: 'destructive',
    });
    
    // Return slightly enhanced original or a default if empty
    if (currentSummary.trim().length > 0) {
      return currentSummary;
    } else {
      return 'Professional with experience in delivering results through strategic planning and collaboration. Dedicated to continuous improvement and achieving organizational objectives while maintaining high standards of quality and service.';
    }
  }
};
