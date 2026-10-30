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

/** Deliberately not in date order, so tests can prove the page sorts newest first. */
export const mockCases: PatientCase[] = [lowReviewedCase, urgentOpenCase, highAssessedCase, mediumOpenCase];
