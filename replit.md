# CV Chap Chap - Replit Project Guide

## Overview
CV Chap Chap is a mobile-first CV creation platform tailored for the Tanzanian and East African market. Its purpose is to enable users to create professional CVs using intuitive, template-based systems with real-time previews. The business vision is to provide an accessible and efficient tool for job seekers in the region, recognizing the prevalence of mobile access.

## User Preferences
Preferred communication style: Simple, everyday language.
Terminology preference: Use "CV" instead of "resume" throughout the application.

## System Architecture

### Core Principles
The application emphasizes **frontend-independent CV creation** for optimal performance and user experience, especially in environments with poor connectivity. This means the entire CV creation flow (template selection, data input, live preview, export) functions without constant backend dependency.

### Technology Stack
*   **Frontend**: React 18 with TypeScript, Tailwind CSS + Shadcn/UI, Wouter for routing, TanStack React Query + Context API for state management, React Hook Form + Zod for forms, Vite for building.
*   **Backend**: Node.js + Express.
*   **Database**: PostgreSQL with Drizzle ORM.
*   **Authentication**: JWT-based with support for anonymous CV creation and an admin dashboard.
*   **PDF Generation**: HTML-to-PDF conversion.

### Key Components & Design Decisions
*   **Template System**: Stores 15 CV templates as HTML files, registered automatically. Templates are rendered in iframes for real-time, client-side previews without backend calls during updates, maintaining original styling.
*   **Mobile-First Design**: Implemented with Tailwind CSS for responsiveness, optimized touch inputs, and dynamic scaling for A4 templates on mobile screens. Local storage is used for CV data persistence.
*   **Authentication System**: JWT-based token authentication supports both registered users and anonymous CV creation. Includes comprehensive user profile management (retrieve, update, change password, delete account).
*   **Data Flow**: Users select a template, enter data via a multi-step form, see a live preview, and data is persisted locally. PDF generation is an on-demand backend process.
*   **UI/UX**: Features professional design with clean card layouts, dynamic meta tags for SEO, and brand colors.
*   **Error Handling**: Implemented `ErrorBoundary`, `NetworkErrorBoundary`, and `useErrorHandler` for robust system-wide error management.

## External Dependencies

*   **PostgreSQL**: Primary database.
*   **OpenAI API**: For AI-enhanced CV content suggestions.
*   **Selcom API**: For mobile money payment processing (currently replaced by feedback collection for MVP testing).
*   **Google Sheets**: For collecting user feedback via Apps Script web app.
*   **Stripe**: An alternative payment processing integration (optional).
*   **Neon Database**: Serverless PostgreSQL option (optional).
*   **Replit Database**: For development environment storage (optional).