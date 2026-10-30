import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

interface ListSectionProps {
  title: string;
  items: string[];
}

export function ListSection({ title, items }: ListSectionProps) {
  return (
    <Stack spacing={1}>
      <Typography variant="h6" component="h2">
        {title}
      </Typography>
      {items.length === 0 ? (
        <Typography color="text.secondary">None recorded</Typography>
      ) : (
        <Box component="ul" sx={{ m: 0, pl: 3 }}>
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </Box>
      )}
    </Stack>
  );
}
