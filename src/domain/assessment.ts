export const CONFIDENCE_LEVELS = ['low', 'medium', 'high'] as const;
export type ConfidenceLevel = (typeof CONFIDENCE_LEVELS)[number];

export const NEXT_ACTIONS = ['discharge', 'follow_up', 'order_tests', 'refer'] as const;
export type NextAction = (typeof NEXT_ACTIONS)[number];

export interface AssessmentInput {
  workingAssessment: string;
  confidence: ConfidenceLevel;
  nextAction: NextAction;
  notes: string;
  followUpDate?: string;
}

export interface Assessment extends AssessmentInput {
  savedAt: string;
}
