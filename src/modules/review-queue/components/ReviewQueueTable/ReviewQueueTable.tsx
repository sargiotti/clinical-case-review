import Chip, { type ChipProps } from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Link as RouterLink, useNavigate } from 'react-router';
import type { ReviewReason } from '../../../../domain/review';
import { PriorityChip } from '../../../../shared/components/PriorityChip/PriorityChip';
import type { QueueEntry } from '../../../../shared/rules/review-queue';
import { REVIEW_REASON_LABELS, formatDateTime } from '../../../../shared/utils/format';

const REASON_COLORS: Record<ReviewReason, ChipProps['color']> = {
  critical_result: 'error',
  overdue_follow_up: 'warning',
  low_confidence: 'info',
};

interface ReviewQueueTableProps {
  entries: QueueEntry[];
}

export function ReviewQueueTable({ entries }: ReviewQueueTableProps) {
  const navigate = useNavigate();

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table aria-label="Cases needing review">
        <TableHead>
          <TableRow sx={{ '& th': { fontWeight: 600, bgcolor: 'grey.100' } }}>
            <TableCell>Case ID</TableCell>
            <TableCell>Initials</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Reasons</TableCell>
            <TableCell>Last update</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {entries.map(({ patientCase, reasons }) => (
            <TableRow
              key={patientCase.id}
              hover
              sx={{ cursor: 'pointer' }}
              onClick={(event) => {
                if (!(event.target as HTMLElement).closest('a')) navigate(`/cases/${patientCase.id}`);
              }}
            >
              <TableCell>
                <Link component={RouterLink} to={`/cases/${patientCase.id}`}>
                  {patientCase.id}
                </Link>
              </TableCell>
              <TableCell>{patientCase.patient.initials}</TableCell>
              <TableCell>
                <PriorityChip priority={patientCase.priority} />
              </TableCell>
              <TableCell>
                <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                  {reasons.map((reason) => (
                    <Chip key={reason} size="small" color={REASON_COLORS[reason]} label={REVIEW_REASON_LABELS[reason]} />
                  ))}
                </Stack>
              </TableCell>
              <TableCell>{formatDateTime(patientCase.updatedAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
