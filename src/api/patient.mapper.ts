import type { Patient } from '../domain/patient';
import type { PatientDto } from './patient.dto';

/** Maps the data-source shape to the domain shape. The full name is dropped here. */
export function toPatient(dto: PatientDto): Patient {
  return {
    initials: `${dto.firstName.trim().charAt(0)}${dto.lastName.trim().charAt(0)}`.toUpperCase(),
    age: dto.age,
    medicalHistory: dto.medicalHistory,
  };
}
