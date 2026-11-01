import type { ConfidenceLevel, NextAction } from '../../domain/assessment';
import type { CasePriority, CaseStatus } from '../../domain/case';
import type { ReviewReason } from '../../domain/review';

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
}

export function formatDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString('en-GB', { dateStyle: 'medium' });
}

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

export const REVIEW_REASON_LABELS: Record<ReviewReason, string> = {
  critical_result: 'Critical result',
  overdue_follow_up: 'Overdue follow-up',
  low_confidence: 'Low confidence',
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
