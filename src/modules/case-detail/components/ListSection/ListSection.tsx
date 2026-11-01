import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { SectionCard } from '../../../../shared/components/SectionCard/SectionCard';

interface ListSectionProps {
  title: string;
  items: string[];
}

export function ListSection({ title, items }: ListSectionProps) {
  return (
    <SectionCard title={title}>
      {items.length === 0 ? (
        <Typography color="text.secondary">None recorded</Typography>
      ) : (
        <Box component="ul" sx={{ m: 0, pl: 3 }}>
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </Box>
      )}
    </SectionCard>
  );
}
