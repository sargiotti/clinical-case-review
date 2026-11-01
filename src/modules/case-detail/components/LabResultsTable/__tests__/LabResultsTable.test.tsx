import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { detailedCase } from '../../../../../test/mock-cases';
import { LabResultsTable } from '../LabResultsTable';

describe('LabResultsTable', () => {
  it('flags abnormal results with text, using the configured reference ranges', () => {
    render(<LabResultsTable labResults={detailedCase.labResults} />);

    const table = screen.getByRole('table', { name: 'Laboratory results' });
    expect(within(table).getByRole('row', { name: /Potassium/ })).toHaveTextContent('Critical high');
    expect(within(table).getByRole('row', { name: /Haemoglobin/ })).toHaveTextContent('Low');
    expect(within(table).getByRole('row', { name: /Sodium/ })).toHaveTextContent('Normal');
  });

  it('says so when a test has no reference range, instead of calling it normal', () => {
    render(<LabResultsTable labResults={[{ id: 'L9', testCode: 'XX', name: 'Unknown test', value: 1, unit: 'u' }]} />);

    expect(screen.getByRole('row', { name: /Unknown test/ })).toHaveTextContent('No reference range');
  });

  it('shows "None recorded" when there are no lab results', () => {
    render(<LabResultsTable labResults={[]} />);

    expect(screen.getByText('None recorded')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });
});
