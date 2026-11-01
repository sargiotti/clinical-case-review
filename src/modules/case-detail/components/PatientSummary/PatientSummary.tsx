import Box from '@mui/material/Box';
import { Fragment } from 'react';
import type { PatientCase } from '../../../../domain/case';
import { SectionCard } from '../../../../shared/components/SectionCard/SectionCard';

interface PatientSummaryProps {
  patientCase: PatientCase;
}

export function PatientSummary({ patientCase }: PatientSummaryProps) {
  const details = [
    ['Initials', patientCase.patient.initials],
    ['Age', patientCase.patient.age],
  ];

  return (
    <SectionCard title="Patient">
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
    </SectionCard>
  );
}
