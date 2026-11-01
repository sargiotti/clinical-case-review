import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { detailedCase } from '../../../../../test/mock-cases';
import { CaseTimeline } from '../CaseTimeline';

describe('CaseTimeline', () => {
  it('lists the events in date order, whatever order they arrive in', () => {
    render(<CaseTimeline events={detailedCase.timeline} />);

    const events = screen.getAllByText(/Test ordered|Result received|Assessment saved/);

    expect(events).toHaveLength(3);
    expect(events[0]).toHaveTextContent('Test ordered');
    expect(events[1]).toHaveTextContent('Result received');
    expect(events[2]).toHaveTextContent('Assessment saved');
  });

  it('shows "None recorded" when there are no events', () => {
    render(<CaseTimeline events={[]} />);

    expect(screen.getByText('None recorded')).toBeInTheDocument();
  });
});
