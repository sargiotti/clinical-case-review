import { useMutation, useQueryClient } from '@tanstack/react-query';
import { caseApi } from '../../../api/case-api';

export function useMarkReviewed(caseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => caseApi.markReviewed(caseId),
    // The list, this detail and the review queue all read from ['cases'], so one invalidation updates all three.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cases'] }),
  });
}
