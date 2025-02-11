import '@xpress/styles';

import { createRoot } from 'react-dom/client';

import { history, HistoryRouter } from '#/router';

import App from './App';

const rootElement = document.querySelector('#root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

const root = createRoot(rootElement);

// root.render(<App />);
root.render(
  <HistoryRouter history={history}>
    <App />
  </HistoryRouter>,
);
