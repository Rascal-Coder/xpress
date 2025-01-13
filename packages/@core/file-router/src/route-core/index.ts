import type { ViteDevServer } from 'vite';

import XpressRouter from '../file-core';
import { log } from './log';

export default class XpressReactRouter {
  elegantRouter: XpressRouter;

  options: Record<string, any>;

  viteServer?: ViteDevServer;

  constructor(options: Partial<Record<string, any>> = {}) {
    this.elegantRouter = new XpressRouter(options);

    this.options = options;

    this.generate();
  }

  async generate() {
    // const { entries, files, trees } = this.elegantRouter;
    // console.log('entries', entries);
    // console.log('files', files);
    // console.log('trees', trees);
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
