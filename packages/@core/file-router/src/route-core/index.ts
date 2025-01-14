import type { ViteDevServer } from 'vite';

import type { XpressRouterOption } from '../file-core/types';

import XpressRouter from '../file-core';
import {
  genConstFile,
  genDtsFile,
  genImportsFile,
  genTransformFile,
} from './generate';
import { log } from './log';

export default class XpressReactRouter {
  options: XpressRouterOption;

  viteServer?: ViteDevServer;

  xpressRouter: XpressRouter;

  constructor(options: Partial<XpressRouterOption> = {}) {
    this.xpressRouter = new XpressRouter(options);
    this.options = this.xpressRouter.options;
    this.generate();
  }

  async generate() {
    const { entries, files, trees } = this.xpressRouter;
    log('开始生成路由文件...', 'info', this.options.log);

    await genTransformFile(this.options, entries);
    await genDtsFile(files, entries, this.options);
    await genImportsFile(files, this.options);
    await genConstFile(trees, this.options);

    log('路由文件生成完成', 'success', this.options.log);
  }

  reloadViteServer() {
    this.viteServer?.ws?.send({ path: '*', type: 'full-reload' });
  }

  setupFSWatcher() {
    this.xpressRouter.setupFSWatcher(async () => {
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
    this.xpressRouter.stopFSWatcher();
  }
}
