export const CONFIDENCE_LEVELS = ['low', 'medium', 'high'] as const;
export type ConfidenceLevel = (typeof CONFIDENCE_LEVELS)[number];

export const NEXT_ACTIONS = ['discharge', 'follow_up', 'order_tests', 'refer'] as const;
export type NextAction = (typeof NEXT_ACTIONS)[number];

/** What the clinician enters in the form. */
export interface AssessmentInput {
  workingAssessment: string;
  confidence: ConfidenceLevel;
  nextAction: NextAction;
  notes: string;
  /** ISO date. Only present when the next action needs one (follow_up, refer). */
  followUpDate?: string;
}

/** A saved assessment. savedAt is set by the API, not the form. */
export interface Assessment extends AssessmentInput {
  savedAt: string;
}
