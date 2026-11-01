import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { caseApi } from '../../../../api/case-api';
import { fillAssessmentForm } from '../../../../test/assessment-form';
import { detailedCase } from '../../../../test/mock-cases';
import { renderWithProviders } from '../../../../test/render';
import { CaseDetailPage } from '../CaseDetailPage';

function renderPage() {
  return renderWithProviders(
    <Routes>
      <Route path="/" element={<p>Cases home</p>} />
      <Route path="/cases/:caseId" element={<CaseDetailPage />} />
    </Routes>,
    `/cases/${detailedCase.id}`,
  );
}

describe('CaseDetailPage', () => {
  beforeEach(() => {
    vi.spyOn(caseApi, 'getCase').mockResolvedValue(detailedCase);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows a loading indicator, then the patient, symptoms and medical history', async () => {
    renderPage();

    expect(screen.getByRole('progressbar', { name: 'Loading case' })).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'Patient' })).toBeInTheDocument();

    expect(screen.getByRole('heading', { name: 'Case C-100', level: 1 })).toBeInTheDocument();
    expect(screen.getByText('AB')).toBeInTheDocument();
    expect(screen.getByText('61')).toBeInTheDocument();
    expect(screen.getByText('Palpitations')).toBeInTheDocument();
    expect(screen.getByText('Hypertension')).toBeInTheDocument();
  });

  it('shows the status and priority next to the actions', async () => {
    renderPage();

    await screen.findByRole('heading', { name: 'Patient' });

    expect(screen.getByText('Open')).toBeInTheDocument();
    expect(screen.getByText('Urgent')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add assessment' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mark as reviewed' })).toBeInTheDocument();
  });

  it('shows every section of the case', async () => {
    renderPage();

    for (const name of ['Patient', 'Symptoms', 'Medical history', 'Laboratory results', 'Imaging reports', 'Latest assessment', 'Timeline']) {
      expect(await screen.findByRole('heading', { name, level: 2 })).toBeInTheDocument();
    }
  });

  it('shows the new timeline event after an assessment is saved', async () => {
    const user = userEvent.setup();
    const updatedCase = {
      ...detailedCase,
      status: 'assessed' as const,
      timeline: [
        ...detailedCase.timeline,
        { id: 'E4', type: 'assessment_saved' as const, at: '2026-10-29T08:00:00Z', description: 'Assessment saved' },
      ],
    };
    vi.spyOn(caseApi, 'getCase').mockResolvedValueOnce(detailedCase).mockResolvedValue(updatedCase);
    vi.spyOn(caseApi, 'saveAssessment').mockResolvedValue(updatedCase);
    renderPage();

    await screen.findByRole('heading', { name: 'Timeline' });
    expect(screen.getAllByText('Assessment saved')).toHaveLength(1);

    await user.click(screen.getByRole('button', { name: 'Add assessment' }));
    await fillAssessmentForm(user, 'Follow up');
    await user.type(screen.getByLabelText(/Follow-up date/), '2999-01-01');
    await user.click(screen.getByRole('button', { name: 'Save assessment' }));

    await waitFor(() => expect(screen.getAllByText('Assessment saved')).toHaveLength(2));
  });

  it('warns before leaving the page with an unsaved assessment; Stay keeps it, Discard leaves', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByRole('heading', { name: 'Patient' });

    await user.click(screen.getByRole('button', { name: 'Add assessment' }));
    await user.type(screen.getByRole('textbox', { name: /Working assessment/ }), 'Pneumonia');
    await user.click(screen.getByText('← Back to cases'));

    expect(await screen.findByText('Discard unsaved changes?')).toBeInTheDocument();
    expect(screen.getByTestId('location')).toHaveTextContent('/cases/C-100');

    await user.click(screen.getByRole('button', { name: 'Stay' }));
    expect(screen.getByTestId('location')).toHaveTextContent('/cases/C-100');
    expect(await screen.findByRole('textbox', { name: /Working assessment/ })).toHaveValue('Pneumonia');

    await user.click(screen.getByText('← Back to cases'));
    await user.click(await screen.findByRole('button', { name: 'Discard' }));
    expect(await screen.findByText('Cases home')).toBeInTheDocument();
    expect(screen.getByTestId('location')).toHaveTextContent(/^\/$/);
  });

  it('leaves the page without a warning when nothing was typed', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByRole('heading', { name: 'Patient' });

    await user.click(screen.getByRole('link', { name: '← Back to cases' }));

    expect(await screen.findByText('Cases home')).toBeInTheDocument();
    expect(screen.queryByText('Discard unsaved changes?')).not.toBeInTheDocument();
  });

  it('shows an error when the case cannot be loaded, and Retry loads it', async () => {
    const user = userEvent.setup();
    vi.spyOn(caseApi, 'getCase').mockRejectedValueOnce(new Error('Case C-100 not found'));
    renderPage();

    expect(await screen.findByRole('alert')).toHaveTextContent('The case could not be loaded.');

    await user.click(screen.getByRole('button', { name: 'Retry' }));

    expect(await screen.findByRole('heading', { name: 'Patient' })).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
