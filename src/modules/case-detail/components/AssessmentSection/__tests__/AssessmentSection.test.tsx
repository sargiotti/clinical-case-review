import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { caseApi } from '../../../../../api/case-api';
import { fillAssessmentForm } from '../../../../../test/assessment-form';
import { detailedCase } from '../../../../../test/mock-cases';
import { renderWithProviders } from '../../../../../test/render';
import { AssessmentSection } from '../AssessmentSection';

describe('AssessmentSection', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('saves the entered assessment and confirms it', async () => {
    const user = userEvent.setup();
    const saveAssessment = vi.spyOn(caseApi, 'saveAssessment').mockResolvedValue(detailedCase);
    renderWithProviders(<AssessmentSection caseId="C-100" />);

    await fillAssessmentForm(user);
    await user.click(screen.getByRole('button', { name: 'Save assessment' }));

    expect(await screen.findByRole('status')).toHaveTextContent('Assessment saved.');
    expect(saveAssessment).toHaveBeenCalledWith('C-100', {
      workingAssessment: 'Pneumonia',
      confidence: 'high',
      nextAction: 'discharge',
      notes: '',
      followUpDate: undefined,
    });
  });

  it('shows the failure, keeps what was typed, and Retry saves it', async () => {
    const user = userEvent.setup();
    const saveAssessment = vi
      .spyOn(caseApi, 'saveAssessment')
      .mockRejectedValueOnce(new Error('The assessment could not be saved. Please try again.'))
      .mockResolvedValue(detailedCase);
    renderWithProviders(<AssessmentSection caseId="C-100" />);

    await fillAssessmentForm(user);
    await user.type(screen.getByRole('textbox', { name: 'Notes' }), 'FAIL please');
    await user.click(screen.getByRole('button', { name: 'Save assessment' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('The assessment could not be saved. Please try again.');
    expect(screen.getByRole('textbox', { name: 'Notes' })).toHaveValue('FAIL please');

    await user.click(screen.getByRole('button', { name: 'Retry' }));

    expect(await screen.findByRole('status')).toHaveTextContent('Assessment saved.');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    // Retry sent the same input again.
    expect(saveAssessment).toHaveBeenCalledTimes(2);
    expect(saveAssessment).toHaveBeenLastCalledWith('C-100', expect.objectContaining({ notes: 'FAIL please' }));
  });
});
