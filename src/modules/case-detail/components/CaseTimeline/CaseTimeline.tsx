import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { TimelineEvent } from '../../../../domain/timeline';
import { SectionCard } from '../../../../shared/components/SectionCard/SectionCard';
import { formatDateTime } from '../../../../shared/utils/format';

interface CaseTimelineProps {
  events: TimelineEvent[];
}

export function CaseTimeline({ events }: CaseTimelineProps) {
  const sorted = [...events].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

  return (
    <SectionCard title="Timeline">
      {sorted.length === 0 ? (
        <Typography color="text.secondary">None recorded</Typography>
      ) : (
        <Box component="ol" sx={{ m: 0, p: 0, listStyle: 'none' }}>
          {sorted.map((event) => (
            <Box
              component="li"
              key={event.id}
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '12rem 1fr' },
                columnGap: 2,
                py: 1,
                borderBottom: 1,
                borderColor: 'divider',
                '&:last-child': { borderBottom: 0 },
              }}
            >
              <Typography component="time" dateTime={event.at} color="text.secondary">
                {formatDateTime(event.at)}
              </Typography>
              <span>{event.description}</span>
            </Box>
          ))}
        </Box>
      )}
    </SectionCard>
  );
}
