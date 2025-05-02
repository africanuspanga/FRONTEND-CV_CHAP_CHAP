/**
 * Main exports file for the lib directory
 */

// Export from the simple-template-registry
export { getAllTemplates, getTemplateByID, getTemplatesByCategory } from './simple-template-registry';

// Export from the templates-registry with metadata
export { 
  getAllTemplatesWithMetadata,
  getTemplateWithMetadata,
  getPopularTemplates,
  getNewTemplates,
  getProTemplates,
  applyColorScheme
} from './templates-registry';

// Export types
export type { CVTemplate } from './simple-template-registry';
export type { ColorScheme, TemplateWithMetadata } from './templates-registry';
