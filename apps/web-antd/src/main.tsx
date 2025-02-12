import '@xpress/styles';
import { PreferencesProvider } from '@xpress-core/preferences';

import { createRoot } from 'react-dom/client';

import { history, HistoryRouter } from '#/router';

import App from './App';
import { overridesPreferences } from './preferences';

const rootElement = document.querySelector('#root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

const root = createRoot(rootElement);
const env = import.meta.env.PROD ? 'prod' : 'dev';
const appVersion = import.meta.env.VITE_APP_VERSION;
const namespace = `${import.meta.env.VITE_APP_NAMESPACE}-${appVersion}-${env}`;
root.render(
  <HistoryRouter history={history}>
    <PreferencesProvider
      options={{ namespace, overrides: overridesPreferences }}
    >
      <App />
    </PreferencesProvider>
  </HistoryRouter>,
);
