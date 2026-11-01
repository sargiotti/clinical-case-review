export interface LabResult {
  id: string;
  testCode: string;
  name: string;
  value: number;
  unit: string;
}

export interface ImagingReport {
  id: string;
  modality: string;
  findings: string;
  flaggedAbnormal: boolean;
}

export type ResultFlag = 'normal' | 'low' | 'high' | 'critical_low' | 'critical_high';

export interface ReferenceRange {
  low: number;
  high: number;
  criticalLow?: number;
  criticalHigh?: number;
}
