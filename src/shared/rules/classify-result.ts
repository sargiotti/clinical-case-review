import type { LabResult, ReferenceRange, ResultFlag } from '../../domain/results';
import { REFERENCE_RANGES } from '../config/reference-ranges';

/**
 * Compares a value with its reference range. Values exactly on a limit count as inside it:
 * only values strictly beyond a limit are flagged. Critical limits are optional.
 */
export function classifyResult(value: number, range: ReferenceRange): ResultFlag {
  if (range.criticalLow !== undefined && value < range.criticalLow) return 'critical_low';
  if (range.criticalHigh !== undefined && value > range.criticalHigh) return 'critical_high';
  if (value < range.low) return 'low';
  if (value > range.high) return 'high';
  return 'normal';
}

/** Returns undefined when no range is configured for the test: unknown is never reported as normal. */
export function getLabFlag(
  lab: LabResult,
  ranges: Record<string, ReferenceRange> = REFERENCE_RANGES,
): ResultFlag | undefined {
  const range = ranges[lab.testCode];
  return range ? classifyResult(lab.value, range) : undefined;
}
