import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { TimelineEvent } from '../../../../domain/timeline';
import { formatDateTime } from '../../../../shared/utils/format';

interface CaseTimelineProps {
  events: TimelineEvent[];
}

export function CaseTimeline({ events }: CaseTimelineProps) {
  const sorted = [...events].sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());

  return (
    <Stack spacing={1}>
      <Typography variant="h6" component="h2">
        Timeline
      </Typography>
      {sorted.length === 0 ? (
        <Typography color="text.secondary">None recorded</Typography>
      ) : (
        <Stack component="ol" spacing={1} sx={{ m: 0, p: 0, listStyle: 'none' }}>
          {sorted.map((event) => (
            <li key={event.id}>
              <Typography component="time" dateTime={event.at} color="text.secondary">
                {formatDateTime(event.at)}
              </Typography>{' '}
              {event.description}
            </li>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
