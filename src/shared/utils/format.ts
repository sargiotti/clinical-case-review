import type { ConfidenceLevel, NextAction } from '../../domain/assessment';
import type { CasePriority, CaseStatus } from '../../domain/case';

// Presentation only: turns raw domain values into text for people. Domain data stays raw everywhere else.

/** "2026-10-28T09:15:00Z" → "28 Oct 2026, 09:15" in the user's time zone. */
export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
}

/** "2026-11-12" → "12 Nov 2026". A plain day with no time, so it is read as local time, not UTC. */
export function formatDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString('en-GB', { dateStyle: 'medium' });
}

// Record<Union, string> makes the compiler demand a label for every value.
export const STATUS_LABELS: Record<CaseStatus, string> = {
  open: 'Open',
  assessed: 'Assessed',
  reviewed: 'Reviewed',
};

export const PRIORITY_LABELS: Record<CasePriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

export const CONFIDENCE_LABELS: Record<ConfidenceLevel, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export const NEXT_ACTION_LABELS: Record<NextAction, string> = {
  discharge: 'Discharge',
  follow_up: 'Follow up',
  order_tests: 'Order tests',
  refer: 'Refer',
};
