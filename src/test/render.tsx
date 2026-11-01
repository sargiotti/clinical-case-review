import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { createMemoryRouter, RouterProvider, useLocation } from 'react-router';

// Prints the current URL so tests can assert on what ends up in the address bar.
function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname + location.search}</div>;
}

/**
 * Renders a component with the providers the app gives it: a fresh query cache per test
 * (so tests never share data) and an in-memory router starting at `route`.
 * A data router, like the app's, because useBlocker does not work without one.
 */
export function renderWithProviders(ui: ReactElement, route = '/') {
  // retry: false, same as the app, so a failed request shows the error state immediately.
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  // One catch-all route, so the component (or its own <Routes>) decides what matches.
  const router = createMemoryRouter(
    [
      {
        path: '*',
        element: (
          <>
            {ui}
            <LocationDisplay />
          </>
        ),
      },
    ],
    { initialEntries: [route] },
  );

  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}
