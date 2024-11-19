import type { PluginOption } from 'vite';

import { colors } from '@xpress/node-utils';

export const vitePrintPlugin = (
  infoMap: Record<string, string | undefined> = {},
): PluginOption => {
  return {
    configureServer(server) {
      const _printUrls = server.printUrls;
      server.printUrls = () => {
        _printUrls();
        for (const [key, value] of Object.entries(infoMap)) {
          console.log(
            `  ${colors.green('➜')}  ${colors.bold(key)}: ${colors.cyan(value)}`,
          );
        }
      };
    },
    enforce: 'pre',
    name: 'vite:print-info',
  };
};
