import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

interface Skill {
  name: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { personalInfo, workExperiences, education, skills } = body;

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const jobTitle = personalInfo?.professionalTitle || 'Professional';
    const fullName = `${personalInfo?.firstName || ''} ${personalInfo?.lastName || ''}`.trim();
    const location = personalInfo?.location || '';
    
    const experienceContext = (workExperiences as WorkExperience[])?.length 
      ? (workExperiences as WorkExperience[]).map(exp => 
          `${exp.jobTitle} at ${exp.company}:\n${exp.achievements?.slice(0, 2).map(a => `- ${a}`).join('\n') || 'No achievements listed'}`
        ).join('\n\n')
      : 'No work experience';

    const educationContext = (education as Education[])?.length
      ? (education as Education[]).map(edu => 
          `${edu.degree}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''} from ${edu.institution}`
        ).join(', ')
      : 'No education listed';

    const skillsContext = (skills as Skill[])?.length 
      ? (skills as Skill[]).slice(0, 5).map(s => s.name).join(', ')
      : 'No skills listed';

    const yearsExperience = (workExperiences as WorkExperience[])?.length > 0 
      ? Math.max((workExperiences as WorkExperience[]).length * 2, 3)
      : undefined;

    const systemPrompt = `You are an elite CV writing expert who has placed thousands of candidates at top companies across East Africa, including Vodacom, Safaricom, NMB Bank, CRDB, and multinationals.

Your summaries consistently get candidates to the interview stage. You understand what East African recruiters want to see.

CRITICAL REQUIREMENTS - READ CAREFULLY:
1. Write EXACTLY 250-350 characters (essential for CV formatting - count carefully!)
2. Write in FIRST PERSON or implied first person - never use "he/she/they"
3. Be HIGHLY SPECIFIC to this exact candidate - use their actual job titles, achievements, and skills
4. Start with a strong opening that grabs attention (not "I am a...")
5. Include years of experience if provided
6. Mention 1-2 top skills from their skillset
7. End with value proposition or what they bring to employers
8. Sound confident but professional - appropriate for East African corporate culture
9. Make every word count - no filler phrases

WHAT TO ABSOLUTELY AVOID:
- Generic phrases: "hard-working", "team player", "passionate" without context
- Starting with "I am" or "Results-driven professional"
- Listing skills without connecting to impact
- Buzzwords without substance
- Anything that could apply to any candidate

CANDIDATE PROFILE TO ANALYZE:
- Name: ${fullName}
- Target Role: ${jobTitle}
- Location: ${location}
${yearsExperience ? `- Years Experience: ~${yearsExperience}+ years` : ''}
- Top Skills: ${skillsContext}
- Education: ${educationContext}
- Work History:
${experienceContext}

Write a powerful, personalized 250-350 character professional summary that will impress Tanzanian and East African recruiters. Make it specific to THIS candidate's actual background.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Generate a compelling professional summary. Return ONLY the summary text, nothing else. MUST be between 250-350 characters - this is a HARD LIMIT. Count your characters before responding.' },
      ],
      max_tokens: 150,
      temperature: 0.6,
    });

    let summary = response.choices[0]?.message?.content?.trim() || '';
    
    if (summary.length > 350) {
      const lastSentenceEnd = summary.lastIndexOf('.', 345);
      if (lastSentenceEnd > 200) {
        summary = summary.substring(0, lastSentenceEnd + 1);
      } else {
        summary = summary.substring(0, 347) + '...';
      }
    }

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error('Summary generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate summary' },
      { status: 500 }
    );
  }
}
