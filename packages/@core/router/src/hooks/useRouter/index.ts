import type { Router } from '../../core/router';

import { useRouterContext } from '../../context/RouterContext';

export function useRouter(): Router {
  const { router } = useRouterContext();
  return router;
}
