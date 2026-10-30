import type { PatientCase } from '../domain/case';
import type { CaseDto } from './case.dto';
import { toPatient } from './patient.mapper';

/** Maps the data-source shape to the domain shape. The patient is de-identified by toPatient. */
export function toPatientCase(dto: CaseDto): PatientCase {
  return {
    id: dto.id,
    patient: toPatient(dto.patient),
    status: dto.status,
    priority: dto.priority,
    updatedAt: dto.updatedAt,
    symptoms: dto.symptoms,
    labResults: dto.labResults,
    imagingReports: dto.imagingReports,
    timeline: dto.timeline,
    assessment: dto.assessment,
  };
}
