/**
 * CV Chap Chap Template Ordering
 * 
 * This module provides functions to sort templates based on the client's priorities.
 */

import { CVTemplate } from './simple-template-registry';
import { TemplateWithMetadata } from './templates-registry';

// Define template priority order - templates not in this list will be placed at the end
const templatePriorityOrder = [
  'kilimanjaro',        // 1
  'tanzanitePro',       // 2
  'safariOriginal',     // 3
  'brightDiamond',      // 4
  'streetHustler',      // 5
  'mwalimuOne',         // 6
  'serengetiFlow',      // 7
  'mjenziWaTaifa',      // 8
  'jijengeClassic',     // 9
  'bigBoss',            // 10
  'madiniMob',          // 11
  'moonlightSonata',    // 12
  'kaziFasta',          // 13
  'smartBongo',         // 14
  'mkaliModern'         // 15
];

// Home page featured templates
export const homePageFeaturedTemplates = [
  'kilimanjaro',
  'tanzanitePro',
  'safariOriginal',
  'brightDiamond'
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