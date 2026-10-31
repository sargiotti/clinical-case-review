import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useSaveAssessment } from '../../hooks/useSaveAssessment';
import { AssessmentForm } from '../AssessmentForm/AssessmentForm';

interface AssessmentSectionProps {
  caseId: string;
}

export function AssessmentSection({ caseId }: AssessmentSectionProps) {
  const save = useSaveAssessment(caseId);

  return (
    <Stack component="section" spacing={2}>
      <Typography variant="h6" component="h2">
        Assessment
      </Typography>

      {/* The form stays mounted after a failure, so nothing the user typed is lost. */}
      <AssessmentForm isSaving={save.isPending} onSubmit={(input) => save.mutate(input)} />

      {/* A confirmation is polite (status); only the failure interrupts (alert). */}
      {save.isSuccess && (
        <Alert severity="success" role="status">
          Assessment saved.
        </Alert>
      )}
      {save.isError && (
        <Alert severity="error" action={<Button onClick={() => save.mutate(save.variables)}>Retry</Button>}>
          {save.error.message}
        </Alert>
      )}
    </Stack>
  );
}
