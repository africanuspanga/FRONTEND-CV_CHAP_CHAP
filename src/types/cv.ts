export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  professionalTitle: string;
  location: string;
  linkedin?: string;
  website?: string;
  photoUrl?: string;
}

export interface WorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  achievements: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  fieldOfStudy: string;
  graduationDate: string;
  location?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'basic' | 'conversational' | 'fluent' | 'native';
}

export interface Reference {
  id: string;
  name: string;
  title: string;
  position?: string;
  company: string;
  phone: string;
  email: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface SocialLink {
  id: string;
  url: string;
  showInHeader: boolean;
}

export interface Accomplishment {
  id: string;
  description: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  summary: string;
  workExperiences: WorkExperience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  references: Reference[];
  certifications: Certification[];
  socialLinks: SocialLink[];
  accomplishments: Accomplishment[];
}

export interface CVDocument {
  id: string;
  userId: string | null;
  anonymousId: string | null;
  templateId: string;
  data: CVData;
  status: 'draft' | 'pending_payment' | 'paid' | 'downloaded';
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  cvId: string;
  requestId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  paymentMethod: string | null;
  transactionId: string | null;
  selcomReference: string | null;
  createdAt: string;
  completedAt: string | null;
}

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  previewImage: string;
  category: 'professional' | 'modern' | 'creative' | 'simple';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export const TEMPLATES: TemplateConfig[] = [
  {
    id: 'classic-professional',
    name: 'Classic Professional',
    description: 'Clean, traditional layout perfect for corporate roles',
    previewImage: '/templates/classic-professional.png',
    category: 'professional',
    colors: { primary: '#1a365d', secondary: '#2d3748', accent: '#3182ce' },
  },
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    description: 'Sleek design with plenty of white space',
    previewImage: '/templates/modern-minimal.png',
    category: 'modern',
    colors: { primary: '#000000', secondary: '#4a5568', accent: '#667eea' },
  },
  {
    id: 'kilimanjaro',
    name: 'Kilimanjaro',
    description: 'Bold East African inspired design',
    previewImage: '/templates/kilimanjaro.png',
    category: 'creative',
    colors: { primary: '#744210', secondary: '#975a16', accent: '#d69e2e' },
  },
  {
    id: 'serengeti',
    name: 'Serengeti',
    description: 'Warm, inviting layout with natural tones',
    previewImage: '/templates/serengeti.png',
    category: 'creative',
    colors: { primary: '#652B19', secondary: '#7B341E', accent: '#C05621' },
  },
  {
    id: 'dar-skyline',
    name: 'Dar Skyline',
    description: 'Modern urban design for tech professionals',
    previewImage: '/templates/dar-skyline.png',
    category: 'modern',
    colors: { primary: '#1a202c', secondary: '#2d3748', accent: '#38b2ac' },
  },
  {
    id: 'zanzibar',
    name: 'Zanzibar',
    description: 'Fresh, coastal-inspired professional template',
    previewImage: '/templates/zanzibar.png',
    category: 'professional',
    colors: { primary: '#234E52', secondary: '#285E61', accent: '#319795' },
  },
];

export const CV_FORM_STEPS = [
  { id: 'template', title: 'Choose Template', path: '/template' },
  { id: 'personal', title: 'Personal Info', path: '/personal' },
  { id: 'experience', title: 'Work Experience', path: '/experience' },
  { id: 'education', title: 'Education', path: '/education' },
  { id: 'skills', title: 'Skills', path: '/skills' },
  { id: 'summary', title: 'Summary', path: '/summary' },
  { id: 'references', title: 'References', path: '/references' },
  { id: 'additional', title: 'Additional Sections', path: '/additional' },
  { id: 'preview', title: 'Preview', path: '/preview' },
  { id: 'payment', title: 'Download', path: '/payment' },
] as const;

export type CVFormStep = typeof CV_FORM_STEPS[number]['id'];
