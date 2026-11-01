import type { PatientCase } from '../../domain/case';
import { REVIEW_REASONS, type ReviewReason } from '../../domain/review';
import { getLabFlag } from './classify-result';

/**
 * The review priority rule. A case needs review, unless it is already reviewed, when it has any of:
 *   1. critical_result    a lab result is critical (strictly beyond a critical limit)
 *   2. overdue_follow_up  the assessment's follow-up date is before today
 *   3. low_confidence     the assessment's confidence is low
 * Reasons come back in that order, which is also the order of urgency (see REVIEW_REASONS).
 */

function hasCriticalResult(patientCase: PatientCase): boolean {
  return patientCase.labResults.some((lab) => {
    const flag = getLabFlag(lab);
    return flag === 'critical_low' || flag === 'critical_high';
  });
}

// ISO dates ('2026-11-05') compare correctly as text. A follow-up date of today is not overdue yet.
function isFollowUpOverdue(patientCase: PatientCase, today: string): boolean {
  const date = patientCase.assessment?.followUpDate;
  return date !== undefined && date < today;
}

function hasLowConfidence(patientCase: PatientCase): boolean {
  return patientCase.assessment?.confidence === 'low';
}

export function getReviewReasons(patientCase: PatientCase, today: string): ReviewReason[] {
  if (patientCase.status === 'reviewed') return [];

  const reasons: ReviewReason[] = [];
  if (hasCriticalResult(patientCase)) reasons.push('critical_result');
  if (isFollowUpOverdue(patientCase, today)) reasons.push('overdue_follow_up');
  if (hasLowConfidence(patientCase)) reasons.push('low_confidence');
  return reasons;
}

export interface QueueEntry {
  patientCase: PatientCase;
  reasons: ReviewReason[];
}

function oldestFirst(a: QueueEntry, b: QueueEntry): number {
  return a.patientCase.updatedAt.localeCompare(b.patientCase.updatedAt);
}

/** The cases that need review, most urgent reason first; cases with the same reason, longest waiting first. */
export function getReviewQueue(cases: PatientCase[], today: string): QueueEntry[] {
  const entries = cases
    .map((patientCase) => ({ patientCase, reasons: getReviewReasons(patientCase, today) }))
    .filter((entry) => entry.reasons.length > 0);

  // One reason at a time, in urgency order. reasons[0] is a case's most urgent reason.
  const queue: QueueEntry[] = [];
  for (const reason of REVIEW_REASONS) {
    const withThisReason = entries.filter((entry) => entry.reasons[0] === reason);
    queue.push(...withThisReason.sort(oldestFirst));
  }
  return queue;
}
