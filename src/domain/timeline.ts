export type TimelineEventType =
  | 'test_ordered'
  | 'result_received'
  | 'assessment_saved'
  | 'case_reviewed';

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  at: string;
  description: string;
}
