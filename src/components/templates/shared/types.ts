import type { CVData, WorkExperience, Education, Skill, Language, Reference } from '@/types/cv';

export interface TemplateProps {
  data: CVData;
}

export interface TemplateColors {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  lightText: string;
  background: string;
  sidebarBg?: string;
}

export interface TemplateStyles {
  colors: TemplateColors;
  fontFamily: string;
  headerStyle: 'centered' | 'left' | 'sidebar';
  sectionStyle: 'underline' | 'background' | 'border-left' | 'badge' | 'minimal';
  skillStyle: 'list' | 'badges' | 'bars' | 'circles' | 'dots';
  layout: 'single' | 'two-column' | 'sidebar-left' | 'sidebar-right';
}
