import { describe, expect, it } from 'vitest';
import { toPatient } from '../patient.mapper';

describe('toPatient', () => {
  it('builds uppercase initials from first and last name and drops the name', () => {
    const patient = toPatient({ firstName: ' laura', lastName: 'martinez ', age: 67, medicalHistory: ['Hypertension'] });

    // toEqual compares the whole object, so it also proves no name field is left over.
    expect(patient).toEqual({ initials: 'LM', age: 67, medicalHistory: ['Hypertension'] });
  });
});
