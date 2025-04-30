import { CVData, PersonalInfo, WorkExperience, Education, Skill, Language, Reference } from '@shared/schema';

export interface CVTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  render: (data: CVData) => JSX.Element;
}

export interface CVFormProps {
  cvData: CVData;
  updateCVData: (data: Partial<CVData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export interface FormStep {
  id: string;
  title: string;
  component: React.ComponentType<CVFormProps>;
}

export interface PersonalInfoFormProps {
  defaultValues: PersonalInfo;
  onSubmit: (data: PersonalInfo) => void;
  onBack: () => void;
}

export interface WorkExperienceFormProps {
  defaultValues: WorkExperience[];
  onSubmit: (data: WorkExperience[]) => void;
  onBack: () => void;
  onNext: () => void;
}

export interface EducationFormProps {
  defaultValues: Education[];
  onSubmit: (data: Education[]) => void;
  onBack: () => void;
  onNext: () => void;
}

export interface SkillsFormProps {
  defaultValues: Skill[];
  onSubmit: (data: Skill[]) => void;
  onBack: () => void;
  onNext: () => void;
}

export interface LanguagesFormProps {
  defaultValues: Language[];
  onSubmit: (data: Language[]) => void;
  onBack: () => void;
  onNext: () => void;
}

export interface ReferencesFormProps {
  defaultValues: Reference[];
  onSubmit: (data: Reference[]) => void;
  onBack: () => void;
  onNext: () => void;
}

export interface SummaryFormProps {
  defaultValue: string;
  onSubmit: (data: { summary: string }) => void;
  onBack: () => void;
  onNext: () => void;
}
