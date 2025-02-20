import type { BrowserHistory } from 'history';

import { useLayoutEffect, useState } from 'react';
import { Router } from 'react-router-dom';

export interface HistoryRouterProps {
  basename?: string;
  children?: React.ReactNode;
  history: BrowserHistory;
}

export default function HistoryRouter({
  basename,
  history,
  children,
}: HistoryRouterProps) {
  const [state, setState] = useState({
    action: history.action,
    location: history.location,
  });

  useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router
      basename={basename}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    >
      {children}
    </Router>
  );
}
