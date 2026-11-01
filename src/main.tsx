import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { CaseDetailPage } from './modules/case-detail/CaseDetailPage/CaseDetailPage.tsx';
import { CaseListPage } from './modules/case-list/CaseListPage/CaseListPage.tsx';
import { ReviewQueuePage } from './modules/review-queue/ReviewQueuePage/ReviewQueuePage.tsx';

const theme = createTheme();

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

const router = createBrowserRouter([
  { path: '/', element: <CaseListPage /> },
  { path: '/cases/:caseId', element: <CaseDetailPage /> },
  { path: '/review', element: <ReviewQueuePage /> },
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
