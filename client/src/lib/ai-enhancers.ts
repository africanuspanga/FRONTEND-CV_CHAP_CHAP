/**
 * AI Enhancement utilities for CV Chap Chap
 * This file centralizes all AI enhancement functions and utilities
 * for easier management and usage across components
 */

import {
  hasOpenAIApiKey,
  setOpenAIApiKey,
  clearOpenAIApiKey,
  getOpenAIApiKey,
  generateWorkExperienceBullets,
  generateSkillsRecommendations,
  enhanceProfessionalSummary
} from './openai-service';

// Export centralized AI key management
export const AIKeyManagement = {
  hasKey: hasOpenAIApiKey,
  setKey: setOpenAIApiKey,
  clearKey: clearOpenAIApiKey,
  getKey: getOpenAIApiKey
};

// Export AI enhancement utilities
export const AIEnhancers = {
  generateWorkExperienceBullets,
  generateSkillsRecommendations,
  enhanceProfessionalSummary
};

// Check if AI enhancements are available
export const isAIAvailable = (): boolean => {
  return hasOpenAIApiKey();
};

// Export all AI components for easy import
export { default as AIKeyInput } from '@/components/AIKeyInput';
export { default as WorkExperienceAIRecommendations } from '@/components/WorkExperienceAIRecommendations';
export { default as SkillsAIRecommendations } from '@/components/SkillsAIRecommendations';
export { default as SummaryAIEnhancement } from '@/components/SummaryAIEnhancement';
