import { describe, expect, it } from 'vitest';
import type { LabResult, ReferenceRange, ResultFlag } from '../../../domain/results';
import { classifyResult, getLabFlag } from '../classify-result';

const potassiumRange: ReferenceRange = { low: 3.5, high: 5.0, criticalLow: 2.5, criticalHigh: 6.5 };

const potassiumResult: LabResult = { id: 'L1', testCode: 'K', name: 'Potassium', value: 5.5, unit: 'mmol/L' };

describe('classifyResult', () => {
  // Every limit, tested exactly on it and just beyond it.
  it.each<[number, ResultFlag]>([
    [2.4, 'critical_low'],
    [2.5, 'low'],
    [3.49, 'low'],
    [3.5, 'normal'],
    [4.2, 'normal'],
    [5.0, 'normal'],
    [5.01, 'high'],
    [6.5, 'high'],
    [6.51, 'critical_high'],
  ])('classifies %s as %s', (value, expected) => {
    expect(classifyResult(value, potassiumRange)).toBe(expected);
  });

  it('never returns a critical flag when the range has no critical limits', () => {
    const noCriticalLimits: ReferenceRange = { low: 0, high: 10 };

    expect(classifyResult(-5, noCriticalLimits)).toBe('low');
    expect(classifyResult(1000, noCriticalLimits)).toBe('high');
  });
});

describe('getLabFlag', () => {
  it('uses the ranges it is given, so changing the configuration changes the flag', () => {
    const strict = { K: { low: 3.5, high: 5.0 } };
    const relaxed = { K: { low: 3.0, high: 6.0 } };

    expect(getLabFlag(potassiumResult, strict)).toBe('high');
    expect(getLabFlag(potassiumResult, relaxed)).toBe('normal');
  });

  it('returns undefined when no range is configured for the test', () => {
    expect(getLabFlag(potassiumResult, {})).toBeUndefined();
  });
});
