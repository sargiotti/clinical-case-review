import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router';
import { useCases } from '../../../shared/hooks/useCases';
import { CaseFiltersBar } from '../components/CaseFiltersBar/CaseFiltersBar';
import { CaseTable } from '../components/CaseTable/CaseTable';
import { useCaseFilters } from '../hooks/useCaseFilters';
import { filterCases } from '../utils/filter-cases';

export function CaseListPage() {
  return (
    <Container component="main" sx={{ py: 3 }}>
      <Stack spacing={3}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            Clinical cases
          </Typography>
          <Button variant="contained" component={RouterLink} to="/review">
            Review queue
          </Button>
        </Stack>
        <CaseFiltersBar />
        <CaseListContent />
      </Stack>
    </Container>
  );
}

function CaseListContent() {
  const { filters, clearFilters } = useCaseFilters();
  const { data, isPending, isError, refetch } = useCases();

  if (isPending) {
    return <CircularProgress aria-label="Loading cases" />;
  }

  if (isError) {
    return (
      <Alert severity="error" action={<Button onClick={() => refetch()}>Retry</Button>}>
        The cases could not be loaded.
      </Alert>
    );
  }

  const visible = filterCases(data, filters).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  if (visible.length === 0) {
    return (
      <>
        <Typography role="status">0 of {data.length} cases</Typography>
        <Alert severity="info" action={<Button onClick={clearFilters}>Clear filters</Button>}>
          No cases match your filters.
        </Alert>
      </>
    );
  }

  return (
    <>
      <Typography role="status">
        {visible.length} of {data.length} cases
      </Typography>
      <CaseTable cases={visible} />
    </>
  );
}
