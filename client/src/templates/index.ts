import { MoonlightSonataTemplate } from './moonlightSonata';
import { CVData } from '@shared/schema';

export interface CVTemplate {
  id: string;
  name: string;
  render: (data: CVData) => JSX.Element;
}

export const templates: Record<string, CVTemplate> = {
  moonlightSonata: {
    id: 'moonlightSonata',
    name: 'Moonlight Sonata',
    render: MoonlightSonataTemplate
  },
  // Additional templates can be added here as they're created
};

export function getTemplateByID(id: string): CVTemplate | undefined {
  return templates[id];
}

export function getAllTemplates(): CVTemplate[] {
  return Object.values(templates);
}
