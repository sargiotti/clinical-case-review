export type TimelineEventType =
  | 'test_ordered'
  | 'result_received'
  | 'assessment_saved'
  | 'case_reviewed';

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  /** ISO datetime. */
  at: string;
  description: string;
}
