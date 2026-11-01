import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Fragment } from 'react';
import type { Assessment } from '../../../../domain/assessment';
import { SectionCard } from '../../../../shared/components/SectionCard/SectionCard';
import { CONFIDENCE_LABELS, formatDate, formatDateTime, NEXT_ACTION_LABELS } from '../../../../shared/utils/format';

interface AssessmentSummaryProps {
  assessment?: Assessment;
}

export function AssessmentSummary({ assessment }: AssessmentSummaryProps) {
  return (
    <SectionCard title="Latest assessment">
      {assessment ? <AssessmentDetails assessment={assessment} /> : <Typography color="text.secondary">None recorded</Typography>}
    </SectionCard>
  );
}

function AssessmentDetails({ assessment }: { assessment: Assessment }) {
  const details = [
    ['Working assessment', assessment.workingAssessment],
    ['Confidence', CONFIDENCE_LABELS[assessment.confidence]],
    ['Next action', NEXT_ACTION_LABELS[assessment.nextAction]],
    ...(assessment.followUpDate ? [['Follow-up date', formatDate(assessment.followUpDate)]] : []),
    ['Notes', assessment.notes || 'None'],
    ['Saved', formatDateTime(assessment.savedAt)],
  ];

  return (
    <Box component="dl" sx={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', columnGap: 3, rowGap: 0.5, m: 0 }}>
      {details.map(([label, value]) => (
        <Fragment key={label}>
          <Box component="dt" sx={{ fontWeight: 'bold' }}>
            {label}
          </Box>
          <Box component="dd" sx={{ m: 0 }}>
            {value}
          </Box>
        </Fragment>
      ))}
    </Box>
  );
}
