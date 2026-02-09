import type { LetterData } from '@/types/letter';

export const sampleLetterData: LetterData = {
  templateId: 'professional',
  sender: {
    name: 'Noela Bwemero',
    email: 'noela.bwemero@lexchambers.co.tz',
    phone: '+255 754 892 341',
    city: 'Dar es Salaam',
  },
  recipient: {
    name: 'James Mwakasege',
    company: 'Mkono & Co. Advocates',
    city: 'Dar es Salaam',
  },
  job: {
    title: 'Senior Corporate Lawyer',
    company: 'Mkono & Co. Advocates',
    description: '',
    isRemote: false,
    hasSpecificJob: true,
    hasJobDescription: false,
  },
  strengths: ['Leadership', 'Negotiation', 'Critical Thinking'],
  signature: {
    mode: 'type',
    fontFamily: "'Dancing Script', cursive",
    dataUrl: '',
  },
  paragraphs: [
    'I am writing to express my strong interest in the Senior Corporate Lawyer position at Mkono & Co. Advocates. Having researched your company and its values, I am confident that my background and skills make me an excellent fit for this role.',
    'Throughout my career, I have developed strong leadership, negotiation, and critical thinking skills that have consistently enabled me to deliver results. These competencies, combined with my passion for excellence, have allowed me to make meaningful contributions in every role I have held.',
    'I am particularly drawn to Mkono & Co. Advocates and am excited about the opportunity to contribute to your team. I believe my skills and experience align well with your company\'s mission, and I am eager to bring my expertise to help drive continued success.',
    'Thank you for considering my application. I would welcome the opportunity to discuss how my qualifications and experience can benefit Mkono & Co. Advocates. I look forward to hearing from you at your earliest convenience.',
  ],
  date: 'February 9, 2026',
};
