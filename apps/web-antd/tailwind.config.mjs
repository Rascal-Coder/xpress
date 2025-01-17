import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import baseConfig from '@xpress/tailwind-config';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('tailwindcss').Config} */
export default {
  ...baseConfig,
  content: [
    ...baseConfig.content,
    // resolve(__dirname, './index.html'),
    resolve(__dirname, './src/**/*.{js,ts,jsx,tsx}'),
  ],
};
