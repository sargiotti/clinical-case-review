import { useQuery } from '@tanstack/react-query';
import { caseApi } from '../../../api/case-api';

export function useCase(caseId: string) {
  return useQuery({
    queryKey: ['cases', caseId],
    queryFn: () => caseApi.getCase(caseId),
  });
}
