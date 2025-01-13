import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  clean: true,
  declaration: true,
  entries: ['src/index', 'src/vite'],
  externals: ['vite', 'react-router-dom'],
  rollup: {
    emitCJS: true,
    esbuild: {
      minify: true,
    },
    inlineDependencies: true,
  },
});
