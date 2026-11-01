import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { caseApi } from '../../../../../api/case-api';
import { fillAssessmentForm } from '../../../../../test/assessment-form';
import { detailedCase } from '../../../../../test/mock-cases';
import { renderWithProviders } from '../../../../../test/render';
import { AssessmentModal } from '../AssessmentModal';

function renderModal(onClose = vi.fn()) {
  renderWithProviders(<AssessmentModal caseId="C-100" open onClose={onClose} />);
  return onClose;
}

describe('AssessmentModal', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('saves the entered assessment, confirms it inside the modal and removes the form', async () => {
    const user = userEvent.setup();
    const saveAssessment = vi.spyOn(caseApi, 'saveAssessment').mockResolvedValue(detailedCase);
    const onClose = renderModal();

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
    // The form is gone, so the assessment cannot be saved twice.
    expect(screen.queryByRole('button', { name: 'Save assessment' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('closes straight away when nothing was typed, or when it was typed and deleted again', async () => {
    const user = userEvent.setup();
    const onClose = renderModal();

    const field = screen.getByRole('textbox', { name: /Working assessment/ });
    await user.type(field, 'x');
    await user.clear(field);
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onClose).toHaveBeenCalledOnce();
    expect(screen.queryByText('Discard unsaved changes?')).not.toBeInTheDocument();
  });

  it('asks before closing with typed input; Stay keeps it and Discard closes', async () => {
    const user = userEvent.setup();
    const onClose = renderModal();

    await user.type(screen.getByRole('textbox', { name: /Working assessment/ }), 'Pneumonia');
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(await screen.findByText('Discard unsaved changes?')).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Stay' }));
    await waitFor(() => expect(screen.queryByText('Discard unsaved changes?')).not.toBeInTheDocument());
    expect(screen.getByRole('textbox', { name: /Working assessment/ })).toHaveValue('Pneumonia');

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    await user.click(await screen.findByRole('button', { name: 'Discard' }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('shows the failure, keeps what was typed, and Retry saves it', async () => {
    const user = userEvent.setup();
    const saveAssessment = vi
      .spyOn(caseApi, 'saveAssessment')
      .mockRejectedValueOnce(new Error('The assessment could not be saved. Please try again.'))
      .mockResolvedValue(detailedCase);
    renderModal();

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
