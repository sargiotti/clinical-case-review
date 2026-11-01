import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Fragment } from 'react';
import type { PatientCase } from '../../../../domain/case';
import { PRIORITY_LABELS, STATUS_LABELS } from '../../../../shared/utils/format';

interface PatientSummaryProps {
  patientCase: PatientCase;
}

export function PatientSummary({ patientCase }: PatientSummaryProps) {
  const details = [
    ['Initials', patientCase.patient.initials],
    ['Age', patientCase.patient.age],
    ['Status', STATUS_LABELS[patientCase.status]],
    ['Priority', PRIORITY_LABELS[patientCase.priority]],
  ];

  return (
    <Stack spacing={1}>
      <Typography variant="h6" component="h2">
        Patient
      </Typography>
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
    </Stack>
  );
}
