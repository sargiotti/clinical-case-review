// De-identified on purpose: the full name stays in the data layer (see api/patient.mapper.ts).
export interface Patient {
  initials: string;
  age: number;
  medicalHistory: string[];
}
