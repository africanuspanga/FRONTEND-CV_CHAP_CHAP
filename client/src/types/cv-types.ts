// Type definitions for CV data structure

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode?: string;
  professionalTitle?: string;
  jobTitle?: string;
  summary?: string;
  profileImage?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current?: boolean;
  description: string;
  achievements?: string[];
  location?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current?: boolean;
  description?: string;
  location?: string;
  gpa?: string;
}

export interface Skill {
  id: string;
  name: string;
  level?: number; // 1-5 or 1-100 depending on UI
  category?: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'Basic' | 'Conversational' | 'Fluent' | 'Native' | string;
}

export interface Reference {
  id: string;
  name: string;
  company: string;
  position: string;
  email?: string;
  phone?: string;
  relationship?: string;
}

export interface Certification {
  id: string;
  name: string;
  organization: string;
  date: string;
  expiryDate?: string;
  credentialID?: string;
  url?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate?: string;
  endDate?: string;
  url?: string;
  technologies?: string[];
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
}

export interface WebsiteEntry {
  id: string;
  name: string;
  url: string;
}

export interface Volunteer {
  id: string;
  organization: string;
  position: string;
  startDate: string;
  endDate: string;
  current?: boolean;
  description?: string;
  location?: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  workExperiences: WorkExperience[];
  workExp?: WorkExperience[]; // Alternative name used in some places
  education: Education[];
  skills: Skill[];
  languages: Language[];
  references: Reference[];
  certifications?: Certification[];
  projects?: Project[];
  awards?: Award[];
  websites?: WebsiteEntry[];
  volunteer?: Volunteer[];
  hobbies?: string[];
  templateId?: string;
  profileColor?: string;
  accentColor?: string;
  summary?: string;
  resumeLanguage?: string;
  additionalSections?: {
    [key: string]: any;
  };
}