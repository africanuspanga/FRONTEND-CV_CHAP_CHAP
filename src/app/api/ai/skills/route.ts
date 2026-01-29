import { NextRequest, NextResponse } from 'next/server';
import { generateSkillSuggestions } from '@/lib/ai/cv-assistant';

interface WorkExperience {
  jobTitle: string;
  company: string;
  achievements: string[];
}

interface Education {
  degree: string;
  fieldOfStudy?: string;
  institution: string;
}

export async function POST(request: NextRequest) {
  try {
    const { 
      jobTitle, 
      workExperiences, 
      education, 
      existingSkills 
    } = await request.json();

    const skills = await generateSkillSuggestions(
      jobTitle,
      workExperiences as WorkExperience[],
      education as Education[],
      existingSkills
    );

    return NextResponse.json({ skills });
  } catch (error) {
    console.error('AI skills error:', error);
    return NextResponse.json(
      { error: 'Failed to generate skill suggestions' },
      { status: 500 }
    );
  }
}
