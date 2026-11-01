import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { chooseOption, fillAssessmentForm } from '../../../../../test/assessment-form';
import { AssessmentForm } from '../AssessmentForm';

const TODAY = '2026-11-05';

describe('AssessmentForm', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(`${TODAY}T10:00:00Z`));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts empty and rejects a submit with the required fields missing', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<AssessmentForm onSubmit={onSubmit} />);

    expect(screen.getByRole('textbox', { name: /Working assessment/ })).toHaveValue('');

    await user.click(screen.getByRole('button', { name: 'Save assessment' }));

    expect(screen.getByRole('textbox', { name: /Working assessment/ })).toBeInvalid();
    expect(screen.getByText('Enter a working assessment')).toBeInTheDocument();
    expect(screen.getByText('Select a confidence level')).toBeInTheDocument();
    expect(screen.getByText('Select a recommended next action')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('asks for a follow-up date only when the next action needs one', async () => {
    const user = userEvent.setup();
    render(<AssessmentForm onSubmit={vi.fn()} />);

    expect(screen.queryByLabelText(/Follow-up date/)).not.toBeInTheDocument();

    await chooseOption(user, /Recommended next action/, 'Follow up');
    expect(screen.getByLabelText(/Follow-up date/)).toBeInTheDocument();

    await chooseOption(user, /Recommended next action/, 'Discharge');
    expect(screen.queryByLabelText(/Follow-up date/)).not.toBeInTheDocument();

    await chooseOption(user, /Recommended next action/, 'Refer');
    expect(screen.getByLabelText(/Follow-up date/)).toBeInTheDocument();
  });

  it('requires the follow-up date, rejects a past date and accepts today', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<AssessmentForm onSubmit={onSubmit} />);
    await fillAssessmentForm(user, 'Follow up');
    const save = screen.getByRole('button', { name: 'Save assessment' });

    await user.click(save);
    expect(screen.getByText('Enter a follow-up date')).toBeInTheDocument();

    await user.type(screen.getByLabelText(/Follow-up date/), '2026-11-04');
    await user.click(save);
    expect(screen.getByText('The follow-up date cannot be in the past')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();

    await user.clear(screen.getByLabelText(/Follow-up date/));
    await user.type(screen.getByLabelText(/Follow-up date/), TODAY);
    await user.click(save);
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it('submits exactly what was entered, without a date when the action does not need one', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<AssessmentForm onSubmit={onSubmit} />);

    await fillAssessmentForm(user, 'Discharge');
    await user.type(screen.getByRole('textbox', { name: 'Notes' }), 'Start antibiotics');
    await user.click(screen.getByRole('button', { name: 'Save assessment' }));

    expect(onSubmit).toHaveBeenCalledWith({
      workingAssessment: 'Pneumonia',
      confidence: 'high',
      nextAction: 'discharge',
      notes: 'Start antibiotics',
      followUpDate: undefined,
    });
  });
});
