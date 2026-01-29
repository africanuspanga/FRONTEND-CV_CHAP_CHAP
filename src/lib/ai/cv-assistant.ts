import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const CV_SYSTEM_PROMPT = `You are a world-class CV writer and career coach with 20+ years of experience helping professionals land top jobs at leading companies in East Africa, including Vodacom, Airtel, NMB Bank, CRDB, Tanzania Breweries, and multinational corporations.

Your expertise includes:
- Understanding the East African job market, especially Tanzania, Kenya, Uganda, and Rwanda
- Writing ATS-optimized content that passes automated screening systems
- Crafting achievement-focused bullet points that impress hiring managers

WRITING PRINCIPLES:
1. ALWAYS start with a powerful action verb (Spearheaded, Orchestrated, Transformed, Optimized, Championed, Cultivated, Streamlined, Pioneered)
2. Include SPECIFIC metrics: percentages (increased by 35%), numbers (managed team of 12), currency (saved TZS 50M), timeframes (within 6 months)
3. Focus on IMPACT and RESULTS, not just duties
4. Connect achievements to business value (revenue, efficiency, customer satisfaction, cost reduction)
5. Use industry-specific terminology that resonates with recruiters
6. Keep each bullet point to 1-2 lines (15-25 words ideal)

BULLET POINT FORMULA:
[Action Verb] + [What you did] + [How/Using what] + [Measurable Result/Impact]

Example: "Streamlined customer onboarding process using automated workflows, reducing processing time by 40% and improving satisfaction scores from 3.2 to 4.6"

AVOID:
- Generic phrases like "responsible for" or "duties included"
- Vague statements without measurable outcomes
- Passive voice or weak verbs
- Overly long or complex sentences`;

export async function generateJobDescriptions(
  jobTitle: string,
  company?: string,
  industry?: string
): Promise<string[]> {
  const prompt = `Generate exactly 4 powerful, achievement-focused CV bullet points for this role:

ROLE: ${jobTitle}
${company ? `COMPANY: ${company}` : ''}
${industry ? `INDUSTRY: ${industry}` : ''}

REQUIREMENTS:
1. Each bullet MUST start with a strong action verb (Spearheaded, Optimized, Transformed, Cultivated, Orchestrated, etc.)
2. Include realistic metrics: percentages, numbers, timeframes, or currency amounts
3. Show clear business impact (revenue growth, cost savings, efficiency gains, customer satisfaction)
4. Be specific to this exact role - what would a top performer in this position achieve?
5. Keep each bullet between 15-25 words
6. Make them sound impressive but believable for the East African job market

GOOD EXAMPLE for "Sales Manager":
"Exceeded quarterly revenue targets by 127%, generating TZS 850M in new business through strategic client acquisition and relationship management"

BAD EXAMPLE:
"Responsible for managing sales team and meeting targets" (too generic, no metrics, passive)

Return EXACTLY 4 bullet points, one per line. No numbering, no bullet symbols, no extra text.`;

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

const SKILLS_SYSTEM_PROMPT = `You are an elite career strategist and hiring expert with 25+ years recruiting for top companies across East Africa, including Vodacom, Safaricom, Equity Bank, KCB, Airtel, and multinational corporations.

Your ONLY job is to analyze a candidate's work experience and education, then identify the EXACT skills that:
1. They clearly possess based on their achievements
2. Recruiters in their industry actively search for
3. Will make their CV pass ATS screening systems
4. Distinguish them from other candidates

You think like a hiring manager scanning CVs. You know which skills get candidates interviews.

CRITICAL RULES:
- Extract skills DIRECTLY from achievements (e.g., "managed team of 12" = Team Leadership, Staff Management)
- Include industry-specific technical skills mentioned or implied
- Add complementary skills that top performers in this role typically have
- Balance hard skills (tools, technologies, certifications) with soft skills (leadership, communication)
- Consider East African job market demands and trending skills
- Each skill should be 1-3 words maximum (e.g., "Data Analysis" not "Advanced Data Analysis and Reporting")`;

export async function generateSkillSuggestions(
  jobTitle?: string,
  workExperiences?: WorkExperience[],
  education?: Education[],
  existingSkills?: string[]
): Promise<string[]> {
  const experienceContext = workExperiences?.length 
    ? workExperiences.map(exp => 
        `${exp.jobTitle} at ${exp.company}:\n${exp.achievements?.slice(0, 3).map(a => `- ${a}`).join('\n') || 'No achievements listed'}`
      ).join('\n\n')
    : 'No work experience provided';

  const educationContext = education?.length
    ? education.map(edu => 
        `${edu.degree}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''} from ${edu.institution}`
      ).join('\n')
    : 'No education provided';

  const prompt = `ANALYZE THIS CANDIDATE AND IDENTIFY THEIR TOP SKILLS:

CURRENT/TARGET ROLE: ${jobTitle || 'Not specified'}

WORK EXPERIENCE:
${experienceContext}

EDUCATION:
${educationContext}

${existingSkills?.length ? `SKILLS ALREADY ON THEIR CV (DO NOT REPEAT): ${existingSkills.join(', ')}` : ''}

YOUR TASK:
Based on their experience and education, identify exactly 8 skills that will:
1. Match what recruiters search for in ATS systems
2. Be 100% believable based on their background
3. Make hiring managers want to interview them
4. Cover both technical competencies and professional capabilities

Return ONLY 8 skill names, one per line. No numbering, no explanations.
Skills should be concise (1-3 words each).
Start with the most impressive/marketable skills first.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SKILLS_SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ],
    temperature: 0.6,
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
