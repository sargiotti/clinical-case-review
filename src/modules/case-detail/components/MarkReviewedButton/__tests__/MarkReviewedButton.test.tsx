import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { caseApi } from '../../../../../api/case-api';
import { detailedCase } from '../../../../../test/mock-cases';
import { renderWithProviders } from '../../../../../test/render';
import { MarkReviewedButton } from '../MarkReviewedButton';

describe('MarkReviewedButton', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('marks the case as reviewed when clicked', async () => {
    const user = userEvent.setup();
    const markReviewed = vi.spyOn(caseApi, 'markReviewed').mockResolvedValue(detailedCase);
    renderWithProviders(<MarkReviewedButton caseId="C-100" reviewed={false} />);

    await user.click(screen.getByRole('button', { name: 'Mark as reviewed' }));

    expect(markReviewed).toHaveBeenCalledWith('C-100');
  });

  it('is disabled and says "Reviewed" once the case is reviewed', () => {
    renderWithProviders(<MarkReviewedButton caseId="C-100" reviewed />);

    expect(screen.getByRole('button', { name: 'Reviewed' })).toBeDisabled();
  });

  it('shows the failure, and Retry marks the case as reviewed', async () => {
    const user = userEvent.setup();
    const markReviewed = vi
      .spyOn(caseApi, 'markReviewed')
      .mockRejectedValueOnce(new Error('Network down'))
      .mockResolvedValue(detailedCase);
    renderWithProviders(<MarkReviewedButton caseId="C-100" reviewed={false} />);

    await user.click(screen.getByRole('button', { name: 'Mark as reviewed' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('The case could not be marked as reviewed.');

    await user.click(screen.getByRole('button', { name: 'Retry' }));

    await vi.waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument());
    expect(markReviewed).toHaveBeenCalledTimes(2);
  });
});
