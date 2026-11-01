export const REVIEW_REASONS = ['critical_result', 'overdue_follow_up', 'low_confidence'] as const;
export type ReviewReason = (typeof REVIEW_REASONS)[number];
