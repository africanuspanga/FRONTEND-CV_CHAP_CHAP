import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import mammoth from 'mammoth';
import { nanoid } from 'nanoid';

// Dynamic import for pdf-parse to avoid bundling issues
let pdfParse: any = null;

async function getPdfParser() {
  if (!pdfParse) {
    pdfParse = (await import('pdf-parse')).default;
  }
  return pdfParse;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ExtractedCV {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    professionalTitle: string;
    linkedin: string;
    website: string;
  };
  summary: string;
  workExperiences: Array<{
    id: string;
    jobTitle: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    achievements: string[];
  }>;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    fieldOfStudy: string;
    graduationDate: string;
    location: string;
    gpa?: string;
  }>;
  skills: Array<{
    id: string;
    name: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  }>;
  languages: Array<{
    id: string;
    name: string;
    proficiency: 'basic' | 'conversational' | 'fluent' | 'native';
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
  }>;
  references: Array<{
    id: string;
    name: string;
    title: string;
    company: string;
    email: string;
    phone: string;
  }>;
  extractionConfidence: {
    personalInfo: number;
    workExperiences: number;
    education: number;
    skills: number;
    overall: number;
  };
}

async function extractFromPDF(buffer: Buffer): Promise<string> {
  try {
    const parser = await getPdfParser();
    const data = await parser(buffer);
    return data.text;
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error('Failed to parse PDF file. Please ensure the PDF contains readable text (not just images).');
  }
}

async function extractFromDOCX(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    console.error('DOCX parsing error:', error);
    throw new Error('Failed to parse DOCX file');
  }
}

async function structureWithAI(rawText: string): Promise<ExtractedCV> {
  const systemPrompt = `You are a CV/Resume data extraction expert. Your task is to extract structured information from CV text.

IMPORTANT RULES:
1. Extract ONLY information that is explicitly present in the text
2. Do NOT invent or assume any information
3. If a field is not found, use empty string "" or empty array []
4. For dates, use format "YYYY-MM" (e.g., "2020-01")
5. For phone numbers, preserve the original format
6. Split full name into firstName and lastName
7. For skills, infer proficiency level based on context (years mentioned, "expert in", etc.)
8. For work achievements, keep each bullet point as a separate string
9. Identify if a job is "current" based on keywords like "Present", "Current", "Now", or no end date

EXTRACTION CONFIDENCE:
- Rate your confidence for each section from 0.0 to 1.0
- 1.0 = All information clearly found
- 0.5 = Some information found but incomplete
- 0.0 = Section not found at all`;

  const userPrompt = `Extract all CV information from the following text and return it as JSON.

CV TEXT:
"""
${rawText.substring(0, 15000)}
"""

Return a JSON object with this exact structure:
{
  "personalInfo": {
    "firstName": "",
    "lastName": "",
    "email": "",
    "phone": "",
    "location": "",
    "professionalTitle": "",
    "linkedin": "",
    "website": ""
  },
  "summary": "",
  "workExperiences": [
    {
      "jobTitle": "",
      "company": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "isCurrent": false,
      "achievements": ["", ""]
    }
  ],
  "education": [
    {
      "degree": "",
      "institution": "",
      "fieldOfStudy": "",
      "graduationDate": "",
      "location": "",
      "gpa": ""
    }
  ],
  "skills": [
    {
      "name": "",
      "level": "intermediate"
    }
  ],
  "languages": [
    {
      "name": "",
      "proficiency": "fluent"
    }
  ],
  "certifications": [
    {
      "name": "",
      "issuer": "",
      "date": ""
    }
  ],
  "references": [
    {
      "name": "",
      "title": "",
      "company": "",
      "email": "",
      "phone": ""
    }
  ],
  "extractionConfidence": {
    "personalInfo": 0.0,
    "workExperiences": 0.0,
    "education": 0.0,
    "skills": 0.0,
    "overall": 0.0
  }
}

IMPORTANT: Return ONLY valid JSON, no markdown, no explanations.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.1,
      max_tokens: 4000,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from AI');
    }

    return JSON.parse(content);
  } catch (error) {
    console.error('AI extraction error:', error);
    throw new Error('Failed to extract CV information');
  }
}

function processExtractedData(data: ExtractedCV): ExtractedCV {
  return {
    ...data,
    personalInfo: {
      ...data.personalInfo,
      phone: data.personalInfo.phone?.replace(/[^\d+\-\s()]/g, '') || '',
      email: data.personalInfo.email?.toLowerCase().trim() || '',
    },
    workExperiences: (data.workExperiences || []).map((exp) => ({
      ...exp,
      id: nanoid(),
      achievements: exp.achievements?.filter((a) => a && a.trim()) || [],
    })),
    education: (data.education || []).map((edu) => ({
      ...edu,
      id: nanoid(),
    })),
    skills: (data.skills || []).map((skill) => ({
      ...skill,
      id: nanoid(),
      level: skill.level || 'intermediate',
    })),
    languages: (data.languages || []).map((lang) => ({
      ...lang,
      id: nanoid(),
      proficiency: lang.proficiency || 'conversational',
    })),
    certifications: (data.certifications || []).map((cert) => ({
      ...cert,
      id: nanoid(),
    })),
    references: (data.references || []).slice(0, 2).map((ref) => ({
      ...ref,
      id: nanoid(),
    })),
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload PDF or DOCX.' },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let rawText: string;
    
    if (file.type === 'application/pdf') {
      rawText = await extractFromPDF(buffer);
    } else {
      rawText = await extractFromDOCX(buffer);
    }

    if (!rawText || rawText.trim().length < 50) {
      return NextResponse.json(
        { error: 'Could not extract text from file. Please ensure the CV contains readable text.' },
        { status: 400 }
      );
    }

    const extractedData = await structureWithAI(rawText);
    const processedData = processExtractedData(extractedData);

    return NextResponse.json({
      success: true,
      data: processedData,
      rawTextLength: rawText.length,
    });

  } catch (error) {
    console.error('CV extraction error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to extract CV' },
      { status: 500 }
    );
  }
}
