import type { AssessmentInput } from '../domain/assessment';
import type { PatientCase } from '../domain/case';
import type { CaseDto } from './case.dto';
import { toPatientCase } from './case.mapper';
import seedCases from './cases.json';

export interface CaseApi {
  getCases(): Promise<PatientCase[]>;
  getCase(id: string): Promise<PatientCase>;
  saveAssessment(id: string, input: AssessmentInput): Promise<PatientCase>;
  markReviewed(id: string): Promise<PatientCase>;
}

const STORAGE_KEY = 'clinical-case-review.cases';

export const SAVE_FAILURE_TRIGGER = 'FAIL';

const delay = () => new Promise((resolve) => setTimeout(resolve, 300));

function readCases(): CaseDto[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored) as CaseDto[];
  return seedCases as CaseDto[];
}

function findCase(id: string): CaseDto {
  const found = readCases().find((c) => c.id === id);
  if (!found) throw new Error(`Case ${id} not found`);
  return found;
}

function saveCase(updated: CaseDto): void {
  const cases = readCases().map((c) => (c.id === updated.id ? updated : c));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
}

export const mockCaseApi: CaseApi = {
  async getCases() {
    await delay();
    return readCases().map(toPatientCase);
  },

  async getCase(id) {
    await delay();
    return toPatientCase(findCase(id));
  },

  async saveAssessment(id, input) {
    await delay();
    if (input.notes.includes(SAVE_FAILURE_TRIGGER)) {
      throw new Error('The assessment could not be saved. Please try again.');
    }

    const current = findCase(id);
    const now = new Date().toISOString();
    const updated: CaseDto = {
      ...current,
      status: 'assessed',
      updatedAt: now,
      assessment: { ...input, savedAt: now },
      timeline: [
        ...current.timeline,
        { id: crypto.randomUUID(), type: 'assessment_saved', at: now, description: 'Assessment saved' },
      ],
    };

    saveCase(updated);
    return toPatientCase(updated);
  },

  async markReviewed(id) {
    await delay();
    const current = findCase(id);
    const now = new Date().toISOString();
    const updated: CaseDto = {
      ...current,
      status: 'reviewed',
      updatedAt: now,
      timeline: [
        ...current.timeline,
        { id: crypto.randomUUID(), type: 'case_reviewed', at: now, description: 'Case marked as reviewed' },
      ],
    };

    saveCase(updated);
    return toPatientCase(updated);
  },
};

export const caseApi: CaseApi = mockCaseApi;
