import { configDefaults, defineConfig } from 'vitest/config';

// export default defineConfig({
//   // plugins: [Vue(), VueJsx()],
//   test: {
//     environment: 'happy-dom',
//     exclude: [...configDefaults.exclude, '**/e2e/**'],
//   },
// });
export default defineConfig({
  test: {
    environment: 'jsdom',
    exclude: [...configDefaults.exclude, '**/e2e/**'],
    globals: true,
  },
});
