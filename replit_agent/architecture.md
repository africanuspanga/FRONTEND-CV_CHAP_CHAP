# Architecture Overview

## 1. Overview

CV Chap Chap is a web application for creating professional CVs using customizable templates. The application allows users to input their CV data, select from a variety of templates, preview the CV in real-time, and download it as a PDF. The system is built as a full-stack TypeScript application with clear separation between client and server components.

## 2. System Architecture

The application follows a modern client-server architecture with the following key components:

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│  React Client   │<────>│  Express Server │<────>│  PostgreSQL DB  │
│                 │      │                 │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
         │                        │                        
         │                        │                        
         ▼                        ▼                        
┌─────────────────┐      ┌─────────────────┐      
│   PDF Renderer  │      │  External APIs  │      
│                 │      │  (OpenAI, etc.) │      
└─────────────────┘      └─────────────────┘      
```

### Key Architecture Decisions

1. **Monorepo Structure**: The application uses a monorepo approach with client and server code in the same repository, sharing common types and utilities through a shared directory.

2. **TypeScript Everywhere**: Both frontend and backend use TypeScript for type safety and improved developer experience.

3. **Database Access**: Drizzle ORM is used for database interaction with a PostgreSQL database, providing type-safe database operations.

4. **API Design**: RESTful API design for communication between client and server.

5. **Template Management**: CV templates are HTML files with CSS that can be registered via an API, allowing easy addition of new templates.

6. **State Management**: React hooks and context for frontend state management.

## 3. Key Components

### 3.1 Frontend (Client)

- **Technology Stack**: React with TypeScript
- **UI Framework**: Custom components with shadcn/ui (based on Radix UI primitives)
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Key Features**:
  - Template selection
  - Form-based CV data entry
  - Live preview
  - PDF download capability

### 3.2 Backend (Server)

- **Technology Stack**: Node.js with Express and TypeScript
- **API Endpoints**:
  - `/api/templates` - CRUD operations for CV templates
  - `/api/cv` - CV management
  - `/api/generate-pdf` - PDF generation
  - Proxy endpoints for OpenAI and CV screener services
- **Template Registration**: Automated script for registering CV templates

### 3.3 Database

- **Database**: PostgreSQL (via Neon serverless)
- **ORM**: Drizzle ORM with schema definitions in TypeScript
- **Key Tables**:
  - `users` - User accounts
  - `templates` - CV template definitions
  - `cvs` - Stored CVs associated with users
  - `payments` - Payment records

### 3.4 CV Templates

- **Storage**: Templates are stored as HTML files with embedded CSS
- **Structure**: Each template has its own directory with a standardized structure
- **Registration**: Templates are registered through an API endpoint using a script

## 4. Data Flow

### 4.1 CV Creation Flow

1. User selects a template from available options
2. User enters their CV data through forms
3. Client renders a live preview of the CV
4. User can download the CV as a PDF
   - Client sends template ID and CV data to server
   - Server generates PDF using the template and data
   - Server returns the PDF for download

### 4.2 Template Management Flow

1. New templates are added to the `/templates` directory
2. Registration script sends template to the server API
3. Templates are stored in the database with metadata
4. Client fetches available templates from the API

## 5. External Dependencies

### 5.1 External Services

- **OpenAI API**: Used for AI-assisted content generation (summaries, skills, etc.)
- **CV Screener API**: External service for CV evaluation
- **Stripe**: Payment processing integration

### 5.2 Key Libraries

- **Frontend**:
  - React and React DOM
  - Radix UI components
  - TanStack Query for data fetching
  - React Hook Form for form management
  - Tailwind CSS for styling
  
- **Backend**:
  - Express for API server
  - Drizzle ORM for database operations
  - Multer for file uploads
  - Node-fetch for external API requests

## 6. Deployment Strategy

### 6.1 Deployment Configuration

The application is configured for deployment on Replit, as evidenced by the `.replit` configuration file. The deployment strategy includes:

- **Build Process**: `npm run build` compiles both client and server
- **Runtime**: `npm run start` runs the production server
- **Port Configuration**: The server runs on port 5000, mapped to external port 80
- **Database**: Uses Neon PostgreSQL (serverless)

### 6.2 Development Environment

- **Development Server**: `npm run dev` for local development
- **Database Migrations**: Drizzle ORM for schema migrations
- **Environment Variables**: Configuration through environment variables

## 7. Security Considerations

- **API Key Management**: Server-side proxies for external APIs to avoid exposing keys
- **Session Management**: In-memory session store for authentication
- **Data Validation**: Zod schema validation for API requests
- **Error Handling**: Structured error responses with appropriate status codes

## 8. Future Architectural Considerations

- **Scaling Template Storage**: As template library grows, consider moving to a dedicated file storage service
- **Caching Strategy**: Implement caching for templates and generated PDFs
- **Authentication Improvements**: More robust user authentication and authorization
- **Internationalization**: Structure to support multiple languages