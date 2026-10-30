import { useQuery } from '@tanstack/react-query';
import { caseApi } from '../../../api/case-api';

// The key starts with 'cases', so invalidating ['cases'] also refreshes every open detail.
export function useCase(caseId: string) {
  return useQuery({
    queryKey: ['cases', caseId],
    queryFn: () => caseApi.getCase(caseId),
  });
}
