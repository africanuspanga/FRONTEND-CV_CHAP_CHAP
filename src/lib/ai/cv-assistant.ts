import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const CV_SYSTEM_PROMPT = `You are an expert CV/Resume writer with 15+ years of experience helping professionals in East Africa and globally land their dream jobs. You specialize in creating ATS-friendly, achievement-focused content.

CORE PRINCIPLES:
1. Always use action verbs to start bullet points (Led, Managed, Developed, Implemented, etc.)
2. Include quantifiable metrics when possible (percentages, numbers, dollar amounts)
3. Focus on achievements and impact, not just responsibilities
4. Keep each bullet point concise (1-2 lines max)
5. Use industry-standard terminology
6. Tailor content to the East African job market context when relevant
7. Maximum 4 bullet points per role (industry best practice)

FORMAT RULES:
- Start with strong action verb
- Include specific achievement or responsibility
- Add measurable impact when possible
- End with business value or result`;

export async function generateJobDescriptions(
  jobTitle: string,
  company?: string,
  industry?: string
): Promise<string[]> {
  const prompt = `Generate exactly 4 professional CV bullet points for the following role:

Job Title: ${jobTitle}
${company ? `Company: ${company}` : ''}
${industry ? `Industry: ${industry}` : ''}

Requirements:
- Exactly 4 bullet points
- Each bullet should be achievement-focused
- Use strong action verbs
- Include metrics where possible
- Keep each under 20 words
- Make them specific and impactful

Return ONLY the 4 bullet points, one per line, without numbering or bullet characters.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: CV_SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  const content = response.choices[0]?.message?.content || '';
  const bullets = content
    .split('\n')
    .map(line => line.replace(/^[-•*]\s*/, '').trim())
    .filter(line => line.length > 0)
    .slice(0, 4);

  return bullets;
}

export async function generateProfessionalSummary(
  name: string,
  jobTitle: string,
  yearsExperience?: number,
  skills?: string[],
  industry?: string
): Promise<string> {
  const prompt = `Write a professional CV summary for:

Name: ${name}
Current/Target Role: ${jobTitle}
${yearsExperience ? `Years of Experience: ${yearsExperience}` : ''}
${skills?.length ? `Key Skills: ${skills.join(', ')}` : ''}
${industry ? `Industry: ${industry}` : ''}

Requirements:
- 2-3 sentences maximum
- Highlight key strengths and value proposition
- Use professional, confident tone
- Avoid first-person pronouns (I, my, me)
- Focus on what makes this candidate valuable
- Make it compelling for East African employers

Return ONLY the summary paragraph, no quotes or labels.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: CV_SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 200,
  });

  return response.choices[0]?.message?.content?.trim() || '';
}

export async function generateSkillSuggestions(
  jobTitle: string,
  existingSkills?: string[]
): Promise<string[]> {
  const prompt = `Suggest 8 relevant professional skills for someone with the job title: ${jobTitle}

${existingSkills?.length ? `They already have: ${existingSkills.join(', ')}` : ''}

Requirements:
- Mix of hard skills and soft skills
- Relevant to the role and industry
- In demand in East African job market
- Don't repeat any existing skills

Return ONLY the skill names, one per line, without numbering.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: CV_SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 200,
  });

  const content = response.choices[0]?.message?.content || '';
  return content
    .split('\n')
    .map(line => line.replace(/^[-•*\d.]\s*/, '').trim())
    .filter(line => line.length > 0 && line.length < 50)
    .slice(0, 8);
}

export async function improveAchievement(
  achievement: string,
  jobTitle: string
): Promise<string> {
  const prompt = `Improve this CV bullet point to be more impactful and professional:

Original: "${achievement}"
Job Title: ${jobTitle}

Requirements:
- Start with strong action verb
- Add metrics if missing
- Keep under 20 words
- Make it achievement-focused

Return ONLY the improved bullet point, no quotes.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: CV_SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ],
    temperature: 0.6,
    max_tokens: 100,
  });

  return response.choices[0]?.message?.content?.trim() || achievement;
}
