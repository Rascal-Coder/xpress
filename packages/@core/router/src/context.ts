import type { RouteConfig } from './index';

import { createContext, useContext } from 'react';

interface MetaContextValue {
  currentRoute?: RouteConfig;
  isLoading: boolean;
  routes: RouteConfig[];
}

export const MetaContext = createContext<MetaContextValue>({
  isLoading: false,
  routes: [],
});

export const useMetaContext = () => useContext(MetaContext);
