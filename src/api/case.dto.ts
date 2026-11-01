import type { Assessment } from '../domain/assessment';
import type { CasePriority, CaseStatus } from '../domain/case';
import type { ImagingReport, LabResult } from '../domain/results';
import type { TimelineEvent } from '../domain/timeline';
import type { PatientDto } from './patient.dto';

export interface CaseDto {
  id: string;
  patient: PatientDto;
  status: CaseStatus;
  priority: CasePriority;
  updatedAt: string;
  symptoms: string[];
  labResults: LabResult[];
  imagingReports: ImagingReport[];
  timeline: TimelineEvent[];
  assessment?: Assessment;
}
