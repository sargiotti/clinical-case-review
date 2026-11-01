import { useQuery } from '@tanstack/react-query';
import { caseApi } from '../../api/case-api';

export function useCases() {
  return useQuery({
    queryKey: ['cases'],
    queryFn: () => caseApi.getCases(),
  });
}
