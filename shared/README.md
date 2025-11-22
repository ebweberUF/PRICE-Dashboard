# PRICE Dashboard - Shared Code

Shared TypeScript types, interfaces, and utilities used by both backend and frontend.

## Structure

```
src/
├── types/                  # TypeScript interfaces
│   ├── user.types.ts      # User-related types
│   ├── study.types.ts     # Study-related types
│   ├── participant.types.ts
│   ├── api.types.ts       # API request/response types
│   └── index.ts           # Barrel export
│
└── utils/                  # Shared utilities
    ├── date-conversion.ts  # HIPAA-compliant date utilities
    ├── validators.ts       # Common validators
    ├── constants.ts        # Shared constants
    └── index.ts            # Barrel export
```

## Date Conversion Utilities

The most critical shared code is the **date conversion utilities** for HIPAA compliance:

### Absolute → Relative Dates

```typescript
import { dateToRelative, relativeDaysFromEnrollment } from '@price-dashboard/shared';

// Convert absolute date to days from enrollment
const enrollmentDate = new Date('2024-01-15');
const eventDate = new Date('2024-03-20');
const daysFromEnrollment = relativeDaysFromEnrollment(enrollmentDate, eventDate);
// Returns: 65
```

### Relative → Approximate Dates

```typescript
import { relativeToApproximate } from '@price-dashboard/shared';

// Display approximate date for UI (never store absolute dates!)
const enrollmentDate = new Date('2024-01-15');
const daysFromEnrollment = 65;
const displayDate = relativeToApproximate(enrollmentDate, daysFromEnrollment);
// Returns: "March 2024" (approximate month/year only)
```

## Types

Shared TypeScript interfaces ensure type safety across frontend and backend:

```typescript
import type { User, Study, Participant } from '@price-dashboard/shared';
```

## Installation

This package is part of the monorepo workspace and is automatically linked.

```bash
# In backend or frontend
import { User, dateToRelative } from '@price-dashboard/shared';
```

## Building

```bash
npm run build
```

## Testing

```bash
npm run test
```
