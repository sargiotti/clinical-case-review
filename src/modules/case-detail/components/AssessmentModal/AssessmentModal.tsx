import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import { useSaveAssessment } from '../../hooks/useSaveAssessment';
import { useUnsavedChangesWarning } from '../../hooks/useUnsavedChangesWarning';
import { AssessmentForm } from '../AssessmentForm/AssessmentForm';
import { DiscardChangesDialog } from '../DiscardChangesDialog/DiscardChangesDialog';

interface AssessmentModalProps {
  caseId: string;
  open: boolean;
  onClose: () => void;
}

export function AssessmentModal({ caseId, open, onClose }: AssessmentModalProps) {
  const save = useSaveAssessment(caseId);
  const [dirty, setDirty] = useState(false);
  const [confirmingClose, setConfirmingClose] = useState(false);

  // After a successful save there is nothing left to lose.
  const unsaved = dirty && !save.isSuccess;
  const blocker = useUnsavedChangesWarning(unsaved);

  function handleClose() {
    // The next time it opens, it starts blank and without the old messages.
    save.reset();
    setDirty(false);
    onClose();
  }

  // Cancel, Esc and the backdrop all come here: ask first if something would be lost.
  function requestClose() {
    if (unsaved) setConfirmingClose(true);
    else handleClose();
  }

  return (
    <>
      <Dialog open={open} onClose={requestClose} fullWidth maxWidth="sm" aria-labelledby="assessment-title">
        <DialogTitle id="assessment-title">Add assessment</DialogTitle>
        <DialogContent>
          {save.isSuccess ? (
            // The form is gone after a save, so it cannot be submitted twice.
            <Alert severity="success" role="status">
              Assessment saved.
            </Alert>
          ) : (
            <>
              <AssessmentForm isSaving={save.isPending} onDirtyChange={setDirty} onSubmit={(input) => save.mutate(input)} />
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
          <Button onClick={requestClose}>{save.isSuccess ? 'Close' : 'Cancel'}</Button>
        </DialogActions>
      </Dialog>

      {/* Closing the modal with typed input. */}
      <DiscardChangesDialog
        open={confirmingClose}
        onStay={() => setConfirmingClose(false)}
        onDiscard={() => {
          setConfirmingClose(false);
          handleClose();
        }}
      />
      {/* Leaving the page (Back button, a link) with typed input. */}
      <DiscardChangesDialog
        open={blocker.state === 'blocked'}
        onStay={() => blocker.reset?.()}
        onDiscard={() => blocker.proceed?.()}
      />
    </>
  );
}
