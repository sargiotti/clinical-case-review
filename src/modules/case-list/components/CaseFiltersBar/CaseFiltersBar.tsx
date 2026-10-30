import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { CASE_PRIORITIES, CASE_STATUSES } from '../../../../domain/case';
import { PRIORITY_LABELS, STATUS_LABELS } from '../../../../shared/utils/format';
import { useCaseFilters } from '../../hooks/useCaseFilters';

export function CaseFiltersBar() {
  // The URL is the state, so reading it here and in the page cannot get out of sync.
  const { filters, setFilter } = useCaseFilters();

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
      <TextField
        label="Search by case ID or initials"
        type="search"
        value={filters.search}
        onChange={(e) => setFilter('search', e.target.value)}
        sx={{ flex: 1 }}
      />
      <TextField
        select
        label="Status"
        value={filters.status}
        onChange={(e) => setFilter('status', e.target.value)}
        sx={{ minWidth: 160 }}
      >
        <MenuItem value="">All</MenuItem>
        {CASE_STATUSES.map((status) => (
          <MenuItem key={status} value={status}>
            {STATUS_LABELS[status]}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Priority"
        value={filters.priority}
        onChange={(e) => setFilter('priority', e.target.value)}
        sx={{ minWidth: 160 }}
      >
        <MenuItem value="">All</MenuItem>
        {CASE_PRIORITIES.map((priority) => (
          <MenuItem key={priority} value={priority}>
            {PRIORITY_LABELS[priority]}
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  );
}
