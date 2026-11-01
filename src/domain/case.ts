import type { Assessment } from './assessment';
import type { Patient } from './patient';
import type { ImagingReport, LabResult } from './results';
import type { TimelineEvent } from './timeline';

export const CASE_STATUSES = ['open', 'assessed', 'reviewed'] as const;
export type CaseStatus = (typeof CASE_STATUSES)[number];

export const CASE_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;
export type CasePriority = (typeof CASE_PRIORITIES)[number];

export interface PatientCase {
  id: string;
  patient: Patient;
  status: CaseStatus;
  priority: CasePriority;
  updatedAt: string;
  symptoms: string[];
  labResults: LabResult[];
  imagingReports: ImagingReport[];
  timeline: TimelineEvent[];
  assessment?: Assessment;
}
