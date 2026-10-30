/** Patient as delivered by the data source. Never used directly by the UI. */
export interface PatientDto {
  firstName: string;
  lastName: string;
  age: number;
  medicalHistory: string[];
}
