import { defineConfig } from 'tsup';

const entry = ['src/index.ts'];

export default defineConfig([
  {
    clean: true,
    dts: true,
    entry,
    format: ['cjs'],
    outDir: 'dist',
  },
]);
