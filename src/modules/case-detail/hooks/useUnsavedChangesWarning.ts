import { useEffect } from 'react';
import { useBlocker } from 'react-router';

export function useUnsavedChangesWarning(when: boolean) {
  const blocker = useBlocker(when);

  useEffect(() => {
    if (!when) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [when]);

  return blocker;
}
