import config from '.';

export default {
  plugins: {
    ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {}),
    // Specifying the config is not necessary in most cases, but it is included
    autoprefixer: {},
    'postcss-import': {},
    'postcss-preset-env': {},
    tailwindcss: { config },
    'tailwindcss/nesting': {},
  },
};
