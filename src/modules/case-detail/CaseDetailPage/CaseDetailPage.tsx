import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Link as RouterLink, useParams } from 'react-router';
import { AssessmentSection } from '../components/AssessmentSection/AssessmentSection';
import { CaseTimeline } from '../components/CaseTimeline/CaseTimeline';
import { ImagingReportList } from '../components/ImagingReportList/ImagingReportList';
import { LabResultsTable } from '../components/LabResultsTable/LabResultsTable';
import { ListSection } from '../components/ListSection/ListSection';
import { PatientSummary } from '../components/PatientSummary/PatientSummary';
import { useCase } from '../hooks/useCase';

// The shell is always visible, so the page keeps its heading and back link while loading or after an error.
export function CaseDetailPage() {
  // useParams types every value as string | undefined; an empty ID simply fails to load.
  const { caseId = '' } = useParams();

  return (
    <Container component="main" sx={{ py: 3 }}>
      <Stack spacing={3}>
        <Link component={RouterLink} to="/">
          ← Back to cases
        </Link>
        <Typography variant="h4" component="h1">
          Case {caseId}
        </Typography>
        <CaseDetailContent caseId={caseId} />
      </Stack>
    </Container>
  );
}

// The part that changes: one early return per state.
function CaseDetailContent({ caseId }: { caseId: string }) {
  const { data, isPending, isError, refetch } = useCase(caseId);

  if (isPending) {
    return <CircularProgress aria-label="Loading case" />;
  }

  if (isError) {
    return (
      <Alert severity="error" action={<Button onClick={() => refetch()}>Retry</Button>}>
        The case could not be loaded.
      </Alert>
    );
  }

  return (
    <>
      <PatientSummary patientCase={data} />
      <ListSection title="Symptoms" items={data.symptoms} />
      <ListSection title="Medical history" items={data.patient.medicalHistory} />
      <LabResultsTable labResults={data.labResults} />
      <ImagingReportList reports={data.imagingReports} />
      <CaseTimeline events={data.timeline} />
      <AssessmentSection caseId={data.id} />
    </>
  );
}
