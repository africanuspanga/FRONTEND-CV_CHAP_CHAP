import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    const experienceText = workExperiences
      ?.map((exp: any) => `${exp.jobTitle} at ${exp.company}`)
      .join(', ') || 'various roles';

    const skillsText = skills
      ?.map((s: any) => s.name)
      .join(', ') || 'various skills';

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a professional CV writer specializing in the East African job market. 
Write concise, impactful professional summaries that:
- Are 2-3 sentences long
- Highlight key experience and skills
- Are tailored to the professional's background
- Sound natural and professional
- Do not include placeholders or brackets`
        },
        {
          role: 'user',
          content: `Write a professional summary for:
Name: ${personalInfo?.firstName} ${personalInfo?.lastName}
Title: ${personalInfo?.professionalTitle || 'Professional'}
Experience: ${experienceText}
Key Skills: ${skillsText}

Write only the summary, nothing else.`
        }
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    const summary = completion.choices[0]?.message?.content?.trim() || '';

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error('Summary generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate summary' },
      { status: 500 }
    );
  }
}
