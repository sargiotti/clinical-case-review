import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { useMarkReviewed } from '../../hooks/useMarkReviewed';

interface MarkReviewedButtonProps {
  caseId: string;
  reviewed: boolean;
}

export function MarkReviewedButton({ caseId, reviewed }: MarkReviewedButtonProps) {
  const review = useMarkReviewed(caseId);

  const label = reviewed ? 'Reviewed' : review.isPending ? 'Marking…' : 'Mark as reviewed';

  return (
    <>
      <Button variant="outlined" disabled={reviewed || review.isPending} onClick={() => review.mutate()}>
        {label}
      </Button>
      {review.isError && (
        <Alert severity="error" action={<Button onClick={() => review.mutate()}>Retry</Button>}>
          The case could not be marked as reviewed.
        </Alert>
      )}
    </>
  );
}
