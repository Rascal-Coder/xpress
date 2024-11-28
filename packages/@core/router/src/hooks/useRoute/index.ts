import type { RouteLocation } from '../../core/types';

import { useRouterContext } from '../../context/RouterContext';

export function useRoute(): RouteLocation {
  const { currentRoute } = useRouterContext();
  return currentRoute;
}
