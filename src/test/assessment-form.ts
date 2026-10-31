import { screen } from '@testing-library/react';
import type userEvent from '@testing-library/user-event';

type User = ReturnType<typeof userEvent.setup>;

/** Opens a select by its label and picks one option. */
export async function chooseOption(user: User, select: RegExp, option: string) {
  await user.click(screen.getByRole('combobox', { name: select }));
  await user.click(screen.getByRole('option', { name: option }));
}

/** Fills the required fields of the assessment form. Discharge needs no follow-up date. */
export async function fillAssessmentForm(user: User, nextAction = 'Discharge') {
  await user.type(screen.getByRole('textbox', { name: /Working assessment/ }), 'Pneumonia');
  await chooseOption(user, /Confidence/, 'High');
  await chooseOption(user, /Recommended next action/, nextAction);
}
