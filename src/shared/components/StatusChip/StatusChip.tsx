import Chip, { type ChipProps } from '@mui/material/Chip';
import type { CaseStatus } from '../../../domain/case';
import { STATUS_LABELS } from '../../utils/format';

const STATUS_COLORS: Record<CaseStatus, ChipProps['color']> = {
  open: 'default',
  assessed: 'info',
  reviewed: 'success',
};

export function StatusChip({ status }: { status: CaseStatus }) {
  return <Chip size="small" color={STATUS_COLORS[status]} label={STATUS_LABELS[status]} />;
}
