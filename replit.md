# CV Chap Chap - Replit Project Guide

## Overview

CV Chap Chap is a comprehensive CV creation platform specifically designed for the Tanzanian and East African market. The platform is built with a mobile-first approach, recognizing that 90% of users access via mobile devices. The application enables users to create professional CVs through an intuitive, template-based system with real-time preview capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.
Terminology preference: Use "CV" instead of "resume" throughout the application.

## System Architecture

### Frontend-Independent Architecture
The application follows a **frontend-independent CV creation** principle where the entire CV creation flow (template selection → data input → live preview → export) works without backend dependency. This ensures optimal performance and user experience even with poor connectivity.

### Technology Stack

**Frontend:**
- React 18 with TypeScript
- UI Framework: Tailwind CSS + Shadcn/UI components
- Routing: Wouter (lightweight React router)
- State Management: TanStack React Query + Context API
- Forms: React Hook Form + Zod validation
- Build Tool: Vite
- Deployment: Replit

**Backend:**
- Node.js + Express
- Database: PostgreSQL with Drizzle ORM
- Authentication: JWT-based with session management
- File Handling: Multer for uploads
- External APIs: OpenAI (AI recommendations), Selcom (payments)
- PDF Generation: HTML-to-PDF conversion

## Key Components

### 1. Template System
- **Storage**: 15 CV templates stored as HTML files in `/templates/{templateId}.html`
- **Registration**: Automated script (`server/scripts/register-templates.ts`) registers templates via POST to `/api/templates`
- **Client-Side Rendering**: Templates are rendered in iframe environments for real-time preview
- **Template IDs**: Include `moonlightSonata`, `kaziFasta`, `jijengeClassic`, `kilimanjaro`, `tanzanitePro`, etc.

### 2. Authentication System
- **JWT-based**: Token-based authentication for user sessions
- **Anonymous Support**: CVs can be created without user registration (nullable user_id)
- **Admin Dashboard**: Separate admin authentication for platform management
- **Registration**: Supports email/password and phone number authentication

### 3. Mobile-First Design
- **Responsive Grid**: Tailwind-based responsive design system
- **Touch Optimization**: Mobile-optimized form inputs and navigation
- **CV Preview Scaling**: Dynamic scaling system to fit A4 templates on mobile screens
- **Offline Capability**: Local storage for CV data persistence

### 4. Real-Time Preview System
- **Iframe-based**: Templates loaded in isolated iframe environments
- **Live Updates**: DOM manipulation for real-time data injection
- **Template Integrity**: Maintains original template styling and layout
- **Performance**: Zero backend calls during preview updates

## Data Flow

### CV Creation Flow
1. **Template Selection**: User selects from 15 available templates
2. **Data Entry**: Multi-step form with sections:
   - Personal Information
   - Work Experience
   - Education
   - Skills
   - Professional Summary
   - Languages (optional)
   - References (optional)
3. **Live Preview**: Real-time template rendering as users type
4. **Local Storage**: CV data persisted in browser storage
5. **PDF Generation**: On-demand PDF creation via backend API

### Data Structure
```typescript
interface CVData {
  name: string;
  email: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    phone: string;
    professionalTitle: string;
    address: string;
    summary: string;
  };
  workExperiences: Array<{
    jobTitle: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    achievements: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    location: string;
    startDate: string;
    endDate: string;
  }>;
  skills: string[];
  languages: string[];
  certifications: Array<{}>;
}
```

### Payment Integration
- **USSD Payment**: Selcom integration for mobile money payments
- **Anonymous Support**: Payment processing without user registration
- **Verification**: SMS confirmation message parsing
- **Download**: PDF generation after successful payment verification

## External Dependencies

### Required Services
- **PostgreSQL**: Primary database (configured via DATABASE_URL)
- **OpenAI API**: For AI-enhanced CV content suggestions
- **Selcom API**: Mobile money payment processing
- **Stripe**: Alternative payment processing

### Optional Integrations
- **Neon Database**: Serverless PostgreSQL option
- **Replit Database**: Development environment storage

## Deployment Strategy

### Replit Configuration
- **Build Command**: `vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist`
- **Start Command**: `NODE_ENV=production node dist/index.js`
- **Development**: `NODE_ENV=development tsx server/index.ts`

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Authentication token signing key
- `OPENAI_API_KEY`: AI integration
- `SELCOM_API_CREDENTIALS`: Payment processing

### File Structure
```
/client/          # Frontend React application
/server/          # Backend Express server
/shared/          # Shared TypeScript types and schemas
/templates/       # CV template HTML files
/migrations/      # Database migration files
```

### Database Migration
- **Drizzle Configuration**: `drizzle.config.ts` for database management
- **Schema**: Defined in `shared/schema.ts`
- **Migration Command**: `npm run db:push`

### Production Considerations
- **Mobile Optimization**: Ensure templates scale properly on mobile devices
- **Performance**: Minimize bundle size for mobile users
- **Offline Support**: Implement service workers for connectivity issues
- **Error Handling**: Graceful degradation for PDF generation failures

## Recent Changes

### July 25, 2025 - CV Upload Feature (Phase 1)
- **New Route Added**: `/cv-steps/choose` - Choose Method page implementation
- **Backend API Endpoints**: 
  - `POST /api/upload-cv-file` - File upload with validation
  - `GET /api/parsing-status/:jobId` - Status polling
  - `GET /api/get-parsed-cv-data/:jobId` - Data retrieval
- **UI Components**: Two-card layout matching provided designs exactly
- **Brand Colors**: Applied CV Chap Chap colors (#034694, #4D6FFF, #E5EAFF)
- **File Validation**: DOC, DOCX, PDF, HTML, RTF, TXT support with 10MB limit
- **Loading States**: Trophy icon with "Finding some good stuff.." message
- **Error Handling**: Comprehensive validation and user feedback
- **Terminology Update**: Consistent use of "CV" instead of "resume"
- **Mobile Optimization**: Fully responsive design for mobile-first approach

### July 30, 2025 - Enhanced Post-Upload Onboarding Flow
- **New Onboarding Pages**: 
  - `NiceToMeetYouPage` - Personalized introduction with user insights
  - `GreatStartPage` - CV quality feedback and improvement suggestions
- **Enhanced Backend Response**: Updated CV parsing to include onboardingInsights object
- **Context Updates**: Extended CV form context to handle onboarding data
- **Routing Flow**: Upload → Onboarding → Templates (if insights available)
- **Professional Design**: Clean card layouts with CV Chap Chap branding
- **Smart Navigation**: Fallback to templates if onboarding insights unavailable