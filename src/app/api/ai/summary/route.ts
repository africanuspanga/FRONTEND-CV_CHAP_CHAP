import { NextRequest, NextResponse } from 'next/server';
import { generateProfessionalSummary } from '@/lib/ai/cv-assistant';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { personalInfo, workExperiences, skills } = body;

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const jobTitle = personalInfo?.professionalTitle || 'Professional';
    const name = `${personalInfo?.firstName || ''} ${personalInfo?.lastName || ''}`.trim();
    const skillNames = skills?.map((s: { name: string }) => s.name) || [];
    
    const yearsExperience = workExperiences?.length > 0 
      ? Math.min(workExperiences.length * 2, 10) 
      : undefined;

    const summary = await generateProfessionalSummary(
      name,
      jobTitle,
      yearsExperience,
      skillNames
    );

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error('Summary generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate summary' },
      { status: 500 }
    );
  }
}
