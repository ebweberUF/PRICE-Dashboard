# PRICE Dashboard - Backend API

NestJS-based REST API server for the PRICE Study Dashboard.

## Features

- **Authentication:** UF Shibboleth SSO integration
- **Database:** PostgreSQL 17 with TypeORM
- **Security:** Row-level security, audit logging
- **API Integrations:** REDCap, eLab, SharePoint, XNAT
- **HIPAA Compliance:** Limited Data Set approach

## Structure

```
src/
├── auth/              # Shibboleth SSO integration
├── users/             # User management
├── labs/              # Lab management
├── studies/           # Study management
├── participants/      # Participant tracking (coded IDs)
├── data-points/       # Research data points
├── integrations/      # External API clients
│   ├── redcap/
│   ├── elab/
│   ├── sharepoint/
│   └── xnat/
├── audit/             # Audit logging
├── common/            # Shared utilities
│   ├── guards/
│   ├── interceptors/
│   ├── decorators/
│   └── filters/
└── database/          # Database migrations and seeds
```

## Getting Started

See main README.md for setup instructions.

## Environment Variables

Required variables (create `.env` file):

```env
NODE_ENV=production
PORT=3001

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=price_app
DB_PASSWORD=your_password_here
DB_DATABASE=price_production

# Session
SESSION_SECRET=your_session_secret_here

# Shibboleth
SHIBBOLETH_ENABLED=true

# API Keys (for integrations)
REDCAP_API_URL=
REDCAP_API_TOKEN=
ELAB_API_URL=
ELAB_API_KEY=
SHAREPOINT_CLIENT_ID=
SHAREPOINT_CLIENT_SECRET=
XNAT_URL=
XNAT_USERNAME=
XNAT_PASSWORD=
```

## Development

```bash
npm install
npm run dev
```

## Testing

```bash
npm run test
npm run test:e2e
npm run test:cov
```

## Production

```bash
npm run build
npm run migration:run
pm2 start ecosystem.config.js
```
