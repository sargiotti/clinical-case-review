import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Without globals, Testing Library cannot register its own cleanup, so unmount rendered components after each test.
afterEach(() => {
  cleanup();
});
