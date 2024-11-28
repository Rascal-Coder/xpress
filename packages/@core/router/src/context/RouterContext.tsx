import type { Router } from '../core/router';
import type { RouteLocation } from '../core/types';

import { createContext, useContext } from 'react';

export interface RouterContextValue {
  currentRoute: RouteLocation;
  router: Router;
}

export const RouterContext = createContext<null | RouterContextValue>(null);

export function useRouterContext() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouterContext must be used within RouterProvider');
  }
  return context;
}
