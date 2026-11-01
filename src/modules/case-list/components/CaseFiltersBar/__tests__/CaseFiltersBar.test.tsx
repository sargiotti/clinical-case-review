import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '../../../../../test/render';
import { CaseFiltersBar } from '../CaseFiltersBar';

describe('CaseFiltersBar', () => {
  it('shows the filters stored in the URL', () => {
    renderWithProviders(<CaseFiltersBar />, '/?search=lm&status=open&priority=urgent');

    expect(screen.getByRole('searchbox', { name: 'Search by case ID or initials' })).toHaveValue('lm');
    expect(screen.getByRole('combobox', { name: /status/i })).toHaveTextContent('Open');
    expect(screen.getByRole('combobox', { name: /priority/i })).toHaveTextContent('Urgent');
  });

  it('writes the search text to the URL as the user types', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CaseFiltersBar />);

    await user.type(screen.getByRole('searchbox', { name: 'Search by case ID or initials' }), 'c-00');

    expect(screen.getByTestId('location')).toHaveTextContent('/?search=c-00');
  });

  it('writes the chosen status to the URL', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CaseFiltersBar />);

    await user.click(screen.getByRole('combobox', { name: /status/i }));
    await user.click(screen.getByRole('option', { name: 'Assessed' }));

    expect(screen.getByTestId('location')).toHaveTextContent('/?status=assessed');
  });

  it('removes the status from the URL when "All" is chosen', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CaseFiltersBar />, '/?status=open');

    await user.click(screen.getByRole('combobox', { name: /status/i }));
    await user.click(screen.getByRole('option', { name: 'All' }));

    expect(screen.getByTestId('location')).toHaveTextContent(/^\/$/);
  });
});
