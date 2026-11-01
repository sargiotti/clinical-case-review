import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router';
import { PriorityChip } from '../../../shared/components/PriorityChip/PriorityChip';
import { StatusChip } from '../../../shared/components/StatusChip/StatusChip';
import { AssessmentModal } from '../components/AssessmentModal/AssessmentModal';
import { AssessmentSummary } from '../components/AssessmentSummary/AssessmentSummary';
import { CaseTimeline } from '../components/CaseTimeline/CaseTimeline';
import { ImagingReportList } from '../components/ImagingReportList/ImagingReportList';
import { LabResultsTable } from '../components/LabResultsTable/LabResultsTable';
import { ListSection } from '../components/ListSection/ListSection';
import { MarkReviewedButton } from '../components/MarkReviewedButton/MarkReviewedButton';
import { PatientSummary } from '../components/PatientSummary/PatientSummary';
import { useCase } from '../hooks/useCase';

export function CaseDetailPage() {
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

function CaseDetailContent({ caseId }: { caseId: string }) {
  const { data, isPending, isError, refetch } = useCase(caseId);
  const [assessing, setAssessing] = useState(false);

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
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Stack direction="row" spacing={1}>
          <StatusChip status={data.status} />
          <PriorityChip priority={data.priority} />
        </Stack>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
          <Button variant="contained" onClick={() => setAssessing(true)}>
            Add assessment
          </Button>
          <MarkReviewedButton caseId={data.id} reviewed={data.status === 'reviewed'} />
        </Stack>
      </Stack>
      <PatientSummary patientCase={data} />
      <ListSection title="Symptoms" items={data.symptoms} />
      <ListSection title="Medical history" items={data.patient.medicalHistory} />
      <LabResultsTable labResults={data.labResults} />
      <ImagingReportList reports={data.imagingReports} />
      <AssessmentSummary assessment={data.assessment} />
      <CaseTimeline events={data.timeline} />
      <AssessmentModal caseId={data.id} open={assessing} onClose={() => setAssessing(false)} />
    </>
  );
}
