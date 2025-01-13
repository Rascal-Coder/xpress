import type { ViteDevServer } from 'vite';

import type { ElegantReactRouterOption } from '../types';

import ElegantRouter from '../core';
import { genConstFile } from './const';
import { genDtsFile } from './dts';
import { genImportsFile } from './imports';
import { log } from './log';
import { createPluginOptions } from './options';
import { genTransformFile } from './transform';

export default class ElegantReactRouter {
  elegantRouter: ElegantRouter;

  options: ElegantReactRouterOption;

  viteServer?: ViteDevServer;

  constructor(options: Partial<ElegantReactRouterOption> = {}) {
    this.elegantRouter = new ElegantRouter(options);

    this.options = createPluginOptions(this.elegantRouter.options, options);

    this.generate();
  }

  async generate() {
    const { entries, files, trees } = this.elegantRouter;

    genTransformFile(this.options, entries);
    await genDtsFile(files, entries, this.options);
    await genImportsFile(files, this.options);
    await genConstFile(trees, this.options);
  }

  reloadViteServer() {
    this.viteServer?.ws?.send({ path: '*', type: 'full-reload' });
  }

  setupFSWatcher() {
    this.elegantRouter.setupFSWatcher(async () => {
      log(
        'The pages changed, regenerating the dts file and routes...',
        'info',
        this.options.log,
      );

      await this.generate();

      log(
        'The dts file and routes have been regenerated successfully',
        'success',
        this.options.log,
      );

      this.reloadViteServer();
    });
  }

  setViteServer(server: ViteDevServer) {
    this.viteServer = server;
  }

  stopFSWatcher() {
    this.elegantRouter.stopFSWatcher();
  }
}
