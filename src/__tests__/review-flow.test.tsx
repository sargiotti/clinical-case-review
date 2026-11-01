import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { caseApi } from '../api/case-api';
import type { PatientCase } from '../domain/case';
import { CaseDetailPage } from '../modules/case-detail/CaseDetailPage/CaseDetailPage';
import { CaseListPage } from '../modules/case-list/CaseListPage/CaseListPage';
import { ReviewQueuePage } from '../modules/review-queue/ReviewQueuePage/ReviewQueuePage';
import { criticalLabCase, lowConfidenceCase } from '../test/mock-cases';
import { renderWithProviders } from '../test/render';

// Three pages sharing one query cache, like the app. Only the API is replaced, by a tiny in-memory version.
describe('marking a case as reviewed', () => {
  let cases: PatientCase[];

  beforeEach(() => {
    cases = [criticalLabCase, lowConfidenceCase];
    vi.spyOn(caseApi, 'getCases').mockImplementation(async () => cases);
    vi.spyOn(caseApi, 'getCase').mockImplementation(async (id) => cases.find((c) => c.id === id)!);
    vi.spyOn(caseApi, 'markReviewed').mockImplementation(async (id) => {
      cases = cases.map((c) => (c.id === id ? { ...c, status: 'reviewed' as const } : c));
      return cases.find((c) => c.id === id)!;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows in the case detail, the list and the review queue', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Routes>
        <Route path="/" element={<CaseListPage />} />
        <Route path="/cases/:caseId" element={<CaseDetailPage />} />
        <Route path="/review" element={<ReviewQueuePage />} />
      </Routes>,
      '/cases/C-005',
    );

    // Detail: the button changes.
    await user.click(await screen.findByRole('button', { name: 'Mark as reviewed' }));
    expect(await screen.findByRole('button', { name: 'Reviewed' })).toBeDisabled();

    // List: the row says Reviewed.
    await user.click(screen.getByRole('link', { name: '← Back to cases' }));
    const row = await screen.findByRole('row', { name: /C-005/ });
    expect(within(row).getByText('Reviewed')).toBeInTheDocument();

    // Review queue: the case is gone, and the other one is still there.
    await user.click(screen.getByRole('link', { name: 'Review queue' }));
    const queue = await screen.findByRole('table', { name: 'Cases needing review' });
    expect(within(queue).queryByRole('link', { name: 'C-005' })).not.toBeInTheDocument();
    expect(within(queue).getByRole('link', { name: 'C-006' })).toBeInTheDocument();
  });
});
