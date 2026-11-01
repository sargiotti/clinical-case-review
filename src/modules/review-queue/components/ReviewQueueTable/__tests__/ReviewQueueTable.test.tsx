import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { criticalLabCase, lowConfidenceCase } from '../../../../../test/mock-cases';
import { renderWithProviders } from '../../../../../test/render';
import { ReviewQueueTable } from '../ReviewQueueTable';

describe('ReviewQueueTable', () => {
  it('shows a row per case with the case ID linking to its detail page', () => {
    renderWithProviders(
      <ReviewQueueTable
        entries={[
          { patientCase: criticalLabCase, reasons: ['critical_result'] },
          { patientCase: lowConfidenceCase, reasons: ['low_confidence'] },
        ]}
      />,
    );

    const table = screen.getByRole('table', { name: 'Cases needing review' });
    expect(within(table).getByRole('link', { name: 'C-005' })).toHaveAttribute('href', '/cases/C-005');
    expect(within(table).getByRole('link', { name: 'C-006' })).toHaveAttribute('href', '/cases/C-006');
  });

  it('says why each case is there, in words, and keeps the order it was given', () => {
    renderWithProviders(
      <ReviewQueueTable
        entries={[
          { patientCase: lowConfidenceCase, reasons: ['overdue_follow_up', 'low_confidence'] },
          { patientCase: criticalLabCase, reasons: ['critical_result'] },
        ]}
      />,
    );

    const rows = screen.getAllByRole('row');
    // rows[0] is the header.
    expect(rows[1]).toHaveTextContent('C-006');
    expect(rows[1]).toHaveTextContent('Overdue follow-up, Low confidence');
    expect(rows[2]).toHaveTextContent('C-005');
    expect(rows[2]).toHaveTextContent('Critical result');
  });
});
