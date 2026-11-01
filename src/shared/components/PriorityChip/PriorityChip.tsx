import Chip, { type ChipProps } from '@mui/material/Chip';
import type { CasePriority } from '../../../domain/case';
import { PRIORITY_LABELS } from '../../utils/format';

const PRIORITY_COLORS: Record<CasePriority, ChipProps['color']> = {
  low: 'default',
  medium: 'default',
  high: 'warning',
  urgent: 'error',
};

export function PriorityChip({ priority }: { priority: CasePriority }) {
  return <Chip size="small" color={PRIORITY_COLORS[priority]} label={PRIORITY_LABELS[priority]} />;
}
