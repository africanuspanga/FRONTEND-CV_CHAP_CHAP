/**
 * AI Enhancers for CV Chap Chap
 * This module centralizes AI-related functionality
 */

// Re-export the OpenAI service functions
export {
  hasOpenAIApiKey,
  getOpenAIApiKey,
  getWorkExperienceRecommendations,
  getSkillRecommendations,
  enhanceProfessionalSummary,
} from './openai-service';

// Re-export the AI components
export { default as AIKeyInput } from '@/components/AIKeyInput';
export { default as WorkExperienceAIRecommendations } from '@/components/WorkExperienceAIRecommendations';
export { default as SkillsAIRecommendations } from '@/components/SkillsAIRecommendations';
export { default as SummaryAIEnhancement } from '@/components/SummaryAIEnhancement';
