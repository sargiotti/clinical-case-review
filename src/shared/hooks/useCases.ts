import { useQuery } from '@tanstack/react-query';
import { caseApi } from '../../api/case-api';

/** Shared by the case list and the review queue, so the cache key is defined once. */
export function useCases() {
  return useQuery({
    queryKey: ['cases'],
    queryFn: () => caseApi.getCases(),
  });
}
