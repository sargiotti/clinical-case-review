import { useEffect } from 'react';
import { useBlocker } from 'react-router';

/** While `when` is true, warns before leaving: in-app navigation (including Back) and closing the tab. */
export function useUnsavedChangesWarning(when: boolean) {
  // Returns a blocker the caller renders a confirmation for (proceed / reset).
  const blocker = useBlocker(when);

  useEffect(() => {
    if (!when) return;
    // The browser shows its own generic message; the text cannot be customised.
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [when]);

  return blocker;
}
