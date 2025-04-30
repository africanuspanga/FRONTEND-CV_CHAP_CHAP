import { CVData } from '@shared/schema';

/**
 * Sample CV data for demonstrations, previews and testing
 */
export const sampleCVData: CVData = {
  personalInfo: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+255 123 456 789',
    location: 'Dar es Salaam, Tanzania',
    website: 'johndoe.com',
    linkedin: 'linkedin.com/in/johndoe',
    jobTitle: 'Senior Web Developer',
  },
  summary: 'Experienced web developer with over 5 years of expertise in building responsive, user-friendly web applications. Proficient in modern JavaScript frameworks and committed to writing clean, maintainable code.',
  workExperience: [
    {
      id: '1',
      jobTitle: 'Senior Web Developer',
      company: 'Tech Solutions Ltd',
      location: 'Dar es Salaam',
      startDate: 'Jan 2020',
      endDate: '',
      current: true,
      description: 'Lead development team in creating responsive web applications for diverse clients. Implement best practices for code quality and performance optimization.'
    },
    {
      id: '2',
      jobTitle: 'Frontend Developer',
      company: 'Digital Innovations',
      location: 'Nairobi',
      startDate: 'Mar 2018',
      endDate: 'Dec 2019',
      current: false,
      description: 'Developed user interfaces using React and maintained existing web applications. Collaborated with design team to implement responsive interfaces.'
    }
  ],
  education: [
    {
      id: '1',
      institution: 'University of Dar es Salaam',
      degree: 'Bachelor of Science, Computer Science',
      startDate: '2014',
      endDate: '2018',
      current: false,
      description: 'Graduated with honors. Specialized in software engineering and database systems.'
    }
  ],
  skills: [
    { id: '1', name: 'JavaScript' },
    { id: '2', name: 'React' },
    { id: '3', name: 'Node.js' },
    { id: '4', name: 'Python' },
    { id: '5', name: 'SQL' },
    { id: '6', name: 'Git' }
  ],
  languages: [
    { id: '1', name: 'English', proficiency: 'Fluent' },
    { id: '2', name: 'Swahili', proficiency: 'Native' }
  ],
  references: [
    {
      id: '1',
      name: 'Jane Smith',
      position: 'Director of Operations',
      company: 'Global Company Inc.',
      email: 'jane.smith@example.com',
      phone: '+255 987 654 321'
    }
  ],
  projects: [
    {
      id: '1',
      name: 'E-commerce Platform',
      description: 'Developed a full-featured online store with payment integration and inventory management',
      url: 'https://example-project.com'
    }
  ],
  certifications: [
    {
      id: '1',
      name: 'AWS Certified Developer',
      issuer: 'Amazon Web Services',
      date: '2021'
    }
  ],
  hobbies: 'Photography, hiking, reading technology blogs, and contributing to open-source projects.'
};

export default sampleCVData;