import {
  type PreferenceManager,
  type Preferences,
  PreferencesProvider,
} from '@xpress-core/preferences';
import { history, HistoryRouter } from '@xpress-core/router';

import { ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';

import App from './App';
import { theme } from './constants/adapter';

// 创建 QueryClient 实例
const queryClient = new QueryClient();

export const bootstrap = ({
  initialPreferences,
  preferenceManager,
}: {
  initialPreferences: Preferences;
  preferenceManager: PreferenceManager;
}) => {
  const rootElement = document.querySelector('#root');
  if (!rootElement) {
    throw new Error('Failed to find the root element');
  }

  const root = createRoot(rootElement);

  root.render(
    <QueryClientProvider client={queryClient}>
      <HistoryRouter history={history}>
        <PreferencesProvider
          initialPreferences={initialPreferences}
          preferenceManager={preferenceManager}
        >
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </PreferencesProvider>
      </HistoryRouter>
    </QueryClientProvider>,
  );
};
