import Chip from '@mui/material/Chip';
import { alpha } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import type { LabResult, ResultFlag } from '../../../../domain/results';
import { SectionCard } from '../../../../shared/components/SectionCard/SectionCard';
import { REFERENCE_RANGES } from '../../../../shared/config/reference-ranges';
import { getLabFlag } from '../../../../shared/rules/classify-result';

interface FlagDisplay {
  text: string;
  symbol: string;
  color: 'warning' | 'error';
}

const FLAG_DISPLAY: Record<ResultFlag, FlagDisplay | null> = {
  normal: null,
  low: { text: 'Low', symbol: '▼', color: 'warning' },
  high: { text: 'High', symbol: '▲', color: 'warning' },
  critical_low: { text: 'Critical low', symbol: '▼▼', color: 'error' },
  critical_high: { text: 'Critical high', symbol: '▲▲', color: 'error' },
};

function FlagCell({ flag }: { flag: ResultFlag | undefined }) {
  if (flag === undefined) return 'No reference range';

  const display = FLAG_DISPLAY[flag];
  if (display === null) return 'Normal';

  return (
    <Chip
      size="small"
      variant="outlined"
      color={display.color}
      label={
        <>
          <span aria-hidden="true">{display.symbol}</span> {display.text}
        </>
      }
    />
  );
}

interface LabResultsTableProps {
  labResults: LabResult[];
}

export function LabResultsTable({ labResults }: LabResultsTableProps) {
  return (
    <SectionCard title="Laboratory results">
      {labResults.length === 0 ? (
        <Typography color="text.secondary">None recorded</Typography>
      ) : (
        <TableContainer>
          <Table size="small" aria-label="Laboratory results">
            <TableHead>
              <TableRow sx={{ '& th': { fontWeight: 600, bgcolor: 'grey.100' } }}>
                <TableCell>Test</TableCell>
                <TableCell>Result</TableCell>
                <TableCell>Reference range</TableCell>
                <TableCell>Flag</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {labResults.map((lab) => {
                const flag = getLabFlag(lab);
                const range = REFERENCE_RANGES[lab.testCode];
                const isAbnormal = flag !== undefined && flag !== 'normal';
                const isCritical = flag === 'critical_low' || flag === 'critical_high';

                return (
                  <TableRow
                    key={lab.id}
                    sx={isCritical ? { bgcolor: (theme) => alpha(theme.palette.error.main, 0.08) } : undefined}
                  >
                    <TableCell>{lab.name}</TableCell>
                    <TableCell sx={{ fontWeight: isAbnormal ? 'bold' : undefined }}>
                      {lab.value} {lab.unit}
                    </TableCell>
                    <TableCell>{range ? `${range.low}–${range.high} ${lab.unit}` : '—'}</TableCell>
                    <TableCell>
                      <FlagCell flag={flag} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </SectionCard>
  );
}
