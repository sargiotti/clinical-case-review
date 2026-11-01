import { useMutation, useQueryClient } from '@tanstack/react-query';
import { caseApi } from '../../../api/case-api';
import type { AssessmentInput } from '../../../domain/assessment';

export function useSaveAssessment(caseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AssessmentInput) => caseApi.saveAssessment(caseId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cases'] }),
  });
}
