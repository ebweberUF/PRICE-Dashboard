# UF PRICE Study Dashboard

**Version:** 1.1
**Environment:** Production
**Server:** price.dental.ufl.edu (dn-pain-pw01.ahc.ufl.edu)
**Network:** UF Intranet (not internet-facing)
**Authentication:** UF Shibboleth SSO

## Overview

The PRICE Dashboard is a HIPAA-compliant web application for managing clinical research data at the University of Florida's PRICE Center. This application uses a **Limited Data Set** approach (coded subject IDs, relative dates, no PHI) to minimize compliance burden while enabling comprehensive research data management.

## Architecture

This is a monorepo containing:

- **`/backend`** - NestJS REST API server
- **`/frontend`** - Next.js web application
- **`/shared`** - Shared TypeScript types and utilities
- **`/docs`** - Documentation and deployment guides

### Technology Stack

- **Backend:** NestJS (Node.js v24.11.1)
- **Frontend:** Next.js 15 with React 19
- **Database:** PostgreSQL 17 with Row-Level Security
- **Authentication:** UF Shibboleth SSO via Nginx
- **Process Manager:** PM2
- **Web Server:** Nginx (reverse proxy + SSL)

## Data Architecture - Limited Data Set

### What We Store:
✅ **Coded Subject IDs** - Internal study identifiers (no direct PHI linkage)
✅ **Relative Dates** - Days/months relative to enrollment (not absolute dates)
✅ **Aggregated Data** - De-identified research outcomes
✅ **Study Metadata** - Lab info, study protocols, timelines

### What We Do NOT Store:
❌ Names, addresses, phone numbers
❌ Medical record numbers
❌ Absolute dates (birthdates, appointment dates)
❌ Any of the 18 HIPAA identifiers

### Data Sources (API Integrations):
- **REDCap** - Clinical data collection (coded IDs only)
- **eLab** - Lab results (coded specimens)
- **SharePoint** - Document management
- **XNAT** - Imaging data (coded subjects)

## Project Structure

```
PRICE-Dashboard/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── auth/           # Shibboleth SSO integration
│   │   ├── users/          # User management
│   │   ├── studies/        # Study management
│   │   ├── participants/   # Participant tracking (coded IDs)
│   │   ├── integrations/   # External API clients (REDCap, eLab, etc.)
│   │   ├── audit/          # Audit logging
│   │   └── common/         # Shared utilities
│   ├── test/
│   └── package.json
│
├── frontend/               # Next.js UI
│   ├── src/
│   │   ├── app/           # Next.js 15 app router
│   │   ├── components/    # React components
│   │   ├── lib/           # Client utilities
│   │   └── styles/        # CSS/styling
│   ├── public/
│   └── package.json
│
├── shared/                 # Shared code
│   ├── types/             # TypeScript interfaces
│   └── utils/             # Date conversion, validators
│
├── docs/                   # Documentation
│   └── DEPLOYMENT_GUIDE.md
│
└── README.md
```

## Security Features

1. **UF Shibboleth SSO** - Campus-wide single sign-on
2. **PostgreSQL Row-Level Security** - Data access control at DB level
3. **Audit Logging** - All user actions tracked
4. **HTTPS/TLS** - Encrypted transport within UF network
5. **Limited Data Set** - No PHI stored in database
6. **Automatic Updates** - Security patches via unattended-upgrades
7. **IT Monitoring** - Zabbix + Trend Micro Deep Security

## Development Setup

### Prerequisites
- Node.js v24.11.1 (via NVM)
- PostgreSQL 17
- Access to UF network (VPN or on-campus)

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ebweberUF/PRICE-Dashboard.git
   cd PRICE-Dashboard
   ```

2. **Set up backend:**
   ```bash
   cd backend
   npm install
   cp .env.example .env  # Configure database credentials
   npm run migration:run
   npm run dev
   ```

3. **Set up frontend:**
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local  # Configure API endpoint
   npm run dev
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## Production Deployment

See [DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) for complete deployment instructions.

### Quick Deployment Steps:
1. Server hardening and base setup ✅
2. PostgreSQL 17 installation ✅
3. Application setup (current phase)
4. Nginx + SSL configuration
5. UF Shibboleth integration
6. API integrations (REDCap, eLab, SharePoint, XNAT)
7. Monitoring and backups

## Database Schema

The database uses a hierarchical organization:

```
PRICE Center
  └── Labs (e.g., Pain Research Lab)
      └── Studies (e.g., Chronic Pain Study)
          └── Participants (coded IDs only)
              └── Data Points (relative dates)
```

### Key Tables:
- `users` - Application users (from Shibboleth)
- `labs` - Research labs within PRICE Center
- `studies` - Individual research studies
- `participants` - Study participants (coded IDs only)
- `data_points` - Research data (relative dates)
- `audit_logs` - All user actions

## API Integrations

### REDCap
- Project-level data export (coded IDs)
- Survey completion status
- Custom report generation

### eLab
- Specimen tracking (coded IDs)
- Lab result retrieval
- Status updates

### SharePoint
- Document storage
- Version control
- Access management

### XNAT
- Imaging study metadata
- DICOM series tracking
- Quality control metrics

## HIPAA Compliance

This application follows the **Limited Data Set** approach:

- ✅ Approved by IRB for Limited Data Set use
- ✅ No direct identifiers stored
- ✅ Date conversion utilities (absolute → relative)
- ✅ Audit logging for all access
- ✅ Role-based access control
- ✅ Encrypted transport (HTTPS)
- ✅ Regular security updates

## Support

- **Technical Issues:** Contact UF Health IT
- **Application Issues:** Submit GitHub issue
- **Security Concerns:** Contact HIPAA Security Officer

## License

Proprietary - University of Florida PRICE Center

---

**Last Updated:** November 22, 2025
**Maintained By:** UF PRICE Center Development Team
