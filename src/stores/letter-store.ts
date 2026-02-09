import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LetterData, LetterSender, LetterRecipient, LetterJob, LetterSignature } from '@/types/letter';

const defaultLetterData: LetterData = {
  templateId: 'professional',
  sender: {
    name: '',
    email: '',
    phone: '',
    city: '',
  },
  recipient: {
    name: '',
    company: '',
    city: '',
  },
  job: {
    title: '',
    company: '',
    description: '',
    isRemote: false,
    hasSpecificJob: true,
    hasJobDescription: false,
  },
  strengths: [],
  signature: {
    mode: 'type',
    fontFamily: "'Dancing Script', cursive",
    dataUrl: '',
  },
  paragraphs: [],
  date: '',
};

interface LetterStore {
  letterData: LetterData;

  setTemplateId: (id: string) => void;
  updateSender: (data: Partial<LetterSender>) => void;
  updateRecipient: (data: Partial<LetterRecipient>) => void;
  updateJob: (data: Partial<LetterJob>) => void;
  setStrengths: (strengths: string[]) => void;
  updateSignature: (data: Partial<LetterSignature>) => void;
  setParagraphs: (paragraphs: string[]) => void;
  setDate: (date: string) => void;
  resetLetter: () => void;
}

export const useLetterStore = create<LetterStore>()(
  persist(
    (set) => ({
      letterData: defaultLetterData,

      setTemplateId: (id) =>
        set((state) => ({
          letterData: { ...state.letterData, templateId: id },
        })),

      updateSender: (data) =>
        set((state) => ({
          letterData: {
            ...state.letterData,
            sender: { ...state.letterData.sender, ...data },
          },
        })),

      updateRecipient: (data) =>
        set((state) => ({
          letterData: {
            ...state.letterData,
            recipient: { ...state.letterData.recipient, ...data },
          },
        })),

      updateJob: (data) =>
        set((state) => ({
          letterData: {
            ...state.letterData,
            job: { ...state.letterData.job, ...data },
          },
        })),

      setStrengths: (strengths) =>
        set((state) => ({
          letterData: { ...state.letterData, strengths },
        })),

      updateSignature: (data) =>
        set((state) => ({
          letterData: {
            ...state.letterData,
            signature: { ...state.letterData.signature, ...data },
          },
        })),

      setParagraphs: (paragraphs) =>
        set((state) => ({
          letterData: { ...state.letterData, paragraphs },
        })),

      setDate: (date) =>
        set((state) => ({
          letterData: { ...state.letterData, date },
        })),

      resetLetter: () =>
        set({ letterData: { ...defaultLetterData } }),
    }),
    {
      name: 'cv-chap-chap-letter-storage',
    }
  )
);
