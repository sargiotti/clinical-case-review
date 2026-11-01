import { describe, expect, it } from 'vitest';
import { mediumOpenCase, mockCases, urgentOpenCase } from '../../../../test/mock-cases';
import { filterCases } from '../filter-cases';

const noFilters = { search: '', status: '', priority: '' };

describe('filterCases', () => {
  it('returns every case when no filters are set', () => {
    expect(filterCases(mockCases, noFilters)).toEqual(mockCases);
  });

  it('matches the case ID regardless of letter case', () => {
    expect(filterCases(mockCases, { ...noFilters, search: 'c-001' })).toEqual([urgentOpenCase]);
  });

  it('matches initials and ignores surrounding spaces', () => {
    expect(filterCases(mockCases, { ...noFilters, search: '  lm ' })).toEqual([urgentOpenCase]);
  });

  it('combines status, priority and search', () => {
    expect(filterCases(mockCases, { search: '', status: 'open', priority: 'urgent' })).toEqual([urgentOpenCase]);
    expect(filterCases(mockCases, { search: 'jo', status: 'open', priority: '' })).toEqual([mediumOpenCase]);
  });

  it('returns an empty list when nothing matches', () => {
    expect(filterCases(mockCases, { search: '', status: 'reviewed', priority: 'urgent' })).toEqual([]);
  });
});
