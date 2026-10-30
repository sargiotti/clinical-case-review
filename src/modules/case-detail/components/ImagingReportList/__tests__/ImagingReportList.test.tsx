import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { detailedCase } from '../../../../../test/mock-cases';
import { ImagingReportList } from '../ImagingReportList';

// The list item of one report, found through its modality heading.
function getReport(modality: string) {
  const item = screen.getByRole('heading', { name: modality }).closest('li');
  if (!item) throw new Error(`No list item around the "${modality}" report`);
  return item;
}

describe('ImagingReportList', () => {
  it('marks the report flagged abnormal, and says so when nothing is flagged', () => {
    render(<ImagingReportList reports={detailedCase.imagingReports} />);

    // Each message is checked against its own report, so swapped flags cannot pass.
    const chestXray = getReport('Chest X-ray');
    expect(chestXray).toHaveTextContent('Abnormal');
    expect(chestXray).not.toHaveTextContent('No abnormality flagged');

    const headCt = getReport('Head CT');
    expect(headCt).toHaveTextContent('No abnormality flagged');
    expect(headCt).not.toHaveTextContent('Abnormal');
  });

  it('shows "None recorded" when there are no imaging reports', () => {
    render(<ImagingReportList reports={[]} />);

    expect(screen.getByText('None recorded')).toBeInTheDocument();
  });
});
