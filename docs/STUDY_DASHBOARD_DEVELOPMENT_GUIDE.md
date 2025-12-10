# Study Dashboard Development Guide

**Version:** 1.0
**Last Updated:** December 2025
**Purpose:** Guide for creating modular, study-specific dashboards that integrate with the PRICE Dashboard platform

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Getting Started](#getting-started)
4. [Project Structure](#project-structure)
5. [Design System](#design-system)
6. [Core Components](#core-components)
7. [API Integration](#api-integration)
8. [Data Models](#data-models)
9. [HIPAA Compliance Requirements](#hipaa-compliance-requirements)
10. [REDCap Integration](#redcap-integration)
11. [UI Components](#ui-components)
12. [Testing](#testing)
13. [Deployment](#deployment)
14. [Example Implementation](#example-implementation)
15. [VM Integration & File Placement](#vm-integration--file-placement)

---

## Overview

### What is a Study Dashboard?

A Study Dashboard is a set of routes within the PRICE Dashboard designed for a specific clinical research study. Each study dashboard:

- Displays study-specific participant data and metrics
- Integrates with REDCap (and optionally eLab, SharePoint, XNAT)
- Follows HIPAA Limited Data Set requirements
- Uses shared authentication and navigation from the main dashboard
- Deploys as part of the main PRICE Dashboard codebase

### Key Principles

1. **Modularity**: Each study dashboard is a self-contained route within the main dashboard
2. **HIPAA Compliance**: Only coded IDs and relative dates - never PHI
3. **Consistency**: Use shared types and components from the PRICE platform
4. **Simplicity**: All study dashboards share the same codebase and deployment

---

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        UF Network                                │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │      Nginx        │  SSL + Shibboleth
                    │  (Reverse Proxy)  │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │  PRICE Dashboard  │  Next.js Frontend
                    │      :3000        │
                    │  ┌─────────────┐  │
                    │  │ /           │  │  Main Dashboard
                    │  │ /studies    │  │  Studies List
                    │  │ /studies/   │  │  Study Dashboards
                    │  │   cpain     │  │  (embedded routes)
                    │  │   opioid    │  │
                    │  │   neuro     │  │
                    │  └─────────────┘  │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │   PRICE Backend   │  NestJS API
                    │      :3001        │  + PostgreSQL
                    └─────────┬─────────┘
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
    ┌─────▼─────┐       ┌─────▼─────┐       ┌─────▼─────┐
    │  REDCap   │       │   eLab    │       │   XNAT    │
    │   API     │       │   API     │       │   API     │
    └───────────┘       └───────────┘       └───────────┘
```

### Data Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   REDCap     │     │    PRICE     │     │    Study     │
│  (Contains   │────▶│   Backend    │────▶│  Dashboard   │
│    PHI)      │     │ (De-identify)│     │ (Limited DS) │
└──────────────┘     └──────────────┘     └──────────────┘
                            │
                     De-identification:
                     • Dates → Relative Days
                     • DOB → Age at Enrollment
                     • Keep Coded ID Only
                     • Strip all PHI fields
```

---

## Getting Started

### Prerequisites

- Node.js v24.11.1 (via NVM)
- Access to PRICE Dashboard codebase
- REDCap API token for your study
- Study registered in PRICE Dashboard (get your `studyId`)

### Create New Study Dashboard

Study dashboards are created as routes within the main PRICE Dashboard. No separate project setup is needed.

```bash
# 1. Navigate to the studies folder in the frontend
cd frontend/src/app/\(DashboardLayout\)/studies

# 2. Create the study folder structure (example for CPAIN study)
mkdir -p cpain/{participants,visits,data-quality}

# 3. Create the study pages
touch cpain/page.tsx
touch cpain/participants/page.tsx
touch cpain/visits/page.tsx
touch cpain/data-quality/page.tsx
```

### Environment Variables

Study-specific configuration uses the main dashboard's environment. Add study-specific REDCap tokens to the backend `.env`:

```bash
# In backend/.env
REDCAP_API_URL=https://redcap.ctsi.ufl.edu/redcap/api/
REDCAP_TOKEN_CPAIN=your_cpain_token_here
REDCAP_TOKEN_OPIOID=your_opioid_token_here
```

---

## Project Structure

### Study Dashboard Directory Structure

Study dashboards live within the main PRICE Dashboard codebase:

```
frontend/src/app/(DashboardLayout)/studies/
├── page.tsx                        # Studies list page
└── [studyCode]/                    # Dynamic route for each study
    ├── page.tsx                    # Study overview/dashboard
    ├── participants/
    │   ├── page.tsx                # Participant list
    │   └── [subjectId]/
    │       └── page.tsx            # Individual participant view
    ├── visits/
    │   └── page.tsx                # Visit tracking
    ├── data-quality/
    │   └── page.tsx                # Data completeness
    └── reports/
        └── page.tsx                # Export and reporting
```

### Shared Components

Study dashboards use shared components from the main dashboard:

```
frontend/src/app/components/
├── shared/
│   ├── CardBox.tsx                 # Card container component
│   └── ...
├── dashboard/
│   └── ...
└── studies/                        # Study-specific components (create as needed)
    ├── StudyStatsCard.tsx
    ├── ParticipantTable.tsx
    ├── EnrollmentChart.tsx
    └── ...
```

### Shared Libraries

```
frontend/src/lib/                   # Shared utilities
├── api.ts                          # API client for PRICE backend
├── date-utils.ts                   # Date conversion utilities
└── types.ts                        # Shared TypeScript types
```

---

## Design System

All study dashboards **MUST** follow the PRICE Design System to ensure visual consistency across the platform. This section defines the exact colors, typography, spacing, and component patterns to use.

### Color Palette

```typescript
// lib/design-tokens.ts
export const colors = {
  // Primary Brand Colors (UF/PRICE)
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',   // Primary blue - use for CTAs, links, active states
    600: '#2563eb',   // Darker blue - use for hover states
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },

  // Neutral Grays (UI backgrounds, text, borders)
  neutral: {
    50: '#f9fafb',    // Page background
    100: '#f3f4f6',   // Card background alt, hover states
    200: '#e5e7eb',   // Borders, dividers
    300: '#d1d5db',   // Disabled states
    400: '#9ca3af',   // Placeholder text
    500: '#6b7280',   // Secondary text
    600: '#4b5563',   // Body text
    700: '#374151',   // Headings
    800: '#1f2937',   // Primary text
    900: '#111827',   // Darkest text
  },

  // Semantic Colors (Status indicators)
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',   // Active, completed, success
    600: '#16a34a',
    700: '#15803d',
  },

  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',   // Pending, attention needed
    600: '#d97706',
    700: '#b45309',
  },

  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',   // Errors, withdrawn, critical
    600: '#dc2626',
    700: '#b91c1c',
  },

  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',   // Informational
    600: '#2563eb',
  },

  // Data Visualization Colors (Charts)
  chart: {
    blue: '#3b82f6',
    green: '#22c55e',
    amber: '#f59e0b',
    purple: '#8b5cf6',
    pink: '#ec4899',
    cyan: '#06b6d4',
    slate: '#64748b',
  },
};

// Participant Status Colors (consistent across all dashboards)
export const statusColors = {
  screened: { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-400' },
  enrolled: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  active: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
  completed: { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
  withdrawn: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
};

// Data Completeness Colors
export const completenessColors = {
  complete: { bg: 'bg-green-500', text: 'text-green-700' },      // 100%
  good: { bg: 'bg-green-400', text: 'text-green-600' },          // 80-99%
  warning: { bg: 'bg-amber-400', text: 'text-amber-700' },       // 60-79%
  critical: { bg: 'bg-red-500', text: 'text-red-700' },          // <60%
};
```

### Typography

```typescript
// lib/typography.ts
export const typography = {
  // Font Family - Use system fonts for performance
  fontFamily: {
    sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
    mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
  },

  // Font Sizes (Tailwind defaults)
  fontSize: {
    xs: '0.75rem',     // 12px - Labels, badges, meta text
    sm: '0.875rem',    // 14px - Body text, table cells
    base: '1rem',      // 16px - Primary body text
    lg: '1.125rem',    // 18px - Large body, card titles
    xl: '1.25rem',     // 20px - Section headings
    '2xl': '1.5rem',   // 24px - Page titles
    '3xl': '1.875rem', // 30px - Dashboard main stat
    '4xl': '2.25rem',  // 36px - Hero numbers
  },

  // Font Weights
  fontWeight: {
    normal: '400',     // Body text
    medium: '500',     // Emphasized text, labels
    semibold: '600',   // Headings, buttons
    bold: '700',       // Strong emphasis
  },

  // Line Heights
  lineHeight: {
    tight: '1.25',     // Headings
    normal: '1.5',     // Body text
    relaxed: '1.75',   // Long-form content
  },
};
```

### Tailwind Configuration

Every study dashboard must use this exact Tailwind configuration:

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Extend with PRICE brand colors if needed
        price: {
          blue: '#2563eb',
          navy: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      },
      borderRadius: {
        'card': '0.5rem',
      },
    },
  },
  plugins: [],
};
```

### Spacing System

Use consistent spacing throughout:

```
4px  = p-1, m-1     (Tight spacing, between icons and text)
8px  = p-2, m-2     (Default element spacing)
12px = p-3, m-3     (Card internal padding)
16px = p-4, m-4     (Section spacing)
24px = p-6, m-6     (Card padding, component gaps)
32px = p-8, m-8     (Section gaps)
48px = p-12, m-12   (Page section gaps)
```

### Layout Standards

#### Page Layout

```tsx
// Standard page layout wrapper
export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Sidebar />
      <main className="lg:pl-64">
        {children}
      </main>
    </div>
  );
}
```

#### Sidebar Navigation (Required)

All study dashboards must have a consistent left sidebar:

```tsx
// components/layout/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { STUDY_CONFIG } from '@/lib/config';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Participants', href: '/participants', icon: UsersIcon },
  { name: 'Visits', href: '/visits', icon: CalendarIcon },
  { name: 'Data Quality', href: '/data-quality', icon: ChartBarIcon },
  { name: 'Reports', href: '/reports', icon: DocumentIcon },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      {/* Sidebar container */}
      <div className="flex flex-col flex-grow bg-white border-r border-neutral-200">
        {/* Logo/Study Header */}
        <div className="flex items-center h-16 px-6 border-b border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <div>
              <p className="font-semibold text-neutral-900 text-sm">
                {STUDY_CONFIG.shortName}
              </p>
              <p className="text-xs text-neutral-500">Study Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                  ${isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                  }
                `}
              >
                <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-primary-600' : 'text-neutral-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200">
          <div className="flex items-center text-xs text-neutral-500">
            <ShieldIcon className="w-4 h-4 mr-2 text-green-500" />
            HIPAA Compliant
          </div>
        </div>
      </div>
    </div>
  );
}
```

#### Page Header (Required)

```tsx
// components/layout/PageHeader.tsx
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export function PageHeader({ title, subtitle, actions, breadcrumbs }: PageHeaderProps) {
  return (
    <header className="bg-white border-b border-neutral-200">
      {/* Breadcrumbs */}
      {breadcrumbs && (
        <div className="px-6 py-2 border-b border-neutral-100">
          <nav className="flex text-sm text-neutral-500">
            {breadcrumbs.map((item, i) => (
              <span key={item.label} className="flex items-center">
                {i > 0 && <ChevronRightIcon className="w-4 h-4 mx-2" />}
                {item.href ? (
                  <Link href={item.href} className="hover:text-neutral-700">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-neutral-900">{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        </div>
      )}

      {/* Title Section */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">{title}</h1>
            {subtitle && (
              <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center space-x-3">{actions}</div>}
        </div>
      </div>
    </header>
  );
}
```

### Standard UI Components

#### Button Component

```tsx
// components/ui/Button.tsx
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
        secondary: 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50 focus:ring-primary-500',
        ghost: 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-5 py-2.5 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export function Button({
  className,
  variant,
  size,
  isLoading,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonVariants({ variant, size, className })}
      disabled={isLoading}
      {...props}
    >
      {isLoading && <SpinnerIcon className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
}
```

#### Card Component

```tsx
// components/ui/Card.tsx
interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({ children, className = '', padding = 'md', hover = false }: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-lg border border-neutral-200 shadow-card
        ${paddingMap[padding]}
        ${hover ? 'hover:shadow-card-hover hover:border-neutral-300 transition-all cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// Card sub-components for consistent structure
Card.Header = function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`pb-4 border-b border-neutral-100 ${className}`}>
      {children}
    </div>
  );
};

Card.Title = function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-semibold text-neutral-900">{children}</h3>;
};

Card.Description = function CardDescription({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-sm text-neutral-500">{children}</p>;
};

Card.Content = function CardContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`py-4 ${className}`}>{children}</div>;
};

Card.Footer = function CardFooter({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`pt-4 border-t border-neutral-100 ${className}`}>
      {children}
    </div>
  );
};
```

#### Badge Component

```tsx
// components/ui/Badge.tsx
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center font-medium rounded-full',
  {
    variants: {
      variant: {
        default: 'bg-neutral-100 text-neutral-700',
        primary: 'bg-primary-100 text-primary-700',
        success: 'bg-green-100 text-green-700',
        warning: 'bg-amber-100 text-amber-700',
        error: 'bg-red-100 text-red-700',
        purple: 'bg-purple-100 text-purple-700',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  dot?: boolean;
}

export function Badge({ children, variant, size, dot }: BadgeProps) {
  return (
    <span className={badgeVariants({ variant, size })}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
          variant === 'success' ? 'bg-green-500' :
          variant === 'warning' ? 'bg-amber-500' :
          variant === 'error' ? 'bg-red-500' :
          variant === 'primary' ? 'bg-primary-500' :
          variant === 'purple' ? 'bg-purple-500' :
          'bg-neutral-500'
        }`} />
      )}
      {children}
    </span>
  );
}
```

#### Status Badge (Participant Status)

```tsx
// components/ui/StatusBadge.tsx
import { statusColors } from '@/lib/design-tokens';

type ParticipantStatus = 'screened' | 'enrolled' | 'active' | 'completed' | 'withdrawn';

interface StatusBadgeProps {
  status: ParticipantStatus;
  showDot?: boolean;
}

export function StatusBadge({ status, showDot = true }: StatusBadgeProps) {
  const colors = statusColors[status];
  const labels: Record<ParticipantStatus, string> = {
    screened: 'Screened',
    enrolled: 'Enrolled',
    active: 'Active',
    completed: 'Completed',
    withdrawn: 'Withdrawn',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
      {showDot && <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${colors.dot}`} />}
      {labels[status]}
    </span>
  );
}
```

#### Stat Card (Dashboard Stats)

```tsx
// components/ui/StatCard.tsx
interface StatCardProps {
  label: string;
  value: number | string;
  change?: { value: number; trend: 'up' | 'down' | 'neutral' };
  icon?: React.ComponentType<{ className?: string }>;
  target?: number;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
}

export function StatCard({ label, value, change, icon: Icon, target, variant = 'default' }: StatCardProps) {
  const iconBgColors = {
    default: 'bg-neutral-100',
    primary: 'bg-primary-100',
    success: 'bg-green-100',
    warning: 'bg-amber-100',
    error: 'bg-red-100',
  };

  const iconColors = {
    default: 'text-neutral-600',
    primary: 'text-primary-600',
    success: 'text-green-600',
    warning: 'text-amber-600',
    error: 'text-red-600',
  };

  return (
    <Card padding="md">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-neutral-900">{value}</p>

          {target && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
                <span>Progress</span>
                <span>{Math.round((Number(value) / target) * 100)}%</span>
              </div>
              <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full transition-all"
                  style={{ width: `${Math.min((Number(value) / target) * 100, 100)}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-neutral-400">Target: {target}</p>
            </div>
          )}

          {change && (
            <div className="mt-2 flex items-center text-sm">
              {change.trend === 'up' && (
                <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
              )}
              {change.trend === 'down' && (
                <ArrowDownIcon className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={
                change.trend === 'up' ? 'text-green-600' :
                change.trend === 'down' ? 'text-red-600' :
                'text-neutral-500'
              }>
                {change.value > 0 ? '+' : ''}{change.value}%
              </span>
              <span className="text-neutral-400 ml-1">vs last month</span>
            </div>
          )}
        </div>

        {Icon && (
          <div className={`p-3 rounded-lg ${iconBgColors[variant]}`}>
            <Icon className={`w-6 h-6 ${iconColors[variant]}`} />
          </div>
        )}
      </div>
    </Card>
  );
}
```

#### Data Table Component

```tsx
// components/ui/DataTable.tsx
interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  onRowClick,
  isLoading,
  emptyMessage = 'No data available',
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-neutral-200 p-8">
        <div className="flex items-center justify-center">
          <SpinnerIcon className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-neutral-200 p-8 text-center">
        <p className="text-neutral-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {data.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className={`
                  ${onRowClick ? 'cursor-pointer hover:bg-neutral-50' : ''}
                  transition-colors
                `}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-6 py-4 text-sm text-neutral-700 ${col.className || ''}`}
                  >
                    {col.render ? col.render(row) : (row as Record<string, unknown>)[col.key] as React.ReactNode}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

### Chart Styling Standards

```tsx
// lib/chart-theme.ts
export const chartTheme = {
  // Consistent colors for all charts
  colors: {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    gray: '#64748b',
  },

  // Grid styling
  grid: {
    stroke: '#e5e7eb',
    strokeDasharray: '3 3',
  },

  // Axis styling
  axis: {
    stroke: '#9ca3af',
    fontSize: 12,
    fontFamily: 'Inter, sans-serif',
  },

  // Tooltip styling
  tooltip: {
    backgroundColor: '#1f2937',
    borderRadius: 8,
    padding: 12,
    textColor: '#ffffff',
  },
};

// Recharts custom tooltip
export function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload) return null;

  return (
    <div className="bg-neutral-800 text-white px-3 py-2 rounded-lg shadow-lg text-sm">
      <p className="font-medium mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="flex items-center">
          <span
            className="w-2 h-2 rounded-full mr-2"
            style={{ backgroundColor: entry.color }}
          />
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}
```

### Icon Library

Use **Heroicons** (outline style) for consistency:

```bash
npm install @heroicons/react
```

```tsx
// Use outline icons consistently
import {
  HomeIcon,
  UsersIcon,
  CalendarIcon,
  ChartBarIcon,
  DocumentIcon,
  ShieldCheckIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

// Exception: Use solid icons for status indicators only
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
```

### Responsive Breakpoints

```
sm: 640px   - Mobile landscape
md: 768px   - Tablets
lg: 1024px  - Desktop (sidebar appears)
xl: 1280px  - Large desktop
2xl: 1536px - Extra large desktop
```

### Design Do's and Don'ts

#### DO:
- Use the exact color values from the design tokens
- Maintain consistent 8px spacing increments
- Use Inter font for all text
- Keep borders light (neutral-200)
- Use subtle shadows (shadow-card)
- Maintain generous padding in cards (p-6)
- Use status badges for participant status

#### DON'T:
- Create custom colors
- Use arbitrary spacing values
- Mix font families
- Use heavy shadows
- Add decorative elements
- Use different status indicators
- Override the sidebar design

---

## Core Components

### Study Configuration (lib/config.ts)

```typescript
/**
 * Study-specific configuration
 * Customize this for each study dashboard
 */

export const STUDY_CONFIG = {
  // Basic info (from PRICE Dashboard)
  studyId: parseInt(process.env.NEXT_PUBLIC_STUDY_ID || '0'),
  studyCode: process.env.NEXT_PUBLIC_STUDY_CODE || 'UNKNOWN',

  // Display settings
  name: 'Chronic Pain Intervention Study',
  shortName: 'CPAIN',
  description: 'A randomized controlled trial for chronic pain management',
  irbNumber: 'IRB-2024-001',

  // Enrollment
  enrollmentTarget: 150,
  startYear: 2024,
  endYear: 2026,

  // Visit schedule (days relative to enrollment)
  visitSchedule: [
    { name: 'Screening', day: -7, window: 7 },
    { name: 'Baseline', day: 0, window: 0 },
    { name: 'Week 1', day: 7, window: 3 },
    { name: 'Week 2', day: 14, window: 3 },
    { name: 'Month 1', day: 30, window: 7 },
    { name: 'Month 3', day: 90, window: 14 },
    { name: 'Month 6', day: 180, window: 14 },
    { name: 'Month 12', day: 365, window: 14 },
  ],

  // REDCap configuration
  redcap: {
    // Field mappings from REDCap to our data model
    subjectIdField: 'record_id',
    enrollmentDateField: 'enrollment_date',
    dobField: 'dob',

    // Instruments to track for completeness
    instruments: [
      { name: 'demographics', displayName: 'Demographics', required: true },
      { name: 'medical_history', displayName: 'Medical History', required: true },
      { name: 'pain_assessment', displayName: 'Pain Assessment', required: true },
      { name: 'medications', displayName: 'Current Medications', required: false },
      { name: 'quality_of_life', displayName: 'Quality of Life', required: true },
    ],

    // Visit-specific instruments
    visitInstruments: {
      'Baseline': ['demographics', 'medical_history', 'pain_assessment', 'quality_of_life'],
      'Week 1': ['pain_assessment'],
      'Month 1': ['pain_assessment', 'medications', 'quality_of_life'],
      'Month 3': ['pain_assessment', 'quality_of_life'],
      'Month 6': ['pain_assessment', 'medications', 'quality_of_life'],
      'Month 12': ['pain_assessment', 'quality_of_life'],
    },
  },

  // Data quality thresholds
  dataQuality: {
    completenessWarning: 80,  // Yellow warning below 80%
    completenessCritical: 60, // Red alert below 60%
  },

  // UI customization
  theme: {
    primaryColor: '#2563eb', // blue-600
    accentColor: '#7c3aed',  // violet-600
  },
};

export type StudyConfig = typeof STUDY_CONFIG;
```

### API Client (lib/api.ts)

```typescript
/**
 * API Client for PRICE Dashboard Backend
 * Handles authentication and data fetching
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const STUDY_ID = parseInt(process.env.NEXT_PUBLIC_STUDY_ID || '0');

// Types (import from shared package or define locally)
export interface Participant {
  id: number;
  studyId: number;
  subjectId: string;
  enrollmentDay: number;
  ageAtEnrollment?: number;
  gender?: string;
  status: 'screened' | 'enrolled' | 'active' | 'withdrawn' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface Visit {
  id: number;
  participantId: number;
  visitName: string;
  scheduledDay?: number;
  completedDay?: number;
  status: 'scheduled' | 'completed' | 'missed' | 'cancelled';
}

export interface DataStatus {
  participantId: number;
  instrumentName: string;
  fieldName: string;
  isComplete: boolean;
  lastChecked: string;
}

export interface StudyStats {
  total: number;
  screened: number;
  enrolled: number;
  active: number;
  completed: number;
  withdrawn: number;
}

// API client
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  // Study endpoints
  async getStudy() {
    return this.fetch<Study>(`/studies/${STUDY_ID}`);
  }

  async getStudyStats() {
    return this.fetch<StudyStats>(`/studies/${STUDY_ID}/stats`);
  }

  // Participant endpoints
  async getParticipants() {
    return this.fetch<Participant[]>(`/studies/${STUDY_ID}/participants`);
  }

  async getParticipant(subjectId: string) {
    return this.fetch<Participant>(`/studies/${STUDY_ID}/participants/${subjectId}`);
  }

  async getParticipantVisits(participantId: number) {
    return this.fetch<Visit[]>(`/participants/${participantId}/visits`);
  }

  async getParticipantDataStatus(participantId: number) {
    return this.fetch<DataStatus[]>(`/participants/${participantId}/data-status`);
  }

  // Sync endpoint (triggers REDCap sync)
  async syncFromRedcap() {
    return this.fetch<{ synced: number }>(`/studies/${STUDY_ID}/sync`, {
      method: 'POST',
    });
  }
}

export const api = new ApiClient(API_BASE_URL);
```

### Date Utilities (lib/date-utils.ts)

```typescript
/**
 * Date conversion utilities for HIPAA compliance
 * All dates must be converted to relative days before display/storage
 */

import { differenceInDays, differenceInYears, parseISO, isValid } from 'date-fns';

/**
 * Convert an absolute date to days since enrollment
 *
 * @example
 * toRelativeDays('2024-03-22', '2024-03-15') // returns 7
 */
export function toRelativeDays(
  eventDate: string | Date,
  enrollmentDate: string | Date
): number | null {
  const event = typeof eventDate === 'string' ? parseISO(eventDate) : eventDate;
  const enrollment = typeof enrollmentDate === 'string' ? parseISO(enrollmentDate) : enrollmentDate;

  if (!isValid(event) || !isValid(enrollment)) {
    return null;
  }

  return differenceInDays(event, enrollment);
}

/**
 * Calculate age at enrollment from DOB
 * IMPORTANT: Never store or display the DOB - only the calculated age
 */
export function toAgeAtEnrollment(
  dob: string | Date,
  enrollmentDate: string | Date
): number | null {
  const birth = typeof dob === 'string' ? parseISO(dob) : dob;
  const enrollment = typeof enrollmentDate === 'string' ? parseISO(enrollmentDate) : enrollmentDate;

  if (!isValid(birth) || !isValid(enrollment)) {
    return null;
  }

  return differenceInYears(enrollment, birth);
}

/**
 * Format relative days for display
 *
 * @example
 * formatRelativeDays(0)   // "Day 0 (Enrollment)"
 * formatRelativeDays(7)   // "Day 7 (Week 1)"
 * formatRelativeDays(30)  // "Day 30 (Month 1)"
 */
export function formatRelativeDays(days: number): string {
  if (days === 0) return 'Day 0 (Enrollment)';

  const abs = Math.abs(days);
  let label = '';

  if (abs >= 365 && abs % 365 < 30) {
    label = ` (Year ${Math.round(abs / 365)})`;
  } else if (abs >= 30 && abs % 30 < 7) {
    label = ` (Month ${Math.round(abs / 30)})`;
  } else if (abs >= 7 && abs % 7 === 0) {
    label = ` (Week ${abs / 7})`;
  }

  return `Day ${days}${label}`;
}

/**
 * Check if a visit is within the acceptable window
 */
export function isWithinWindow(
  actualDay: number,
  scheduledDay: number,
  windowDays: number
): boolean {
  return Math.abs(actualDay - scheduledDay) <= windowDays;
}

/**
 * Validate that an object contains no actual dates
 * Use before storing any data
 */
export function validateNoPhiDates(data: unknown): void {
  const datePatterns = [
    /^\d{4}-\d{2}-\d{2}$/,      // YYYY-MM-DD
    /^\d{4}-\d{2}-\d{2}T/,      // ISO datetime
    /^\d{2}\/\d{2}\/\d{4}$/,    // MM/DD/YYYY
  ];

  function check(value: unknown, path: string): void {
    if (typeof value === 'string') {
      for (const pattern of datePatterns) {
        if (pattern.test(value)) {
          throw new Error(
            `PHI VIOLATION: Actual date found at ${path}: "${value}". ` +
            `Convert to relative days before storing.`
          );
        }
      }
    } else if (value instanceof Date) {
      throw new Error(`PHI VIOLATION: Date object found at ${path}`);
    } else if (Array.isArray(value)) {
      value.forEach((item, i) => check(item, `${path}[${i}]`));
    } else if (value !== null && typeof value === 'object') {
      Object.entries(value as Record<string, unknown>).forEach(([k, v]) =>
        check(v, path ? `${path}.${k}` : k)
      );
    }
  }

  check(data, '');
}
```

---

## API Integration

### Server-Side REDCap Integration (lib/redcap.ts)

```typescript
/**
 * REDCap API Client - SERVER SIDE ONLY
 *
 * IMPORTANT: This file should only be used in:
 * - app/api/ routes
 * - Server components
 * - getServerSideProps
 *
 * NEVER import this in client components!
 */

import { toRelativeDays, toAgeAtEnrollment, validateNoPhiDates } from './date-utils';
import { STUDY_CONFIG } from './config';

const REDCAP_URL = process.env.REDCAP_API_URL;
const REDCAP_TOKEN = process.env.REDCAP_API_TOKEN;

if (!REDCAP_URL || !REDCAP_TOKEN) {
  console.warn('REDCap credentials not configured');
}

interface RedcapRecord {
  [key: string]: string;
}

/**
 * Export records from REDCap
 */
async function exportRecords(): Promise<RedcapRecord[]> {
  const params = new URLSearchParams({
    token: REDCAP_TOKEN!,
    content: 'record',
    format: 'json',
    type: 'flat',
    returnFormat: 'json',
  });

  const response = await fetch(REDCAP_URL!, {
    method: 'POST',
    body: params,
  });

  if (!response.ok) {
    throw new Error(`REDCap API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Transform REDCap records to Limited Data Set
 * This is where PHI is stripped and dates are converted
 */
export async function getDeidentifiedParticipants() {
  const records = await exportRecords();
  const { subjectIdField, enrollmentDateField, dobField } = STUDY_CONFIG.redcap;

  const participants = records.map((record) => {
    const enrollmentDate = record[enrollmentDateField];

    // Create de-identified participant record
    const participant = {
      subjectId: record[subjectIdField],
      enrollmentDay: 0, // Always Day 0
      ageAtEnrollment: dobField && record[dobField]
        ? toAgeAtEnrollment(record[dobField], enrollmentDate)
        : null,
      gender: record.gender || null,
      status: determineStatus(record),

      // Data completeness (TRUE/FALSE only, not actual values)
      completeness: STUDY_CONFIG.redcap.instruments.map((inst) => ({
        instrumentName: inst.name,
        isComplete: record[`${inst.name}_complete`] === '2',
      })),
    };

    // CRITICAL: Validate no PHI before returning
    validateNoPhiDates(participant);

    return participant;
  });

  return participants;
}

function determineStatus(record: RedcapRecord): string {
  if (record.withdrawn === '1') return 'withdrawn';
  if (record.completed === '1') return 'completed';
  if (record.enrolled === '1') return 'active';
  if (record.consented === '1') return 'enrolled';
  return 'screened';
}

/**
 * Get visit data for a participant (de-identified)
 */
export async function getParticipantVisits(subjectId: string) {
  const records = await exportRecords();
  const record = records.find(
    (r) => r[STUDY_CONFIG.redcap.subjectIdField] === subjectId
  );

  if (!record) return [];

  const enrollmentDate = record[STUDY_CONFIG.redcap.enrollmentDateField];

  // Map visit schedule to actual visit data
  const visits = STUDY_CONFIG.visitSchedule.map((visit) => {
    const visitDateField = `${visit.name.toLowerCase().replace(' ', '_')}_date`;
    const visitDate = record[visitDateField];

    return {
      visitName: visit.name,
      scheduledDay: visit.day,
      completedDay: visitDate ? toRelativeDays(visitDate, enrollmentDate) : null,
      status: visitDate ? 'completed' : 'scheduled',
    };
  });

  // Validate no PHI
  validateNoPhiDates(visits);

  return visits;
}
```

### API Route Example (app/api/participants/route.ts)

```typescript
import { NextResponse } from 'next/server';
import { getDeidentifiedParticipants } from '@/lib/redcap';

export async function GET() {
  try {
    const participants = await getDeidentifiedParticipants();
    return NextResponse.json(participants);
  } catch (error) {
    console.error('Failed to fetch participants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch participants' },
      { status: 500 }
    );
  }
}
```

---

## Data Models

### Study-Specific Types (lib/types.ts)

```typescript
/**
 * Study-specific type definitions
 * Extend or modify based on your study's requirements
 */

// Participant with study-specific fields
export interface StudyParticipant {
  id: number;
  subjectId: string;         // Coded ID (e.g., "CPAIN-001")
  enrollmentDay: number;     // Always 0
  ageAtEnrollment?: number;  // Age, not DOB
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  status: ParticipantStatus;

  // Study-specific fields
  randomizationArm?: 'treatment' | 'control';
  siteCode?: string;

  // Relationships
  visits?: Visit[];
  completeness?: InstrumentCompleteness[];
}

export type ParticipantStatus =
  | 'screened'
  | 'enrolled'
  | 'active'
  | 'withdrawn'
  | 'completed';

// Visit tracking
export interface Visit {
  id?: number;
  visitName: string;
  scheduledDay: number;      // Expected day relative to enrollment
  completedDay?: number;     // Actual day (null if not completed)
  status: VisitStatus;
  windowStart: number;       // Earliest acceptable day
  windowEnd: number;         // Latest acceptable day
}

export type VisitStatus =
  | 'scheduled'
  | 'completed'
  | 'missed'
  | 'cancelled'
  | 'pending';  // Within window but not yet completed

// Data completeness
export interface InstrumentCompleteness {
  instrumentName: string;
  displayName: string;
  isComplete: boolean;
  isRequired: boolean;
  visitName?: string;
}

// Dashboard summary stats
export interface DashboardStats {
  enrollment: {
    total: number;
    target: number;
    percentComplete: number;
    byStatus: Record<ParticipantStatus, number>;
  };
  visits: {
    completedOnTime: number;
    completedLate: number;
    missed: number;
    upcoming: number;
  };
  dataQuality: {
    overallCompleteness: number;
    byInstrument: Array<{
      name: string;
      completeness: number;
    }>;
  };
}

// Chart data types
export interface EnrollmentTrendData {
  day: number;      // Relative to study start
  cumulative: number;
  target: number;
}

export interface CompletenessData {
  instrument: string;
  complete: number;
  incomplete: number;
  percentage: number;
}
```

---

## HIPAA Compliance Requirements

### Critical Rules

1. **NEVER store actual dates**
   - Convert all dates to "days since enrollment"
   - Enrollment date = Day 0
   - All other dates = difference from enrollment

2. **NEVER store date of birth**
   - Convert to "age at enrollment"
   - Store only the integer age

3. **NEVER store direct identifiers**
   - Use coded subject IDs only
   - No names, MRNs, SSNs, etc.

4. **Validate before storage**
   - Run `validateNoPhiDates()` on all data before storing
   - Log any violations

### Compliance Checklist

```typescript
/**
 * Pre-deployment compliance checklist
 * Run this before every deployment
 */

const COMPLIANCE_CHECKLIST = [
  {
    item: 'No actual dates in database',
    check: 'All date columns use INTEGER for relative days',
    status: 'pending',
  },
  {
    item: 'No DOB storage',
    check: 'Only age_at_enrollment column exists',
    status: 'pending',
  },
  {
    item: 'Coded IDs only',
    check: 'subject_id uses study-specific codes',
    status: 'pending',
  },
  {
    item: 'Date validation',
    check: 'validateNoPhiDates() called before all storage',
    status: 'pending',
  },
  {
    item: 'Server-side REDCap',
    check: 'REDCap API calls only in /api routes',
    status: 'pending',
  },
  {
    item: 'No PHI in logs',
    check: 'console.log statements reviewed',
    status: 'pending',
  },
  {
    item: 'Audit logging',
    check: 'All data access is logged',
    status: 'pending',
  },
];
```

---

## REDCap Integration

### Configuration Mapping

For each study, you need to map REDCap fields to the dashboard data model:

```typescript
// Example REDCap field mapping
const REDCAP_MAPPING = {
  // Core fields
  subjectId: 'record_id',
  enrollmentDate: 'consent_date',
  dob: 'demographics_dob',
  gender: 'demographics_gender',

  // Status fields
  consented: 'consent_complete',
  enrolled: 'enrollment_complete',
  withdrawn: 'withdrawn_yn',
  withdrawnDate: 'withdrawn_date',
  completed: 'study_complete',
  completedDate: 'completion_date',

  // Visit date fields
  visits: {
    'Screening': 'screening_date',
    'Baseline': 'baseline_date',
    'Week 1': 'week1_date',
    'Week 2': 'week2_date',
    'Month 1': 'month1_date',
    'Month 3': 'month3_date',
    'Month 6': 'month6_date',
    'Month 12': 'month12_date',
  },

  // Instrument completion
  instruments: {
    'demographics': 'demographics_complete',
    'medical_history': 'med_history_complete',
    'pain_assessment': 'pain_vas_complete',
    'medications': 'medications_complete',
    'quality_of_life': 'sf36_complete',
  },
};
```

### Best Practices

1. **Use REDCap Data Dictionary**
   - Export and document all field names
   - Track changes to the data dictionary

2. **Handle Missing Data**
   - REDCap uses empty strings for missing data
   - Convert to null in your data model

3. **Instrument Completion**
   - REDCap uses: 0=Incomplete, 1=Unverified, 2=Complete
   - Map to boolean: `status === '2'`

4. **Branching Logic**
   - Some fields may be conditionally shown
   - Account for this in completeness calculations

---

## UI Components

### Study Header Component

```tsx
// components/layout/StudyHeader.tsx
'use client';

import { STUDY_CONFIG } from '@/lib/config';

interface StudyHeaderProps {
  title: string;
  subtitle?: string;
}

export function StudyHeader({ title, subtitle }: StudyHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
              {STUDY_CONFIG.studyCode}
            </span>
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          </div>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
        <div className="text-sm text-gray-500">
          IRB: {STUDY_CONFIG.irbNumber}
        </div>
      </div>
    </header>
  );
}
```

### Participant Table Component

```tsx
// components/participants/ParticipantTable.tsx
'use client';

import { StudyParticipant } from '@/lib/types';
import { formatRelativeDays } from '@/lib/date-utils';

interface Props {
  participants: StudyParticipant[];
  onSelect?: (participant: StudyParticipant) => void;
}

export function ParticipantTable({ participants, onSelect }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Subject ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Age
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Days Enrolled
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Completeness
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {participants.map((p) => (
            <tr
              key={p.subjectId}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => onSelect?.(p)}
            >
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                {p.subjectId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                {p.ageAtEnrollment ?? 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={p.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                {formatRelativeDays(calculateDaysEnrolled(p))}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <CompletenessBar completeness={p.completeness} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    screened: 'bg-gray-100 text-gray-800',
    enrolled: 'bg-blue-100 text-blue-800',
    active: 'bg-green-100 text-green-800',
    withdrawn: 'bg-red-100 text-red-800',
    completed: 'bg-purple-100 text-purple-800',
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded ${colors[status] || colors.screened}`}>
      {status}
    </span>
  );
}
```

### Enrollment Chart Component

```tsx
// components/charts/EnrollmentChart.tsx
'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { EnrollmentTrendData } from '@/lib/types';

interface Props {
  data: EnrollmentTrendData[];
}

export function EnrollmentChart({ data }: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Enrollment Progress
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              label={{ value: 'Study Day', position: 'bottom' }}
            />
            <YAxis
              label={{ value: 'Participants', angle: -90, position: 'left' }}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="cumulative"
              stroke="#2563eb"
              strokeWidth={2}
              name="Enrolled"
            />
            <Line
              type="monotone"
              dataKey="target"
              stroke="#9ca3af"
              strokeDasharray="5 5"
              name="Target"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
```

---

## Testing

### Test File Structure

```
__tests__/
├── lib/
│   ├── date-utils.test.ts
│   ├── api.test.ts
│   └── config.test.ts
├── components/
│   ├── ParticipantTable.test.tsx
│   └── EnrollmentChart.test.tsx
└── compliance/
    └── phi-detection.test.ts
```

### PHI Detection Tests

```typescript
// __tests__/compliance/phi-detection.test.ts
import { validateNoPhiDates } from '@/lib/date-utils';

describe('PHI Detection', () => {
  it('should reject actual dates in YYYY-MM-DD format', () => {
    const data = { visitDate: '2024-03-15' };
    expect(() => validateNoPhiDates(data)).toThrow('PHI VIOLATION');
  });

  it('should reject ISO datetime format', () => {
    const data = { timestamp: '2024-03-15T10:30:00Z' };
    expect(() => validateNoPhiDates(data)).toThrow('PHI VIOLATION');
  });

  it('should reject Date objects', () => {
    const data = { date: new Date() };
    expect(() => validateNoPhiDates(data)).toThrow('PHI VIOLATION');
  });

  it('should accept relative days', () => {
    const data = { enrollmentDay: 0, visitDay: 7 };
    expect(() => validateNoPhiDates(data)).not.toThrow();
  });

  it('should accept age at enrollment', () => {
    const data = { ageAtEnrollment: 45 };
    expect(() => validateNoPhiDates(data)).not.toThrow();
  });

  it('should check nested objects', () => {
    const data = {
      participant: {
        visits: [{ date: '2024-03-15' }],
      },
    };
    expect(() => validateNoPhiDates(data)).toThrow('PHI VIOLATION');
  });
});
```

---

## Deployment

### Environment Variables

Study dashboards use the main dashboard's environment configuration. REDCap tokens are stored in the backend:

```bash
# backend/.env.production
REDCAP_API_URL=https://redcap.ctsi.ufl.edu/redcap/api/
REDCAP_TOKEN_CPAIN=your_cpain_token
REDCAP_TOKEN_OPIOID=your_opioid_token
```

### Nginx Configuration

No separate Nginx configuration is needed for study dashboards. They are served as routes within the main PRICE Dashboard on port 3000:

```nginx
# All traffic goes to the main dashboard
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### Deployment

Study dashboards deploy with the main dashboard. No separate deployment needed:

```bash
# On the VM as price-app user
cd /home/price-app/price-dashboard
git pull origin main
rm -rf frontend/.next
cd frontend && npm install && npm run build
pm2 restart price-frontend
```

---

## Example Implementation

### Complete Dashboard Page Example

```tsx
// app/page.tsx
import { Suspense } from 'react';
import { StudyHeader } from '@/components/layout/StudyHeader';
import { EnrollmentChart } from '@/components/charts/EnrollmentChart';
import { STUDY_CONFIG } from '@/lib/config';

async function getStats() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/studies/${STUDY_CONFIG.studyId}/stats`, {
    next: { revalidate: 60 }, // Cache for 60 seconds
  });
  return res.json();
}

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div className="min-h-screen bg-gray-100">
      <StudyHeader
        title={STUDY_CONFIG.name}
        subtitle={STUDY_CONFIG.description}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="Enrolled"
            value={stats.enrolled}
            target={STUDY_CONFIG.enrollmentTarget}
          />
          <StatCard label="Active" value={stats.active} />
          <StatCard label="Completed" value={stats.completed} />
          <StatCard label="Withdrawn" value={stats.withdrawn} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Suspense fallback={<ChartSkeleton />}>
            <EnrollmentChart data={[]} />
          </Suspense>
          <Suspense fallback={<ChartSkeleton />}>
            <CompletenessChart data={[]} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, target }: { label: string; value: number; target?: number }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      {target && (
        <p className="text-sm text-gray-500">
          of {target} ({Math.round((value / target) * 100)}%)
        </p>
      )}
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-6 animate-pulse">
      <div className="h-64 bg-gray-200 rounded" />
    </div>
  );
}
```

---

## VM Integration & File Placement

This section covers exactly how to integrate study dashboards with the main PRICE Dashboard and where to place files on the production VM.

### VM Server Details

| Property | Value |
|----------|-------|
| Server Hostname | dn-pain-pw01.ahc.ufl.edu |
| Internal IP | 10.4.116.117 |
| Public URL | price.dental.ufl.edu |
| Application User | `price-app` |
| Project Root | `/home/price-app/price-dashboard` |
| Node.js Version | v24.11.1 (via NVM) |
| PostgreSQL Version | v17.7 |

### Integration Approach: Embedded Routes

Study dashboards are integrated directly into the main PRICE Dashboard as routes. This approach:
- Shares authentication and navigation with the main dashboard
- Uses the existing Tailwind Admin template design system
- Simplifies deployment (one codebase to deploy)
- Provides consistent user experience
- Runs on a single port (3000) - no multi-port configuration needed

**File placement on VM:**
```
/home/price-app/price-dashboard/
├── frontend/
│   └── src/
│       └── app/
│           └── (DashboardLayout)/
│               └── studies/
│                   ├── page.tsx                    # Studies list page
│                   └── [studyCode]/                # Dynamic route per study
│                       ├── page.tsx                # Study overview
│                       ├── participants/
│                       │   └── page.tsx            # Participant list
│                       ├── visits/
│                       │   └── page.tsx            # Visit tracking
│                       └── data-quality/
│                           └── page.tsx            # Data completeness
```

**Creating a new embedded study dashboard:**

```bash
# 1. SSH into the VM
ssh price-app@dn-pain-pw01.ahc.ufl.edu

# 2. Navigate to the studies folder
cd /home/price-app/price-dashboard/frontend/src/app/\(DashboardLayout\)/studies

# 3. Create the study folder structure (example for CPAIN study)
mkdir -p cpain/{participants,visits,data-quality}

# 4. Create the study pages
touch cpain/page.tsx
touch cpain/participants/page.tsx
touch cpain/visits/page.tsx
touch cpain/data-quality/page.tsx
```

**Required "use client" directive:**

All components using React hooks, @iconify/react icons, or other client-side features MUST include the `"use client"` directive at the top of the file:

```tsx
"use client"

import { Icon } from "@iconify/react"
// ... rest of component
```

**Example embedded study page:**

```tsx
// frontend/src/app/(DashboardLayout)/studies/[studyCode]/page.tsx
"use client"

import { useParams } from "next/navigation"
import CardBox from "@/app/components/shared/CardBox"
import { Icon } from "@iconify/react"

export default function StudyDashboard() {
  const params = useParams()
  const studyCode = params.studyCode as string

  return (
    <div className="space-y-6">
      {/* Study Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal dark:text-white">
            Study: {studyCode.toUpperCase()}
          </h1>
          <p className="text-bodytext dark:text-darklink">
            Study-specific dashboard and metrics
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <CardBox className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon icon="solar:users-group-rounded-bold" height={24} className="text-primary" />
            </div>
            <div>
              <p className="text-sm text-bodytext dark:text-darklink">Enrolled</p>
              <p className="text-2xl font-bold text-charcoal dark:text-white">45</p>
            </div>
          </div>
        </CardBox>
        {/* ... more stat cards */}
      </div>
    </div>
  )
}
```

**Adding study to sidebar navigation:**

Edit `/home/price-app/price-dashboard/frontend/src/app/(DashboardLayout)/layout/sidebar/Sidebaritems.ts`:

```typescript
{
  heading: 'Research',
  children: [
    // ... existing items
    {
      name: 'Studies',
      icon: 'solar:clipboard-list-linear',
      id: uniqueId(),
      url: '/studies',
      children: [
        {
          name: 'CPAIN',
          id: uniqueId(),
          url: '/studies/cpain',
        },
        {
          name: 'OPIOID',
          id: uniqueId(),
          url: '/studies/opioid',
        },
      ],
    },
  ],
},
```

### VM Deployment Commands

```bash
# SSH into VM
ssh price-app@dn-pain-pw01.ahc.ufl.edu

# Pull latest changes
cd /home/price-app/price-dashboard
git pull origin main

# Clear Next.js cache (important after changes)
rm -rf frontend/.next

# Install any new dependencies
cd frontend && npm install

# Restart the frontend
pm2 restart price-frontend
# OR if running manually:
npm run dev
```

### Theme Configuration

The dashboard uses next-themes for theme management. The theme is configured in `frontend/src/app/layout.tsx`:

```tsx
<ThemeProvider
  attribute='class'
  defaultTheme='light'
  enableSystem={false}
  disableTransitionOnChange>
  {children}
</ThemeProvider>
```

### Common Integration Issues

#### Issue: "Class extends value undefined" Error

**Cause**: Missing `"use client"` directive in components using @iconify/react or React hooks.

**Solution**: Add `"use client"` at the top of the file:
```tsx
"use client"

import { Icon } from "@iconify/react"
```

#### Issue: Dark/Black UI on First Load

**Cause**: Theme provider using `enableSystem={true}` which detects dark mode preference.

**Solution**: Set `defaultTheme='light'` and `enableSystem={false}` in ThemeProvider.

#### Issue: Git Changes Not Reflected

**Cause**: Next.js caching old build artifacts.

**Solution**: Clear the cache before restarting:
```bash
rm -rf .next
npm run dev  # or npm run build && npm run start
```

---

## Quick Reference

### File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `ParticipantCard.tsx` |
| Utilities | camelCase | `date-utils.ts` |
| Types | PascalCase | `StudyParticipant` |
| API routes | route.ts | `app/api/participants/route.ts` |
| Pages | page.tsx | `app/participants/page.tsx` |

### Port Assignments

| Service | Port |
|---------|------|
| Main PRICE Dashboard (Frontend) | 3000 |
| PRICE API (Backend) | 3001 |

All study dashboards run as routes within the main dashboard on port 3000.

### Key Commands

```bash
# Development
npm run dev                    # Start dev server
npm run type-check             # Check TypeScript
npm run lint                   # Run ESLint

# Production
npm run build                  # Build for production
npm run start                  # Start production server

# Deployment (on VM)
pm2 restart price-frontend     # Restart frontend
pm2 logs price-frontend        # View logs
```

---

## Troubleshooting

### Common Issues

1. **CORS errors when calling PRICE API**
   - Ensure the study domain is added to CORS whitelist in backend

2. **REDCap sync failing**
   - Check API token is valid and has export permissions
   - Verify field names match REDCap data dictionary

3. **Date validation errors**
   - Ensure all dates are converted before storage
   - Check for Date objects in serialized JSON

4. **Changes not appearing after git pull**
   - Clear Next.js cache: `rm -rf frontend/.next`
   - Restart the dev server or rebuild

---

## Support

- **PRICE Dashboard Issues**: GitHub Issues
- **REDCap Questions**: UF CTSI REDCap Team
- **Infrastructure**: UF Health IT
- **HIPAA Concerns**: HIPAA Security Officer

---

## Study Implementations

### GALLOP Study (Equine)

**Created:** December 2024

**Study Details:**
- **Study Code:** GALLOP
- **Type:** Equine pain research study (horse study)
- **IACUC #:** IACUC202400000711
- **Enrollment Target:** 40

**Files Created:**
```
frontend/src/app/(DashboardLayout)/studies/gallop/
├── page.tsx                 # Main dashboard with stats, quick links
├── participants/
│   └── page.tsx             # Participant list with search/filter
├── visits/
│   └── page.tsx             # Visit tracking with schedule reference
└── data-quality/
    └── page.tsx             # Data completeness monitoring
```

**Sidebar Navigation:** Added under Studies → GALLOP in `Sidebaritems.ts`

**Environment Variables (backend/.env):**
```bash
# GALLOP Study Integration
REDCAP_API_URL=https://redcap.ctsi.ufl.edu/redcap/api/
REDCAP_TOKEN_GALLOP=<token>

# SharePoint (Dental GALLOP Central Monitoring App)
SHAREPOINT_TENANT_ID=0d4da0f8-4a31-4d76-ace6-0a62331e1b84
SHAREPOINT_CLIENT_ID=e3303496-a25d-490d-9661-8cd5cc46c15b
SHAREPOINT_CLIENT_SECRET=<secret>
```

**Azure App Registration:**
- **App Name:** Dental GALLOP Central Monitoring
- **App ID:** e3303496-a25d-490d-9661-8cd5cc46c15b
- **Tenant ID:** 0d4da0f8-4a31-4d76-ace6-0a62331e1b84

**Next Steps:**
- [ ] Add REDCap API token
- [ ] Configure SharePoint client secret
- [ ] Customize visit schedule for GALLOP protocol
- [ ] Customize instruments in data-quality page for GALLOP REDCap forms
- [ ] Set up eLab integration (if applicable)

---

**Document Version:** 1.1
**Created:** December 2025
**Last Updated:** December 2024
**Author:** PRICE Development Team
