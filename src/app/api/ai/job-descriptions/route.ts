import { NextRequest, NextResponse } from 'next/server';
import { generateJobDescriptions } from '@/lib/ai/cv-assistant';

export async function POST(request: NextRequest) {
  try {
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not configured');
      return NextResponse.json(
        { error: 'AI service is not configured. Please contact support.' },
        { status: 503 }
      );
    }

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

    // Provide more specific error messages
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    if (errorMessage.includes('API key')) {
      return NextResponse.json(
        { error: 'AI service authentication failed. Please contact support.' },
        { status: 503 }
      );
    }

    if (errorMessage.includes('rate limit') || errorMessage.includes('quota')) {
      return NextResponse.json(
        { error: 'AI service is temporarily busy. Please try again in a moment.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate suggestions. Please try again.' },
      { status: 500 }
    );
  }
}
