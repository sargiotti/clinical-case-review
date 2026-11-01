import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Link as RouterLink, useNavigate } from 'react-router';
import type { PatientCase } from '../../../../domain/case';
import { PriorityChip } from '../../../../shared/components/PriorityChip/PriorityChip';
import { StatusChip } from '../../../../shared/components/StatusChip/StatusChip';
import { formatDateTime } from '../../../../shared/utils/format';

interface CaseTableProps {
  cases: PatientCase[];
}

export function CaseTable({ cases }: CaseTableProps) {
  const navigate = useNavigate();

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table aria-label="Patient cases">
        <TableHead>
          <TableRow sx={{ '& th': { fontWeight: 600, bgcolor: 'grey.100' } }}>
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
            <TableRow
              key={c.id}
              hover
              sx={{ cursor: 'pointer' }}
              onClick={(event) => {
                if (!(event.target as HTMLElement).closest('a')) navigate(`/cases/${c.id}`);
              }}
            >
              <TableCell>
                <Link component={RouterLink} to={`/cases/${c.id}`}>
                  {c.id}
                </Link>
              </TableCell>
              <TableCell>{c.patient.initials}</TableCell>
              <TableCell>{c.patient.age}</TableCell>
              <TableCell>
                <StatusChip status={c.status} />
              </TableCell>
              <TableCell>
                <PriorityChip priority={c.priority} />
              </TableCell>
              <TableCell>{formatDateTime(c.updatedAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
