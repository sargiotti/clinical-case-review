import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useSaveAssessment } from '../../hooks/useSaveAssessment';
import { AssessmentForm } from '../AssessmentForm/AssessmentForm';

interface AssessmentModalProps {
  caseId: string;
  open: boolean;
  onClose: () => void;
}

export function AssessmentModal({ caseId, open, onClose }: AssessmentModalProps) {
  const save = useSaveAssessment(caseId);

  function handleClose() {
    // The next time it opens, it starts blank and without the old messages.
    save.reset();
    onClose();
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" aria-labelledby="assessment-title">
      <DialogTitle id="assessment-title">Add assessment</DialogTitle>
      <DialogContent>
        {save.isSuccess ? (
          // The form is gone after a save, so it cannot be submitted twice.
          <Alert severity="success" role="status">
            Assessment saved.
          </Alert>
        ) : (
          <>
            <AssessmentForm isSaving={save.isPending} onSubmit={(input) => save.mutate(input)} />
            {/* The form stays mounted after a failure, so nothing the user typed is lost. */}
            {save.isError && (
              <Alert severity="error" action={<Button onClick={() => save.mutate(save.variables)}>Retry</Button>} sx={{ mt: 2 }}>
                {save.error.message}
              </Alert>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{save.isSuccess ? 'Close' : 'Cancel'}</Button>
      </DialogActions>
    </Dialog>
  );
}
