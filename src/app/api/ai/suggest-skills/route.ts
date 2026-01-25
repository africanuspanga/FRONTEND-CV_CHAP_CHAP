import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { professionalTitle, workExperiences } = body;

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const experienceText = workExperiences
      ?.map((exp: any) => `${exp.jobTitle} at ${exp.company}: ${exp.achievements?.join(', ') || 'N/A'}`)
      .join('\n') || 'No specific experience provided';

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a career advisor specializing in the East African job market.
Suggest relevant technical and soft skills based on the user's profession and experience.
Return exactly 8 skills as a JSON array of strings.
Focus on skills that are:
- Relevant to the profession
- In demand in East African markets
- A mix of technical and soft skills`
        },
        {
          role: 'user',
          content: `Suggest skills for:
Professional Title: ${professionalTitle || 'Professional'}
Work Experience:
${experienceText}

Return a JSON object with a "skills" array containing exactly 8 skill names.`
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 200,
    });

    const content = completion.choices[0]?.message?.content || '{"skills":[]}';
    const parsed = JSON.parse(content);

    return NextResponse.json({ skills: parsed.skills || [] });
  } catch (error: any) {
    console.error('Skills suggestion error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to suggest skills' },
      { status: 500 }
    );
  }
}
