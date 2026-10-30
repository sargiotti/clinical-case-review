import type { ReferenceRange } from '../../domain/results';

/** Reference ranges keyed by LabResult.testCode. Change a number here and the highlighting follows. */
export const REFERENCE_RANGES: Record<string, ReferenceRange> = {
  K: { low: 3.5, high: 5.0, criticalLow: 2.5, criticalHigh: 6.5 }, // potassium, mmol/L
  NA: { low: 135, high: 145, criticalLow: 120, criticalHigh: 160 }, // sodium, mmol/L
  GLU: { low: 70, high: 140, criticalLow: 50, criticalHigh: 400 }, // glucose, mg/dL
  WBC: { low: 4.0, high: 11.0, criticalLow: 2.0, criticalHigh: 30 }, // white blood cells, x10^9/L
  CRP: { low: 0, high: 10, criticalHigh: 100 }, // C-reactive protein, mg/L
  HB: { low: 12.0, high: 17.5, criticalLow: 7.0, criticalHigh: 20 }, // haemoglobin, g/dL
};
