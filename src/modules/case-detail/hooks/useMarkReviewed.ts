import { useMutation, useQueryClient } from '@tanstack/react-query';
import { caseApi } from '../../../api/case-api';

export function useMarkReviewed(caseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => caseApi.markReviewed(caseId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cases'] }),
  });
}
