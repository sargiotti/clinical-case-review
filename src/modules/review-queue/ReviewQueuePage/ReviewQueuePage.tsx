import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router';
import { useCases } from '../../../shared/hooks/useCases';
import { getReviewQueue } from '../../../shared/rules/review-queue';
import { ReviewQueueTable } from '../components/ReviewQueueTable/ReviewQueueTable';

export function ReviewQueuePage() {
  return (
    <Container component="main" sx={{ py: 3 }}>
      <Stack spacing={3}>
        <Link component={RouterLink} to="/">
          ← Back to cases
        </Link>
        <Typography variant="h4" component="h1">
          Review queue
        </Typography>
        <Alert severity="info" role="note">
          Cases appear here when they have a critical result, an overdue follow-up or a low-confidence assessment.
          Critical results come first.
        </Alert>
        <ReviewQueueContent />
      </Stack>
    </Container>
  );
}

function ReviewQueueContent() {
  const { data, isPending, isError, refetch } = useCases();

  if (isPending) {
    return <CircularProgress aria-label="Loading review queue" />;
  }

  if (isError) {
    return (
      <Alert severity="error" action={<Button onClick={() => refetch()}>Retry</Button>}>
        The review queue could not be loaded.
      </Alert>
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const queue = getReviewQueue(data, today);

  if (queue.length === 0) {
    return <Alert severity="success">No cases need review.</Alert>;
  }

  return (
    <>
      <Typography role="status">
        {queue.length} {queue.length === 1 ? 'case needs' : 'cases need'} review
      </Typography>
      <ReviewQueueTable entries={queue} />
    </>
  );
}
