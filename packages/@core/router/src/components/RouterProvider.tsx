import type { RouterOptions } from '../core/types';

import React, { useEffect, useState } from 'react';
import { RouterProvider as ReactRouterProvider } from 'react-router-dom';

import { Router } from '../core/router';

interface RouterProviderProps {
  options: RouterOptions;
}

const FUTURE_FLAGS = {
  v7_fetcherPersist: true,
  v7_normalizeFormMethod: true,
  v7_partialHydration: true,
  v7_relativeSplatPath: true,
  v7_skipActionErrorRevalidation: true,
  v7_startTransition: true,
} as const;

export function RouterProvider({ options }: RouterProviderProps) {
  const [router] = useState(() => new Router(options));
  const [reactRouter] = useState(() => router.createRouter());

  useEffect(() => {
    router.history = reactRouter.navigate;
  }, [router, reactRouter]);

  return <ReactRouterProvider future={FUTURE_FLAGS} router={reactRouter} />;
}
