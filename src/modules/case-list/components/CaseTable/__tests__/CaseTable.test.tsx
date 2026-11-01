import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { mockCases } from '../../../../../test/mock-cases';
import { renderWithProviders } from '../../../../../test/render';
import { CaseTable } from '../CaseTable';

describe('CaseTable', () => {
  it('renders one row per case', () => {
    renderWithProviders(<CaseTable cases={mockCases} />);

    expect(screen.getAllByRole('row')).toHaveLength(mockCases.length + 1);
  });

  it('shows readable labels instead of raw values', () => {
    renderWithProviders(<CaseTable cases={mockCases} />);

    const row = screen.getByRole('row', { name: /C-001/ });
    expect(row).toHaveTextContent('LM');
    expect(row).toHaveTextContent('Open');
    expect(row).toHaveTextContent('Urgent');
    expect(row).not.toHaveTextContent('urgent');
    expect(row).not.toHaveTextContent('2026-10-28T09:15:00Z');
  });

  it('links each case ID to its detail page', () => {
    renderWithProviders(<CaseTable cases={mockCases} />);

    expect(screen.getByRole('link', { name: 'C-001' })).toHaveAttribute('href', '/cases/C-001');
  });
});
