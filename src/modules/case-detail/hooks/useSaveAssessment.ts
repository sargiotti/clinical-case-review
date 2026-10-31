import { useMutation, useQueryClient } from '@tanstack/react-query';
import { caseApi } from '../../../api/case-api';
import type { AssessmentInput } from '../../../domain/assessment';

export function useSaveAssessment(caseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AssessmentInput) => caseApi.saveAssessment(caseId, input),
    // Refreshes the list and this detail page (same 'cases' key prefix), so the new status and timeline event show up.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cases'] }),
  });
}
