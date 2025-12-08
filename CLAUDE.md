# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PRICE Dashboard is a HIPAA-compliant web application for the UF PRICE (Pain Research and Intervention Center of Excellence) Center. It uses a **Limited Data Set** approach - storing only coded subject IDs and relative dates (days since enrollment), never PHI.

**Environment:** UF Intranet only (not internet-facing)
**Authentication:** UF Shibboleth SSO via Nginx
**Server:** price.dental.ufl.edu

## Build and Development Commands

### Full Stack (from root)
```bash
npm install              # Install all workspace dependencies
npm run dev              # Run backend and frontend concurrently
npm run build            # Build all packages
npm run test             # Run tests across all workspaces
npm run lint             # Lint all workspaces
```

### Backend (NestJS)
```bash
cd backend
npm run start:dev        # Development with hot reload
npm run start:debug      # Debug mode with hot reload
npm run build            # Build for production
npm run start:prod       # Run production build
npm run test             # Run unit tests
npm run test:watch       # Watch mode for tests
npm run test:cov         # Coverage report
npm run test:e2e         # End-to-end tests
npm run lint             # Lint and fix
npm run format           # Prettier formatting
```

### Frontend (Next.js 15)
```bash
cd frontend
npm run dev              # Development server (localhost:3000)
npm run build            # Production build
npm run start            # Run production build
npm run lint             # ESLint
```

### Shared Package
```bash
cd shared
npm run build            # Compile TypeScript
npm run dev              # Watch mode
```

## Architecture

This is a **monorepo** with npm workspaces:

```
/backend     - NestJS REST API (port 3001)
/frontend    - Next.js 15 with React 19 and App Router (port 3000)
/shared      - TypeScript types and utilities (@price-dashboard/shared)
```

### Technology Stack
- **Backend:** NestJS 11, TypeScript, PostgreSQL 17 with Row-Level Security
- **Frontend:** Next.js 15, React 19, Tailwind CSS 4
- **Runtime:** Node.js v24.11.1
- **Process Manager:** PM2 (production)
- **Web Server:** Nginx (reverse proxy + SSL + Shibboleth)

### Data Hierarchy
```
PRICE Center
  └── Labs (e.g., Pain Management Lab)
      └── Studies (e.g., Chronic Pain Study)
          └── Participants (coded IDs only)
              └── Data Points (relative dates)
```

### External API Integrations
- **REDCap** - Clinical data collection
- **eLab** - Lab specimen tracking
- **SharePoint** - Document management
- **XNAT** - Imaging data

## Key Design Constraints

### Limited Data Set Compliance
- **Never store actual dates** - convert to relative days since enrollment
- **Never store PHI** - use coded subject IDs (e.g., "PAIN001")
- **Age at enrollment** stored instead of date of birth
- Date conversion utilities should be used for all date handling

### Backend Module Structure (Planned)
```
src/
├── auth/           # Shibboleth SSO integration
├── users/          # User management
├── labs/           # Lab management
├── studies/        # Study management
├── participants/   # Participant tracking (coded IDs)
├── integrations/   # External API clients (redcap, elab, sharepoint, xnat)
├── audit/          # Audit logging
└── common/         # Guards, decorators, middleware, filters
```

### Database
- PostgreSQL 17 with Row-Level Security (RLS) for access control
- User context set via `set_current_user_id()` function for RLS policies
- Database: `price_production`, User: `price_app`

## Testing

### Backend Tests
```bash
# Single test file
cd backend && npm run test -- path/to/file.spec.ts

# Specific test by name pattern
cd backend && npm run test -- --testNamePattern="should create"

# E2E tests
cd backend && npm run test:e2e
```

### Jest Configuration
- Unit tests: `*.spec.ts` files in `src/` directory
- E2E tests: `test/` directory with `jest-e2e.json` config

## Production Deployment Notes

- Application runs under `price-app` user
- Node.js installed via NVM for price-app user
- PM2 manages Node processes in cluster mode
- Nginx handles SSL termination and Shibboleth authentication
- Uses system fonts (not Google Fonts) due to intranet-only deployment
- APT proxy may need bypass: `-o Acquire::http::Proxy=false`
