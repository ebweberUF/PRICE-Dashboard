/**
 * PRICE Dashboard - Shared Types
 *
 * These types are used across backend and frontend to ensure consistency.
 * All types follow the Limited Data Set approach - no PHI, only coded IDs and relative dates.
 */

// ============================================
// User & Authentication Types
// ============================================

export interface User {
  id: number;
  ufid: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  affiliation?: string;
  createdAt: Date;
  lastLogin?: Date;
  active: boolean;
}

export type LabRole = 'admin' | 'member' | 'viewer';
export type StudyRole = 'pi' | 'coordinator' | 'researcher' | 'viewer';

export interface LabUserAccess {
  userId: number;
  labId: number;
  role: LabRole;
  grantedAt: Date;
  grantedBy?: number;
}

export interface StudyUserAccess {
  userId: number;
  studyId: number;
  role: StudyRole;
  grantedAt: Date;
  grantedBy?: number;
}

// ============================================
// Organization Types (Labs & Studies)
// ============================================

export interface Lab {
  id: number;
  labCode: string;
  name: string;
  description?: string;
  labAdminUserId?: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  settings?: Record<string, unknown>;
}

export interface Study {
  id: number;
  labId: number;
  studyCode: string;
  name: string;
  description?: string;
  irbNumber?: string;
  piUserId?: number;
  enrollmentTarget?: number;
  startYear?: number;
  endYear?: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  settings?: Record<string, unknown>;
}

// ============================================
// Participant Types (Limited Data Set)
// ============================================

export type ParticipantStatus = 'screened' | 'enrolled' | 'active' | 'withdrawn' | 'completed';

/**
 * Study participant - uses CODED IDs and RELATIVE DATES only.
 * No PHI is stored in this structure.
 */
export interface StudyParticipant {
  id: number;
  studyId: number;
  /** Coded subject ID (e.g., "PAIN001", "CP-042") - NOT a real identifier */
  subjectId: string;
  /** Always 0 - enrollment is Day 0 */
  enrollmentDay: number;
  /** Age in years at enrollment (NOT date of birth) */
  ageAtEnrollment?: number;
  gender?: string;
  raceEthnicity?: string;
  status: ParticipantStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type VisitStatus = 'scheduled' | 'completed' | 'missed' | 'cancelled';

/**
 * Participant visit - uses RELATIVE DATES (days since enrollment).
 */
export interface ParticipantVisit {
  id: number;
  participantId: number;
  visitName: string;
  /** Days since enrollment when visit was scheduled */
  scheduledDay?: number;
  /** Days since enrollment when visit was actually completed */
  completedDay?: number;
  status: VisitStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Data Source & Completeness Types
// ============================================

export type DataSourceType = 'redcap' | 'elab' | 'sharepoint' | 'xnat';

export interface StudyDataSource {
  id: number;
  studyId: number;
  sourceType: DataSourceType;
  sourceName?: string;
  sourceConfig: Record<string, unknown>;
  credentialsRef?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Tracks whether data fields are complete - stores TRUE/FALSE only,
 * NOT the actual data values (which may contain PHI).
 */
export interface ParticipantDataStatus {
  id: number;
  participantId: number;
  visitId?: number;
  dataSource: string;
  instrumentName: string;
  fieldName: string;
  /** TRUE if field is complete, FALSE otherwise - NOT the actual value */
  isComplete: boolean;
  lastChecked: Date;
}

// ============================================
// Metrics & Aggregates
// ============================================

export interface StudyRecruitmentMetrics {
  id: number;
  studyId: number;
  metricDate: Date;
  screenedCount: number;
  enrolledCount: number;
  activeCount: number;
  completedCount: number;
  withdrawnCount: number;
  createdAt: Date;
}

export interface StudyDataCompleteness {
  id: number;
  studyId: number;
  dataSource: string;
  instrumentName: string;
  fieldName: string;
  totalExpected: number;
  totalComplete: number;
  completenessPercentage: number;
  lastUpdated: Date;
}

// ============================================
// Audit Types
// ============================================

export interface AuditLogEntry {
  id: number;
  userId?: number;
  action: string;
  resourceType?: string;
  resourceId?: number;
  labId?: number;
  studyId?: number;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, unknown>;
  timestamp: Date;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================
// Date Conversion Types
// ============================================

/**
 * Result of converting a date to relative days.
 * Used for audit trail and debugging.
 */
export interface RelativeDateResult {
  /** Number of days since enrollment */
  relativeDays: number;
  /** Whether the original date was valid */
  valid: boolean;
  /** Error message if conversion failed */
  error?: string;
}

/**
 * Configuration for participant data sync.
 * Defines how to map source fields to our Limited Data Set.
 */
export interface DataSyncConfig {
  /** Field containing the coded subject ID */
  subjectIdField: string;
  /** Field containing the enrollment date (will be converted to Day 0) */
  enrollmentDateField: string;
  /** Field containing date of birth (will be converted to age) */
  dobField?: string;
  /** Mapping of visit names to their date fields */
  visitDateFields?: Record<string, string>;
  /** Fields to check for completeness (TRUE/FALSE) */
  completenessFields?: string[];
}
