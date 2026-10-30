import type { CasePriority, CaseStatus, PatientCase } from '../domain/case';

// Deterministic cases for tests. Independent from api/cases.json, so editing the seed data cannot break tests.

interface MockCaseOptions {
  id: string;
  initials: string;
  status: CaseStatus;
  priority: CasePriority;
  updatedAt: string;
}

// Fills in the fields tests do not care about, so each mock case is one short call.
function makeCase(options: MockCaseOptions): PatientCase {
  return {
    id: options.id,
    patient: { initials: options.initials, age: 50, medicalHistory: [] },
    status: options.status,
    priority: options.priority,
    updatedAt: options.updatedAt,
    symptoms: [],
    labResults: [],
    imagingReports: [],
    timeline: [],
  };
}

export const urgentOpenCase = makeCase({
  id: 'C-001',
  initials: 'LM',
  status: 'open',
  priority: 'urgent',
  updatedAt: '2026-10-28T09:15:00Z',
});

export const mediumOpenCase = makeCase({
  id: 'C-002',
  initials: 'JO',
  status: 'open',
  priority: 'medium',
  updatedAt: '2026-10-27T14:00:00Z',
});

export const highAssessedCase = makeCase({
  id: 'C-003',
  initials: 'SR',
  status: 'assessed',
  priority: 'high',
  updatedAt: '2026-10-26T16:40:00Z',
});

export const lowReviewedCase = makeCase({
  id: 'C-004',
  initials: 'TB',
  status: 'reviewed',
  priority: 'low',
  updatedAt: '2026-10-25T10:30:00Z',
});

/** A case with data in every section, for the detail page. The timeline is deliberately not in date order. */
export const detailedCase: PatientCase = {
  id: 'C-100',
  patient: { initials: 'AB', age: 61, medicalHistory: ['Hypertension'] },
  status: 'open',
  priority: 'urgent',
  updatedAt: '2026-10-28T09:15:00Z',
  symptoms: ['Palpitations'],
  labResults: [
    { id: 'L1', testCode: 'K', name: 'Potassium', value: 6.8, unit: 'mmol/L' },
    { id: 'L2', testCode: 'NA', name: 'Sodium', value: 138, unit: 'mmol/L' },
    { id: 'L3', testCode: 'HB', name: 'Haemoglobin', value: 11.4, unit: 'g/dL' },
  ],
  imagingReports: [
    { id: 'I1', modality: 'Chest X-ray', findings: 'Patchy opacity in the right lower lobe.', flaggedAbnormal: true },
    { id: 'I2', modality: 'Head CT', findings: 'No acute intracranial findings.', flaggedAbnormal: false },
  ],
  timeline: [
    { id: 'E3', type: 'assessment_saved', at: '2026-10-28T12:00:00Z', description: 'Assessment saved' },
    { id: 'E1', type: 'test_ordered', at: '2026-10-28T07:30:00Z', description: 'Test ordered' },
    { id: 'E2', type: 'result_received', at: '2026-10-28T09:15:00Z', description: 'Result received' },
  ],
};

/** Deliberately not in date order, so tests can prove the page sorts newest first. */
export const mockCases: PatientCase[] = [lowReviewedCase, urgentOpenCase, highAssessedCase, mediumOpenCase];
