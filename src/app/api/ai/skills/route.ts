import { NextRequest, NextResponse } from 'next/server';
import { generateSkillSuggestions } from '@/lib/ai/cv-assistant';

export async function POST(request: NextRequest) {
  try {
    const { jobTitle, existingSkills } = await request.json();

    if (!jobTitle) {
      return NextResponse.json(
        { error: 'Job title is required' },
        { status: 400 }
      );
    }

    const skills = await generateSkillSuggestions(jobTitle, existingSkills);

    return NextResponse.json({ skills });
  } catch (error) {
    console.error('AI skills error:', error);
    return NextResponse.json(
      { error: 'Failed to generate skill suggestions' },
      { status: 500 }
    );
  }
}
