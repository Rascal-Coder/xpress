import type { Options as PwaPluginOptions } from 'vite-plugin-pwa';

// const isDevelopment = process.env.NODE_ENV === 'development';

const getDefaultPwaOptions = (_name: string): Partial<PwaPluginOptions> => ({
  manifest: {},
});

// /**
//  * importmap CDN 暂时不开启，因为有些包不支持，且网络不稳定
//  */
// const defaultImportmapOptions: ImportmapPluginOptions = {
//   // 通过 Importmap CDN 方式引入,
//   // 目前只有esm.sh源兼容性好一点，jspm.io对于 esm 入口要求高
//   defaultProvider: 'esm.sh',
//   importmap: [{ name: 'react' }, { name: 'react-dom' }, { name: 'dayjs' }],
// };

export { getDefaultPwaOptions };
