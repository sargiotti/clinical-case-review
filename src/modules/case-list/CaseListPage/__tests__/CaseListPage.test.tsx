import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { caseApi } from '../../../../api/case-api';
import { mockCases } from '../../../../test/mock-cases';
import { renderWithProviders } from '../../../../test/render';
import { CaseListPage } from '../CaseListPage';

async function getListedCaseIds() {
  const table = await screen.findByRole('table');
  return within(table)
    .getAllByRole('link')
    .map((link) => link.textContent);
}

describe('CaseListPage', () => {
  beforeEach(() => {
    vi.spyOn(caseApi, 'getCases').mockResolvedValue(mockCases);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows a loading indicator, then the cases with the newest update first', async () => {
    renderWithProviders(<CaseListPage />);

    expect(screen.getByRole('progressbar', { name: 'Loading cases' })).toBeInTheDocument();
    expect(await getListedCaseIds()).toEqual(['C-001', 'C-002', 'C-003', 'C-004']);
  });

  it('links to the review queue', async () => {
    renderWithProviders(<CaseListPage />);

    expect(screen.getByRole('link', { name: 'Review queue' })).toHaveAttribute('href', '/review');
    await getListedCaseIds();
  });

  it('applies the filters from the URL and counts the matching cases', async () => {
    renderWithProviders(<CaseListPage />, '/?status=open');

    expect(await getListedCaseIds()).toEqual(['C-001', 'C-002']);
    expect(screen.getByRole('status')).toHaveTextContent('2 of 4 cases');
  });

  it('shows an empty state when nothing matches, and Clear filters restores every case', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CaseListPage />, '/?status=banana');

    expect(await screen.findByRole('alert')).toHaveTextContent('No cases match your filters.');
    expect(screen.getByRole('status')).toHaveTextContent('0 of 4 cases');

    await user.click(screen.getByRole('button', { name: 'Clear filters' }));

    expect(await getListedCaseIds()).toHaveLength(4);
    expect(screen.getByTestId('location')).toHaveTextContent(/^\/$/);
  });

  it('shows an error when loading fails, and Retry loads the cases', async () => {
    const user = userEvent.setup();
    vi.spyOn(caseApi, 'getCases').mockRejectedValueOnce(new Error('Network down'));
    renderWithProviders(<CaseListPage />);

    expect(await screen.findByRole('alert')).toHaveTextContent('The cases could not be loaded.');

    await user.click(screen.getByRole('button', { name: 'Retry' }));

    expect(await getListedCaseIds()).toHaveLength(4);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
