export interface LetterSender {
  name: string;
  email: string;
  phone: string;
  city: string;
}

export interface LetterRecipient {
  name: string;
  company: string;
  city: string;
}

export interface LetterJob {
  title: string;
  company: string;
  description: string;
  isRemote: boolean;
  hasSpecificJob: boolean;
  hasJobDescription: boolean;
}

export interface LetterSignature {
  mode: 'type' | 'draw';
  fontFamily: string;
  dataUrl: string;
}

export interface LetterData {
  templateId: string;
  sender: LetterSender;
  recipient: LetterRecipient;
  job: LetterJob;
  strengths: string[];
  signature: LetterSignature;
  paragraphs: string[];
  date: string;
}

export interface LetterTemplateConfig {
  id: string;
  name: string;
  description: string;
  category: 'professional' | 'modern' | 'creative';
}

export const LETTER_TEMPLATES: LetterTemplateConfig[] = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Dark top line, centered name, serif body',
    category: 'professional',
  },
  {
    id: 'whitespace',
    name: 'Whitespace',
    description: 'Minimal, generous spacing, sans-serif',
    category: 'modern',
  },
  {
    id: 'contempo',
    name: 'Contempo',
    description: 'Teal accent bar, right-aligned name',
    category: 'modern',
  },
  {
    id: 'managerial',
    name: 'Managerial',
    description: 'Navy header block with initials, serif body',
    category: 'professional',
  },
  {
    id: 'refined',
    name: 'Refined',
    description: 'Double line border, elegant serif',
    category: 'professional',
  },
  {
    id: 'pacific',
    name: 'Pacific',
    description: 'Gradient header, bold sans-serif',
    category: 'creative',
  },
];

export const STRENGTH_OPTIONS = [
  'Leadership',
  'Problem Solving',
  'Communication',
  'Teamwork',
  'Time Management',
  'Adaptability',
  'Critical Thinking',
  'Creativity',
  'Attention to Detail',
  'Project Management',
  'Data Analysis',
  'Customer Service',
  'Strategic Planning',
  'Negotiation',
  'Public Speaking',
  'Technical Skills',
  'Research',
  'Organization',
];

export const SIGNATURE_FONTS = [
  { id: 'dancing-script', name: 'Dancing Script', family: "'Dancing Script', cursive" },
  { id: 'great-vibes', name: 'Great Vibes', family: "'Great Vibes', cursive" },
  { id: 'pacifico', name: 'Pacifico', family: "'Pacifico', cursive" },
  { id: 'sacramento', name: 'Sacramento', family: "'Sacramento', cursive" },
  { id: 'caveat', name: 'Caveat', family: "'Caveat', cursive" },
];

export const LETTER_STEPS = [
  { id: 'template', title: 'Template', path: '/letter' },
  { id: 'job', title: 'Job Details', path: '/letter/job' },
  { id: 'strengths', title: 'Strengths', path: '/letter/strengths' },
  { id: 'signature', title: 'Signature', path: '/letter/signature' },
  { id: 'preview', title: 'Preview', path: '/letter/preview' },
] as const;
