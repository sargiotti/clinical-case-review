export interface LabResult {
  id: string;
  /** Key into the reference-range config, e.g. "K" for potassium. */
  testCode: string;
  name: string;
  value: number;
  unit: string;
}

export interface ImagingReport {
  id: string;
  modality: string;
  findings: string;
  /** Imaging is free text, so abnormality is flagged by the reporting radiologist. */
  flaggedAbnormal: boolean;
}

/** Outcome of comparing a lab value against its reference range. */
export type ResultFlag = 'normal' | 'low' | 'high' | 'critical_low' | 'critical_high';

export interface ReferenceRange {
  low: number;
  high: number;
  criticalLow?: number;
  criticalHigh?: number;
}
