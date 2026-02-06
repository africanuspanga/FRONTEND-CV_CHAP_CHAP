# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CV Chap Chap is a CV/resume creation platform for the Tanzanian and East African market (90% mobile users). Users create professional resumes using 6 curated templates with AI-powered content enhancement.

**Tech Stack**: Next.js 16 (App Router), React 18, TypeScript, Tailwind CSS, Zustand, Supabase (auth + PostgreSQL), OpenAI GPT-4o, React PDF Renderer, Selcom payments

## Development Commands

```bash
npm run dev      # Start dev server on port 5000
npm run build    # Build for production
npm run start    # Start production server on port 5000
npm run lint     # Run ESLint
```

## Architecture

### Application Flow
Multi-step CV creation workflow:
1. Template selection (6 templates: Charles, Grace, Kathleen, Oliver, Aparna, etc.)
2. Personal information form
3. Work experience (with AI suggestions via `/api/ai/job-descriptions`)
4. Education
5. Skills & languages
6. Additional sections (certifications, references, links, accomplishments)
7. Professional summary (AI via `/api/ai/summary`)
8. Preview & payment

### State Management
- **Zustand store** (`src/stores/cv-store.ts`): Central CV data persistence to localStorage
- **React Hook Form + Zod**: Form handling and validation
- All CV data survives page refreshes; works offline except AI features

### Template System
Templates have dual implementations:
- `src/components/templates/preview/` - Browser preview (React components)
- `src/components/templates/pdf/` - PDF generation (React PDF Renderer)

Both must accept the same `CVData` interface from `src/types/cv.ts`.

### Key Directories
```
src/
├── app/                    # Next.js App Router
│   ├── (builder)/          # CV creation flow (template, personal, experience, etc.)
│   ├── api/                # API routes (ai/, payment/, pdf/, cv/)
│   ├── auth/               # Login, register, callback
│   └── dashboard/          # User dashboard
├── components/
│   ├── ui/                 # Shadcn/Radix UI components
│   ├── templates/          # CV templates (preview/ and pdf/)
│   └── builder/            # Builder-specific components
├── lib/
│   ├── ai/                 # OpenAI integration (cv-assistant.ts)
│   ├── auth/               # Auth context provider
│   ├── supabase/           # Supabase client/server instances
│   └── selcom/             # Payment gateway integration
├── stores/                 # Zustand CV store
└── types/                  # TypeScript interfaces (cv.ts, templates.ts)
```

### API Endpoints
- `POST /api/ai/summary` - Generate professional summary
- `POST /api/ai/skills` - Generate skill suggestions
- `POST /api/ai/job-descriptions` - Generate work experience descriptions
- `POST /api/payment/initiate` - Start Selcom payment
- `POST /api/payment/push-ussd` - Tanzania USSD payment
- `POST /api/pdf/generate` - Generate PDF

## Data Structure

Core interface in `src/types/cv.ts`:
```typescript
interface CVData {
  personalInfo: PersonalInfo;
  summary: string;
  workExperiences: WorkExperience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  references: Reference[];
  certifications: Certification[];
  socialLinks: SocialLink[];
  accomplishments: Accomplishment[];
}
```

## External Services

- **Supabase**: Auth (JWT) + PostgreSQL database
- **OpenAI**: GPT-4o for content generation
- **Selcom**: Tanzanian payment gateway (online + USSD)

## Environment Variables

Required in `.env.local`:
```
OPENAI_API_KEY
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
SELCOM_API_KEY
SELCOM_API_SECRET
SELCOM_VENDOR_ID
```

## Adding New Templates

1. Create preview component: `src/components/templates/preview/[name].tsx`
2. Create PDF component: `src/components/templates/pdf/[name].tsx`
3. Both must accept `CVData` as props
4. Register in template index files
5. Add preview image to `public/images/`

## Mobile-First Design

90% of users are on mobile. All templates must:
- Work from 320px width minimum
- Be A4 print-compatible (210mm × 297mm)
- Load under 3 seconds on slow networks
