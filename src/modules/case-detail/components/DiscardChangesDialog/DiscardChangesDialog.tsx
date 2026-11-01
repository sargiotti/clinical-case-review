import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface DiscardChangesDialogProps {
  open: boolean;
  onStay: () => void;
  onDiscard: () => void;
}

export function DiscardChangesDialog({ open, onStay, onDiscard }: DiscardChangesDialogProps) {
  return (
    <Dialog open={open} onClose={onStay} aria-labelledby="discard-title">
      <DialogTitle id="discard-title">Discard unsaved changes?</DialogTitle>
      <DialogContent>
        <DialogContentText>The assessment has not been saved. If you leave now, what you typed will be lost.</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onStay}>Stay</Button>
        <Button onClick={onDiscard} color="error">
          Discard
        </Button>
      </DialogActions>
    </Dialog>
  );
}
