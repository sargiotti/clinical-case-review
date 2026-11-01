import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { caseApi } from '../../../../api/case-api';
import { criticalLabCase, lowConfidenceCase, lowReviewedCase, urgentOpenCase } from '../../../../test/mock-cases';
import { renderWithProviders } from '../../../../test/render';
import { ReviewQueuePage } from '../ReviewQueuePage';

describe('ReviewQueuePage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows a loading indicator, then only the cases that need review, most urgent first', async () => {
    vi.spyOn(caseApi, 'getCases').mockResolvedValue([lowConfidenceCase, urgentOpenCase, lowReviewedCase, criticalLabCase]);
    renderWithProviders(<ReviewQueuePage />);

    expect(screen.getByRole('progressbar', { name: 'Loading review queue' })).toBeInTheDocument();
    expect(await screen.findByRole('table')).toBeInTheDocument();

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(3);
    expect(rows[1]).toHaveTextContent('C-005');
    expect(rows[2]).toHaveTextContent('C-006');
    expect(screen.getByRole('status')).toHaveTextContent('2 cases need review');
  });

  it('says so when no case needs review', async () => {
    vi.spyOn(caseApi, 'getCases').mockResolvedValue([urgentOpenCase, lowReviewedCase]);
    renderWithProviders(<ReviewQueuePage />);

    expect(await screen.findByText('No cases need review.')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('shows an error when loading fails, and Retry loads the queue', async () => {
    const user = userEvent.setup();
    vi.spyOn(caseApi, 'getCases').mockRejectedValueOnce(new Error('Network down')).mockResolvedValue([criticalLabCase]);
    renderWithProviders(<ReviewQueuePage />);

    expect(await screen.findByRole('alert')).toHaveTextContent('The review queue could not be loaded.');

    await user.click(screen.getByRole('button', { name: 'Retry' }));

    expect(await screen.findByRole('table')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
