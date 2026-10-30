import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ListSection } from '../ListSection';

describe('ListSection', () => {
  it('shows the title and one list item per entry', () => {
    render(<ListSection title="Symptoms" items={['Fever', 'Cough']} />);

    expect(screen.getByRole('heading', { name: 'Symptoms' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('shows "None recorded" instead of an empty list', () => {
    render(<ListSection title="Symptoms" items={[]} />);

    expect(screen.getByText('None recorded')).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });
});
