# Neighborhood Micro-Events Finder - Charlotte

## Overview

A community-focused web application that discovers, verifies, and surfaces hyperlocal events in Charlotte, NC. The platform helps residents find neighborhood events like block parties, pop-up markets, porch concerts, and garage sales by aggregating data from multiple sources, verifying event authenticity, and providing transparent confidence scores. Built with a focus on trust, transparency, and accessibility for diverse neighborhoods.

**Core Value Proposition**: Bridge the gap between large event platforms and grassroots community happenings by surfacing micro-events that are often under-represented, while maintaining high standards for verification and user trust.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack Query (React Query) for server state
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system

**Design System**:
- Hybrid approach combining Material Design's information density with community-focused UI patterns
- Custom color palette emphasizing trust (primary blue) and community warmth (accent orange)
- Light/dark mode support with theme persistence
- Accessibility-first approach with ARIA labels and semantic HTML

**Key UI Components**:
- Map visualization using Leaflet for geographic event display
- Card-based event discovery interface
- Advanced filtering system (search, date range, radius, verification status)
- Confidence badges showing event verification transparency
- Mobile-responsive design with drawer/sheet patterns

**Pages**:
- `/` - Home/discovery page with map and list views
- `/events/:id` - Event detail with full information and source transparency
- `/submit` - Event submission form with geocoding
- `/admin` - Moderation dashboard for event verification

### Backend Architecture

**Runtime**: Node.js with Express
- **Build Tool**: Vite for development and production builds
- **Type Safety**: TypeScript with strict mode enabled
- **API Pattern**: RESTful JSON API

**Server Structure**:
- Express middleware for JSON parsing and request logging
- Custom error handling middleware
- Development-only Vite integration for HMR
- Production static file serving

**API Endpoints**:
- `GET /api/events` - Retrieve all events
- `GET /api/events/:id` - Get single event details
- `POST /api/events` - Create new event (with validation)
- `PATCH /api/events/:id/status` - Update verification status (moderation)
- `PATCH /api/events/:id/flag` - Flag event for review

**Data Validation**:
- Zod schemas for runtime type checking
- Drizzle-Zod integration for database schema validation
- Custom error formatting with zod-validation-error

### Data Storage

**Database**: PostgreSQL via Neon (serverless Postgres)
- **ORM**: Drizzle ORM for type-safe database queries
- **Schema Management**: Drizzle Kit for migrations

**Events Schema**:
- Core event information (title, description, dates, location)
- Geographic data (lat/lng) for map display
- Organizer details with privacy controls (contactPublic flag)
- Verification metadata (sources, confidence score, verification status)
- Moderation fields (notes, flags)
- Event categorization (tags, neighborhood, event type flags)

**Storage Strategy**:
- Currently using in-memory storage (`MemStorage`) for development
- Designed for PostgreSQL backend with complete schema defined
- JSONB storage for event sources array (flexible source tracking)
- Timezone-aware timestamps (defaulting to America/New_York)

**Key Design Decisions**:
- Separate `sources` JSONB field to track multiple verification sources per event
- Confidence score (0-100 integer) calculated from source credibility
- Verification status enum (verified/unverified/flagged) for moderation workflow
- Privacy-conscious design: email/contact only shown if organizer opts in

### Authentication & Authorization

**Current State**: No authentication implemented
- Admin routes (`/admin`) are publicly accessible
- Event submission is open to all users
- No user accounts or sessions

**Design Consideration**: Basic admin moderation exists in UI, but lacks authentication layer. Future implementation should add session-based or token-based auth for moderation actions.

## External Dependencies

### Third-Party Services

**Mapping & Geocoding**:
- Leaflet.js for interactive maps
- React-Leaflet for React integration
- External geocoding service (referenced in submit form, implementation details not shown)

**UI Component Libraries**:
- Radix UI primitives (dialogs, dropdowns, popovers, etc.)
- shadcn/ui component system (customized design tokens)
- Lucide React for iconography

**Database**:
- Neon Database (serverless PostgreSQL)
- Connection via `@neondatabase/serverless` driver

**Development Tools**:
- Replit-specific plugins (cartographer, dev banner, runtime error modal)
- ESBuild for production bundling

### Data Sources (Conceptual)

Per the design document, the application is intended to aggregate from:
- City of Charlotte official calendars
- Library branches (Charlotte Mecklenburg Library)
- Neighborhood associations
- Local media and archives
- Community group postings
- User submissions

**Note**: Actual data ingestion/scraping implementation is not present in codebase. Current implementation uses seed data and manual submissions. The `sources` field in events schema is designed to track provenance from these various channels.

### Key NPM Packages

**Core Framework**:
- `express` - Web server
- `react` & `react-dom` - UI framework
- `vite` - Build tool and dev server
- `drizzle-orm` - Database ORM
- `@tanstack/react-query` - Server state management

**Form Handling**:
- `react-hook-form` - Form state management
- `@hookform/resolvers` - Validation integration
- `zod` - Schema validation

**Utilities**:
- `date-fns` - Date manipulation
- `clsx` & `tailwind-merge` - Conditional class names
- `class-variance-authority` - Component variant handling
- `wouter` - Client-side routing