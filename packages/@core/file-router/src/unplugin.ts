import type { ElegantConstRoute, ElegantReactRouterOption } from './types';

import { createUnplugin } from 'unplugin';

import ElegantReactRouter from './route-core';

export default createUnplugin<Partial<ElegantReactRouterOption> | undefined>(
  (options) => {
    const ctx = new ElegantReactRouter(options);

    return [
      {
        enforce: 'pre',
        name: 'react-auto-route',
        vite: {
          apply: 'serve',
          configResolved() {
            ctx.setupFSWatcher();
          },
          configureServer(server) {
            ctx.setViteServer(server);
          },
        },
      },
    ];
  },
);

export type { ElegantConstRoute, ElegantReactRouterOption };
