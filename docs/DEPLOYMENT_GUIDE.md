# UF PRICE Study Dashboard - Complete Deployment Guide

**Version:** 1.1
**Date:** November 2025
**Data Approach:** Limited Data Set (Coded IDs, Relative Dates)
**Server:** price.dental.ufl.edu (dn-pain-pw01.ahc.ufl.edu)
**Network:** UF Intranet (not internet-facing)
**Authentication:** UF Shibboleth SSO

---

## 🔄 Implementation Notes (November 2025)

### Actual Deployment Decisions

Based on the intranet deployment (UF network only with SSO authentication), the following adjustments were made to the original security plan:

#### ✅ Implemented (November 22, 2025):
- **System Updates**: Ubuntu 24.04 LTS fully updated
- **UFW Firewall**: Active with rules for SSH (22), Zabbix (10050), Deep Security (4118), HTTP (80), HTTPS (443), ports 3000-3001
- **Automatic Security Updates**: Enabled via unattended-upgrades
- **Existing IT Security**: Zabbix monitoring + Trend Micro Deep Security already in place
- **Application User**: `price-app` user created with home directory and application folders
- **Node.js**: v24.11.1 installed via NVM for price-app user
- **npm**: v11.6.2 installed
- **PM2**: v6.0.13 installed globally for process management
- **PostgreSQL**: v17.7 installed and running
- **Database**: `price_production` database created with UTF8 encoding
- **Database User**: `price_app` user created with appropriate permissions

#### ✅ Implemented (December 2025):
- **Frontend**: Next.js 15 with Tailwind Admin template deployed
- **Project Location**: `/home/price-app/price-dashboard`
- **Theme**: Light mode default (next-themes configured)
- **UI Framework**: Tailwind CSS with custom PRICE branding
- **Icons**: @iconify/react with Solar icon set
- **Development Server**: Running on port 3000 (port 3001 as fallback)

#### ⏭️ Deferred/Modified:
- **SSH Hardening**: Skipped for now (password auth retained, can implement SSH keys later)
- **Fail2Ban**: Skipped (intranet deployment with SSO reduces brute-force risk)
- **Custom SSH Port**: Keeping standard port 22 (IT monitoring expects it)

#### 🎯 Priority Security Measures:
1. **UF Shibboleth SSO** - Critical for intranet authentication
2. **PostgreSQL Row-Level Security** - Enforce data access control
3. **Limited Data Set Compliance** - No PHI stored in database
4. **HTTPS/TLS** - Encrypted transport within UF network
5. **Audit Logging** - Track all user actions

#### 🔧 Known Issues / Notes:
- **APT Proxy**: Puppet manages `/etc/apt/apt.conf.d/01proxy` with broken proxy (puppet.ahc.ufl.edu:3142). Use `-o Acquire::http::Proxy=false` flag for apt commands or contact IT about the proxy configuration.
- **Node.js Access**: Node is installed via NVM for price-app user. It's available when logged in as price-app but not via `sudo -u price-app` (this is expected and fine).

#### 📋 Next Steps:
- [ ] Configure Nginx reverse proxy with SSL and UF Shibboleth integration
- [ ] Set up REDCap, eLab, SharePoint, XNAT API integrations
- [ ] Implement NestJS backend with database connections
- [ ] Implement audit logging and monitoring
- [ ] Configure automated backups

---

## Current Deployment (Quick Start)

### Running the Frontend on the VM

```bash
# SSH into the VM
ssh price-app@dn-pain-pw01.ahc.ufl.edu

# Navigate to the project
cd /home/price-app/price-dashboard/frontend

# Install dependencies (if needed)
npm install

# Start development server
npm run dev

# The dashboard will be available at:
# http://10.4.116.117:3000 (or :3001 if 3000 is in use)
```

### Updating the Frontend

```bash
# SSH into the VM
ssh price-app@dn-pain-pw01.ahc.ufl.edu

# Navigate to the project
cd /home/price-app/price-dashboard

# Pull latest changes
git pull origin main

# Clear Next.js cache (important!)
rm -rf frontend/.next

# Install dependencies
cd frontend && npm install

# Restart the server
npm run dev
```

### Current Project Structure on VM

```
/home/price-app/price-dashboard/
├── frontend/                      # Next.js 15 frontend
│   ├── src/
│   │   └── app/
│   │       ├── layout.tsx         # Root layout with theme provider
│   │       ├── (DashboardLayout)/ # Dashboard pages with sidebar
│   │       │   ├── layout.tsx     # Dashboard layout wrapper
│   │       │   ├── page.tsx       # Main dashboard (/)
│   │       │   ├── studies/       # Studies pages
│   │       │   ├── participants/  # Participants pages
│   │       │   ├── labs/          # Labs pages
│   │       │   └── layout/        # Sidebar & header components
│   │       └── components/        # Shared components
│   ├── package.json
│   └── .next/                     # Build cache (delete to force rebuild)
├── backend/                       # NestJS backend (not yet implemented)
├── docs/                          # Documentation
└── README.md
```

### Important Configuration Files

| File | Purpose |
|------|---------|
| `frontend/src/app/layout.tsx` | Theme provider (light mode default) |
| `frontend/src/app/(DashboardLayout)/layout/sidebar/Sidebaritems.ts` | Sidebar navigation menu |
| `frontend/src/app/components/shared/CardBox.tsx` | Reusable card component |

### Troubleshooting

**Issue: Dark/black UI**
- Edit `frontend/src/app/layout.tsx`
- Ensure ThemeProvider has `defaultTheme='light'` and `enableSystem={false}`

**Issue: "Class extends value undefined" error**
- Add `"use client"` at the top of any component using @iconify/react or React hooks

**Issue: Changes not appearing after git pull**
- Clear the cache: `rm -rf frontend/.next`
- Restart the dev server

### Network Architecture (Actual)

```
┌─────────────────────────────────────────┐
│  UF Network (Intranet Only)             │
│  - Accessible via UF VPN or on-campus   │
│  - UF Shibboleth SSO required           │
└────────────┬────────────────────────────┘
             │ HTTPS (443)
             │
    ┌────────▼────────┐
    │  price.dental.  │
    │    ufl.edu      │  SSL Certificate
    │ (10.4.116.117)  │
    └────────┬────────┘
             │
      ┌──────▼──────┐
      │   Nginx     │  Reverse Proxy + SSL
      │             │  UF Shibboleth Handler
      └──────┬──────┘
             │
      ┌──────▼──────┐
      │  Node.js    │  NestJS Backend
      │   (PM2)     │  Session Management
      └──────┬──────┘
             │
      ┌──────▼──────┐
      │ PostgreSQL  │  Limited Data Set
      │ (localhost) │  Row-Level Security
      └─────────────┘
```

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Architecture](#system-architecture)
3. [Data Model - Limited Data Set Approach](#data-model---limited-data-set-approach)
4. [Server Specifications](#server-specifications)
5. [Technology Stack](#technology-stack)
6. [Phase 1: Server Hardening & Base Setup](#phase-1-server-hardening--base-setup)
7. [Phase 2: Database Setup](#phase-2-database-setup)
8. [Phase 3: Application Architecture](#phase-3-application-architecture)
9. [Phase 4: Date Conversion Utilities](#phase-4-date-conversion-utilities)
10. [Phase 5: Security & Authentication](#phase-5-security--authentication)
11. [Phase 6: API Integrations](#phase-6-api-integrations)
12. [Phase 7: HIPAA Compliance (Limited Data Set)](#phase-7-hipaa-compliance-limited-data-set)
13. [Phase 8: Monitoring & Logging](#phase-8-monitoring--logging)
14. [Phase 9: Backup Strategy](#phase-9-backup-strategy)
15. [Phase 10: Deployment Automation](#phase-10-deployment-automation)
16. [Maintenance Procedures](#maintenance-procedures)
17. [Troubleshooting Guide](#troubleshooting-guide)

---

## Executive Summary

This document provides comprehensive deployment instructions for the UF PRICE (Pain Research and Intervention Center of Excellence) Study Dashboard application using a **Limited Data Set approach**.

### Key Features

- **Hierarchical Organization:** PRICE Center → Labs → Studies → Participants
- **Limited Data Set:** Stores coded subject IDs (no direct identifiers)
- **Relative Dates:** All dates converted to "days since enrollment" (no actual dates stored)
- **Data Completeness Tracking:** Identify missing data by coded subject ID
- **Multi-Source Integration:** REDCap, eLab, SharePoint, XNAT
- **HIPAA Compliant:** No direct identifiers stored, appropriate safeguards
- **UF Shibboleth SSO:** Secure authentication with role-based access

### What Gets Stored

✅ **Coded subject IDs** (e.g., "PAIN001", "CP-042")
✅ **Relative dates** (Day 0, Day 7, Day 31)
✅ **Age at enrollment** (not date of birth)
✅ **Data completeness flags** (TRUE/FALSE, not actual values)
✅ **Visit status** (scheduled, completed, missed)

### What Does NOT Get Stored (18 HIPAA Identifiers)

❌ Names, phone numbers, email addresses
❌ Actual dates (only relative days)
❌ Date of birth (only age)
❌ SSN, MRN, account numbers
❌ Geographic locations < state level
❌ Any other direct identifiers

---

## System Architecture

### High-Level Architecture

```
                    ┌─────────────────┐
                    │   UF Network    │
                    └────────┬────────┘
                             │ HTTPS (443)
                             │
                    ┌────────▼────────┐
                    │     Nginx       │  SSL Termination
                    │  (Reverse Proxy)│  Security Headers
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │                             │
         ┌────▼────┐                   ┌────▼────┐
         │ Node.js │                   │ Node.js │
         │Instance1│                   │Instance2│  PM2 Cluster
         └────┬────┘                   └────┬────┘
              │                             │
              └──────────────┬──────────────┘
                             │
                    ┌────────▼────────┐
                    │   PostgreSQL    │  Limited Data Set
                    │  (Localhost Only)│  Coded IDs, Relative Dates
                    └─────────────────┘
```

### Data Flow with De-identification

```
┌───────────────────────────────────────────────────────────┐
│  External Data Sources (Contains PHI)                     │
│  - REDCap: participant_name, dob, enrollment_date="2024-03-15" │
│  - eLab: sample results with MRN                          │
│  - SharePoint: documents with patient names               │
│  - XNAT: imaging data with identifiers                    │
└────────────────────┬──────────────────────────────────────┘
                     │ API Call (fetch on-demand)
                     │
┌────────────────────▼──────────────────────────────────────┐
│  Backend Service (In-Memory Processing)                   │
│  1. Fetch individual records from external API            │
│  2. Extract coded subject ID ("PAIN001")                  │
│  3. Convert dates:                                         │
│     - enrollment_date "2024-03-15" → Day 0                │
│     - visit_date "2024-03-22" → Day 7                     │
│     - dob "1985-06-20" → age: 38                          │
│  4. Determine data completeness (TRUE/FALSE)              │
│  5. Discard PHI from memory                               │
│  6. Store ONLY de-identified summary                      │
└────────────────────┬──────────────────────────────────────┘
                     │ Limited Data Set Only
                     │
┌────────────────────▼──────────────────────────────────────┐
│  Database (No Direct Identifiers)                         │
│  - subject_id: "PAIN001"                                  │
│  - enrollment_day: 0                                      │
│  - age_at_enrollment: 38                                  │
│  - baseline_visit_day: 0                                  │
│  - week1_visit_day: 7                                     │
│  - baseline_complete: TRUE                                │
│  - pain_score_complete: FALSE                             │
└────────────────────┬──────────────────────────────────────┘
                     │
┌────────────────────▼──────────────────────────────────────┐
│  Dashboard (Displays Coded IDs & Relative Dates)         │
│  - "PAIN001 enrolled on Day 0"                            │
│  - "PAIN001 completed Week 1 visit on Day 7"             │
│  - "PAIN001 is missing Pain Score assessment"            │
│  - [Chart showing enrollment over relative time]          │
└───────────────────────────────────────────────────────────┘
```

---

## Data Model - Limited Data Set Approach

### Hierarchical Organization

```
UF PRICE Center
  │
  ├── Pain Management Lab
  │     ├── Chronic Pain Study (IRB-12345)
  │     │     ├── Participant: PAIN001 (Day 0, Age 38)
  │     │     ├── Participant: PAIN002 (Day 0, Age 45)
  │     │     └── Participant: PAIN003 (Day 0, Age 52)
  │     │
  │     └── Opioid Reduction Study (IRB-67890)
  │           ├── Participant: OPI-001 (Day 0, Age 29)
  │           └── Participant: OPI-002 (Day 0, Age 61)
  │
  ├── Neuroscience Lab
  │     └── ...
  │
  └── Clinical Trials Lab
        └── ...
```

### Database Schema (Limited Data Set)

```sql
-- ===========================
-- ORGANIZATIONAL HIERARCHY
-- ===========================

-- Labs table
CREATE TABLE labs (
  id SERIAL PRIMARY KEY,
  lab_code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  lab_admin_user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  active BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{}'
);

-- Studies table (belongs to a lab)
CREATE TABLE studies (
  id SERIAL PRIMARY KEY,
  lab_id INTEGER REFERENCES labs(id) NOT NULL,
  study_code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  irb_number VARCHAR(50),
  pi_user_id INTEGER REFERENCES users(id),
  enrollment_target INTEGER,
  start_year INTEGER,                    -- Year only (not full date)
  end_year INTEGER,                      -- Year only (not full date)
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  active BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{}'
);

CREATE INDEX idx_studies_lab ON studies(lab_id);
CREATE INDEX idx_studies_active ON studies(active);

-- ===========================
-- USER MANAGEMENT
-- ===========================

-- Users (from Shibboleth - NO PHI)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  ufid VARCHAR(20) UNIQUE NOT NULL,      -- UF identifier (not PHI)
  email VARCHAR(255) NOT NULL,           -- UF email (not patient email)
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  display_name VARCHAR(255),
  affiliation VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  active BOOLEAN DEFAULT true
);

-- Lab-level access control
CREATE TABLE lab_user_access (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  lab_id INTEGER REFERENCES labs(id) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'member', 'viewer')),
  granted_at TIMESTAMP DEFAULT NOW(),
  granted_by INTEGER REFERENCES users(id),
  UNIQUE(user_id, lab_id)
);

CREATE INDEX idx_lab_user_access_user ON lab_user_access(user_id);
CREATE INDEX idx_lab_user_access_lab ON lab_user_access(lab_id);
CREATE INDEX idx_lab_user_access_lookup ON lab_user_access(user_id, lab_id);

-- Study-level access control
CREATE TABLE study_user_access (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  study_id INTEGER REFERENCES studies(id) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('pi', 'coordinator', 'researcher', 'viewer')),
  granted_at TIMESTAMP DEFAULT NOW(),
  granted_by INTEGER REFERENCES users(id),
  UNIQUE(user_id, study_id)
);

CREATE INDEX idx_study_user_access_user ON study_user_access(user_id);
CREATE INDEX idx_study_user_access_study ON study_user_access(study_id);
CREATE INDEX idx_study_user_access_lookup ON study_user_access(user_id, study_id);

-- ===========================
-- PARTICIPANT DATA (LIMITED DATA SET)
-- ===========================

-- Study participants (CODED IDs, RELATIVE DATES, NO PHI)
CREATE TABLE study_participants (
  id SERIAL PRIMARY KEY,
  study_id INTEGER REFERENCES studies(id) NOT NULL,
  subject_id VARCHAR(50) NOT NULL,       -- ✅ Coded ID (e.g., "PAIN001", "CP-042")
  enrollment_day INTEGER DEFAULT 0,      -- ✅ Always Day 0 for enrollment
  age_at_enrollment INTEGER,             -- ✅ Age (NOT date of birth)
  gender VARCHAR(20),                    -- ✅ OK if not identifying
  race_ethnicity VARCHAR(100),           -- ✅ Aggregated categories
  status VARCHAR(50) CHECK (status IN ('screened', 'enrolled', 'active', 'withdrawn', 'completed')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(study_id, subject_id)
);

CREATE INDEX idx_participants_study ON study_participants(study_id);
CREATE INDEX idx_participants_subject ON study_participants(subject_id);
CREATE INDEX idx_participants_status ON study_participants(status);

COMMENT ON COLUMN study_participants.subject_id IS 'Coded participant ID from REDCap (NO PHI)';
COMMENT ON COLUMN study_participants.enrollment_day IS 'Always Day 0 - enrollment baseline';
COMMENT ON COLUMN study_participants.age_at_enrollment IS 'Age in years at enrollment (NOT date of birth)';

-- Participant visits (RELATIVE DATES)
CREATE TABLE participant_visits (
  id SERIAL PRIMARY KEY,
  participant_id INTEGER REFERENCES study_participants(id) NOT NULL,
  visit_name VARCHAR(100) NOT NULL,      -- ✅ "Baseline", "Week 1", "Month 3"
  scheduled_day INTEGER,                 -- ✅ Days since enrollment (scheduled)
  completed_day INTEGER,                 -- ✅ Days since enrollment (actual)
  status VARCHAR(50) CHECK (status IN ('scheduled', 'completed', 'missed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_visits_participant ON participant_visits(participant_id);
CREATE INDEX idx_visits_status ON participant_visits(status);

COMMENT ON COLUMN participant_visits.scheduled_day IS 'Days since enrollment when visit was scheduled';
COMMENT ON COLUMN participant_visits.completed_day IS 'Days since enrollment when visit was actually completed';

-- Data sources configuration per study
CREATE TABLE study_data_sources (
  id SERIAL PRIMARY KEY,
  study_id INTEGER REFERENCES studies(id) NOT NULL,
  source_type VARCHAR(50) NOT NULL CHECK (source_type IN ('redcap', 'elab', 'sharepoint', 'xnat')),
  source_name VARCHAR(100),
  source_config JSONB NOT NULL,          -- API endpoints, project IDs, field mappings
  credentials_ref VARCHAR(255),          -- Reference to secrets.json
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_data_sources_study ON study_data_sources(study_id);

-- Participant data completeness tracking (NO ACTUAL VALUES)
CREATE TABLE participant_data_status (
  id SERIAL PRIMARY KEY,
  participant_id INTEGER REFERENCES study_participants(id) NOT NULL,
  visit_id INTEGER REFERENCES participant_visits(id),
  data_source VARCHAR(50) NOT NULL,      -- 'redcap', 'elab', 'sharepoint', 'xnat'
  instrument_name VARCHAR(100) NOT NULL, -- e.g., 'demographics', 'pain_assessment'
  field_name VARCHAR(100) NOT NULL,      -- e.g., 'pain_score', 'medical_history'
  is_complete BOOLEAN NOT NULL,          -- ✅ TRUE/FALSE (NOT the actual value)
  last_checked TIMESTAMP DEFAULT NOW(),
  UNIQUE(participant_id, visit_id, data_source, instrument_name, field_name)
);

CREATE INDEX idx_data_status_participant ON participant_data_status(participant_id);
CREATE INDEX idx_data_status_complete ON participant_data_status(is_complete);

COMMENT ON COLUMN participant_data_status.is_complete IS 'Whether field is complete (TRUE/FALSE) - does NOT store actual PHI value';

-- ===========================
-- AGGREGATE METRICS
-- ===========================

-- Study recruitment metrics (for quick dashboard display)
CREATE TABLE study_recruitment_metrics (
  id SERIAL PRIMARY KEY,
  study_id INTEGER REFERENCES studies(id) NOT NULL,
  metric_date DATE NOT NULL,             -- Date of metric calculation
  screened_count INTEGER DEFAULT 0,
  enrolled_count INTEGER DEFAULT 0,
  active_count INTEGER DEFAULT 0,
  completed_count INTEGER DEFAULT 0,
  withdrawn_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(study_id, metric_date)
);

CREATE INDEX idx_metrics_study ON study_recruitment_metrics(study_id);
CREATE INDEX idx_metrics_date ON study_recruitment_metrics(metric_date DESC);

-- Study data completeness summary
CREATE TABLE study_data_completeness (
  id SERIAL PRIMARY KEY,
  study_id INTEGER REFERENCES studies(id) NOT NULL,
  data_source VARCHAR(50) NOT NULL,
  instrument_name VARCHAR(100) NOT NULL,
  field_name VARCHAR(100) NOT NULL,
  total_expected INTEGER NOT NULL,
  total_complete INTEGER NOT NULL,
  completeness_percentage DECIMAL(5,2) NOT NULL,
  last_updated TIMESTAMP DEFAULT NOW(),
  UNIQUE(study_id, data_source, instrument_name, field_name)
);

CREATE INDEX idx_completeness_study ON study_data_completeness(study_id);

-- ===========================
-- AUDIT LOGGING (SIMPLIFIED)
-- ===========================

-- Audit log (NO PHI ACCESS - just user actions)
CREATE TABLE audit_log (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action VARCHAR(100) NOT NULL,          -- 'view_study', 'export_list', 'login', 'logout'
  resource_type VARCHAR(50),             -- 'study', 'lab', 'participant_list'
  resource_id INTEGER,
  lab_id INTEGER REFERENCES labs(id),
  study_id INTEGER REFERENCES studies(id),
  ip_address INET,
  user_agent TEXT,
  details JSONB,
  timestamp TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON audit_log(user_id);
CREATE INDEX idx_audit_timestamp ON audit_log(timestamp DESC);
CREATE INDEX idx_audit_study ON audit_log(study_id);
CREATE INDEX idx_audit_lab ON audit_log(lab_id);

COMMENT ON TABLE audit_log IS 'Audit log for user actions (NOT individual PHI access since we store coded IDs only)';

-- ===========================
-- ROW-LEVEL SECURITY (RLS)
-- ===========================

-- Enable RLS on sensitive tables
ALTER TABLE studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_participants ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access studies they have permission for
CREATE POLICY study_access_policy ON studies
  FOR ALL
  TO price_app
  USING (
    id IN (
      SELECT study_id
      FROM study_user_access
      WHERE user_id = current_setting('app.current_user_id', true)::INTEGER
    )
    OR
    lab_id IN (
      SELECT lab_id
      FROM lab_user_access
      WHERE user_id = current_setting('app.current_user_id', true)::INTEGER
    )
  );

-- Policy: Users can only see participants from their authorized studies
CREATE POLICY participant_access_policy ON study_participants
  FOR ALL
  TO price_app
  USING (
    study_id IN (
      SELECT study_id
      FROM study_user_access
      WHERE user_id = current_setting('app.current_user_id', true)::INTEGER
    )
  );

-- Function to set current user context for RLS
CREATE OR REPLACE FUNCTION set_current_user_id(user_id INTEGER)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.current_user_id', user_id::TEXT, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION set_current_user_id IS 'Set current user context for Row-Level Security';
```

---

## Server Specifications

| Component | Specification |
|-----------|--------------|
| **Server Name** | dn-pain-pw01.ahc.ufl.edu |
| **Public Domain** | price.dental.ufl.edu |
| **IP Address** | 10.4.116.117 |
| **Operating System** | Ubuntu 24.04 LTS |
| **CPU** | 4 cores |
| **RAM** | 8GB |
| **Storage** | 100GB |
| **Current User** | ebweber (admin) |
| **App User** | price-app (to be created) |

---

## Technology Stack

### Backend
- **Runtime:** Node.js v20 LTS (via NVM)
- **Framework:** NestJS with TypeScript
- **Database:** PostgreSQL 17
- **ORM/Migrations:** Knex.js
- **Authentication:** passport-ufshib (UF Shibboleth/SAML)
- **Session:** express-session with PostgreSQL store
- **Logging:** Winston with daily rotation
- **Process Manager:** PM2 (cluster mode, 2 instances)

### Frontend
- **Framework:** Next.js 15 (React-based, App Router)
- **UI Library:** Material-UI (MUI) or Ant Design
- **Charts:** Recharts
- **Tables:** TanStack Table (React Table)
- **HTTP Client:** Axios
- **Type Safety:** TypeScript

### Infrastructure
- **Web Server:** Nginx (reverse proxy, SSL termination)
- **SSL/TLS:** Let's Encrypt (Certbot)
- **Firewall:** UFW
- **Intrusion Prevention:** Fail2Ban
- **Monitoring:** Netdata
- **Version Control:** Git

### Security & Compliance
- **Data Approach:** Limited Data Set (coded IDs, relative dates)
- **Access Control:** PostgreSQL Row-Level Security (RLS)
- **Session Security:** Secure, HttpOnly, SameSite cookies, 30-min timeout
- **Encryption in Transit:** TLS 1.2+
- **Security Headers:** Helmet.js + Nginx headers
- **Audit Logging:** Winston with 90-day retention

---

## Phase 1: Server Hardening & Base Setup

### 1.1 Initial System Update

```bash
# Connect to server as ebweber
ssh ebweber@10.4.116.117

# Update package lists and upgrade system
sudo apt update && sudo apt upgrade -y

# Install essential utilities
sudo apt install -y \
  curl \
  wget \
  git \
  vim \
  htop \
  build-essential \
  software-properties-common \
  apt-transport-https \
  ca-certificates \
  gnupg \
  lsb-release
```

### 1.2 Enable Automatic Security Updates

```bash
# Install unattended-upgrades
sudo apt install unattended-upgrades -y

# Configure automatic updates
sudo dpkg-reconfigure -plow unattended-upgrades

# Verify configuration
cat /etc/apt/apt.conf.d/50unattended-upgrades
```

### 1.3 SSH Hardening

```bash
# Backup original SSH config
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup

# Edit SSH configuration
sudo nano /etc/ssh/sshd_config
```

**Add/modify these settings:**

```bash
# SSH Hardening Configuration
Port 2222                          # Change from default 22
PermitRootLogin no                 # Disable root login
PasswordAuthentication no          # Require SSH keys
PubkeyAuthentication yes           # Enable key-based auth
MaxAuthTries 3                     # Limit auth attempts
X11Forwarding no                   # Disable X11
Protocol 2                         # Use SSH Protocol 2 only
LoginGraceTime 60                  # Time to authenticate
MaxSessions 10                     # Concurrent sessions
ClientAliveInterval 300            # Keep-alive every 5 min
ClientAliveCountMax 2              # Max missed keep-alives

# Allow specific users
AllowUsers ebweber price-app
```

**CRITICAL: Test before closing your session!**

```bash
# Open a NEW terminal and test SSH on new port
ssh -p 2222 ebweber@10.4.116.117

# If successful, restart SSH in original terminal
sudo systemctl restart sshd

# Update UFW to allow new SSH port (before enabling firewall)
sudo ufw allow 2222/tcp comment 'SSH'
```

### 1.4 Firewall Configuration (UFW)

```bash
# Install UFW
sudo apt install ufw -y

# Set default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH (use your custom port)
sudo ufw allow 2222/tcp comment 'SSH'

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp comment 'HTTP'
sudo ufw allow 443/tcp comment 'HTTPS'

# Enable firewall
sudo ufw enable

# Verify status
sudo ufw status verbose
```

### 1.5 Fail2Ban Installation

```bash
# Install Fail2Ban
sudo apt install fail2ban -y

# Create local configuration
sudo nano /etc/fail2ban/jail.local
```

**Fail2Ban configuration:**

```ini
[DEFAULT]
# Ban settings
bantime = 86400          # 24 hours
findtime = 3600          # 1 hour window
maxretry = 3             # 3 failed attempts
backend = systemd        # Use systemd for Ubuntu 24.04
banaction = ufw          # Use UFW for banning
destemail = ebweber@ufl.edu
sendername = Fail2Ban-PRICE
action = %(action_mwl)s  # Ban and email with logs

[sshd]
enabled = true
port = 2222              # Your custom SSH port
logpath = /var/log/auth.log
maxretry = 3

[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log

[nginx-noscript]
enabled = true
port = http,https
logpath = /var/log/nginx/access.log
```

```bash
# Start and enable Fail2Ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Check status
sudo fail2ban-client status
sudo fail2ban-client status sshd
```

### 1.6 Create Application User

```bash
# Create dedicated user for application
sudo adduser price-app --disabled-password --gecos "PRICE Dashboard Application"

# Create application directories
sudo mkdir -p /home/price-app/price-dashboard
sudo mkdir -p /var/log/price-dashboard
sudo mkdir -p /var/backups/price-dashboard
sudo mkdir -p /etc/price-dashboard

# Set ownership
sudo chown -R price-app:price-app /home/price-app
sudo chown -R price-app:price-app /var/log/price-dashboard
sudo chown -R price-app:price-app /var/backups/price-dashboard
sudo chown -R price-app:price-app /etc/price-dashboard

# Set permissions
sudo chmod 750 /home/price-app/price-dashboard
sudo chmod 750 /var/log/price-dashboard
sudo chmod 700 /etc/price-dashboard
```

### 1.7 Install Node.js via NVM

```bash
# Switch to price-app user
sudo su - price-app

# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Reload shell configuration
source ~/.bashrc

# Install Node.js LTS (v20)
nvm install --lts
nvm alias default lts/*
nvm use default

# Verify installation
node --version    # Should show v20.x.x
npm --version     # Should show v10.x.x

# Install PM2 globally
npm install -g pm2

# Exit back to ebweber
exit
```

---

## Phase 2: Database Setup

### 2.1 Install PostgreSQL 17

```bash
# Add PostgreSQL repository
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'

# Import repository signing key
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -

# Update and install PostgreSQL 17
sudo apt update
sudo apt install postgresql-17 postgresql-client-17 postgresql-contrib-17 -y

# Verify installation
sudo systemctl status postgresql
```

### 2.2 PostgreSQL Performance Tuning

```bash
# Edit PostgreSQL configuration
sudo nano /etc/postgresql/17/main/postgresql.conf
```

**Optimized settings for 8GB RAM:**

```ini
# Memory Settings (8GB RAM system)
shared_buffers = 2GB                    # 25% of RAM
effective_cache_size = 6GB              # 75% of RAM
work_mem = 16MB                         # Per operation
maintenance_work_mem = 512MB            # For VACUUM, CREATE INDEX
wal_buffers = 16MB                      # Write-ahead log buffers

# Connection Settings
max_connections = 100                   # With connection pooling
superuser_reserved_connections = 3

# Write Performance
wal_level = replica                     # For potential replication
checkpoint_completion_target = 0.9      # Spread checkpoints
max_wal_size = 2GB
min_wal_size = 1GB
checkpoint_timeout = 15min

# Query Planner (SSD optimized)
random_page_cost = 1.1                  # Lower for SSD
effective_io_concurrency = 200          # Higher for SSD
default_statistics_target = 100

# Parallel Queries (4 cores available)
max_worker_processes = 4
max_parallel_workers_per_gather = 2
max_parallel_workers = 4

# Logging (Compliance)
logging_collector = on
log_directory = 'log'
log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'
log_rotation_age = 1d
log_rotation_size = 100MB
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '
log_connections = on
log_disconnections = on
log_duration = off
log_statement = 'mod'                   # Log INSERT/UPDATE/DELETE
log_min_duration_statement = 1000       # Log queries > 1 second

# Security
ssl = on
ssl_cert_file = '/etc/ssl/certs/ssl-cert-snakeoil.pem'
ssl_key_file = '/etc/ssl/private/ssl-cert-snakeoil.key'
```

### 2.3 PostgreSQL Security Configuration

```bash
# Edit authentication configuration
sudo nano /etc/postgresql/17/main/pg_hba.conf
```

**Secure pg_hba.conf:**

```conf
# TYPE  DATABASE        USER            ADDRESS                 METHOD

# Local connections
local   all             postgres                                peer
local   all             all                                     scram-sha-256

# IPv4 local connections ONLY (no external access)
host    all             price_app       127.0.0.1/32            scram-sha-256
host    all             price_app       ::1/128                 scram-sha-256

# Deny all other connections
host    all             all             0.0.0.0/0               reject
host    all             all             ::/0                    reject
```

```bash
# Restart PostgreSQL to apply changes
sudo systemctl restart postgresql
```

### 2.4 Create Database and User

```bash
# Switch to postgres user
sudo -u postgres psql
```

**Execute these SQL commands:**

```sql
-- Create application database
CREATE DATABASE price_production
  WITH ENCODING='UTF8'
       LC_COLLATE='en_US.UTF-8'
       LC_CTYPE='en_US.UTF-8'
       TEMPLATE=template0;

-- Create application user with strong password
CREATE USER price_app WITH ENCRYPTED PASSWORD 'CHANGE_THIS_SECURE_PASSWORD_123!';

-- Grant connection privilege
GRANT CONNECT ON DATABASE price_production TO price_app;

-- Connect to the database
\c price_production

-- Grant schema privileges
GRANT USAGE ON SCHEMA public TO price_app;
GRANT CREATE ON SCHEMA public TO price_app;

-- Grant privileges on tables (will be created by migrations)
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO price_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO price_app;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO price_app;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO price_app;

-- Exit psql
\q
```

### 2.5 Apply Limited Data Set Schema

Save the schema from the "Data Model" section above to a file and apply it:

```bash
# As price-app user
sudo su - price-app
cd ~/price-dashboard
mkdir -p migrations

# Create the schema file
nano migrations/001_limited_data_set_schema.sql
# (Paste the complete schema from the Data Model section)

# Apply the migration
psql -U price_app -d price_production -f migrations/001_limited_data_set_schema.sql

# Verify tables were created
psql -U price_app -d price_production -c "\dt"
```

---

## Phase 3: Application Architecture

### 3.1 Project Structure

```bash
# As price-app user
cd /home/price-app/price-dashboard

# Initialize git repository
git init
git config user.name "PRICE Dashboard"
git config user.email "price@dental.ufl.edu"
```

**Create directory structure:**

```bash
mkdir -p backend/src/{modules,common,config,utils}
mkdir -p backend/src/modules/{auth,labs,studies,participants,integrations,audit,rbac}
mkdir -p backend/src/modules/integrations/{redcap,elab,sharepoint,xnat}
mkdir -p backend/src/common/{guards,decorators,middleware,filters}
mkdir -p backend/src/utils
mkdir -p backend/migrations
mkdir -p frontend/app/labs/\[labId\]/studies/\[studyId\]
mkdir -p frontend/components/{labs,studies,participants,charts,common}
mkdir -p frontend/lib
mkdir -p shared/types
mkdir -p config
mkdir -p scripts
mkdir -p docs
```

### 3.2 Initialize Backend (NestJS)

```bash
# Install NestJS CLI
npm install -g @nestjs/cli

# Create NestJS project
cd backend
nest new . --skip-git --package-manager npm

# Install core dependencies
npm install --save \
  @nestjs/config \
  @nestjs/passport \
  @nestjs/jwt \
  passport \
  passport-saml \
  passport-ufshib \
  express-session \
  connect-pg-simple \
  pg \
  knex \
  helmet \
  express-rate-limit \
  winston \
  winston-daily-rotate-file \
  class-validator \
  class-transformer \
  axios \
  date-fns

# Install dev dependencies
npm install --save-dev \
  @types/express-session \
  @types/passport-saml \
  @types/pg
```

### 3.3 Initialize Frontend (Next.js)

```bash
# Create Next.js app
cd ../frontend
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"

# Install UI and charting libraries
npm install --save \
  @mui/material \
  @emotion/react \
  @emotion/styled \
  @mui/icons-material \
  recharts \
  @tanstack/react-table \
  axios \
  date-fns \
  react-hook-form \
  zod
```

---

## Phase 4: Date Conversion Utilities

### 4.1 Date Converter Utility

**File: `backend/src/utils/date-converter.util.ts`**

```typescript
import { differenceInDays, parseISO, isValid } from 'date-fns';

/**
 * Date Conversion Utilities for Limited Data Set
 *
 * Converts actual dates to relative "days since enrollment" to comply with HIPAA.
 * Enrollment date is always Day 0.
 */

export class DateConverter {
  /**
   * Convert an absolute date to days since enrollment
   *
   * @param absoluteDate - The actual date (e.g., "2024-03-22")
   * @param enrollmentDate - The enrollment date (e.g., "2024-03-15")
   * @returns Number of days since enrollment (e.g., 7)
   */
  static convertToRelativeDays(
    absoluteDate: string | Date,
    enrollmentDate: string | Date
  ): number {
    const enrollment = typeof enrollmentDate === 'string'
      ? parseISO(enrollmentDate)
      : enrollmentDate;

    const event = typeof absoluteDate === 'string'
      ? parseISO(absoluteDate)
      : absoluteDate;

    if (!isValid(enrollment) || !isValid(event)) {
      throw new Error('Invalid date provided for conversion');
    }

    const days = differenceInDays(event, enrollment);
    return days;
  }

  /**
   * Calculate age at enrollment (NOT date of birth)
   *
   * @param dateOfBirth - Date of birth (will not be stored)
   * @param enrollmentDate - Enrollment date
   * @returns Age in years at enrollment
   */
  static calculateAgeAtEnrollment(
    dateOfBirth: string | Date,
    enrollmentDate: string | Date
  ): number {
    const dob = typeof dateOfBirth === 'string'
      ? parseISO(dateOfBirth)
      : dateOfBirth;

    const enrollment = typeof enrollmentDate === 'string'
      ? parseISO(enrollmentDate)
      : enrollmentDate;

    if (!isValid(dob) || !isValid(enrollment)) {
      throw new Error('Invalid date provided for age calculation');
    }

    let age = enrollment.getFullYear() - dob.getFullYear();
    const monthDiff = enrollment.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && enrollment.getDate() < dob.getDate())) {
      age--;
    }

    return age;
  }

  /**
   * Convert REDCap date format to relative days
   * REDCap typically uses "YYYY-MM-DD" format
   */
  static convertREDCapDate(
    redcapDate: string,
    enrollmentDate: string
  ): number {
    if (!redcapDate || redcapDate === '') {
      return null;
    }
    return this.convertToRelativeDays(redcapDate, enrollmentDate);
  }

  /**
   * Validate that we're not storing any actual dates
   * Use this in your data sync services to ensure compliance
   */
  static validateNoActualDates(data: any): boolean {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;  // YYYY-MM-DD
    const dateTimePattern = /^\d{4}-\d{2}-\d{2}T/;  // ISO datetime

    const checkValue = (value: any): boolean => {
      if (typeof value === 'string') {
        if (datePattern.test(value) || dateTimePattern.test(value)) {
          throw new Error(
            `Attempting to store actual date: ${value}. Convert to relative days first.`
          );
        }
      } else if (typeof value === 'object' && value !== null) {
        Object.values(value).forEach(checkValue);
      }
      return true;
    };

    checkValue(data);
    return true;
  }
}

/**
 * Example Usage:
 *
 * // From REDCap
 * const enrollmentDate = '2024-03-15';
 * const visit1Date = '2024-03-22';
 * const visit2Date = '2024-04-15';
 * const dob = '1985-06-20';
 *
 * // Convert for storage
 * const participant = {
 *   subject_id: 'PAIN001',
 *   enrollment_day: 0,  // Always Day 0
 *   age_at_enrollment: DateConverter.calculateAgeAtEnrollment(dob, enrollmentDate),  // 38
 *   baseline_visit_day: 0,
 *   week1_visit_day: DateConverter.convertToRelativeDays(visit1Date, enrollmentDate),  // 7
 *   month1_visit_day: DateConverter.convertToRelativeDays(visit2Date, enrollmentDate),  // 31
 * };
 *
 * // Validate no actual dates are being stored
 * DateConverter.validateNoActualDates(participant);  // throws if dates found
 */
```

### 4.2 Example Integration in REDCap Service

**File: `backend/src/modules/integrations/redcap/redcap.service.ts`**

```typescript
import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { readFileSync } from 'fs';
import { DateConverter } from '../../../utils/date-converter.util';

@Injectable()
export class RedcapService {
  private readonly logger = new Logger(RedcapService.name);
  private readonly client: AxiosInstance;
  private readonly secrets: any;

  constructor() {
    // Load secrets
    this.secrets = JSON.parse(
      readFileSync('/etc/price-dashboard/secrets.json', 'utf8')
    );

    this.client = axios.create({
      baseURL: this.secrets.apis.redcap.url,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  /**
   * Fetch and de-identify REDCap records
   * Converts dates to relative days and removes PHI
   */
  async syncParticipantsForStudy(studyCode: string): Promise<any[]> {
    const token = this.secrets.apis.redcap.tokens[studyCode];

    if (!token) {
      throw new Error(`REDCap token not found for study: ${studyCode}`);
    }

    // 1. Fetch raw records from REDCap (contains PHI)
    const rawRecords = await this.exportRecords(token);

    // 2. Convert to Limited Data Set (de-identify)
    const deidentifiedRecords = rawRecords.map(record => {
      const enrollmentDate = record.enrollment_date;

      // Convert to Limited Data Set
      const participant = {
        subject_id: record.record_id,  // Use REDCap's coded ID
        enrollment_day: 0,  // Always Day 0
        age_at_enrollment: DateConverter.calculateAgeAtEnrollment(
          record.dob,
          enrollmentDate
        ),
        gender: record.gender,
        status: record.status,

        // Convert visit dates to relative days
        visits: [
          {
            visit_name: 'Baseline',
            scheduled_day: 0,
            completed_day: record.baseline_date
              ? DateConverter.convertToRelativeDays(record.baseline_date, enrollmentDate)
              : null,
            status: record.baseline_complete === '2' ? 'completed' : 'scheduled'
          },
          {
            visit_name: 'Week 1',
            scheduled_day: 7,
            completed_day: record.week1_date
              ? DateConverter.convertToRelativeDays(record.week1_date, enrollmentDate)
              : null,
            status: record.week1_complete === '2' ? 'completed' : 'scheduled'
          },
          {
            visit_name: 'Month 1',
            scheduled_day: 28,
            completed_day: record.month1_date
              ? DateConverter.convertToRelativeDays(record.month1_date, enrollmentDate)
              : null,
            status: record.month1_complete === '2' ? 'completed' : 'scheduled'
          }
        ],

        // Track data completeness (NOT actual values)
        data_completeness: {
          demographics: record.demographics_complete === '2',
          medical_history: record.medical_history_complete === '2',
          pain_assessment: record.pain_assessment_complete === '2'
        }
      };

      // Validate no actual dates are being stored
      DateConverter.validateNoActualDates(participant);

      return participant;
    });

    this.logger.log(
      `Synced ${deidentifiedRecords.length} participants for study ${studyCode} (de-identified)`
    );

    return deidentifiedRecords;
  }

  private async exportRecords(token: string): Promise<any[]> {
    const params = new URLSearchParams({
      token,
      content: 'record',
      format: 'json',
      type: 'flat',
      returnFormat: 'json',
    });

    const response = await this.client.post('', params);
    return response.data;
  }
}
```

---

## Phase 5: Security & Authentication

### 5.1 Install Nginx

```bash
# Install Nginx
sudo apt install nginx -y

# Enable and start
sudo systemctl enable nginx
sudo systemctl start nginx

# Verify
sudo systemctl status nginx
```

### 5.2 SSL Certificate with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain certificate
sudo certbot --nginx -d price.dental.ufl.edu

# Follow prompts:
# 1. Enter email: ebweber@ufl.edu
# 2. Agree to terms
# 3. Choose: Redirect HTTP to HTTPS (option 2)

# Verify auto-renewal
sudo certbot renew --dry-run

# Check renewal timer
sudo systemctl status certbot.timer
```

### 5.3 Nginx Configuration

```bash
# Create site configuration
sudo nano /etc/nginx/sites-available/price.dental.ufl.edu
```

**Complete Nginx configuration:**

```nginx
# Upstream Node.js backend
upstream nodejs_backend {
    least_conn;
    server 127.0.0.1:3000 max_fails=3 fail_timeout=30s;
    keepalive 64;
}

# Rate limiting zones
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=login_limit:10m rate=5r/m;

# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name price.dental.ufl.edu;

    # Let's Encrypt verification
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Redirect all other traffic to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS Server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name price.dental.ufl.edu;

    # SSL Configuration (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/price.dental.ufl.edu/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/price.dental.ufl.edu/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/price.dental.ufl.edu/chain.pem;

    # SSL Security (Mozilla Intermediate - 2025)
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers off;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;
    ssl_stapling on;
    ssl_stapling_verify on;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Content Security Policy
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://redcap.ufl.edu https://login.ufl.edu;" always;

    # Hide server version
    server_tokens off;

    # Logging
    access_log /var/log/nginx/price-access.log combined buffer=32k flush=5s;
    error_log /var/log/nginx/price-error.log warn;

    # Max upload size
    client_max_body_size 50M;

    # Compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;

    # API endpoints (rate limited)
    location /api/ {
        limit_req zone=api_limit burst=20 nodelay;

        proxy_pass http://nodejs_backend;
        proxy_http_version 1.1;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Authentication endpoints (stricter rate limiting)
    location /api/auth/ {
        limit_req zone=login_limit burst=5 nodelay;

        proxy_pass http://nodejs_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # SAML endpoints
    location /saml/ {
        proxy_pass http://nodejs_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Health check (no rate limiting)
    location /health {
        proxy_pass http://nodejs_backend/health;
        access_log off;
    }

    # Frontend routes
    location / {
        proxy_pass http://nodejs_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/price.dental.ufl.edu /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 5.4 UF Shibboleth Integration

```bash
# As price-app user
cd /home/price-app/price-dashboard/backend/config
mkdir -p saml

# Generate self-signed certificate for SAML
openssl req -x509 -newkey rsa:4096 \
  -keyout saml/key.pem \
  -out saml/cert.pem \
  -nodes \
  -days 365 \
  -subj "/C=US/ST=Florida/L=Gainesville/O=University of Florida/OU=PRICE/CN=price.dental.ufl.edu"

# Set permissions
chmod 400 saml/key.pem
chmod 444 saml/cert.pem
```

**Register with UF IT:**
- Contact: UF Identity & Access Management
- Provide metadata URL: `https://price.dental.ufl.edu/saml/metadata`
- Request attributes: uid, mail, displayName, givenName, sn, affiliation

---

**[Continue in next message due to length...]**

---

This is approximately 50% of the complete deployment guide. Would you like me to continue with the remaining sections (API integrations, monitoring, backups, deployment automation, troubleshooting, etc.) in the next part?
