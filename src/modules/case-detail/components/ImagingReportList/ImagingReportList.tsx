import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { ImagingReport } from '../../../../domain/results';

interface ImagingReportListProps {
  reports: ImagingReport[];
}

export function ImagingReportList({ reports }: ImagingReportListProps) {
  return (
    <Stack spacing={1}>
      <Typography variant="h6" component="h2">
        Imaging reports
      </Typography>
      {reports.length === 0 ? (
        <Typography color="text.secondary">None recorded</Typography>
      ) : (
        <Stack component="ul" spacing={2} sx={{ m: 0, p: 0, listStyle: 'none' }}>
          {reports.map((report) => (
            <li key={report.id}>
              <Stack spacing={0.5}>
                <Typography variant="subtitle1" component="h3">
                  {report.modality}
                </Typography>
                {report.flaggedAbnormal ? (
                  <Chip
                    size="small"
                    variant="outlined"
                    color="warning"
                    sx={{ alignSelf: 'flex-start' }}
                    label={
                      <>
                        <span aria-hidden="true">⚠</span> Abnormal
                      </>
                    }
                  />
                ) : (
                  <Typography>No abnormality flagged</Typography>
                )}
                <Typography>{report.findings}</Typography>
              </Stack>
            </li>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
