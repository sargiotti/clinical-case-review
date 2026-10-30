import type { PatientCase } from '../../../domain/case';

/** Filter values as they come from the URL. An empty string means "all". */
export interface CaseFilters {
  search: string;
  status: string;
  priority: string;
}

/** Search matches case ID or initials only, the UI never has the patient name. */
export function filterCases(cases: PatientCase[], filters: CaseFilters): PatientCase[] {
  const search = filters.search.trim().toLowerCase();

  return cases.filter((c) => {
    if (filters.status && c.status !== filters.status) return false;
    if (filters.priority && c.priority !== filters.priority) return false;
    if (!search) return true;
    return c.id.toLowerCase().includes(search) || c.patient.initials.toLowerCase().includes(search);
  });
}
