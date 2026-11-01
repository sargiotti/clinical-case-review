import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Link as RouterLink } from 'react-router';
import type { QueueEntry } from '../../../../shared/rules/review-queue';
import { PRIORITY_LABELS, REVIEW_REASON_LABELS, formatDateTime } from '../../../../shared/utils/format';

interface ReviewQueueTableProps {
  entries: QueueEntry[];
}

export function ReviewQueueTable({ entries }: ReviewQueueTableProps) {
  return (
    <TableContainer>
      <Table aria-label="Cases needing review">
        <TableHead>
          <TableRow>
            <TableCell>Case ID</TableCell>
            <TableCell>Initials</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Reasons</TableCell>
            <TableCell>Last update</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {entries.map(({ patientCase, reasons }) => (
            <TableRow key={patientCase.id}>
              <TableCell>
                <Link component={RouterLink} to={`/cases/${patientCase.id}`}>
                  {patientCase.id}
                </Link>
              </TableCell>
              <TableCell>{patientCase.patient.initials}</TableCell>
              <TableCell>{PRIORITY_LABELS[patientCase.priority]}</TableCell>
              <TableCell>{reasons.map((reason) => REVIEW_REASON_LABELS[reason]).join(', ')}</TableCell>
              <TableCell>{formatDateTime(patientCase.updatedAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
