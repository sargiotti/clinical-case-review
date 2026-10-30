import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Link as RouterLink } from 'react-router';
import type { PatientCase } from '../../../../domain/case';
import { PRIORITY_LABELS, STATUS_LABELS, formatDateTime } from '../../../../shared/utils/format';

interface CaseTableProps {
  cases: PatientCase[];
}

export function CaseTable({ cases }: CaseTableProps) {
  return (
    <TableContainer>
      <Table aria-label="Patient cases">
        <TableHead>
          <TableRow>
            <TableCell>Case ID</TableCell>
            <TableCell>Initials</TableCell>
            <TableCell>Age</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Last update</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cases.map((c) => (
            <TableRow key={c.id}>
              <TableCell>
                <Link component={RouterLink} to={`/cases/${c.id}`}>
                  {c.id}
                </Link>
              </TableCell>
              <TableCell>{c.patient.initials}</TableCell>
              <TableCell>{c.patient.age}</TableCell>
              <TableCell>{STATUS_LABELS[c.status]}</TableCell>
              <TableCell>{PRIORITY_LABELS[c.priority]}</TableCell>
              <TableCell>{formatDateTime(c.updatedAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
