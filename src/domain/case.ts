import type { Assessment } from './assessment';
import type { Patient } from './patient';
import type { ImagingReport, LabResult } from './results';
import type { TimelineEvent } from './timeline';

// Const arrays let the UI render filter options from the same source the types come from.
export const CASE_STATUSES = ['open', 'assessed', 'reviewed'] as const;
export type CaseStatus = (typeof CASE_STATUSES)[number];

export const CASE_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;
export type CasePriority = (typeof CASE_PRIORITIES)[number];

export interface PatientCase {
  id: string;
  patient: Patient;
  status: CaseStatus;
  priority: CasePriority;
  /** ISO datetime. Dates are strings so cases round-trip through localStorage unchanged. */
  updatedAt: string;
  /** Symptoms belong to this presentation, history belongs to the patient. */
  symptoms: string[];
  labResults: LabResult[];
  imagingReports: ImagingReport[];
  timeline: TimelineEvent[];
  assessment?: Assessment;
}
