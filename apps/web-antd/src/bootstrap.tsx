import { history, HistoryRouter } from '@xpress/router';
import {
  type PreferenceManager,
  type Preferences,
  PreferencesProvider,
} from '@xpress-core/preferences';

import { ThemeProvider } from '@mui/material';
import { createRoot } from 'react-dom/client';

import App from './App';
import { theme } from './constants/adapter';

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
    <HistoryRouter history={history}>
      <PreferencesProvider
        initialPreferences={initialPreferences}
        preferenceManager={preferenceManager}
      >
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </PreferencesProvider>
    </HistoryRouter>,
  );
};
