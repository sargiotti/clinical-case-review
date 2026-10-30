import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { CaseDetailPage } from './modules/case-detail/CaseDetailPage/CaseDetailPage.tsx';
import { CaseListPage } from './modules/case-list/CaseListPage/CaseListPage.tsx';

const theme = createTheme();

// retry: false so a failed request shows the error state immediately instead of after silent retries.
const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

// createBrowserRouter (not <BrowserRouter>) because the unsaved-changes warning needs useBlocker.
const router = createBrowserRouter([
  { path: '/', element: <CaseListPage /> },
  { path: '/cases/:caseId', element: <CaseDetailPage /> },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
);
