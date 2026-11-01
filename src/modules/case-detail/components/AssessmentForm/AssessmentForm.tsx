import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useEffect, useState, type FormEvent } from 'react';
import {
  CONFIDENCE_LEVELS,
  NEXT_ACTIONS,
  type AssessmentInput,
  type ConfidenceLevel,
  type NextAction,
} from '../../../../domain/assessment';
import { CONFIDENCE_LABELS, NEXT_ACTION_LABELS } from '../../../../shared/utils/format';

// '' means "not chosen yet": the clinician must pick a confidence and an action, never accept a default.
interface FormValues {
  workingAssessment: string;
  confidence: ConfidenceLevel | '';
  nextAction: NextAction | '';
  notes: string;
  followUpDate: string;
}

interface FormErrors {
  workingAssessment?: string;
  confidence?: string;
  nextAction?: string;
  followUpDate?: string;
}

const EMPTY_VALUES: FormValues = {
  workingAssessment: '',
  confidence: '',
  nextAction: '',
  notes: '',
  followUpDate: '',
};

interface AssessmentFormProps {
  /** Disables the button while a save is in flight, so it cannot be submitted twice. */
  isSaving?: boolean;
  /** Tells the parent whether the form holds anything typed, so it can warn before that is lost. */
  onDirtyChange?: (dirty: boolean) => void;
  onSubmit: (input: AssessmentInput) => void;
}

export function AssessmentForm({ isSaving = false, onDirtyChange, onSubmit }: AssessmentFormProps) {
  const [values, setValues] = useState<FormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});

  // Compared with the empty start, so typing something and deleting it again is not dirty.
  const isDirty =
    values.workingAssessment !== '' ||
    values.confidence !== '' ||
    values.nextAction !== '' ||
    values.notes !== '' ||
    values.followUpDate !== '';

  useEffect(() => onDirtyChange?.(isDirty), [isDirty, onDirtyChange]);

  const needsFollowUp = values.nextAction === 'follow_up' || values.nextAction === 'refer';

  function handleChange(field: keyof FormValues, value: string) {
    setValues({ ...values, [field]: value });
    // An error disappears as soon as that field is edited.
    setErrors({ ...errors, [field]: undefined });
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const today = new Date().toISOString().slice(0, 10);
    const { confidence, nextAction } = values;
    const found: FormErrors = {};

    if (values.workingAssessment.trim() === '') {
      found.workingAssessment = 'Enter a working assessment';
    }
    if (confidence === '') {
      found.confidence = 'Select a confidence level';
    }
    if (nextAction === '') {
      found.nextAction = 'Select a recommended next action';
    }

    if (needsFollowUp) {
      if (!values.followUpDate) {
        found.followUpDate = 'Enter a follow-up date';
      } else if (values.followUpDate < today) {
        found.followUpDate = 'The follow-up date cannot be in the past';
      }
    }

    setErrors(found);
    // The two '' checks also narrow the types for the input below.
    if (Object.keys(found).length > 0 || confidence === '' || nextAction === '') return;

    onSubmit({
      workingAssessment: values.workingAssessment,
      confidence,
      nextAction,
      notes: values.notes,
      followUpDate: needsFollowUp ? values.followUpDate : undefined,
    });
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate aria-label="Clinical assessment">
      <Stack spacing={2}>
        <TextField
          label="Working assessment"
          required
          value={values.workingAssessment}
          onChange={(e) => handleChange('workingAssessment', e.target.value)}
          error={Boolean(errors.workingAssessment)}
          helperText={errors.workingAssessment}
        />
        <TextField
          select
          label="Confidence"
          required
          value={values.confidence}
          onChange={(e) => handleChange('confidence', e.target.value)}
          error={Boolean(errors.confidence)}
          helperText={errors.confidence}
        >
          {CONFIDENCE_LEVELS.map((level) => (
            <MenuItem key={level} value={level}>
              {CONFIDENCE_LABELS[level]}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Recommended next action"
          required
          value={values.nextAction}
          onChange={(e) => handleChange('nextAction', e.target.value)}
          error={Boolean(errors.nextAction)}
          helperText={errors.nextAction}
        >
          {NEXT_ACTIONS.map((action) => (
            <MenuItem key={action} value={action}>
              {NEXT_ACTION_LABELS[action]}
            </MenuItem>
          ))}
        </TextField>
        {needsFollowUp && (
          <TextField
            label="Follow-up date"
            type="date"
            required
            value={values.followUpDate}
            onChange={(e) => handleChange('followUpDate', e.target.value)}
            error={Boolean(errors.followUpDate)}
            helperText={errors.followUpDate}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        )}
        <TextField
          label="Notes"
          multiline
          minRows={3}
          value={values.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
        />
        <Button type="submit" variant="contained" disabled={isSaving} sx={{ alignSelf: 'flex-start' }}>
          {isSaving ? 'Saving…' : 'Save assessment'}
        </Button>
      </Stack>
    </Box>
  );
}
