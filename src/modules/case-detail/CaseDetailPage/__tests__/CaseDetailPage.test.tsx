import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { caseApi } from '../../../../api/case-api';
import { detailedCase } from '../../../../test/mock-cases';
import { renderWithProviders } from '../../../../test/render';
import { CaseDetailPage } from '../CaseDetailPage';

// useParams only works inside a matching route, so the page is rendered under its real path.
function renderPage() {
  return renderWithProviders(
    <Routes>
      <Route path="/cases/:caseId" element={<CaseDetailPage />} />
    </Routes>,
    `/cases/${detailedCase.id}`,
  );
}

describe('CaseDetailPage', () => {
  beforeEach(() => {
    // Replaces the API call with deterministic data: no delay, no localStorage.
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

  it('shows every section of the case', async () => {
    renderPage();

    // The sections have their own tests; this proves each one is actually on the page.
    for (const name of ['Patient', 'Symptoms', 'Medical history', 'Laboratory results', 'Imaging reports', 'Timeline']) {
      expect(await screen.findByRole('heading', { name, level: 2 })).toBeInTheDocument();
    }
  });

  it('shows an error when the case cannot be loaded, and Retry loads it', async () => {
    const user = userEvent.setup();
    // The first call fails; later calls use the default success from beforeEach.
    vi.spyOn(caseApi, 'getCase').mockRejectedValueOnce(new Error('Case C-100 not found'));
    renderPage();

    expect(await screen.findByRole('alert')).toHaveTextContent('The case could not be loaded.');

    await user.click(screen.getByRole('button', { name: 'Retry' }));

    expect(await screen.findByRole('heading', { name: 'Patient' })).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
