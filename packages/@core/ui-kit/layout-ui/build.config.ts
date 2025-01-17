import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  clean: true,
  declaration: true,
  entries: ['src/index'],
  externals: ['react', 'react-dom', 'react/jsx-runtime'],
  failOnWarn: false,
  rollup: {
    emitCJS: true,
    esbuild: {
      jsx: 'automatic',
      jsxImportSource: 'react',
      minify: true,
      treeShaking: true,
      tsconfigRaw: {
        compilerOptions: {
          jsx: 'react-jsx',
        },
      },
    },
    inlineDependencies: true,
  },
});
