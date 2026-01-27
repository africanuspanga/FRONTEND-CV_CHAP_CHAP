import { NextRequest, NextResponse } from 'next/server';
import { generateJobDescriptions } from '@/lib/ai/cv-assistant';

export async function POST(request: NextRequest) {
  try {
    const { jobTitle, company, industry } = await request.json();

    if (!jobTitle) {
      return NextResponse.json(
        { error: 'Job title is required' },
        { status: 400 }
      );
    }

    const suggestions = await generateJobDescriptions(jobTitle, company, industry);

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('AI job descriptions error:', error);
    return NextResponse.json(
      { error: 'Failed to generate suggestions' },
      { status: 500 }
    );
  }
}
