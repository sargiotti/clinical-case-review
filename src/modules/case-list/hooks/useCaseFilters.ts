import { useSearchParams } from 'react-router';
import type { CaseFilters } from '../utils/filter-cases';

export function useCaseFilters() {
  const [params, setParams] = useSearchParams();

  const filters: CaseFilters = {
    search: params.get('search') ?? '',
    status: params.get('status') ?? '',
    priority: params.get('priority') ?? '',
  };

  function setFilter(key: keyof CaseFilters, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  }

  function clearFilters() {
    setParams({}, { replace: true });
  }

  return { filters, setFilter, clearFilters };
}
