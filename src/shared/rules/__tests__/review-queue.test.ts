import { describe, expect, it } from 'vitest';
import type { Assessment } from '../../../domain/assessment';
import type { PatientCase } from '../../../domain/case';
import { mediumOpenCase, urgentOpenCase } from '../../../test/mock-cases';
import { getReviewQueue, getReviewReasons } from '../review-queue';

const TODAY = '2026-11-05';

// A copy of a plain case (no labs, no assessment) with only what the test cares about changed.
function withPotassium(value: number, base: PatientCase = urgentOpenCase): PatientCase {
  return { ...base, labResults: [{ id: 'L1', testCode: 'K', name: 'Potassium', value, unit: 'mmol/L' }] };
}

function withAssessment(changes: Partial<Assessment>, base: PatientCase = urgentOpenCase): PatientCase {
  const assessment: Assessment = {
    workingAssessment: 'Pneumonia',
    confidence: 'high',
    nextAction: 'discharge',
    notes: '',
    savedAt: '2026-10-28T12:00:00Z',
    ...changes,
  };
  return { ...base, status: 'assessed', assessment };
}

describe('getReviewReasons', () => {
  it('needs no review when there is no critical result, no overdue follow-up and no low confidence', () => {
    expect(getReviewReasons(urgentOpenCase, TODAY)).toEqual([]);
    expect(getReviewReasons(withAssessment({}), TODAY)).toEqual([]);
  });

  it('flags a critical result only when it is strictly beyond the critical limit', () => {
    // Potassium critical high is 6.5: on the limit is still just "high".
    expect(getReviewReasons(withPotassium(6.5), TODAY)).toEqual([]);
    expect(getReviewReasons(withPotassium(6.51), TODAY)).toEqual(['critical_result']);
  });

  it('flags a follow-up as overdue only when its date is before today', () => {
    expect(getReviewReasons(withAssessment({ followUpDate: '2026-11-04' }), TODAY)).toEqual(['overdue_follow_up']);
    expect(getReviewReasons(withAssessment({ followUpDate: TODAY }), TODAY)).toEqual([]);
    expect(getReviewReasons(withAssessment({ followUpDate: '2026-11-06' }), TODAY)).toEqual([]);
  });

  it('does not treat a missing follow-up date as overdue', () => {
    expect(getReviewReasons(withAssessment({ followUpDate: undefined }), TODAY)).toEqual([]);
  });

  it('flags low confidence, and not medium or high', () => {
    expect(getReviewReasons(withAssessment({ confidence: 'low' }), TODAY)).toEqual(['low_confidence']);
    expect(getReviewReasons(withAssessment({ confidence: 'medium' }), TODAY)).toEqual([]);
  });

  it('lists several reasons from most to least urgent', () => {
    const everything = withAssessment({ confidence: 'low', followUpDate: '2026-11-01' }, withPotassium(7));

    expect(getReviewReasons(everything, TODAY)).toEqual(['critical_result', 'overdue_follow_up', 'low_confidence']);
  });

  it('never needs review once the case is reviewed', () => {
    const reviewed: PatientCase = { ...withPotassium(7), status: 'reviewed' };

    expect(getReviewReasons(reviewed, TODAY)).toEqual([]);
  });
});

describe('getReviewQueue', () => {
  it('leaves out cases that need no review', () => {
    const queue = getReviewQueue([urgentOpenCase, withPotassium(7, mediumOpenCase)], TODAY);

    expect(queue.map((entry) => entry.patientCase.id)).toEqual(['C-002']);
  });

  it('puts the most urgent reason first, and the longest waiting first within a reason', () => {
    const lowConfidence = withAssessment({ confidence: 'low' }, { ...urgentOpenCase, id: 'A', updatedAt: '2026-10-01T00:00:00Z' });
    const overdue = withAssessment({ followUpDate: '2026-11-01' }, { ...urgentOpenCase, id: 'B', updatedAt: '2026-10-02T00:00:00Z' });
    const criticalNew = withPotassium(7, { ...urgentOpenCase, id: 'C', updatedAt: '2026-10-20T00:00:00Z' });
    const criticalOld = withPotassium(7, { ...urgentOpenCase, id: 'D', updatedAt: '2026-10-10T00:00:00Z' });

    const queue = getReviewQueue([lowConfidence, overdue, criticalNew, criticalOld], TODAY);

    // Critical (oldest first), then overdue, then low confidence.
    expect(queue.map((entry) => entry.patientCase.id)).toEqual(['D', 'C', 'B', 'A']);
  });

  it('keeps the reasons with each case', () => {
    const queue = getReviewQueue([withPotassium(7)], TODAY);

    expect(queue[0].reasons).toEqual(['critical_result']);
  });
});
