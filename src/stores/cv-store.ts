import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { CVData, WorkExperience, Education, Skill, Language, Reference, CVFormStep } from '@/types/cv';

const defaultCVData: CVData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    professionalTitle: '',
    location: '',
    linkedin: '',
    website: '',
  },
  summary: '',
  workExperiences: [],
  education: [],
  skills: [],
  languages: [],
  references: [],
};

interface CVStore {
  cvId: string | null;
  templateId: string;
  selectedColor: string | null;
  cvData: CVData;
  currentStep: CVFormStep;
  
  setCurrentStep: (step: CVFormStep) => void;
  setTemplateId: (id: string) => void;
  setSelectedColor: (color: string | null) => void;
  updatePersonalInfo: (data: Partial<CVData['personalInfo']>) => void;
  setSummary: (summary: string) => void;
  
  addWorkExperience: (exp?: Partial<WorkExperience>) => void;
  updateWorkExperience: (id: string, data: Partial<WorkExperience>) => void;
  removeWorkExperience: (id: string) => void;
  reorderWorkExperiences: (startIndex: number, endIndex: number) => void;
  
  addEducation: (edu?: Partial<Education>) => void;
  updateEducation: (id: string, data: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  
  addSkill: (skill?: Partial<Skill>) => void;
  updateSkill: (id: string, data: Partial<Skill>) => void;
  removeSkill: (id: string) => void;
  setSkills: (skills: Skill[]) => void;
  
  addLanguage: (lang?: Partial<Language>) => void;
  updateLanguage: (id: string, data: Partial<Language>) => void;
  removeLanguage: (id: string) => void;
  
  addReference: (ref?: Partial<Reference>) => void;
  updateReference: (id: string, data: Partial<Reference>) => void;
  removeReference: (id: string) => void;
  
  resetCV: () => void;
  loadCV: (data: Partial<CVData>, templateId?: string) => void;
  setCVId: (id: string) => void;
}

export const useCVStore = create<CVStore>()(
  persist(
    (set) => ({
      cvId: null,
      templateId: 'charles',
      selectedColor: null,
      cvData: defaultCVData,
      currentStep: 'template',

      setCurrentStep: (step) => set({ currentStep: step }),
      setTemplateId: (id) => set({ templateId: id }),
      setSelectedColor: (color) => set({ selectedColor: color }),

      updatePersonalInfo: (data) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            personalInfo: { ...state.cvData.personalInfo, ...data },
          },
        })),

      setSummary: (summary) =>
        set((state) => ({
          cvData: { ...state.cvData, summary },
        })),

      addWorkExperience: (exp) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            workExperiences: [
              ...state.cvData.workExperiences,
              {
                id: nanoid(),
                jobTitle: '',
                company: '',
                location: '',
                startDate: '',
                endDate: '',
                isCurrent: false,
                achievements: [],
                ...exp,
              },
            ],
          },
        })),

      updateWorkExperience: (id, data) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            workExperiences: state.cvData.workExperiences.map((exp) =>
              exp.id === id ? { ...exp, ...data } : exp
            ),
          },
        })),

      removeWorkExperience: (id) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            workExperiences: state.cvData.workExperiences.filter(
              (exp) => exp.id !== id
            ),
          },
        })),

      reorderWorkExperiences: (startIndex, endIndex) =>
        set((state) => {
          const result = Array.from(state.cvData.workExperiences);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return {
            cvData: { ...state.cvData, workExperiences: result },
          };
        }),

      addEducation: (edu) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            education: [
              ...state.cvData.education,
              {
                id: nanoid(),
                degree: '',
                institution: '',
                fieldOfStudy: '',
                graduationDate: '',
                ...edu,
              },
            ],
          },
        })),

      updateEducation: (id, data) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            education: state.cvData.education.map((edu) =>
              edu.id === id ? { ...edu, ...data } : edu
            ),
          },
        })),

      removeEducation: (id) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            education: state.cvData.education.filter((edu) => edu.id !== id),
          },
        })),

      addSkill: (skill) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            skills: [
              ...state.cvData.skills,
              {
                id: nanoid(),
                name: '',
                level: 'intermediate' as const,
                ...skill,
              },
            ],
          },
        })),

      updateSkill: (id, data) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            skills: state.cvData.skills.map((skill) =>
              skill.id === id ? { ...skill, ...data } : skill
            ),
          },
        })),

      removeSkill: (id) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            skills: state.cvData.skills.filter((skill) => skill.id !== id),
          },
        })),

      setSkills: (skills) =>
        set((state) => ({
          cvData: { ...state.cvData, skills },
        })),

      addLanguage: (lang) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            languages: [
              ...state.cvData.languages,
              {
                id: nanoid(),
                name: '',
                proficiency: 'conversational' as const,
                ...lang,
              },
            ],
          },
        })),

      updateLanguage: (id, data) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            languages: state.cvData.languages.map((lang) =>
              lang.id === id ? { ...lang, ...data } : lang
            ),
          },
        })),

      removeLanguage: (id) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            languages: state.cvData.languages.filter((lang) => lang.id !== id),
          },
        })),

      addReference: (ref) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            references: [
              ...state.cvData.references,
              {
                id: nanoid(),
                name: '',
                title: '',
                company: '',
                phone: '',
                email: '',
                ...ref,
              },
            ],
          },
        })),

      updateReference: (id, data) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            references: state.cvData.references.map((ref) =>
              ref.id === id ? { ...ref, ...data } : ref
            ),
          },
        })),

      removeReference: (id) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            references: state.cvData.references.filter((ref) => ref.id !== id),
          },
        })),

      resetCV: () =>
        set({
          cvId: null,
          templateId: 'charles',
          selectedColor: null,
          cvData: defaultCVData,
          currentStep: 'template',
        }),

      loadCV: (data, templateId) =>
        set((state) => ({
          cvData: { ...state.cvData, ...data },
          templateId: templateId || state.templateId,
        })),

      setCVId: (id) => set({ cvId: id }),
    }),
    {
      name: 'cv-chap-chap-storage',
    }
  )
);
