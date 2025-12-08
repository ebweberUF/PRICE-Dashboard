/**
 * Date Conversion Utilities for Limited Data Set Compliance
 *
 * These utilities convert actual dates to relative "days since enrollment"
 * to comply with HIPAA Limited Data Set requirements.
 *
 * Key principles:
 * - Enrollment date is always Day 0
 * - All other dates are expressed as days relative to enrollment
 * - Date of birth is converted to age at enrollment
 * - No actual dates are stored in the database
 */

import { differenceInDays, differenceInYears, parseISO, isValid, format } from 'date-fns';
import type { RelativeDateResult } from '../types';

/**
 * Parse a date string or Date object into a valid Date.
 * Handles various input formats.
 */
function parseDate(date: string | Date): Date | null {
  if (date instanceof Date) {
    return isValid(date) ? date : null;
  }

  if (typeof date === 'string') {
    // Handle empty strings
    if (!date.trim()) {
      return null;
    }

    // Try parsing as ISO date
    const parsed = parseISO(date);
    if (isValid(parsed)) {
      return parsed;
    }
  }

  return null;
}

/**
 * Convert an absolute date to days since enrollment.
 *
 * @param absoluteDate - The actual date (e.g., "2024-03-22")
 * @param enrollmentDate - The enrollment date (e.g., "2024-03-15")
 * @returns Number of days since enrollment (e.g., 7), or null if invalid
 *
 * @example
 * convertToRelativeDays("2024-03-22", "2024-03-15") // returns 7
 * convertToRelativeDays("2024-03-15", "2024-03-15") // returns 0
 * convertToRelativeDays("2024-03-08", "2024-03-15") // returns -7 (before enrollment)
 */
export function convertToRelativeDays(
  absoluteDate: string | Date,
  enrollmentDate: string | Date
): number | null {
  const enrollment = parseDate(enrollmentDate);
  const event = parseDate(absoluteDate);

  if (!enrollment || !event) {
    return null;
  }

  return differenceInDays(event, enrollment);
}

/**
 * Convert an absolute date to days since enrollment with detailed result.
 * Use this when you need error information for logging/debugging.
 */
export function convertToRelativeDaysDetailed(
  absoluteDate: string | Date,
  enrollmentDate: string | Date
): RelativeDateResult {
  const enrollment = parseDate(enrollmentDate);
  const event = parseDate(absoluteDate);

  if (!enrollment) {
    return {
      relativeDays: 0,
      valid: false,
      error: 'Invalid enrollment date provided',
    };
  }

  if (!event) {
    return {
      relativeDays: 0,
      valid: false,
      error: 'Invalid event date provided',
    };
  }

  return {
    relativeDays: differenceInDays(event, enrollment),
    valid: true,
  };
}

/**
 * Calculate age at enrollment from date of birth.
 * Returns age in whole years - does NOT store the date of birth.
 *
 * @param dateOfBirth - Date of birth (will NOT be stored)
 * @param enrollmentDate - Enrollment date
 * @returns Age in years at enrollment, or null if invalid
 *
 * @example
 * calculateAgeAtEnrollment("1985-06-20", "2024-03-15") // returns 38
 */
export function calculateAgeAtEnrollment(
  dateOfBirth: string | Date,
  enrollmentDate: string | Date
): number | null {
  const dob = parseDate(dateOfBirth);
  const enrollment = parseDate(enrollmentDate);

  if (!dob || !enrollment) {
    return null;
  }

  return differenceInYears(enrollment, dob);
}

/**
 * Convert a REDCap date field to relative days.
 * REDCap typically uses "YYYY-MM-DD" format.
 * Returns null for empty or missing dates.
 */
export function convertREDCapDate(
  redcapDate: string | null | undefined,
  enrollmentDate: string | Date
): number | null {
  if (!redcapDate || redcapDate.trim() === '') {
    return null;
  }
  return convertToRelativeDays(redcapDate, enrollmentDate);
}

/**
 * Validate that a data object contains no actual dates.
 * Use this before storing data to ensure compliance.
 *
 * @param data - Object to validate
 * @throws Error if actual dates are found
 * @returns true if no dates found
 *
 * @example
 * validateNoActualDates({ subject_id: "PAIN001", enrollment_day: 0 }) // returns true
 * validateNoActualDates({ date: "2024-03-15" }) // throws Error
 */
export function validateNoActualDates(data: unknown): boolean {
  // Common date patterns
  const datePatterns = [
    /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
    /^\d{4}-\d{2}-\d{2}T/, // ISO datetime
    /^\d{2}\/\d{2}\/\d{4}$/, // MM/DD/YYYY
    /^\d{2}-\d{2}-\d{4}$/, // DD-MM-YYYY or MM-DD-YYYY
  ];

  const checkValue = (value: unknown, path: string): void => {
    if (typeof value === 'string') {
      for (const pattern of datePatterns) {
        if (pattern.test(value)) {
          throw new Error(
            `Attempting to store actual date at ${path}: "${value}". ` +
              'Convert to relative days before storing.'
          );
        }
      }
    } else if (value instanceof Date) {
      throw new Error(
        `Attempting to store Date object at ${path}. ` +
          'Convert to relative days before storing.'
      );
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => checkValue(item, `${path}[${index}]`));
    } else if (value !== null && typeof value === 'object') {
      Object.entries(value as Record<string, unknown>).forEach(([key, val]) =>
        checkValue(val, path ? `${path}.${key}` : key)
      );
    }
  };

  checkValue(data, '');
  return true;
}

/**
 * Format relative days for display.
 *
 * @example
 * formatRelativeDays(0) // "Day 0 (Enrollment)"
 * formatRelativeDays(7) // "Day 7"
 * formatRelativeDays(28) // "Day 28 (Week 4)"
 * formatRelativeDays(365) // "Day 365 (Year 1)"
 */
export function formatRelativeDays(days: number): string {
  if (days === 0) {
    return 'Day 0 (Enrollment)';
  }

  const absdays = Math.abs(days);
  let suffix = '';

  if (absdays >= 365 && absdays % 365 === 0) {
    const years = absdays / 365;
    suffix = ` (Year ${years})`;
  } else if (absdays >= 30 && absdays % 30 === 0) {
    const months = absdays / 30;
    suffix = ` (Month ${months})`;
  } else if (absdays >= 7 && absdays % 7 === 0) {
    const weeks = absdays / 7;
    suffix = ` (Week ${weeks})`;
  }

  const prefix = days < 0 ? 'Day ' : 'Day ';
  return `${prefix}${days}${suffix}`;
}

/**
 * Get the scheduled day for a standard visit.
 * Returns the expected day relative to enrollment.
 */
export function getScheduledVisitDay(visitName: string): number | null {
  const visitSchedule: Record<string, number> = {
    baseline: 0,
    'week 1': 7,
    'week 2': 14,
    'week 4': 28,
    'month 1': 30,
    'month 2': 60,
    'month 3': 90,
    'month 6': 180,
    'year 1': 365,
    'year 2': 730,
  };

  const normalized = visitName.toLowerCase().trim();
  return visitSchedule[normalized] ?? null;
}

/**
 * Check if a visit is on schedule (within tolerance).
 *
 * @param scheduledDay - Expected day
 * @param actualDay - Actual completion day
 * @param toleranceDays - Allowed deviation (default: 7 days)
 */
export function isVisitOnSchedule(
  scheduledDay: number,
  actualDay: number,
  toleranceDays: number = 7
): boolean {
  return Math.abs(actualDay - scheduledDay) <= toleranceDays;
}

/**
 * Calculate visit window (earliest and latest acceptable days).
 */
export function getVisitWindow(
  scheduledDay: number,
  toleranceDays: number = 7
): { earliest: number; latest: number } {
  return {
    earliest: scheduledDay - toleranceDays,
    latest: scheduledDay + toleranceDays,
  };
}
