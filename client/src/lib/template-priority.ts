/**
 * CV Chap Chap Template Ordering
 * 
 * This module provides functions to sort templates based on the client's priorities.
 */

import { CVTemplate } from './simple-template-registry';
import { TemplateWithMetadata } from './templates-registry';

// Define template priority order - ONLY RELIABLE TEMPLATES
const templatePriorityOrder = [
  'brightDiamond',      // 1 - Bright Diamond
  'madiniMob',          // 2 - Madini Mob
  'mjenziWaTaifa',      // 3 - Mjenzi wa Taifa
  'bigBoss',            // 4 - Big Boss
  'mwalimuOne',         // 5 - Mwalimu One
  'serengetiFlow'       // 6 - Serengeti Flow
  // All other templates are archived/hidden as they are not reliable
];

// Home page featured templates - using only the 6 reliable templates
export const homePageFeaturedTemplates = [
  'brightDiamond',
  'madiniMob',
  'mjenziWaTaifa',
  'bigBoss',
  'mwalimuOne',
  'serengetiFlow'
];

/**
 * Sort templates by the defined priority order
 */
export function sortTemplatesByPriority<T extends {id: string}>(templates: T[]): T[] {
  return [...templates].sort((a, b) => {
    const indexA = templatePriorityOrder.indexOf(a.id);
    const indexB = templatePriorityOrder.indexOf(b.id);
    
    // If both templates are in the priority list, sort by their position
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }
    
    // If only one template is in the priority list, it should come first
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    
    // If neither template is in the priority list, maintain their original order
    return 0;
  });
}

/**
 * Get featured templates for the home page
 */
export function getFeaturedTemplates(templates: TemplateWithMetadata[]): TemplateWithMetadata[] {
  return templates.filter(template => homePageFeaturedTemplates.includes(template.id));
}