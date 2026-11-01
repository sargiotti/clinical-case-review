import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Assessment } from '../../../../../domain/assessment';
import { AssessmentSummary } from '../AssessmentSummary';

const assessment: Assessment = {
  workingAssessment: 'Community-acquired pneumonia',
  confidence: 'high',
  nextAction: 'follow_up',
  followUpDate: '2026-11-12',
  notes: 'Start antibiotics',
  savedAt: '2026-10-28T12:00:00Z',
};

// The value shown next to a label in the description list.
function getValue(label: string) {
  return screen.getByText(label).nextElementSibling;
}

describe('AssessmentSummary', () => {
  it('shows every field of the saved assessment', () => {
    render(<AssessmentSummary assessment={assessment} />);

    expect(getValue('Working assessment')).toHaveTextContent('Community-acquired pneumonia');
    expect(getValue('Confidence')).toHaveTextContent('High');
    expect(getValue('Next action')).toHaveTextContent('Follow up');
    expect(getValue('Follow-up date')).toHaveTextContent('12 Nov 2026');
    expect(getValue('Notes')).toHaveTextContent('Start antibiotics');
    expect(getValue('Saved')).toBeInTheDocument();
  });

  it('leaves out the follow-up date when there is none, and says when there are no notes', () => {
    render(<AssessmentSummary assessment={{ ...assessment, nextAction: 'discharge', followUpDate: undefined, notes: '' }} />);

    expect(screen.queryByText('Follow-up date')).not.toBeInTheDocument();
    expect(getValue('Notes')).toHaveTextContent('None');
  });

  it('shows "None recorded" when the case has no assessment', () => {
    render(<AssessmentSummary />);

    expect(screen.getByRole('heading', { name: 'Latest assessment' })).toBeInTheDocument();
    expect(screen.getByText('None recorded')).toBeInTheDocument();
  });
});
