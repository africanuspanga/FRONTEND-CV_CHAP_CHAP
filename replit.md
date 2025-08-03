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

### July 30, 2025 - Separate Upload CV Flow (Development)
- **New Dedicated Upload Flow**: Created completely separate flow for uploading existing CVs
- **Upload Flow Pages**:
  - `UploadCVFlow` - Main upload interface with drag-and-drop functionality
  - `UploadNiceToMeetYouPage` - Upload-specific personalized onboarding
  - `UploadGreatStartPage` - Upload-specific quality feedback and improvement suggestions
- **Separate Routing**: Upload flow uses `/upload/*` routes, distinct from create flow
- **Session Storage**: Temporary storage for upload data between onboarding pages
- **Enhanced User Experience**: Two clear paths - "Create New" vs "Upload Existing"
- **Backend Integration**: Full integration with existing CV parsing backend
- **Data Mapping**: Intelligent parsing and mapping of uploaded CV data with proper validation

### July 30, 2025 (Latest) - MVP Launch Preparation
- **Upload Flow Removed**: Temporarily removed upload CV flow from main application routes for MVP launch
- **Simplified User Journey**: Streamlined to single "Create New CV" path for better user experience
- **Code Preservation**: Upload flow code preserved in codebase for future development
- **Clean Interface**: Removed upload option from CreationMethod page, showing only CV creation
- **Route Cleanup**: Commented out upload routes in App.tsx while preserving functionality
- **Focus on Core Features**: MVP now focuses on core CV creation flow with templates
- **Phone Number Updates**: 
  - Removed automatic pre-filling of phone number (+255793166375) from personal info form
  - Updated USSD payment support contact to +255793166375 with WhatsApp integration
  - Phone collection now only happens during payment flow, not in CV creation

### August 1, 2025 - Admin Backend Integration Complete
- **Admin API Implementation**: Complete backend API integration with JWT authentication
- **Working Endpoints**: `/api/admin/login`, `/api/admin/stats`, `/api/admin/users`, `/api/admin/templates`, `/api/admin/me`
- **Real Data Integration**: Admin dashboard now uses real user statistics from PostgreSQL database
- **JWT Authentication**: Secure token-based authentication for admin access
- **Frontend Integration**: AdminAuthProvider now uses real backend APIs instead of mock tokens
- **Authentication Flow**: Login → JWT token storage → API validation → Dashboard access
- **Production Ready**: Full authentication system tested and confirmed working
- **Admin Credentials**: admin@cvchapchap.com / admin123 for dashboard access at `/admin-dashboard`

### August 1, 2025 - Critical User Authentication System Fixes
- **Registration Schema Fix**: Fixed frontend/backend mismatch - phone/full_name now correctly optional
- **Token Storage Fix**: Updated frontend to use correct `jwt_token` key instead of `auth_token`
- **Profile Management API**: Added complete user profile management system:
  - `GET /api/user/profile` - Retrieve user profile data
  - `PUT /api/user/profile` - Update username, email, phone, full_name
  - `POST /api/user/change-password` - Secure password change with verification
  - `DELETE /api/user/delete-account` - Self-service account deletion with password confirmation
- **Anonymous CV Linking**: Registration now properly links anonymous CVs using `anonymous_id`
- **Enhanced Authentication**: Flexible login with email/phone, proper JWT token management
- **Production Status**: Core authentication system fully operational and tested

### August 1, 2025 - User Testing Pivot
- **Payment to Feedback Transition**: Replaced payment flow with user feedback collection for MVP testing phase
- **New Download-Review Page**: Created `/download-review` page with feedback form (name, phone, review min 10 chars)
- **Backend API**: Added `/api/submit-feedback` endpoint for collecting user testing data
- **USSD Payment Storage**: Moved complete USSD payment implementation to `/client/src/pages/payment-flow/ussd-payment-stored.tsx`
- **Route Updates**: Final preview now redirects to `/download-review` instead of `/ussd-payment`
- **Google Sheets Integration**: Feedback submissions automatically sent to Google Sheets via Apps Script web app
- **Dual Storage**: Feedback stored both in Google Sheets (permanent) and in-memory (backup)
- **Apps Script URL**: `https://script.google.com/macros/s/AKfycbw1jI1tdqrLfG9XnHGBgXr946MyHzGjvBQwIAqv7nbOL7MsQZPiu3PJj3WVUi38XAG1/exec`
- **Android Mobile Layout Fix**: Fixed Final Preview page layout issues on Android devices (Infinix, etc.)
  - Changed container positioning from fixed to relative with proper scrolling
  - Added responsive spacing and safe area handling for Android navigation bars
  - Improved download button visibility and touch responsiveness
  - Enhanced viewport meta tag and touch optimization
- **Future Implementation**: USSD payment flow preserved with documentation for easy re-activation
- **User Experience**: Seamless flow from CV creation → preview → feedback → PDF download

### August 2, 2025 - Enhanced Authentication System & Favicon Fix
- **Phase 2 Authentication Complete**: Enhanced ProtectedRoute with comprehensive error handling and automatic login redirects
- **UserProfile Implementation**: Built comprehensive profile management with editing, password change, and account deletion
- **Global Error Handling**: Implemented ErrorBoundary, NetworkErrorBoundary, and useErrorHandler hook for system-wide coverage
- **Favicon Production Fix**: Resolved conflicting favicon implementations per CTO checklist
  - Removed base64 inline favicon and JavaScript injection conflicts
  - Clean HTML implementation with proper type declarations
  - Updated robots.txt to explicitly allow favicon access
  - Verified all favicon files accessible (/favicon.ico, /favicon-16x16.png, /favicon-32x32.png, /apple-touch-icon.png)
- **Error Boundaries**: Network connectivity detection, component crash recovery, and user-friendly error messaging
- **Authentication System Status**: Production-ready with JWT token management, profile endpoints, and protected routes

### August 3, 2025 - SEO Optimization & Content Enhancement
- **How to Write a CV Guide**: Added comprehensive 2000+ word SEO-optimized guide page at `/how-to-write-cv`
  - 6 detailed FAQ sections covering CV writing for East Africa
  - Local SEO targeting with Swahili terms ("barua ya maombi ya kazi", "mfano wa CV")
  - Geographic targeting for Tanzania, Kenya, Uganda job markets
  - Professional design with cards, icons, and call-to-actions
  - Added to footer navigation under Support section
- **Homepage SEO Improvements**: Addressed CTO audit recommendations (B- to A+ target)
  - **Fixed Duplicate H1 Tags**: Converted secondary H1s to H2s across all pages
  - **Extended Meta Description**: Increased from 111 to 185 characters with target keywords
  - **Enhanced Content Volume**: Added 1500+ words of relevant content to homepage
    - "Why CV Chap Chap" section with 6 feature highlights
    - "Industry-Specific Guidance" section for Banking, Tech, Healthcare, Education
    - ATS optimization, mobile-first design, and local market expertise content
- **SEO Metadata System**: Enhanced dynamic meta tags with page-specific optimization
- **Content Strategy**: Rich, keyword-optimized content addressing user search intent